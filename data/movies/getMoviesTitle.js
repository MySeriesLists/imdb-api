const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "../datasets/movies/moviesList.json");

(async () => {
    try {
        const currentDate = new Date().getTime();
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        //await page.goto('https://www.imdb.com/search/title/?title_type=tv_series&start=0&view=advanced');
        try {
            var data = JSON.parse(fs.readFileSync(file)) || [];
        } catch (e) {
            console.log("Error while reading file", e);
            data = [];
        }
        let i = 0;
        while (i <= 9950) {
            console.log(i);
            await page.goto(
                `https://www.imdb.com/search/title/?title_type=feature&num_votes=10000,&sort=user_rating,desc&start=${i}&ref_=adv_nxt`
            );
            const result = await page.evaluate((currentDate) => {
                const imdbRegex = /title\/(.*)\//;
                let elements = document.querySelectorAll(".lister-item");
                let data = [];
                for (var element of elements) {
                    // get imdb id
                    let imdbId = element
                        .querySelector(".lister-item-image a")
                        .getAttribute("href")
                        .match(imdbRegex)[1];
                    // get title
                    let title = element.querySelector(".lister-item-header a").innerText;
                    data.push({
                        imdbId: imdbId,
                        title: title,
                        lastUpdated: currentDate,
                    });
                }
                return data;
            }, currentDate);

            data = [...data, ...result];
            i += 50;
        }
        // verify if all id are unique  and remove duplicates order by lastUpdated
        data = data
            .filter((v, i, a) => a.findIndex((t) => t.imdbId === v.imdbId) === i)
            .sort((a, b) => b.lastUpdated - a.lastUpdated);
        fs.writeFileSync(file, JSON.stringify(data));
        console.log("Done");
        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();
