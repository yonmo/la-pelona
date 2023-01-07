// NPM Imports
import express, { Express } from 'express';
import crypto from 'crypto';
import fs, { Dirent } from 'fs';
import path from 'path';
import url from 'url';

// Useful Derived Constants
export const __dirname: string = path.dirname(url.fileURLToPath(import.meta.url));
export const __secret: string = crypto.randomBytes(16).toString('hex');

// Function for creating a pseudo random list ordering.
export function randomizeList(array: string[]) {
    let max: number = array.length;
    for (let i: number = 0; i < max; i++) {
        let x: number = Math.floor(Math.random() * (max - 1));
        let y: number = Math.floor(Math.random() * (max - 1));
        if (x != y) {
            let temp: string = array[x];
            array[x] = array[y];
            array[y] = temp;
        }
    }
    return(array);
}

// Function for getting the resolved directories under a path recursively.
export function getDirectories(start: string) {
    function isNotRestricted(dirent: Dirent) {
        return(dirent.name != 'tls');
    }
    var directories: string[] = fs.readdirSync(start, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory() && isNotRestricted(dirent))
        .map(dirent => path.resolve(start, dirent.name));
    if (directories.length != 0) {
        for (let i in directories) {
            directories = directories.concat(getDirectories(directories[i]));
        }
    }
    return(directories);
}

// Function for hashing the specified resolved path name with a randomly generated secret.
export function obfuscatePath(path: string) {
    let hmac = crypto.createHmac("sha256", __secret);
    hmac.update(__dirname + path);
    return('/' + hmac.digest('hex'));
}

// Function for initializing all of the content paths within the express middleware as hashed strings.
export function initializeAppPaths(app: Express) {
    var paths = getDirectories('./dist');
    for (let i = 0; i < paths.length; i++) {
        app.use(obfuscatePath(paths[i]), express.static(paths[i]));
    }
}