/**
 * In this code, the searchVideos function uses the YouTube API
 * to search for videos matching a specific query
 * (which is defined by the q parameter in the API request).
 * The function then prints the titles and URLs of the first 10 videos that match the query.
 */
const path = require("path");
const fs = require("fs");
const file = path.join(__dirname, "../datasets/movies/moviesList.json");
const moviesInfoPath = "../datasets/movies/moviesInfo.json";
var moviesInfo = JSON.parse(fs.readFileSync(moviesInfoPath, "utf8"));
const { config } = require("dotenv");
const { google } = require("googleapis");
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
    console.log("video id is:" + data.items[0].id.videoId);

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
      var apiKeys = [
        process.env.GOOGLE_API_KEY,
        process.env.YOUTUBE_API_KEY2,
        process.env.YOUTUBE_API_KEY3,
        process.env.YOUTUBE_API_KEY4,
        process.env.YOUTUBE_API_KEY5,
        process.env.YOUTUBE_API_KEY6,
      ];

      var index = i % apiKeys.length;
      apiKeys[index] == undefined
        ? (apiKey = apiKeys[0])
        : (apiKey = apiKeys[index]);

      const youtube = google.youtube({
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
          try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
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
    console.log(error.message);
  }

  // add data trailer to moviesInfo file
  for (let i = 0; i < data.length; i++) {
    const imdbId = data[i].imdbId;
    const movieIndex = moviesInfo.findIndex((m) => m.imdbId === imdbId);
    if (movieIndex > -1) {
      if (data[i].trailerYtId && !moviesInfo[movieIndex].trailerYtId) {
        moviesInfo[movieIndex].trailerYtId = data[i].trailerYtId;
      }
    }
  }
  try {
    fs.writeFileSync(
      path.join(__dirname, moviesInfoPath),
      JSON.stringify(moviesInfo, null, 2)
    );
    console.log("done!");
  } catch (error) {
    console.log(error);
  }
}

addTrailerId();
