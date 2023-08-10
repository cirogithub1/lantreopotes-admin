import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('eu-EU', {
  style: 'currency',
  currency: 'EUR'
})

// export const formatter = (num:number) => {
// 	return '€' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '€1,')
// }