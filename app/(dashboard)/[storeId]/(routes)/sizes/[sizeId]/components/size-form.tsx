"use client"

import { FC, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Size } from "@prisma/client"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Size | null
}

export const SizeForm: FC<Props> = ({ initialData }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit size" : "Create size"
	const description = initialData ? "Edit size" : "Add a new size"
	const toastMessage = initialData ? "Size updated." : "Size created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			value: ""
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/size-form.tsx: onSubmit()', data)	
			setLoading(true)		

			let response
			if (initialData) 
			{
				response = await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, 
				{
					method: "PATCH",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// name: data.name,
						// value: data.value
						data: data
					})
				})
			} else {
				response = await fetch(`/api/${params.storeId}/sizes`, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// name: data.name,
						// value: data.value
						data: data
					})
				})
			}
			
			const respToJson = await response?.json()
			console.log('/sizeId/components/size-form respToJson: ', respToJson)
			
			router.refresh()
			router.push(`/${params.storeId}/sizes`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/size-form/onSubmit error: ', error)
			toast.error('Something went wrong.')

			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push(`/${params.storeId}/sizes`)
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
							render={({ field }) =>(
								<FormItem>
									<FormLabel>
										Name
									</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Size name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						
						<FormField 
							control={form.control}
							name="value"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>
										Value
									</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Size value" 
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