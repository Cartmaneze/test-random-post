import { Injectable } from '@nestjs/common';
import * as ImageSearch from 'image-search-google';
import * as fs from 'fs';
import {pipeline} from 'stream';
import {promisify} from 'util';
import got from "got";

const config = require('../config.json');

const pipe = promisify(pipeline);

@Injectable()
export class AppService {
    async search(): Promise<void> {
        const client = new ImageSearch(config.cseId, config.apiKey);
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const options = { page: randomPage, size: 'large' };
        try {
            const images = await client.search('corgi', options);
            const promises = [];
            for (let i=0; i<images.length; i++) {
                const promise = pipe(got.stream(images[i].url), fs.createWriteStream(`D:\\image${i}.jpg`));
                promises.push(promise);
            }
            await Promise.all(promises);
        } catch (err) {
            console.log(err);
        }
    }
}
