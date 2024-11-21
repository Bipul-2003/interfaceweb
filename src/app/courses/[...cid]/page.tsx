'use client'

import React, { useEffect, useState, useCallback } from "react"
import dynamic from 'next/dynamic'
import axios from "axios"
import Link from 'next/link'
import { CourseType } from "@/models/Courses"
import { SessionType } from "@/models/Sessions"
import { User } from "next-auth"
import { useCart } from "@/context/cartCount"
import { useToast } from "@/components/ui/use-toast"
import getSession from "@/utils/getSession"
import { ChevronRight } from 'lucide-react'

// Import shadcn/ui Breadcrumb components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Dynamic imports for better code splitting
const LoadingSpinner = dynamic(() => import("@/components/ui/loader").then(mod => mod.LoadingSpinner))
const Tabs = dynamic(() => import("@/components/ui/tabs").then(mod => mod.Tabs))
const TabsContent = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsContent))
const TabsList = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsList))
const TabsTrigger = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsTrigger))
const Button = dynamic(() => import("@/components/ui/button").then(mod => mod.Button))
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog))
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent))
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader))
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle))
const DialogDescription = dynamic(() => import("@radix-ui/react-dialog").then(mod => mod.DialogDescription))
const SessionCards = dynamic(() => import("@/components/SessionCards"))

// Lazy load React Quill styles
import "react-quill/dist/quill.snow.css"
import CourseContentRenderer from "@/components/CourseContentRenderer"

const fetchCourseData = async (id: string) => {
  const [sessionsResponse, courseResponse] = await Promise.all([
    axios.get(`/api/get-sessions/${id}`),
    axios.get(`/api/courses/${id}`),
  ])
  return {
    sessions: sessionsResponse.data.sessions,
    course: courseResponse.data.course,
  }
}

export default function Component({ params }: { params: { cid: string } }) {
  const { toast } = useToast()
  const id = params.cid.toString()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null)
  const [bookingHappening, setBookingHappening] = useState<string | null>(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [state, setState] = useState<{
    user: User | null
    sessions: SessionType[]
    course: CourseType
  }>({
    user: null,
    sessions: [],
    course: {} as CourseType,
  })

  const { updateCart } = useCart()

  const fetchAndSetData = useCallback(async () => {
    try {
      const session = await getSession()
      const { sessions, course } = await fetchCourseData(id)
      const bookingStatus =
        ["Enrolled", "Waiting", "Booked"].find((status) =>
          sessions.some((s: any) =>
            s[`${status.toLowerCase()}Students`]
              .toString()
              .includes(session?.user?.id || " ")
          )
        ) || null

      setStatus(bookingStatus)
      setState({
        user: session?.user || null,
        sessions,
        course,
      })
    } catch (error) {
      console.error(error)
      toast({ title: "Error fetching data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchAndSetData()
  }, [fetchAndSetData])

  const createEnrollment = useCallback(async (sessionId: string) => {
    setSelectedSession(null)
    try {
      setBookingHappening(sessionId)
      const res = await axios.post("/api/create-enrollment", {
        user: state.user?.id,
        session: sessionId,
      })

      if (res.status === 200) {
        toast({ title: res.data.message, variant: "success" })
        const updatedSession = res.data.data

        setState((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) =>
            session._id === sessionId ? updatedSession : session
          ),
        }))
        setButtonDisabled(true)
      }
      updateCart()
    } catch (error: any) {
      console.error(error)
      if (error.response) {
        toast({ title: error.response.data.message, variant: "destructive" })
      }
    } finally {
      setBookingHappening(null)
    }
  }, [state.user?.id, toast, updateCart])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner className="size-20 opacity-40" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 mx-6">
      {/* shadcn/ui Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{state.course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="op">
          <DialogHeader>
            <DialogTitle className="text-4xl">Details</DialogTitle>
            <DialogDescription className="">
              Please go through it thoroughly.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ul className="space-y-4">
              <li className="flex w-full justify-between">
                <span className="font-bold">Start Date:</span>
                {selectedSession && new Date(selectedSession.startDate).toLocaleDateString(
                  "en-us",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">End Date: </span>
                {selectedSession && new Date(selectedSession.endDate).toLocaleDateString(
                  "en-us",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">Instructor: </span>
                {selectedSession?.instructor}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">Days: </span>
                {selectedSession?.days.map((day: string) => `${day} `)}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">Seats Available: </span>
                {selectedSession && `${
                  selectedSession.maxCapacity -
                  selectedSession.enrolledStudents.length
                }/${selectedSession.maxCapacity}`}
              </li>
              {selectedSession && selectedSession.maxCapacity -
                selectedSession.enrolledStudents.length === 0 && (
                <li className="flex w-full justify-between">
                  <span className="font-bold">Waiting Seats Available: </span>
                  {`${
                    selectedSession.maxWaitingCapacity -
                    selectedSession.waitingStudents.length
                  }/${selectedSession.maxWaitingCapacity}`}
                </li>
              )}
              <li className="flex w-full justify-between">
                <span className="font-bold">Timing: </span>
                {selectedSession && `${selectedSession.startTime} - ${selectedSession.endTime}`}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">Booking Due Date: </span>
                {selectedSession && new Date(selectedSession.bookingLastDate).toLocaleDateString(
                  "en-us",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </li>
              <li className="flex w-full justify-between">
                <span className="font-bold">Payment Due Date: </span>
                {selectedSession && new Date(selectedSession.paymentLastDate).toLocaleDateString(
                  "en-us",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </li>
            </ul>
            <p className="my-3 opacity-50">Price:</p>
            <div className="flex items-center justify-between pl-4">
              <p className="font-bold text-5xl">
                {selectedSession && `$${selectedSession.price}`}{" "}
                <span className="text-lg font-normal">only</span>
              </p>
              <Button
                onClick={() =>
                  !buttonDisabled && selectedSession && createEnrollment(selectedSession._id as string)
                }
                disabled={buttonDisabled || !!status}
              >
                {bookingHappening === selectedSession?._id ? (
                  <LoadingSpinner />
                ) : (
                  ["Enrolled", "Waiting", "Booked"].find((status) =>
                    (selectedSession as any)?.[`${status.toLowerCase()}Students`]
                      ?.toString()
                      .includes(state.user?.id || " ")
                  ) || "Add to Cart"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <h1 className="font-bold text-3xl pb-4">{state.course.title}</h1>
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Description</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="p-2 max-w-screen-lg">
          <CourseContentRenderer content={state.course.courseContent} />
        </TabsContent>
        <TabsContent value="sessions" className="p-2 max-w-screen-lg">
          <div className="grid md:grid-cols-4 gap-2">
            {state.sessions.length !== 0 ? (
              state.sessions.map((session: SessionType) => (
                <SessionCards
                  key={String(session._id)}
                  session={session}
                  bookingHappening={bookingHappening as string}
                  createEnrollment={createEnrollment}
                  openDialog={() => setSelectedSession(session)}
                  status={!!(buttonDisabled || status)}
                  lable={
                    ["Enrolled", "Waiting", "Booked"].find((status) =>
                      (session as any)[`${status.toLowerCase()}Students`]
                        .toString()
                        .includes(state.user?.id || " ")
                    ) || "Add to Cart"
                  }
                />
              ))
            ) : (
              <div>No sessions available</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}