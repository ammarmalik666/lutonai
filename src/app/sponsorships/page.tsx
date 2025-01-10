"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface SponsorshipTier {
  name: string
  price: string
  description: string
  benefits: string[]
  featured?: boolean
}

const tiers: SponsorshipTier[] = [
  {
    name: "Bronze",
    price: "£1,000",
    description: "Perfect for small businesses looking to support AI innovation.",
    benefits: [
      "Logo on website",
      "Social media mentions",
      "2 event tickets",
      "Newsletter recognition",
    ],
  },
  {
    name: "Silver",
    price: "£5,000",
    description: "Ideal for growing companies wanting to engage with AI community.",
    benefits: [
      "All Bronze benefits",
      "Workshop participation",
      "5 event tickets",
      "Blog post feature",
      "Quarterly meetup access",
    ],
  },
  {
    name: "Gold",
    price: "£10,000",
    description: "For organizations committed to advancing AI development.",
    benefits: [
      "All Silver benefits",
      "Speaking opportunities",
      "10 event tickets",
      "Project collaboration",
      "Monthly strategy meetings",
      "Custom workshop session",
    ],
    featured: true,
  },
  {
    name: "Platinum",
    price: "£25,000",
    description: "Strategic partnership for industry leaders.",
    benefits: [
      "All Gold benefits",
      "Board membership",
      "20 event tickets",
      "Research collaboration",
      "Custom AI solutions",
      "Priority access to talent",
      "Co-branded initiatives",
    ],
  },
]

export default function SponsorshipsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
              variants={fadeIn}
            >
              Sponsorship Opportunities
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Partner with us to shape the future of AI and make a lasting impact in the tech community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="mb-6 text-3xl font-bold tracking-tight text-[#C8102E] sm:text-4xl"
              variants={fadeIn}
            >
              Sponsorship Tiers
            </motion.h2>
            <motion.p
              className="mb-16 text-lg leading-8 text-[#000000]/60"
              variants={fadeIn}
            >
              Choose the sponsorship level that aligns with your organization's goals and vision.
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className={`group relative rounded-2xl p-8 ${tier.featured
                  ? "bg-gradient-to-br from-[#C8102E] to-[#BD0029] text-white shadow-lg ring-1 ring-[#C8102E]/50"
                  : "bg-[#000000]/5 ring-1 ring-[#000000]/20"
                  }`}
                variants={slideIn}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${tier.featured ? "text-white" : "text-[#C8102E]"
                      }`}>
                      {tier.name}
                    </h3>
                    <p className={`mt-2 text-lg ${tier.featured ? "text-white/80" : "text-[#000000]/60"
                      }`}>
                      {tier.price}
                    </p>
                    <p className={`mt-4 ${tier.featured ? "text-white/80" : "text-[#000000]/60"
                      }`}>
                      {tier.description}
                    </p>
                  </div>
                  <ul className="flex-1 space-y-4">
                    {tier.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className={`flex items-center gap-2 ${tier.featured ? "text-white/80" : "text-[#000000]/60"
                          }`}
                      >
                        <svg
                          className={`h-5 w-5 shrink-0 ${tier.featured ? "text-white" : "text-[#C8102E]"
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${tier.featured
                      ? "bg-white text-[#C8102E] hover:bg-white/90"
                      : "bg-[#C8102E] text-white hover:bg-[#BD0029]"
                      }`}
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
                {tier.featured && (
                  <div className="absolute -top-4 right-8 rounded-full bg-white px-4 py-1 text-xs font-semibold text-[#C8102E]">
                    Popular
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

      {/* Impact Section */}
      <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Make an Impact
            </motion.h2>
            <motion.p
              className="mb-10 text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Your sponsorship helps us drive innovation, support emerging talent, and create meaningful change in the AI community.
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
                <Link href="/contact">Become a Sponsor</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 