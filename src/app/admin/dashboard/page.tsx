"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, Title, Text, Grid, Metric, Icon } from "@tremor/react"
import { 
    DocumentTextIcon, 
    CalendarIcon, 
    UserGroupIcon, 
    BriefcaseIcon,
    UsersIcon 
} from "@heroicons/react/24/outline"

const stats = [
    {
        name: "TOTAL POSTS",
        value: "28",
        icon: DocumentTextIcon,
        description: "Total blog posts published",
        trend: "+12% from last month"
    },
    {
        name: "TOTAL EVENTS",
        value: "15",
        icon: CalendarIcon,
        description: "Active and upcoming events",
        trend: "+5% from last month"
    },
    {
        name: "TOTAL SUBSCRIBERS",
        value: "2,340",
        icon: UsersIcon,
        description: "Newsletter subscribers",
        trend: "+18% from last month"
    },
    {
        name: "TOTAL SPONSORS",
        value: "12",
        icon: UserGroupIcon,
        description: "Active sponsors",
        trend: "+2 from last month"
    },
    {
        name: "TOTAL OPPORTUNITIES",
        value: "45",
        icon: BriefcaseIcon,
        description: "Available opportunities",
        trend: "+7% from last month"
    }
]

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
    }, [status, router])

    if (status === "loading") {
        return <div className="text-white">Loading...</div>
    }

    return (
        <div className="max-w-7xl mx-auto">
            <Title className="text-3xl font-bold text-white mb-8">
                Welcome, {session?.user?.name}!
            </Title>
            
            <Grid numItemsLg={3} numItemsMd={2} numItemsSm={1} className="gap-6">
                {stats.map((item) => (
                    <div 
                        key={item.name}
                        className="bg-[#000000] border border-red-500 rounded-tremor-default shadow-lg transition-all duration-200 hover:border-red-600 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Text className="text-white text-sm font-semibold tracking-wider">
                                    {item.name}
                                </Text>
                                <Metric className="text-white text-3xl font-bold">
                                    {item.value}
                                </Metric>
                            </div>
                            <Icon 
                                icon={item.icon} 
                                size="lg"
                                className="text-red-500 h-12 w-12"
                            />
                        </div>
                        <Text className="text-gray-400 mt-4 text-sm">
                            {item.description}
                        </Text>
                        <div className="mt-2">
                            <Text className="text-red-500 text-sm font-medium">
                                {item.trend}
                            </Text>
                        </div>
                    </div>
                ))}
            </Grid>
        </div>
    )
} 