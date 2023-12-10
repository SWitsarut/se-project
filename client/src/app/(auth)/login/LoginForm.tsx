"use client";

import { Button, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import Link from "next/link";

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

  const loginSubmit = (userData: typeof form.values) => {
    console.log(userData)
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
