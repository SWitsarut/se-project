"use client";

import Image from "next/image";
import { useEdgeStore } from "@/libs/edgestore";
import { AddBookFormType, BookDetailType } from "@/types/book";
import { Autocomplete, Button, FileButton, FileInput, NumberInput, TagsInput, Text, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { isNotStartWithSpecialChar } from "@/utils";

interface AddBookFormProps {
  publisherName: string
  bookDetail: BookDetailType
}

const initialForm: AddBookFormType = {
  isbn: "",
  title: "",
  cover: "",
  price: 0,
  categoryName: "",
  authorNames: [],
  genreNames: [],
  pdfUrl: "",
  description: "",
}

export default function AddBookForm({ publisherName, bookDetail }: AddBookFormProps) {
  const [form, setForm] = useState<AddBookFormType>(initialForm);
  const [previewImg, setPreviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const handleAddbook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!form.isbn || !form.title || !form.price || !imageFile || !pdfFile) {
      notifications.show({
        title: "Error",
        message: "Please fill in complete information.",
        color: "red",
        autoClose: 3000,
      })
      return;
    }

    if(!isNotStartWithSpecialChar(form.isbn) || !isNotStartWithSpecialChar(form.title)) {
      notifications.show({
        title: "Error",
        message: "ISBN and Title cannot start with special characters",
        color: "red",
        autoClose: 3000,
      })
      return;
    }

    if(form.authorNames.length < 1) {
      notifications.show({
        title: "Error",
        message: "Author is required at least 1 author",
        color: "red",
        autoClose: 3000,
      })
      return;
    }

    setIsLoading(true);
    
    let cover, pdfUrl;

    try {
      [cover, pdfUrl] = await Promise.all([
        edgestore.publicImages.upload({ file: imageFile }).then((res) => res.url), 
        edgestore.publicFiles.upload({ file: pdfFile }).then((res) => res.url)
      ])
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong while uploading file",
        color: "red",
        autoClose: 3000,
      })
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/book-management`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...form, cover, pdfUrl })
      });

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
        router.push("/publisher/book-management");
        router.refresh();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong while adding book",
        color: "red",
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (imgFile: File | null) => {
    if(imgFile) {
      const imgUrl = URL.createObjectURL(imgFile);
      setPreviewImage(imgUrl);
      setImageFile(imgFile);
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
          description="use ( , ), ( | ), ( / ), ( Enter ) to submit value"
          id="author"
          value={form.authorNames}
          onChange={(e) => setForm((prevState) => ({ ...prevState, authorNames: e }))}
          data={bookDetail ? bookDetail.authors.map((author) => author) : []}
          splitChars={[',', '|', '/']}
        />
        <Autocomplete
          placeholder="Category"
          label="Category"
          value={form.categoryName}
          onChange={(e) => setForm((prevState) => ({ ...prevState, categoryName: e }))}
          data={bookDetail ? bookDetail.categories.map((category) => category) : []}
        />
        <NumberInput
          label="Price"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => setForm((prevState) => ({ ...prevState, price: Number(e) }))}
        />
        <TagsInput
          placeholder="Genres"
          label="Genres"
          description="use ( , ), ( | ), ( / ), ( Enter ) to submit value"
          id="genre"
          value={form.genreNames}
          onChange={(e) => setForm((prevState) => ({ ...prevState, genreNames: e }))}
          data={bookDetail ? bookDetail.genres.map((genre) => genre) : []}
          splitChars={[',', '|', '/']}
        />
        <Textarea
          label="Description"
          classNames={{ root: "w-full" }}
          rows={5}
          value={form.description}
          onChange={(e) => setForm((prevState) => ({ ...prevState, description: e.target.value }))}
        />
        <div className="flex flex-col gap-4 items-center lg:items-start">
          <FileButton accept="image/*" onChange={(e) => handleImageUpload(e) }>
            {(props) => <Button {...props}>Upload Cover</Button>}
          </FileButton>
          <FileInput clearable variant="default" accept="application/pdf" onChange={setPdfFile} value={pdfFile} label="Upload PDF" placeholder="Upload file"/>
        </div>
      </div>
      <div className="flex items-start py-16 justify-center">
        <div className="w-[350px] shadow-2xl flex items-center">
          {previewImg ? (
            <Image
            src={previewImg}
            alt="bookCover"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto aspect-[1/1.414]"
            priority
          />
          ) : (
            <div className="bg-slate-100 w-full h-auto aspect-[1/1.414]">
              <Text size="xl" classNames={{ root: "flex justify-center items-center h-full" }}>No Image</Text>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-center lg:justify-end col-span-1 lg:col-span-2">
        <Button leftSection={<IconPlus />} loading={isLoading} type="submit">Add book</Button>
      </div>
    </form>
  )
}