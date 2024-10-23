import axios from "axios";
import JSZip from "jszip";
import { getPublicDirectoryPath } from "./utils";
import path from 'path';
import { promises as fs } from 'fs';

class FigmaService {

    private getFileKeyFromUrl(urlString: string) {
        try {
            new URL(urlString); // will throw if url is not valid
            const regex = /design\/([^/]+)\//;
            const match = urlString.match(regex);
    
            if (match) {
                return match[1];
            }
    
            throw new Error('Invalid Figma URL');
        } catch (err) {
            console.error('not a valid url return so its the fileKey');
            return urlString;
        }
    }

    async getImages(apiKey: string, url: string): Promise<Buffer> {
        const fileKey = this.getFileKeyFromUrl(url);

        const { data } = await axios.get(`https://api.figma.com/v1/files/${fileKey}/images` , {
            headers:{ 'X-Figma-Token': apiKey }
        });

        if(data.err) {
            throw new Error('Failed to fetch image data from Figma');
        }

        const zip = new JSZip();
        console.log(data.meta.images)
        const promises = Object.entries<string>(data.meta.images).map(([key, imageUrl]) => {
            return axios.get(imageUrl, { responseType: "arraybuffer" })
            .then(({data}) => {
                const fileName = `${key}.png`;
                zip.file(fileName, data);
            })
            .catch(err => {
                console.error(`Error downloading image from ${imageUrl}:`, err);
            });
        });

        await Promise.all(promises);

        if (Object.keys(zip.files).length === 0) {
            throw new Error('No images found in the Figma file');
        }

        return await zip.generateAsync({ type: "nodebuffer" });
    }


    async putImagesInPublicDirectory(images: Buffer) {
        const publicDirectory = await getPublicDirectoryPath();
        const zip = new JSZip();
        try {
            const unzippedFiles = await zip.loadAsync(images);
            const savePromises = Object.keys(unzippedFiles.files).map(async (filename) => {
                const file = unzippedFiles.files[filename];
                if (!file.dir) { 
                    const fileBuffer = await file.async("nodebuffer");
                    const filePath = path.join(publicDirectory, filename);
                    try { //prevent duplicates
                        await fs.access(filePath);
                    } catch (err) {
                        await fs.writeFile(filePath, fileBuffer);
                    }
                }
            });
    
            await Promise.all(savePromises);
        } catch (error) {
            console.error("Error saving images to public directory:", error);
            throw new Error("Failed to save images to public directory");
        }
    }
}

const figmaService = new FigmaService();
export default figmaService;