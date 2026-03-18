import React, {createContext, useState, useContext, Children} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token:string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

    const login = (token: string) => {
    setIsAuthenticated(true);
    };

    const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    };

    return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};