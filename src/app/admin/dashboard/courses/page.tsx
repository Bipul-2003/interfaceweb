"use client";

import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import "react-quill/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { toast } from "@/components/ui/use-toast";
import { createCourseSchema } from "@/Schemas/createCourseSchema";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/TextEditor";

export default function CoursesAdministrationPage() {
  const [courses, setCourses] = useState<[]>([]);
  const [creatingCourse, setcreatingCourse] = useState<boolean>(false);

  const fetchData = async (limit: number = 20) => {
    const coursesResponse = await axios.get("/api/courses");
    setCourses(coursesResponse.data.courses);
  };

  const modules = {
    toolbar: [
      // [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      // [{ indent: "-1" }, { indent: "+1" }], // Indent options
      ["bold", "italic", "underline", "strike", "blockquote"],
      // [{ color: [] }, { background: [] }], // Text color and background color
      // [{ align: [] }],
      [
        // "link",
        // 'image',
        //  'video'
      ],
      ["clean"], // Remove formatting button
    ],
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  }, []);

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      courseContent: "",
      duration: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof createCourseSchema>) => {
    console.log(data);
    setcreatingCourse(true);

    try {
      const response = await axios.post("/api/create-course", data);

      if (response.status === 201) {
        toast({ title: "Course created successfully", variant: "success" });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error creating course", variant: "destructive" });
    } finally {
      setcreatingCourse(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "title", // Custom ID for the column
      header: "Title",
      accessorFn: (row) => row.title ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "duration", // Custom ID for the column
      header: "Duration (hours)",
      accessorFn: (row) => row.duration ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => {
        const no = getValue();
        return new Intl.NumberFormat("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }).format(no as number);
      }, // Display the value or a default text
    },
  ];

  const table = useReactTable({
    data: courses,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    // state: {
    //   sorting,
    //   columnFilters,
    //   rowSelection,
    // },
  });
  return (
    <div className="pl-8">
      <h1 className="text-3xl font-bold pb-4">Courses</h1>

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <div className="">
            <div className="flex justify-end py-2">
              <Input
                placeholder="Filter course..."
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm border-2"
              />
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="create">
          <div className="mt-8 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-col space-y-6 md:ml-36 max-w-2xl">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>

                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="duration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Duration in hours</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="courseContent"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        {/* <Textarea {...field} className="h-36" /> */}
                        {/* <TiptapEditor content={field.value} onChange={field.onChange} /> */}
                        <ReactQuill
                          value={field.value}
                          onChange={field.onChange}
                          className="h-64 pb-6"
                          theme="snow"
                          modules={modules}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={creatingCourse}
                  type="submit"
                  className="min-w-full mt-20">
                  Create Course
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
