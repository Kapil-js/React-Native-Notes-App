// firebaseConfig.js
import firestore from '@react-native-firebase/firestore';

export const notesCollection = firestore().collection('notes');

export const usersCollection = firestore().collection('users');
