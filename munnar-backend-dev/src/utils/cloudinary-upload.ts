import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

/**
 * Upload a file buffer to Cloudinary using streams (no temp files)
 * @param fileBuffer - The file buffer from multer.memoryStorage()
 * @param folder - Folder name in Cloudinary (e.g. 'hotels')
 * @returns Cloudinary upload result (URL, public_id, etc.)
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to a readable stream and pipe it
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary by public_id
 * @param publicId - The public_id of the image in Cloudinary
 * @returns Deletion result
 */
export const deleteFromCloudinary = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {console.error(error); return reject(error);}
      resolve(result);
    });
  });
};
