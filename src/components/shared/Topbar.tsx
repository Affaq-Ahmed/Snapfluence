import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutMutation } from '@/lib/react-query/queriesAndMutations';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {
	const { user } = useUserContext();
	const navigate = useNavigate();
	const { mutate: signOut, isSuccess } =
		useSignOutMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate(0);
		}
	}, [isSuccess]);

	return (
		<section className='topbar'>
			<div className='flex-between py-4 px-5'>
				<Link to='/' className='flex gap-3 items-center'>
					<img
						src='/assets/images/snapify.svg'
						alt='logo'
						width={130}
						height={325}
					/>
				</Link>

				<div className='flex gap-4'>
					<Button
						variant='ghost'
						className='shad-button_ghost'
						onClick={() => signOut()}
					>
						<img
							src='/assets/icons/logout.svg'
							alt='logout'
						/>
					</Button>
					<Link
						to={`/profile/${user?.id}`}
						className='flex items-center gap-3'
					>
						<img
							src={
								user.imageUrl ||
								'/assets/images/profile.png'
							}
							alt='profile-picture'
							width={40}
							height={40}
							className='rounded-full h-8 w-8'
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Topbar;
