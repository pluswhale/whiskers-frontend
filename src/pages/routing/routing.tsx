import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import { AppLayout } from '../layout/AppLayout';

const BuyPage = React.lazy(() => import('../buy/buy'));
const MainPage = React.lazy(() => import('../main/main'));
const LevelsPage = React.lazy(() => import('../levels/levels'));
const TasksPage = React.lazy(() => import('../tasks/tasks'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense fallback={<LoaderScreen />}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route path="/dev" element={<MainPage />} />
                        <Route path="/dev/buy" element={<BuyPage />} />
                        <Route path="/dev/levels" element={<LevelsPage />} />
                        <Route path="/dev/tasks" element={<TasksPage />} />
                    </Route>
                    <Route path="*" element={<div>Not found</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

