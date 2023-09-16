import { FC } from "react"

import { CreditCard, Euro, Package } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatter } from "@/lib/utils"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getStockCount } from "@/actions/get-stock-count"
import Overview from "@/components/overview"
import { getGraphRevenue } from "@/actions/get-graph-revenue"

interface Props {
	params: { storeId: string }
}

const DashboardPage: FC<Props> = async ({ params }) => {
	const totalRevenue = await getTotalRevenue(params.storeId)
	const salesCount = await getSalesCount(params.storeId)
	const stockCount = await getStockCount(params.storeId)
	const graphRevenue = await getGraphRevenue(params.storeId)
		
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<Heading title="Dashboard" description="Overview of your store" />

				<Separator />

				<div className="grid gap-4 grid-cols-3">

					<h1>
						This is the Overview of the Restaurant: 

						{params.storeId &&
							<p>{params.storeId}</p>
						}
					</h1> 
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb=2">
							<CardTitle className="text-sm font-medium">
								Total Revenue
							</CardTitle>

							<Euro className="w-4 h-4 text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{formatter.format(totalRevenue)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb=2">
							<CardTitle className="text-sm font-medium">
								Sales
							</CardTitle>

							<CreditCard className="w-4 h-4 text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								+{salesCount}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb=2">
							<CardTitle className="text-sm font-medium">
								Products in stock
							</CardTitle>

							<Package className="w-4 h-4 text-muted-foreground" />
						</CardHeader>

						<CardContent>
							<div className="text-2xl font-bold">
								{stockCount}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>

					<CardContent className="pl-2">
						<Overview data={graphRevenue} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default DashboardPage