import { Billboard, Category } from '@prisma/client';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { name, billboardId } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Name is required in post", { status: 401})			
	}

	if (!billboardId) {
		return new NextResponse("Billboard ID is required in post", { status: 401})			
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

		const category = await prismadb.category.create({
			data: {
				name: name,
				billboardId: billboardId,
				storeId: params.storeId
			}
		})

		return NextResponse.json(category)

	}	catch (error) {
		console.log('[CATEGORIES_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
	if (!params.storeId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const categories = await prismadb.category.findMany({
			where: {
				storeId: params.storeId
			}
		})

		return NextResponse.json(categories)

	}	catch (error) {
		console.log('[CATEGORIES_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}