import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { productId: string }}) 
{
	if (!params.productId) {
		return new NextResponse("Product id is required", { status: 401})
	}

	try {
		// const product = await prismadb.product.deleteMany({
		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				size: true,
				color: true
			}
		})

		return NextResponse.json(product)
		
	} catch (error) {
		console.log('[PRODUCT_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { storeId: string, productId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { data } = body
	const { 
		name, 
		price,
		categoryId, 
		colorId, 
		sizeId, 
		images, 
		isFeatured, 
		isArchived } = data

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}
	
	if (!name) {
		return new NextResponse("Name is required in post", { status: 400})			
	}

	if (!price) {
		return new NextResponse("Price is required in post", { status: 400})			
	}

	if (!categoryId) {
		return new NextResponse("Category ID is required in post", { status: 400})			
	}

	if (!colorId) {
		return new NextResponse("Color ID is required in post", { status: 400})			
	}

	if (!sizeId) {
		return new NextResponse("Size ID is required in post", { status: 400})			
	}

	if (!images || !images.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!params.productId) {
		return new NextResponse("Product id is required in patch", { status: 401})
	}

	try {
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403})
		}

		await prismadb.product.update({
			where: {
				id: params.productId
			},
			data: {
				name, 
				price, 
				categoryId, 
				colorId, 
				sizeId, 
				images: {
					deleteMany: {}
				}, 
				isFeatured, 
				isArchived
			}
		})

		const product = await prismadb.product.update({
			where: {
				id: params.productId
			},
			data: {
				images: {
					createMany: {
						data: [
							...images.map((image: {url: string}) => image)
						]
					}
				}
			}
		})

		return NextResponse.json(product)
		
	} catch (error) {
		console.log('[PRODUCT_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { storeId: string, productId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.productId) {
		return new NextResponse("Product id is required", { status: 401})
	}

	try {
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403})
		}

		// const product = await prismadb.product.deleteMany({
		const product = await prismadb.product.delete({
			where: {
				id: params.productId,
			}
		})

		return NextResponse.json(product)
		
	} catch (error) {
		console.log('[PRODUCT_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}