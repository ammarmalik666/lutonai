"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, X } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Registration {
    _id: string
    name: string
    email: string
    organization: string
    areaOfInterest: string
    createdAt: string
}

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewRegistration, setViewRegistration] = useState<Registration | null>(null)
    const { toast } = useToast()

    // Fetch registrations
    useEffect(() => {
        fetchRegistrations()
    }, [])

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/admin/registrations')
            if (!response.ok) throw new Error('Failed to fetch registrations')
            const data = await response.json()
            setRegistrations(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load registrations",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleView = (id: string) => {
        const registration = registrations.find(r => r._id === id)
        if (registration) {
            setViewRegistration(registration)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/admin/registrations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (!response.ok) throw new Error('Failed to delete registration')

            setRegistrations(registrations.filter((reg) => reg._id !== id))
            toast({
                title: "Success",
                description: "Registration deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete registration",
                variant: "destructive",
            })
        } finally {
            setDeleteId(null)
        }
    }

    const columns = [
        { key: '_id', label: 'Sr#', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'organization', label: 'Organization', sortable: true },
        { key: 'areaOfInterest', label: 'Area of Interest', sortable: true },
        { key: 'actions', label: 'Actions' },
    ]

    const renderCell = (key: keyof Registration | 'actions', value: any, row: Registration) => {
        if (key === '_id') {
            return registrations.findIndex(r => r._id === value) + 1
        }
        if (key === 'actions') {
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100/20"
                        onClick={() => handleView(row._id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/20"
                        onClick={() => setDeleteId(row._id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
        return value
    }

    if (loading) {
        return (
            <div className="container py-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-gray-500">Loading registrations...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Registrations</h1>
                <p className="text-gray-400">Manage user registrations</p>
            </div>

            <DataTable
                data={registrations}
                columns={columns as any}
                renderCell={renderCell}
                itemsPerPage={10}
            />

            {/* View Dialog */}
            <Dialog open={!!viewRegistration} onOpenChange={() => setViewRegistration(null)}>
                <DialogContent className="bg-[#111827] text-white border-[#666662]">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>Registration Details</DialogTitle>
                        </div>
                    </DialogHeader>
                    {viewRegistration && (
                        <div className="space-y-4">
                            <div className="space-y-4 border-b border-[#666662] pb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Name</p>
                                    <p className="mt-1 text-[#D1D5DB]">{viewRegistration.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="mt-1 text-[#D1D5DB]">{viewRegistration.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Registration Date</p>
                                    <p className="mt-1 text-[#D1D5DB]">
                                        {new Date(viewRegistration.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Organization</p>
                                    <p className="mt-1 text-[#D1D5DB]">
                                        {viewRegistration.organization || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Area of Interest</p>
                                    <p className="mt-1 text-[#D1D5DB]">
                                        {viewRegistration.areaOfInterest || "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full bg-[#1F2937] hover:bg-[#374151] text-[#D1D5DB]"
                                    onClick={() => setViewRegistration(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="bg-[#111827] text-white border-[#666662]">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>Delete User</DialogTitle>
                        </div>
                    </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-4 border-[#666662] pb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Are you sure you want to delete this user?</p>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    className="border-[#666662] bg-gray-500 text-white hover:bg-[#1F2937] hover:text-white"
                                    onClick={() => setDeleteId(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => deleteId && handleDelete(deleteId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 