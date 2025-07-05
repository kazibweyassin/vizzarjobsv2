import { useSession } from "@clerk/clerk-react";
import { useState, useCallback } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session?.getToken({
        template: "supabase",
      });
      
      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      
      // Enhanced error handling
      const enhancedError = {
        message: error.message || 'An unexpected error occurred',
        code: error.code,
        status: error.status,
        details: error.details,
        timestamp: new Date().toISOString(),
      };
      
      setError(enhancedError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session, cb, options]);

  const reset = useCallback(() => {
    setData(undefined);
    setLoading(null);
    setError(null);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    fn,
    reset,
    isSuccess: !loading && !error && data !== undefined,
    isError: !loading && error !== null,
    isLoading: loading === true,
  };
};

export default useFetch;
