"use client";

import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReportButtonProps {
  isbn: string
  userId: string
  isOwned: boolean
  bookTitle: string
}

export default function ReportButton({ isbn, userId, isOwned, bookTitle }: ReportButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReport = async () => {
    if(!reason) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isbn, reason, userId })
      });

      const data = await res.json();
      setIsLoading(false);

      if(data.error) {
        notifications.show({
          title: "Error",
          message: data.error,
          color: "red"
        })
      } else {
        setReason("");
        router.refresh();
        close();
      }
    } catch (error) {
      console.log("Error at /api/book/report POST", error);
    }
  }

  return (
    <>
      <Modal
        zIndex={1000}
        centered
        opened={opened}
        classNames={{ title: "font-semibold" }}
        onClose={close}
        title={`Report ${bookTitle}`}
      >
        {isOwned ? (
          <>
            <Text size="sm" fw={500}>Why do you want to report this book?</Text>
            <textarea
              className="w-full h-32 p-2 mt-2 border border-gray-300 rounded-md"
              value={reason} onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button loading={isLoading} onClick={close} className="mt-4" color="gray">Cancel</Button>
              <Button onClick={handleReport} className="mt-4" color="red">Report</Button>
            </div>
          </>
        ):(
          <>
            <Text size="sm" fw={500}>You have to own this book to report it.</Text>
            <div className="flex justify-end">
              <Button onClick={close} className="mt-4" color="gray">Close</Button>
            </div>
          </>
        )}
      </Modal>
    
      <Text onClick={open} classNames={{ root: "flex items-center gap-1 cursor-pointer" }} size="sm" c={"primary"}>Report <IconAlertCircle size="16px" /></Text>
    </>
  )
}
