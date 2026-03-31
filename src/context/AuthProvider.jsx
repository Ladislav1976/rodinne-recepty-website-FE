import { createContext, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({});
    const [usercont, setUsercont] = useState({});
    const [csrftoken, setCSRFToken] = useState({});
    const [page, setPage] = useState('');
    const [pageSize, setPageSize] = useState('');
    const [ordering, setOrdering] = useState('');
    const [search, setSearch] = useState('');
    const [is_deleted, setIs_deleted] = useState('false');
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                usercont,
                setUsercont,
                csrftoken,
                setCSRFToken,
                page,
                setPage,
                pageSize,
                setPageSize,
                ordering,
                setOrdering,
                search,
                setSearch,
                is_deleted,
                setIs_deleted,
                persist,
                setPersist,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
