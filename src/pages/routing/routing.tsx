import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
// import { AppLayout } from '../layout/AppLayout';
// import { AppLayout } from '../layout/AppLayout';

const BuyPage = React.lazy(() => import('../buy/buy'));
const MainPage = React.lazy(() => import('../main/main'));
const LevelsPage = React.lazy(() => import('../levels/levels'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense fallback={<LoaderScreen />}>
            <BrowserRouter>
                <Routes>
                    <Route path="/whiskers-frontend" element={<MainPage />} />
                    <Route path="/whiskers-frontend/buy" element={<BuyPage />} />
                    <Route path="/whiskers-frontend/levels" element={<LevelsPage />} />
                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

