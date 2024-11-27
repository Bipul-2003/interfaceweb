import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface JobOpening {
  title: string;
  description: string;
  type: string;
}

const jobOpenings: JobOpening[] = []

// const jobOpenings: JobOpening[] = [
//   {
//     title: "Senior Software Engineer",
//     description: "Lead the development of our core web application and APIs.",
//     type: "Full-time",
//   },
//   {
//     title: "Product Designer",
//     description: "Design intuitive and visually appealing user interfaces.",
//     type: "Full-time",
//   },
//   {
//     title: "Content Strategist",
//     description: "Develop and execute content strategies to engage our audience.",
//     type: "Full-time",
//   },
//   {
//     title: "Marketing Coordinator",
//     description: "Support our marketing team in executing campaigns and events.",
//     type: "Full-time",
//   },
//   {
//     title: "Customer Success Manager",
//     description: "Ensure our customers have a delightful experience with our product.",
//     type: "Full-time",
//   },
//   {
//     title: "Technical Writer",
//     description: "Create clear and engaging documentation for our products and services.",
//     type: "Full-time",
//   },
// ];

export default function Component() {
  return (
    <div className="flex flex-col pt-12 min-h-dvh">
      <section className="w-full py-12 md:py-20  bg-[url('/background.jpg')]  bg-cover">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold  sm:text-5xl md:text-5xl">
              Join the Interface Hub Team
            </h1>
            <p className="text-primary-foreground/80 max-w-[600px] text-xl md:text-xl py-4">
              At Interface Hub, we&apos;re empowering small businesses with cutting edge technologies. Come be a part of our talented and
              passionate team.
            </p>
            <Link
              href="#openings"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              View Open Positions
            </Link>
          </div>
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Our Core Values</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Integrity
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Innovation
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Collaboration
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Continuous Learning
              </li>
            </ul>
            <h2 className="text-2xl font-bold">Benefits</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Competitive Salary
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Comprehensive Health Insurance
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Generous Paid Time Off
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary" />
                Retirement Savings Plan
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32" id="openings">
        <div className="container px-4 md:px-6">
          {jobOpenings.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {jobOpenings.map((job, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground">
                        <CalendarDaysIcon className="mr-2 inline-block h-4 w-4" />
                        {job.type}
                      </div>
                      <Link
                        href="#"
                        className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Apply
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Current Openings</h2>
              <p className="text-muted-foreground">
                We don&apos;t have any open positions at the moment, but please check back later or follow us on social media for updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

