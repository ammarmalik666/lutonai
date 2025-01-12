import mongoose from "mongoose"

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        maxLength: 1000
    },
    type: {
        type: String,
        required: true,
        enum: ["Job", "Internship", "Project", "Mentorship", "Research", "Volunteer", "Learning"]
    },
    category: {
        type: String,
        required: true,
        enum: ["AI Development", "Data Science", "Business", "Design", "Research", "Education", "Community"]
    },
    level: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced", "All Levels"]
    },
    commitment: {
        type: String,
        required: true,
        enum: ["Full Time", "Part Time", "Flexible"]
    },
    skills: {
        type: [String],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    companyLogo: {
        type: String,
        required: true
    },
    applicationUrl: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    applicationDeadline: {
        type: Date
    },
    contactName: {
        type: String
    },
    contactEmail: {
        type: String
    },
    contactPhone: {
        type: String
    },
    remoteAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Opportunity || mongoose.model("Opportunity", opportunitySchema) 