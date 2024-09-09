import { ArrowRight, CheckCircle, Code, Cog, Cpu, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center py-12 relative">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Decorative background"
              width={200}
              height={200}
              className="absolute top-0 left-0 opacity-10"
            />
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Decorative background"
              width={200}
              height={200}
              className="absolute bottom-0 right-0 opacity-10"
            />
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl relative z-10">
              Empowering Small Businesses
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 relative z-10">
              Tailored IT Application Support & Development Services
            </p>
          </section>

          {/* Mission Statement */}
          <section className="bg-white shadow rounded-lg p-6 mb-8 relative overflow-hidden text-center">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Mission illustration"
              width={150}
              height={150}
              className="absolute top-0 right-0 opacity-10"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 relative z-10">
              At Interface Hub, we understand the unique challenges small businesses face when it comes to technology. That&apos;s why we&apos;re committed to providing IT Application Support and Development services that are specifically designed to help small businesses streamline their operations, enhance productivity, and drive growth.
            </p>
            <p className="text-gray-600 mt-4 relative z-10">
              Our mission is simple: to make your business better through reliable, efficient, and affordable technology solutions.
            </p>
          </section>

          {/* Services */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Application Support */}
              <div className="bg-white shadow rounded-lg p-6 relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Application Support illustration"
                  width={100}
                  height={100}
                  className="absolute top-2 right-2 opacity-10"
                />
                <h4 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
                  <Cog className="mr-2 h-6 w-6 text-blue-500" />
                  Application Support
                </h4>
                <p className="text-gray-600 mb-4">
                  We provide comprehensive application support to keep your business running smoothly, minimizing downtime and resolving issues quickly.
                </p>
                <ul className="space-y-2">
                  {[
                    'Proactive Monitoring & Maintenance',
                    'Fast Issue Resolution',
                    'Bug Fixes & System Optimization',
                    'Software Updates & Security Management',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom Application Development */}
              <div className="bg-white shadow rounded-lg p-6 relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Custom Development illustration"
                  width={100}
                  height={100}
                  className="absolute top-2 right-2 opacity-10"
                />
                <h4 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
                  <Code className="mr-2 h-6 w-6 text-blue-500" />
                  Custom Application Development
                </h4>
                <p className="text-gray-600 mb-4">
                  We create tailored applications to meet the specific needs of your business, enhancing efficiency and providing a competitive edge.
                </p>
                <ul className="space-y-2">
                  {[
                    'Custom Business Applications',
                    'Mobile & Web Application Development',
                    'Legacy System Modernization',
                    'Integration with Third-Party Tools',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Why Us */}
          <section className="bg-white shadow rounded-lg p-6 mb-12 relative overflow-hidden">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Why Us illustration"
              width={200}
              height={200}
              className="absolute bottom-0 right-0 opacity-10"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Small Business Focus', icon: Cpu },
                { title: 'Personalized Solutions', icon: Cog },
                { title: 'Affordable & Scalable', icon: ArrowRight },
                { title: 'Expert Guidance', icon: Shield },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      We understand the needs of small businesses and provide tailored, cost-effective solutions.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 relative">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="CTA illustration"
              width={150}
              height={150}
              className="absolute top-0 left-0 opacity-10"
            />
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="CTA illustration"
              width={150}
              height={150}
              className="absolute bottom-0 right-0 opacity-10"
            />
            <h3 className="text-3xl font-extrabold text-gray-900 relative z-10">Let Us Help You Build a Better Business</h3>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 relative z-10">
              Whether you need ongoing IT support for your existing applications or are looking to develop custom solutions that drive growth, Interface Hub is your partner for success.
            </p>
            <div className="mt-8 relative z-10">
              <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Get in touch
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}