"use client";

import { Button, Overlay, Rating, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReviewInputProps {
  isbn: string
  userId?: string
  isOwned: boolean
  existingReview: boolean
}

export default function ReviewInput({ isOwned, userId, isbn, existingReview }: ReviewInputProps) {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if(!content || !rating || rating < 0.5) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comment/${isbn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          content,
          rating,
        })
      });

      const data = await res.json();

      if(data.error) {
        console.error(data.error);
      } else {
        setRating(0);
        setContent("");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-6 p-8 relative">
      <div className="prose">
        <h2>Reviews</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Text>Rating</Text>
          <Rating fractions={2} value={rating} onChange={(e) => setRating(e)} size="lg" className="mx-auto" />
        </div>
        <div className="flex flex-col gap-2">
          <Text>Comment</Text>
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="w-full h-24 p-2 border rounded-md"
            placeholder="Write your review here..."
          />
        </div>
        <div className="flex justify-end">
          <Button loading={isLoading} disabled={isLoading} onClick={handleSubmit} variant="filled" size="lg" radius="xl">
            Submit
          </Button>
        </div>
        {!userId && (
          <Overlay color="#000" radius="lg" blur={2}>
            <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-center">
              <Text c="white">Only users can submit reviews</Text>
              <Link href={`/login`}>
                <Button>Login</Button>
              </Link>
            </div>
          </Overlay>
        )}
        {!isOwned && userId && (
          <Overlay color="#000" radius="lg" blur={2}>
            <div className="w-full h-full flex justify-center items-center text-center">
              <Text c="white">Only users who own the book can submit reviews</Text>
            </div>
          </Overlay>
        )}
        {existingReview && (
          <Overlay color="#000" radius="lg" blur={2}>
            <div className="w-full h-full flex justify-center items-center text-center">
              <Text c="white">You have already submitted a review</Text>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  );
}
