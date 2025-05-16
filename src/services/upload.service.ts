import { Injectable } from '@nestjs/common';
const FormData = require('form-data');
import fetch from 'node-fetch';
import { apiError } from 'src/helpers/response.helper';

type FileUploadData = {
  url: string;
  filename: string;
  size: number;
};

@Injectable()
export class UploadService {
  async uploadToCatbox(files: Array<Express.Multer.File>): Promise<FileUploadData[]> {
    const results: FileUploadData[] = [];

    for (const file of files) {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(), // cần thiết để đúng Content-Type boundary
      });

      const text = await response.text();

      if (!text.startsWith('https://')) {
        throw apiError('Can not upload file');
      }

      results.push({
        url: text.trim(),
        filename: file.originalname,
        size: +(file.size / 1024 / 1024).toFixed(2),
      });
    }

    return results;
  }
}
