import { CartProvider } from "@/components/CartProvider";
import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <CartProvider>
        <Navbar />
        <div className="py-16 px-0 md:px-24">
          {children}
        </div>
        <Chat />
      </CartProvider>
    </>
  )
}