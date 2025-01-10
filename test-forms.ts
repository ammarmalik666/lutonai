const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // First ensure admin user exists
    const adminEmail = 'admin@lutonai.com'
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } })

    if (!admin) {
        console.log('Creating admin user...')
        const hashedPassword = await hash('Admin123!', 12)
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Admin User',
                hashedPassword,
                role: 'ADMIN'
            }
        })
    } else {
        console.log('Updating admin role...')
        admin = await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'ADMIN' }
        })
    }

    // Test Events
    console.log('\nCreating sample events...')
    const events = [
        {
            title: 'AI Workshop 2024',
            description: 'Join us for an intensive workshop on artificial intelligence',
            date: new Date('2024-05-15T09:00:00.000Z'),
            location: 'London',
            type: 'IN_PERSON',
            venue: 'Tech Hub',
            address: '123 Tech Street',
            city: 'London',
            country: 'UK',
            organizer: 'AI Institute',
            contactEmail: 'workshop@ai-institute.com',
            registrationDeadline: new Date('2024-05-01'),
            price: 199.99,
            category: 'Workshop',
            tags: 'AI,Machine Learning',
            status: 'PUBLISHED',
            isPublic: true
        },
        {
            title: 'Data Science Conference',
            description: 'Annual conference on data science and analytics',
            date: new Date('2024-06-20T10:00:00.000Z'),
            location: 'Online',
            type: 'ONLINE',
            organizer: 'Data Science Society',
            contactEmail: 'conference@datasci.org',
            registrationDeadline: new Date('2024-06-15'),
            price: 299.99,
            category: 'Conference',
            tags: 'Data Science,Analytics',
            status: 'PUBLISHED',
            isPublic: true
        }
    ]

    for (const event of events) {
        await prisma.event.create({ data: event })
        console.log(`Created event: ${event.title}`)
    }

    // Test Posts
    console.log('\nCreating sample posts...')
    const posts = [
        {
            title: 'Introduction to AI',
            content: 'Learn the basics of artificial intelligence...',
            category: 'Education',
            tags: 'AI,Beginner',
            published: true,
            author: { connect: { id: admin.id } }
        },
        {
            title: 'Machine Learning Best Practices',
            content: 'A guide to implementing ML in production...',
            category: 'Technical',
            tags: 'ML,Production',
            published: true,
            author: { connect: { id: admin.id } }
        }
    ]

    for (const post of posts) {
        await prisma.post.create({ data: post })
        console.log(`Created post: ${post.title}`)
    }

    // Test Opportunities
    console.log('\nCreating sample opportunities...')
    const opportunities = [
        {
            title: 'AI Research Internship',
            description: 'Join our research team for a summer internship',
            type: 'INTERNSHIP',
            category: 'AI_DEVELOPMENT',
            level: 'INTERMEDIATE',
            commitment: 'FULL_TIME',
            location: 'London',
            remote: true,
            company: 'AI Research Lab',
            skills: 'Python,TensorFlow,PyTorch',
            compensation: '£2000/month',
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-08-31'),
            isActive: true,
            featured: false,
            views: 0
        },
        {
            title: 'Machine Learning Engineer',
            description: 'Senior ML position for experienced engineers',
            type: 'JOB',
            category: 'AI_DEVELOPMENT',
            level: 'ADVANCED',
            commitment: 'FULL_TIME',
            location: 'Remote',
            remote: true,
            company: 'Tech Corp',
            skills: 'Python,ML,Cloud',
            compensation: '£80,000-£100,000',
            isActive: true,
            featured: false,
            views: 0
        }
    ]

    for (const opportunity of opportunities) {
        await prisma.opportunity.create({ data: opportunity })
        console.log(`Created opportunity: ${opportunity.title}`)
    }

    // Test Sponsors
    console.log('\nCreating sample sponsors...')
    const sponsors = [
        {
            name: 'Tech Corp',
            description: 'Leading technology company',
            website: 'https://techcorp.com',
            tier: 'PLATINUM',
            startDate: new Date(),
            endDate: null,
            isActive: true,
            contactEmail: 'sponsor@techcorp.com'
        },
        {
            name: 'AI Solutions',
            description: 'AI consulting and solutions',
            website: 'https://ai-solutions.com',
            tier: 'GOLD',
            startDate: new Date(),
            endDate: null,
            isActive: true,
            contactEmail: 'sponsor@ai-solutions.com'
        }
    ]

    for (const sponsor of sponsors) {
        await prisma.sponsor.create({ data: sponsor })
        console.log(`Created sponsor: ${sponsor.name}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 