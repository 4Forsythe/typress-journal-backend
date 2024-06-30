export class SearchCategoryDto {
  sortBy?: 'title' | 'random'
  order?: 'ASC' | 'DESC'
  skip?: number
  take?: number
}
