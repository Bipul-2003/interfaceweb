'use client'

import Link from 'next/link'
import { ArrowRight, Users, Gift, Zap } from 'lucide-react'

export default function Products() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-indigo-600">ifaceh-products</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our innovative software solutions designed to empower your business and drive growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 relative group">
            <div className="p-8 overflow-visible relative z-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full transition-all duration-300 group-hover:bg-indigo-200 group-hover:w-24 group-hover:h-24"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100 rounded-tr-full transition-all duration-300 group-hover:bg-blue-200 group-hover:w-20 group-hover:h-20"></div>
              <Users className="w-12 h-12 text-indigo-600 mb-4 relative z-10" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Community App</h2>
              <p className="text-gray-600 mb-6">
                Build and nurture your community with our powerful engagement platform.
              </p>
              <Link href="/products/community_app" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 group-hover:translate-x-1 relative z-20">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 relative group">
            <div className="p-8 overflow-visible relative z-10">
              <div className="absolute top-0 left-0 w-24 h-24 bg-pink-100 rounded-br-full transition-all duration-300 group-hover:bg-pink-200 group-hover:w-28 group-hover:h-28"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-100 rounded-tl-full transition-all duration-300 group-hover:bg-yellow-200 group-hover:w-24 group-hover:h-24"></div>
              <Gift className="w-12 h-12 text-indigo-600 mb-4 relative z-10" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Referral System</h2>
              <p className="text-gray-600 mb-6">
                Boost your growth with our advanced referral marketing solution.
              </p>
              <Link href="/products/referral_app" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 group-hover:translate-x-1 relative z-20">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose ifaceh?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovative Solutions</h3>
              <p className="text-gray-600">Cutting-edge technology to meet your evolving business needs.</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">User-Friendly</h3>
              <p className="text-gray-600">Intuitive interfaces ensuring smooth adoption across your organization.</p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Scalable</h3>
              <p className="text-gray-600">Solutions that grow with your business, from startups to enterprises.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

