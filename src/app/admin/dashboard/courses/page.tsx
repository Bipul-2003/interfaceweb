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


// import ReactQuill from 'react-quill'; // Import React Quill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { toast } from "@/components/ui/use-toast";
import { createCourseSchema } from "@/Schemas/createCourseSchema";
// import { Textarea } from "@/components/ui/textarea";
// import { TiptapEditor } from "@/components/TextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

// Define fonts and sizes you want to allow
const Font = {
  whitelist: ['arial', 'comic-sans', 'roboto', 'times-new-roman', 'calibri'],
};

export default function CoursesAdministrationPage() {
  const [courses, setCourses] = useState<[]>([]);
  const [creatingCourse, setcreatingCourse] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  

  const fetchData = async (limit: number = 20) => {
    const coursesResponse = await axios.get("/api/courses");
    setCourses(coursesResponse.data.courses);
  };

  // const modules = {
  //   toolbar: [
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     ["bold", "italic", "underline", "strike", "blockquote"],
  //     ["clean"], // Remove formatting button
  //   ],
  // };


  const modules = {
    toolbar: [
      [{ 'font': Font.whitelist }], // Add font options here
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Header options
      [{ 'align': [] }], // Text alignment
      ['bold', 'italic', 'underline', 'strike'], // Formatting options
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List options
      [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript and superscript
      [{ 'indent': '-1' }, { 'indent': '+1' }], // Indentation
      // [{ 'direction': 'rtl' }], // Text direction
      [{ 'color': [] }, { 'background': [] }], // Color and background
      ['link'], // Link, image, video
      // ['link', 'image', 'video'], // Link, image, video
      ['clean'], // Remove formatting button
      ['blockquote'], // Blockquote and code block
      // ['blockquote', 'code-block'], // Blockquote and code block
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

  const editForm = useForm<z.infer<typeof createCourseSchema>>({
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

  const onEditSubmit = async (data: z.infer<typeof createCourseSchema>) => {

    try {
      const response = await axios.put(`/api/admin/edit-course/${editingCourse._id}`, data);

      if (response.status === 200) {
        toast({ title: "Course updated successfully", variant: "success" });
        fetchData();
        setEditingCourse(null);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error updating course", variant: "destructive" });
    }
    // console.log(data)
    // console.log(editingCourse)
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "title",
      header: "Title",
      accessorFn: (row) => row.title ?? "N/A",
      cell: ({ getValue }) => getValue() || "No title",
    },
    {
      id: "duration",
      header: "Duration (hours)",
      accessorFn: (row) => row.duration ?? "N/A",
      cell: ({ getValue }) => {
        const no = getValue();
        return new Intl.NumberFormat("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }).format(no as number);
      },
    },
    {
      id: "edit",
      // header: "Edit",
      cell: ({ row }) => (
        <Button
          variant="outline"
          className=' bg-transparent'
          onClick={() => {
            setEditingCourse(row.original);
            editForm.reset({
              title: row.original.title,
              courseContent: row.original.courseContent,
              duration: row.original.duration,
            });
            setIsDialogOpen(true);
          }}
        >
          <Pencil className='size-4'/>
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: courses,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
            <div className="flex justify-end ">
              <Input
                placeholder="Filter course..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
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
                      data-state={row.getIsSelected() && "selected"}
                    >
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
                      className="h-24 text-center"
                    >
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
                className="flex-col space-y-6 md:ml-36 max-w-2xl"
              >
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
                              e.target.value === "" ? "" : Number(e.target.value)
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
                        <ReactQuill
                          value={field.value}
                          onChange={field.onChange}
                          // className="h-64 pb-6"
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
                  className="min-w-full mt-20"
                >
                  Create Course
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                name="title"
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="duration"
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
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
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        // className="absolute"
                        theme="snow"
                        modules={modules}
                      />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="pt-4">Save Changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}