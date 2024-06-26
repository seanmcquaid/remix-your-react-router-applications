import { useParams } from 'react-router-dom';
import PageWrapper from '@/components/app/PageWrapper';
import useGetPostQuery from '@/services/queries/useGetPostQuery';
import LinkButton from '@/components/ui/LinkButton';

const PostDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetPostQuery(id!);

  return (
    <PageWrapper isLoading={isLoading} isError={isError}>
      <LinkButton to="/" className="m-4">
        Back to Posts
      </LinkButton>
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </PageWrapper>
  );
};

export default PostDetailsPage;
