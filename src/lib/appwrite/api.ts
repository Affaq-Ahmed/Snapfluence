import { ID, Query } from 'appwrite';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import {
	account,
	appwriteConfig,
	avatars,
	database,
	storage,
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

export async function SigninAccount(user: {
	email: string;
	password: string;
}) {
	try {
		const session = await account.createEmailSession(
			user.email,
			user.password
		);

		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		);

		if (!currentUser) throw new Error('User not found');

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
	}
}

export async function signOutAccount() {
	try {
		const session = await account.deleteSession('current');

		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function createPost(post: INewPost) {
	try {
		//Uplaod File first
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) throw new Error();

		const fileUrl = getFilePreview(uploadedFile.$id);

		if (!fileUrl) {
			await deleteFile(uploadedFile.$id);
			throw new Error();
		}

		//Convert tags to array
		const tags =
			post.tags?.replace(/ /g, '').split(',') || [];

		const newPost = await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
				location: post.location,
				tags: tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw new Error('Post not created');
		}

		return newPost;
	} catch (error) {
		console.log(error);
	}
}

export async function uploadFile(file: File) {
	try {
		const uploadedFile = await storage.createFile(
			appwriteConfig.storageId,
			ID.unique(),
			file
		);

		return uploadedFile;
	} catch (error) {
		console.log(error);
	}
}

export function getFilePreview(fileId: string) {
	try {
		const fileUrl = storage.getFilePreview(
			appwriteConfig.storageId,
			fileId,
			2000,
			2000,
			'top',
			100
		);

		return fileUrl.href;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteFile(fileId: string) {
	try {
		await storage.deleteFile(
			appwriteConfig.storageId,
			fileId
		);

		return { status: 'ok' };
	} catch (error) {
		console.log(error);
	}
}

export async function getRecentPosts() {
	try {
		const posts = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.orderDesc('$createdAt'), Query.limit(10)]
		);

		if (!posts) throw new Error('No posts found');

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function likePost(
	postId: string,
	likesArray: string[]
) {
	try {
		const updatedPost = await database.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function savePost(
	postId: string,
	userId: string
) {
	try {
		const updatedPost = await database.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.saveCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteSavedPost(savedPostId: string) {
	try {
		const statusCode = await database.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.saveCollectionId,
			savedPostId
		);

		if (!statusCode) throw Error;

		return { statusCode: 'ok' };
	} catch (error) {
		console.log(error);
	}
}

export async function getPostById(postId: string) {
	try {
		const post = await database.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId
		);

		if (!post) throw new Error('Post not found');

		return post;
	} catch (error) {
		console.log(error);
	}
}

export async function updatePost(post: IUpdatePost) {
	const hasFile = post.file.length > 0;
	try {
		let image = {
			imageUrl: post.imageUrl,
			imageId: post.imageId,
		};

		if (hasFile) {
			//Uplaod File first
			const uploadedFile = await uploadFile(post.file[0]);

			if (!uploadedFile) throw new Error();

			const fileUrl = getFilePreview(uploadedFile.$id);

			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw new Error();
			}

			image = {
				...image,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
			};
		}

		//Convert tags to array
		const tags =
			post.tags?.replace(/ /g, '').split(',') || [];

		const updatedPost = await database.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			post.postId,
			{
				caption: post.caption,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
				location: post.location,
				tags: tags,
			}
		);

		if (!updatedPost) {
			await deleteFile(post.imageId);
			throw new Error('Post not created');
		}

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deletePost(
	postId: string,
	imageId: string
) {
	if (!postId || !imageId) throw Error;

	try {
		const deletedPost = await database.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId
		);

		if (!deletedPost) throw new Error('Post not deleted');

		await deleteFile(imageId);

		return { status: 'ok' };
	} catch (error) {
		console.log(error);
	}
}

export async function getInfinitePosts({
	pageParam,
}: {
	pageParam: number;
}) {
	const queries: string[] = [
		Query.orderDesc('$updatedAt'),
		Query.limit(10),
	];

	if (pageParam)
		queries.push(Query.cursorAfter(pageParam.toString()));

	try {
		const posts = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			queries
		);

		if (!posts) throw new Error('No posts found');

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function searchPosts(searchTerm: string) {
	try {
		const posts = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.search('caption', searchTerm)]
		);

		if (!posts) throw new Error('No posts found');

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function getUsers() {
	try {
		const users = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.limit(10)]
		);

		if (!users) throw new Error('No users found');

		return users;
	} catch (error) {
		console.log(error);
	}
}
