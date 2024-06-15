import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react';
import PageWrapper from '@/components/app/PageWrapper';
import LinkButton from '@/components/ui/LinkButton';
import { LoaderFunctionArgs } from '@remix-run/node';
import postsService from '@/services/postsService';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/QueryKey';
import Post from '@/types/Post';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await postsService.getPost(params.id as string);

  return post;
};

export const clientLoader = async ({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const cachedPost = queryClient.getQueryData<Post>([
    QueryKey.GET_POST,
    params.id,
  ]);

  if (cachedPost) {
    return cachedPost;
  }

  const post = await queryClient.fetchQuery({
    queryKey: [QueryKey.GET_POST, params.id],
    queryFn: () => serverLoader<Post>(),
  });

  return post;
};

clientLoader.hydrate = true;

const PostDetailsPage = () => {
  const post = useLoaderData<typeof clientLoader>();

  return (
    <PageWrapper>
      <LinkButton to="/" className="m-4">
        Back to Posts
      </LinkButton>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </PageWrapper>
  );
};

export default PostDetailsPage;
