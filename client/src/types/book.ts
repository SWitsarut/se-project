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