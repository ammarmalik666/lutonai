import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

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