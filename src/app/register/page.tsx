"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fadeIn, staggerContainer } from "@/lib/animations"

export default function RegisterPage() {
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
              Join Our Community
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Be part of our growing community and stay updated with the latest events and opportunities.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.form
              className="space-y-8 rounded-xl bg-white p-8 shadow-lg ring-1 ring-[#000000]/10 dark:bg-[#000000] dark:ring-[#C8102E]/10"
              variants={fadeIn}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="focus-visible:ring-[#C8102E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="focus-visible:ring-[#C8102E]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="focus-visible:ring-[#C8102E]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Company or Institution"
                    className="focus-visible:ring-[#C8102E]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <Input
                    id="interests"
                    placeholder="AI, Machine Learning, Data Science"
                    className="focus-visible:ring-[#C8102E]"
                  />
                </div>
              </div>
              <motion.div
                className="pt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-[#C8102E] text-white hover:bg-[#BD0029]"
                >
                  Register Now
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              className="mb-12 text-3xl font-bold text-white sm:text-4xl"
              variants={fadeIn}
            >
              Benefits of Joining
            </motion.h2>
            <motion.div
              className="mt-10 grid gap-8 sm:grid-cols-2"
              variants={staggerContainer}
            >
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Early Access</h3>
                <p className="text-white/80">Get early access to events, workshops, and exclusive content.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Networking</h3>
                <p className="text-white/80">Connect with like-minded individuals and industry experts.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Resources</h3>
                <p className="text-white/80">Access to learning resources, tools, and best practices.</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Community</h3>
                <p className="text-white/80">Be part of a supportive community focused on growth.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 