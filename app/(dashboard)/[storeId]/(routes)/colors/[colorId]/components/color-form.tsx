"use client"

import { FC, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Color } from "@prisma/client"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(4).regex(/^#/, {
		message: 'String must be a valid hex color code'
	})
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Color | null
}

export const ColorForm: FC<Props> = ({ initialData }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit color" : "Create color"
	const description = initialData ? "Edit color" : "Add a new color"
	const toastMessage = initialData ? "Color updated." : "Color created."
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
			// console.log('/dashboard/componenets/color-form.tsx: onSubmit()', data)	
			setLoading(true)		

			let response
			if (initialData) 
			{
				response = await fetch(`/api/${params.storeId}/colors/${params.colorId}`, 
				{
					method: "PATCH",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: data.name,
						value: data.value
					})
				})
			} else {
				response = await fetch(`/api/${params.storeId}/colors`, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: data.name,
						value: data.value
					})
				})
			}
			
			const respToJson = await response?.json()
			console.log('/colorId/components/color-form/onSubmit respToJson: ', respToJson)
			
			router.refresh()
			router.push(`/${params.storeId}/colors`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/color-form/onSubmit error: ', error)
			toast.error('Something went wrong.')

			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/colors/${params.colorId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			const respToJson = await resp?.json()
			console.log('/colorId/components/color-form/onDelete respToJson: ', respToJson)

			router.refresh()
			router.push(`/${params.storeId}/colors`)
			toast.success("Color deleted successfully")

		} catch (error) {
			toast.error("Remember to remove products from this color first")
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
											placeholder="Color name" 
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
										<div className="flex items-center gap-x-4">
											<Input 
												disabled={loading}
												placeholder="Color value" 
												{...field} />
											
											<div 
												// tailwindcss doesn't work with this state:
												// className={`border p-4 rounded-full bg-[${field.value}]`}
												// or:
												className="border p-4 rounded-full"
												style={{ backgroundColor: field.value }}
											/>
										</div>
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