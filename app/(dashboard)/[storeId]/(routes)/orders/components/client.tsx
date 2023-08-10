"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface Props {
	data: OrderColumn[]
}
export const OrderClient: FC<Props> = ({ data }) => {

	return (
		<>
			<Heading 
				title={`Orders (${data.length})`}
				description="Manage orders"
			/>

			<Separator />

			<DataTable columns={columns} data={data} searchKey="products"/>
		</>
	)
}
