
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import customRoutes from './routes';

const AppRouter = () => {
    return (
        <Routes>
            {customRoutes.map((route, index) => {
                const Page = route.component;
                return (
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={<Page />} 
                    />
                );
            })}
        </Routes>
    );
};

export default AppRouter;