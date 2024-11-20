import PageWrapper from '@/components/app/PageWrapper';
import LinkButton from '@/components/ui/LinkButton';
import { Route } from './+types/posts.$id';
import postsService from '@/services/postsService';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/QueryKey';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = params.id;
  const post = await postsService.getPost(id);

  return { post };
};

export const clientLoader = async ({
  serverLoader,
  params,
}: Route.ClientLoaderArgs) => {
  const { post } = await queryClient.ensureQueryData({
    queryKey: [QueryKey.GET_POST, params.id],
    queryFn: serverLoader,
  });

  return { post };
};

clientLoader.hydrate = true;

const PostDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  return (
    <PageWrapper>
      <LinkButton to="/" className="m-4">
        Back to Posts
      </LinkButton>
      <h1>{loaderData.post.title}</h1>
      <p>{loaderData.post.body}</p>
    </PageWrapper>
  );
};

export default PostDetailsPage;
