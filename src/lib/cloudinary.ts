import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export function uploadImage(file: File, folder: string) {
  return new Promise<{ secure_url: string; public_id: string }>(async (resolve, reject) => {
    const bytes = Buffer.from(await file.arrayBuffer());
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error || !result) return reject(error ?? new Error('Upload gagal'));
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream.end(bytes);
  });
}

export async function deleteImage(publicId?: string | null) {
  if (publicId) await cloudinary.uploader.destroy(publicId);
}
