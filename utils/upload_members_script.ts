
import { uploadToCloudinary } from '../lib/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMBERS_DIR = path.join(__dirname, 'public', 'members');
const OUTPUT_FILE = path.join(__dirname, 'temp_member_images.json');

async function uploadMembers() {
    try {
        const files = fs.readdirSync(MEMBERS_DIR);
        const results: Record<string, string> = {};

        console.log(`Found ${files.length} images to upload...`);

        for (const filename of files) {
            const filePath = path.join(MEMBERS_DIR, filename);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                console.log(`Uploading ${filename}...`);
                
                // Create a File-like object or use the buffer directly
                // uploadToCloudinary expects a File object in the current implementation
                // We'll mimic the internal logic of uploadToCloudinary but adapted for Node FS
                const buffer = fs.readFileSync(filePath);
                
                // Since the original function expects a 'File' object (Web API), 
                // and we are in Node, we might need a small adjustment or a mock.
                // However, I can see the source uses file.arrayBuffer().
                // Let's create a minimal Mock to satisfy the current uploadToCloudinary signature
                // OR better, we can just call it with a custom object if needed, but let's check cloudinary.ts again.
                
                /* 
                Original signature:
                export async function uploadToCloudinary(file: File, folder: string): Promise<string>
                */
               
                // Mock File object for Node
                const mockFile = {
                    arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
                } as any;

                const cloudinaryUrl = await uploadToCloudinary(mockFile, 'members');
                results[filename] = cloudinaryUrl;
                console.log(`Successfully uploaded ${filename}: ${cloudinaryUrl}`);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`Upload complete! Results saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("Error during batch upload:", error);
    }
}

uploadMembers();
