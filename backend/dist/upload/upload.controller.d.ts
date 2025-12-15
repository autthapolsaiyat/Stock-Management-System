import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        blobName: string;
        success: boolean;
    }>;
    uploadBase64(image: string, folder?: string): Promise<{
        url: string;
        blobName: string;
        success: boolean;
    }>;
}
