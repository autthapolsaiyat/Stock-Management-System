import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { systemSettingsApi } from '../services/api';

interface BrandingContextType {
  systemName: string;
  systemSubtitle: string;
  systemLogo: string;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [systemName, setSystemName] = useState<string>('SVS Business Suite');
  const [systemSubtitle, setSystemSubtitle] = useState<string>('');
  const [systemLogo, setSystemLogo] = useState<string>('/logo.png');
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    try {
      const response = await systemSettingsApi.getPublicBranding();
      if (response.data) {
        setSystemName(response.data.systemName || 'SVS Business Suite');
        setSystemSubtitle(response.data.systemSubtitle || '');
        setSystemLogo(response.data.systemLogo || '/logo.png');
      }
    } catch (error) {
      console.log('Using default branding');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranding();
  }, []);

  const refreshBranding = async () => {
    await loadBranding();
  };

  return (
    <BrandingContext.Provider value={{ systemName, systemSubtitle, systemLogo, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export default BrandingContext;
