const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { uploadFileToDrive } = require('../config/googleDrive');

// Use memory storage — no files written to disk
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow PDFs, images, and common document types
        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, images (JPG, PNG, WEBP), and Word documents are allowed.'));
        }
    },
});

/**
 * POST /api/upload/policy-copy
 * Upload a policy copy file to Google Drive
 * Returns: { url: "<shareable-google-drive-link>" }
 */
router.post('/policy-copy', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded. Please select a file.' });
        }

        const { buffer, originalname, mimetype } = req.file;

        // Create a unique filename with timestamp to avoid collisions
        const timestamp = Date.now();
        const sanitizedName = originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `policy_${timestamp}_${sanitizedName}`;

        const driveUrl = await uploadFileToDrive(buffer, fileName, mimetype);

        res.json({
            url: driveUrl,
            fileName: originalname,
            message: 'File uploaded successfully to Google Drive',
        });
    } catch (error) {
        console.error('Policy copy upload error:', error);

        const resolvedMessage =
            error?.response?.data?.error?.message ||
            error?.errors?.[0]?.message ||
            error?.message;

        if ((resolvedMessage || '').includes('Invalid file type')) {
            return res.status(400).json({ message: error.message });
        }

        if (
            (resolvedMessage || '').includes('Google Drive credentials not found') ||
            (resolvedMessage || '').includes('Invalid GOOGLE_SERVICE_ACCOUNT_JSON') ||
            (resolvedMessage || '').includes('GOOGLE_DRIVE_FOLDER_ID')
        ) {
            return res.status(500).json({ message: resolvedMessage });
        }

        res.status(500).json({
            message: resolvedMessage || 'Failed to upload file. Please try again.',
        });
    }
});

// Handle multer errors (file size, etc.)
router.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum allowed size is 10 MB.' });
    }
    next(error);
});

module.exports = router;
