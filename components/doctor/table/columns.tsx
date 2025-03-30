"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown  } from "lucide-react"
 
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { DoctorType } from "@/types/doctor.types"
import { deleteDoctor } from "@/services/doctor.services"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<DoctorType>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-12">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "no",
        header: "Sr.No",
        cell: ({row}) => <div className="min-w-14">{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({row}) => <div className="min-w-40">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => {
            const { firstName, lastName } = row.original; 
            return (
                <div className="min-w-60">
                    {`${firstName} ${lastName}`}
                </div>
            )
        },
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({row}) => <div className="min-w-40">{row.getValue("department")}</div>,
    },
    {
        accessorKey: "contact_no",
        header: ({ column }) => {
            return (
                <div className="flex justify-start items-center">
                    Contact No
                    <Button
                        className="text-start"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({row}) => <div className="min-w-40">{row.getValue("contact_no")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <div className="flex justify-start items-center">
                    Email
                    <Button
                        className="text-start"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({row}) => <div className="min-w-70">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "pending_appointment",
        header: "Pending Appointment",
        cell: ({row}) => <div className="text-center">{row.getValue("pending_appointment")}</div>,
    },
    {
        accessorKey: "complete_appointment",
        header: "Complete Appointment",
        cell: ({row}) => <div className="text-center">{row.getValue("complete_appointment")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const doctor = row.original;
            const [open, setOpen] = useState(false);
            return (
                <div className="min-w-25 text-center">
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/doctors/${doctor.id}`}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {`This action cannot be undone. This will permanently delete Doctor
                                            ${doctor.firstName} ${doctor.lastName} account and remove your data from our servers.`}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={async() => {
                                            const deletedDoctor = await deleteDoctor(doctor.id);
                                            if(deletedDoctor) setOpen(false);
                                        }}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
