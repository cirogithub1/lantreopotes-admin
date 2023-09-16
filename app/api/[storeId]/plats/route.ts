import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string }}) {
	const { userId} = auth()
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
		return new NextResponse("Unauthenticated", { status: 401})			
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

	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params in post", { status: 400})			
	}

	try {
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("User unauthorized to create this product", { status: 403 })			
		}

		const product = await prismadb.product.create({
			data: {
				name, 
				price, 
				categoryId, 
				colorId, 
				sizeId, 
				images: {
					createMany: {
						data: [
							...images.map((image: {url: string}) => image)
						]
					}
				}, 
				isFeatured, 
				isArchived,
				storeId: params.storeId
			}
		})

		return NextResponse.json(product)

	}	catch (error) {
		console.log('[PRODUCTS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
	const { searchParams } = new URL(req.url)
	
	const categoryId = searchParams.get('categoryId') || undefined
	const colorId = searchParams.get('colorId') || undefined
	const sizeId = searchParams.get('sizeId') || undefined
	const isFeatured = searchParams.get('isFeatured')
	
	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})

		return NextResponse.json(products)

	}	catch (error) {
		console.log('[PRODUCTS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}