import * as z from 'zod';

export const SignupValidationSchema = z.object({
	name: z.string().min(2, { message: 'Name is too short' }),
	username: z
		.string()
		.min(2, { message: 'Too Short' })
		.max(20),
	email: z.string().email(),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters',
	}),
});

export const SigninValidationSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters',
	}),
});

export const ProfileValidation = z.object({
	file: z.custom<File[]>(),
	name: z
		.string()
		.min(2, {
			message: 'Name must be at least 2 characters.',
		}),
	username: z
		.string()
		.min(2, {
			message: 'Name must be at least 2 characters.',
		}),
	email: z.string().email(),
	bio: z.string(),
});

export const PostValidation = z.object({
	caption: z
		.string()
		.min(5, {
			message: 'Caption is too short',
		})
		.max(2200),
	file: z.custom<File[]>(),
	location: z
		.string()
		.min(2, {
			message:
				'Location is too short, minimum 2 characters',
		})
		.max(100),
	tags: z.string(),
});
