import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    eventType: { type: String, required: true },
    venue: String,
    address: String,
    city: String,
    country: String,
    organizers: String,
    contactEmail: String,
    contactPhone: String,
    capacity: Number,
    price: Number,
    registrationDeadline: Date,
    thumbnail: String,
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'CANCELLED'],
        default: 'DRAFT'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Event || mongoose.model("Event", eventSchema) 