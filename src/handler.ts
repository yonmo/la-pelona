// NPM Imports
import { Response } from 'express';
import fs from 'fs/promises';

// Local Imports
import { __dirname, __secret, randomizeList, obfuscatePath } from './utilities.js';

// Branching execution flow based on request arguments.
export async function tree(req: string, res: Response) {
    // Stub the path and directory search variables
    let path: string = '';
    let directory: string[] = [];

    // Setting the request operrands.
    var request_operands: string[] = req.split('/');
    
    // Menu Variables
    var links: string[] = ['papers', 'gallery', 'ethics', 'boards'];
    // var puzzle: Buffer = await fs.readFile(__dirname + '/lib/code/puzzle.html');

    // CSS Paths
    var boards_css: string = obfuscatePath(__dirname + '/lib/static') + '/boards.css';
    var two_col_css: string = obfuscatePath(__dirname + '/lib/static') + '/two_col.css';
    var one_col_css: string = obfuscatePath(__dirname + '/lib/static') + '/one_col.css';

    // Path search for the logo ornaments
    path = __dirname + '/lib/ornaments';
    directory = await fs.readdir(path);

    var linebreak: string = obfuscatePath(path) + '/' + directory[0];
    var left: string = obfuscatePath(path) + '/' + directory[1];
    var right: string = obfuscatePath(path) + '/' + directory[2];

    // Path search for the tiling background
    path = __dirname + '/lib/backgrounds';
    directory = await fs.readdir(path);
    directory = randomizeList(directory);
    console.log(directory)

    var background: string = obfuscatePath(path) + '/' + directory[0];

    // Path search for sidebar header image
    path = __dirname + '/lib/headers';
    directory = await fs.readdir(path);
    directory = randomizeList(directory);

    var header: string = obfuscatePath(path) + '/' + directory[0];

    // Path search for sidebar icons
    path = __dirname + '/lib/icons';
    directory = await fs.readdir(path);

    var github: string = obfuscatePath(path) + '/github.svg';
    var discord: string = obfuscatePath(path) + '/discord.svg';
    var mail: string = obfuscatePath(path) + '/mail.svg';

    // Splitting on first parameter.
    switch(request_operands[1]) {

        // Branch for requests regarding the home page.
        case 'home': {
            res.render('home', {
                page: 'Idolum: Home',
                background: background,
                links: links,
                linebreak: linebreak,
                left: left,
                right: right,
                css: two_col_css,
                header: header,
                github: github,
                discord: discord,
                mail: mail
            });
            res.end();
            return;
        }
        
        // Branch for requests regarding research papers.
        case 'papers': {
            let path: string = __dirname + '/lib/www/includes/writings/papers';
            let papers: string = obfuscatePath(path);
            let paper_titles: string[] = await fs.readdir(path);
            for (let i in paper_titles) {
                paper_titles[i] = paper_titles[i].split('.')[0];
            }
            res.render('papers', {
                page: 'Idolum: Papers',
                background: background,
                links: links,
                linebreak: linebreak,
                left: left,
                right: right,
                css: two_col_css,
                header: header,
                github: github,
                discord: discord,
                mail: mail,
                path: papers,
                titles: paper_titles
            });
            res.end();
            return;
        }

        // Branch regarding the gallery page.
        case 'gallery': {
            let path: string = __dirname + '/lib/images/gallery';
            let images: string[] = await fs.readdir(path);
            let image_titles: string[] = [];
            for (let i in images) {
                images[i] = obfuscatePath(path) + '/' + images[i];
                image_titles[i] = images[i].split('.')[0].split('/')[2].split('_')[0];
            };

            res.render('gallery', {
                page: 'Idolum: Gallery',
                background: background,
                links: links,
                linebreak: linebreak,
                left: left,
                right: right,
                css: one_col_css,
                images: images,
                titles: image_titles
            });
            res.end();
            return;
        }
        
        // Branch regarding my categorization of ethics.
        case 'ethics': {
            res.render('ethics', {
                page: 'Idolum: Ethics',
                background: background,
                links: links,
                linebreak: linebreak,
                left: left,
                right: right,
                css: two_col_css,
                header: header,
                github: github,
                discord: discord,
                mail: mail
            });
            res.end();
            return;
        }

        // Branch regarding masonry aesthetic boards.
        case 'boards': {
            if (request_operands.length == 3) {
                try {
                    let image_path: string = __dirname + '/lib/images/boards/' + request_operands[2];
                    let document_path: string = __dirname + '/lib/www/includes/writings/boards/' + request_operands[2] + '.html';
                    let document: Buffer = await fs.readFile(document_path);
                    let images: string[] = await fs.readdir(image_path);
                    for (let i in images) {
                        images[i] = obfuscatePath(image_path) + '/' + images[i];
                    };
                    images = randomizeList(images);

                    res.render('board', {
                        page: 'Idolum: Boards',
                        css: boards_css,
                        images: images,
                        document: document
                    });
                } catch (error) {
                    res.end();
                    return;
                };
            } else {
                let document_path: string = __dirname + '/lib/www/includes/writings/boards';
                let boards: string[] = await fs.readdir(document_path);
                for (let i in boards) {
                    boards[i] = boards[i].split('.')[0];
                }
                res.render('boards', {
                    page: 'Idolum: Boards',
                    background: background,
                    links: links,
                    linebreak: linebreak,
                    left: left,
                    right: right,
                    css: two_col_css,
                    header: header,
                    github: github,
                    discord: discord,
                    mail: mail,
                    boards: boards
                });
            }

            res.end();
            return;
        }

        // Branch for any layer failing to match.
        // Eventually I want to replace this with an anti-scraper and honeypot.
        default: {
            res.end();
            return;
        }
    }
}