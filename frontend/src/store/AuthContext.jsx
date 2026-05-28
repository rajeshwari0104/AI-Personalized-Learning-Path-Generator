import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, getProfile } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    const profile = await getProfile();
    setUser(profile.data);
  };

  const loginWithGoogle = async (googleToken) => {
    const res = await axios.post('http://127.0.0.1:8000/api/accounts/google/', {
      token: googleToken
    });
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);