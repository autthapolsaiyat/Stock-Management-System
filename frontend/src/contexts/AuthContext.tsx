import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, SESSION_EXPIRED_EVENT } from '../services/api';
import { message, Modal } from 'antd';

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
      
      Modal.warning({
        title: (
          <span style={{ fontSize: 18, fontWeight: 600, color: '#faad14' }}>
            ⚠️ มีการเข้าสู่ระบบจากอุปกรณ์อื่น
          </span>
        ),
        icon: null,
        content: (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 15, marginBottom: 16, color: '#ff6b6b' }}>
              บัญชีของคุณถูกใช้งานจากอุปกรณ์ใหม่ ระบบจึงทำการออกจากระบบโดยอัตโนมัติ
            </p>
            {details?.details && (
              <div style={{ 
                padding: 16, 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 14,
              }}>
                <div style={{ marginBottom: 8 }}>
                  📅 <strong>เวลา:</strong> {formatThaiDateTime(details.details.loginTime)}
                </div>
                {details.details.deviceInfo && (
                  <>
                    <div style={{ marginBottom: 8 }}>
                      💻 <strong>อุปกรณ์:</strong> {details.details.deviceInfo.browser} บน {details.details.deviceInfo.os}
                    </div>
                    {details.details.deviceInfo.ip && (
                      <div>
                        🌐 <strong>IP:</strong> {details.details.deviceInfo.ip}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              backgroundColor: 'rgba(250, 173, 20, 0.2)', 
              borderRadius: 8,
              border: '1px solid #faad14',
              fontSize: 14,
              color: '#faad14',
            }}>
              ⚠️ หากไม่ใช่คุณ กรุณาเปลี่ยนรหัสผ่านทันที
            </div>
          </div>
        ),
        okText: 'เข้าสู่ระบบใหม่',
        onOk: () => {
          window.location.href = '/login';
        },
        centered: true,
        width: 450,
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
