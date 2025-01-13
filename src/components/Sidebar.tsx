'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const products = [
    { id: 'referral', name: 'Referral & Coupon App', path: '/products/referral_app' },
  { id: 'community', name: 'Community App', path: '/products/community_app' },
]

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  return (
    <aside className={`bg-white pt-12 shadow-lg transition-all duration-300 flex flex-col sticky top-0 h-screen ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={`font-bold text-lg text-indigo-800 ${isExpanded ? '' : 'hidden'}`}>
            <Link href="/products" className="text-xl font-bold">
            All Products
            </Link>
            </h2>
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
          {isExpanded ? <ChevronLeft className="w-6 h-6 text-indigo-600" /> : <ChevronRight className="w-6 h-6 text-indigo-600" />}
        </button>
      </div>
      <nav className="flex-grow py-4">
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={product.path} className={`block px-4 py-2 mb-2 ${pathname === product.path ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600'} hover:bg-indigo-50 transition-colors`}>
                {isExpanded ? product.name : product.name.charAt(0)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

