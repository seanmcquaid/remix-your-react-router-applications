import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import postsService from '@/services/postsService';
import { ActionFunctionArgs } from '@remix-run/node';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/QueryKey';
import Post from '@/types/Post';
import { toast } from '@/hooks/useToast';

export const loader = async () => {
  const posts = await postsService.getPosts();

  return posts;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    const id = formData.get('id') as string;
    await postsService.deletePost(id);
    return null;
  }

  return null;
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const cachedPosts = queryClient.getQueryData<Post[]>([QueryKey.GET_POSTS]);

  if (cachedPosts) {
    return cachedPosts;
  }

  const posts = await queryClient.fetchQuery({
    queryKey: [QueryKey.GET_POSTS],
    queryFn: () => serverLoader<Post[]>(),
  });

  return posts;
};

clientLoader.hydrate = true;

export const clientAction = async ({
  request,
  serverAction,
}: ClientActionFunctionArgs) => {
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

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const posts = useLoaderData<typeof loader>();
  const search = searchParams.get('search') ?? '';
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== 'idle';
  const filteredPosts =
    posts?.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <PageWrapper>
      <Form>
        <Input type="text" name="search" defaultValue={search} />
        <Button type="submit">Search</Button>
      </Form>
      <ul className="grid grid-cols-2">
        {filteredPosts?.map(post => (
          <li key={post.id} className="flex mt-4 items-center">
            <fetcher.Form method="delete">
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
