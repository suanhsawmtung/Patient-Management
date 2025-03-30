'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { SideNav } from '@/components/side-nav'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSideNavOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Overlay */}
          <div
            className={cn(
              "fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300",
              isSideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsSideNavOpen(false)}
          />

          {/* Side Navigation */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
              isSideNavOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
            </div>
            <SideNav />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setIsSideNavOpen(!isSideNavOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

