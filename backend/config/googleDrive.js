const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

/**
 * Get Google Drive auth client.
 *
 * Credentials are resolved in this priority order:
 *
 * 1. GOOGLE_SERVICE_ACCOUNT_JSON  — full JSON string (good for Vercel/production secrets)
 * 2. Individual env vars           — recommended for local .env files (no JSON file needed):
 *      GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
 *      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *      GOOGLE_SERVICE_ACCOUNT_PROJECT_ID     (optional but recommended)
 *      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID (optional)
 *      GOOGLE_SERVICE_ACCOUNT_CLIENT_ID      (optional)
 * 3. GOOGLE_SERVICE_ACCOUNT_KEY_FILE — path to a local JSON key file
 * 4. Default local JSON file in the same directory as this file
 */
function getDriveClient() {
    let credentials;

    // ── Method 1: Full JSON string in env var ─────────────────────────────────
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch (error) {
            throw new Error(
                'Invalid GOOGLE_SERVICE_ACCOUNT_JSON format. Please provide valid JSON credentials.'
            );
        }
    }

    // ── Method 2: Individual env vars (recommended for local .env) ────────────
    else if (
        process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL &&
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    ) {
        credentials = {
            type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE || 'service_account',
            project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID || '',
            private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID || '',
            // Env vars escape newlines as \n — restore them so the PEM is valid
            private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID || '',
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        };
    }

    // ── Method 3 & 4: Local JSON key file ────────────────────────────────────
    else {
        const configuredKeyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
        const defaultKeyPath = path.join(__dirname, 'decent-beacon-495806-m0-ea70e462ffbf.json');
        const keyFilePath = configuredKeyPath
            ? path.resolve(process.cwd(), configuredKeyPath)
            : defaultKeyPath;

        if (!fs.existsSync(keyFilePath)) {
            throw new Error(
                'Google Drive credentials not found.\n\n' +
                'Add the following to your backend/.env file:\n\n' +
                '  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=your-sa@your-project.iam.gserviceaccount.com\n' +
                '  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----\\n"\n' +
                '  GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=your-project-id\n\n' +
                'You can find these values in the service account JSON key file downloaded from Google Cloud Console.\n' +
                'Alternatively, set GOOGLE_SERVICE_ACCOUNT_JSON to the full JSON string, or set\n' +
                'GOOGLE_SERVICE_ACCOUNT_KEY_FILE to the path of your service account key JSON file.'
            );
        }

        try {
            credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
        } catch (error) {
            throw new Error(
                `Unable to read Google service account key file at ${keyFilePath}. Ensure it is valid JSON.`
            );
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

    // Upload file — supportsAllDrives is required for Shared Drive folders
    const response = await drive.files.create({
        supportsAllDrives: true,
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
        supportsAllDrives: true,
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
