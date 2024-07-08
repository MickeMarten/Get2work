import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const auth = getAuth();

    useEffect(() => {
        const setAuthPersistence = async () => {
            try {
                await setPersistence(auth, browserLocalPersistence);
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setCurrentUser(user);
                        setUserLoggedIn(true);
                    } else {
                        setCurrentUser(null);
                        setUserLoggedIn(false);
                    }
                    setLoading(false);
                });
                return unsubscribe;
            } catch (error) {
                console.error('Persistence setting failed', error);
                setLoading(false);
            }
        };
        setAuthPersistence();
    }, [auth]);

    const value = {
        currentUser,
        userLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}