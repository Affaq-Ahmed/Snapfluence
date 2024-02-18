import { ID } from 'appwrite';
import { INewUser } from '@/types';
import {
	account,
	appwriteConfig,
	avatars,
	database,
} from './config';

export async function CreateUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		if (!newAccount) throw new Error('Account not created');

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			email: newAccount.email,
			name: newAccount.name,
			imageUrl: avatarUrl,
			username: user.username,
		});

		return newUser;
	} catch (error) {
		console.log(error);
	}
}

export async function saveUserToDB(user: {
	accountId: string;
	email: string;
	name: string;
	imageUrl: URL;
	username?: string;
}) {
	try {
		const newUser = await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: user.accountId,
				email: user.email,
				name: user.name,
				imageUrl: user.imageUrl,
				username: user.username,
			}
		);

		return newUser;
	} catch (error) {
		console.log(error);
	}
}
