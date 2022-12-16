// add run time to the series

var seriesInfo = "../datasets/series/seriesInfo.json";
var datasets = "../datasets/title.csv";
var fs = require("fs");
function getRunTime() {
  // verify if datasets exist else exit
  if (!fs.existsSync(datasets)) {
    console.log("file not found" + datasets);
    process.exit(1);
  }

  // read datasets and convert it to an array of json objects
  var data = fs.readFileSync(datasets, "utf8");
  data = data.split("\n").map((line) => {
    var columns = line.split(",");
    return {
      tconst: columns[0],
      runtimeMinutes: columns[1],
    };
  });

  // remove the first element of the array
  data.shift();

  data = data.filter((item) => {
    return item.runtimeMinutes !== "\\N";
  });

  var series = JSON.parse(fs.readFileSync(seriesInfo, "utf8"));

  series.forEach((item) => {
    let foundRunTime = data.find((d) => d.tconst === item.imdbId);
    if (foundRunTime) {
      item.runTime = foundRunTime.runtimeMinutes;
    } else {
      // find the average of each episode in the season and add it to the series run time

      if (item.seasons) {
        item.seasons.forEach((season) => {
          if (season.episodes) {
            //console.log(JSON.stringify(season.episodes));
            season.episodes.forEach((episode) => {
              // find the episode in the  data
              var found = data.find((item) => {
                return item.tconst === episode.imdbId;
              });
              if (found) {
                episode.runtimeMinutes = found.runtimeMinutes;
              }
            });
          }
        });
      }
    }

    // average  run time of each episode is the run time of the series

    /**
     * 1. find the average of each episode in the season and add it to the series run time
     * 2. find the average of each season in the series and add it to the series run time
     * 3. find the average of each series and add it to the series run time
     */
    // this code sucks but i'm to dumb to fix it, so i'm leaving it here
    if (item.seasons) {
      item.seasons.forEach((season) => {
        if (season.episodes) {
          let total = 0;
          let count = 0;
          season.episodes.forEach((episode) => {
            if (episode.runtimeMinutes) {
              total += parseInt(episode.runtimeMinutes);
              count++;
            }
          });
          season.runTime = Math.round(total / count);
          console.log("season run time", season.runTime);
        }
      });
    }

    // average  run time of each season is the run time of the series
    if (item.seasons) {
      let total = 0;
      let count = 0;
      item.seasons.forEach((season) => {
        if (season.runTime) {
          total += parseInt(season.runTime);
          count++;
        }
      });
      item.runTime = Math.round(total / count);
      console.log("series run time", item.runTime);
    }

    // write the series info to the file
    fs.writeFileSync(seriesInfo, JSON.stringify(series, null, 2));
  });
}

getRunTime();
