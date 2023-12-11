export default function AuthLayout({ children }: { children: React.ReactNode}) {
  return (
    <main className="bg-dark h-screen flex items-center">
      {children}
    </main>
  )
}
