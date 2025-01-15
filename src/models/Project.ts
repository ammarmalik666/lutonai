import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    partners: [{
        name: { type: String, required: true },
        logo: { type: String, required: true }
    }]
}, {
    timestamps: true
})

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema)
export default Project 