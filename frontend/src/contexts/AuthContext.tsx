import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import { message } from 'antd';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  quotationType: string | null; // STANDARD, FORENSIC, MAINTENANCE, null = all
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isSalesOnly: () => boolean;
  getQuotationType: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(username, password);
      const { accessToken, user: userData, roles, permissions, quotationType } = response.data;
      
      const fullUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        roles: roles || [],
        permissions: permissions || [],
        quotationType: quotationType || null,
      };
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(fullUser));
      
      setToken(accessToken);
      setUser(fullUser);
      
      message.success('เข้าสู่ระบบสำเร็จ');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    message.info('ออกจากระบบแล้ว');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  // Check if user is sales-only (limited menu)
  const isSalesOnly = (): boolean => {
    const salesRoles = ['SALES_STANDARD', 'SALES_FORENSIC', 'SALES_MAINTENANCE'];
    return user?.roles?.some(r => salesRoles.includes(r)) && 
           !user?.roles?.includes('ADMIN') && 
           !user?.roles?.includes('MANAGER') || false;
  };

  // Get user's quotation type
  const getQuotationType = (): string | null => {
    return user?.quotationType || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission,
        isSalesOnly,
        getQuotationType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
