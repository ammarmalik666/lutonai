"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface Sponsor {
  id: string
  name: string
  logo: string
  description: string
  website: string | null
  tier: string
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("/api/sponsors")
        if (!response.ok) {
          throw new Error("Failed to fetch sponsors")
        }
        const data = await response.json()
        setSponsors(data.sponsors)
      } catch (error) {
        setError("Failed to load sponsors")
        console.error("Error fetching sponsors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading sponsors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  const platinumSponsors = sponsors.filter(s => s.tier.toLowerCase() === "platinum")
  const goldSponsors = sponsors.filter(s => s.tier.toLowerCase() === "gold")
  const silverSponsors = sponsors.filter(s => s.tier.toLowerCase() === "silver")
  const bronzeSponsors = sponsors.filter(s => s.tier.toLowerCase() === "bronze")

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
                    key={sponsor.id}
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
                    <p className="mt-4 text-center text-[#000000]/60">
                      {sponsor.description}
                    </p>
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
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Innovation Partner</h3>
                <p className="text-white/80">Partner with cutting-edge AI research and development projects that shape the future.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Brand Growth</h3>
                <p className="text-white/80">Enhance your brand visibility within the AI and technology community.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Social Impact</h3>
                <p className="text-white/80">Make a meaningful contribution to AI education and research advancement.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Network Access</h3>
                <p className="text-white/80">Connect with leading researchers, innovators, and industry professionals.</p>
              </motion.div>
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