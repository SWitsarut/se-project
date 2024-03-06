export interface BookDetailType {
  genres: string[]
  categories: string[]
  authors: string[]
}

export interface AddBookFormType {
  isbn: string
  title: string
  cover: string
  price: number | string
  categoryName: string
  authorNames: string[]
  genreNames: string[]
  pdfUrl: string
  description: string
}

export interface EditBookData {
  isbn: string
  title: string
  cover: string
  price: number | string
  categoryName: string
  authorNames: string[]
  genreNames: string[]
  pdfUrl: string
  description: string | null
  isSelling: boolean
}

export interface BookCart {
  isbn: string
  title: string
  cover: string
  price: number
}

export type BookResponse = {
  isbn: string
  title: string
  price: number
  cover: string
  pdfUrl: string
  isSelling: boolean
  description: string | null
  publisher: string
  category: string
  genres: string[]
  authors: string[]
  createdAt: string
}