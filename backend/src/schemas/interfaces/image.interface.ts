import { raw } from '@nestjs/mongoose';

export type Image = Record<string, string>;

export const imageRaw: Image = raw({
  secure_url: String,
  public_id: String,
});
