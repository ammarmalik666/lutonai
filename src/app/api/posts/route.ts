import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { mkdir } from "fs/promises"
import path from "path"
import { writeFile } from "fs/promises"
import slugify from "slugify";
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

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        try {
            await writeFile(path.join(uploadsDir, "test.txt"), "")
        } catch (error) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Save thumbnail
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${Date.now()}-${file.name}`
        const filepath = path.join(uploadsDir, filename)
        await writeFile(filepath, buffer)
        // Generate a URL-friendly slug from the title
        
        // postslug = slug
        // Create event with thumbnail URL
        const post = await Post.create({
            title: formData.get("title"),
            slug: slugify(formData.get("title") as string, { lower: true, strict: true, trim: true }),
            content: formData.get("content"),
            category: formData.get("category"),
            tags: formData.get("tags"),
            thumbnail: `/uploads/${filename}`,
            createdAt: new Date(),
        })
        

        // Add slug to post data
        // console.log(post)
        // await post.save()
        return NextResponse.json({ success: true, data: { post } }, { status: 201 })
        // return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error("Post creating event:", error)
        return NextResponse.json(
            { error: "Post creating event" },
            { status: 500 }
        )
    }
}
