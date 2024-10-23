import path from 'path';
import { promises as fs } from 'fs';
import figmaService from './figma';
import { getRootPathAsync } from './utils';




const validateConfigFile = (configFile: string) => {
    const { apiKey, url } = JSON.parse(configFile);
    if(!apiKey || !url) {
        throw new Error('Invalid config file')
    }
    console.log(`apiKey ${apiKey} url ${url}`);
}


interface ConfigOptions {
    apiKey: string;
    fileKey: string;
    library: string;
}


export const config = async (config?: ConfigOptions) => {
    try {
        if(config && config.apiKey && config.fileKey) {
            console.log(config.apiKey, config.fileKey, config.library);
            const images = await figmaService.getImages(config.apiKey, config.fileKey);
            await figmaService.putImagesInPublicDirectory(images);
        } else {
            const root = await getRootPathAsync();
            const configPath = path.join(root, 'dtc.config.json');

            await fs.access(configPath, fs.constants.F_OK);
            const fileContents = await fs.readFile(configPath, 'utf8');
            validateConfigFile(fileContents);
        }  
        
    } catch (err) {
        console.error('Error reading configuration file:', err);
        process.exit(1);
    }
};
