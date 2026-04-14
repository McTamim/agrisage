// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs ⚠️');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        Alert.alert('Erreur', "Aucun compte trouvé. Inscrivez-vous !");
        return;
      }

      const user = JSON.parse(storedUser);

      if (email === user.email && password === user.password) {
        navigation.replace('Accueil');
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects ❌');
      }
    } catch (e) {
      Alert.alert('Erreur', 'Connexion impossible 😢');
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
            <Text style={styles.title}>🌿 Connexion</Text>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#2E8B57" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
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

            {/* LOGIN BUTTON */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryText}>Se connecter</Text>
            </TouchableOpacity>

            {/* OR */}
            <Text style={styles.orText}>────── OU ──────</Text>

            {/* GOOGLE */}
            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={require('../assets/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Se connecter avec Google</Text>
            </TouchableOpacity>

            {/* SIGNUP */}
            <Text style={styles.footerText}>
              Pas encore de compte ?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.replace('Signup')}
              >
                S'inscrire
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
    justifyContent: 'center',
    alignItems: 'center',
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

  primaryButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
    fontWeight: 'bold',
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  googleText: {
    fontSize: 15,
    color: '#333',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 20,
  },

  footerLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
