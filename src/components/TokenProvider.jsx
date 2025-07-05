// Create a new component: TokenProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const TokenContext = createContext(null);

export const TokenProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      if (isSignedIn && user) {
        try {
          const newToken = await user.getToken({ template: 'supabase' });
          setToken(newToken);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        setToken(null);
      }
      setIsLoading(false);
    };

    getToken();
  }, [isSignedIn, user]);

  return (
    <TokenContext.Provider value={{ token, isLoading }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);