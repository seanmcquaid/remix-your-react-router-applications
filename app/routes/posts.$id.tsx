import {
  ClientLoaderFunctionArgs,
  json,
  useLoaderData,
} from '@remix-run/react';
import PageWrapper from '@/components/app/PageWrapper';
import { LoaderFunctionArgs } from '@remix-run/node';
import postsService from '@/services/postsService';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/queries/QueryKey';
import Post from '@/types/Post';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await postsService.getPost(params?.id ?? '');

  return json({ post });
};

export const clientLoader = async ({
  serverLoader,
  params,
}: ClientLoaderFunctionArgs) => {
  const cachedPost = queryClient.getQueryData<Post>([
    QueryKey.GET_POST,
    params?.id,
  ]);

  if (cachedPost) {
    return json({ post: cachedPost });
  }

  const post = await queryClient.fetchQuery({
    queryKey: [QueryKey.GET_POSTS, params?.id],
    queryFn: () => serverLoader<Post>(),
  });

  return json({
    post,
  });
};

clientLoader.hydrate = true;

const PostDetailsPage = () => {
  const { post } = useLoaderData<typeof loader>();

  return (
    <PageWrapper>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </PageWrapper>
  );
};

export default PostDetailsPage;
