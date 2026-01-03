import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, SESSION_EXPIRED_EVENT } from '../services/api';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  quotationType: string | null;
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
  isAccountOnly: () => boolean;
  hasAccountAccess: () => boolean;
  getQuotationType: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const formatThaiDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSessionExpired = (event: CustomEvent<any>) => {
      const details = event.detail;
      
      Modal.error({
        title: '⚠️ บัญชีของคุณถูกเข้าสู่ระบบจากอุปกรณ์อื่น',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div style={{ marginTop: 16 }}>
            <p>{details?.message || 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง'}</p>
            {details?.details && (
              <div style={{ 
                marginTop: 12, 
                padding: 12, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 8,
                fontSize: 13,
              }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>เวลา:</strong> {formatThaiDateTime(details.details.loginTime)}
                </p>
                {details.details.deviceInfo && (
                  <>
                    <p style={{ margin: '4px 0' }}>
                      <strong>อุปกรณ์:</strong> {details.details.deviceInfo.browser} บน {details.details.deviceInfo.os}
                    </p>
                    {details.details.deviceInfo.ip && (
                      <p style={{ margin: '4px 0' }}>
                        <strong>IP:</strong> {details.details.deviceInfo.ip}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
            <p style={{ marginTop: 16, color: '#ff4d4f' }}>
              หากไม่ใช่คุณ กรุณาเปลี่ยนรหัสผ่านทันที
            </p>
          </div>
        ),
        okText: 'เข้าสู่ระบบใหม่',
        onOk: () => {
          window.location.href = '/login';
        },
      });
      
      setToken(null);
      setUser(null);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired as EventListener);
    
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired as EventListener);
    };
  }, []);

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

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
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

  const isSalesOnly = (): boolean => {
    const salesRoles = ['SALES_STANDARD', 'SALES_FORENSIC', 'SALES_MAINTENANCE'];
    return user?.roles?.some(r => salesRoles.includes(r)) && 
           !user?.roles?.includes('ADMIN') && 
           !user?.roles?.includes('MANAGER') || false;
  };

  const isAccountOnly = (): boolean => {
    const accountRoles = ['ACCOUNT', 'ACCOUNTANT', 'ACCOUNTING', 'FINANCE'];
    return user?.roles?.some(r => accountRoles.includes(r)) && 
           !user?.roles?.includes('ADMIN') && 
           !user?.roles?.includes('SUPER_ADMIN') &&
           !user?.roles?.includes('MANAGER') || false;
  };

  const hasAccountAccess = (): boolean => {
    const accountRoles = ['ACCOUNT', 'ACCOUNTANT', 'ACCOUNTING', 'FINANCE', 'ADMIN', 'SUPER_ADMIN', 'MANAGER'];
    return user?.roles?.some(r => accountRoles.includes(r)) || false;
  };

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
        isAccountOnly,
        hasAccountAccess,
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
