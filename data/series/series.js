const fs = require("fs").promises;
const BASE_URL = "http://localhost:3000/title/";
const dotenv = require("dotenv");
const sendMail = require("../sendEmail.js");
const axios = require("axios");
const seriesInfoPath = "../datasets/series/seriesInfo.json";
const seriesListPath = "../datasets/series/seriesList.json";
dotenv.config({ path: "../../.env" });

var errorCounter = 0;
async function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function getSeries() {
  //verfiy if seriesList exists (if not, create it with [] value)
  try {
    try {
      await fs.access(seriesInfoPath);
    } catch (err) {
      await fs.writeFile(seriesInfoPath, "[]");
    }

    const seriesList = await fs.readFile(seriesListPath, "utf8");
    const series = JSON.parse(seriesList);

    var seriesInfo = await fs.readFile(seriesInfoPath, "utf8");
    seriesInfo = JSON.parse(seriesInfo);
    var allreadyAdded = seriesInfo.map((serie) => serie.imdbId);

    var count = 0;
    const seriesLength = series.length;
    console.log("Series length: " + seriesLength);
    console.log("Series already added: " + allreadyAdded.length);

    for (const serie of series) {
      count++;
      if (allreadyAdded.includes(serie.imdbId)) {
        const currentDate = new Date().getTime();
        //  if serie is newer than 3 months or finished do nothing
        const threeMonths = serie.lastUpdated + 1000 * 60 * 60 * 24 * 30 * 3;
        const serieIsNewerThanThreeMonths = currentDate < threeMonths;

        if (serie.isFinished || serieIsNewerThanThreeMonths) {
          console.log("Serie is already added: " + serie.imdbId);
          continue;
        }
      }
      console.log("Count: " + count + " / " + seriesLength);
      const url = BASE_URL + serie.imdbId;

      try {
        //var seriesInfo = await fs.readFile("./seriesInfo.json", "utf8");

        seriesInfo.length <= 1 ? (seriesInfo = []) : (seriesInfo = seriesInfo);
        const { data } = await axios.get(url);
        // verify if the series is already in the file and remove it

        data.releaseDate = serie.releaseDate;
        data.isFinished = serie.isFinished;
        data.lastUpdated = new Date().getTime();
        // if (data.trailerYtId === undefined) {
        data.trailerYtId = serie.trailerYtId || null;
        //}
        const index = seriesInfo.findIndex(
          (element) => element.imdbId == serie.imdbId
        );
        // to avoid duplicates in the file remove the old id if it exists and add the new one
        if (index !== -1) {
          await seriesInfo.splice(index, 1);
        }

        seriesInfo.push(data);
        await fs.writeFile(seriesInfoPath, JSON.stringify(seriesInfo));

        // add the serie to the list of added series and write it to the csv file

        if (!allreadyAdded.includes(serie.imdbId)) {
          allreadyAdded.push(serie.imdbId);
          //await fs.writeFile("./seriesAdded.csv", allreadyAdded.join("\n"));
        }
      } catch (error) {
        console.log(error);
        await wait(10 * 1000);
      }
    }
  } catch (error) {
    console.log(error);

    errorCounter++;
    if (errorCounter > 7) {
      console.log("Too many errors, exiting");
      process.exit(1);
    }
    await sendMail("series.js", error);
    await getSeries();
  }
}

getSeries();
