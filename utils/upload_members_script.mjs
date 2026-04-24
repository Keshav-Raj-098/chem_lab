// This file can be used to upload images to Cloudinary in a batch process.  


import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMBERS_DIR = path.join(__dirname, 'public', 'members');
const OUTPUT_FILE = path.join(__dirname, 'temp_member_images.json');

async function uploadToCloudinaryNode(buffer, filename, folder) {
  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: folder, public_id: filename.split('.')[0] }, // use original filename as base
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    return `${uploadResponse.public_id}.${uploadResponse.format}`;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

async function uploadMembers() {
    try {
        const files = fs.readdirSync(MEMBERS_DIR);
        const results = {};

        console.log(`Found ${files.length} images to upload...`);

        for (const filename of files) {
            const filePath = path.join(MEMBERS_DIR, filename);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                console.log(`Uploading ${filename}...`);
                const buffer = fs.readFileSync(filePath);
                const cloudinaryPath = await uploadToCloudinaryNode(buffer, filename, 'members');
                results[filename] = cloudinaryPath;
                console.log(`Successfully uploaded ${filename} as ${cloudinaryPath}`);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`Upload complete! Results saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("Error during batch upload:", error);
    }
}

uploadMembers();
