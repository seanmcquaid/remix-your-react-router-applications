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
  const intent = formData.get('intent') ?? '';

  if (intent === 'delete') {
    const postId = formData.get('postId')?.toString() ?? '';

    await postsService.deletePost(postId);

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
    queryClient.removeQueries({
      queryKey: [QueryKey.GET_POSTS],
    });

    const resp = await serverAction();
    toast({ title: 'I got deleted!' });

    return resp;
  }

  return null;
};

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const posts = useLoaderData<typeof clientLoader>();
  const search = searchParams.get('search') ?? '';
  const filteredPosts =
    posts?.filter(post =>
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
            {post.title.substring(0, 5)}
            <fetcher.Form method="delete">
              <input type="hidden" name="postId" value={post.id} />
              <Button
                className="ml-4"
                type="submit"
                name="intent"
                value="delete"
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
