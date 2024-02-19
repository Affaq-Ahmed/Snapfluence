import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Link, useLocation } from 'react-router-dom';

const BottomBar = () => {
	const { pathname } = useLocation();
	return (
		<section className='bottom-bar'>
			{sidebarLinks.map((link: INavLink) => {
				const isActive = pathname === link.route;
				return (
					<li
						key={link.label}
						className={`leftsidebar-link group ${
							isActive && 'bg-primary-500'
						}`}
					>
						<Link
							to={link.route}
							className={`flex flex-col items-center gap-1 p-2 transition ${
								isActive && 'bg-primary-500 rounded-[10px]'
							}`}
						>
							<img
								src={link.imgURL}
								alt={link.label}
								className={`${isActive && 'invert-white'}`}
								width={16}
								height={16}
							/>
							<p className='tiny-medium text-light-2'>
								{link.label}
							</p>
						</Link>
					</li>
				);
			})}
		</section>
	);
};

export default BottomBar;
