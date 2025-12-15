export declare class UploadService {
    private readonly logger;
    private containerClient;
    private readonly containerName;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        blobName: string;
    }>;
    deleteFile(blobName: string): Promise<void>;
    uploadBase64(base64Data: string, folder?: string): Promise<{
        url: string;
        blobName: string;
    }>;
}
