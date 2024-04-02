"use client"

import { useEdgeStore } from "@/libs/edgestore";
import { isValidString } from "@/utils";
import { Avatar, Button, FileButton, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileProps {
  session: Session
}

export default function Profile({ session }: ProfileProps) {
  const [displayName, setDisplayName] = useState<string>(session.user.displayName);
  const [previewImg, setPreviewImage] = useState<string | null>(session.user.avatar);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { update } = useSession();

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const handleImageUpload = (imgFile: File | null) => {
    if(imgFile) {
      const imgUrl = URL.createObjectURL(imgFile);
      setPreviewImage(imgUrl);
      setImageFile(imgFile);
    }
  }

  const handleSaveProfile = async () => {
    if(!isValidString(displayName) || !displayName) {
      return;
    }

    if(!imageFile && displayName === session.user.displayName) {
      return;
    }

    setIsLoading(true);

    let avatar;
    if(imageFile) {
      try {
        avatar = await edgestore.publicImages.upload({ file: imageFile}).then((res) => res.url);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to upload image",
          color: "red",
          autoClose: 3000,
        })
      }
    } else {
      avatar = session.user.avatar;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: session.user.id,
          displayName,
          avatar
        })
      })
      
      const data = await res.json();
  
      if(data.error) {
        notifications.show({
          title: "Error",
          message: data.error,
          color: "red",
          autoClose: 3000,
        })
      } else {
        notifications.show({
          title: "Success",
          message: data.message,
          color: "green",
          autoClose: 3000,
        })
        update({ displayName: data.displayName, avatar: data.avatar})
        router.refresh();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong while updating profile",
        color: "red",
        autoClose: 3000,
      })
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="border">
        <div className="border-b p-8">
          <Title>My profile</Title>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex w-full mx-auto py-8">
            <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
              <TextInput label="Username:" disabled value={session.user.username} />
              <TextInput label="Email:" disabled value={session.user.username} />
              <TextInput label="Display name:" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <Button loading={isLoading} onClick={handleSaveProfile} className="self-start">Save</Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center py-8 border-l-2">
            <Avatar classNames={{ root: "size-32" }} src={previewImg} size="xl" />
            <FileButton accept="image/*" onChange={(e) => handleImageUpload(e)}>
              {(props) => <Button {...props}>Select Image</Button>}
            </FileButton>
          </div>
        </div>
      </div>
    </>
  )
}
