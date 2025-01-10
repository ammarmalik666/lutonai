import { PrismaClient, EventType, EventStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing events
    await prisma.event.deleteMany({})

    // Create sample events
    const events = [
        {
            title: "AI Development Workshop",
            description: "Join us for an intensive workshop on AI development using the latest technologies and frameworks.",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            location: "San Francisco, CA",
            type: EventType.IN_PERSON,
            venue: "Tech Hub SF",
            capacity: 50,
            price: 0,
            category: "Workshop",
            status: EventStatus.PUBLISHED,
            isPublic: true,
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        },
        {
            title: "Machine Learning Hackathon",
            description: "A 48-hour hackathon focused on building innovative ML solutions for real-world problems.",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            location: "Online",
            type: EventType.ONLINE,
            capacity: 200,
            price: 0,
            category: "Hackathon",
            status: EventStatus.PUBLISHED,
            isPublic: true,
            image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
        },
        {
            title: "AI Ethics Conference",
            description: "A conference discussing the ethical implications of AI and responsible development practices.",
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
            location: "New York, NY",
            type: EventType.HYBRID,
            venue: "NYC Convention Center",
            capacity: 500,
            price: 299,
            category: "Conference",
            status: EventStatus.PUBLISHED,
            isPublic: true,
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
        },
        {
            title: "AI Networking Meetup",
            description: "Monthly meetup for AI professionals to network and share experiences.",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            location: "Seattle, WA",
            type: EventType.IN_PERSON,
            venue: "Seattle Tech Campus",
            capacity: 100,
            price: 0,
            category: "Meetup",
            status: EventStatus.PUBLISHED,
            isPublic: true,
            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
        },
    ]

    for (const event of events) {
        await prisma.event.create({
            data: event,
        })
    }

    console.log('Sample events have been created!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 