"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function EnrollmentsAdministrationPage() {
  const [enrollments, setEnrollments] = useState<[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    try {
      const fetchData = async (limit: number = 20) => {
        const response = await axios.get(
          `/api/admin/get-enrollments?limit=${limit}`
        );
        setEnrollments(response.data.enrollments);
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching enrollments: ", error);
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

  //   console.log(enrollments);

  const columns: ColumnDef<any>[] = [
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
          <p className="text-muted-foreground pt-1 text-xs">{row.original.user.email}</p>
        </div>
      ) // Display the value or a default text
    },
    {
      id: "course", // Custom ID for the column
      header: "Course",
      accessorFn: (row) => row.session.course.title ?? "N/A", // Safely access nested properties
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

  const table = useReactTable({
    data: enrollments,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="pl-4">
      <h1 className="text-3xl font-bold">Enrollments</h1>
      <div className="flex justify-end py-2">
        <Input
          placeholder="Filter course..."
          value={(table.getColumn("course")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("course")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="">
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
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
