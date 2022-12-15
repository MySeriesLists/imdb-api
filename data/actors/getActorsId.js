// get actors imdb id moviesInfo.json

const fs = require("fs");
const path = require("path");
const moviesInfo = path.join(__dirname, "../movies/moviesInfo.json");
const seriesInfo = path.join(__dirname, "../series/seriesInfo.json");
const file = path.join(__dirname, "../actors/actorsList.json");
const currentTime = new Date().getTime();
var movies = JSON.parse(fs.readFileSync(moviesInfo, "utf8"));
var series = JSON.parse(fs.readFileSync(seriesInfo, "utf8"));
try {
    var actors = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
    var actors = [];
}
actors.length > 1 ? (actors = actors) : (actors = []);

movies.forEach((movie) => {
    movie.actors.forEach((actor) => {
        // verify if imdbId already exists in actors
        if (actors.length > 0) {
            const actorExists = actors.find((a) => a.imdbId === actor);
            if (!actorExists) {
                //console.log("actor not exists");
                actors.push({
                    imdbId: actor || null,
                    lastUpdated: currentTime,
                });
            }
        } else {
            actors.push({
                imdbId: actor || null,
                lastUpdate: currentTime,
            });
        }
    });
});

series.forEach((serie) => {
    serie.actors.forEach((actor) => {
        // verify if imdbId already exists in actors
        if (actors.length > 0) {
            var actorExists = actors.find((a) => a.imdbId === actor);
            if (!actorExists) {
                //console.log("actor not  exists");
                actors.push({
                    imdbId: actor || null,
                    lastUpdate: currentTime,
                });
            }
        } else {
            actors.push({
                imdbId: actor || null,
                lastUpdate: currentTime,
            });
        }
    });
});

fs.writeFile(file, JSON.stringify(actors), function(err) {
    if (err) throw err;
    console.log("Saved!");
});

// verify if each imdb id is unique in actorsList.json
var unique = actors.filter((thing, index, self) => {
    return (
        index ===
        self.findIndex((t) => {
            return t.imdbId === thing.imdbId;
        })
    );
});
console.log(unique.length);

actors.length === unique.length
    ? console.log("Everything is ok")
    : console.log("Something is wrong");
