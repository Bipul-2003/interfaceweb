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
import { addDays, format } from "date-fns";
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
import { createSessionSchema } from "@/Schemas/createSessionSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SessionAdministrationPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [creatingSession, setCreatingSession] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const currentDate = new Date();
  const defaultFromDate = addDays(currentDate, 5);
  const defaultToDate = addDays(defaultFromDate, 20);
  const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const fetchSessions = async (limit: number = 20) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/admin/get-sessions?limit=${limit}`
      );
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Error fetching sessions: ", error);
      toast({ title: "Error fetching sessions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async (limit: number = 20) => {
        const coursesResponse = await axios.get("/api/courses");
        setCourses(coursesResponse.data.courses);
      };
      fetchSessions();
      fetchData();
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({ title: "Error fetching data", variant: "destructive" });
    }
  }, []);

  const createForm = useForm<z.infer<typeof createSessionSchema>>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      dateRange: {
        from: defaultFromDate,
        to: defaultToDate,
      },
      days: [],
      price: 10,
      maxCapacity: 2,
      maxWaitingCapacity: 2,
      instructor: "",
      startTime: "",
      endTime: "",
    },
  });

  const editForm = useForm<z.infer<typeof createSessionSchema>>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      dateRange: {
        from: defaultFromDate,
        to: defaultToDate,
      },
      days: [],
      price: 10,
      maxCapacity: 2,
      maxWaitingCapacity: 2,
      instructor: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createSessionSchema>) => {
    setCreatingSession(true);
    try {
      const response = await axios.post("/api/create-session", {
        ...data,
        dateRange: {
          from: data.dateRange.from,
          to: data.dateRange.to,
        },
        googlemeetLink: "https://meet.google.com/abc-xyz",
      });

      if (response.status === 200) {
        toast({ title: "Session created successfully", variant: "success" });
        fetchSessions();
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error creating session", variant: "destructive" });
    } finally {
      setCreatingSession(false);
    }
  };

  const onEditSubmit = async (data: z.infer<typeof createSessionSchema>) => {
    if (!selectedSession) return;
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/api/admin/edit-session/${selectedSession._id}`,
        data
      );
      if (response.status === 200) {
        toast({ title: "Session updated successfully", variant: "success" });
        fetchSessions();
        setIsEditDialogOpen(false);
        setSelectedSession(null);
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error updating session", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedSession) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `/api/admin/delete-session/${selectedSession._id}`
      );
      if (response.status === 200) {
        toast({ title: "Session deleted successfully", variant: "success" });
        fetchSessions();
        setIsDeleteDialogOpen(false);
        setSelectedSession(null);
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error deleting session", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "Sessionno.",
      header: "Session no.",
      accessorFn: (row) => row.sessionno ?? "N/A",
      cell: ({ getValue }) => getValue() || "No title",
    },
    {
      id: "course",
      header: "Course",
      accessorFn: (row) => row.course.title ?? "N/A",
      cell: ({ getValue }) => getValue() || "No title",
    },
    {
      id: "timeline",
      header: "Timeline",
      cell: ({ row }) => {
        const startDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(row.original.startDate as string));

        const endDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(row.original.endDate as string));

        return startDate + " - " + endDate;
      },
    },
    {
      id: "timing",
      header: "Timing",
      cell: ({ row }) => {
        return row.original.startTime + " - " + row.original.endTime;
      },
    },
    {
      id: "days",
      header: "Days",
      accessorFn: (row) => row.days ?? "N/A",
      cell: ({ getValue }) => {
        const days = getValue() as Array<string>;
        return <div className="max-w-lg">{days.join(", ")}</div>;
      },
    },
    {
      id: "instructor",
      header: "Instructor",
      accessorFn: (row) => row.instructor ?? "N/A",
      cell: ({ getValue }) => getValue() || "No title",
    },
    {
      id: "booked",
      header: "Booked",
      accessorKey: "bookedStudentsCount",
      cell: ({ row }) => {
        const count = row.getValue("booked") ?? 0;
        const maxcap = row.original.maxCapacity ?? 0;
        return count + "/" + maxcap;
      },
    },
    {
      id: "enrolled",
      header: "Enrolled",
      accessorKey: "enrolledStudentsCount",
      cell: ({ row }) => {
        const count = row.getValue("enrolled") ?? 0;
        const maxcap = row.original.maxCapacity ?? 0;
        return count + "/" + maxcap;
      },
    },
    {
      id: "waitting",
      header: "Waitting",
      accessorKey: "waitingStudentsCount",
      cell: ({ row }) => {
        const count = row.getValue("waitting") ?? 0;
        const maxcap = row.original.maxWaitingCapacity ?? 0;
        return count + "/" + maxcap;
      },
    },
    {
      id: "date",
      header: "Updated on",
      accessorFn: (row) => row.updatedAt ?? "N/A",
      cell: ({ getValue }) => {
        const date = getValue();
        return date
          ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(date as string))
          : "";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedSession(row.original);
              setIsEditDialogOpen(true);
              editForm.reset({
                courseid: row.original.course._id,
                dateRange: {
                  from: new Date(row.original.startDate),
                  to: new Date(row.original.endDate),
                },
                days: row.original.days,
                price: row.original.price,
                maxCapacity: row.original.maxCapacity,
                maxWaitingCapacity: row.original.maxWaitingCapacity,
                instructor: row.original.instructor,
                startTime: row.original.startTime,
                endTime: row.original.endTime,
              });
            }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-red-500 hover:text-red-700"
            size="icon"
            onClick={() => {
              setSelectedSession(row.original);
              setIsDeleteDialogOpen(true);
            }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sessions,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="pl-8">
      <h1 className="text-3xl font-bold pb-4">Sessions</h1>

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
                  (table.getColumn("course")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("course")?.setFilterValue(event.target.value)
                }
                className="max-w-sm border-2"
              />
            </div>
            {loading ? (
              <div className="text-center py-4">Loading sessions...</div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
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
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <div className="mt-8 ">
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(onSubmit)}
                className="flex-col space-y-6 md:ml-36 max-w-2xl">
                <FormField
                  name="courseid"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Select Course</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course to create a session" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course: any) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:flex md:space-x-4 items-start">
                  <FormField
                    name="dateRange"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="pb-2">
                          Select the Date Range
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                            side="bottom">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                              className="w-auto"
                              today={currentDate}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const fiveDaysAgo = new Date(
                                  today.setDate(today.getDate() + 5)
                                );
                                return (
                                  date < fiveDaysAgo ||
                                  date < new Date("1900-01-01")
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="text-xs">
                          To Change the start date click on the date twice
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="startTime"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Input {...field} placeholder="hh:mm" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="endTime"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <Input {...field} placeholder="hh:mm" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormLabel>Select Days</FormLabel>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day}
                        control={createForm.control}
                        name="days"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(day)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, day]
                                    : field.value.filter((d) => d !== day);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <FormField
                    name="price"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="instructor"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-8">
                  <FormField
                    name="maxCapacity"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Capacity</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="maxWaitingCapacity"
                    control={createForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waiting Capacity</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={creatingSession}
                  type="submit"
                  className="min-w-full">
                  Create Session
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-dvh overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              Make changes to the session details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-6">
              <FormField
                name="courseid"
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Course</FormLabel>
                    <Select onValueChange={field.onChange} disabled value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course: any) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:flex space-x-4 item-center">
                <FormField
                  name="dateRange"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Date Range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className='py-4'>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[260px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto " align="start">
                        <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                              className="w-auto"
                              today={currentDate}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const fiveDaysAgo = new Date(
                                  today.setDate(today.getDate() + 5)
                                );
                                return (
                                  date < fiveDaysAgo ||
                                  date < new Date("1900-01-01")
                                );
                              }}
                            />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="startTime"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Input {...field} placeholder="hh:mm" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="endTime"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Input {...field} placeholder="hh:mm" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Select Days</FormLabel>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <FormField
                      key={day}
                      control={editForm.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes(day)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, day]
                                  : field.value.filter((d) => d !== day);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <FormField
                  name="price"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="instructor"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-4">
                <FormField
                  name="maxCapacity"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Capacity</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="maxWaitingCapacity"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waiting Capacity</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this session? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
