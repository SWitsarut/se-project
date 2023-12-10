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
    <form onSubmit={form.onSubmit((value) => loginSubmit(value))} className="w-full sm:max-w-[28rem] flex flex-col gap-4 mx-auto bg-primary px-8 py-4 rounded-md border shadow-lg">
      <div className="text-center">
        <Title c="white">Login</Title>
      </div>
      <div className="flex flex-col gap-4 my-2">
        <TextInput
          label="Email:"
          name="email"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password:"
          name="password"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("password")}
        />
        <Button type="submit" variant="white">Login</Button>
      </div>
      <Text c="white">{`Don't have an account?`} <Link className="hover:underline font-bold" href="/register">register</Link></Text>
    </form>
  );
}
