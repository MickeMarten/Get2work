import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, } from "firebase/auth";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const auth = getAuth();
    console.log(currentUser, 'authContext')

    useEffect(() => {
        const setAuthPersistence = async () => {
            try {
                await setPersistence(auth, browserLocalPersistence)

                onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user)
                })
            }
            catch (error) {
                console.log('persistence misslyckades')
            }
        }
        setAuthPersistence();
    }, [auth])

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}