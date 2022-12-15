const fs = require("fs").promises;
const BASE_URL = "http://localhost:3000/title/";
const axios = require("axios");

async function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function getSeries() {
  var allreadyAdded = [];
  const addedSeries = await fs.readFile("./seriesAdded.csv", "utf8");
  addedSeries.split("\n").forEach((element) => {
    allreadyAdded.push(element);
  });
  allreadyAdded === undefined
    ? (allreadyAdded = [])
    : (allreadyAdded = allreadyAdded);
  const seriesList = await fs.readFile("./seriesList.json", "utf8");
  const series = JSON.parse(seriesList);

  var count = 0;
  const seriesLength = series.length;
  console.log("Series length: " + seriesLength);

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
      var seriesInfo = await fs.readFile("./seriesInfo.json", "utf8");

      seriesInfo.length === 0
        ? (seriesInfo = [])
        : (seriesInfo = JSON.parse(seriesInfo));
      const { data } = await axios.get(url);
      // verify if the series is already in the file and remove it

      data.releaseDate = serie.releaseDate;
      data.isFinished = serie.isFinished;
      data.lastUpdated = new Date().getTime();
      // if (data.trailerYtId === undefined) {
      data.trailerYtId = serie.trailerYtId || null;
      //}
      const index = seriesInfo.findIndex(
        (element) => element.id == serie.imdbId
      );
      // to avoid duplicates in the file remove the old id if it exists and add the new one
      if (index !== -1) {
        await seriesInfo.splice(index, 1);
      }

      seriesInfo.push(data);
      await fs.writeFile("./seriesInfo.json", JSON.stringify(seriesInfo));

      // add the serie to the list of added series and write it to the csv file

      if (!allreadyAdded.includes(serie.imdbId)) {
        allreadyAdded.push(serie.imdbId);
        await fs.writeFile("./seriesAdded.csv", allreadyAdded.join("\n"));
      }
    } catch (error) {
      console.log(error);
      await wait(10 * 1000);
    }
  }
}

getSeries();
