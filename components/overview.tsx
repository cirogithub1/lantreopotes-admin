"use client"

import { FC, useEffect, useState } from "react"
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts"

interface Props {
	data: any[]
}
const Overview: FC<Props> = ({ data }) => {

	// Start Block for preventing rerendering on mount (hydration)
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return null
	// End Block for preventing rerendering on mount (hydration)

	return (  
		<div>
			<ResponsiveContainer width={"100%"} height={350}>
				<BarChart data={data}>
					<XAxis 
						dataKey={"name"}
						stroke="#8888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>

					<YAxis 
						stroke="#8888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `$${value}`}
					/>

					<Bar dataKey={"total"} fill="#3599da" radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
 
export default Overview