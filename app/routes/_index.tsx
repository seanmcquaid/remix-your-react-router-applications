import PageWrapper from '@/components/app/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LinkButton from '@/components/ui/LinkButton';
import { useRemixForm, getValidatedFormData } from 'remix-hook-form';
import {
  Form,
  redirect,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import postsService from '@/services/postsService';

const formDataSchema = z.object({
  search: z.string(),
});

type FormData = z.infer<typeof formDataSchema>;

const resolver = zodResolver(formDataSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await postsService.getPosts();
  const search = new URL(request.url).searchParams.get('search') ?? '';
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );
  return {
    filteredPosts: filteredPosts,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'search') {
    const { data } = await getValidatedFormData<FormData>(request, resolver);

    return redirect(`?search=${encodeURIComponent(data?.search ?? '')}`);
  }

  const postId = formData.get('postId')?.toString();

  await postsService.deletePost(postId ?? '');

  return redirect('/');
};

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const { filteredPosts } = useLoaderData<typeof loader>();
  const { register, handleSubmit } = useRemixForm<FormData>({
    resolver,
    mode: 'onSubmit',
  });

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          {...register('search')}
          defaultValue={searchParams.get('search') ?? ''}
        />
        <Button type="submit" name="intent" value="search">
          Search
        </Button>
      </Form>
      <ul className="grid grid-cols-2">
        {filteredPosts?.map(post => (
          <li key={post.id} className="flex mt-4 items-center">
            {post.title.substring(0, 5)}
            <Form>
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
