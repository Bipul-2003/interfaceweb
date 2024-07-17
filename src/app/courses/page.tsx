"use client";

import { LoadingSpinner } from "@/components/ui/loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CourseType } from "@/models/Courses";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock2 } from "lucide-react";
import Link from "next/link";

interface CoursesResponse {
  courses: CourseType[];
}
const Courses = () => {
  const [allcourses, setAllcourses] = useState<CoursesResponse>({
    courses: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const response = await axios.get("/api/courses");
      // console.log(response.data);
      setAllcourses(response.data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner className="size-20  opacity-40" />
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col pt-24">
      <h1 className="font-bold text-3xl md:text-4xl mb-6">Courses</h1>
      <div className="grid grid-cols-2 py-10 md:grid-cols-4 gap-4 ">
        {allcourses.courses.map((course: CourseType) => (
          <Card key={String(course._id)} className="p-2 md:p-8">
            <Link href={`/courses/${String(course._id)}`}>
              <CardHeader>
                <CardTitle className="text-base md:text-2xl ">{course.title}</CardTitle>
                {/* <CardDescription>{course.courseContent}</CardDescription> */}
              </CardHeader>
              <CardFooter className="text-xs md:text-sm">
                <Clock2 className="size-4 mr-2" />
                {`${course.duration} hours`}
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
