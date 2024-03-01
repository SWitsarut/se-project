"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddStaffModalProps {

}

interface AddStaffForm {
  username: string
  email: string
}

const initialForm: AddStaffForm = {
  username: "",
  email: "",
}

export default function AddStaffModal() {
  const [form, setForm] = useState<AddStaffForm>(initialForm);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevState) => ({ ...prevState, [id]: value }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!form.username || !form.email) {
      notifications.show({
        message: "Please enter username and email of user",
        color: "red",
        autoClose: 3000
      })
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/manage-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form })
      })
      const data = await res.json();
      
      if(data.error) {
        notifications.show({
          message: data.error,
          color: "red",
          autoClose: 3000
        });
      } else {
        notifications.show({
          message: data.message,
          color: "green",
          autoClose: 3000
        });
        router.refresh();
        setForm(initialForm);
        close();
      }
    } catch (error) {
      notifications.show({
        message: "Something went wrong",
        color: "red",
        autoClose: 3000
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseModal = () => {
    setForm(initialForm);
    close();
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add staff" classNames={{ title: "font-bold text-xl"}} centered>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput value={form.username} onChange={handleChange} id="username" label="Username:" withAsterisk />
          <TextInput value={form.email} onChange={handleChange} id="email" label="Email:" withAsterisk />
          <div className="flex justify-end gap-4">
            <Button color="red" onClick={handleCloseModal}>Cancel</Button>
            <Button loading={isLoading} color="primary" type="submit">Invite</Button>
          </div>
        </form>
      </Modal>

      <Button onClick={open}>Add staff</Button>
    </>
  )
}
