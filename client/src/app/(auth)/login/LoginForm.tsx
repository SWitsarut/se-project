"use client";

import { authOptions } from "@/libs/authOptions";
import { Button, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isNotEmpty(),
      password: isNotEmpty(),
    },
  });
  const router = useRouter();

  const loginSubmit = async (userData: typeof form.values) => {
    try {
      const res = await signIn("credentials", {
        ...userData,
        redirect: false,
      })
      
      if(res?.ok) {
        router.push(`/me`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={form.onSubmit((value) => loginSubmit(value))}
      className="bg-light w-full sm:max-w-[28rem] flex flex-col gap-4 mx-auto px-8 py-4 rounded-xl border shadow-lg"
    >
      <div className="text-center">
        <Title c="primary">Login</Title>
      </div>
      <div className="flex flex-col gap-4 my-2">
        <TextInput
          label="Email:"
          name="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password:"
          name="password"
          {...form.getInputProps("password")}
        />
        <Button type="submit" variant="filled">Login</Button>
      </div>
      <Text>{`Don't have an account?`} <Link className="text-primary hover:underline font-bold" href="/register">register</Link></Text>
    </form>
  );
}
