import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SigninValidationSchema } from '@/lib/validations';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSignInAccountMutation } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
	const { CheckAuthUser, isLoading: isUserLoading } =
		useUserContext();
	const navigate = useNavigate();
	const { toast } = useToast();

	const { mutateAsync: signInAccount } =
		useSignInAccountMutation();

	// 1. Define your form.
	const form = useForm<
		z.infer<typeof SigninValidationSchema>
	>({
		resolver: zodResolver(SigninValidationSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof SigninValidationSchema>
	) {
		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});
		if (!session) {
			return toast({
				title: 'Signin Failed, Please Try Again',
			});
		}

		const isLoggedIn = await CheckAuthUser();
		if (isLoggedIn) {
			form.reset();
			navigate('/');
		} else {
			toast({
				title: 'Signin Failed, Please Try Again',
			});
		}
	}
	return (
		<Form {...form}>
			<div className='sm:w-420 flex items-center flex-col'>
				<img src='/assets/images/snapify.svg' alt='logo' />

				<h2 className='h3-bold md:h2-bold pt-5 lg:pt-12'>
					Log in to your Account
				</h2>
				<p className='text-light-3 small-medium md:base-regular mt-2'>
					Welcome back! Log in to your account to continue
				</p>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex-col gap-5 w-full mt-5 md:mt-10'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										className='shad-input'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='shad-input'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type='submit'
						className='shad-button_primary w-full flex items-center justify-center mt-5'
					>
						{isUserLoading ? (
							<div className='flex justify-center gap-2'>
								<Loader /> Loading...
							</div>
						) : (
							'Sign In'
						)}
					</Button>

					<p className='text-small-regular text-light-2 text-center mt-2 '>
						Don't have an account?{' '}
						<Link
							to='/signup'
							className='text-primary-500 text-small-semibold ml-1'
						>
							Sign Up
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;
