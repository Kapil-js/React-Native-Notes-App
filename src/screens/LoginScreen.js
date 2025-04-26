import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ToastAndroid,
  Platform,
  Alert as RNAlert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import FONT from './font';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

  const showToast = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      RNAlert.alert('Notice', message);
    }
  };

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const login = () => {
    if (!email.trim() || !isValidEmail(email)) {
      return showToast('Enter a valid email address');
    }
    if (password.length < 6) {
      return showToast('Password must be at least 6 characters');
    }

    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => {
        showToast('Login successful!');
        navigation.navigate('Home'); // Navigate to Home screen after successful login
      })
      .catch(error => {
        console.error('Login error:', error);

        if ('user-not-found') {
          showToast('No user found with this email');
        } else if ('auth/wrong-password') {
          showToast('Incorrect password');
        } else {
          showToast('Login failed');
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#72777A"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#72777A"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.forgot, {textAlign: 'center'}]}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // justifyContent: 'center',
    backgroundColor: '#F9F8FD',
    paddingTop: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: FONT.NunitoMedium,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    elevation: 1,
    shadowColor: '#6B4EFF',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    fontFamily: FONT.NunitoMedium,
  },
  forgot: {
    color: '#7B61FF',
    textAlign: 'left',
    marginBottom: 32,
    fontFamily: FONT.NunitoMedium,
  },
  button: {
    backgroundColor: '#7B61FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT.NunitoMedium,
  },
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: '#444',
  },
  link: {
    color: '#7B61FF',
    fontFamily: FONT.NunitoMedium,
  },
});
