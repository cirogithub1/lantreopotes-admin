import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { sizeId: string }}) 
{
	if (!params.sizeId) {
		return new NextResponse("Size ID is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			}
		})

		return NextResponse.json(size)
		
	} catch (error) {
		console.log('[SIZE_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { storeId: string, sizeId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { name, value } = body

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}

	if (!name) {
		return new NextResponse("Name is required in patch", { status: 401})
	}

	if (!value) {
		return new NextResponse("Value is required in patch", { status: 401})
	}

	if (!params.sizeId) {
		return new NextResponse("Size ID is required in patch", { status: 401})
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

		const size = await prismadb.size.update({
			where: {
				id: params.sizeId
			},
			data: {
				name,
				value
			}
		})

		return NextResponse.json(size)
		
	} catch (error) {
		console.log('[SIZE_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { storeId: string, sizeId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.sizeId) {
		return new NextResponse("Size ID is required", { status: 401})
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
		const size = await prismadb.size.delete({
			where: {
				id: params.sizeId,
			}
		})

		return NextResponse.json(size)
		
	} catch (error) {
		console.log('[SIZE_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}