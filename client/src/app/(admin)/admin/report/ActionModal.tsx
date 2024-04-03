"use client";

import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ReportStatus } from "@prisma/client";
import { IconFlag } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionModalProps {
  reportId: number
  reportStatus: ReportStatus
  bookIsbn: string
}

export default function ActionModal({ reportStatus, bookIsbn, reportId }: ActionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(reportStatus);
  const [opened, { open, close }] = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  const handleSave = async () => {
    if(selectedStatus !== "REVIEWED" && selectedStatus !== "DISMISSED") {
      return;
    }
    try {
      setIsSaving(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/report/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus })
      })

      const data = await res.json();
      setIsSaving(false);

      if(data.error) {
        notifications.show({
          title: "Error",
          color: "red",
          message: data.error,
          autoClose: 3000
        })
      } else {
        notifications.show({
          title: "Success",
          color: "green",
          message: data.message,
          autoClose: 3000
        });
        router.refresh();
        close();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "Something went wrong",
        autoClose: 3000
      })
      setIsSaving(false);
    }
  }

  const blockSelling = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/report/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbn: bookIsbn })
      })

      const data = await res.json();
      setIsLoading(false);

      if(data.error) {
        notifications.show({
          title: "Error",
          color: "red",
          message: data.error,
          autoClose: 3000,
        })
      } else {
        notifications.show({
          title: "Success",
          color: "green",
          message: data.message,
          autoClose: 3000,
        });
        router.refresh();
        close();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        color: "red",
        message: "Something went wrong",
        autoClose: 3000
      });
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal centered opened={opened} onClose={close}classNames={{ title: "font-semibold"}} title="Action">
        <div className="flex flex-col gap-4">
          <Select
            disabled={reportStatus === "REVIEWED" || reportStatus === "DISMISSED"}
            label="Status"
            data={["PENDING", "REVIEWED", "DISMISSED"]}
            allowDeselect={false}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e as ReportStatus)}
          />
          <div className="flex justify-end gap-4">
            <Button loading={isSaving} disabled={reportStatus === "REVIEWED" || reportStatus === "DISMISSED"} onClick={handleSave}>Save Status</Button>
            <Button loading={isLoading} color="orange" disabled={reportStatus === "REVIEWED" || reportStatus === "DISMISSED"} onClick={blockSelling}>Block selling</Button>
          </div>
        </div>
      </Modal>

      <Button onClick={open}><IconFlag /></Button>
    </>
  )
}
