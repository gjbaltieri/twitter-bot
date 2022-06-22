require('dotenv').config()
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const twApiModule = require('twitter-api-v2')
const TwitterApi = twApiModule.default;
const express = require('express')

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: process.env.TWITTER_ACESS_TOKEN,
    accessSecret: process.env.TWITTER_ACESS_TOKEN_SECRET,
});

async function getURL() {
    let urlAPI = process.env.API_URL
    let data = await axios.get(urlAPI)
    console.log(data.data[0].url)
    let url = data.data[0].url;
    https.get(url, (res) => {
        const path = `${__dirname}/images/img.jpeg`;
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish', () => {
            filePath.close();
            console.log('Download Completed');
        })
    })

    const mediaId = await client.v1.uploadMedia('./images/img.jpeg');
    const newTweet = await client.v2.tweet({"text": '', "media": {"media_ids": [mediaId]}});
    }

setInterval(getURL, 300000)
