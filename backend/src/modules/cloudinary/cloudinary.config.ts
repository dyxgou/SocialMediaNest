import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_APP_NAME,
  cloud_api_key: process.env.CLOUDINARY_API_KEY,
  cloud_api_secret: process.env.CLOUDINARY_API_SECRET,
}));

export const PROVIDER = 'Cloudinary';
