
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const produits = [
  { id: '1', nom: 'Maïs', prix: '500 FCFA/kg', image: 'https://img.icons8.com/color/96/corn.png' },
  { id: '2', nom: 'Cacao', prix: '2500 FCFA/kg', image: 'https://img.icons8.com/color/96/cocoa-beans.png' },
  { id: '3', nom: 'Tomate', prix: '700 FCFA/kg', image: 'https://img.icons8.com/color/96/tomato.png' },
  { id: '4', nom: 'Manioc', prix: '300 FCFA/kg', image: 'https://img.icons8.com/color/96/cassava.png' },
];

export default function MarcheScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.prix}>{item.prix}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Marché des Produits</Text>
      <FlatList
        data={produits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2e7d32',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  prix: {
    fontSize: 16,
    color: '#666',
  },
});
