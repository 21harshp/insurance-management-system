const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

/**
 * Get Google Drive auth client.
 * - In production (Vercel): reads credentials from GOOGLE_SERVICE_ACCOUNT_JSON env var
 * - In development: reads from the local JSON key file
 */
function getDriveClient() {
    let credentials;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        // Production: credentials stored as a JSON string in environment variable
        try {
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch (error) {
            throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON format. Please provide valid JSON credentials.');
        }
    } else {
        // Development: read from local file path
        const configuredKeyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
        const defaultKeyPath = path.join(__dirname, 'decent-beacon-495806-m0-ea70e462ffbf.json');
        const keyFilePath = configuredKeyPath
            ? path.resolve(process.cwd(), configuredKeyPath)
            : defaultKeyPath;

        if (!fs.existsSync(keyFilePath)) {
            throw new Error(
                'Google Drive credentials not found. Set GOOGLE_SERVICE_ACCOUNT_JSON or provide GOOGLE_SERVICE_ACCOUNT_KEY_FILE pointing to your service account key JSON file.'
            );
        }

        try {
            credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
        } catch (error) {
            throw new Error(`Unable to read Google service account key file at ${keyFilePath}. Ensure it is valid JSON.`);
        }
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
}

/**
 * Upload a file buffer to Google Drive and return a publicly shareable link.
 * @param {Buffer} fileBuffer - The file content as a buffer
 * @param {string} fileName - The name to save the file as on Drive
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<string>} - A shareable Google Drive view link
 */
async function uploadFileToDrive(fileBuffer, fileName, mimeType) {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is not set');
    }

    // Convert buffer to readable stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    // Upload file
    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
            mimeType: mimeType,
        },
        media: {
            mimeType: mimeType,
            body: bufferStream,
        },
        fields: 'id, name, webViewLink',
    });

    const fileId = response.data.id;

    // Make the file publicly viewable (anyone with the link)
    await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    // Return the direct view link
    const viewLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    return viewLink;
}

module.exports = { uploadFileToDrive };
