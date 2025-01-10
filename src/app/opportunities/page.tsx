"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { ApplicationForm } from "@/components/application-form"

interface Opportunity {
  id: string
  title: string
  type: string
  description: string
  location: string
  company: string
  deadline: string | null
  image: string | null
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/opportunities")
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities")
        }
        const data = await response.json()
        setOpportunities(data.opportunities)
      } catch (error) {
        setError("Failed to load opportunities")
        console.error("Error fetching opportunities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading opportunities...</div>
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C8102E] to-[#BD0029] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-radial from-[#C8102E]/50 to-transparent mix-blend-overlay opacity-50" />
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
              Join Our Team
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Explore opportunities to work with us and make a difference in the world of AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Opportunities Grid Section */}
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
              Current Opportunities
            </motion.h2>
            <motion.p
              className="mb-16 text-lg leading-8 text-[#000000]/60"
              variants={fadeIn}
            >
              Find the perfect role that matches your skills and aspirations.
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                className="group rounded-lg border border-[#C8102E]/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                variants={slideIn}
                custom={index}
              >
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={opportunity.image || "/opportunities/default.svg"}
                    alt={opportunity.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-[#C8102E]/10 px-3 py-1 text-sm font-medium text-[#C8102E]">
                    {opportunity.type}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-[#C8102E]">
                    {opportunity.title}
                  </h3>
                  <p className="mt-2 text-[#000000]/60">
                    {opportunity.description}
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-[#000000]/60">
                    <p>🏢 {opportunity.company}</p>
                    <p>📍 {opportunity.location}</p>
                    {opportunity.deadline && (
                      <p>⏰ Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>
                    )}
                  </div>
                  <ApplicationForm opportunityId={opportunity.id} />
                </div>
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
                <h3 className="mb-3 text-xl font-semibold text-white">Cutting-edge Projects</h3>
                <p className="text-white/80">Work on innovative AI projects that push the boundaries of technology.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Professional Growth</h3>
                <p className="text-white/80">Develop your skills with mentorship from industry experts.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Inclusive Environment</h3>
                <p className="text-white/80">Join a diverse team that values different perspectives and ideas.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Social Impact</h3>
                <p className="text-white/80">Make a real difference in the community through AI innovation.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 