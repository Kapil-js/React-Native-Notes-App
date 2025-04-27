import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import auth from '@react-native-firebase/auth';
import FONT from './font';

const OnboardingScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
        navigation.replace('Home');
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  if (isLoggedIn === null) {
    return null;
  }

  const Dots = ({selected}) => (
    <View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 3,
        borderRadius: 4,
        backgroundColor: selected ? '#6B4EFF' : '#C4C4C4',
      }}
    />
  );

  const CreateAccountButton = ({...props}) => (
    <TouchableOpacity
      style={styles.primaryButton}
      {...props}
      onPress={() => navigation.navigate('Signup')}>
      <Text style={styles.primaryButtonText}>Create account</Text>
    </TouchableOpacity>
  );

  const LoginText = () => (
    <Text style={styles.footerText}>
      Have an account?{' '}
      <Text
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}>
        Log in
      </Text>
    </Text>
  );

  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
        translucent={false}
      />
      <Onboarding
        onDone={() => navigation.replace('Login')}
        //   onSkip={() => navigation.replace('Home')}
        DotComponent={Dots}
        bottomBarHighlight={false}
        transitionAnimationDuration={900}
        pages={[
          {
            backgroundColor: '#F9F8FD',
            image: (
              <Image
                source={require('../assets/images/onboard1.png')}
                style={styles.image}
              />
            ),
            title: (
              <Text style={styles.title}>
                <Text style={styles.titleBold}>Note-</Text>
                <Text style={styles.titleColor}>Taking App</Text>
              </Text>
            ),
            subtitle: (
              <View>
                <Text style={styles.subtitle}>Save and share notes</Text>
                <CreateAccountButton
                  onPress={() => navigation.replace('Home')}
                />
                <LoginText />
              </View>
            ),
          },
          {
            backgroundColor: '#F9F8FD',
            image: (
              <Image
                source={require('../assets/images/onboard1.png')}
                style={styles.image}
              />
            ),
            title: (
              <Text style={styles.title}>
                <Text style={styles.titleBold}>Note-</Text>
                <Text style={styles.titleColor}>Taking App</Text>
              </Text>
            ),
            subtitle: (
              <View>
                <Text style={styles.subtitle}>Save and share notes</Text>
                <CreateAccountButton
                  onPress={() => navigation.replace('Home')}
                />
                <LoginText />
              </View>
            ),
          },
          {
            backgroundColor: '#F9F8FD',
            image: (
              <Image
                source={require('../assets/images/onboard1.png')}
                style={styles.image}
              />
            ),
            title: (
              <Text style={styles.title}>
                <Text style={styles.titleBold}>Note-</Text>
                <Text style={styles.titleColor}>Taking App</Text>
              </Text>
            ),
            subtitle: (
              <View>
                <Text style={styles.subtitle}>Save and share notes</Text>
                <CreateAccountButton
                  onPress={() => navigation.replace('Home')}
                />
                <LoginText />
              </View>
            ),
          },
        ]}
      />
    </>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: FONT.NunitoBold,
    position: 'absolute',
    top: 100,
  },
  titleBold: {
    color: '#000',
    fontFamily: FONT.NunitoBold,
  },
  titleColor: {
    color: '#6B4EFF',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: FONT.NunitoExtraBold,
  },
  primaryButton: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT.NunitoMedium,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    fontFamily: FONT.NunitoMedium,
  },
  loginLink: {
    color: '#6B4EFF',
    fontWeight: '600',
    fontFamily: FONT.NunitoMedium,
  },
});

export default OnboardingScreen;
