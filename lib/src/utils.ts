import path from 'path';
import { promises as fs } from 'fs';

export const getRootPathAsync = async (): Promise<string> => {
    const getRoot = async (dir: string): Promise<string> => {
        try {
            await fs.access(path.join(dir, 'package.json'));
            await fs.access(path.join(dir, 'node_modules'));
            return dir; 
        } catch (err) {
            const parentDir = path.dirname(dir);
            if (parentDir === dir) {
                throw new Error('Project root not found.');
            }
            return getRoot(parentDir); 
        }
    }

    return getRoot(process.cwd());
}


export const getPublicDirectoryPath = async () => {
    const root = await getRootPathAsync();
    try {
        await fs.access(path.join(root, 'public'));
        return path.join(root, 'public');
    } catch (err) {
        throw new Error('Project public directory not found.');
        
    }

}