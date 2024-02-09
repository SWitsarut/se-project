"use client"

import { Button } from "@mantine/core";
import AddBookForm from "./AddBookForm";

export default function AddBookPage() {
  const addbook = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/manage-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isbn: "21314", title: "TEST", cover: "TEST" })
    })

    const data = await res.json();
    console.log(data)
  }
  return (
    <>
      <div className="prose">
        <h1>Add book</h1>
      </div>
      <AddBookForm />
    </>
  )
}
