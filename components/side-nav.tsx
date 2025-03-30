'use client'

import { Home, BarChart, Users, Settings, BriefcaseMedical } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SubNavItem {
    title: string
    href: string
}
  
interface NavItemProps {
    title: string
    href?: string
    icon: React.ReactNode
    subItems?: SubNavItem[]
    isActive?: boolean
}

const navItems = [
  { title: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
//   {
//     title: 'Doctors',
//     icon: <BarChart className="h-5 w-5" />,
//     subItems: [
//       { title: 'Overview', href: '/analytics' },
//       { title: 'Reports', href: '/analytics/reports' },
//     ],
//   },
  { title: 'Doctors', href: '/doctors', icon: <BriefcaseMedical className="h-5 w-5" /> },
  { title: 'Patients', href: '/patients', icon: <Users className="h-5 w-5" /> },
]

export function NavItem({ title, href, icon, subItems, isActive }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSubNav = () => {
    if (subItems) {
      setIsOpen(!isOpen)
    }
  }

  const commonClasses = "flex items-center w-full py-2 px-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          commonClasses,
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          isActive && "bg-gray-100 dark:bg-gray-700 text-primary"
        )}
      >
        {icon}
        <span className="ml-3">{title}</span>
      </Link>
    )
  }

  return (
    <div>
      <Button
        variant="ghost"
        onClick={toggleSubNav}
        className={cn(
          commonClasses,
          "justify-between hover:bg-gray-100 dark:hover:bg-gray-700",
          isOpen && "bg-gray-100 dark:bg-gray-700"
        )}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3">{title}</span>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")}
        />
      </Button>
      {subItems && (
        <div
          className={cn(
            "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {subItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block py-2 px-3 text-sm rounded-md transition-colors duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive && "bg-gray-100 dark:bg-gray-700 text-primary"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

 

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item, index) => (
        <NavItem key={index} {...item} isActive={pathname === item.href} />
      ))}
    </nav>
  )
}

