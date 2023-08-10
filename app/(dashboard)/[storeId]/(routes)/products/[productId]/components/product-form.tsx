"use client"

import { FC, useState } from "react"
import { Category, Color, Image, Product, Size } from "@prisma/client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// import axios from "axios"

const formSchema = z.object({
	name: z.string().min(1),
	images: z.object({ url: z.string()}).array(),
	price: z.coerce.number().min(1),	// problem passing decimals throu components
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Product & {
		images: Image[]
	} | null
	categories: Category[]
	colors: Color[]
	sizes: Size[]
}

export const ProductForm: FC<Props> = ({ initialData, categories, colors, sizes }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit product" : "Create product"
	const description = initialData ? "Edit product" : "Add a new product"
	const toastMessage = initialData ? "Product updated." : "Product created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ? {
			...initialData,
			price: parseFloat(String(initialData?.price))
		} : {
			name: "",
			images: [],
			price: 0,
			categoryId: "",
			colorId: "",
			sizeId: "",
			isFeatured: false,
			isArchived: false
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)		

			let response
			if (initialData) 
			{
				response = await fetch(`/api/${params.storeId}/products/${params.productId}`, 
				{
					method: "PATCH",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// name: data.name,
						// images: data.images,
						// price: data.price,
						// categoryId: data.categoryId,
						// colorId: data.colorId,
						// sizeId: data.sizeId,
						// isFeatured: data.isFeatured,
						// isArchived: data.isArchived
						data: data
					})
				})
			} else {
				response = await fetch(`/api/${params.storeId}/products`, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// name: data.name,
						// images: data.images,
						// price: data.price,
						// categoryId: data.categoryId,
						// colorId: data.colorId,
						// sizeId: data.sizeId,
						// isFeatured: data.isFeatured,
						// isArchived: data.isArchived
						data: data
					})
				})
			}
			
			const respToJson = await response?.json()
			console.log('/components/modals/store-modal.tsx respToJson: ', respToJson)
			
			router.refresh()
			router.push(`/${params.storeId}/products`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/dashboard/[product]/onSubmit/error: ', error);
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/products/${params.productId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push(`/${params.storeId}/products`)
			toast.success("Product deleted successfully")

		} catch (error) {
			toast.error("Something went wrong")
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
					{/* images */}
					<FormField 
						control={form.control}
						name="images"
						render={({ field }) =>(
							<FormItem>
								<FormLabel>Images</FormLabel>

								<FormControl>
									<ImageUpload 
										value={field.value.map((image) => image.url)}
										disabled={loading}
										onChange={(url) => field.onChange([...field.value, { url }])} 
										onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					
					<div className="grid grid-cols-3 gap-8">
						{/* name */}
						<FormField 
							control={form.control}
							name="name"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Product name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						
						{/* price is of type Decimal that's why the Warning */}
						<FormField 
							control={form.control}
							name="price"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Price</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="9.99" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* category */}
						<FormField 
							control={form.control}
							name="categoryId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Category</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{categories?.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* sixe */}
						<FormField 
							control={form.control}
							name="sizeId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Size</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a size" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{sizes?.map((size) => (
												<SelectItem
													key={size.id}
													value={size.id}
												>
													{size.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* color */}
						<FormField 
							control={form.control}
							name="colorId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Color</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a color" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{colors?.map((color) => (
												<SelectItem
													key={color.id}
													value={color.id}
												>
													{color.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Featured */}
						<FormField 
							control={form.control}
							name="isFeatured"
							render={({ field }) =>(
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox 
											checked = {field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>
											Featured ?
										</FormLabel>

										<FormDescription>
											This product will be displayed on the home page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						{/* Archived  */}
						<FormField 
							control={form.control}
							name="isArchived"
							render={({ field }) =>(
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox 
											checked = {field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>
											Archived ?
										</FormLabel>

										<FormDescription>
											This product will not be displayed on the home page
										</FormDescription>
									</div>
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