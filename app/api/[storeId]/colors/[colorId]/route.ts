import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { colorId: string }}) 
{
	if (!params.colorId) {
		return new NextResponse("Color ID is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const color = await prismadb.color.findUnique({
			where: {
				id: params.colorId,
			}
		})

		return NextResponse.json(color)
		
	} catch (error) {
		console.log('[COLOR_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { storeId: string, colorId: string} }) 
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

	if (!params.colorId) {
		return new NextResponse("Color ID is required in patch", { status: 401})
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

		const color = await prismadb.color.update({
			where: {
				id: params.colorId
			},
			data: {
				name,
				value
			}
		})

		return NextResponse.json(color)
		
	} catch (error) {
		console.log('[COLOR_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { storeId: string, colorId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.colorId) {
		return new NextResponse("Color ID is required", { status: 401})
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
		const color = await prismadb.color.delete({
			where: {
				id: params.colorId,
			}
		})

		return NextResponse.json(color)
		
	} catch (error) {
		console.log('[COLOR_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}