import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="my-16 px-0 md:px-24">
        {children}
      </div>
    </>
  )
}