import type Post from '@/types/Post';
import ky from 'ky';

const baseUrl = 'https://jsonplaceholder.typicode.com';

const client = ky.create({
  prefixUrl: baseUrl,
});

const postsService = {
  getPosts: () => client.get('posts').json<Post[]>(),
  getPost: (id: string) => client.get(`posts/${id}`).json<Post>(),
  deletePost: (id: string) => client.delete(`posts/${id}`),
} as const;

export default postsService;
