import { Text, Title } from "@mantine/core";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-white w-full max-w-sm mx-auto flex flex-col gap-4 border shadow-lg rounded-md p-4 animate-fade-up">
      <div className="text-center">
        <Title c="primary">Login</Title>
      </div>
      <LoginForm />
      <Text>
        {`Don't have an account? `}
        <Link
          className="text-primary hover:underline font-bold"
          href="/register"
        >
          register
        </Link>
      </Text>
    </div>
  )
}
