import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { registerNo, token }
  const [loading, setLoading] = useState(true);

  // load stored user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('@user');
        if (json) {
          setUser(JSON.parse(json));
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (userObj) => {
    // userObj = { registerNo, token }
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (e) {
      console.error('Failed to save user to storage', e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (e) {
      console.error('Failed to remove user from storage', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
