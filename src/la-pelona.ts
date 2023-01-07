// NPM Imports
import express, { Request, Response } from 'express';
import https from 'https';
import helmet from 'helmet';
import fs from 'fs';

// Local Imports
import { __dirname,  __secret, initializeAppPaths } from './utilities.js';
import * as handler from './handler.js';

// Comment this line out when pushing to production.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

// Define the type interface for the callback in the async wrapper.
interface Callback {
    (req: Request, res: Response, next: unknown);
}

// Define the method to wrap callback as a promise.
function AsyncWrapper (callback: Callback) {
    return function (req: Request, res: Response, next: unknown) {
        callback(req, res, next).catch(next);
    };
};

// Define the https parameters.
const options = {
    key: fs.readFileSync(__dirname + '/tls/key.pem'),
    cert: fs.readFileSync(__dirname + '/tls/cert.pem'),
    dhparam: fs.readFileSync(__dirname + '/tls/dh-strong.pem')
};

// Initialize the express server using the https parameters and the app,
var app = express();
var server = https.createServer(options, app);

// Setting PUG templates for views directory and engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/lib/www');

// Path obfuscation runtime call.
initializeAppPaths(app);

// Logging Middleware That Hasn't Been Tied Into The Express Middleware For Some Reason
async function log(req: Request, res: Response) {
    console.log((req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip) + ' -> ' + req.method + ': ' + req.url);
    await handler.tree(req.url, res);
};

// Utilize helmet at json.
app.use(helmet());
app.use(express.json());

// Manage GET requests to the server.
app.get('*', AsyncWrapper(async (req: Request, res: Response) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    log(req, res);
}));

// Server listen call.
server.listen(443);
