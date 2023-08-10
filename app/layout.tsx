import type { Metadata } from 'next'
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'
import './globals.css'

import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })
const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <html>
        <body className={inter.className}>  
            <ToasterProvider />

            <ModalProvider />
            
            {children}
        </body> 
      </html>
    </ClerkProvider>
  )
}