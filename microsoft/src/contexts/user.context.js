import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children })   => {
    const [username, setUsername] = useState("");
    const [isAuth, setAuth] = useState(false);
    const [wallet, setWallet] = useState("");

    return (
        <UserContext.Provider
            value={{
                username,
                setUsername,
                isAuth,
                setAuth,
                wallet,
                setWallet
            }}
        >
            {children}
        </UserContext.Provider>
    );
};