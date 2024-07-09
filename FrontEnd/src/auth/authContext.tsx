import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, Auth, User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const auth: Auth = getAuth();

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

    const value: AuthContextType = {
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
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}