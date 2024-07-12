
import React, { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout, loadUserFromStorage } from '@/lib/features/authSlice';
import { isTokenExpired } from '@/lib/utils';
import { useRouter } from 'next/navigation';


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    useEffect(() => {
        const checkToken = () => {
            if (user?.access && isTokenExpired(user.access)) {
                dispatch(logout());
                router.push('/');
            }
        };

        checkToken();
        const interval = setInterval(checkToken, 600000);
        return () => clearInterval(interval);
    }, [user, router, dispatch]);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    return <>{children}</>;
};

export default ProtectedRoute;
