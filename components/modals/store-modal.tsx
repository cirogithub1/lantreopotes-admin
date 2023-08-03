"use client"

import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"	
// import axios from "axios"

import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { 
	Form, 
	FormControl, 
	FormField, 
	FormItem,
	FormLabel,
	FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

const formSchema = z.object({
	name: z.string().min(1, "Required")
})

export const StoreModal = () => {
	const storeModal = useStoreModal()
	const [loading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log('/components/modals/store-modal.tsx values: ', values)		
		try {
			setLoading(true)
			
			const resp = await fetch("/api/stores", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: values.name,
				})
			})

			const respToJson = await resp.json()
			console.log('/components/modals/store-modal.tsx respToJson: ', respToJson)

			window.location.assign(`/${respToJson.id}`)
			// here we use window for refreshing the page
			
			// const resp = await axios.post("/api/stores", values)
			// console.log('resp: ', resp)
			// window.location.assign(`/${respToJson.data.id}`)
		
		} catch (error) {
			console.log("/componenet/modals/store-modal error =", error)
			toast.error("Error creating store")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title="Create Store"
			description="Add a new Store"
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div>
				<div className="space-y-4 py-2 pb-4">
					<Form {...form} >
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField 
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input 
												disabled={loading}
												placeholder="E-commerce" 
												{...field}/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex pt-6 space-s-2 items-center justify-end">
								<Button 
									disabled={loading}
									variant={"outline"}
									onClick={storeModal.onClose}
								>
									Cancel</Button>

								<Button 
									disabled={loading} 
									type="submit"
								>
									Continue</Button>
								 
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	)
}