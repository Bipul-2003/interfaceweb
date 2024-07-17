"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useState } from "react";
import { InputOTPForm } from "@/components/otp-verify";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { signUpSchema } from "@/Schemas/signUpSchema";
import { PhoneInput } from "@/components/ui/phone-input";

export default function SignUpForm() {
  const [loading, setloading] = useState(false);
  const [dialogopened, setDialogopened] = useState(false);


  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      middname: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    //console.log(data);
    setloading(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      if (response) {
        setDialogopened(true);
        toast({
          title: "Success",
          description: "User created successfully"
        })
      }
    } catch (error) {
      console.log("Field to sign-up", error);
    } finally {
      setloading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="">
        <Card className="">
        <Dialog open={dialogopened} onOpenChange={setDialogopened}>
          <DialogContent>
            <InputOTPForm email={form.getValues().email} username={form.getValues().username}/>
          </DialogContent>
        </Dialog>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="text-2xl">Signup</CardTitle>
                <CardDescription>
                  {" "}
                  Enter your details below to register.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <FormField
                    name="firstname"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firstname</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="middname"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middlename</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lastname"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lastname</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="phonenumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone no.</FormLabel>
                      <PhoneInput {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={loading} type="submit">{loading ? "Signing up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </Form>
          <div className="text-center pb-2">
            <p>
              Already a member ?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
        
      </div>
    </div>
  );
}
