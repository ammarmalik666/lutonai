import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { uploadToGoogleDrive } from '@/utils/googleDrive'
import slugify from "slugify"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const post = await Post.findById(params.id)
        
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: post })
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json(
            { error: "Error fetching post" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const formData = await request.formData()
        
        // Parse tags properly
        const tags = formData.get("tags")
        const parsedTags = tags ? JSON.parse(tags as string) : []

        const updateData: any = {
            title: formData.get("title"),
            content: formData.get("content"),
            category: formData.get("category"),
            tags: parsedTags, // Use the parsed tags array
            slug: slugify(formData.get("title") as string, { lower: true, strict: true, trim: true }),
            updatedAt: new Date(),
        }

        // Handle new thumbnail if provided
        const file = formData.get("thumbnail") as File
        if (file?.size > 0) {
            const fileBuffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)
            updateData.thumbnail = fileUrl
        }

        const post = await Post.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: post })
    } catch (error) {
        console.error("Error updating post:", error)
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const post = await Post.findById(params.id)
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        // Delete thumbnail file
        if (post.thumbnail) {
            const filepath = path.join(process.cwd(), "public", post.thumbnail)
            try {
                await unlink(filepath)
            } catch (error) {
                console.error("Error deleting thumbnail:", error)
            }
        }

        // Delete post from database
        await Post.findByIdAndDelete(params.id)

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting post:", error)
        return NextResponse.json(
            { error: "Error deleting post" },
            { status: 500 }
        )
    }
} 