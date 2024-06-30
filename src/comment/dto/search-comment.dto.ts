export class SearchCommentDto {
  query?: string
  post?: number
  user?: number
  order?: 'ASC' | 'DESC'
  skip?: number
  take?: number
}
