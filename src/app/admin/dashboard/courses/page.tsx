"use client"

import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs"
import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import "react-quill/dist/quill.snow.css"

import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import { toast } from "@/components/ui/use-toast"
import { createCourseSchema } from "@/Schemas/createCourseSchema"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Pencil, Trash2 } from "lucide-react"

const Font = {
  whitelist: ['arial', 'comic-sans', 'roboto', 'times-new-roman', 'calibri'],
}

export default function CoursesAdministrationPage() {
  const [courses, setCourses] = useState<[]>([])
  const [creatingCourse, setCreatingCourse] = useState<boolean>(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async (limit: number = 20) => {
    setIsLoading(true)
    try {
      const coursesResponse = await axios.get("/api/courses")
      setCourses(coursesResponse.data.courses)
    } catch (error) {
      console.error("Error fetching courses: ", error)
      toast({ title: "Error fetching courses", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const modules = {
    toolbar: [
      [{ 'font': Font.whitelist }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean'],
      ['blockquote'],
    ],
  }

  useEffect(() => {
    fetchData()
  }, [])

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      courseContent: "",
      duration: 0,
    },
  })

  const editForm = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      courseContent: "",
      duration: 0,
    },
  })

  const onSubmit = async (data: z.infer<typeof createCourseSchema>) => {
    setCreatingCourse(true)

    try {
      const response = await axios.post("/api/create-course", data)

      if (response.status === 201) {
        toast({ title: "Course created successfully", variant: "success" })
        fetchData()
        form.reset()
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Error creating course", variant: "destructive" })
    } finally {
      setCreatingCourse(false)
    }
  }

  const onEditSubmit = async (data: z.infer<typeof createCourseSchema>) => {
    setIsUpdating(true)
    try {
      const response = await axios.put(`/api/admin/edit-course/${editingCourse._id}`, data)

      if (response.status === 200) {
        toast({ title: "Course updated successfully", variant: "success" })
        fetchData()
        setEditingCourse(null)
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Error updating course", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete(`/api/admin/delete-course/${courseToDelete._id}`)

      if (response.status === 200) {
        toast({ title: "Course deleted successfully", variant: "success" })
        fetchData()
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Error deleting course", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

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
        const no = getValue()
        return new Intl.NumberFormat("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }).format(no as number)
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => {
              setEditingCourse(row.original)
              editForm.reset({
                title: row.original.title,
                courseContent: row.original.courseContent,
                duration: row.original.duration,
              })
              setIsDialogOpen(true)
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-red-500 hover:text-red-700"
            onClick={() => {
              setCourseToDelete(row.original)
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: courses,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
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
                        )
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
            )}
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
                  {creatingCourse ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Course
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="md:max-w-[900px] max-w-3xl max-h-screen overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 ">
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
                        theme="snow"
                        modules={modules}
                      />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="pt-4" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <p>
            This action cannot be undone. This will permanently delete the course
            and all sessions associated with it.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}