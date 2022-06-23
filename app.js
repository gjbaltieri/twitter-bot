require('dotenv').config()
const axios = require('axios');
const twApiModule = require('twitter-api-v2')
const TwitterApi = twApiModule.default;
const Downloader = require("nodejs-file-downloader");
const fs = require('fs');

var filePath

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
    downloadImage(url)
}
const downloadImage = async function (fileURL) {
    const downloader = new Downloader({
        url: fileURL,
        directory: "./images/",
        onBeforeSave: (fileName) => {
            filePath = fileName
            console.log(`The file name is: ${fileName}`)
        }
    })
    try {
        await downloader.download();
        postTweet(filePath)
        console.log("All done");
    } catch (error) {
        console.log("Download failed", error);
        return
    }
}


async function postTweet(fileName) {
    const mediaId = await client.v1.uploadMedia(`${__dirname}/images/${fileName}`);
    const newTweet = await client.v2.tweet({ "text": '', "media": { "media_ids": [mediaId] } });
    console.log(newTweet)
    fs.unlink(`${__dirname}/images/${fileName}`, function(err) { 
        if(err) {
           console.log("unlink failed", err);
        } else {
           console.log("file deleted");
        }
    });
}

getURL()
setInterval(getURL, 3600000)
