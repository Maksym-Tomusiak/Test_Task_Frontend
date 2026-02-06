import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { userService } from '../services';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  restoreAccount: () => Promise<void>;
  isAdmin: boolean;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(storedToken);

          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            // Fetch current user
            const currentUser = await userService.getCurrentUser();
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await userService.deleteCurrentUser();
      // Refresh user data to get updated isDeleted status
      const updatedUser = await userService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  const restoreAccount = async () => {
    try {
      const restoredUser = await userService.restore();
      setUser(restoredUser);
    } catch (error) {
      console.error('Failed to restore account:', error);
      throw error;
    }
  };

  const isAdmin = React.useMemo(() => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role === 'Admin';
    } catch {
      return false;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        deleteAccount,
        restoreAccount,
        isAdmin,
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
