require('dotenv').config()
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const twApiModule = require('twitter-api-v2')
const TwitterApi = twApiModule.default;
const express = require('express')
const app = express()

app.listen(process.env.PORT || 8000);
app.get('/', (req, res)=> {
    res.send('rodando')
})

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: process.env.TWITTER_ACESS_TOKEN,
    accessSecret: process.env.TWITTER_ACESS_TOKEN_SECRET,
});
console.log('ok')

async function getURL() {
    let urlAPI = process.env.API_URL
    let data = await axios.get(urlAPI)
    console.log(data.data[0].url)
    let url = data.data[0].url;
    const mediaId = await client.v1.uploadMedia(url);
    const newTweet = await client.v2.tweet({"text": '', "media": {"media_ids": [mediaId]}});
    }


setInterval(getURL, 10000)

