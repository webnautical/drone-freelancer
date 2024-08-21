import React, { createContext, useContext, useState } from 'react';
const ContextData = createContext();
export const useFrontDataContext = () => useContext(ContextData);
export const FrontContextProvider = ({ children }) => {
    const [portalData, setPortalData] = useState(null)

    return (
        <ContextData.Provider value={{ setPortalData, portalData}}>
            {children}
        </ContextData.Provider>
    );
};