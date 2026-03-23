// screens/Parametre.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Parametre({ darkMode, setDarkMode, user }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111' : '#F7F7F8' }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="#4CAF50" />
        <Text style={styles.title}>Paramètres</Text>
      </View>

      {/* Informations utilisateur */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Informations utilisateur</Text>

        {user?.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
        )}

        <Text style={styles.infoText}>Nom : {user?.name}</Text>
        <Text style={styles.infoText}>Statut : Connecté 🌿</Text>
      </View>

      {/* Mode sombre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌙 Apparence</Text>

        <View style={styles.row}>
          <Text style={styles.infoText}>Mode sombre</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      {/* Informations application */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 À propos</Text>
        <Text style={styles.infoText}>Nom : AgriSage</Text>
        <Text style={styles.infoText}>Version : 1.0.0</Text>
        <Text style={styles.infoText}>
          Application intelligente d’assistance agricole 🌿
        </Text>
      </View>

      {/* Déconnexion */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace('Login')}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#4CAF50' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  infoText: { fontSize: 16, marginBottom: 5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
