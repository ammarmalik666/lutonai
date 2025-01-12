import mongoose from "mongoose"

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        maxLength: 1000
    },
    logo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    sponsorshipLevel: {
        type: String,
        required: true,
        enum: ["Platinum", "Gold", "Silver", "Bronze", "Partner"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Sponsor || mongoose.model("Sponsor", sponsorSchema) 