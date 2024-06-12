import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import StartScreen from '../../features/start-screen/StartScreen';
import { AppLayout } from '../layout/AppLayout';

const BuyPage = React.lazy(() => import('../buy/buy'));
const MainPage = React.lazy(() => import('../main/main'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense fallback={<LoaderScreen />}>
            <BrowserRouter>
                <Routes>
                    <Route path="/whiskers" element={<AppLayout />}>
                        <Route path="game" element={<MainPage />} />
                        <Route path="buy" element={<BuyPage />} />
                    </Route>
                    <Route path="whiskers" element={<StartScreen />} />

                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

