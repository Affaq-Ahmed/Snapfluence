import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
	id: '',
	name: '',
	email: '',
	username: '',
	imageUrl: '',
	bio: '',
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isAuthenticated: false,
	isLoading: true,
	setUser: () => {},
	setIsAuthenticated: () => {},
	CheckAuthUser: async () => false as boolean,
};

const AuthContext =
	createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(INITIAL_USER);
	const [isAuthenticated, setIsAuthenticated] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const CheckAuthUser = async () => {
		try {
			const currentAccount = await getCurrentUser();

			if (currentAccount) {
				setUser({
					id: currentAccount.$id,
					name: currentAccount.name,
					email: currentAccount.email,
					username: currentAccount.username,
					imageUrl: currentAccount.imageUrl,
					bio: currentAccount.bio,
				});

				setIsAuthenticated(true);

				return true;
			}

			return false;
		} catch (error) {
			console.log(error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (
			localStorage.getItem('cookieFallback') === '[]'
			// ||
			// localStorage.getItem('cookieFallback') === null
		) {
			navigate('/signin');
		}

		CheckAuthUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				setUser,
				setIsAuthenticated,
				CheckAuthUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
