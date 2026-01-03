
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';

const AppRouter = () => {
    return (
        <Routes>
            {routes.map((route, index) => {
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