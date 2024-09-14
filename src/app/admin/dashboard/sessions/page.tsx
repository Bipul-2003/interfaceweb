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
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

export default function SessionAdministrationPage() {
  const [sessions, setSession] = useState<[]>([]);
  const [courses, setCourses] = useState<[]>([]);
  const [creatingSession, setcreatingSession] = useState<boolean>(false);
  const currentDate = new Date();
  const defaultFromDate = addDays(currentDate, 5);
  const defaultToDate = addDays(defaultFromDate, 20);
  const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const fetchSessions = async (limit: number = 20) => {
    try {
      const response = await axios.get(
        `/api/admin/get-sessions?limit=${limit}`
      );
      setSession(response.data.sessions);
    } catch (error) {
      console.error("Error fetching sessions: ", error);
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
      console.error("Error fetching enrollments: ", error);
    }
  }, []);

  const form = useForm<z.infer<typeof createSessionSchema>>({
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
    // console.log(data);
    setcreatingSession(true);
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
      setcreatingSession(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "Sessionno.", // Custom ID for the column
      header: "Session no.",
      accessorFn: (row) => row.sessionno ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "course", // Custom ID for the column
      header: "Course",
      accessorFn: (row) => row.course.title ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "timeline", // Custom ID for the column
      header: "Timeline",
      // accessorFn: (row) => {
      //     const startDate = row.startDate ?? "N/A";
      //     const endDate = row.endDate ?? "N/A";
      //     return [startDate,endDate]

      // }, // Safely access nested properties
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
      }, // Display the value or a default text
    },
    {
      id: "timing", // Custom ID for the column
      header: "Timing",

      cell: ({ row }) => {
        return row.original.startTime + " - " + row.original.endTime;
      }, // Display the value or a default text
    },
    {
      id: "days", // Custom ID for the column
      header: "Days",
      accessorFn: (row) => row.days ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => {
        const days = getValue() as Array<string>;

        return <div className="max-w-lg">{days.join(", ")}</div>;
      }, // Display the value or a default text
    },
    {
      id: "instructor", // Custom ID for the column
      header: "Instructor",
      accessorFn: (row) => row.instructor ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "booked", // Custom ID for the column
      header: "Booked",

      accessorKey: "bookedStudentsCount", // Safely access nested properties
      cell: ({ row }) => {
        const count = row.getValue("booked") ?? 0;
        const maxcap = row.original.maxCapacity ?? 0;

        return count + "/" + maxcap;
      }, // Display the value or a default text
    },
    {
      id: "enrolled", // Custom ID for the column
      header: "Enrolled",

      accessorKey: "enrolledStudentsCount", // Safely access nested properties
      cell: ({ row }) => {
        const count = row.getValue("enrolled") ?? 0;
        const maxcap = row.original.maxCapacity ?? 0;

        return count + "/" + maxcap;
      }, // Display the value or a default text
    },
    {
      id: "waitting", // Custom ID for the column
      header: "Waitting",

      accessorKey: "waitingStudentsCount", // Safely access nested properties
      cell: ({ row }) => {
        const count = row.getValue("waitting") ?? 0;
        const maxcap = row.original.maxWaitingCapacity ?? 0;

        return count + "/" + maxcap;
      }, // Display the value or a default text
    },

    {
      id: "date", // Custom ID for the column
      header: "Updated on",
      accessorFn: (row) => row.updatedAt ?? "N/A", // Safely access nested properties
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
  ];

  const table = useReactTable({
    data: sessions,
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
                  name="courseid"
                  control={form.control}
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
                    control={form.control}
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
                          <PopoverContent className="w-auto p-0" align="start" side="bottom" >
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
                                // date.getTime
                                // Create a new date object for today
                                const today = new Date();
                                // Set the hours to the start of the day to ignore time part
                                today.setHours(0, 0, 0, 0);
                                // Subtract 5 days from today
                                const fiveDaysAgo = new Date(
                                  today.setDate(today.getDate() + 5)
                                );
                                // Disable dates before 5 days ago and before Jan 1, 1900
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
                    control={form.control}
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
                    control={form.control}
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
                        control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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

                <Button disabled={creatingSession} type="submit" className="min-w-full">
                  Create Session
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
