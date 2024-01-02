"use client";

import { Button, Checkbox, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
      acceptTermsOfUse: false,
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8}, "Password must be at least 8 character"),
      confirmPassword: matchesField(
        "password",
        "Passwords are not the same",
      ),
      acceptTermsOfUse: isNotEmpty("please accept terms of use")
    },
  });
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();

  const registerSubmit = async (userData: typeof form.values) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      })
      
      if(res.ok) {
        router.push("/login");
      } else {
        setRegisterError(await res.json())
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
      className="w-full sm:max-w-[28rem] flex flex-col gap-4 mx-auto bg-light px-8 py-4 rounded-xl border shadow-lg"
    >
      <div className="text-center">
        <Title c="primary">Register</Title>
      </div>
      <div className="flex flex-col gap-4 my-2">
        <TextInput
          label="Email:"
          withAsterisk
          name="email"
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Display name:"
          withAsterisk
          name="displayName"
          {...form.getInputProps("displayName")}
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
        <Checkbox
          label="Accept terms of use"
          {...form.getInputProps("acceptTermsOfUse", { type: "checkbox" })}
        />
        <Text c={"red"}>{registerError}</Text>
        <Button loading={isLoading} type="submit" variant="filled">Register</Button>
      </div>
      <Text>{`Already have an account?`} <Link className="text-primary hover:underline font-bold" href="/login">Login</Link></Text>
    </form>
  );
}
