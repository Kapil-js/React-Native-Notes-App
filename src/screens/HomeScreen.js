import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {notesCollection} from '../firebase/firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import FONT from './font';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');

  // Logout function
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.replace('Login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (uid) {
      firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            setUsername(doc.data().username);
          }
        });

      // Fetch notes for the logged-in user
      const unsubscribe = firestore()
        .collection('notes')
        .where('uid', '==', uid) // Filter notes by user ID (uid)
        .onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(data);
        });

      return () => unsubscribe();
    }
  }, []);

  const deleteNote = async id => {
    await firestore().collection('notes').doc(id).delete();
  };
  const renderItem = ({item}) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteText}>{item.text}</Text>
      <Text style={styles.noteTime}>{item.time}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AddNote', {note: item})}>
          <Image
            source={require('../assets/images/edit.png')}
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => deleteNote(item.id)}>
          <Image
            source={require('../assets/images/delete.png')}
            style={{
              width: 19,
              height: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'end',
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/images/logout.png')}
            style={{width: 24, height: 20, marginRight: 10}}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.NunitoBold,
              color: '#000',
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 40, alignItems: 'center', paddingBottom: 20}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Nunito-Bold',
            fontWeight: 'bol',
            marginBottom: 4,
            color: '#938AC2',
          }}>
          Welcome, {!username ? auth().currentUser?.email : username}!
        </Text>
        <Text
          style={{
            fontSize: 22,
            color: '#292150',
            // fontWeight: 'bold',
            fontFamily: 'Nunito-ExtraBold',
          }}>
          Note-Taking App
        </Text>
      </View>
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddNote')}>
          <Image
            source={require('../assets/images/add.png')}
            style={{width: 24, height: 24}}
          />
          <Text style={styles.addText}>Add New Notes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F8FD',
    width: '100%',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  notesList: {
    paddingHorizontal: 16,
    paddingBottom: 100, // space for the fixed footer
  },
  noteCard: {
    backgroundColor: '#7B5AED',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    width: '100%',
  },
  noteText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  noteTime: {
    color: '#eee',
    fontSize: 14,
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    width: 40,
    height: 40,
    elevation: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#7B5AED',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
