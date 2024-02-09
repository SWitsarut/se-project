"use client";

import { Button, Checkbox, PasswordInput, Text, TextInput } from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
      acceptTermsOfUse: false,
    },
    validate: {
      email: isEmail("Invalid email"),
      username: isNotEmpty("Username is required."),
      displayName: isNotEmpty("Display name is required."),
      password: hasLength({ min: 8 }, "Password must be at least 8 character"),
      confirmPassword: matchesField(
        "password",
        "Passwords are not the same",
      ),
      acceptTermsOfUse: isNotEmpty("Please accept terms of use"),
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");
  const router = useRouter();

  const registerSubmit = async (userData: typeof form.values) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      })
      const data = await res.json();

      if(res.ok) {
        router.push("/login");
      } else {
        setRegisterError(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.onSubmit((value) => registerSubmit(value))}
      className="flex flex-col gap-4"
    >
      <TextInput
        label="Email:"
        withAsterisk
        name="email"
        {...form.getInputProps("email")}
      />
      <TextInput
        label="Username:"
        withAsterisk
        name="username"
        {...form.getInputProps("username")}
      />
      <PasswordInput
        label="Password:"
        withAsterisk
        name="password"
        {...form.getInputProps("password")}
      />
      <PasswordInput
        label="Confirm password:"
        withAsterisk
        name="confirmPassword"
        {...form.getInputProps("confirmPassword")}
      />
      <TextInput
        label="Display name:"
        withAsterisk
        name="displayName"
        {...form.getInputProps("displayName")}
      />
      <Checkbox
        label="Accept terms of use"
        {...form.getInputProps("acceptTermsOfUse", { type: "checkbox" })}
      />
      <Text c={"red"}>{registerError}</Text>
      <Button loading={isLoading} type="submit" variant="filled">Register</Button>
    </form>
  );
}
