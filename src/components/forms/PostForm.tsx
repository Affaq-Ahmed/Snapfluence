import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { PostValidation } from '@/lib/validations';
import { Models } from 'appwrite';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
	useCreatePostMutation,
	useUpdatePostMutation,
} from '@/lib/react-query/queriesAndMutations';
import Loader from '../shared/Loader';

type IPostFormProps = {
	post?: Models.Document;
	action: 'Update' | 'Create';
};

const PostForm = ({ post, action }: IPostFormProps) => {
	const { user } = useUserContext();
	const { toast } = useToast();
	const navigate = useNavigate();
	const {
		mutateAsync: createPost,
		isPending: isLoadingCreate,
	} = useCreatePostMutation();
	const {
		mutateAsync: updatePost,
		isPending: isLoadingUpdate,
	} = useUpdatePostMutation();

	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post?.caption || '',
			file: [],
			location: post?.location || '',
			tags: post?.tags.join(',') || '',
		},
	});

	async function onSubmit(
		values: z.infer<typeof PostValidation>
	) {
		if (post && action === 'Update') {
			const updatedPost = await updatePost({
				...values,
				postId: post.$id,
				imageId: post.imageId,
				imageUrl: post.imageUrl,
			});

			if (!updatedPost) {
				toast({
					title: 'Error',
					description: 'Could not update post, try again!',
				});
			}
			return navigate(`/posts/${post.$id}`);
		}

		const newPost = await createPost({
			...values,
			userId: user.id,
		});

		if (!newPost) {
			toast({
				title: 'Error',
				description: 'Could not create post',
			});
		}
		navigate('/');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-9 w-full max-w-5xl'
			>
				<FormField
					control={form.control}
					name='caption'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Caption
							</FormLabel>
							<FormControl>
								<Textarea
									className='shad-textarea custom-scrollbar'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='file'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Photos
							</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.imageUrl}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Location
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='shad-input'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Tags (separated by commas ' , ')
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='shad-input'
									placeholder='Art, Expression, JS, TS'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<div className='flex gap-4 items-center justify-end '>
					<Button
						type='button'
						className='shad-button_dark_4'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						className='shad-button_primary whitespace-nowrap'
						disabled={isLoadingCreate || isLoadingUpdate}
					>
						{isLoadingCreate || isLoadingUpdate ? (
							<Loader />
						) : (
							'submit'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
