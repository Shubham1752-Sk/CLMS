"use client"

import { createContext, useState, useContext } from "react";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}){
    let [user, setUser] = useState<any>();

    return(
        <AppContext.Provider value={{user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}

export default function useAppContext() {
    return useContext(AppContext);
}