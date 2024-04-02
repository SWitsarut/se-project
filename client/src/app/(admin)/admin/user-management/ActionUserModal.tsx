"use client";

import { User } from "@/types/user";
import { Button, Modal, Select, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionUserModalProps {
  user: User
  publisherName: string[]
}

export default function ActionUserModal({ user, publisherName }: ActionUserModalProps) {
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  
  const [selectedRole, setSelectedRole] = useState<string | null>(user.role);
  const [selectedActive, setSelectedActive] = useState<string | null>(user.isActive ? "Active" : "Inactive");
  const [publisher, setPublisher] = useState<string | null>(String(user.publisherName));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/user-management/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole, status: selectedActive, publisherName: publisher})
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
        closeEdit();
      }
    } catch (error) {
      notifications.show({
        message: "Something went wrong",
        color: "red",
        autoClose: 3000,
      })
    } finally{
      setIsLoading(false);
    }
  }

  const handlerDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/user-management/${user.id}`, {
        method: "DELETE",
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
        closeDelete();
      }
    } catch (error) {
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
      <Modal centered classNames={{ title: "font-bold text-xl"}} opened={openedEdit} onClose={closeEdit} title="Edit User">
        <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-4 my-4">
          <TextInput disabled label="Username:" value={user.username} />
          <Select
            allowDeselect={false}
            label="Role:"
            data={["USER", "ADMIN", "PUBLISHER"]}
            value={selectedRole}
            onChange={setSelectedRole}
          />
          <Select
            allowDeselect={false}
            label="User status:"
            data={["Active", "Inactive"]}
            value={selectedActive}
            onChange={setSelectedActive}
          />
          {selectedRole == "PUBLISHER" && (
            <Select
              label="Publisher name"
              data={publisherName}
              limit={5}
              defaultValue={user.publisherName}
              value={publisher}
              onChange={setPublisher}
              searchable
            />
          )}

          <Button loading={isLoading} type="submit">Save</Button>
        </form>
      </Modal>

      <Modal centered classNames={{ title: "font-bold text-xl" }} opened={openedDelete} onClose={closeDelete} title={`Delete User`}>
        <div className="flex flex-col gap-4 my-4">
          <Text c="dark">Are you sure to <Text c="red" span fw="bold">delete</Text> user {user.username}?</Text>
          <div className="flex justify-end gap-4">
            <Button onClick={closeDelete} variant="outline" color="red">Cancel</Button>
            <Button loading={isLoading} onClick={() => handlerDelete()} color="red">Yes</Button>
          </div>
        </div>
      </Modal>

      <Button disabled={user.id == session?.user.id} leftSection={<IconPencil size={20}/>} onClick={openEdit} color="blue" size="sm">Edit</Button>
      <Button disabled={user.id == session?.user.id} leftSection={<IconTrash size={20}/>} onClick={openDelete} color="red" size="sm">Delete</Button>
    </>
  )
}
