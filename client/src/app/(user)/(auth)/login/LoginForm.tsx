"use client";

import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loginSubmit = async (userData: typeof form.values) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      ...userData,
      redirect: false,
    })

    if(res?.error) {
      setLoginError(res.error)
    } else {
      setLoginError("");
      router.push("/");
    }

    setIsLoading(false);
  }

  return (
    <form
      onSubmit={form.onSubmit((value) => loginSubmit(value))}
      className="flex flex-col gap-4"
    >
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
      <Text c="red">{loginError}</Text>
      <Button loading={isLoading} type="submit" variant="filled">Login</Button>
    </form>
  );
}
