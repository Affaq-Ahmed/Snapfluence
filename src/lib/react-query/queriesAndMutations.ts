import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from '@tanstack/react-query';
import {
	CreateUserAccount,
	SigninAccount,
	createPost,
	deletePost,
	deleteSavedPost,
	getCurrentUser,
	getInfinitePosts,
	getPostById,
	getRecentPosts,
	getUserById,
	getUsers,
	likePost,
	savePost,
	searchPosts,
	signOutAccount,
	updatePost,
} from '../appwrite/api';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccountMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => CreateUserAccount(user),
	});
};

export const useSignInAccountMutation = () => {
	return useMutation({
		mutationFn: (user: {
			email: string;
			password: string;
		}) => SigninAccount(user),
	});
};

export const useSignOutMutation = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};

export const useCreatePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetRecentPosts = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			postId,
			likesArray,
		}: {
			postId: string;
			likesArray: string[];
		}) => likePost(postId, likesArray),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useSavePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			postId,
			userId,
		}: {
			postId: string;
			userId: string;
		}) => savePost(postId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useDeleteSavedPost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			savedPostId,
		}: {
			savedPostId: string;
		}) => deleteSavedPost(savedPostId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser,
	});
};

export const useGetPostById = (postId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID],
		queryFn: () => getPostById(postId),
		enabled: !!postId,
	});
};

export const useUpdatePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
		},
	});
};

export const useDeletePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			postId,
			imageId,
		}: {
			postId: string;
			imageId: string;
		}) => deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetPosts = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINTY_POSTS],
		queryFn: getInfinitePosts,
		getNextPageParam: (lastPage) => {
			if (lastPage && lastPage.documents.length === 0)
				return null;

			const lastId =
				lastPage.documents[lastPage.documents.length - 1]
					.$id;

			return lastId;
		},
	});
};

export const useSearchPosts = (searchTerm: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
		queryFn: () => searchPosts(searchTerm),
		enabled: !!searchTerm,
	});
};

export const useGetUsers = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USERS],
		queryFn: () => getUsers(),
	});
};

export const useGetUserById = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId,
	});
};
