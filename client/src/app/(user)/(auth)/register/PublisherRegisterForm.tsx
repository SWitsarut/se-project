"use client";

import { isValidString } from "@/utils";
import { Button, Checkbox, Modal, PasswordInput, Text, TextInput } from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublisherRegisterForm() {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      publisherName: "",
      displayName: "",
      password: "",
      confirmPassword: "",
      acceptTermsOfUse: false,
    },
    validate: {
      email: isNotEmpty("Email is required") && isEmail("Invalid email"),
      username: (value) => !isValidString(value) ? "Special character isn't allowed. Please use only underscores (_), hyphens (-), and periods (.)" : null && isNotEmpty("Username is required.") && hasLength({ max: 30 }, "The length of the username must not exceed 30 characters."),
      publisherName: (value) => !isValidString(value) ? "Special character isn't allowed. Please use only underscores (_), hyphens (-), and periods (.)" : null && isNotEmpty("Publisher name is required") && hasLength({ max: 30}, "The length of the publisher name must not exceed 30 characters."),
      displayName: (value) => !isValidString(value) ? "Special character isn't allowed. Please use only underscores (_), hyphens (-), and periods (.)" : null && isNotEmpty("Display name is required.")  && hasLength({ max: 30 }, "The length of the display name must not exceed 30 characters."),
      password: isNotEmpty("Password is required") && hasLength({ min: 8 }, "Password must be at least 8 character"),
      confirmPassword: matchesField(
        "password",
        "Passwords are not the same",
      ),
      acceptTermsOfUse: isNotEmpty("Please accept terms of use"),
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");
  const [successOpened, { open: successOpen, close: successClose }] = useDisclosure(false);
  const [errorOpened, { open: errorOpen, close: errorClose }] = useDisclosure(false);
  const router = useRouter();
  
  const registerSubmit = async (userData: typeof form.values) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/publisher-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      })
      const data = await res.json();

      if(data.error) {
        setRegisterError(data.error);
        errorOpen();
      } else {
        successOpen();
      }
    } catch (error) {
      setRegisterError("Something went wrong");
      errorOpen();
    } finally {
      setIsLoading(false);
    }
  }

  const navigateOnClose = () => {
    successClose();
    router.push("/login");
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit((value) => registerSubmit(value))}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Email:"
          withAsterisk
          name="email"
          onChange={(e) => form.setFieldValue("email", e.currentTarget.value)}
          error={form.errors.email}
        />
        <TextInput
          label="Username:"
          withAsterisk
          name="username"
          onChange={(e) => form.setFieldValue("username", e.currentTarget.value)}
          error={form.errors.username}
        />
        <PasswordInput
          label="Password:"
          withAsterisk
          name="password"
          onChange={(e) => form.setFieldValue("password", e.currentTarget.value)}
          error={form.errors.password}
        />
        <PasswordInput
          label="Confirm password:"
          withAsterisk
          name="confirmPassword"
          onChange={(e) => form.setFieldValue("confirmPassword", e.currentTarget.value)}
          error={form.errors.confirmPassword}
        />
        <TextInput
          label="Publisher name:"
          withAsterisk
          name="publisherName"
          onChange={(e) => form.setFieldValue("publisherName", e.currentTarget.value)}
          error={form.errors.publisherName}
        />
        <TextInput
          label="Display name:"
          withAsterisk
          name="displayName"
          onChange={(e) => form.setFieldValue("displayName", e.currentTarget.value)}
          error={form.errors.displayName}
        />
        <Checkbox
          label="Accept terms of use"
          onChange={(e) => form.setFieldValue("acceptTermsOfUse", e.currentTarget.checked)}
          error={form.errors.acceptTermsOfUse}
        />
        <Button loading={isLoading} type="submit" variant="filled">Register</Button>
      </form>

      {/* Successful Alert */}
      <Modal
        zIndex={1000}
        centered
        opened={successOpened}
        onClose={navigateOnClose}
        title="Register Successful"
        c={"green"}
        fw="bolder"
        classNames={{ title: "font-bold", body: "text-black"}}
      >
        <div className="flex flex-col gap-4 items-end">
          <Text w="100%">Congratulations! You have successfully registered</Text>
          <Text c="dimmed" size="sm" w="full">Check your email inbox for a confirmation link to complete the process.</Text>
          <Button onClick={navigateOnClose}>Go to login</Button>
        </div>
      </Modal>
      
      {/* Error Alert */}
      <Modal
        zIndex={1000}
        centered
        opened={errorOpened}
        onClose={errorClose}
        title="Register Error"
        c={"red"}
        fw="bolder"
        classNames={{ title: "font-bold", body: "text-black"}}
      >
        <div className="flex flex-col gap-4 items-end">
          <Text w="100%">{registerError}</Text>
          <Button color="red" onClick={errorClose}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
