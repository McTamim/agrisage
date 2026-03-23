// screens/Accueil.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Accueil() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [user, setUser] = useState({ name: 'Mc', photo: null });
  const [weather, setWeather] = useState(null);

  const flatListRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const sidebarAnim = useRef(new Animated.Value(-300)).current; // animation slide
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  // --- Météo ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = '351fe61f4a315e74845eabed6f1ae055';
        const city = 'Dschang';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            city: data.name,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, []);

  // --- Permissions ---
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cam } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: gal } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: mic } = await Audio.requestMicrophonePermissionsAsync();
        if (cam !== 'granted' || gal !== 'granted' || mic !== 'granted') {
          Alert.alert('Permissions requises', 'Caméra, micro et galerie nécessaires.');
        }
      }
    })();
  }, []);

  // --- Animation clavier ---
  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 25,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // --- Animation sidebar ---
  useEffect(() => {
    Animated.spring(sidebarAnim, {
      toValue: sidebarVisible ? 0 : -300,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [sidebarVisible]);

  // --- Message de bienvenue ---
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: `Bienvenue à ${user.name} 🌿`,
      isUser: false,
    };
    setMessages([welcomeMessage]);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [user.name]);

  // --- Envoyer message ---
  const sendMessage = async (text, imageUri, audioUri) => {
    if (!text && !imageUri && !audioUri) return;
    const userMessage = { id: Date.now().toString(), text, imageUri, audioUri, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    const aiMessage = { id: (Date.now() + 1).toString(), isUser: false, loading: true };
    setMessages((prev) => [...prev, aiMessage]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessage.id ? { ...msg, text: 'Réponse IA simulée 🌿', loading: false } : msg
        )
      );
      setHistory((prev) => [text || 'Message envoyé', ...prev]);
      flatListRef.current.scrollToEnd({ animated: true });
    }, 1500);
  };

  // --- Galerie & Caméra ---
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) sendMessage(inputText, result.assets[0].uri);
  };

  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) sendMessage(inputText, result.assets[0].uri);
  };

  // --- Audio ---
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de démarrer l’enregistrement');
    }
  };
  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    sendMessage(null, null, uri);
  };

  // --- Sidebar modernisée ---
  const Sidebar = () => (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
      <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.sidebarHeader}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.sidebarAvatar} />
        ) : (
          <View style={styles.sidebarAvatarPlaceholder}>
            <Text style={styles.sidebarAvatarText}>{user.name.charAt(0)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.sidebarUserName}>{user.name}</Text>
          <Text style={styles.sidebarUserStatus}>En ligne 🌿</Text>
        </View>
      </LinearGradient>

      <View style={styles.sidebarMenu}>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Accueil')}>
          <Ionicons name="home-outline" size={22} color="#4CAF50" />
          <Text style={styles.sidebarItemText}>Accueil</Text>
        </TouchableOpacity>
        
      <TouchableOpacity
  style={styles.sidebarLink}
  onPress={() => {
    setSidebarVisible(false);
    navigation.navigate('Marchscreen');
  }}
>
  <Ionicons name="cart-outline" size={22} color="#4CAF50" style={{ marginRight: 8 }} />
  <Text style={styles.sidebarLinkText}>Marché</Text>
</TouchableOpacity>
   
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Experts')}>
          <Ionicons name="people-outline" size={22} color="#4CAF50" />
          <Text style={styles.sidebarItemText}>Experts Locaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Profil')}>
          <Ionicons name="person-circle-outline" size={22} color="#4CAF50" />
          <Text style={styles.sidebarItemText}>Profil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarSectionTitle}>🕒 Historique</Text>
        {history.length > 0 ? (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItemContainer}>
                <Ionicons name="chatbox-outline" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
                <Text style={styles.historyItem}>{item}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noHistory}>Aucun message récent</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // --- Messages ---
  const renderMessage = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: item.isUser ? 1 : scaleAnim }] }}>
      <LinearGradient
        colors={item.isUser ? ['#B9FBC0', '#DCF8C6'] : ['#E0F7FA', '#FFFFFF']}
        style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}
      >
        {item.loading && <ActivityIndicator color="#007AFF" />}
        {item.text && <Text style={styles.messageText}>{item.text}</Text>}
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.messageImage} />}
        {item.audioUri && (
          <TouchableOpacity
            style={styles.audioButton}
            onPress={async () => {
              const { sound } = await Audio.Sound.createAsync({ uri: item.audioUri });
              await sound.playAsync();
            }}
          >
            <Ionicons name="play" size={24} color="#4CAF50" />
            <Text style={{ marginLeft: 6 }}>Écouter audio</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F8' }}>
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        if (sidebarVisible) setSidebarVisible(false);
      }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.userAvatar}>
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={styles.userImage} />
              ) : (
                <Text style={styles.userInitial}>{user.name.charAt(0)}</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AgriSage</Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(!sidebarVisible)}>
              <Ionicons name="menu" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <Sidebar />

          {/* Météo et bienvenue */}
          <Animated.View style={{ alignItems: 'center', marginVertical: 10, transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.welcomeText}>Bienvenue à {user.name} 🌿</Text>
            {weather ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.weatherText}>
                  {weather.city} : {weather.temp}°C, {weather.description}
                </Text>
              </View>
            ) : (
              <ActivityIndicator size="small" color="#4CAF50" />
            )}
          </Animated.View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          />

          {/* Boutons Marché et Experts */}
        <TouchableOpacity
  style={styles.marcheButton}
  onPress={() => navigation.navigate('Marchscreen')}
>
  <Text style={styles.marcheButtonText}>Marché</Text>
</TouchableOpacity>


          <TouchableOpacity style={styles.expertsButton} onPress={() => navigation.navigate('Experts')}>
            <Text style={styles.expertsButtonText}>Experts locaux</Text>
          </TouchableOpacity>

          {/* Zone de saisie */}
          <Animated.View style={[styles.inputContainer, { transform: [{ translateY }] }]}>
            <TouchableOpacity onPress={takePhotoWithCamera}>
              <Ionicons name="camera" size={32} color="#4CAF50" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImageFromGallery}>
              <Ionicons name="image" size={32} color="#4CAF50" style={styles.icon} />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Écrivez un message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            {isRecording ? (
              <TouchableOpacity onPress={stopRecording}>
                <MaterialCommunityIcons name="stop-circle" size={38} color="red" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                <MaterialCommunityIcons name="microphone" size={35} color="#4CAF50" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'space-between',
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  userInitial: { fontSize: 18, color: '#4CAF50', fontWeight: 'bold' },
  userImage: { width: 40, height: 40, borderRadius: 20 },
  menuButton: { padding: 6, borderRadius: 9 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
  weatherText: { fontSize: 16, color: '#388E3C', marginLeft: 8, fontWeight: '600' },
  marcheButton: { backgroundColor: '#4CAF50', paddingVertical: 10, marginHorizontal: 12, marginBottom: 6, borderRadius: 25, alignItems: 'center' },
  marcheButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  expertsButton: { backgroundColor: '#FFA000', paddingVertical: 10, marginHorizontal: 12, marginBottom: 6, borderRadius: 25, alignItems: 'center' },
  expertsButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderTopWidth: 2, borderColor: '#ddd', backgroundColor: 'white', alignItems: 'center' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 35, paddingHorizontal: 18, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff', marginHorizontal: 6 },
  sendButton: { backgroundColor: '#4CAF50', borderRadius: 28, paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  icon: { marginHorizontal: 6 },
  messageContainer: { maxWidth: '75%', marginBottom: 12, borderRadius: 16, padding: 12 },
  userMessage: { alignSelf: 'flex-end' },
  aiMessage: { alignSelf: 'flex-start' },
  messageText: { fontSize: 16, color: '#333' },
  messageImage: { width: 200, height: 150, borderRadius: 12, marginTop: 8 },
  audioButton: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  messagesList: { padding: 16, marginTop: 10 },

  // --- Sidebar modernisée ---
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '75%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 12,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 10,
    overflow: 'hidden',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sidebarAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 14 },
  sidebarAvatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  sidebarAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  sidebarUserName: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  sidebarUserStatus: { color: 'white', fontSize: 14 },
  sidebarMenu: { paddingVertical: 20, paddingHorizontal: 18 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  sidebarItemText: { fontSize: 16, color: '#333', marginLeft: 12, fontWeight: '500' },
  sidebarSection: { paddingHorizontal: 18, marginTop: 10, flex: 1 },
  sidebarSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginBottom: 8 },
  historyItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  historyItem: { fontSize: 14, color: '#555', flexShrink: 1 },
  noHistory: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 6 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingVertical: 12, justifyContent: 'center', margin: 18, borderRadius: 25 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

