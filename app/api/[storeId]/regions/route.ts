import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string }}) {
	const { userId} = auth()
	const body = await req.json()

	const { data } = body
	const { name, value } = data

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
			return new NextResponse("User unauthorized to create this size", { status: 403 })			
		}

		const size = await prismadb.size.create({
			data: {
				name: name,
				value: value,
				storeId: params.storeId
			}
		})

		return NextResponse.json(size)

	}	catch (error) {
		console.log('[SIZES_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const sizes = await prismadb.size.findMany({
			where: {
				storeId: params.storeId
			}
		})

		return NextResponse.json(sizes)

	}	catch (error) {
		console.log('[SIZES_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}