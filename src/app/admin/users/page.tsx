"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users")
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            const data = await response.json()
            setUsers(data.users || [])
        } catch (error) {
            setError("Failed to load users")
            console.error("Error fetching users:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-lg text-white">Loading users...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-8 min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div variants={fadeIn}>
                    <h1 className="text-3xl font-bold text-white">Users</h1>
                    <p className="mt-2 text-gray-400">Manage user accounts and permissions.</p>
                </motion.div>
            </div>

            {/* Users Table */}
            <motion.div variants={slideIn}>
                <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800">
                                <TableHead className="text-gray-400">Name</TableHead>
                                <TableHead className="text-gray-400">Email</TableHead>
                                <TableHead className="text-gray-400">Role</TableHead>
                                <TableHead className="text-gray-400">Joined</TableHead>
                                <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-gray-500"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} className="border-gray-800">
                                        <TableCell className="text-white/90">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-white/90">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-800 text-white">
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-white/90">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-800 text-white hover:bg-gray-800"
                                                    onClick={() => {
                                                        // TODO: Implement edit user functionality
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </motion.div>
    )
} 