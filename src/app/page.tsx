import {
  ArrowRightIcon,
  BriefcaseBusiness,
  LaptopIcon,
  PresentationIcon,
  RocketIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex min-h-[100dvh] flex-col pt-12">
      <section className=" py-20 bg-[url('/world.jpg')] opacity-100  bg-cover bg-right-bottom lg:py-32 relative">
        {/* <a
          className="text-gray-400 absolute bottom-0 right-0 text-xs"
          href="https://www.freepik.com/free-vector/worldwide-connection-gray-background-illustration-vector_3842189.htm#query=world%20background&position=2&from_view=keyword&track=ais_hybrid&uuid=ff4ba993-5213-4e8d-bcf3-4f34040609bf">
          Image by rawpixel.com on Freepik
        </a> */}
        <div className="container mx-auto max-w-5xl text-center">
          {/* <Image className="absolute " src='/lines.svg' height={100} width={100} alt=""></Image> */}
          <h1 className="text-5xl text-muted font-bold  md:leading-snug antialiased  md:text-6xl">
            Empowering The{" "}
            {/* <span className="relative "> */}
              <div className=" text-black font-normal ">🌎</div>
              
              {/* <Image
                className="absolute right-1 -bottom-3 width-full"
                src="/lines.svg"
                height={60}
                width={60}
                alt=""
              /> */}
            {/* </span>{" "} */}
            Through Technology
          </h1>
          <p className="pt-4 text-lg text-muted  md:text-xl px-4">
            Interface Hub provides the tools, services, and training to help
            small businesses thrive in the digital age.
          </p>
          <Link
            href="#offerings"
            className="mt-8 relative inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}>
            Explore
            {/* <Image
                className="absolute -right-16 -bottom-[2.8rem] -rotate-[30deg] "
                0src="/circled-arrow.svg"
                height={120}
                width={120}
                alt=""
              /> */}
          </Link>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">
                Fact Check
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Powering the Global Economy
              </h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl pt-10 items-center gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              {/* <h3 className="text-3xl font-bold text-center">90%</h3> */}
              <BriefcaseBusiness className="mx-auto size-16 text-primary" />
              <p className="text-muted-foreground text-center">
              <span className="font-bold text-lg text-justify">90%</span> of all businesses worldwide are small businesses
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-3xl font-bold text-center">
                <svg
                  className="size-16 mx-auto text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>
              </h3>
              <p className="text-muted-foreground text-center ">
                <span className="font-bold text-lg text-justify">2 Billion</span> people employed by small businesses globally
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-3xl font-bold text-center mx-auto size-16 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chart-no-axes-combined">
                  <path d="M12 16v5" />
                  <path d="M16 14v7" />
                  <path d="M20 10v11" />
                  <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
                  <path d="M4 18v3" />
                  <path d="M8 14v7" />
                </svg>
              </h3>
              {/* <ChartLine/> */}
              <p className="text-muted-foreground text-center">
              <span className="font-bold text-lg text-justify">$6 Trillion</span> contributed to the global economy by small
                businesses
              </p>
            </div>
          </div>
          <p className="text-center md:px-36 mt-10 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Small businesses are the backbone of the global economy. Interface
            Hub is dedicated to supporting these vital engines of growth and
            innovation.
          </p>
        </div>
      </section>
      <section className=" py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <Image
                src="/question.svg"
                alt="Why Choose Us"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="text-xl font-bold tracking-tighter sm:text-4xl">
                Why Choose Us?
              </h2>
              <p className="text-muted-foreground">
                At Interface Hub, LLC., we believe in the power of technology to
                transform small businesses. Our mission is to provide top-tier
                IT services, cutting-edge products, and comprehensive training
                to help our clients overcome challenges and capitalize on
                opportunities in a rapidly evolving digital landscape with very
                affordable price.
              </p>
              <Link
                href="#offerings"
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                prefetch={false}>
                Explore Our Offerings
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="offerings" className="bg-muted py-16 px-4 md:px-6 lg:py-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Offerings
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Interface Hub offers a range of services to help small businesses
              succeed.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3">
            <div className="rounded-lg bg-background p-6 shadow-md transition hover:scale-105 ease-in-out cursor-pointer">
              <LaptopIcon className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold mt-4">IT Services</h3>
              <p className="mt-2 text-muted-foreground">
                From cloud migration to cybersecurity, our team of experts
                provides comprehensive IT solutions tailored to your small
                business needs.
              </p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md transition hover:scale-105 ease-in-out cursor-pointer">
              <RocketIcon className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold mt-4">Cutting-Edge Products</h3>
              <p className="mt-2 text-muted-foreground">
                Leverage our innovative suite of products to streamline your
                operations, boost productivity, and stay ahead of the
                competition.
              </p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-md transition hover:scale-105 ease-in-out cursor-pointer">
              <PresentationIcon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-bold text-foreground">
                Training & Workshops
              </h3>
              <p className="mt-2 text-muted-foreground">
                Empower your team with our comprehensive training programs and
                workshops.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="w-full py-12 md:py-24 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have a question or ready to get started? Contact us today to
                learn more about our services and how we can help your business
                succeed.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}>
              Contact Us
            </Link>
            <div />
          </div>
        </div>
      </section>
    </div>
  );
}
