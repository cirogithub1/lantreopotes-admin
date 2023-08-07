"use client"

import { useOrigin } from "@/hooks/use-origin"
import { useParams } from "next/navigation"
import { FC } from "react"
import { ApiAlert } from "@/components/ui/api-alert"

interface Props {
	entityName: string,
	entityId: string
}
export const ApiList: FC<Props> = ({entityName, entityId}) => {
	const params = useParams()
	const origin = useOrigin()

	const baseUrl = `${origin}/api/${params.storeId}`

	return (
		<>
			<ApiAlert 
				title="GET"
				variant="public"
				description={`${baseUrl}/${entityName}`}
			/>

			<ApiAlert 
				title="GET"
				variant="public"
				description={`${baseUrl}/${entityName}/{${entityId}}`}
			/>

			<ApiAlert 
				title="POST"
				variant="admin"
				description={`${baseUrl}/${entityName}`}
			/>

			<ApiAlert 
				title="PATCH"
				variant="admin"
				description={`${baseUrl}/${entityName}/{${entityId}}`}
			/>

			<ApiAlert 
				title="DELETE"
				variant="admin"
				description={`${baseUrl}/${entityName}/{${entityId}}`}
			/>
		</>
	)
}