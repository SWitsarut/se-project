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

export interface BookWislist {
  isbn: string
  title: string
  cover: string
  price: number
}

export interface BookItemType {
  isbn: string
  title: string
  cover: string
  price: number
  authors: string[]
  category: string
  publisher: string
}

export interface BookShelfType {
  isbn: string
  title: string
  cover: string
  category: string
  pdfUrl: string
  publisher: string
  authors: string[]
}

export interface BookResponse {
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