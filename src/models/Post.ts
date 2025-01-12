import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 12,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
        minlength: 400,
        maxlength: 10000,
    },
    category: {
        type: String,
        required: true,
        enum: ["Science", "Technology", "General", "Artificial Intelligence", "Other"],
    },
    tags: {
        type: [String],
        default: [],
    },
    thumbnail: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.Post || mongoose.model("Post", postSchema) 