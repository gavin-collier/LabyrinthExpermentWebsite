import path from 'path';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
const { MongoClient, ServerApiVersion } = require('mongodb'); //FOR TEST
import mongoose from 'mongoose';

const http = require('http');

//get local files to use
const user = require("./model/user");
const loginRouts = require('./loginRouts');
const timeRouts = require('./timeRouts');
const adminRouts = require('./adminRouts');
require('dotenv').config();

const port = 8080;
const app = express();

//get encoded .env values
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);
const host = process.env.DB_IP;
const secret = encodeURIComponent(process.env.SESSION_SECRET);
const ADMIN_USERNAME = encodeURIComponent(process.env.ADMIN_USERNAME);
const ADMIN_API_KEY = encodeURIComponent(process.env.ADMIN_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@${host}`;
//sessions so we know who the user is
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: uri}),
}));

app.use(express.json());

//paths for HTML files to pull from
let reqPath = path.join(__dirname, '../public/');
app.use(express.static('public/static'));
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));

app.use('/admin', adminRouts);
app.use('/', loginRouts);
app.use('/', timeRouts);

//load our default page
app.get('/', (req, res) => {
    res.sendFile(reqPath + "/views/index.html");
});

//open the admin page if the use has the password
app.get('/admin', basicAuthMiddleware, (req, res) => {
    res.sendFile(reqPath + "/views/admin.html");
});

//start the server
var server = http.createServer(app).listen(port, async function () {
    await mongoose.connect(uri);
    console.log("Server started on " + port);
});

// Basic auth middleware to makesure only admin can admin
function basicAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    //makesure the user sent a password
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Authentication required');
    }

    //turn the responce into username and password
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Basic') {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Malformed authorization header');
    }

    let creds;
    try {
        creds = Buffer.from(parts[1], 'base64').toString();
    } catch (e) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Invalid base64 credentials');
    }

    const idx = creds.indexOf(':');
    if (idx < 0) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Invalid credentials format');
    }

    const usernameProvided = creds.slice(0, idx);
    const passwordProvided = creds.slice(idx + 1);

    //Check username and password aginst .env
    if (usernameProvided === ADMIN_USERNAME && passwordProvided === ADMIN_API_KEY) {
        return next();
    } else {
        console.log("Invalid Login\nUsername: " + usernameProvided + "\nPassword: " + passwordProvided);
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials');
}
