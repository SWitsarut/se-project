import { Text, Title } from "@mantine/core";
import RegisterForm from "./RegisterForm";
import PublisherRegisterForm from "./PublisherRegisterForm";
import Link from "next/link";

export default function RegisterPage({
  searchParams
} : {
  searchParams?: {
    role?: string
  }
}) {
  return (
    <div className="bg-white w-full max-w-sm mx-auto flex flex-col gap-4 border shadow-lg rounded-md p-4 animate-fade-up">
      <div className="text-center">
        <Title c="primary">Register</Title>
      </div>
      {searchParams?.role ? (
        <PublisherRegisterForm />
      ) : (
        <RegisterForm />
      )}
      {searchParams?.role ? (
        <Text><Link className="text-primary font-bold hover:underline" href={`/register`}>Register as a user</Link></Text>
      ) : (
        <Text>If you want to <Link className="text-primary font-bold" href={{ query: { role: "publisher" }}}>register as a publisher</Link></Text>
      )}
      <Text>
        {`Already have an account? `}
        <Link
          className="text-primary hover:underline font-bold"
          href="/login"
        >
          Login
        </Link>
      </Text>
    </div>
  )
}
