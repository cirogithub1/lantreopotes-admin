import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { label, imageUrl } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!label) {
		return new NextResponse("Label is required in post", { status: 401})			
	}

	if (!imageUrl) {
		return new NextResponse("Image URL is required in post", { status: 401})			
	}

	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params in post", { status: 401})			
	}

	try {
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId
			}
		})

		if (!storeByUserId) {
			return new NextResponse("User unauthorized to create this billboard", { status: 403 })			
		}

		const billboard = await prismadb.billboard.create({
			data: {
				label: label,
				imageUrl: imageUrl,
				storeId: params.storeId
			}
		})

		return NextResponse.json(billboard)

	}	catch (error) {
		console.log('[BILLBOARDS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId
			}
		})

		return NextResponse.json(billboards)

	}	catch (error) {
		console.log('[BILLBOARDS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}