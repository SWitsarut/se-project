import { Text, Title } from "@mantine/core";
import RegisterForm from "./RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-white w-full max-w-sm mx-auto flex flex-col gap-4 border shadow-lg rounded-md p-4 animate-fade-up">
      <div className="text-center">
        <Title c="primary">Register</Title>
      </div>
      <RegisterForm />
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
