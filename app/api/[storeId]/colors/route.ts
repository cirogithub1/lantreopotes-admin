import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { name, value } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Name is required in post", { status: 401})			
	}

	if (!value) {
		return new NextResponse("Value is required in post", { status: 401})			
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
			return new NextResponse("User unauthorized to create this color", { status: 403 })			
		}

		const color = await prismadb.color.create({
			data: {
				name: name,
				value: value,
				storeId: params.storeId
			}
		})

		return NextResponse.json(color)

	}	catch (error) {
		console.log('[COLORS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const colors = await prismadb.color.findMany({
			where: {
				storeId: params.storeId
			}
		})

		return NextResponse.json(colors)

	}	catch (error) {
		console.log('[COLORS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}