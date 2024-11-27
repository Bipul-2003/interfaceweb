import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CheckCircle, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Trainings() {
  return (
    <main className="flex-1 pt-12">
      <section className="w-full py-12 md:py-20 bg-primary/50 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold  sm:text-4xl md:text-5xl lg:text-5xl/none">
                Cutting-Edge IT Training at Interface Hub
              </h1>
              <p className="mx-auto max-w-[900px] py-4 text-black md:text-lg">
                {/* Powered by an institution with a proven track record of
                excellence since 2001. */}
                Partners with a premier institution that has
                empowered students since 2001 to complete their courses and
                launch successful careers at top companies like Google,
                Microsoft, and more.
              </p>
            </div>
            <div className="space-x-4">
              <Button>
                <Link href="/courses">Explore Courses</Link>
              </Button>
              {/* <Button variant="outline">Learn More</Button> */}
            </div>
          </div>
        </div>
      </section>

      <section
        id="who-should-attend"
        className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl  text-center mb-8">
            Who Should Attend?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 mb-2" />
                <CardTitle>Aspiring IT Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                Those looking to start or shift their careers in the IT
                industry.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 mb-2" />
                <CardTitle>Mid-Level Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                Individuals aiming to upskill and stay relevant in their current
                roles.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Building className="w-8 h-8 mb-2" />
                <CardTitle>Corporations</CardTitle>
              </CardHeader>
              <CardContent>
                Organizations that want to provide their teams with advanced
                tech training.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="success-story"
        className="w-full py-12 md:py-24 lg:py-32 bg-slate-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl ">
                Our Success Story
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed ">
                With a legacy spanning over two decades, we&apos;ve delivered
                top-notch IT education that leads to real-world success. Our
                alumni network boasts professionals working at top-tier
                companies around the globe, further demonstrating the quality
                and impact of our training programs.
              </p>
              <ul className="grid gap-2 py-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>20,000+ successful graduates since 2001</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>
                    Alumni working at Microsoft, AWS, Google, and more
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>
                    Continuously updated curriculum to meet industry demands
                  </span>
                </li>
              </ul>
            </div>
            <Image
              src="/success.png"
              width={650}
              height={500}
              alt="Success Story"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl ">
                Join us at Interface Hub
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed ">
                Take the next step towards a brighter future in IT! Our
                comprehensive programs and industry-aligned curriculum will
                prepare you for success in the ever-evolving tech landscape.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button className="w-full">
                <Link href="/courses">Enroll Now</Link>
              </Button>
              <p className="text-xs text-gray-500">
                Start your journey to becoming a skilled IT professional today!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
