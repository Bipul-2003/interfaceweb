"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import axios from "axios";
import getSession from "@/utils/getSession";
import { User } from "lucide-react";
import TanstackTable from "@/components/Table";
import { LoadingSpinner } from "@/components/ui/loader";

interface UserDetails {
  firstname: string;
  middlename?: string;
  lastname: string;
  role: number;
  username: string;
}

const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "courseTitle", // Custom ID for the column
    header: "Course",
    accessorFn: (row) => row.session?.course?.title ?? "N/A", // Safely access nested properties
    cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
  },
  {
    id: "price", // Custom ID for the column
    header: "Price",
    accessorFn: (row) => row.session?.price ?? "", // Safely access nested properties
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
  {
    id: "sessionstartdate", // Custom ID for the column
    header: "Session Start Date",
    accessorFn: (row) => row.session?.startDate ?? null, // Safely access nested properties
    cell: ({ getValue }) => {
      const date = getValue();
      return date
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
            .format(new Date(date as string))
            .replace(/\//g, " ")
        : "";
    },
  },
  {
    id: "paymentlastdate", // Custom ID for the column
    header: "Payment Last Date",
    accessorFn: (row) => row.session?.paymentLastDate ?? null, // Safely access nested properties
    cell: ({ getValue }) => {
      const date = getValue();
      return date
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
            .format(new Date(date as string))
            .replace(/\//g, " ")
        : "";
    },
  },
  {
    accessorKey: "bookingConfirmed",
    header: "Booking Confirmations",
    accessorFn: (row) => row.status,
    cell: ({ getValue }) =>
      getValue()=== "booked" ? "Confirmed" : "Pending",
  },
];

export default function DataTableDemo() {
  const [data, setData] = React.useState([]);
  const [userdetails, setUserdetails] = React.useState<UserDetails | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session?.user) {
        
          return;
        }
        const [userResponse, enrollmentsResponse] = await Promise.all([
          axios.get('/api/get-user-details'),
          axios.get("/api/get-user-enrollments"),
        ]);

        setUserdetails(userResponse.data.user);
        setData(enrollmentsResponse.data.enrolments);
      } catch (error) {
        console.error("Error fetching enrollments: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center ">
        <LoadingSpinner className="size-20  opacity-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pt-24 md:p-10 xl:py-24">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        <div className="rounded-full border-2 ">
           <User className="h-24 w-24 md:h-32 md:w-32 p-2"/>
        </div>
        <div className="grid gap-1 text-center md:text-left">
        <div className="md:flex items-center gap-2 ">
            <h1 className="text-3xl font-bold pb-1">{`${userdetails?.firstname} ${
              userdetails ? userdetails?.middlename : ""
            } ${userdetails?.lastname}`}{" "}</h1>
            <div className="rounded-full bg-primary px-2 max-w-xs py-1 text-xs font-medium text-primary-foreground">{userdetails?.role === 2 ? "User" : userdetails?.role === 1 ? "Admin" : "Tutor"}</div>
          </div>
          <p className="text-muted-foreground">{userdetails?.username}</p>
        </div>
      </div>
      <div className="">
        <h2 className="text-2xl font-bold pb-2">Enrollments</h2>
        <TanstackTable  columns={columns} data={data} />
      </div>
    </div>
  );
}
