"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from 'next/dynamic';
import axios from "axios";
import { CourseType } from "@/models/Courses";
import { SessionType } from "@/models/Sessions";
import { User } from "next-auth";
import { useCart } from "@/context/cartCount";
import { useToast } from "@/components/ui/use-toast";
import getSession from "@/utils/getSession";

// Dynamic imports for better code splitting
const LoadingSpinner = dynamic(() => import("@/components/ui/loader").then(mod => mod.LoadingSpinner));
const Tabs = dynamic(() => import("@/components/ui/tabs").then(mod => mod.Tabs));
const TabsContent = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsContent));
const TabsList = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsList));
const TabsTrigger = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsTrigger));
const Button = dynamic(() => import("@/components/ui/button").then(mod => mod.Button));
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));
const DialogDescription = dynamic(() => import("@radix-ui/react-dialog").then(mod => mod.DialogDescription));
const SessionCards = dynamic(() => import("@/components/SessionCards"));

// Lazy load React Quill styles
import"react-quill/dist/quill.snow.css";

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
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [bookingHappening, setBookingHappening] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [label, setLabel] = useState("Add to Cart");
  const [state, setState] = useState<{
    user: User | null;
    sessions: SessionType[];
    course: CourseType;
  }>({
    user: null,
    sessions: [],
    course: {} as CourseType,
  });

  const { updateCart } = useCart();

  const fetchAndSetData = useCallback(async () => {
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
      setState({
        user: session?.user || null,
        sessions,
        course,
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error fetching data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchAndSetData();
  }, [fetchAndSetData]);

  const createEnrollment = useCallback(async (sessionId: string) => {
    setSelectedSession(null);
    try {
      setBookingHappening(sessionId);
      const res = await axios.post("/api/create-enrollment", {
        user: state.user?.id,
        session: sessionId,
      });

      if (res.status === 200) {
        toast({ title: res.data.message, variant: "success" });
        const updatedSession = res.data.data;

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
            : "Add to Cart"
        );
        setButtonDisabled(true);
      }
      updateCart();
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        toast({ title: error.response.data.message, variant: "destructive" });
      }
    } finally {
      setBookingHappening(null);
    }
  }, [state.user?.id, toast, updateCart]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner className="size-20 opacity-40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 mx-6">
      {/* Dialog and other components ... */}
      <h1 className="font-bold text-3xl pb-4">{state.course.title}</h1>
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Description</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="p-2 max-w-screen-md">
          <div className="prose mt-2 quill-content" dangerouslySetInnerHTML={{ __html: state.course.courseContent }} />
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
  );
};

export default Course;
