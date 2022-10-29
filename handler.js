
import fs from 'fs/promises';
import md from 'jstransformer-marked';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function tree(request, response) {
    var request = request.split('/');
    var links = ['papers', 'gallery', 'ethics', 'contact'];
    var puzzle = await fs.readFile(__dirname + '/code/puzzle.html');

    switch(request[1]) {
        case 'papers':
            var titles = await fs.readdir(__dirname + '/www/includes/writings/papers');
            for (let i = 0; i < titles.length; i++) {
                titles[i] = titles[i].split('.')[0];
            };

            var selection = Number(request[2]);

            if (selection < titles.length && selection >= 0) {
                var article = await fs.readFile(__dirname + '/www/includes/writings/papers/' + titles[selection] + '.md');
                var data = md.render(article.toString());
                response.render('papers', {
                    page: 'Idolum: Papers',
                    puzzle: puzzle,
                    links: links,
                    data: data,
                    titles: titles,
                    selection: selection,
                    css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
                });
                response.end();
                return;
            } else {
                await response.render('papers', {
                    page: 'Idolum: Papers',
                    puzzle: puzzle,
                    links: links,
                    data: null,
                    titles: titles,
                    selection: null,
                    css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
                });
                response.end();
                return;
            }

        case 'home':
            var imageDirectory = await fs.readdir(__dirname + '/images/home');
            var image = '/34f0jlkjefk4390jrfnjo4nf3/' + imageDirectory[0]; 
            await response.render('home', {
                page: 'Idolum: Home',
                puzzle: puzzle,
                links: links,
                image: image,
                css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
            });
            response.end();
            return;

        case 'gallery':
            var images = await fs.readdir(__dirname + '/images/gallery');
            var titles = [];
            for (let i = 0; i < images.length; i++) {
                images[i] = '/uh9v2h9f83hfe4lkjfl3o3920/' + images[i];
                titles[i] = images[i].split('.')[0].split('/')[2].split('_')[0];
            };
            response.render('gallery', {
                page: 'Idolum: Gallery',
                puzzle: puzzle,
                links: links,
                images: images,
                titles: titles,
                css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
            });
            response.end();
            return;
        
        case 'ethics':
            response.render('ethics', {
                page: 'Idolum: Ethics',
                puzzle: puzzle,
                links: links,
                css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
            });
            response.end();
            return;

        case 'contact':
            response.render('contact', {
                page: 'Idolum: Contact',
                puzzle: puzzle,
                links: links,
                css: '/83i8fjwskwi2oooqwpodnwidn/main.css'
            });
            response.end();
            return;
                
        default:
            response.render('error', {
                error: 'Is this funny to you?'
            });
            response.end();
            return;
    }
}