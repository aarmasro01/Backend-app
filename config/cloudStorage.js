import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar basedatos.env en local
dotenv.config({ path: path.resolve(__dirname, '../basedatos.env') });

// Ruta temporal para Render
const tempKeyPath = '/tmp/gcs-key.json';

// Si Render tiene la variable GCS_KEY_JSON → crear archivo temporal
if (process.env.GCS_KEY_JSON) {
  fs.writeFileSync(tempKeyPath, process.env.GCS_KEY_JSON);
}

// Si NO existe GCS_KEY_JSON → estamos en local → usar gcs-key.json
const keyFileToUse = process.env.GCS_KEY_JSON
  ? tempKeyPath
  : path.resolve(__dirname, '../gcs-key.json');

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: keyFileToUse
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export const uploadToGCS = async (file, folder = 'productos') => {
  try {
    if (!file) return null;

    const timestamp = Date.now();
    const randomStr = Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    const fileName = `${folder}/${folder}-${timestamp}-${randomStr}.${extension}`;

    const fileUpload = bucket.file(fileName);
    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileName}`;
    console.log(`✅ Imagen subida a GCS: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error('❌ Error al subir a Google Cloud Storage:', error);
    throw error;
  }
};

export default { storage, bucket, uploadToGCS };

