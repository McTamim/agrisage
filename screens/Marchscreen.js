// screens/March.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function March() {
  const navigation = useNavigation();

  // Exemple de produits (tu pourras les lier à ta base plus tard)
  const produits = [
    { id: '1', nom: 'Maïs local', prix: '2500 FCFA / sac', image: 'https://cdn.pixabay.com/photo/2016/09/07/11/37/corn-1655921_960_720.jpg' },
    { id: '2', nom: 'Tomates fraîches', prix: '800 FCFA / kg', image: 'https://cdn.pixabay.com/photo/2017/03/01/17/35/tomatoes-2113059_960_720.jpg' },
    { id: '3', nom: 'Plantain', prix: '1500 FCFA / régime', image: 'https://cdn.pixabay.com/photo/2018/02/02/12/38/banana-3125070_960_720.jpg' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.nom}>{item.nom}</Text>
      <Text style={styles.prix}>{item.prix}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Commander</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Marché Agricole</Text>
      </View>

      {/* Liste des produits */}
      <FlatList
        data={produits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  list: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: { width: '100%', height: 150, borderRadius: 12, marginBottom: 10 },
  nom: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  prix: { fontSize: 16, color: '#4CAF50', marginVertical: 4 },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
