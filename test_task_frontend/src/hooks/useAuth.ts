import { useState, useCallback } from 'react';
import type { LoginUserDto, RegisterUserDto } from '../types';
import { userService } from '../services';
import { useAuth } from '../contexts/AuthContext';

export const useAuthActions = () => {
  const { login: setAuthToken, logout: clearAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (data: LoginUserDto) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.login(data);
        console.log('Login response:', response);

        // Handle both camelCase and PascalCase from API
        const token =
          (response as any).accessToken || (response as any).AccessToken;

        if (!token) {
          console.error('No token found in response. Full response:', response);
          throw new Error('No access token in response');
        }

        // Pass both token and user to auth context
        await setAuthToken(token, response.user);
        return true;
      } catch (err: any) {
        console.error('Login error:', err);
        const errorMessage =
          err.response?.data?.error || err.message || 'Login failed';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setAuthToken]
  );

  const register = useCallback(async (data: RegisterUserDto) => {
    setLoading(true);
    setError(null);

    try {
      await userService.register(data);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return { login, register, logout, loading, error };
};
