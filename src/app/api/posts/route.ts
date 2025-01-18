import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { mkdir } from "fs/promises"
import path from "path"
import { writeFile } from "fs/promises"
import slugify from "slugify";
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function GET() {
    try {
        await dbConnect()
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ 
            success: true, 
            data: { 
                posts 
            } 
        })
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json(
            { success: false, error: "Error fetching posts" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect()

        const formData = await req.formData()
        
        // Handle file upload
        const file = formData.get("thumbnail") as File
        if (!file) {
            throw new Error("No thumbnail provided")
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        
        const fileUrl = await uploadToGoogleDrive(buffer, fileName)

        // return NextResponse.json({ url: fileUrl })

        // Create event with thumbnail URL
        const post = await Post.create({
            title: formData.get("title"),
            slug: slugify(formData.get("title") as string, { lower: true, strict: true, trim: true }),
            content: formData.get("content"),
            category: formData.get("category"),
            tags: formData.get("tags"),
            thumbnail: fileUrl,
            createdAt: new Date(),
        })
        

        return NextResponse.json({ success: true, data: { post } }, { status: 201 })
    } catch (error) {
        console.error("Post creating event:", error)
        return NextResponse.json(
            { error: "Post creating event" },
            { status: 500 }
        )
    }
}
