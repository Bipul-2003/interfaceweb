"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, ArrowUpRight, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import axios from "axios";
import TanstackTable from "@/components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loader";

interface User {
  _id: string;
  // include other properties of user as needed
}

export default function DashbordHome() {
  const [data, setData] = useState<{
    enrollments: [];
    totalcounts: {
      total_revenue?: string | null;
      total_users?: string | null;
      total_enrollments?: string | null;
      total_courses?: string | null;
    } | null;
  }>({ enrollments: [], totalcounts: {} });
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async (limit: number = 20) => {
        const [enrollments, totalcounts] = await Promise.all([
          axios.get(`/api/admin/get-enrollments?limit=${limit}`),
          axios.get(`/api/admin/totalcount`),
        ]);
        setData({
          enrollments: enrollments.data.enrollments,
          totalcounts: totalcounts.data.totalcounts,
        });
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching enrollments: ", error);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  async function handelApprove(id: string) {
    console.log(id);

    try {
      const res = await axios.patch(`/api/enrollments/${id}`, {
        paymentDone: true,
        bookingConfirmed: true,
      });
      if (res.status === 200) {
        console.log("Approved");
        toast({ title: "Booking Approved", variant: "success" });
        setRefreshKey((oldKey) => oldKey + 1); // Update the refreshKey to trigger re-render
      }
    } catch (error) {
      console.error("Error approving booking: ", error);
      toast({ title: "Error approving booking", variant: "destructive" });
    }
  }
  async function handelReject(id: string) {
    console.log(id);

    try {
      const res = await axios.get(`/api/admin/reject-enrollment/${id}`);
      if (res.status === 200) {
        console.log("Rejected");
        toast({
          title: "Enrollment Rejected Successfully",
          variant: "success",
        });
        setRefreshKey((oldKey) => oldKey + 1); // Update the refreshKey to trigger re-render
      }
    } catch (error) {
      console.log("Error rejecting enrollment: ", error);
      toast({ title: "Error rejecting enrollment", variant: "destructive" });
    }
  }

  const columns: ColumnDef<any>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },

    {
      id: "Username", // Custom ID for the column
      header: "Username",
      accessorFn: (row) => row.user.username ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "details", // Custom ID for the column
      header: "Deatils",
      // accessorFn: (row) => row.user.username ?? "N/A", // Safely access nested properties
      cell: ({ row }) => (
        <div className="">
          <p>{`${row.original.user.firstname} ${row.original.user.middlename} ${row.original.user.lastname}`}</p>
          <Link href={`mailto:${row.original.user.email}`} className="text-muted-foreground pt-1 text-xs">
            {row.original.user.email}
          </Link>
        </div>
      ), // Display the value or a default text
    },
    {
      id: "Course", // Custom ID for the column
      header: "Course",
      accessorFn: (row) => row.session.course?.title ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "Session", // Custom ID for the column
      header: "Session",
      accessorFn: (row) => row.session.sessionno ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => {
        const no = getValue();
        return new Intl.NumberFormat("en-US", {
          minimumIntegerDigits: 3,
          useGrouping: false,
        }).format(no as number);
      },
    },
    {
      id: "BookedOn", // Custom ID for the column
      header: "Booked On",
      accessorFn: (row) => row.bookedOn ?? "N/A", // Safely access nested properties
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
      id: "price", // Custom ID for the column
      header: "Price",
      accessorFn: (row) => row.price ?? "", // Safely access nested properties
      cell: ({ getValue }) => {
        const amount = parseFloat(getValue() as string);

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="">{formatted}</div>;
      },
    },
    // {
    //   id: "paymentlastdate", // Custom ID for the column
    //   header: "Payment Last Date",
    //   accessorFn: (row) => row.session?.paymentLastDate ?? null, // Safely access nested properties
    //   cell: ({ getValue }) => {
    //     const date = getValue();
    //     return date
    //       ? new Intl.DateTimeFormat("en-US", {
    //           month: "short",
    //           day: "numeric",
    //           year: "numeric",
    //         })
    //           .format(new Date(date as string))
    //           .replace(/\//g, " ")
    //       : "";
    //   },
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "booked" ? (
          <p className="">Confirmed</p>
        ) : (
          <p className="">Pending</p>
        ),
    },
    {
      id: "Approve", // Custom ID for the column
      header: () => <div className="flex gap-x-2">Approve / Reject</div>,
      // accessorFn: (row) => row.user._id ?? "", // Safely access nested properties
      cell: ({ row }) => {
        const id = row.original._id?.toString();
        console.log(id);

        const status = row.original.status;
        // console.log(status);

        return (
          <div className="flex items-center">
            {status === "enrolled" ? (
              <div className="flex justify-center gap-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    handelApprove(id as string);
                  }}
                  className="bg-primary px-4 text-white">
                  Approve
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handelReject(id as string);
                  }}
                  className="bg-destructive px-4 text-white">
                  Reject
                </Button>
              </div>
            ) : (
              <Button disabled size="sm" className="bg-primary text-white">
                Approved
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
          <LoadingSpinner />
        </div>
      </div>
    );
  }  

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-accent/50 ">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalcounts?.total_users}
            </div>
            {/* <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p> */}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalcounts?.total_enrollments}
            </div>
            {/* <p className="text-xs text-muted-foreground">
            +19% from last month
          </p> */}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalcounts?.total_courses}
            </div>
            {/* <p className="text-xs text-muted-foreground">
            +201 since last hour
          </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 overflow-x-scroll lg:overflow-auto">
        <Card className="xl:col-span-3" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Leatest Enrollments</CardTitle>
              <CardDescription>
                Recent enrollments from your app.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/dashboard/enrollments">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TanstackTable data={data.enrollments} columns={columns} />
          </CardContent>
        </Card>
        {/* <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Last Conf. Bookings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$299.00</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">+$99.00</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </main>
  );
}
