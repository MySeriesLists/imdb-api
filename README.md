<h1 align="center">
  <br>
  <a href="https://github.com/meteor314/series"><img src="https://raw.githubusercontent.com/meteor314/series/master/imdb-api/README/logo.png" alt="Markdownify" width="51"></a>
  <br>
  Series
  <br>
</h1>

<h4 align="center">List of all films and series from imdb <a href="https://github.com/meteor314/series/tree/master/imdb-api/data" target="_blank">here</a>.</h4>

<p align="center">
  <a href="#">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"
         alt="PRs Welcome">   
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://raw.githubusercontent.com/meteor314/series/master/imdb-api/README/list.png)

## Key Features

- <a href="https://github.com/meteor314/series/tree/master/imdb-api/data/movies" >more than 10 000 films </a>
- <a href="https://github.com/meteor314/series/tree/master/imdb-api/data/series"> more than 10 000 series </a>
- <a href="https://github.com/meteor314/series/tree/master/imdb-api/data/actors">more than 100 000 actors </a>

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com//meteor314/series.git

# Go into the repository
$ cd series/

# Install dependencies
$ npm i

# Run the app
$ node <file>.js
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Configuration

You also need to create .env file, here is the structure of the project :

```sh.
├── <file>.js
├── .env
├── LICENSE
├── data
├── models
├── README
└── README.md
```

You also need to create key api from google and enable Yt v3 api

> https://developers.google.com/youtube/v3

```sh
# open your favorite editor
vim .env
# content of .env file
# I Created 5 keys but you don't need all of this.

GOOGLE_API_KEY=-** # to keep
YOUTUBE_API_KEY2=** #optional
YOUTUBE_API_KEY3=** #optional
YOUTUBE_API_KEY4=** #optional
YOUTUBE_API_KEY6=** #optional
YOUTUBE_API_KEY5=** #optional

```

> **Note**
> how to create an app password for gmail :
> https://support.google.com/mail/answer/185833?hl=en

> **Note**
> how to create a mongodb uri :
> https://docs.atlas.mongodb.com/getting-started/

> **Note**²
> MongoDB is optional, you can use the csv or json file.
> Please uncomment mongodb connection in \*.js if needed

## Support

If you liked using this app or it has helped you in any way, I'd like you send me an email at <meteor3141592@gmail.com> about anything you'd want to say about this software. I'd really appreciate it!

## Credits

This software uses the following open source packages:

- [Puppeteer](https://pptr.dev/)
- [Node.js](https://nodejs.org/)

## Related

- <a href ="https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews"> IMDB Dataset of 50K Movie Reviews </a>
- <a href ="https://www.kaggle.com/datasets/harshitshankhdhar/imdb-dataset-of-top-1000-movies-and-tv-shows"> IMDB Movies Dataset </a>

## You may also like...

- [ny-cli](https://github.com/meteor314/ny-cli) - A streaming app for movies and series with a lot of features from cli
- [linear](https://github.com/meteor314/linear) - A social web app with MERN stack

## Support

<a href="#" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<p>Or</p>

<a href="#">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## License

MIT License

---

> GitHub [@meteor314](https://github.com/meteor314) &nbsp;&middot;&nbsp;
> CodePen [@meteor314](https://codepen.io/meteor314)
