import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../../features/footer/footer';
import { useAppContext } from '../../app/providers/AppContext';

export const AppLayout: FC = () => {
    const { userData, isMobile } = useAppContext();

    return (
        <>
            <Outlet />
            <Footer 
                isMobile={isMobile} 
                points={userData?.points} 
                claimedWhisks={userData?.claimedWhisks} 
            />
        </>
    );
};

