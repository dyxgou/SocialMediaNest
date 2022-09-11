import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { File } from './interfaces/file.interface';

@Injectable()
export class CloudinaryService {
  async updateImage(
    file: Express.Multer.File,
  ): Promise<File | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'SocialMedia Storage' },
        (error, result) => {
          if (error) {
            reject(error);
          }

          const { public_id, secure_url } = result;
          resolve({ public_id, secure_url });
        },
      );

      createReadStream(file.buffer).pipe(upload);
    });
  }
}
