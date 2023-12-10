"use client";

import { Button, Checkbox, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import Link from "next/link";

export default function RegisterForm() {
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

  const registerSubmit = (userData: typeof form.values) => {
    console.log(userData)
  }

  return (
    <form onSubmit={form.onSubmit((value) => registerSubmit(value))} className="w-full sm:max-w-[28rem] flex flex-col gap-4 mx-auto bg-primary px-8 py-4 rounded-md border shadow-lg">
      <div className="text-center">
        <Title c="white">Register</Title>
      </div>
      <div className="flex flex-col gap-4 my-2">
        <TextInput
          label="Email:"
          withAsterisk
          name="email"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Display name:"
          withAsterisk
          name="displayName"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("displayName")}
        />
        <PasswordInput
          label="Password:"
          withAsterisk
          name="password"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm password:"
          withAsterisk
          name="confirmPassword"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white"
          }}
          {...form.getInputProps("confirmPassword")}
        />
        <Checkbox
          label="Accept terms of use"
          variant="filled"
          classNames={{
            input: "bg-black text-white",
            label: "text-white",
          }}
          {...form.getInputProps("acceptTermsOfUse", { type: "checkbox" })}
        />
        <Button type="submit" variant="white">Register</Button>
      </div>
      <Text c="white">{`Already have an account?`} <Link className="hover:underline font-bold" href="/login">Login</Link></Text>
    </form>
  );
}
