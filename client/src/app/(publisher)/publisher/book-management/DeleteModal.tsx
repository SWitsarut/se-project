"use client";

import { BASE_URL } from "@/utils";
import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteModalProps {
  publisherName: string
  isbn: string
  title: string
}

export default function DeleteModal({ publisherName, isbn, title } : DeleteModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/publisher/${publisherName}/book-management/${isbn}`, {
        method: "DELETE",
      })

      const data = await res.json();
      if(data.error) {
        notifications.show({
          message: data.error,
          color: "red",
          autoClose: 3000
        })
        setIsLoading(false);
      } else {
        notifications.show({
          message: data.message,
          color: "green",
          autoClose: 3000
        })
        setIsLoading(false);
        close();
        router.refresh();
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

  return (
    <>
      <Modal classNames={{ title: "font-bold text-xl" }} centered opened={opened} onClose={close} title={`Delete ${title}`}>
        <div className="flex flex-col gap-4 my-4">
          <Text>Are you sure to delete this book</Text>
          <div className="flex justify-end gap-4">
            <Button variant="outline" color="red" onClick={close}>Cancle</Button>
            <Button color="red" loading={isLoading} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Button color="red" onClick={open} leftSection={<IconTrash />}>Delete</Button>
    </>
  )
}
