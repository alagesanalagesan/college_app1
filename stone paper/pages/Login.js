import React, { useState,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';

import Logo from '../assets/download.jpeg';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { BASE_URL1 } from './env';
// import { API_URL } from '@env'; 

const BASE_URL = BASE_URL1;





export default function Login({navigation}) {
  const [registerNo, setRegisterNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useContext(AuthContext);



 
const handleLogin = async () => {
    console.log('Login attempted with:', registerNo, password);

    try {
      const response = await axios.post(`${BASE_URL}/login`, { registerNo, password }, { timeout: 10000 });
      console.log('Axios response:', response.status, response.data);

      if (response.status === 200 && response.data.success) {
        // Save registerNo + token to AsyncStorage via AuthContext
        const userObj = { registerNo, token: response.data.token || null };
        await signIn(userObj); // persists and updates context
        // navigation is handled by RootNavigator switching to Home
      } else {
        Alert.alert('Login failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Login error:', error);
      if (__DEV__) debugger;
      Alert.alert('Network / Server error', error?.response?.data?.message || error.message || 'Unable to reach server');
    } finally {
      Keyboard.dismiss();
    }
  };

  const handleForgotPassword = async () => {
    const url = 'https://alagesan.netlify.app/'; // Replace with your actual URL
    
    try {
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        // Open the URL in the device's browser
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open browser. Please check your URL.');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open browser. Please try again.');
    }
  };



  const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const containerProps =
    Platform.OS === 'ios'
      ? { behavior: 'padding', style: styles.container }
      : { style: styles.container };

  return (
    <Container {...containerProps}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.glassContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>Welcome to GTN </Text>
          </View>

          {/* Header */}
          <Text style={styles.header}>Login</Text>
          <Text style={styles.subHeader}>Enter your credentials</Text>

          {/* Register Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Register Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="eg 24UCS1234"
              placeholderTextColor="#A0A0A0"
              value={registerNo}
              onChangeText={setRegisterNo}
              keyboardType="text"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                // focus next (password) - you'd use a ref if needed
              }}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((s) => !s)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
           <TouchableOpacity 
        style={styles.forgotPassword} 
        activeOpacity={0.7}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>


          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, (!registerNo || !password) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!registerNo || !password}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  glassContainer: {
    margin: 25,
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subHeader: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  eyeText: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  loginButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
  },forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },

});
