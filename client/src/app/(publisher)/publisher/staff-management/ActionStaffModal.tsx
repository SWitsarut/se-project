"use client";

import { User } from "@/types/user";
import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionStaffModalProps {
  publisherName: string
  staffId: string
  staffUsername: string
}

export default function ActionStaffModal({ publisherName, staffId, staffUsername }: ActionStaffModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/staff-management/${staffId}`, {
        method: "PATCH",
      });
      const data = await res.json();

      if(data.error) {
        notifications.show({
          message: data.error,
          color: "red",
          autoClose: 3000,
        })
      } else {
        notifications.show({
          message: data.message,
          color: "green",
          autoClose: 3000,
        })
        router.refresh();
        close();
      }
    } catch (error) {
      console.log(error)
      notifications.show({
        message: "Something went wrong",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      <Modal centered classNames={{ title: "font-bold text-xl" }} opened={opened} onClose={close} title={`Remove from publisher`}>
        <div className="flex flex-col gap-4 my-4">
          <Text c="dark">Are you sure to <Text c="red" span fw="bold">remove</Text> staff {staffUsername}?</Text>
          <div className="flex justify-end gap-4">
            <Button onClick={close} variant="outline" color="red">Cancel</Button>
            <Button loading={isLoading} onClick={() => handleRemove()} color="red">Yes</Button>
          </div>
        </div>
      </Modal>

      <Button leftSection={<IconTrash size={20}/>} onClick={open} color="red" size="sm">Remove</Button>
    </>
  )
}
