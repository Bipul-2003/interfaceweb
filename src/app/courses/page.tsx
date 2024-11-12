"use client";

import { LoadingSpinner } from "@/components/ui/loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CourseType } from "@/models/Courses";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    <div className="h-full w-full flex flex-col pt-24 md:mx-6">
      <h1 className="font-bold text-2xl md:text-3xl ">Courses</h1>
      <p className="text-muted-foreground">
        Explore the courses to learn and grow.
      </p>
      <div className="grid grid-cols-2 py-8 md:grid-cols-3 gap-8 mb-36 px-4 max-w-screen-lg">
        {allcourses.courses.map((course: CourseType) => (
          <Card key={String(course._id)}>
            <Image
              src="/learning.svg"
              width={300}
              height={150}
              alt="Course Image"
              className="rounded-t-lg object-fit object-left w-full aspect-[8/2] bg-muted"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{course.title}</h3>
              {/* <p className="text-muted-foreground text-sm line-clamp-2">
    Learn the essential skills to build modern, responsive web applications.
  </p> */}
              <div className=" flex-row md:flex justify-between items-center ">
                <div className="text-sm font-medium">
                  <span className="text-primary">
                    {" "}
                    {`${course.duration} hours`}
                  </span>
                </div>
                <Button className="my-4 " asChild>
                  <Link href={`/courses/${String(course._id)}`}>
                    Get Sessions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
