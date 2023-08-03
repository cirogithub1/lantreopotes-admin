import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { billboardId: string }}) 
{
	if (!params.billboardId) {
		return new NextResponse("Billboard id is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			}
		})

		return NextResponse.json(billboard)
		
	} catch (error) {
		console.log('[BILLBOARD_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { storeId: string, billboardId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { label, imageUrl } = body

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}

	if (!label) {
		return new NextResponse("Label is required in patch", { status: 401})
	}

	if (!imageUrl) {
		return new NextResponse("Image URL is required in patch", { status: 401})
	}

	if (!params.billboardId) {
		return new NextResponse("Billboard id is required in patch", { status: 401})
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

		const billboard = await prismadb.billboard.update({
			where: {
				id: params.billboardId
			},
			data: {
				label,
				imageUrl
			}
		})

		return NextResponse.json(billboard)
		
	} catch (error) {
		console.log('[BILLBOARD_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { storeId: string, billboardId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.billboardId) {
		return new NextResponse("Billboard id is required", { status: 401})
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
		const billboard = await prismadb.billboard.delete({
			where: {
				id: params.billboardId,
			}
		})

		return NextResponse.json(billboard)
		
	} catch (error) {
		console.log('[BILLBOARD_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}