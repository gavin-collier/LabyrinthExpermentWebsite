"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const { MongoClient, ServerApiVersion } = require('mongodb'); //FOR TEST
const mongoose_1 = __importDefault(require("mongoose"));
const http = require('http');
const https = require('https');
//get local files to use
const user = require("./model/user");
const loginRouts = require('./loginRouts');
const timeRouts = require('./timeRouts');
const adminRouts = require('./adminRouts');
require('dotenv').config();
const port = 3000;
const app = (0, express_1.default)();
//get encoded .env values
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);
const host = process.env.DB_IP;
const secret = encodeURIComponent(process.env.SESSION_SECRET);
const ADMIN_USERNAME = encodeURIComponent(process.env.ADMIN_USERNAME);
const ADMIN_API_KEY = encodeURIComponent(process.env.ADMIN_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@${host}`;
//sessions so we know who the user is
app.use((0, express_session_1.default)({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: uri }),
}));
app.use(express_1.default.json());
//paths for HTML files to pull from
let reqPath = path_1.default.join(__dirname, '../public/');
app.use(express_1.default.static('public/static'));
app.use(express_1.default.static('public/views'));
app.use(express_1.default.static('public/scripts'));
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
var server = https.createServer(app).listen(port, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(uri);
        console.log("Server started on " + port);
    });
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
    }
    catch (e) {
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
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials');
}
//# sourceMappingURL=index.js.map