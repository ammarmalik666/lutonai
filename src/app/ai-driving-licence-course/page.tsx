import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function AIDrivingLicencePage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-[#C8102E]">
                <div className="relative z-10">
                    <div className="container flex h-[40vh] items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                                AI Driving Licence Course
                            </h1>
                            <p className="mx-auto mt-4 max-w-[700px] text-white/80 md:text-xl">
                                Master the fundamentals of AI and earn your certification
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Content */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Coming Soon
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            We're working hard to bring you a comprehensive AI certification program. 
                            Be among the first to know when we launch.
                        </p>

                        {/* Course Features */}
                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 p-6">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C8102E]/10">
                                    <svg
                                        className="h-6 w-6 text-[#C8102E]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Expert-Led Training</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Learn from industry professionals and AI experts
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-6">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C8102E]/10">
                                    <svg
                                        className="h-6 w-6 text-[#C8102E]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Comprehensive Curriculum</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Cover all essential aspects of AI technology
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-6">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C8102E]/10">
                                    <svg
                                        className="h-6 w-6 text-[#C8102E]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Certification</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Earn a recognized AI certification
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 