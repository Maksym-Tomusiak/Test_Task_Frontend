import { useState, useCallback } from 'react';
import type { Captcha } from '../types';
import { captchaService } from '../services';

export const useCaptcha = () => {
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await captchaService.getCaptcha();
      setCaptcha(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Failed to fetch captcha';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCaptcha = useCallback(() => {
    return fetchCaptcha();
  }, [fetchCaptcha]);

  return { captcha, loading, error, fetchCaptcha, refreshCaptcha };
};
