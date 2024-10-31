import { useLoaderData } from 'react-router';
import PageWrapper from '@/components/app/PageWrapper';
import LinkButton from '@/components/ui/LinkButton';
import postsService from '@/services/postsService';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/QueryKey';
import type * as Route from './+types.posts.$id';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const post = await postsService.getPost(params.id as string);

  return post;
};

export const clientLoader = async ({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const post = await queryClient.ensureQueryData({
    queryKey: [QueryKey.GET_POST, params.id],
    queryFn: () => serverLoader(),
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
