import {
	Client,
	Account,
	Databases,
	Storage,
	Avatars,
} from 'appwrite';

export const appwriteConfig = {
	projectId: import.meta.env.VITE_APP_APPWRITE_PROJECT_ID,
	url: import.meta.env.VITE_APP_APPWRITE_ENDPOINT,
	databaseId: import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
	storageId: import.meta.env.VITE_APP_APPWRITE_STORAGE_ID,
	userCollectionId: import.meta.env
		.VITE_APP_APPWRITE_USER_COLLECTION_ID,
	postCollectionId: import.meta.env
		.VITE_APP_APPWRITE_POST_COLLECTION_ID,
	saveCollectionId: import.meta.env
		.VITE_APP_APPWRITE_SAVE_COLLECTION_ID,
};

export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
