import Navbar from "@/components/Navbar";
import ChatBar from "./ChatBar";

export default function MainLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="py-16 px-0 md:px-24">
        {children}
      </div>
      <ChatBar/>
    </>
  )
}