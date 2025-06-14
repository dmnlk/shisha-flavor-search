export interface ShishaFlavor {
  id: number
  manufacturer: string
  productName: string
  description: string
  price: string
  imageUrl?: string
}

export interface SearchResponse {
  items: ShishaFlavor[]
  totalPages: number
  currentPage: number
  totalItems: number
}

export interface SearchParams {
  query?: string
  manufacturer?: string
  page?: number
}