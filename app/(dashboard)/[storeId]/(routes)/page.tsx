import { FC } from "react"
import prismadb from "@/lib/prismadb"

interface Props {
	params: { storeId: string }
}

const DashboardPage: FC<Props> = async ({ params }) => {
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId
		}
	})
	// console.log('/dashboard/[storeId]/routes/ store: ', store?.name)

	return (
		<div>
			Dashboard Active Store {store?.name}
		</div>
	)
}

export default DashboardPage