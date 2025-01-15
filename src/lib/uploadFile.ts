import { writeFile } from 'fs/promises'
import path from 'path'

export async function saveLocalFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueName = `${Date.now()}-${file.name}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    const filePath = path.join(uploadDir, uniqueName)
    
    // Save the file
    await writeFile(filePath, buffer)
    
    // Return the public URL
    return `/uploads/projects/${uniqueName}`
} 