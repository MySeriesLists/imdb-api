const fs = require("fs").promises;
const BASE_URL = "http://localhost:3000/title/";
const axios = require("axios");

async function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

async function getMovies() {
    var allreadyAdded = [];
    const addedMovies = await fs.readFile("./moviesAdded.csv", "utf8");
    addedMovies.split("\n").forEach((element) => {
        allreadyAdded.push(element);
    });
    allreadyAdded === undefined
        ? (allreadyAdded = [])
        : (allreadyAdded = allreadyAdded);
    const moviesList = (await fs.readFile("./moviesList.json", "utf8")) || [];
    const movies = JSON.parse(moviesList);

    let count = 0;
    for (const movie of movies) {
        if (allreadyAdded.includes(movie.imdbId)) {
            continue;
        }
        count++;
        const url = BASE_URL + movie.imdbId;

        try {
            var moviesInfo = await fs.readFile("./moviesInfo.json", "utf8");

            moviesInfo.length < 2
                ? (moviesInfo = [])
                : (moviesInfo = JSON.parse(moviesInfo));
            const { data } = await axios.get(url);
            moviesInfo.push(data);
            await fs.writeFile("./moviesInfo.json", JSON.stringify(moviesInfo));

            // add the serie to the list of added series and write it to the csv file

            if (!allreadyAdded.includes(movie.imdbId)) {
                allreadyAdded.push(movie.imdbId);
                await fs.writeFile("./moviesAdded.csv", allreadyAdded.join("\n"));
            }
        } catch (error) {
            console.log(error);
            await wait(10 * 1000);
        }

        count++;
        count % 10 === 0 && console.log(count);
    }

    //verify if all id is unique in moviesInfo.json
    const moviesInfoJson = JSON.parse(moviesInfo);
    const imdbIds = [];
    moviesInfoJson.forEach((movie) => {
        imdbIds.push(movie.id);
    });
    const uniqueImdbIds = [...new Set(imdbIds)];
    if (uniqueImdbIds.length !== imdbIds.length) {
        console.log("some id are not unique");
    } else {
        console.log("all id are unique");
        console.log("Everything is ok");
    }
}

getMovies();
