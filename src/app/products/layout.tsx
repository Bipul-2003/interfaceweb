import Sidebar from "@/components/Sidebar"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <main className="flex-grow p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
