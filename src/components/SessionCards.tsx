import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loader";


 export default function SessionCards({
  session,
  bookingHappening,
  createEnrollment,
  openDialog,
  status,
  lable,
}: {
  session: any;
  bookingHappening: string;
  createEnrollment: Function;
  openDialog: Function;
  status: boolean;
  lable: string;
}) {
  console.log(session);
  

  

  // console.log(statusLabel);
  
  return (
    <div className="">
      <Card >
        <CardHeader>
          <CardTitle className="text-xl">{`${new Date(
            session.startDate
          ).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
          })} - ${new Date(session.endDate).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
          })}`}</CardTitle>
          <p className="text-sm">
            {session.days.map((day: string) => ` ${day}`)}
          </p>
          <p className="text-xs">{`${session.startTime} - ${session.endTime}`}</p>
        </CardHeader>
        <CardContent>
          <p className="flex items-center pb-2 font-bold">
            <DollarSign className="size-4" />
            {session.price}
          </p>
          <div className="flex gap-x-2 justify-start">
            <Button
              onClick={() => createEnrollment(String(session._id))}
              disabled={status}>
              {bookingHappening === session?._id ? (
                <LoadingSpinner />
              ) : (
                lable
              )}
            </Button>
            <Button variant="outline" onClick={() => openDialog(true)}>
              Get details
            </Button>{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


