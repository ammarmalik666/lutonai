"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

interface DataTableProps<T> {
    data: T[]
    columns: {
        key: keyof T | 'actions'
        label: string
        sortable?: boolean
    }[]
    renderCell?: (key: keyof T | 'actions', value: any, row: T) => React.ReactNode
    itemsPerPage?: number
}

export function DataTable<T>({
    data,
    columns,
    renderCell,
    itemsPerPage = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    // Sorting logic
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    // Pagination
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

    const handleSort = (key: keyof T) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        })
    }

    const getSortIcon = (columnKey: keyof T | 'actions') => {
        if (!sortConfig.key || columnKey === 'actions' || sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="ml-2 h-4 w-4" />
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
        )
    }

    return (
        <div className="w-full">
            <div className="rounded-md border border-[#666662] overflow-hidden bg-[#111827]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#666662]">
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key.toString()}
                                    className={`text-[#D1D5DB] bg-[#111827] ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                                    onClick={() => column.sortable && handleSort(column.key as keyof T)}
                                >
                                    <div className="flex items-center">
                                        {column.label}
                                        {column.sortable && (
                                            <span className="opacity-50 hover:opacity-100">
                                                {getSortIcon(column.key)}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow 
                                key={index} 
                                className="hover:bg-[#1F2937] border-b border-[#666662] last:border-0"
                            >
                                {columns.map((column) => (
                                    <TableCell 
                                        key={column.key.toString()}
                                        className="py-3 text-[#D1D5DB]"
                                    >
                                        {renderCell
                                            ? renderCell(column.key as keyof T, row[column.key as keyof T], row)
                                            : (row[column.key as keyof T] as React.ReactNode)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="text-center py-8 text-[#D1D5DB]"
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-[#D1D5DB]">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of{" "}
                    {data.length} entries
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm border border-[#666662] rounded-md bg-[#111827] text-[#D1D5DB] hover:bg-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm border border-[#666662] rounded-md bg-[#111827] text-[#D1D5DB] hover:bg-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
} 