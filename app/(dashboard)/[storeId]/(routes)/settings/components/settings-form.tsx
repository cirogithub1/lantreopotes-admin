"use client"

import { FC, useState } from "react"
import { Store } from "@prisma/client"
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
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
// import axios from "axios"

interface Props {
	initialData: Store
}

const formSchema = z.object({
	name: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

export const SettingsForm: FC<Props> = ({ initialData }) => {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const params = useParams()
	const router = useRouter()
	const origin = useOrigin()

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)	
			const resp = await fetch(`/api/stores/${params.storeId}`, {
				method: "PATCH",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: data.name,
				})
			})

			const respToJson = await resp.json()
			console.log('/components/modals/store-modal.tsx respToJson: ', respToJson)
			
			router.refresh()
			toast.success("Store saved successfully")
			
			// await axios.patch (`/api/stores/${params.storeId}`, data)

		} catch (error) {
			toast.error("Error saving store")
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/stores/${params.storeId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push('/')
			toast.success("Store deleted successfully")

		} catch (error) {
			toast.error("Remember to remove products and categories first")
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
					title= "Settings"
					description="Manage your store settings" />
				
				<Button
					variant={"destructive"}
					size={'sm'}
					disabled={loading}
					onClick={() => setOpen(true)}
				>
					<Trash className="h-4 w-4" />

				</Button>
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
											placeholder="Store name" 
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
						Save changes
					</Button>
				</form>
			</Form>

			<Separator />

			<ApiAlert 
				title="PUBLIC_API_URL" 
				description={`${origin}/api/${params.storeId}`} 
				variant="public"/>
		</>
	)
}