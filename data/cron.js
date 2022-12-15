const cron = require("node-cron");
const path = require("path");

const series = require(path.join(__dirname, "./series/series.js"));
const getSeriesTitle = require(path.join(
  __dirname,
  "./series/getSeriesTitle.js"
));
const movies = require(path.join(__dirname, "./movies/movies.js"));
const getMovieTitle = require(path.join(
  __dirname,
  "./movies/getMoviesTitle.js"
));
const actors = require(path.join(__dirname, "./actors/actors.js"));
const getActorsId = require(path.join(__dirname, "./actors/getActorsId.js"));

const moviesTrailers = require(path.join(__dirname, "./movies/trailer.js"));
const seriesTrailers = require(path.join(__dirname, "./series/trailer.js"));
/**
 * @update - update series once a month (1st day of the month)
 */
cron.schedule("0 0 1 * *", () => {
  series.getSeries();
});

/**
 * @update - update series title once a week (every sunday)
 */
cron.schedule("0 0 * * 0", () => {
  getSeriesTitle();
});

/**
 * @update - update movies once a month (3rd day of the month)
 */
cron.schedule("0 0 3 * *", () => {
  movies.getMovies();
});

/**
 * @update - update movies title once a week (every Friday)
 */
cron.schedule("0 0 * * 5", () => {
  getMovieTitle();
});

/**
 * @update - update actors once a month (5th day of the month)
 */

cron.schedule("0 0 5 * *", () => {
  actors.getActors();
});

/**
 * @update - update actors id once a week (every Wednesday)
 */
cron.schedule("0 0 * * 3", () => {
  getActorsId();
});

/**
 * @update - update movies trailers once a day (every day at 12:00 am)
 */
cron.schedule("0 0 * * *", () => {
  moviesTrailers.addTrailerId();
});

/**
 * @update - update series trailers once a day (every day at 12:00 am)
 */
cron.schedule("0 0 * * *", () => {
  seriesTrailers.addTrailerId();
});
