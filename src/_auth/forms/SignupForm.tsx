import React from 'react';
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
import { Link } from 'react-router-dom';
import { CreateUserAccount } from '@/lib/appwrite/api';

const SignupForm = () => {
	const isLoading = false;
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
		console.log(values);
		const newUser = await CreateUserAccount(values);

		console.log(newUser);
	}
	return (
		<Form {...form}>
			<div className='sm:w-420 flex items-center flex-col'>
				<img src='/assets/images/logo.svg' alt='logo' />

				<h2 className='h3-bold md:h2-bold pt-5 lg:pt-12'>
					Create a new Account
				</h2>
				<p className='text-light-3 small-medium md:base-regular mt-2'>
					To use Snapfluence, Please enter your account
					details
				</p>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex-col gap-5 w-full mt-5 md:mt-10'
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
						className='shad-button_primary w-full flex items-center justify-center '
					>
						{isLoading ? (
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
