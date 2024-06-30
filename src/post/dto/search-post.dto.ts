export class SearchPostDto {
  query?: string
  author?: number
  category?: number
  sortBy?: 'createdAt' | 'views' | 'totalComments'
  order?: 'ASC' | 'DESC'
  skip?: number
  take?: number
}
