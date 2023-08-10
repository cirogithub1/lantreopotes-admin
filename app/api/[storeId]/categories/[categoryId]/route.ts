import { Category } from '@prisma/client';
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { categoryId: string }}) 
{
	if (!params.categoryId) {
		return new NextResponse("Category id is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			}
		})

		return NextResponse.json(category)
		
	} catch (error) {
		console.log('[CATEGORY_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { storeId: string, categoryId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { name, billboardId } = body

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}

	if (!name) {
		return new NextResponse("Label is required in patch", { status: 401})
	}

	if (!billboardId) {
		return new NextResponse("Billboard ID is required in patch", { status: 401})
	}

	if (!params.categoryId) {
		return new NextResponse("Category ID is required in patch", { status: 401})
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

		const category = await prismadb.category.update({
			where: {
				id: params.categoryId
			},
			data: {
				name,
				billboardId
			}
		})

		return NextResponse.json(category)
		
	} catch (error) {
		console.log('[CATEGORY_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { storeId: string, categoryId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.categoryId) {
		return new NextResponse("Category id is required", { status: 401})
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

		// const billboard = await prismadb.billboard.deleteMany({
		const category = await prismadb.category.delete({
			where: {
				id: params.categoryId,
			}
		})

		return NextResponse.json(category)
		
	} catch (error) {
		console.log('[CATEGORY_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}