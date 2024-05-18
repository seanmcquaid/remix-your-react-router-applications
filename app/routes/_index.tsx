import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import { useRemixForm, getValidatedFormData } from 'remix-hook-form';
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  json,
  redirect,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs } from '@remix-run/node';
import postsService from '@/services/postsService';
import queryClient from '@/services/queryClient';
import QueryKey from '@/services/queries/QueryKey';
import Post from '@/types/Post';

const formDataSchema = z.object({
  search: z.string(),
});

type FormData = z.infer<typeof formDataSchema>;

const resolver = zodResolver(formDataSchema);

export const loader = async () => {
  const posts = await postsService.getPosts();

  return json({
    posts,
  });
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const cachedQueryData = queryClient.getQueryData<{ posts: Post[] }>([
    QueryKey.GET_POSTS,
  ]);

  if (cachedQueryData) {
    const cachedPosts = cachedQueryData.posts;
    return { posts: cachedPosts };
  }

  const { posts } = await queryClient.fetchQuery({
    queryKey: [QueryKey.GET_POSTS],
    queryFn: () => serverLoader<{ posts: Post[] }>(),
  });

  console.log('posts', posts);

  return {
    posts,
  };
};

clientLoader.hydrate = true;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;

  if (method === 'DELETE') {
    const formData = await request.formData();
    const postId = formData.get('postId')?.toString();

    await postsService.deletePost(postId ?? '');

    return null;
  }

  const { data } = await getValidatedFormData<FormData>(request, resolver);

  return redirect(`/?search=${data?.search}`);
};

export const clientAction = async ({
  serverAction,
}: ClientActionFunctionArgs) => {
  queryClient.removeQueries({
    queryKey: [QueryKey.GET_POSTS],
  });

  return serverAction();
};

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const { posts } = useLoaderData<typeof loader>();
  const filteredPosts =
    posts.filter(post =>
      post.title
        .toLowerCase()
        .includes(searchParams.get('search')?.toLowerCase() ?? ''),
    ) ?? [];
  const { register, handleSubmit } = useRemixForm<FormData>({
    resolver,
    mode: 'onSubmit',
  });

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit} method="post">
        <Input
          type="text"
          {...register('search')}
          defaultValue={searchParams.get('search') ?? ''}
        />
        <Button type="submit">Search</Button>
      </Form>
      <ul className="grid grid-cols-2">
        {filteredPosts?.map(post => (
          <li key={post.id} className="flex mt-4 items-center">
            {post.title.substring(0, 5)}
            <Form method="delete">
              <input type="hidden" name="postId" value={post.id} />
              <Button
                className="ml-4"
                type="submit"
                name="intent"
                value="delete"
              >
                Delete
              </Button>
            </Form>
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
