import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ToastAndroid,
  Platform,
  Alert as RNAlert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FONT from './font';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      RNAlert.alert('Notice', message);
    }
  };
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const signUp = () => {
    if (!username.trim()) return showToast('Username is required');
    if (!isValidEmail(email)) return showToast('Enter a valid email');
    if (password.length < 6) return showToast('Password must be 6+ chars');
    if (password !== confirm) return showToast('Passwords do not match');

    auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        return firestore().collection('users').doc(uid).set({
          username: username.trim(),
          email: email.trim(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        showToast('Account created successfully!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Signup error:', error);
        showToast(error.message || 'Signup failed');
      });
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TextInput
        style={styles.input}
        placeholder="User name"
        placeholderTextColor="#72777A"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#72777A"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#72777A"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Image
            source={
              showPass
                ? require('../assets/images/eye-on-icon.png')
                : require('../assets/images/eye-off-icon.png')
            }
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#72777A"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Image
            source={
              showConfirm
                ? require('../assets/images/eye-on-icon.png')
                : require('../assets/images/eye-off-icon.png')
            }
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            textAlign: 'center',
            color: '#7B61FF',
            fontFamily: FONT.NunitoMedium,
            marginBottom: 30,
          }}>
          Already have an account? Log in
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
    // alignItems: 'center',
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
  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    fontSize: 16,
    elevation: 1,
    shadowColor: '#6B4EFF',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    fontFamily: 'Nunito-medium',
  },
  passwordInput: {
    fontSize: 16,
    flex: 1,
    fontFamily: FONT.NunitoMedium,
  },
  button: {
    backgroundColor: '#7B61FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT.NunitoMedium,
  },
  terms: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    fontFamily: FONT.NunitoMedium,
  },
  link: {
    color: '#7B61FF',
    fontFamily: FONT.NunitoMedium,
  },
});
