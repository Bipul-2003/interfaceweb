import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkIcon, PowerIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AboutUs() {
  return (
    <div className="pt-12">
      <div className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 max-w-5xl">
            <div className="flex items-center justify-center ">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
                  Delivering Exceptional IT Services, Products, and Training
                </h2>
                <p className=" text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                &quot; Our success is measured by how successful our customers are.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 ">
              <div>
                {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  IT Services
                </div> */}
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl text-center">
                  Our Offerings
                </h2>
                <p className=" md:px-36 mt-2 text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From network setup and maintenance to cybersecurity and
                  technical support, we offer a wide range of IT services
                  tailored to meet the unique needs of small businesses and
                  individuals.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  <div className="bg-card rounded-lg p-6 space-y-2">
                    <NetworkIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">IT Sevices</h3>
                    <p className="text-muted-foreground">
                      We offer a comprehensive range of IT services designed to
                      meet the unique needs of small businesses and individuals.
                      From network setup and maintenance to cybersecurity
                      solutions and technical support, our team of experts is
                      here to ensure your IT infrastructure is robust and
                      reliable.
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 space-y-2">
                    <ShieldIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Products</h3>
                    <p className="text-muted-foreground">
                      Our product lineup includes cutting-edge software and
                      hardware solutions that streamline your operations and
                      enhance productivity. One of our standout products
                      empowers individuals or groups to start full-time or
                      part-time small businesses or side hustles without the
                      hassle of financial bookkeeping.
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 space-y-2">
                    <PowerIcon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Training</h3>
                    <p className="text-muted-foreground">
                      Stay ahead of the curve with our expert-led training
                      programs. Whether you’re an individual looking to expand
                      your skill set or a small business aiming to upskill your
                      team, our training sessions cover a wide range of latest
                      technologies. Our goal is to equip you with the knowledge
                      and skills needed to succeed in today’s tech-driven world.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl text-center font-bold tracking-tighter sm:text-4xl md:text-4xl">
                  Why Us ?
                </h2>

                <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 gap-6 px-6 ">
                  <Card className="bg-primary/20">
                    <CardHeader>
                      <CardTitle className="font-bold text-xl">
                        Affordability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      We understand the financial challenges faced by small
                      businesses and individuals, which is why we are committed
                      to offering high-quality IT solutions at lower costs. Our
                      competitive pricing ensures you get the best value for
                      your investment.
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/20">
                    <CardHeader>
                      <CardTitle className="font-bold text-xl">
                        Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Our team of seasoned IT professionals brings years of
                      experience and expertise to every project. We stay updated
                      with the latest industry trends and technologies to
                      provide you with cutting-edge solutions that drive growth
                      and efficiency.{" "}
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/20">
                    <CardHeader>
                      <CardTitle className="font-bold text-xl">
                        Personalized Approach
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      At Interface Hub, we believe in a personalized approach to
                      IT services. We take the time to understand your specific
                      needs and tailor our solutions to fit your unique
                      requirements. Your success is our priority.
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/20">
                    <CardHeader>
                      <CardTitle className="font-bold text-xl">
                        Reliable Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      We pride ourselves on delivering exceptional customer
                      support. Whether you need technical assistance or guidance
                      on choosing the right products and services, our friendly
                      and knowledgeable team is always here to help.{" "}
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className=" mt-20 text-center font-bold text-5xl tracking-tight">
                <p> Get Started Today!</p>

                <Button className="mt-4 tracking-normal" asChild>
                  <Link href="/contact-us">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
