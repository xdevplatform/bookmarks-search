# My Twitter Jam

This app creates a Spotify playlist from your Twitter Bookmarks.

[Try it live](https://mytwitterjam.glitch.me)

[Sign up for the Twitter API](https://t.co/signup)

## How it works

This app uses the Bookmarks lookup endpoint to get your bookmarks. If your bookmarks contain Tweets with links to Spotify tracks, it will show them to you. If you don't have songs in your bookmarks, the app will use Recent Search to suggest up to 10 Spotify songs people on Twitter recently tweeted out, so you can add them to your bookmarks.

Once you have songs in your bookmarks, the app can create a Spotify playlist for you using the Spotify API. Just enter the name of the playlists, then click Create playlist.

## Make it yours

### Get access

1. [Sign up for the Twitter API](https://t.co/signup) (it's free!)
1. [Obtain a Spotify developer account](https://developer.spotify.com/) (also free).

### Configure your Spotify app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
1. Create an app or use an existing one. Click on the app.
1. Make a note of your Spotify Client ID and Client Secret.
1. Click on Edit Settings and fill out all the required fields.
1. Configure your OAuth callback, making sure it ends with `/oauth/spotify`. For example, if you're hosting the app from your local environment, your callback will be `https://127.0.0.1:3002/oauth/spotify`.
1. Save your settings.

### Configure your Twitter app

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/apps) and select the cog icon next to app you wish to use.
1. Click Edit under User authentication settings.
1. Enable OAuth 2.0. Select Single page App as your client type.
1. Configure your OAuth callback, making sure it ends with `/oauth/twitter`. For example, if you're hosting the app from your local environment, your callback will be `https://127.0.0.1:3002/oauth/twitter`.
1. Make a note of your Twitter Client ID.

### Configure your project

1. Clone this project.
1. Copy the `.env.template` file into a file named `.env` and fill out the environment variables with the client IDs and secrets for Twitter and Spotify (note that you will only need the Client ID for Twitter). Your `TWITTER_REDIRECT_URI` and `SPOTIFY_REDIRECT_URI` should reflect the value of the OAuth callbacks for each platform. Change `APP_URL` to the URL where you are hosting your app.
1. Run `yarn` or `npm install` (only on your first run).
1. Run `yarn dev` or `npm run dev` to start the app.