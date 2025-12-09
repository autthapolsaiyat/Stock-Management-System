import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private containerClient: ContainerClient;
  private readonly containerName = 'product-images';

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (connectionString) {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient = blobServiceClient.getContainerClient(this.containerName);
      this.logger.log('Azure Blob Storage connected');
    } else {
      this.logger.warn('AZURE_STORAGE_CONNECTION_STRING not set - uploads will fail');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<{ url: string; blobName: string }> {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage not configured');
    }

    // Generate unique filename
    const extension = file.originalname.split('.').pop();
    const blobName = `${folder}/${uuidv4()}.${extension}`;

    // Get blob client
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    // Upload file
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    this.logger.log(`File uploaded: ${blobName}`);

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }

  async deleteFile(blobName: string): Promise<void> {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage not configured');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
    this.logger.log(`File deleted: ${blobName}`);
  }

  // Upload base64 image
  async uploadBase64(
    base64Data: string,
    folder: string = 'products',
  ): Promise<{ url: string; blobName: string }> {
    if (!this.containerClient) {
      throw new Error('Azure Blob Storage not configured');
    }

    // Parse base64 data
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 format');
    }

    const mimeType = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, 'base64');

    // Determine extension from mime type
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const extension = extMap[mimeType] || 'jpg';

    // Generate unique filename
    const blobName = `${folder}/${uuidv4()}.${extension}`;

    // Get blob client
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    // Upload file
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: mimeType,
      },
    });

    this.logger.log(`Base64 file uploaded: ${blobName}`);

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }
}
