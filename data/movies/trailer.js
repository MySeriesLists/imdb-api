/**
 * In this code, the searchVideos function uses the YouTube API
 * to search for videos matching a specific query
 * (which is defined by the q parameter in the API request).
 * The function then prints the titles and URLs of the first 10 videos that match the query.
 */
const path = require("path");
const fs = require("fs");
const file = path.join(__dirname, "./moviesList.json");
const { config } = require("dotenv");
const { google } = require("googleapis");
config({
  path: "./../../.env",
});

var data = JSON.parse(fs.readFileSync(file, "utf8"));
var apiKey = null;
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
    console.log("video id is:" + data.items[0].id.videoId);

    return {
      id: data.items[0].id.videoId,
    };
  } catch (error) {
    console.log(error);
  }
}

async function addTrailerId() {
  try {
    for (let i = 0; i < data.length; i++) {
      // due to the limit of youtube api, we can only search 100 times per day
      // so we need to wait for 24 hours
      // that's why i use 3 youtube api keys
      let apiKeys = [
        process.env.YOUTUBE_API_KEY1,
        process.env.YOUTUBE_API_KEY2,
        process.env.YOUTUBE_API_KEY3,
        process.env.YOUTUBE_API_KEY4,
        process.env.YOUTUBE_API_KEY5,
        process.env.YOUTUBE_API_KEY6,
      ];
      for (let k = 1; k <= apiKeys.length; k++) {
        i % k === 0 ? (apiKey = apiKeys[k]) : (apiKey = apiKeys[5]);
        if (apiKey == undefined) apiKey = apiKeys[3];
      }

      //if (i % 100 === 0 && i !== 0) await sleep(1000 * 60);

      var youtube = google.youtube({
        version: "v3",
        auth: apiKey,
      });
      const movie = data[i];
      try {
        if (movie.trailerYtId == null) {
          const query = movie.title + " trailer";
          const response = await searchVideos(query, youtube);
          if (response) {
            if (response.id) {
              movie.trailerYtId = response.id; // no need
            }
          } else {
            movie.trailerYtId = null;
          }
          const title = movie.title;
          const movieIndex = data.findIndex((m) => m.title === title);
          if (movieIndex > -1) {
            data[movieIndex] = movie;
          }
          // write to file
          fs.writeFileSync(file, JSON.stringify(data, null, 2));
          console.log("missing index " + i);
        }
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    //  console.log(error);
  }
}

addTrailerId();
