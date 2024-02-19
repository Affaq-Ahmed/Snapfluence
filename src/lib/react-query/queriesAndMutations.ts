import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from '@tanstack/react-query';
import {
	CreateUserAccount,
	SigninAccount,
} from '../appwrite/api';
import { INewUser } from '@/types';

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
