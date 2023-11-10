import axios from 'axios';
import config from '@/config'

const proxy = config.proxy;

export const sendLike = async (snsType, postId) => {
  // TODO: 세부 리팩토링 필요
  return await axios.post(proxy[snsType.baseUrl] + `/likes/${postId}`);
};

export const sendShare = async (snsType, postId) => {
  // TODO: 세부 리팩토링 필요
  return await axios.post(proxy[snsType.baseUrl] + `/share/${postId}`);
};