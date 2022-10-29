import express from 'express';
import https from 'https';
import helmet from 'helmet';
import fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import * as handler from './handler.js';

const options = {
    key: fs.readFileSync(__dirname + '/tls/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/tls/fullchain.pem'),
    dhparam: fs.readFileSync(__dirname + '/tls/dh-strong.pem')
};

// Global Variables
const CODE = 200;
const STATUS = 'OK';

var app = express();
var lapelona = https.createServer(options, app);

// Create A PUG Based View Engine That Has False Directory Calls As To Obfuscate Server Structure When Requesting
app.set('view engine', 'pug');
app.set('views', __dirname + '/www');
app.use('/83i8fjwskwi2oooqwpodnwidn', express.static(__dirname + '/static'));

// Image Serving
app.use('/jfj3if02ldlspwpenf439fjrk', express.static(__dirname + '/images/main'));
app.use('/nu43i8fj3kf93ifjkej39493m', express.static(__dirname + '/images/papers'));
app.use('/uh9v2h9f83hfe4lkjfl3o3920', express.static(__dirname + '/images/gallery'));
app.use('/34f0jlkjefk4390jrfnjo4nf3', express.static(__dirname + '/images/home'));

function AsyncWrapper (callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(next);
    };
};

async function log(request, response) {
    console.log((request.ip.indexOf(':') >= 0 ? request.ip.substring(request.ip.lastIndexOf(':') + 1) : request.ip) + ' -> ' + request.method + ': ' + request.url);
    await handler.tree(request.url, response);
};

app.use(helmet());
app.use(express.json());

app.get('*', AsyncWrapper(async (request, response) => {
    response.statusCode = CODE;
    response.statusMessage = STATUS;
    log(request, response);
}));

lapelona.listen(443);
