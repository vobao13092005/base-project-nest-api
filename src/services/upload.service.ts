import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

type DiscordUploadData = {
  url: string;
  filename: string;
  size: number;
};

@Injectable()
export class UploadService {
  async uploadToDiscord(files: Array<Express.Multer.File>): Promise<Array<DiscordUploadData>> {
    const form = new FormData();
    files.forEach(file => {
      form.append("file_" + randomUUID(), new Blob([file.buffer]), file.originalname);
    });
    const response = await fetch("https://discord.com/api/webhooks/1354104392416235674/MMtRy_UqYDB4XOEw4HGqDdxPOwLJHoNFAUvnSe3IXTk9n67bnfnvdvs7kwnfG6qLFhk1", {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    const discordImageUrls: Array<DiscordUploadData> = json.attachments.map(attachment => {
      return {
        url: attachment.url,
        filename: attachment.filename,
        size: +(Number.parseInt(attachment.size) / 1024 / 1024).toFixed(2)
      };
    });
    return discordImageUrls;
  }
}