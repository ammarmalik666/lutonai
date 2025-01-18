import { google } from 'googleapis'
import { Readable } from 'stream'

// Helper function to clean private key
function cleanPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n').replace(/"/g, '')
}

const auth = new google.auth.GoogleAuth({
    credentials: {
        type: 'service_account',
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY || ''),
        project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
})

const drive = google.drive({ version: 'v3', auth })

export async function uploadToGoogleDrive(file: Buffer, fileName: string) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'image/jpeg',
            },
            media: {
                mimeType: 'image/jpeg',
                body: Readable.from(file),
            },
        })

        if (!response.data.id) throw new Error('File upload failed')

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        })

        return `https://drive.google.com/thumbnail?id=${response.data.id}`
    } catch (error) {
        console.error('Error uploading to Google Drive:', error)
        throw error
    }
} 