"use client"

import { ComponentPropsWithoutRef, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { cn } from "@/lib/utils"

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SwitcherProps extends PopoverTriggerProps {
	items: Record<string, any>[]
}

const StoreSwitcher = ({ className, items = []}: SwitcherProps) => {
	const storeModal = useStoreModal()
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)

	// Start Block for preventing rerendering on mount (hydration)
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return null
	// End Block for preventing rerendering on mount (hydration)

	const formattedItems = items.map((item) => ({
		label: item.name,
		value: item.id
	}))

	const currentStore = formattedItems.find((item) => item.value === params.storeId)

	const onStoreSelect = (store: {value: string, label: string}) => {
		setOpen(false)
		router.push(`/${store.value}`)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<Button
					className={cn(`w-48 justify-between`, className)}
					variant="outline"
					size="sm"
					role="combo"
					aria-expanded={open}
					aria-label="Select a store"
				>
					<StoreIcon className="mr-2 h-4 w-4 text-yellow-400"/>

					{currentStore?.label}

					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-48 p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search store"/>

						<CommandEmpty>No store found</CommandEmpty>

						<CommandGroup heading="Stores">
							{formattedItems.map((store) => (
								<CommandItem
									key={store.value}
									className="text-sm"
									onSelect={() => onStoreSelect(store)}
								>
									<StoreIcon className="mr-2 h-4 w-4"/>

									{store.label}

									<Check 
										className={cn(`ml-auto h-4 w-4`, currentStore?.value === store.value ? "opacity-100" : "opacity-0")}
									/>
								</CommandItem>
							))}

						</CommandGroup>
					</CommandList>

					<CommandSeparator />

					<CommandList>
						<CommandGroup>
							<CommandItem
								className="cursor-pointer"
								onSelect={() => {
									setOpen(false),
									storeModal.onOpen()
								}}
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								
								Create Store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default StoreSwitcher