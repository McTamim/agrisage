// screens/Accueil.js
import 'react-native-reanimated';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-audio';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getWeather } from "../api/weather.js";
import { askGemini } from "../api/gemini.js";
import { identifyPlantAPI } from "../api/plan,id.js";


export default function Accueil() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
 
  const [weather, setWeather] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');

  const flatListRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const sidebarAnim = useRef(new Animated.Value(-260)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();



  // --- Météo ---
 useEffect(() => {
  const fetchWeather = async () => {
    const res = await fetch(
      "https://agrisage-mc.vercel.app/api/weather?city=Dschang"
    );

    const data = await res.json();
    setWeather(data);
  };

  fetchWeather();
}, []);
   // ---AI chatbot ---//
   

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

  // --- Sidebar animée ---
  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarVisible ? 0 : -260,
      duration: 300,
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
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [user.name]);

  // --- Envoyer message ---
  const sendMessage = async (text, imageUri, audioUri) => {
    if (!text && !imageUri && !audioUri) return;

    const userMessage = { id: Date.now().toString(), text, imageUri, audioUri, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();

    const aiMessage = { id: (Date.now() + 1).toString(), isUser: false, loading: true };
    setMessages((prev) => [...prev, aiMessage]);

    // --- Appel Gemini ---
    
   const askAI = async (text) => {
  const res = await fetch(
    "https://agrisage-mc.vercel.app/api/gemini",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  const data = await res.json();
  return data.reply;
};

  // --- Identifier la plante + maladie ---
 const identifyPlant = async (formData) => {
  const res = await fetch(
    "https://agrisage-mc.vercel.app/api/plant",
    {
      method: "POST",
      body: formData,
    }
  );

  return await res.json();
};

  // --- Galerie & Caméra ---
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) identifyPlant(result.assets[0].uri);
  };
  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) identifyPlant(result.assets[0].uri);
  };

  // --- Audio ---
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch {
      Alert.alert('Erreur', 'Impossible de démarrer l’enregistrement');
    }
  };
  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    sendMessage(null, null, uri);
  };

  // --- Sidebar ---
  const Sidebar = () => (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }], backgroundColor: darkMode ? '#222' : '#fff' }]}>
      <View style={styles.sidebarHeader}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.sidebarAvatar} />
        ) : (
          <View style={styles.sidebarAvatarPlaceholder}>
            <Text style={styles.sidebarAvatarText}>{user.name.charAt(0) || 'U'}</Text>
          </View>
        )}
        <View>
          <Text style={[styles.sidebarUserName, { color: darkMode ? '#fff' : '#2E7D32' }]}>{user.name || 'Mc'}</Text>
          <Text style={[styles.sidebarUserStatus, { color: darkMode ? '#aaa' : '#777' }]}>Connecté 🌿</Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
 
  <TouchableOpacity
    style={[styles.sidebarButton, { marginTop: 10 }]}
    onPress={() => {
      setSidebarVisible(false);
      navigation.navigate('Experts');
    }}
  >
    <Ionicons name="people-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.sidebarButtonText}>Experts locaux</Text>
  </TouchableOpacity>
</View>


  

      <Text style={[styles.sidebarTitle, { color: darkMode ? '#4CAF50' : '#4CAF50' }]}>🕒 Historique</Text>
      {history.length > 0 ? (
        <FlatList
          data={history.filter((h) => h.toLowerCase().includes(searchHistory.toLowerCase()))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItemContainer}>
              <Ionicons name="chatbox-outline" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
              <Text style={[styles.historyItem, { color: darkMode ? '#fff' : '#333' }]}>{item}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noHistory, { color: darkMode ? '#aaa' : '#777' }]}>Aucun message pour le moment...</Text>
      )}

      <View style={styles.sidebarDivider} />

      
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('parametre')}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>para</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // --- Messages ---
  const renderMessage = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: item.isUser ? 1 : scaleAnim }] }}>
      <LinearGradient
        colors={item.isUser ? ['#B9FBC0', '#DCF8C6'] : ['#E0F7FA', '#FFFFFF']}
        start={[0, 0]}
        end={[1, 1]}
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
        {/* Ajouter aux favoris */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 6, right: 6 }}
          onPress={() => setFavorites((prev) => [...prev, item])}
        >
          <Feather name="star" size={20} color={favorites.includes(item) ? '#FFD700' : '#ccc'} />
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const handleScroll = ({ nativeEvent }) => {
    const paddingToBottom = 20;
    const isBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom;
    setIsAtBottom(isBottom);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#F7F7F8' }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          if (sidebarVisible) setSidebarVisible(false);
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: darkMode ? '#333' : '#4CAF50' }]}>
            <TouchableOpacity style={styles.userAvatar}>
              {user.photo ? <Image source={{ uri: user.photo }} style={styles.userImage} /> : <Text style={styles.userInitial}>{user.name.charAt(0)}</Text>}
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#fff' }]}>AgriSage</Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(!sidebarVisible)}>
              <Ionicons name="menu" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <Sidebar />

          {/* Message de bienvenue + météo */}
          <Animated.View style={{ alignItems: 'center', marginVertical: 10, transform: [{ scale: scaleAnim }] }}>
            <Text style={[styles.welcomeText, { color: darkMode ? '#fff' : '#2E7D32' }]}>Bienvenue à {user.name} 🌿</Text>
            {weather ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={[styles.weatherText, { color: darkMode ? '#fff' : '#388E3C' }]}>
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
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={() => {
              if (isAtBottom) flatListRef.current.scrollToEnd({ animated: true });
            }}
            onLayout={() => {
              if (isAtBottom) flatListRef.current.scrollToEnd({ animated: false });
            }}
          />

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

// --- Styles ---
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 45, paddingBottom: 15, paddingHorizontal: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  userInitial: { fontSize: 18, color: '#4CAF50', fontWeight: 'bold' },
  userImage: { width: 40, height: 40, borderRadius: 20 },
  menuButton: { padding: 6, borderRadius: 9 },
  messagesList: { padding: 16, marginTop: 10 },
  messageContainer: { maxWidth: '75%', marginBottom: 12, borderRadius: 16, padding: 12 },
  userMessage: { alignSelf: 'flex-end' },
  aiMessage: { alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  messageImage: { width: 200, height: 150, borderRadius: 12, marginTop: 8 },
  audioButton: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, borderTopWidth: 2, borderColor: '#ddd', backgroundColor: 'white', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 },
  textInput: { flex: 1, maxHeight: 120, borderWidth: 1, borderColor: '#ccc', borderRadius: 35, paddingHorizontal: 18, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff', marginHorizontal: 6 },
  sendButton: { backgroundColor: '#4CAF50', borderRadius: 28, paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  icon: { marginHorizontal: 6 },
  welcomeText: { fontSize: 20, fontWeight: 'bold' },
  weatherText: { fontSize: 16, marginLeft: 8, fontWeight: '600' },
  sidebar: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 260, padding: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 10, zIndex: 7 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sidebarAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  sidebarAvatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  sidebarAvatarText: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  sidebarUserName: { fontSize: 16, fontWeight: 'bold' },
  sidebarUserStatus: { fontSize: 13 },
  sidebarDivider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  sidebarTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  historyItemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  historyItem: { fontSize: 14 },
  noHistory: { fontSize: 14, fontStyle: 'italic' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingVertical: 10, backgroundColor: '#4CAF50', borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  sidebarButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: '#4CAF50',
  borderRadius: 8,
},
sidebarButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

