import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import postsService from '@/services/postsService';
import { Form, useFetcher, useSearchParams } from 'react-router';
import { Route } from './+types._index';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/QueryKey';
import { toast } from '@/hooks/useToast';

export const loader = async () => {
  const posts = await postsService.getPosts();

  return posts;
};

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const posts = await queryClient.ensureQueryData({
    queryKey: [QueryKey.GET_POSTS],
    queryFn: () => serverLoader(),
  });

  return posts;
};

clientLoader.hydrate = true;

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    const id = formData.get('id') as string;
    await postsService.deletePost(id);
    return null;
  }

  return null;
};

export const clientAction = async ({
  request,
  serverAction,
}: Route.ClientActionArgs) => {
  const method = request.method;

  if (method === 'DELETE') {
    await serverAction();
    queryClient.removeQueries({
      queryKey: [QueryKey.GET_POSTS],
    });
    toast({
      title: 'Post deleted',
    });
    return null;
  }

  return null;
};

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const filteredPosts =
    loaderData?.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== 'idle';

  return (
    <PageWrapper>
      <Form>
        <Input type="text" name="search" defaultValue={search} />
        <Button type="submit">Search</Button>
      </Form>
      <ul className="grid grid-cols-2">
        {filteredPosts?.map(post => (
          <li key={post.id} className="flex mt-4 items-center">
            <fetcher.Form method="DELETE">
              {post.title.substring(0, 5)}
              <input type="hidden" name="id" value={post.id} />
              <Button
                type="submit"
                name="intent"
                value="delete"
                className="ml-4"
                disabled={isDeleting}
              >
                Delete
              </Button>
            </fetcher.Form>
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
