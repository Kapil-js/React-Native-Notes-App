import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {notesCollection} from '../firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import FONT from './font';

const AddNoteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingNote = route.params?.note;

  const [text, setText] = useState(editingNote ? editingNote.text : '');

  const handleSave = async () => {
    if (text.trim() === '') {
      Alert.alert('Empty Note', 'Please write something before saving.');
      return;
    }

    try {
      const user = auth().currentUser;
      const timestamp = moment().format('hh:mm A DD MMMM - YYYY');

      if (editingNote) {
        // Update existing note
        await firestore().collection('notes').doc(editingNote.id).update({
          text,
          time: timestamp,
        });
      } else {
        // Save new note
        await firestore().collection('notes').add({
          text,
          time: timestamp,
          email: user?.email, // Save user email
          uid: user?.uid, // Save user UID to associate with notes
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error adding/updating note:', error);
      Alert.alert('Error', 'Failed to save note. Try again.');
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
        translucent={false}
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Write your note here..."
          multiline
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>
            {editingNote ? 'Update Note' : 'Save Note'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#F9F8FD',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 200,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: FONT.NunitoSemiBold,
  },
  saveButton: {
    backgroundColor: '#7B5AED',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONT.NunitoBold,
  },
});

export default AddNoteScreen;
