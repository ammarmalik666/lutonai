import mongoose from "mongoose"

const registrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        organization: {
            type: String,
            required: true,
        },
        areaOfInterest: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.models.Registration ||
    mongoose.model("Registration", registrationSchema) 