import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const fileOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (!/png$|jpeg$/.test(file.mimetype)) {
      cb(new UnsupportedMediaTypeException('File mimetype not allowed'), false);
    }

    cb(null, true);
  },
};
