import { authClient } from '@/lib/auth-client';
import { useCallback, useMemo } from 'react';

export const useCurrentUser = () => {
  const { data, error, isPending, refetch } = authClient.useSession();

  // Check if user is authenticated
  const isAuthenticated = useMemo(() => !!data && !error, [data, error]);

  // Memoize user data
  const user = useMemo(
    () => (isAuthenticated ? data?.user || null : null),
    [isAuthenticated, data]
  );

  // Memoize user session
  const session = useMemo(
    () => (isAuthenticated ? data?.session || null : null),
    [isAuthenticated, data]
  );

  // Provide a reload function to refresh the session
  const reloadSession = useCallback(() => {
    return refetch();
  }, [refetch]);

  return {
    user,
    session,
    isLoaded: !isPending,
    isAuthenticated,
    isLoading: isPending,
    error: error || null,
    reloadSession,
  };
};
