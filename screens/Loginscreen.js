import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- Google Auth Configuration ---
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "TON_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "TON_IOS_CLIENT_ID.apps.googleusercontent.com",
    expoClientId: "TON_EXPO_CLIENT_ID.apps.googleusercontent.com",
  });

  // Si la connexion Google réussit
  useEffect(() => {
    if (response?.type === 'success') {
      navigation.replace('Accueil');
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        Alert.alert('Erreur', 'Aucun compte trouvé. Veuillez vous inscrire.');
        return;
      }

      const user = JSON.parse(storedUser);

      if (email === user.email && password === user.password) {
        navigation.replace('Accueil');
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects ❌');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de vérifier les identifiants.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>🌱 AgriSage</Text>

          {/* Champ Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Champ Mot de passe + visibilité */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {/* Bouton de connexion */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Se connecter</Text>
          </TouchableOpacity>

          {/* Séparateur */}
          <Text style={styles.orText}>──────────  OU  ──────────</Text>

          {/* Bouton Google */}
          <TouchableOpacity
            style={styles.googleButton}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Se connecter avec Google</Text>
          </TouchableOpacity>

          {/* Lien inscription */}
          <Text style={styles.signupText}>
            Pas de compte ?{' '}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate('Signup')}
            >
              S'inscrire
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F6FFF6',
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#2E8B57' },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },

  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  passwordInput: { flex: 1, padding: 12 },
  eyeButton: { paddingHorizontal: 10 },

  loginButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  orText: { color: '#777', marginVertical: 20, fontWeight: 'bold' },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontSize: 15, color: '#333' },

  signupText: { marginTop: 20, fontSize: 14 },
  signupLink: { color: '#1E90FF', fontWeight: 'bold' },
});
