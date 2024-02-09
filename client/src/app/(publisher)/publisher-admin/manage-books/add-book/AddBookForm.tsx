"use client";

import { AddbookFormType } from "@/types/book";
import { Autocomplete, Button, NumberInput, TagsInput, TextInput, Textarea } from "@mantine/core";
import Image from "next/image";
import React, { useState } from "react";

const initialForm: AddbookFormType = {
  isbn: "",
  title: "",
  cover: "",
  price: "",
  categoryName: "",
  authorNames: [],
  genreNames: [],
  pdfUrl: "",
  description: "",
}

export default function AddBookForm() {
  const [form, setForm] = useState<AddbookFormType>(initialForm);

  const handleAddbook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!form.isbn || !form.title || !form.pdfUrl) {
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/manage-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...form })
    });

    const data = await res.json();
    if(res.ok) {
      console.log(data);
    } else {
      console.log("Error", data)
    }
  }

  return (
    <form
      className="m-8 grid grid-cols-1 xl:grid-cols-2 gap-8"
      onSubmit={handleAddbook}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          placeholder="ISBN"
          label="ISBN"
          id="isbn"
          value={form.isbn}
          onChange={(e) => setForm((prevState) => ({ ...prevState, isbn: e.target.value }))}
        />
        <TextInput
          placeholder="Title"
          label="Title"
          id="title"
          value={form.title}
          onChange={(e) => setForm((prevState) => ({ ...prevState, title: e.target.value }))}
        />
        <TagsInput
          placeholder="Authors"
          label="Authors"
          id="author"
          value={form.authorNames}
          onChange={(e) => setForm((prevState) => ({ ...prevState, authorNames: e }))}
          data={[]}
          splitChars={[',', '|', '/']}
        />
        <Autocomplete
          placeholder="Category"
          label="Category"
          value={form.categoryName}
          onChange={(e) => setForm((prevState) => ({ ...prevState, categoryName: e }))}
          data={[]}
        />
        <NumberInput
          label="Price"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => setForm((prevState) => ({ ...prevState, price: e }))}
        />
        <TagsInput
          placeholder="Genres"
          label="Genres"
          id="genre"
          value={form.genreNames}
          onChange={(e) => setForm((prevState) => ({ ...prevState, genreNames: e }))}
          data={[]}
          splitChars={[',', '|', '/']}
        />
        <Textarea
          label="Description"
          classNames={{ root: "w-full" }}
          rows={5}
          value={form.description}
          onChange={(e) => setForm((prevState) => ({ ...prevState, description: e.target.value }))}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-[350px] shadow-2xl flex items-center">
          {/* Todo placeholder image */}
          <Image
            src={""}
            alt="bookCover"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto aspect-[1/1.414]"
            priority
          />
        </div>
      </div>
      <div className="flex w-full justify-center lg:justify-end col-span-1 lg:col-span-2">
        <Button>Add book</Button>
      </div>
    </form>
  )
}
