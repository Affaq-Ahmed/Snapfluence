export type IUser = {
	id: string;
	name: string;
	email: string;
	username: string;
	imageUrl: string;
	bio: string;
};

export type INewUser = {
	name: string;
	email: string;
	username: string;
	password: string;
};

export type IUpdateUser = {
	userId: string;
	name: string;
	bio: string;
	imageId: string;
	imageUrl: URL | string;
	file: File[];
};

export type INewPost = {
	userId: string;
	caption: string;
	file: File[];
	location?: string;
	tags?: string;
};

export type IUpdatePost = {
	postId: string;
	caption: string;
	imageId: string;
	imageUrl: URL;
	file: File[];
	location?: string;
	tags?: string;
};

export type INavLink = {
	imageUrl: string;
	route: string;
	label: string;
};
