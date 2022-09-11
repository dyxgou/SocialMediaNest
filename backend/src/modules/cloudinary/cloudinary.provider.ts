import { v2 } from 'cloudinary';
import { PROVIDER } from './cloudinary.config';

export const CloudinaryProvider = {
  provide: PROVIDER,
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_APP_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      
    });
  },
};
