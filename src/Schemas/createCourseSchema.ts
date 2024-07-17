import { z } from "zod";


export const createCourseSchema = z.object({
    title: z.string().min(2, "Minimum 2 charecters"),
    courseContent: z.string().min(10, "Minimum 10 charecters"),
    duration: z.number().positive("Duration must be a positive number"),
})