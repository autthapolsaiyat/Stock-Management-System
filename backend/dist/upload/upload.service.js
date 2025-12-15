"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const storage_blob_1 = require("@azure/storage-blob");
const uuid_1 = require("uuid");
let UploadService = UploadService_1 = class UploadService {
    constructor() {
        this.logger = new common_1.Logger(UploadService_1.name);
        this.containerName = 'product-images';
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (connectionString) {
            const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
            this.containerClient = blobServiceClient.getContainerClient(this.containerName);
            this.logger.log('Azure Blob Storage connected');
        }
        else {
            this.logger.warn('AZURE_STORAGE_CONNECTION_STRING not set - uploads will fail');
        }
    }
    async uploadFile(file, folder = 'products') {
        if (!this.containerClient) {
            throw new Error('Azure Blob Storage not configured');
        }
        const extension = file.originalname.split('.').pop();
        const blobName = `${folder}/${(0, uuid_1.v4)()}.${extension}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
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
    async deleteFile(blobName) {
        if (!this.containerClient) {
            throw new Error('Azure Blob Storage not configured');
        }
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
        this.logger.log(`File deleted: ${blobName}`);
    }
    async uploadBase64(base64Data, folder = 'products') {
        if (!this.containerClient) {
            throw new Error('Azure Blob Storage not configured');
        }
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Invalid base64 format');
        }
        const mimeType = matches[1];
        const base64 = matches[2];
        const buffer = Buffer.from(base64, 'base64');
        const extMap = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        const extension = extMap[mimeType] || 'jpg';
        const blobName = `${folder}/${(0, uuid_1.v4)()}.${extension}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
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
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map