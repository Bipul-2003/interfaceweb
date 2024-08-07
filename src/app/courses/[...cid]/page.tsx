"use client";

import React, { useEffect, useState } from "react";
import { CourseType } from "@/models/Courses";
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

import { useToast } from "@/components/ui/use-toast";
import getSession from "@/utils/getSession";
import { User } from "next-auth";
import { SessionType } from "@/models/Sessions";
import SessionCards from "@/components/SessionCards";


const fetchCourseData = async (id: string) => {
  const [sessionsResponse, courseResponse] = await Promise.all([
    axios.get(`/api/get-sessions/${id}`),
    axios.get(`/api/courses/${id}`),
  ]);
  return {
    sessions: sessionsResponse.data.sessions,
    course: courseResponse.data.course,
  };
};

const Course = ({ params }: { params: { cid: string } }) => {
  const { toast } = useToast();
  const id = params.cid.toString();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>();
  const [selectedSession, setSelectedSession] = useState<any>();
  const [bookingHappening, setBookingHappening] = useState<any>();
  const [buttonDisbled, setbuttonDisbled] = useState(false);
  const [label, setLabel] = useState("Book now");

  // const [bookings, setBookings] = useState<any>([]);
  const [state, setState] = useState<{
    user: User | null;
    sessions: SessionType[];
    course: CourseType;
  }>({
    user: null,
    sessions: [],
    course: {} as CourseType,
  });



  

  const createEnrollment = async (sessionId: string) => {
    setSelectedSession(null);
    try {
      console.log(state.user?.id);

      setBookingHappening(sessionId);
      const res = await axios.post("/api/create-enrollment", {
        user: state.user?.id,
        session: sessionId,
      });
      // console.log(res);
      // setBookings([...bookings, sessionId]);

      if (res.status === 200) {
        toast({ title: res.data.message, variant: "success" });

        // Assuming the API returns the updated session object
        const updatedSession = res.data.data;

        // Update the local state to reflect the new enrollment status
        setState((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) =>
            session._id === sessionId ? updatedSession : session
          ),
        }));
        setLabel(
          updatedSession.enrolledStudents.includes(state.user?.id)
            ? "Enrolled"
            : updatedSession.waitingStudents.includes(state.user?.id)
            ? "Waiting"
            : updatedSession.bookedStudents.includes(state.user?.id)
            ? "Booked"
            : "Book now"
        );
        setbuttonDisbled(true);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast({ title: error.response.data.message, variant: "destructive" });
      }
    } finally {
      setBookingHappening("");
    }
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const { sessions, course } = await fetchCourseData(id);
        const bookingStatus =
          ["Enrolled", "Waiting", "Booked"].find((status) =>
            sessions.some((s: any) =>
              s[`${status.toLowerCase()}Students`]
                .toString()
                .includes(session?.user?.id || " ")
            )
          ) || null;
  
        setStatus(bookingStatus);
        setState((prevState) => ({
          ...prevState,
          user: session?.user || null,
          sessions,
          course,
          loading: false,
        }));
      } catch (error) {
        console.log(error);
        toast({ title: "Error fetching data", variant: "destructive" });
        setState((prevState) => ({ ...prevState, loading: false }));
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetData();
  }, [id, toast]);
  
  

  
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner className="size-20 opacity-40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pt-28 ">
      <Dialog
        open={selectedSession}
        onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-4xl">Details </DialogTitle>
            <DialogDescription className="">
              Please go through it thoroughly.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ul className="space-y-4">
              <li className="flex w-full justify-between">
                <span className="font-bold">Start Date:</span>
                {new Date(selectedSession?.startDate).toLocaleDateString(
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
                {new Date(selectedSession?.endDate).toLocaleDateString(
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
                {`${
                  selectedSession?.maxCapacity -
                  selectedSession?.enrolledStudents.length
                }/${selectedSession?.maxCapacity}`}
              </li>
              {selectedSession?.maxCapacity -
                selectedSession?.enrolledStudents.length ===
                0 && (
                <li className="flex w-full justify-between">
                  <span className="font-bold">Waiting Seates Available: </span>
                  {`${
                    selectedSession?.maxWaitingCapacity -
                    selectedSession?.waitingStudents.length
                  }/${selectedSession?.maxWaitingCapacity}`}
                </li>
              )}
              <li className="flex w-full justify-between">
                <span className="font-bold">Timing: </span>
                {`${selectedSession?.startTime} - ${selectedSession?.endTime}`}
              </li>

              <li className="flex w-full justify-between">
                <span className="font-bold">Booking Due Date: </span>
                {new Date(selectedSession?.bookingLastDate).toLocaleDateString(
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
                {new Date(selectedSession?.paymentLastDate).toLocaleDateString(
                  "en-us",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </li>
            </ul>
            <p className=" my-3 opacity-50">Price:</p>
            <div className="flex items-center justify-between pl-4">
              <p className="font-bold text-5xl">
                {`$${selectedSession?.price}`}{" "}
                <span className="text-lg font-normal">only</span>
              </p>

              <Button
                onClick={() =>
                  !buttonDisbled && createEnrollment(selectedSession?._id)
                }
                disabled={buttonDisbled || status}>
                {bookingHappening === selectedSession?._id ? (
                  <LoadingSpinner />
                ) : (
                  status || label
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <h1 className="font-bold text-4xl mb-6 ">{state.course.title}</h1>
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Description</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="p-2 max-w-screen-md">
          {state.course.courseContent}
        </TabsContent>
        <TabsContent value="sessions" className="p-2 max-w-screen-lg ">
          <div className="grid md:grid-cols-4 gap-4">
            {state.sessions.length !== 0 ? (
              state.sessions.map((session: any) => (
                <div key={String(session._id)}>
                  <SessionCards
                    session={session}
                    bookingHappening={bookingHappening}
                    createEnrollment={createEnrollment}
                    openDialog={() => setSelectedSession(session)}
                    status={buttonDisbled || status}
                    lable={
                      ["Enrolled", "Waiting", "Booked"].find((status) =>
                        session[`${status.toLowerCase()}Students`]
                          .toString()
                          .includes(state.user?.id || " ")
                      ) || "Book now"
                    }
                  />
                </div>
              ))
            ) : (
              <div>No sessions available</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Course;
