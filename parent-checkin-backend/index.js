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


const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use('/auth', authRoutes);
app.use('/school', schoolRoutes);
app.use('/student', studentRoutes);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Checkin test application." });
});



server.listen(port,"192.168.100.44", () => {
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
        io.emit('newStudent',
            newStudent );
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});