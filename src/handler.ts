// NPM Imports
import { Response } from 'express';
import fs from 'fs/promises';

// Local Imports
import { __dirname, __secret, randomizeList, obfuscatePath } from './utilities.js';

// Branching execution flow based on request arguments.
export async function tree(req: string, res: Response) {
    // Setting the request operrands.
    var request_operands: string[] = req.split('/');
    
    // Menu Variables
    var links: string[] = ['papers', 'gallery', 'ethics', 'contact'];
    var puzzle: Buffer = await fs.readFile(__dirname + '/lib/code/puzzle.html');
    
    // CSS Paths
    var main_css: string = obfuscatePath(__dirname + '/lib/static') + '/main.css';
    var boards_css: string = obfuscatePath(__dirname + '/lib/static') + '/boards.css';

    // Splitting on first parameter.
    switch(request_operands[1]) {
        
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
                puzzle: puzzle,
                links: links,
                path: papers,
                titles: paper_titles,
                css: main_css
            });
            res.end();
            return;
        }

        // Branch for requests regarding the home page.
        case 'home': {
            let path: string = __dirname + '/lib/images/home';
            let imageDirectory: string[] = await fs.readdir(path);
            let image: string = obfuscatePath(path) + '/' + imageDirectory[0]; 
            res.render('home', {
                page: 'Idolum: Home',
                puzzle: puzzle,
                links: links,
                image: image,
                css: main_css
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
                puzzle: puzzle,
                links: links,
                images: images,
                titles: image_titles,
                css: main_css
            });
            res.end();
            return;
        }
        
        // Branch regarding my categorization of ethics.
        case 'ethics': {
            res.render('ethics', {
                page: 'Idolum: Ethics',
                puzzle: puzzle,
                links: links,
                css: main_css
            });
            res.end();
            return;
        }

        // Branch regarding my contact information.
        case 'contact': {
            res.render('contact', {
                page: 'Idolum: Contact',
                puzzle: puzzle,
                links: links,
                css: main_css
            });
            res.end();
            return;
        }

        // Branch regarding masonry aesthetic boards.
        case 'boards': {
            try {
                let path: string = __dirname + '/lib/images/boards/' + request_operands[2];
                let boards: Buffer = await fs.readFile(__dirname + '/lib/boards/' + request_operands[2] + '.html');
                let images: string[] = await fs.readdir(path);
                for (let i in images) {
                    images[i] = obfuscatePath(path) + '/' + images[i];
                };
                images = randomizeList(images);
                res.render('boards', {
                    page: 'Idolum: Boards',
                    css: boards_css,
                    images: images,
                    boards: boards
                });
                res.end();
                return;
            } catch (error) {};
        }
        
        // Branch for any layer failing to match.
        // Eventually I want to replace this with an anti-scraper and honeypot.
        default: {
            res.render('error', {
                error: 'Is this funny to you?'
            });
            res.end();
            return;
        }
    }
}