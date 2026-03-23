// screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs ⚠️');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas ❌');
      return;
    }

    try {
      // Sauvegarde de l'utilisateur
      const user = { email, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Succès ✅', 'Compte créé avec succès !');
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le compte 😢');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Créer un compte 🌿</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.buttonContainer}>
            <Button title="S'inscrire" onPress={handleSignup} color="#2E8B57" />
          </View>

          <Text style={styles.loginText}>
            Déjà un compte ?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.replace('Login')}
            >
              Se connecter
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E8B57', marginBottom: 40 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: { width: '100%', marginTop: 10 },
  loginText: { marginTop: 20, fontSize: 14 },
  loginLink: { color: '#1E90FF', fontWeight: 'bold' },
});
