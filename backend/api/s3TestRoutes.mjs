// Used for S3 testing 



import express from "express";
import multer from "multer";
import { uploadFileToS3, deleteFileFromS3 } from "../services/s3Service.mjs";

const router = express.Router();

// Test S3 upload route
router.post("/api/test-s3-upload", multer().single("testFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadedUrl = await uploadFileToS3(req.file);
        res.status(200).json({
            message: "File uploaded successfully",
            url: uploadedUrl,
        });
    } catch (error) {
        console.error("S3 Upload Test Error:", error.message);
        res.status(500).json({ message: "Failed to upload file to S3" });
    }
});

// Test S3 delete route
router.delete("/api/test-s3-delete", async (req, res) => {
    try {
        const { imageUrl } = req.body; // Provide the URL of the uploaded file
        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        await deleteFileFromS3(imageUrl);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("S3 Delete Test Error:", error.message);
        res.status(500).json({ message: "Failed to delete file from S3" });
    }
});

export default router;
