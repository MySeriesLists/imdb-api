# How scrape data from imdb

For this clone the project 

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```sh
git clone git@github.com:MySeriesLists/imdb-api.git
cd imdb-api/
npm i 
npm run dev
```



Please download **datasets.zip**  file form [google drive](https://drive.google.com/drive/folders/1rL6Q7tMa0aXzJXvP9OeDWNEG4Fz7yCFc?usp=share_link) extract them and put it in: 
```bash
imdb-api/data/datasets/
```

datasets directory should something like this : 
```bash 
├── datasets
│   ├── actors
│   │   ├── actorsAdded.csv
│   │   ├── actorsInfo.json
│   │   └── actorsList.json
│   ├── dataset.sh
│   ├── movies
│   │   ├── moviesAdded.csv
│   │   ├── moviesInfo.json
│   │   └── moviesList.json
│   ├── README.txt
│   ├── series
│   │   ├── seriesAdded.csv
│   │   ├── seriesInfo.json
│   │   └── seriesList.json
│   └── title.csv
```
## Start scrapping 

```bash
  cd data/  # go to data
  chmod +x dataset.Sh
  ./dataset.sh
```

You can try if everything is working fine : 
For example 
```bash
cd movies/ && node movies.js
```

If everything is working fine then, just launch crontab


You can run 
```sh
node cron.js # or  
imdb-api/data/cron.sh
```

