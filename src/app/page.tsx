import {
  ArrowRightIcon,
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
      <section className="bg-gradient-to-r from-violet-900 to-indigo-600 py-20  lg:py-32">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold text-primary-foreground md:text-6xl">
            Empowering The World Through Technology
          </h1>
          <p className="mt-4 text-lg text-primary-foreground md:text-xl px-4">
            Interface Hub provides the tools, services, and training to help
            small businesses thrive in the digital age.
          </p>
          <Link
            href="#offerings"
            className="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}>
            Explore
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
              <h3 className="text-3xl font-bold text-center">90%</h3>
              <p className="text-muted-foreground text-center">
                of all businesses worldwide are small businesses
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-3xl font-bold text-center">2 Billion</h3>
              <p className="text-muted-foreground text-center">
                people employed by small businesses globally
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-3xl font-bold text-center">$6 Trillion</h3>
              <p className="text-muted-foreground text-center">
                contributed to the global economy by small businesses
              </p>
            </div>
          </div>
          <p className="text-center md:px-36 mt-10 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Small businesses are the backbone of the global economy,
                accounting for over 90% of all businesses and employing billions
                of people worldwide. Interface Hub is dedicated to supporting
                these vital engines of growth and innovation.
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
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
