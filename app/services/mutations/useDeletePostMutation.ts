import { useMutation, useQueryClient } from '@tanstack/react-query';
import postsService from '@/services/postsService';
import { useToast } from '@/hooks/useToast';
import QueryKey from '../queries/QueryKey';

const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const result = useMutation({
    mutationFn: async (id: string) => postsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POSTS],
      });
      toast({ title: 'I got deleted!' });
    },
  });

  return result;
};

export default useDeletePostMutation;
