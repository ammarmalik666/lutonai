import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

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
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const formData = await req.formData()
        const post = await Post.findById(params.id)
        
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        // Handle new thumbnail if provided
        const file = formData.get("thumbnail") as File
        let thumbnailPath = post.thumbnail // Keep existing thumbnail by default

        if (file) {
            // Delete old thumbnail
            if (post.thumbnail) {
                const oldPath = path.join(process.cwd(), "public", post.thumbnail)
                try {
                    await unlink(oldPath)
                } catch (error) {
                    console.error("Error deleting old thumbnail:", error)
                }
            }

            // Save new thumbnail
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filename = `${Date.now()}-${file.name}`
            const filepath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(filepath, buffer)
            thumbnailPath = `/uploads/${filename}`
        }

        // Update post
        const updatedPost = await Post.findByIdAndUpdate(
            params.id,
            {
                title: formData.get("title"),
                content: formData.get("content"),
                category: formData.get("category"),
                tags: JSON.parse(formData.get("tags") as string),
                thumbnail: thumbnailPath,
            },
            { new: true }
        )

        return NextResponse.json(updatedPost)
    } catch (error) {
        console.error("Error updating post:", error)
        return NextResponse.json(
            { error: "Error updating post" },
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