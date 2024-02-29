import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
	isSearchFetching: boolean;
	searchPosts: Models.Document[];
};

const SearchResults = ({
	isSearchFetching,
	searchPosts,
}: SearchResultsProps) => {
	if (isSearchFetching)
		return (
			<div>
				<Loader />
			</div>
		);

	if (searchPosts && searchPosts.documents.length > 0)
		return <GridPostList posts={searchPosts.documents} />;

	return (
		<div className='text-light-4 mt-10 text-center w-full'>
			No Posts Found
		</div>
	);
};

export default SearchResults;
