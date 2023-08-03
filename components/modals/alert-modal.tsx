"use client"

import { FC, useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "../ui/button"

interface Props {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	loading: boolean
}

export const AlertModal: FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
	loading
}) => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

	return (
		<Modal
			title="Delete Store"
			description="Are you sure you want to delete this store?"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>
				<Button
					disabled={loading}
					variant={"outline"}
					onClick={onClose}
				>
					Cancel
				</Button>

				<Button
					disabled={loading}
					variant={"destructive"}
					onClick={onConfirm}
				>
					Continue
				</Button>
			</div>

		</Modal>
	)
}