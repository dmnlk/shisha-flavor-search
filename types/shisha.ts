export interface ShishaFlavor {
  id: number
  manufacturer: string
  productName: string
  amount: string
  country: string
  price: string
  imageUrl: string
  description?: string
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