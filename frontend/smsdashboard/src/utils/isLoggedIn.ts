export const checkAuthToken = (): boolean => {
    const token = localStorage.getItem('auth-token');
    return token !== null;
  };