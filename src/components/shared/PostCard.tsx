import { Models } from 'appwrite';
import React from 'react';
import { Link } from 'react-router-dom';

type PostCardProps = {
	post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
	return (
		<div className='post-card'>
			<div className='flex-between'>
				<div className='flex items-center'>
					<Link></Link>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
