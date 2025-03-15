import nodemailer from 'nodemailer'
import { welcomeEmailTemplate } from './email-templates/welcome'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    // Add DKIM, SPF verification
    dkim: {
        domainName: "lutonai.com",
        keySelector: "default",
        privateKey: process.env.DKIM_PRIVATE_KEY,
    },
})

export async function sendWelcomeEmail(name: string, email: string) {
    try {
        await transporter.sendMail({
            from: {
                name: "Luton AI",
                address: process.env.SMTP_FROM as string
            },
            to: email,
            subject: "Welcome to Luton AI Community! 🎉",
            html: welcomeEmailTemplate(name),
            headers: {
                'List-Unsubscribe': `<mailto:unsubscribe@lutonai.com>`,
                'Precedence': 'Bulk'
            },
            // Add message ID with your domain
            messageId: `<${Date.now()}@lutonai.com>`,
        })
        console.log("Welcome email sent successfully")
    } catch (error) {
        console.error("Error sending welcome email:", error)
        throw error
    }
} 