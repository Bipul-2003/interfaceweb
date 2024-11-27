import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Headphones, Zap } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-12">
      {/* <header className="py-8 px-4 md:px-6 lg:px-8">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <Image src="/placeholder.svg?height=40&width=120" width={120} height={40} alt="Interface Hub Logo" className="w-32" />
          <Button variant="outline">Contact Us</Button>
        </nav>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-24">
        <HeroSection />
        <MissionSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <CTASection />
      </main>

      
    </div>
  )
}

function HeroSection() {
  return (
    <section className="text-center space-y-6 py-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Empowering Small Businesses with
        <span className="text-blue-600 block">Tailored IT Solutions</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        We provide cutting-edge IT Application Support & Development Services designed to help your business thrive in the digital age.
      </p>
      {/* <Button size="lg" className="text-lg px-8 py-6">Get Started</Button> */}
    </section>
  )
}

function MissionSection() {
  return (
    <section className="bg-[url('/background.jpg')] bg-cover rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
      <p className="text-xl text-muted max-w-3xl mx-auto">
        At Interface Hub, we&apos;re committed to making your business better through reliable, efficient, and affordable technology solutions. We understand the unique challenges small businesses face, and we&apos;re here to help you overcome them.
      </p>
    </section>
  )
}

function ServicesSection() {
  const services = [
    {
      title: "Application Support",
      description: "Keeping your business running smoothly",
      features: [
        "Proactive Monitoring & Maintenance",
        "Fast Issue Resolution",
        "Bug Fixes & System Optimization",
        "Software Updates & Security Management",
      ],
      icon: <Headphones className="w-12 h-12 text-blue-600" />,
    },
    {
      title: "Custom Application Development",
      description: "Tailored solutions for your unique needs",
      features: [
        "Custom Business Applications",
        "Mobile & Web Application Development",
        "Legacy System Modernization",
        "Integration with Third-Party Tools",
      ],
      icon: <Code className="w-12 h-12 text-blue-600" />,
    },
  ]

  return (
    <section className="space-y-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Our Services</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                {service.icon}
                <div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function WhyChooseUsSection() {
  const reasons = [
    {
      title: "Purpose-Driven Services",
      description: "Our priority is empowering small businesses and giving back to our community.",
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
    },
    {
      title: "Tailored Technology Solutions",
      description: "We design solutions that fit your unique needs, from software implementation to process automation.",
      icon: <Code className="w-12 h-12 text-purple-500" />,
    },
    {
      title: "Affordable and Accessible",
      description: "We ensure that small businesses can access cutting-edge technology without breaking the bank.",
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
    },
    {
      title: "Expert Guidance",
      description: "Transform your business with a partner who understands your vision and works tirelessly to make it a reality.",
      icon: <Headphones className="w-12 h-12 text-blue-500" />,
    },
  ]

  return (
    <section className="space-y-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Why Choose Us</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                {reason.icon}
                <CardTitle className="mt-4 text-xl font-bold">{reason.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">{reason.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="bg-primary text-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">Let Us Help You Build a Better Business</h2>
      <p className="text-xl max-w-3xl mx-auto">
        Whether you need ongoing IT support for your existing applications or are looking to develop custom solutions that drive growth, Interface Hub is your partner for success.
      </p>
      <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
        <Link href="/contact-us">
        Contact Us
        </Link>
      </Button>
    </section>
  )
}

