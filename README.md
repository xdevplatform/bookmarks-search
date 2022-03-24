# My Twitter Jam

This app creates a Spotify playlist from your Twitter Bookmarks.

[Try it live](https://mytwitterjam.glitch.me)

[Sign up for the Twitter API](https://t.co/signup)


## How it works

This app uses the Bookmarks lookup endpoint to get your bookmarks. If your bookmarks contain Tweets with links to Spotify tracks, it will show them to you. If you don't have songs in your bookmarks, the app will use Recent Search to suggest up to 10 Spotify songs people on Twitter recently tweeted out, so you can add them to your bookmarks.

Once you have songs in your bookmarks, the app can create a Spotify playlist for you using the Spotify API. Just enter the name of the playlists, then click Create playlist.

## Make it yours

1. [Sign up for the Twitter API](https://t.co/signup) (it's free!)
1. [Obtain a Spotify developer account](https://developer.spotify.com/). Make a note of your Spotify Client ID and Client Secret.
1. Clone this project.
1. Copy `.env.template` to a file named `.env`.
1. Clone the [My Twitter Jam backend](https://github.com/github/mytwitterjam-backend) and follow the instructions in the `README` file for that project.
1. Run `yarn` or `npm install` (only on your first run).
1. Run `yarn start` or `npm run start` to start the development server for this app.