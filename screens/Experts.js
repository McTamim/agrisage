// screens/ExpertsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const expertsData = [
  { id: '1', name: 'Dr. Pierre', specialty: 'Maladies des plantes', phone: '+237600000000', email: 'pierre@agri.com', photo: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Mme Jeanne', specialty: 'Fertilisation et sols', phone: '+237600000001', email: 'jeanne@agri.com', photo: 'https://randomuser.me/api/portraits/women/2.jpg' },
  // ...ajoute d'autres experts
];

export default function ExpertsScreen() {
  const [search, setSearch] = useState('');
  const [filteredExperts, setFilteredExperts] = useState(expertsData);

  useEffect(() => {
    if (search === '') setFilteredExperts(expertsData);
    else
      setFilteredExperts(
        expertsData.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.specialty.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search]);

  const renderExpert = ({ item }) => (
    <View style={styles.expertCard}>
      <Image source={{ uri: item.photo }} style={styles.expertPhoto} />
      <View style={styles.expertInfo}>
        <Text style={styles.expertName}>{item.name}</Text>
        <Text style={styles.expertSpecialty}>{item.specialty}</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="mail" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un expert..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredExperts}
        keyExtractor={(item) => item.id}
        renderItem={renderExpert}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F8', paddingHorizontal: 15, paddingTop: 15 },
  searchInput: { backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  expertCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  expertPhoto: { width: 60, height: 60, borderRadius: 30 },
  expertInfo: { marginLeft: 15, flex: 1 },
  expertName: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  expertSpecialty: { fontSize: 14, color: '#555', marginVertical: 4 },
  contactRow: { flexDirection: 'row', marginTop: 6 },
});
