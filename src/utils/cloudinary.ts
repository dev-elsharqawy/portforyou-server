import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

export const cloudinaryConfig = cloudinary.v2;

cloudinaryConfig.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadImage = async (imageUrl: string): Promise<CloudinaryResponse> => {
  try {
    const result = await cloudinaryConfig.uploader.upload(imageUrl, {
      folder: 'portforyou',
    });
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export const destroyImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinaryConfig.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};
