import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthProvider.jsx';

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <QueryClientProvider client={queryClient}>
                                <App />
                                <ReactQueryDevtools initialIsOpen={false} />
                            </QueryClientProvider>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
