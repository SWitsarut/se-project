export interface AddbookFormType {
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

export type BookResponse = {
  isbn: string
  title: string
  price: number
  cover: string
  pdfUrl: string
  isSelling: boolean
  category: string
  genres: string[]
  authors: string[]
  createdAt: string
}