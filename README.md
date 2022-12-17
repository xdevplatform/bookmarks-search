# Bookmark search

Search your Twitter bookmarks

[Try it live](https://bookmarksearch.glitch.me)

[Sign up for the Twitter API](https://t.co/signup)

## How it works

This app uses the Bookmarks lookup endpoint to get your bookmarks. It then performs a fuzzy search on:

- The Tweet text
- The author's name and username
- The [Tweet annotations](https://developer.twitter.com/en/docs/twitter-api/annotations/overview), if present.

## Make it yours

### Get access

1. [Sign up for the Twitter API](https://t.co/signup) (it's free!)

### Configure your Twitter app

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/apps) and select the cog icon next to app you wish to use.
1. Click Edit under User authentication settings.
1. Enable OAuth 2.0. Select Native App as your client type.
1. Configure your OAuth callback, making sure it ends with `/oauth/twitter`. For example, if you're hosting the app from your local environment, your callback will be `https://127.0.0.1:3002/oauth/twitter`.
1. Make a note of your Twitter Client ID.

### Configure your project

1. Clone this project.
1. Copy the `.env.template` file into a file named `.env` and fill out the environment variables with the client IDs and secrets for Twitter (note that you will only need the Client ID for Twitter). Your `TWITTER_REDIRECT_URI` should reflect the value of the OAuth callback. Change `APP_URL` to the URL where you are hosting your app.
1. Run `yarn` or `npm install` (only on your first run).
1. Run `yarn dev` or `npm run dev` to start the app.
