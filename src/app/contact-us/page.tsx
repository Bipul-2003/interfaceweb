"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactUs() {
  const [key, setKey] = useState(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY);
  const [submitting, setSubmitting] = useState(false);

  const onHCaptchaChange = (token: string) => {
    setValue("h-captcha-response", token);
  };

  const { register, handleSubmit, setValue } = useForm();

  async function onSubmit(data: any) {
    setSubmitting(true);

    // console.log(data);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          from_name: "InterfaceHub LLC",
          ...data,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast({
          variant: "success",
          title: "Message sent successfully!",
          description: "We will get back to you soon!",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-9">
      <section
        id="contact-form"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24 ">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Send Us a Message
            </h2>
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="bg-primary-foreground"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="bg-primary-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="Enter the subject"
                  className="bg-primary-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Enter your message"
                  className="min-h-[150px] bg-primary-foreground"
                />
              </div>
              <HCaptcha
                sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                reCaptchaCompat={false}
                onVerify={onHCaptchaChange}
              />
              <Button type="submit" disabled={submitting} className="w-full">
                Submit
              </Button>
            </form>
          </div>
          <div className="space-y-2 ">
            <h2 className="text-3xl font-bold tracking-tighter mb-14">
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
