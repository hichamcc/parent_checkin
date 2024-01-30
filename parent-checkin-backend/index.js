const AWS = require('aws-sdk');
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes')
const schoolRoutes = require('./routes/schoolRoutes')
const studentRoutes = require('./routes/studentRoutes')
const cors = require('cors');
const app = express();
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');
const path = require('path');
const cron = require('cron');

//user id  : JvbqevSVgSeIjOrpjbhEKjUmD4y2
//key :  a1cf304d39624408b3cced6e7487aa91

AWS.config.loadFromPath('./config.json');


const port = 3000;
const Polly =new AWS.Polly({
    region : 'ap-northeast-1'
});


app.use('/names', express.static(path.join(__dirname, 'names')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use('/auth', authRoutes);
app.use('/school', schoolRoutes);
app.use('/student', studentRoutes);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Checkin test application." });
});



server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ["GET", "POST" , "PUT" , "DELETE"],
    }
});
// WebSocket connection
io.on('connection', (socket) => {
    console.log('A client connected');

    // Example: Broadcasting new student data to all connected clients
    socket.on('newStudent', (newStudent) => {

        const input = {
            "Engine": 'neural',
            "LanguageCode": "ar-AE",
            "OutputFormat" : "mp3",
            "Text" : newStudent[0],
            "TextType":"text",
            "VoiceId": "Hala",
        }
        const currentTimestamp = Date.now();

// Extract the last 5 digits
        const last5Digits = currentTimestamp % 100000;

        Polly.synthesizeSpeech(input , (err,data)=>{
            if(err){
                console.log('test' , err);
                return
            }
            if(data.AudioStream){
                fs.writeFile('names/name-'+last5Digits+'.mp3', data.AudioStream , (err)=>{
                    console.log(err)
                })
            }
            console.log('data',data);
            newStudent[2]= 'names/name-'+last5Digits+'.mp3'
            io.emit('newStudent',
                newStudent );
        } )


    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});


// Specify the path to the mp3 names folder
const folderPath = './names/';

// Create a CronJob to run every day at midnight
const job = new cron.CronJob('*/1 * * * *', function () {
    console.log('Running cron job to delete files older than 1 day...');

    // Get the current time in milliseconds
    const currentTime = new Date().getTime();

    // Read the files in the folder
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        // Iterate through each file and check if it's older than 1 day
        files.forEach(file => {
            const filePath = `${folderPath}${file}`;
            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    console.error('Error getting file stats:', statErr);
                    return;
                }

                // Calculate the age of the file in milliseconds
                const fileAge = currentTime - stats.mtime.getTime();

                // Delete the file if it's older than 1 day (86400000 milliseconds)
                if (fileAge > 86400000) {
                    fs.unlink(filePath, unlinkErr => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr);
                        } else {
                            console.log(`Deleted file: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
}, null, true, 'UTC');

// Start the cron job
job.start();

console.log('Cron job scheduled to run every day at midnight.');