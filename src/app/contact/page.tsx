"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fadeIn, staggerContainer } from "@/lib/animations"
import { toast } from "sonner"

interface FormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      toast.success("Message sent successfully!")
      setFormData(initialFormData)
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

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
              Contact Us
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
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
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="focus-visible:ring-[#C8102E]"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="focus-visible:ring-[#C8102E]"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    className="focus-visible:ring-[#C8102E]"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    className="min-h-[150px] focus-visible:ring-[#C8102E]"
                    value={formData.message}
                    onChange={handleChange}
                    required
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
                  className="w-full bg-[#C8102E] text-white hover:bg-[#BD0029] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
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
              Other Ways to Connect
            </motion.h2>
            <motion.div
              className="mt-10 grid gap-8 sm:grid-cols-2"
              variants={staggerContainer}
            >
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Visit Us</h3>
                <p className="text-white/80">123 Innovation Street<br />Luton, LU1 1AA<br />United Kingdom</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Call Us</h3>
                <p className="text-white/80">Phone: +44 (0) 1234 567890<br />Fax: +44 (0) 1234 567891</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Email Us</h3>
                <p className="text-white/80">General: info@lutonai.org<br />Support: support@lutonai.org</p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-black/30 p-6 text-center"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">Follow Us</h3>
                <p className="text-white/80">Twitter: @LutonAI<br />LinkedIn: LutonAI<br />GitHub: LutonAI</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 