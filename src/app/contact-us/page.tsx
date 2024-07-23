import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function ContactUs() {
  return (
    <div className="pt-9">
      <section id="contact-form" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24 ">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Send Us a Message
            </h2>
            <form className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" className="bg-primary-foreground" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-primary-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter the subject" className="bg-primary-foreground"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[150px] bg-primary-foreground"

                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
          <div className="space-y-2 ">
            <h2 className="text-3xl font-bold tracking-tighter">
              Contact Information
            </h2>
            <div className="space-y-4">
              {/* <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Address</h3>
                <p className="text-muted-foreground">
                  123 Main Street, Anytown USA 12345
                </p>
              </div> */}
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-muted-foreground">+1 (614) 602-2332</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-muted-foreground">ifaceh0@outlook.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
