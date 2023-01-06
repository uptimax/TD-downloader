const express = require('express');

const serverless = require('serverless-http');

const bodyParser = require('body-parser');

const ytdl = require('ytdl-core');

const cors = require('cors');

const app = express();

const router = express.Router();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const port = 5000 || process.env.PORT;

router.post('/download', async (req, res)=>{
    try{

        var url = req.query.url;

        if(!url.includes('youtube.com')) return res.send(url.includes('youtube.com'));


        const videoId = await ytdl.getURLVideoID(url);
        const metInfo = await ytdl.getInfo(url);
        var lengthSeconds = metInfo.videoDetails.lengthSeconds;
        var inMinutes = Math.floor(lengthSeconds/60);
        var inHours = Math.floor(inMinutes/60);
        lengthSeconds = ((inHours > 0) ? inHours + ":" + (inMinutes % 60): inMinutes) + ":" + lengthSeconds % 60;
        let data = {
            url: "https://www.youtube.com/embed/" + videoId,
            info: metInfo.formats,
            thumbnails: metInfo.videoDetails.thumbnails,
            title: metInfo.videoDetails.title,
            duration: lengthSeconds
        }
        
        return res.send(data);
    }catch(e)
    {
        return res.status(500);
    }
})

// app.listen(5000, ()=>{
//     console.log('listening on port 5000');
// })

app.use('/.netlify/functions/api', router);

// module.exports = app;
module.exports.handler = serverless(app);