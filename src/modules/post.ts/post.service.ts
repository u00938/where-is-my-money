import { Hashtag } from '@/model/entities/Hashtag';
import { Post } from '@/model/entities/Post';
import { PostHashtagHistory } from '@/model/entities/PostHashtagHistory';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostListQueryDto } from './post.dto';
import { sendLike, sendShare } from '@/proxy/socialMedia';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}
  // TODO: 에러핸들링
  async getPostDetail(postId): Promise<object> {
    const post = await this.postRepository
    .createQueryBuilder('post')
    .select([
      'post.snsType AS snsType',
      'post.title AS title',
      'post.content AS content',
      'GROUP_CONCAT(hashtag.hashtagName) AS hashtags',
      'post.view_count AS viewCount',
      'post.like_count AS likeCount',
      'post.share_count AS shareCount',
      'post.created_dt AS createdDt',
      'post.updated_dt AS updatedDt'
    ])
    .innerJoin(PostHashtagHistory, 'PostHashtagHistory', 'PostHashtagHistory.postId = post.id')
    .innerJoin(Hashtag, 'hashtag', 'hashtag.id = PostHashtagHistory.hashtagId')
    .where('post.id = :id', { id: postId })
    .groupBy('post.id')
    .getRawOne();

    // TODO: 없는 게시물 에러 throw

    if (post) {
      // 조회수 증가
      const updateView = await this.postRepository
      .update(postId, {
        viewCount: post.viewCount + 1
      })

      if (updateView.affected) post.viewCount ++;
    }

    return post || {};
  }

  async getPostList(query: PostListQueryDto): Promise<Array<object>> {
    const {
      hashtagName,
      snsType,
      orderBy,
      sort,
      searchBy,
      search,
      pageCount,
      pageOffset
    } = query;

    const listQuery = await this.postRepository
    .createQueryBuilder('post')
    .select([
      'post.snsType AS snsType',
      'post.title AS title',
      'post.content AS content',
      'GROUP_CONCAT(hashtag.hashtagName) AS hashtags',
      'post.view_count AS viewCount',
      'post.like_count AS likeCount',
      'post.share_count AS shareCount',
      'post.created_dt AS createdDt',
      'post.updated_dt AS updatedDt'
    ])
    .innerJoin(PostHashtagHistory, 'PostHashtagHistory', 'PostHashtagHistory.postId = post.id')
    .innerJoin(Hashtag, 'hashtag', 'hashtag.id = PostHashtagHistory.hashtagId')
    .where((qb) => {
      const subQuery = qb
        .subQuery()
        .select('DISTINCT subPost.id')
        .from(Post, 'subPost')
        .innerJoin(PostHashtagHistory, 'subPhh', 'subPhh.postId = subPost.id')
        .innerJoin(Hashtag, 'subHashtag', 'subHashtag.id = subPhh.hashtagId')
        .where('subHashtag.hashtagName = :hashtagName', { hashtagName })
        .getQuery()
      return 'post.id IN ' + subQuery
    })
    .andWhere(`CONCAT(${searchBy}) LIKE "%${search}%"`)
    .groupBy('post.id')
    .orderBy(orderBy, sort)
    .limit(pageCount)
    .offset(pageOffset)

    if (snsType != '') {
      listQuery.andWhere('post.sns_type = :snsType', { snsType })
    }

    const list = await listQuery.getRawMany();

    return list;
  }

  async likePost(postId): Promise<object> {
    const post = await this.postRepository
    .findOneBy({ id: postId });

    if (post) {
      // await sendLike(post.snsType, postId);
      // TODO: 응답에 따라 분기 및 액션
      const updateLike = await this.postRepository
      .update(postId, {
        likeCount: post.likeCount + 1
      })

      if (updateLike.affected) post.likeCount ++;
    }

    return { likeCount: post ? post.likeCount ++ : 0 };
  }

  async sharePost(postId): Promise<object> {
    const post = await this.postRepository
    .findOneBy({ id: postId });

    if (post) {
      // await sendShare(post.snsType, postId);
      // TODO: 응답에 따라 분기 및 액션
      const updateShare = await this.postRepository
      .update(postId, {
        shareCount: post.shareCount + 1
      })

      if (updateShare.affected) post.shareCount ++;
    }

    return { shareCount: post ? post.shareCount : 0 };
  }
}
