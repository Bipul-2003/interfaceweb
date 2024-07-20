"use client";

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
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getSession from "@/utils/getSession";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "next-auth";

export default function UsersAdministrationPage() {

  const router = useRouter();
  const [users, setUsers] = useState<[]>([]);
  const [user, setUser] = useState<User>();
  const [creatingCourse, setCreatingCourse] = useState<boolean>(false);

  const fetchData = async (limit: number = 20) => {
    try {
      const usersResponse = await axios.get("/api/admin/get-all-users");
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };


  useEffect(() => {
    
    const fetchUser = async () => {
      const session = await getSession();
      setUser(session?.user);
      
      if (!session?.user) {
        router.replace("/sign-in");
      }
      if (session?.user?.role !== 1) {
        router.replace("/");
      }
    }
    fetchUser();
    fetchData();
  },[user,router]);

  const onSubmit = async (id: string, role: string) => {
    setCreatingCourse(true);
    try {
      const response = await axios.patch("/api/admin/update-user", {
        id,
        role: Number(role),
      });
      if (response.status === 200) {
        toast({ title: "User updated successfully", variant: "success" });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Error updating user", variant: "destructive" });
    } finally {
      setCreatingCourse(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "username", // Custom ID for the column
      header: "Username",
      accessorFn: (row) => row.username ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "name", // Custom ID for the column
      header: "Name",
      cell: ({ row }) =>
        `${row.original.firstname} ${row.original.middlename} ${row.original.lastname}`, // Display the value or a default text
    },
    {
      id: "email", // Custom ID for the column
      header: "Email",
      accessorFn: (row) => row.email ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "phonenumber", // Custom ID for the column
      header: "Phone number",
      accessorFn: (row) => row.phonenumber ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue() || "No title", // Display the value or a default text
    },
    {
      id: "role", // Custom ID for the column
      header: "Role",
      accessorFn: (row) => row.role ?? "N/A", // Safely access nested properties
      cell: ({ row }) => {
        const user_role = row.getValue("role")?.toString() as string;
        const id = row.original._id?.toString() as string;

        return (
          <Select
            defaultValue={user_role}
            onValueChange={(value) => onSubmit(id, value)}
          >
            <SelectTrigger className="max-w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="1">admin</SelectItem>
              <SelectItem value="2">student</SelectItem>
              <SelectItem value="3">instructor</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "isVerified", // Custom ID for the column
      header: "Verified",
      accessorFn: (row) => row.isVerified ?? "N/A", // Safely access nested properties
      cell: ({ getValue }) => getValue()?.toString() || "No title", // Display the value or a default text
    },
  ];

  const table = useReactTable({
    data: users,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="pl-4">
      <h1 className="text-3xl font-bold pb-4">Users</h1>
      <div className="">
        <div className="flex justify-end py-2">
          <Input
            placeholder="Filter user..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("username")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border-2"
          />
          <Button onClick={()=>fetchData()} className="mx-2">Refresh</Button>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
