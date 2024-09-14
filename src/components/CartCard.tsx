import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, CalendarDays, Clock, Trash2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function CartCard({
  title,
  sessionNo,
  startDate,
  endDate,
  timing,
  instructor,
  days,
  status,
  // bookingDueDate,
  paymentDueDate,
  price,
  onRemove,
}: {
  title: string;
  sessionNo: string;
  status: string;
  startDate: string;
  endDate: string;
  timing: string;
  instructor: string;
  days: string[];
  // bookingDueDate: string,
  paymentDueDate: string;
  price: number;
  onRemove: () => void;
}) {
  return (
    <div className="max-w-md">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <Badge variant="secondary" className="w-fit">
            session: {sessionNo}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="text-sm">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(startDate))} 
                <br />
                 {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(endDate))}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-sm">{timing}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span className="text-sm">Instructor: {instructor}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="text-sm">Days: {days.join(", ")}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Important Dates
            </h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              {/* <li>Booking Due: {bookingDueDate}</li> */}
              <li>Payment Due: {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(paymentDueDate))}</li>
            </ul>
          </div>
          <div className="mt-2 flex items-center ">
            <AlertCircle className="mr-2 h-4 w-4" />
            {/* <span className="text-sm">Only {product.seatsAvailable} seat{product.seatsAvailable !== 1 ? 's' : ''} left out of {product.totalSeats}!</span> */}
            {status === "enrolled" ? (
              <span className="text-sm">enrolled please pay to confirm.</span>
            ) : (
              <span className="text-sm">you are in waiting.</span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold">Price:</span>
            <span className="text-2xl font-bold text-green-600">
              ${price} only
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={onRemove}>
            <Trash2 className="mr-2 h-4 w-4"  />
            Remove
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
