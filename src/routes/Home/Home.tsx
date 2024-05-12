import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import useDeletePostMutation from '@/services/mutations/useDeletePostMutation';
import useGetPostsQuery from '@/services/queries/useGetPostsQuery';

const ReactQueryPage = () => {
  const { data, isLoading, isError } = useGetPostsQuery();
  const { mutate: deletePost, isPending: deletePostLoading } =
    useDeletePostMutation();

  return (
    <PageWrapper isLoading={isLoading} isError={isError}>
      <ul className="grid grid-cols-2">
        {data?.map(post => (
          <li key={post.id} className="flex mt-4 items-center">
            {post.title.substring(0, 5)}
            <Button
              onClick={() => deletePost(post.id.toString())}
              disabled={deletePostLoading}
              className="ml-4"
            >
              Delete
            </Button>
            <LinkButton to={`posts/${post.id}`} className="ml-4">
              View
            </LinkButton>
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
};

export default ReactQueryPage;
