const axios = require("axios");
const fs = require("fs");
const BASE_URL = "http://127.0.0.1:3000/actor/";
const dotenv = require("dotenv");
const sendEmail = require("../sendEmail.js");
dotenv.config({ path: "../../.env" });

var errorCounter = 0;
async function wait(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
const currentTime = new Date().getTime();
async function getActors() {
    try {
        var allreadyAdded = [];
        var actorsAddedCSV = fs.readFileSync(
            "../datasets/actors/actorsAdded.csv",
            "utf8"
        );
        var actorsAdded = actorsAddedCSV.split("\n");
        for (var i = 0; i < actorsAdded.length; i++) {
            allreadyAdded.push(actorsAdded[i]);
        }

        // remove duplicates
        allreadyAdded = [...new Set(allreadyAdded)];

        const actorsList = fs.readFileSync(
            "../datasets/actors/actorsList.json",
            "utf8"
        );
        try {
            var actors = JSON.parse(actorsList);
        } catch (e) {
            console.log(e);
            actors = [];
        }
        let result = [];

        for (var i = 0; i < actors.length; i++) {
            let actorId = actors[i].imdbId;
            if (allreadyAdded.indexOf(actorId) == -1) {
                const { data } = await axios.get(BASE_URL + actorId);
                if (data) {
                    data.lastUpdate = currentTime;
                    result.push(data);
                    allreadyAdded.push(actorId);
                    //console.log(data);
                    fs.appendFileSync(
                        "../datasets/actors/actorsAdded.csv",
                        actorId + "\n"
                    );
                    fs.writeFileSync(
                        "../datasets/actors/actorsInfo.json",
                        JSON.stringify(result)
                    );
                }
            }
        }
    } catch (error) {
        console.log(error);
        errorCounter++;
        if (errorCounter > 7) {
            console.log("Too many errors, exiting");
            process.exit(1);
        }

        await wait(1000);
        await sendEmail("actors.js", error);
        await getActors();
    }
}

getActors();
