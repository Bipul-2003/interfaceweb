import { z } from "zod";

export const createSessionSchema = z
  .object({
    courseid: z.string().min(2, "Minimum 2 charecters"),
    instructor: z.string().min(2, "Minimum 2 charecters"),

    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
    price: z.number().positive("Price must be a positive number"),
    maxCapacity: z
      .number()
      .int()
      .positive("Max Capacity must be a positive integer"),
    maxWaitingCapacity: z
      .number()
      .int()
      .positive("Max Waiting Capacity must be a positive integer"),
    googlemeetLink: z.string().url({ message: "Invalid URL" }).optional(),
    startTime: z
      .string()
      .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid Time"),
    endTime: z
      .string()
      .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid Time"),
    days: z.array(z.string()).min(1, "Atleast one day is required"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End Time must be greater than Start Time",
    path: ["endTime"], // This specifies that the error should be attached to `endTime` field
  });
