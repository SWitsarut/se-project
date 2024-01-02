import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="py-16">
        {children}
      </main>
    </>
  )
}
