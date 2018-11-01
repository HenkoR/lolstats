# League Of Legends (LOL) Summoner stats site

> lolstats is a easy to use site to view the most recent game stats for a specific summoner.
You can enter the summoner name and get his latest stats right away.

## LOLStats under the hood

We used React as the front end for this site, with a nodeJS with ExpressJS backend. All the data is coming directly from the Riot LOL API.

This site is also hosted on Heroku with almost no effort.

## Usage

Install [nodemon](https://github.com/remy/nodemon) globally

```
npm i nodemon -g
```

Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time (from the root of the project)

```
yarn dev
```

Running the production build on localhost. This will create a production build, then Node will serve the app on http://localhost:5000

```
NODE_ENV=production yarn dev:server
```
