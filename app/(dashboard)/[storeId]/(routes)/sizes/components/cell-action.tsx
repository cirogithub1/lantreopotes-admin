"use client"

import { FC, useState } from "react"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import { SizeColumn } from "./columns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"

interface Props {
	data: SizeColumn
}

export const CellAction: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id)
		toast.success("Copied to clipboard!")	
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/sizes/${data.id}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			toast.success("Size deleted successfully")

		} catch (error) {
			toast.error("Remember to remove products from this size first")
		} finally {
			setLoading(false)
			setOpen(false)
		}
	}

	return (
		<>
			<AlertModal 
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild >
					<Button className="h-8 w-8 p-0" variant={"ghost"} >
						<span className="sr-only">Open Menu</span>

						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						Actions
					</DropdownMenuLabel>

					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 h-4 w-4" />

						Copy
					</DropdownMenuItem>
					
					<DropdownMenuItem 
						onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
					>
						<Edit className="mr-2 h-4 w-4" />

						Update
					</DropdownMenuItem>
					
					<DropdownMenuItem
						onClick={() => setOpen(true)}
					>
						<Trash className="mr-2 h-4 w-4" />

						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}