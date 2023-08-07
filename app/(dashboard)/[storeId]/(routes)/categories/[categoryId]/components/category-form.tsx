"use client"

import { FC, useState } from "react"
import { Category } from "@prisma/client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Category | null
}

export const CategoryForm: FC<Props> = ({ initialData }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit category" : "Create category"
	const description = initialData ? "Edit category" : "Add a new category"
	const toastMessage = initialData ? "Category updated." : "Category created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			billboardId: ""
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)		

			let response
			if (initialData) 
			{
				response = await fetch(`/api/${params.storeId}/categories/${params.categoryId}`, 
				{
					method: "PATCH",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: data.name,
						billboardId: data.billboardId
					})
				})
			} else {
				response = await fetch(`/api/${params.storeId}/categories`, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: data.name,
						billboardId: data.billboardId
					})
				})
			}
			
			const respToJson = await response?.json()
			console.log('/components/modals/store-modal.tsx respToJson: ', respToJson)
			
			router.refresh()
			router.push(`/${params.storeId}/billboards`)
			toast.success(toastMessage)
			
		} catch (error) {
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/categories/${params.categoryId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push(`/${params.storeId}/categories`)
			toast.success("Category deleted successfully")

		} catch (error) {
			toast.error("Remember to remove categories from this category first")
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
			 
			<div className="flex items-center justify-between">
				<Heading 
					title= {title}
					description={description} />
				
				{initialData &&
					<Button
						variant={"destructive"}
						size={'sm'}
						disabled={loading}
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				}
			</div>

			<Separator />

			<Form {...form}>
				<form 
					className="space-y-6 w-full" 
					onSubmit={form.handleSubmit(onSubmit)}
				>					
					<div className="grid grid-cols-3 gap-8">
						<FormField 
							control={form.control}
							name="name"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Category name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						className="ml-auto"
						type="submit"
						disabled={loading}
					>
						{action}
					</Button>
				</form>
			</Form>
		</>
	)
}