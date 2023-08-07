"use client"

import { FC } from "react"
import { Copy, Server } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge, BadgeProps } from "./badge"
import { Button } from "./button"
import { toast } from "react-hot-toast"

interface Props {
	title: string
	description: string
	variant: "public" | "admin"
}

const textMap: Record<Props["variant"], string> = {
	public: "Public",
	admin: "Admin"
}

const variantMap: Record<Props["variant"], BadgeProps["variant"]> = {
	public: "secondary",
	admin: "destructive"
}

export const ApiAlert: FC<Props> = ({ title, description, variant }) => {
	const onCopy = () => {
		navigator.clipboard.writeText(description)
		toast.success("Copied to clipboard!")	
	}

	return (
		<Alert className="">

			<AlertTitle
				className="flex items-center gap-x-2"
			>
				<Server className="h-4 w-4" />
				
				{title}

				<Badge variant={variantMap[variant]}>
					{textMap[variant]}
				</Badge>
			</AlertTitle>

			<AlertDescription className="flex items-center justify-between mt-2">
				<code 
					className="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold">
					{description}
				</code>

				<Button variant={"outline"} size={"icon"} onClick={onCopy}>
					<Copy className="h-4 w-4" />
				</Button>
			</AlertDescription>
		</Alert>
	)
}