import * as z from 'zod';

export const SignupValidationSchema = z.object({
	name: z.string().min(2, { message: 'Name is too short' }),
	username: z
		.string()
		.min(2, { message: 'Too Short' })
		.max(20),
	email: z.string().email(),
	password: z
		.string()
		.min(6, {
			message: 'Password must be at least 6 characters',
		}),
});
