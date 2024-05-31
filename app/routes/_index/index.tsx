import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import useDeletePostMutation from '@/services/mutations/useDeletePostMutation';
import useGetPostsQuery from '@/services/queries/useGetPostsQuery';
import { useSearchParams } from '@remix-run/react';
import { useState, ChangeEvent, FormEvent } from 'react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useGetPostsQuery();
  const { mutate: deletePost, isPending: deletePostLoading } =
    useDeletePostMutation();
  const search = searchParams.get('search') ?? '';
  const filteredPosts =
    data?.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({ search: searchTerm });
  };

  return (
    <PageWrapper isLoading={isLoading} isError={isError}>
      <form onSubmit={handleOnSubmit}>
        <Input type="text" name="search" onChange={handleOnChange} />
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
