import axios from "axios";
import JSZip from "jszip";

class FigmaService {

    private getFileKeyFromUrl(url: string): string {
        const regex = /design\/([^/]+)\//;
        const match = url.match(regex);

        if (match) {
            return match[1];
        }

        throw new Error('Invalid Figma URL');
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
}

const figmaService = new FigmaService();
export default figmaService;