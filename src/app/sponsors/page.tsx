"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface Sponsor {
    _id: string
    name: string
    logo: string
    tier: string
    website?: string
    description?: string
}

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await fetch('/api/sponsors')
                const data = await response.json()
                setSponsors(data.sponsors)
            } catch (error) {
                console.error('Error fetching sponsors:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSponsors()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    const platinumSponsors = sponsors.filter(s => s?.tier?.toLowerCase() === "platinum")
    const goldSponsors = sponsors.filter(s => s?.tier?.toLowerCase() === "gold")
    const silverSponsors = sponsors.filter(s => s?.tier?.toLowerCase() === "silver")
    const bronzeSponsors = sponsors.filter(s => s?.tier?.toLowerCase() === "bronze")

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.h1
                            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
                            variants={fadeIn}
                        >
                            Our Sponsors
                        </motion.h1>
                        <motion.p
                            className="text-lg leading-8 text-white/80"
                            variants={fadeIn}
                        >
                            Meet the organizations that make our mission possible. Their support enables us to drive AI innovation and create opportunities in Luton.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* All Sponsors Grid Section */}
            <section className="relative overflow-hidden bg-background py-20">
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl"
                            variants={fadeIn}
                        >
                            Our Sponsors
                        </motion.h2>
                        <motion.p
                            className="mt-6 text-lg leading-8 text-muted-foreground"
                            variants={fadeIn}
                        >
                            Partnering with leading organizations to advance AI innovation in Luton.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {sponsors.map((sponsor) => (
                            <motion.div
                                key={sponsor._id}
                                variants={fadeIn}
                                className="group relative flex aspect-square"
                            >
                                <motion.a
                                    href={sponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-[#C8102E] bg-white shadow-lg transition-all duration-300 hover:border-[#C8102E]/70 hover:shadow-xl hover:shadow-[#C8102E]/10"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex-1 relative p-6">
                                        <Image
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            fill
                                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    </div>
                                    <div className="border-t border-[#C8102E]/20 bg-white p-3 text-center">
                                        <p className="text-sm font-medium text-gray-800">
                                            {sponsor.name}
                                        </p>
                                    </div>
                                </motion.a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Sponsors Sections */}
            {[
                { title: "Platinum Sponsors", sponsors: platinumSponsors },
                { title: "Gold Sponsors", sponsors: goldSponsors },
                { title: "Silver Sponsors", sponsors: silverSponsors },
                { title: "Bronze Sponsors", sponsors: bronzeSponsors },
            ].map(({ title, sponsors: tierSponsors }) => (
                tierSponsors.length > 0 && (
                    <section key={title} className="py-20">
                        <div className="container">
                            <motion.div
                                className="mx-auto max-w-3xl text-center"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                            >
                                <motion.h2
                                    className="mb-6 text-3xl font-bold tracking-tight text-[#C8102E] sm:text-4xl"
                                    variants={fadeIn}
                                >
                                    {title}
                                </motion.h2>
                            </motion.div>

                            <motion.div
                                className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                                variants={staggerContainer}
                            >
                                {tierSponsors.map((sponsor, index) => (
                                    <motion.div
                                        key={sponsor._id}
                                        className="flex flex-col items-center rounded-lg border border-[#C8102E]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                                        variants={slideIn}
                                        custom={index}
                                    >
                                        <div className="relative h-24 w-48">
                                            <Image
                                                src={sponsor.logo}
                                                alt={sponsor.name}
                                                className="object-contain"
                                                fill
                                            />
                                        </div>
                                        <h3 className="mt-6 text-xl font-semibold text-[#C8102E]">
                                            {sponsor.name}
                                        </h3>
                                        {sponsor.description && (
                                            <p className="mt-4 text-center text-[#000000]/60">
                                                {sponsor.description}
                                            </p>
                                        )}
                                        {sponsor.website && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="mt-6"
                                            >
                                                <Link href={sponsor.website} target="_blank">
                                                    Visit Website
                                                </Link>
                                            </Button>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )
            ))}

            {/* Why Join Us Section */}
            <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="mb-12 text-3xl font-bold text-white sm:text-4xl"
                            variants={fadeIn}
                        >
                            Why Join Us?
                        </motion.h2>
                        <motion.div
                            className="mt-10 grid gap-8 sm:grid-cols-2"
                            variants={staggerContainer}
                        >
                            {[
                                {
                                    title: "Innovation Partner",
                                    description: "Partner with cutting-edge AI research and development projects that shape the future."
                                },
                                {
                                    title: "Brand Growth",
                                    description: "Enhance your brand visibility within the AI and technology community."
                                },
                                {
                                    title: "Social Impact",
                                    description: "Make a meaningful contribution to AI education and research advancement."
                                },
                                {
                                    title: "Network Access",
                                    description: "Connect with leading researchers, innovators, and industry professionals."
                                }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-lg bg-black/30 p-6 text-center"
                                    variants={fadeIn}
                                >
                                    <h3 className="mb-3 text-xl font-semibold text-white">{benefit.title}</h3>
                                    <p className="text-white/80">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Become a Sponsor CTA */}
            <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
                            variants={fadeIn}
                        >
                            Become a Sponsor
                        </motion.h2>
                        <motion.p
                            className="mb-10 text-lg leading-8 text-white/80"
                            variants={fadeIn}
                        >
                            Join us in shaping the future of AI innovation in Luton. Partner with us to make a lasting impact on technology and education.
                        </motion.p>
                        <motion.div
                            variants={fadeIn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-[#C8102E] hover:bg-white/90"
                            >
                                <Link href="/contact">Get in Touch</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    )
} 