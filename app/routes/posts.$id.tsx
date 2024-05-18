import { json, useLoaderData } from '@remix-run/react';
import PageWrapper from '@/components/app/PageWrapper';
import { LoaderFunctionArgs } from '@remix-run/node';
import postsService from '@/services/postsService';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await postsService.getPost(params?.id ?? '');

  return json({ post });
};

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
