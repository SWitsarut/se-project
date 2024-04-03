"use client";

import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: isNotEmpty(),
      password: isNotEmpty(),
    },
  });
  
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();

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
      router.refresh();
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
        label="Username:"
        name="username"
        onChange={(e) => form.setFieldValue("username", e.currentTarget.value)}
        error={form.errors.username}
      />
      <PasswordInput
        label="Password:"
        name="password"
        onChange={(e) => form.setFieldValue("password", e.currentTarget.value)}
        error={form.errors.password}
      />
      <Text c="red">{loginError}</Text>
      <Button loading={isLoading} type="submit" variant="filled">Login</Button>
    </form>
  );
}
