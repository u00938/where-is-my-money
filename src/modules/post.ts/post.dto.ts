import { IsIn, IsOptional } from "class-validator";

export class PostListQueryDto {
  @IsOptional()
  hashtagName: string;

  @IsOptional()
  snsType: string = '';

  @IsOptional()
  orderBy: string = 'createdDt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sort: 'ASC' | 'DESC' = 'DESC';

  @IsIn(['title', 'content', 'title,content'])
  @IsOptional()
  searchBy: string = 'title,content';

  @IsOptional()
  search: string = '';

  @IsOptional()
  pageCount: number = 10;

  @IsOptional()
  page: number = 0;

  @IsOptional()
  pageOffset?: number

}