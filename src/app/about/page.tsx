"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

const team = [
  {
    name: "Dr. Edward Braund",
    role: "Head of School",
    bio: "Designs new intelligences and leads a dedicated team of researchers and educators",
    image: "/images/Ed.png",
  },
  {
    name: "Dr. Habib Rehman",
    role: "Senior Lecturer",
    bio: "Specializing in decntralised AI systems.",
    image: "/images/habib.png",
  },
  {
    name: "Dr. Azadeh Esfandiari",
    role: "Lecturer",
    bio: "Focusing on responsible AI development and societal impact.",
    image: "/images/azadeh.png",
  },
  {
    name: "Dr. Massoud Khodadadzadeh",
    role: "Lecturer",
    bio: "Applying AI to improve healthcare and patient outcomes.",
    image: "/images/massoud.png",
  },
  {
    name: "Dr. Rebecca Harrop",
    role: "Senior Lecturer",
    bio: "Building bridges between academia and industry in AI innovation.",
    image: "/images/rebecca.png",
  },
  {
    name: "Dr. Chamitha De Alwis",
    role: "Senior Lecturer",
    bio: "Specializing in distributed AI for Communication and Cybersecurity.",
    image: "/images/chamitha.png",
  },
  {
    name: "Dr. Danai Korres",
    role: "Lecturer",
    bio: "Specialising in Human-Oriented AI and Immersive Analytics.",
    image: "/images/danai.png",
  },
  {
    name: "Dr. Mitul Shukla",
    role: "Senior Lecturer",
    bio: "Focusing on Emerging Technologies and AI.",
    image: "/images/mitul.png",
  },
  {
    name: "Dr. Joshua Chukwuma",
    role: "Lecturer",
    bio: "Expert in HCI, Data and e-governance.",
    image: "/images/joshua.png",
  },
  {
    name: "Dr. Tahmina Ajmal",
    role: "Associate Professor",
    bio: "Specializing in IoT and Cyber Physical Systems.",
    image: "/images/tahmina.png",
  },
  {
    name: "Dr. Syed Atif Moqurrab",
    role: "Lecturer",
    bio: "Focusing on privacy in AI systems and data protection.",
    image: "/images/atif.png",
  },
  {
    name: "Dr. Mahmoud Artemi",
    role: "Lecturer",
    bio: "Focusing on Information Retrieval and Natural Language Processing.",
    image: "/images/mahmoud.png",
  },
  {
    name: "Asad Ullah",
    role: "Senior Lecturer",
    bio: "Expert in AI agents, automation workflows, and intelligent system design.",
    image: "/images/asad.png",
  },
  {
    name: "Yanran Li",
    role: "Lecturer",
    bio: "Expert in AI ads creations, Generative AI, Video and motion generations.",
    image: "/images/Yanran.png",
  },
  {
    name: "Prof. Enjie Liu",
    role: "Associate Professor",
    bio: "Expert in transparency in multimodal AI reasoning and the use of LLMs in various applications.",
    image: "/images/Enjie.png",
  },
  {
    name: "Mary Ferguson",
    role: "Lecturer",
    bio: "Tutor, Broadcast and Digital Media",
    image: "/images/Mary.png",
  },
  {
    name: "David Pike",
    role: "Lecturer",
    bio: "Expert in Application of AI to educational and learning contexts.",
    image: "/images/david.png",
  },
]

export default function AboutPage() {
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
              About Us
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Discover our mission to advance AI innovation and education in Luton.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
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
              Our Mission
            </motion.h2>
            <motion.p
              className="mb-16 text-lg leading-8 text-[#000000]/60"
              variants={fadeIn}
            >
              We are dedicated to advancing AI technology while ensuring its responsible and ethical development.
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Innovation</h3>
              <p className="text-[#000000]/60">
                Pushing the boundaries of AI technology through cutting-edge research and development.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Education</h3>
              <p className="text-[#000000]/60">
                Providing comprehensive AI education and training to students and professionals.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Impact</h3>
              <p className="text-[#000000]/60">
                Creating positive change in our community through AI applications.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </motion.h2>
            <motion.div
              className="mt-10 grid gap-8 sm:grid-cols-2"
              variants={staggerContainer}
            >
              <motion.div
                className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold">Excellence</h3>
                <p className="text-white/80">
                  Striving for the highest standards in research and education.
                </p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold">Ethics</h3>
                <p className="text-white/80">
                  Ensuring responsible and ethical AI development.
                </p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold">Innovation</h3>
                <p className="text-white/80">
                  Embracing new ideas and pushing technological boundaries.
                </p>
              </motion.div>
              <motion.div
                className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
                variants={fadeIn}
              >
                <h3 className="mb-3 text-xl font-semibold">Community</h3>
                <p className="text-white/80">
                  Building strong relationships and fostering collaboration.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </motion.h2>
            <motion.p
              className="mb-16 text-lg leading-8 text-[#000000]/60"
              variants={fadeIn}
            >
              Our diverse team of experts is passionate about advancing AI technology.
            </motion.p>
          </motion.div>
          <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideIn}
                custom={index}
              >
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="aspect-[1/1] w-full bg-gray-100 object-cover transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={400}
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#C8102E]">
                    {member.name}
                  </h3>
                  <p className="text-base text-[#000000]/60">{member.role}</p>
                  <p className="mt-4 text-sm text-[#000000]/60">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
} 