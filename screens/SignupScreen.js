// screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const user = { email, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Succès ✅', 'Compte créé avec succès !');
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Erreur', 'Création du compte impossible 😢');
    }
  };

  return (
    <LinearGradient colors={['#A8E6CF', '#DCEDC1']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.center}
          keyboardShouldPersistTaps="handled"
        >
          <Animatable.View animation="fadeInUp" style={styles.card}>
            <Text style={styles.title}>🌿 Créer un compte</Text>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#2E8B57" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#2E8B57" />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#2E8B57" />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupText}>S'inscrire</Text>
            </TouchableOpacity>

            {/* LOGIN */}
            <Text style={styles.loginText}>
              Déjà un compte ?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.replace('Login')}
              >
                Se connecter
              </Text>
            </Text>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flexGrow: 1,
    justifyContent: 'center',   // CENTRAGE VERTICAL
    alignItems: 'center',       // CENTRAGE HORIZONTAL
    padding: 20,
  },

  card: {
    width: Platform.OS === 'web' ? 420 : '100%',
    maxWidth: 450,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
  },

  signupButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  loginText: {
    textAlign: 'center',
    marginTop: 20,
  },

  loginLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
