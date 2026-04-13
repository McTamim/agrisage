# AgriSage App - Task Plan (NPP TBD)

## Status: Awaiting "NPP" clarification

### Approved Steps (after user confirmation):

**Phase 1: Bug Fixes & Structure (Priority)**
- [ ] Fix App.js navigation: Add proper Market screen route
- [ ] Fix parametre.js: Add global Context for user/darkMode state
- [ ] Remove duplicate screens/Agrisagescreen.js
- [ ] Implement proper logout (clear AsyncStorage)
- [ ] Test: `npx expo start` (note: user typed `expo star` → correct command)

**Phase 2: Global State & Navigation**
- [ ] Create AuthContext.js (user state, login/logout)
- [ ] Create ThemeContext.js (darkMode)
- [ ] Replace Accueil sidebar hacks with Drawer/BottomTabs
- [ ] Update all screens to use Contexts

**Phase 3: NPP Feature (awaiting definition)**
- [ ] Implement NPP (Net Primary Production calculator? New screen?)
- [ ] ...

**Phase 4: Enhancements**
- [ ] Firebase Auth/Firestore (replace AsyncStorage/static data)
- [ ] Secure API keys (expo-constants)
- [ ] Error handling, offline mode
- [ ] `eas build`

**Next:** User clarification on "NPP" + approval to proceed with Phase 1
