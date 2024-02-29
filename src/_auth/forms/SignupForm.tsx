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
import { SignupValidationSchema } from '@/lib/validations';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
	useCreateUserAccountMutation,
	useSignInAccountMutation,
} from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SignupForm = () => {
	const { CheckAuthUser, isLoading: isUserLoading } =
		useUserContext();
	const navigate = useNavigate();
	const { toast } = useToast();

	const {
		mutateAsync: CreateUserAccount,
		isPending: isCreatingUser,
	} = useCreateUserAccountMutation();

	const {
		mutateAsync: signInAccount,
		isPending: isSigningIn,
	} = useSignInAccountMutation();

	// 1. Define your form.
	const form = useForm<
		z.infer<typeof SignupValidationSchema>
	>({
		resolver: zodResolver(SignupValidationSchema),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof SignupValidationSchema>
	) {
		const newUser = await CreateUserAccount(values);
		if (!newUser) {
			return toast({
				title: 'Signup Failed, Please Try Again',
			});
		}

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
				title: 'Signup Failed, Please Try Again',
			});
		}
	}
	return (
		<Form {...form}>
			<div className='sm:w-420 flex items-center flex-col'>
				<img src='/assets/images/snapify.svg' alt='logo' />

				<h2 className='h3-bold md:h2-bold pt-5 lg:pt-12'>
					Create a new Account
				</h2>
				<p className='text-light-3 small-medium md:base-regular mt-2'>
					To use Snapfluence, Please enter your account
					details
				</p>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col gap-5 w-full mt-5 md:mt-10'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										type='text'
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
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type='text'
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
						className='shad-button_primary w-full flex items-center justify-center'
					>
						{isCreatingUser ||
						isSigningIn ||
						isUserLoading ? (
							<div className='flex justify-center gap-2'>
								<Loader /> Loading...
							</div>
						) : (
							'Sign Up'
						)}
					</Button>

					<p className='text-small-regular text-light-2 text-center mt-2 '>
						Already have an account?{' '}
						<Link
							to='/signin'
							className='text-primary-500 text-small-semibold ml-1'
						>
							Sign In
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
