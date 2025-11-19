"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn, scaleIn, cardHover } from "@/lib/animations"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F2F2F2] py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/10 to-[#000000]/5 opacity-5" />
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
              Empowering <span className="text-gradient">Luton</span> Through AI Innovation
            </motion.h1>
            <motion.p
              className="mb-10 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Join our community of innovators, learners, and leaders as we shape the future of artificial intelligence in Luton.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              variants={fadeIn}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#C8102E] hover:bg-[#BD0029] transition-all duration-300 hover-lift"
                >
                  <Link href="/register">Join Our Community</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E]/10"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Why Join Luton AI Club?
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Discover the benefits of being part of our thriving AI community.
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={scaleIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Learn</h3>
              <p className="text-[#666666]">
                Access workshops, tutorials, and hands-on projects to develop your AI skills.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={scaleIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Connect</h3>
              <p className="text-[#666666]">
                Network with fellow AI enthusiasts, researchers, and industry professionals.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={scaleIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Create</h3>
              <p className="text-[#666666]">
                Work on real-world AI projects that make a difference in our community.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#C8102E] to-[#BD0029] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Our Impact in Numbers
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Making a real difference in our community through AI innovation.
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="text-center"
              variants={scaleIn}
            >
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="mt-2 text-white/80">Community Members</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={scaleIn}
            >
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="mt-2 text-white/80">AI Projects</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={scaleIn}
            >
              <h3 className="text-4xl font-bold">30+</h3>
              <p className="mt-2 text-white/80">Events Held</p>
            </motion.div>
            <motion.div
              className="text-center"
              variants={scaleIn}
            >
              <h3 className="text-4xl font-bold">10+</h3>
              <p className="mt-2 text-white/80">Partner Organizations</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
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
              className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Our Programs
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Comprehensive learning paths and opportunities for everyone.
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">AI Bootcamps</h3>
              <p className="text-[#666666]">
                Intensive 8-week programs covering machine learning, deep learning, and AI applications.
                Perfect for beginners and intermediate learners.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Research Groups</h3>
              <p className="text-[#666666]">
                Join specialized research groups focusing on cutting-edge AI topics like NLP,
                computer vision, and reinforcement learning.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Industry Projects</h3>
              <p className="text-[#666666]">
                Work on real-world projects with local businesses and organizations to gain
                practical experience in AI implementation.
              </p>
            </motion.div>
            <motion.div
              className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
              variants={slideIn}
              whileHover={cardHover}
            >
              <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">Mentorship</h3>
              <p className="text-[#666666]">
                Get paired with experienced AI professionals who will guide your learning
                journey and career development.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Learning Paths Section */}
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
              className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Our AI Learning Paths
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Structured learning paths for every skill level
            </motion.p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: "BEGINNER TRACKS",
                description: "Introduction to AI concepts, Python for AI, and machine learning basics. These workshops provide a solid foundation for those new to the field."
              },
              {
                title: "INTERMEDIATE SESSIONS",
                description: "Deep learning architectures, natural language processing techniques, and computer vision projects. Hands-on projects help solidify understanding of these advanced topics."
              },
              {
                title: "EXPERT SEMINARS",
                description: "Cutting-edge AI research presentations, ethics in AI, and industry applications. Led by renowned experts and visiting professors, these seminars keep members at the forefront of AI innovation."
              },
              {
                title: "SPECIALISED TRACKS",
                description: "AI in healthcare, financial technology, environmental science, and more. These workshops focus on applying AI to specific domains, preparing members for diverse career paths."
              }
            ].map((path, index) => (
              <motion.div
                key={path.title}
                className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
                variants={scaleIn}
                whileHover={cardHover}
              >
                <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">{path.title}</h3>
                <p className="text-[#666666]">{path.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Idea to Impact Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#C8102E] to-[#BD0029] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              From Ideas to Impact
            </motion.h2>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Idea",
                description: "Members brainstorm innovative AI solutions to real-world problems, drawing inspiration from various fields and current local challenges."
              },
              {
                title: "Team Transformation",
                description: "Teams are formed from students in various departments, bringing together diverse skills and perspectives to tackle these challenges."
              },
              {
                title: "Development Phase",
                description: "Teams work on their projects using state-of-the-art AI tools and methodologies, with guidance from mentors and experts in the field."
              },
              {
                title: "Implementation & Testing",
                description: "Projects are tested and refined, often in collaboration with industry partners, research institutions, and the community."
              },
              {
                title: "Showcase & Impact",
                description: "Completed projects are showcased at club events and conferences, then implemented within the local community."
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="text-center"
                variants={scaleIn}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Competitions Section */}
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
              className="text-gradient text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Pushing the Boundaries of AI
            </motion.h2>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Annual AI Challenge",
                description: "Our event brings together teams from universities across the UK to solve complex AI problems within a 48-hour timeframe. Participants have access to powerful computing resources and mentorship from industry experts."
              },
              {
                title: "AI for Good Challenges",
                description: "We host themed hackathons addressing local and global issues such as climate change, education, healthcare accessibility, and nature conservation. These events encourage members to apply their AI skills to create positive social impact."
              },
              {
                title: "Global AI Competitions",
                description: "We aim to regularly participate in international AI contests, such as the Google AI Challenge, where our teams can benchmark their skills against global standards."
              },
              {
                title: "Industry-Sponsored Hackathons",
                description: "From tech giants and SMEs all over Europe, we collaborate on real-world challenges focused on big data solutions. These events offer lead sponsorship opportunities for participating companies."
              }
            ].map((competition) => (
              <motion.div
                key={competition.title}
                className="group rounded-lg border bg-card p-8 transition-all hover:border-[#C8102E] hover:shadow-lg hover:shadow-[#C8102E]/5"
                variants={slideIn}
                whileHover={cardHover}
              >
                <h3 className="mb-3 text-xl font-semibold text-[#C8102E]">{competition.title}</h3>
                <p className="text-[#666666]">{competition.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-[#F2F2F2] py-20">
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
              What Our Members Say
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Hear from our community members about their experiences with Luton AI Club
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 max-w-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet custom-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
              }}
              className="!pb-14"
            >
              {[
                {
                  name: "Julia",
                  position: "CMO, TAFU",
                  image: "/julia.png",
                  comment: "As a passionate advocate for the use of AI, committed to implementing ethical principles into its development and application, I am excited to contribute to the growing AI community at University of Bedfordshire and Luton. I believe AI has the potential to transform industries, and I hope to help shape its development in a responsible and ethical direction."
                },
                {
                  name: "Habib",
                  position: "Senior Lecturer, University of Bedfordshire",
                  image: "/images/habib.png",
                  comment: "The AI Club is an excellent platform is a beacon of innovation and collaboration, consistently fostering a vibrant community for AI enthusiasts and professionals alike. The club's emphasis on teamwork, mentorship, and inclusivity ensures that every participant, regardless of their background, feels empowered to contribute and grow."
                },
                {
                  name: "Massoud",
                  position: "Lecturer, University of Bedfordshire",
                  image: "/images/massoud.png",
                  comment: "The AI Club could be a platform for small and medium-sized enterprises (SMEs) to empower their capabilities through AI and data science. With support from experts at the University of Bedfordshire, SMEs could explore ways to adopt digital technologies, making it possible to improve productivity, streamline operations, and enhance their competitiveness in a rapidly evolving market."
                },
                {
                  name: "Nika",
                  position: "President, BCS Student Chapter",
                  image: "/nika.png",
                  comment: "As someone who is passionate about AI and Robotics, I love how these fields push the boundaries of innovation and problem-solving. Being the chair of the BCS student chapter allows me to contribute actively not only to our university society but also to a broader network."
                }
              ].map((testimonial, index) => (
                <SwiperSlide key={index} className="!height-auto">
                  <motion.div
                    className="rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#BD0029] p-8 shadow-xl h-auto"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col">
                      <div className="relative mb-8">
                        <svg
                          className="absolute -top-4 -left-4 h-8 w-8 text-white/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-white/90 text-lg leading-relaxed font-light">
                          {testimonial.comment}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/40">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-white/80">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Section */}
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
              Organisations We've Worked With
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Our team worked with leading organisations in the UK.
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                name: "National Health Service (NHS)",
                logo: "/sponsors/nhs.jpeg",
                link: "https://www.nhs.uk"
              },
              {
                name: "Switchshop",
                logo: "/sponsors/switch-shop.svg",
                link: "https://switchshop.co.uk/"
              },
              {
                name: "BCS Educational Affiliate",
                logo: "/sponsors/bcs.jpeg",
                link: "https://www.bcs.org/"
              },
              {
                name: "The Alan Turing Institute",
                logo: "/sponsors/alan-turing.jpeg",
                link: "https://www.turing.ac.uk/"
              },
              {
                name: "NVIDIA",
                logo: "/sponsors/nvidia.jpeg",
                link: "https://www.nvidia.com/"
              },
              {
                name: "London AI Centre for Value based Healthcare",
                logo: "/sponsors/ai-centre.jpeg",
                link: "https://www.aicentre.co.uk/"
              },
              {
                name: "TAFU",
                logo: "/sponsors/tafu.jpeg",
                link: "https://teensandfriendsunited.org/"
              },
              {
                name: "Bedfordshire Chamber of Commerce",
                logo: "/sponsors/bcc.jpeg",
                link: "https://www.chamber-business.com/"
              }
            ].map((sponsor) => (
              <motion.div
                key={sponsor.name}
                variants={fadeIn}
                className="group relative flex aspect-square w-full max-w-[200px]"
              >
                <motion.a
                  href={sponsor.link}
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
                      sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </div>
                  <div className="border-t border-[#C8102E]/20 bg-white p-3 text-center">
                    <p className="text-sm font-medium text-gray-800">{sponsor.name}</p>
                  </div>
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
} 