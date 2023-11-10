import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostListQueryDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  // TODO: 에러 핸들링
  // 게시물 상세 조회
  @Get('detail/:id')
  async getPostDetail(
    @Param('id') postId: string
  ) {
    const result = await this.postService.getPostDetail(postId);
    return result;
  }

  // 게시물 목록 조회
  @Get('list')
  async getPostList(
    @Query() query: PostListQueryDto
  ) {
    
    // TODO: 유저 정보 넘겨받는 방법 (header?)에 따라 hastag default 값 정하기(계정 아이디)
		query.hashtagName = query.hashtagName ? query.hashtagName : ""

		// 페이지 설정
		const pageLimit = query.pageCount;
		query.pageOffset = query.page > 1 ? pageLimit * (query.page - 1) : 0;

    const result = await this.postService.getPostList(query);
    return result;
  }

  // 좋아요
  @Put('like/:id')
  async likePost(
    @Param('id') postId: string
  ) {
    const result = await this.postService.likePost(postId);
    return result;
  }

  // 공유
  @Put('share/:id')
  async sharePost(
    @Param('id') postId: string
  ) {
    const result = await this.postService.sharePost(postId);
    return result;
  }  

}
