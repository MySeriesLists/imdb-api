const fs = require("fs").promises;
const dotenv = require("dotenv");
const sendEmail = require("../sendEmail.js");
const BASE_URL = "http://localhost:3000/title/";
const axios = require("axios");
const movieListPath = "../datasets/movies/moviesList.json";
const movieInfoPath = "../datasets/movies/moviesInfo.json";

dotenv.config({ path: "../../.env" });
async function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

var errorCounter = 0;
async function getMovies() {
    try {
        var allreadyAdded = [];
        const moviesList = (await fs.readFile(movieListPath, "utf8")) || [];
        const movies = JSON.parse(moviesList);

        //verify if moviesInfo exists (if not, create it with [] value)
        try {
            await fs.access(movieInfoPath);
        } catch (err) {
            await fs.writeFile(movieInfoPath, "[]");
        }

        var moviesInfo = await fs.readFile(movieInfoPath, "utf8");
        moviesInfo = JSON.parse(moviesInfo);

        allreadyAdded = moviesInfo.map((movie) => movie.imdbId);

        let count = 0;

        console.log("Movies length: " + movies.length);
        console.log("Movies already added: " + allreadyAdded.length);

        for (const movie of movies) {
            count++;
            if (allreadyAdded.includes(movie.imdbId)) {
                console.log("Movie already added: " + movie.title);
                continue;
            }
            const url = BASE_URL + movie.imdbId;

            try {
                //var moviesInfo = await fs.readFile("./moviesInfo.json", "utf8");
                const { data } = await axios.get(url);
                moviesInfo.push(data);
                await fs.writeFile(movieInfoPath, JSON.stringify(moviesInfo));

                // add the serie to the list of added series and write it to the csv file

                if (!allreadyAdded.includes(movie.imdbId)) {
                    allreadyAdded.push(movie.imdbId);
                    //await fs.writeFile("./moviesAdded.csv", allreadyAdded.join("\n"));
                }
            } catch (error) {
                console.log(error);
                await wait(10 * 1000);
            }
            count % 10 === 0 && console.log(count);
        }

        //verify if all id is unique in moviesInfo.json
        const moviesInfoJson = moviesInfo;
        const imdbIds = [];
        moviesInfoJson.forEach((movie) => {
            imdbIds.push(movie.imdbId);
        });
        const uniqueImdbIds = [...new Set(imdbIds)];
        if (uniqueImdbIds.length !== imdbIds.length) {
            console.log("some id are not unique");
        } else {
            console.log("all id are unique");
            console.log("Everything is ok");
        }
    } catch (error) {
        console.log(error);
        errorCounter++;
        if (errorCounter > 7) {
            console.log("Too many errors, stopping");
            process.exit(1);
        }
        await sendEmail("movies.js", error);
        await getMovies();
    }
}
getMovies();
