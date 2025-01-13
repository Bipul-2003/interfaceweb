'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle, Gift, TrendingUp, Users, Zap, Shield, BarChart, Share2, Star } from 'lucide-react'

const referralAppData = {
  title: "Referral and Coupon Code Application",
  description: "Boost Engagement and Drive Sales with Ease: Empower your business with a dynamic Referral and Coupon Code System that incentivizes your customers to spread the word while rewarding loyalty.",
  keyFeatures: [
    { title: "Customizable Referral Program", description: "Tailor your referral program to fit your brand and business goals." },
    { title: "Personalized Coupon Codes", description: "Create unique codes for individual customers or campaigns." },
    { title: "Automated Rewards Management", description: "Effortlessly track and distribute rewards to your customers." },
    { title: "Detailed Analytics", description: "Gain insights into your referral program's performance and ROI." },
    { title: "Multi-Platform Compatibility", description: "Seamlessly integrate with various platforms and devices." },
    { title: "Flexible Sharing Options", description: "Enable easy sharing across multiple channels and social media." },
    { title: "Tiered Incentives", description: "Implement progressive rewards to encourage continued engagement." },
    { title: "Anti-Fraud Mechanisms", description: "Protect your program from abuse with built-in security features." }
  ],
  benefits: [
    { title: "Increase Customer Acquisition", description: "Leverage word-of-mouth marketing to attract new customers." },
    { title: "Boost Customer Loyalty", description: "Encourage repeat business with attractive rewards and incentives." },
    { title: "Enhance Customer Engagement", description: "Create a community around your brand through referrals." },
    { title: "Maximize Revenue Opportunities", description: "Increase sales through targeted promotions and referrals." },
    { title: "Cost-Effective Marketing", description: "Reduce customer acquisition costs with organic growth." }
  ],
  useCases: [
    { title: "Small Businesses", description: "Ideal for local shops looking to expand their customer base." },
    { title: "Subscription-Based Services", description: "Perfect for SaaS companies aiming to increase user adoption." },
    { title: "Event Organizers", description: "Great for promoting events and boosting ticket sales." },
    { title: "E-Commerce Stores", description: "Excellent for online retailers wanting to drive more sales." }
  ],
  whyChooseUs: [
    "Easy to implement and manage without technical expertise.",
    "Fully scalable for businesses of any size.",
    "Supported by a dedicated team to help you every step of the way."
  ]
};

const FeatureIcon = ({ name }: { name: string }) => {
    const icons: { [key: string]: JSX.Element } = {
      'Customizable Referral Program': <Zap className="h-8 w-8 text-yellow-400" />,
      'Personalized Coupon Codes': <Gift className="h-8 w-8 text-pink-400" />,
      'Automated Rewards Management': <Shield className="h-8 w-8 text-green-400" />,
      'Detailed Analytics': <BarChart className="h-8 w-8 text-blue-400" />,
      'Multi-Platform Compatibility': <Share2 className="h-8 w-8 text-purple-400" />,
      'Flexible Sharing Options': <Users className="h-8 w-8 text-indigo-400" />,
      'Tiered Incentives': <TrendingUp className="h-8 w-8 text-orange-400" />,
      'Anti-Fraud Mechanisms': <Shield className="h-8 w-8 text-red-400" />,
    }
    return icons[name] || <CheckCircle className="h-8 w-8 text-gray-400" />
  }
  

export default function ReferralSystem() {
  const { title, description, keyFeatures, benefits, useCases, whyChooseUs } = referralAppData
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 text-white py-20 px-4 rounded-xl">
      <div className={`max-w-6xl mx-auto animate-fadeIn ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 animate-fadeIn">
          {title}
        </h1>
        <p className="text-2xl text-center max-w-3xl mx-auto text-indigo-100 animate-fadeIn animation-delay-200">
          {description}
        </p>
        <div className="flex justify-center gap-4 my-10">
            <Button
              asChild
              className="bg-white text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <a
                href="https://referral-system-frontend-sooty.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-base md:text-lg font-semibold px-6 py-2 rounded-full"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get Started
              </a>
            </Button>
          </div>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-full p-2">
            {['features', 'benefits', 'useCases', 'whyUs'].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab}
                className="rounded-full text-white data-[state=active]:bg-white data-[state=active]:text-indigo-600 transition-all duration-300"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyFeatures.map((feature, index) => (
                <div key={index} className={`animate-fadeIn animation-delay-${(index + 1) * 100}`}>
                  <Card className="h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-none hover:bg-opacity-100 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                        <FeatureIcon name={feature.title} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="benefits">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className={`animate-fadeIn animation-delay-${(index + 1) * 100}`}>
                  <Card className="h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-none  hover:bg-opacity-100 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">
                        <Star className="mr-2 h-6 w-6 text-yellow-400" />
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="">{benefit.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="useCases">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className={`animate-fadeIn animation-delay-${(index + 1) * 100}`}>
                  <Card className="h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-none hover:bg-opacity-100 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">
                        <Users className="mr-2 h-6 w-6 text-blue-400" />
                        {useCase.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="">{useCase.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="whyUs">
            <Card className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-none ">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Why Choose Our Referral and Coupon Code System?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {whyChooseUs.map((reason, index) => (
                    <li key={index} className={`flex items-start animate-fadeIn animation-delay-${(index + 1) * 100}`}>
                      <CheckCircle className="mr-2 h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                      <span className="">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16 animate-fadeIn animation-delay-500">
          <h2 className="text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">Get Started Today!</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Take the first step toward increasing your customer base and maximizing revenue. 
            Sign up now to explore the benefits of a Referral and Coupon Code System tailored to your business needs.
          </p>
          <Button 
            size="lg"
            asChild
            className="bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <a 
              href="https://referral-system-frontend-sooty.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-lg font-semibold px-8 py-4 rounded-full"
            >
              <Gift className="mr-2 h-6 w-6" />
              Sign Up Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

