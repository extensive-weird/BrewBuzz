
/**
 * S3 File Management Service
 * --------------------------
 * This module provides utility functions to handle file operations with a cloud storage service.
 * It supports uploading, deleting, and updating files, including general files and PDF receipts.
 *
 * Exported Functions:
 * - uploadFileToS3(file, folder): Uploads a given file buffer to a specified folder in storage.
 * - deleteFileFromS3(fileUrl): Deletes a file from storage based on its public URL.
 * - updateFileInS3(newFile, oldFileUrl, folder): Replaces an existing file with a new one.
 * - uploadReceiptToS3(file, folder): Specialized function for uploading PDF receipts to a designated folder.
 *
 * Key Features:
 * - Uses unique filenames to prevent conflicts
 * - Handles file content types appropriately
 * - Organizes uploads by folder for better storage management
 * - Includes basic error handling and feedback via logs
 *
 * Notes:
 * This service assumes environment variables are correctly configured for secure access.
 * It is designed for use in internal workflows such as business registration, order processing,
 * and file update flows within the application.
 */



import s3 from "../config/s3Config.mjs";
import { v4 as uuidv4 } from "uuid";



// Upload file to S3
export async function uploadFileToS3(file, folder = "business_cover_photos") {
    if (!file || !file.buffer) {
        throw new Error("No file provided for upload.");
    }

    // Check if environment variable is loaded correctly
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error("S3 Bucket Name is not defined in environment variables.");
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${uuidv4()}_${file.originalname}`, // Create a unique file name
        Body: file.buffer, // File content
        ContentType: file.mimetype, // MIME type of the file
        //ACL: "public-read", // Optional: Allows public read access to the uploaded file
    };

    try {
        const data = await s3.upload(params).promise();
        console.log("File uploaded successfully to S3:", data.Location);
        return data.Location; // Return the file URL
    } catch (error) {
        console.error("Error uploading file to S3:", error.message);
        throw new Error("Failed to upload file to S3.");
    }
}

// Delete a file from S3
export async function deleteFileFromS3(fileUrl) {
    if (!fileUrl) {
        throw new Error("No file URL provided for deletion.");
    }

    // Extract the file key from the URL
    const bucketName = process.env.S3_BUCKET_NAME;
    const urlParts = fileUrl.split("/");
    const key = urlParts.slice(3).join("/"); // Extract everything after the domain

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log("File deleted successfully from S3:", key);
    } catch (error) {
        console.error("Error deleting file from S3:", error.message);
        throw new Error("Failed to delete file from S3.");
    }
}

// Update a file in S3
export async function updateFileInS3(newFile, oldFileUrl, folder = "uploads") {
    // Upload the new file
    const newFileUrl = await uploadFileToS3(newFile, folder);

    // Delete the old file if it exists and isn't the default image
    if (oldFileUrl && !oldFileUrl.includes("default-image.jpeg")) {
        await deleteFileFromS3(oldFileUrl);
    }

    return newFileUrl; // Return the new file URL
}



// Upload receipts to S3
export async function uploadReceiptToS3(file, folder = "Receipts") {
    if (!file || !file.buffer) {
        throw new Error("No file provided for upload.");
    }

    if (!process.env.S3_BUCKET_NAME) {
        throw new Error("S3 Bucket Name is not defined in environment variables.");
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${uuidv4()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: "application/pdf", // Ensure the correct Content-Type
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`Receipt uploaded successfully to S3: ${data.Location}`);
        return data.Location; // Return the public URL
    } catch (error) {
        console.error("Error uploading receipt to S3:", error.message);
        throw new Error("Failed to upload receipt to S3.");
    }
}