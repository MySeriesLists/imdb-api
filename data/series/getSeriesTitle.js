const puppeteer = require("puppeteer");
const fs = require("fs");
let browser = "";
(async () => {
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //await page.goto('https://www.imdb.com/search/title/?title_type=tv_series&start=0&view=advanced');
    let i = 0;
    var resultData = [];
    while (i <= 50) {
      await page.goto(
        `https://www.imdb.com/search/title/?title_type=tv_series&start=${i}&view=advanced`
      );
      const result = await page.evaluate(() => {
        let elements = document.querySelectorAll(".lister-item");
        let data = [];
        for (var element of elements) {
          const lastUpdated = new Date().getTime();
          // get current year from the date object
          const currentYear = new Date().getFullYear();
          // get imdb id
          let imdbId = element
            .querySelector(".lister-item-image a")
            .getAttribute("href")
            .match(/title\/(.*)\//)[1];
          let title = element.querySelector(".lister-item-header a").innerText;

          // get relase date
          let releaseDate =
            element
              .querySelector(".lister-item-year")
              .innerText.replace(/\(/g, "")
              .replace(/\)/g, "") || "";
          try {
            var isFinished = releaseDate.split("–")[1].trim();
            let startDate = releaseDate.split("–")[0].trim();
            //extract the year from the string
            let isFinishedYear = isFinished.match(/\d+/g).map(Number)[0];

            if (isFinishedYear) {
              isFinishedYear <= currentYear || startDate + 40 < currentYear
                ? (isFinished = true)
                : (isFinished = false);
            } else {
              isFinished = false;
            }
          } catch (_) {
            isFinished = false;
          }
          data.push({
            imdbId: imdbId,
            title: title,
            releaseDate: releaseDate,
            isFinished: isFinished,
            lastUpdated: lastUpdated,
          });
        }
        return data;
      });
      resultData = [...resultData, result]; //data.push(result);
      i += 50;
    }
    resultData = resultData.flat();
    console.log(resultData);
    var seriesList = [];
    const seriesListFile = fs.readFileSync("seriesList.json", "utf8");
    console.log(seriesListFile.length);
    seriesListFile.length < 2
      ? (seriesList = [])
      : (seriesList = JSON.parse(seriesListFile));

    try {
      seriesList = JSON.parse(fs.readFileSync("seriesList.json", "utf8"));
      // verify if the series is already in the list and update the release date
      resultData.forEach((series) => {
        let index = seriesList.findIndex(
          (item) => item.imdbId === series.imdbId
        );
        if (index !== -1) {
          seriesList[index].releaseDate = series.releaseDate;
          seriesList[index].isFinished = series.isFinished;
        } else {
          seriesList.push(series);
        }
      });
    } catch (error) {
      console.log(error);
      return;
      //seriesList = [];
    }
    console.log(resultData.length);
    console.log(seriesList.length);
    fs.writeFileSync("seriesList.json", JSON.stringify(seriesList, null, 2));
    await browser.close();
  } catch (error) {
    console.log(error);
    await browser.close();
  }
})();
