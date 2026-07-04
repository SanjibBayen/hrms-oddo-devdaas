import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    signup: store.signup,
    logout: store.logout,
    fetchUser: store.fetchUser,
    setUser: store.setUser,
  };
};

export default useAuth;