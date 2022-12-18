/**
 * In this code, the searchVideos function uses the YouTube API
 * to search for videos matching a specific query
 * (which is defined by the q parameter in the API request).
 * The function then prints the titles and URLs of the first 10 videos that match the query.
 */
const path = require("path");
const fs = require("fs");
const file = path.join(__dirname, "../datasets/series/seriesList.json");
const { config } = require("dotenv");
const { google } = require("googleapis");
const seriesInfoPath = "../datasets/series/seriesInfo.json";
var seriesInfo = require(seriesInfoPath);

config({
  path: "./../../.env",
});

var data = JSON.parse(fs.readFileSync(file, "utf8"));
async function searchVideos(query, youtube) {
  // get only video id
  try {
    const response = youtube.search.list({
      part: "id",
      q: query,
      type: "video",
      maxResults: 1,
      duration: "short",
    });

    const { data } = await response;
    if (!data.items) {
      return {
        id: null,
      };
    }
    console.log(query + " id is: " + data.items[0].id.videoId);

    return {
      id: data.items[0].id.videoId,
    };
  } catch (error) {
    console.log(error.message);
  }
}

async function addTrailerId() {
  try {
    for (let i = 0; i < data.length; i++) {
      var apiKey = null;
      // due to the limit of youtube api, we can only search 100 times per day
      // so we need to wait for 24 hours
      // that's why i use 5 youtube api keys
      let apiKeys = [
        process.env.GOOGLE_API_KEY,
        process.env.YOUTUBE_API_KEY2,
        process.env.YOUTUBE_API_KEY3,
        process.env.YOUTUBE_API_KEY4,
        process.env.YOUTUBE_API_KEY5,
        process.env.YOUTUBE_API_KEY6,
      ];

      var index = i % apiKeys.length;
      apiKeys[index] == null
        ? (apiKey = apiKeys[0])
        : (apiKey = apiKeys[index]);

      var youtube = google.youtube({
        version: "v3",
        auth: apiKey,
      });
      const serie = data[i];
      try {
        if (serie.trailerYtId == null) {
          const query = serie.title + " trailer";
          const response = await searchVideos(query, youtube);
          if (response) {
            if (response.id) {
              serie.trailerYtId = response.id; // no need
            }
          } else {
            serie.trailerYtId = null;
          }
          const title = serie.title;
          const serieIndex = data.findIndex((m) => m.title === title);
          if (serieIndex > -1) {
            data[serieIndex] = serie;
          }
          // write to file
          try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
          } catch (error) {
            console.log(error);
          }
          console.log("missing index " + i);
        }
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    console.log("error occured : " + error.message);
  }

  for (let i = 0; i < data.length; i++) {
    const imdbId = data[i].imdbId;
    const serieIndex = seriesInfo.findIndex((m) => m.imdbId === imdbId);
    if (serieIndex > -1) {
      if (data[i].trailerYtId && !seriesInfo[serieIndex].trailerYtId) {
        seriesInfo[serieIndex].trailerYtId = data[i].trailerYtId;
      }
    }
  }
  try {
    fs.writeFileSync(
      path.join(__dirname, seriesInfoPath),
      JSON.stringify(seriesInfo, null, 2)
    );
    console.log("done!");
  } catch (error) {
    console.log(error);
  }
}

addTrailerId();
