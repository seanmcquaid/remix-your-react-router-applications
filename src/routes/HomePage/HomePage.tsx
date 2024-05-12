import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import useDeletePostMutation from '@/services/mutations/useDeletePostMutation';
import useGetPostsQuery from '@/services/queries/useGetPostsQuery';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  search: z.string(),
});

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetPostsQuery();
  const { mutate: deletePost, isPending: deletePostLoading } =
    useDeletePostMutation();
  const search = z.string().catch('').parse(searchParams.get('search'));
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });
  const filteredPosts =
    data?.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const handleOnSubmit = handleSubmit(({ search }) => {
    setSearchParams({ search });
  });

  return (
    <PageWrapper isLoading={isLoading} isError={isError}>
      <form onSubmit={handleOnSubmit}>
        <Input type="text" {...register('search')} />
        <Button type="submit">Search</Button>
      </form>
      <ul className="grid grid-cols-2">
        {filteredPosts?.map(post => (
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

export default HomePage;
