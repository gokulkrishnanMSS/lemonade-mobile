/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Music from './src/modules/music/Music';

function App() {
  return (
    <SafeAreaProvider>
      {/* Every screen uses the dark theme */}
      <StatusBar barStyle="light-content" />
      {/* Home is the start screen for now; the login page (src/modules/login/pages/Login.tsx) is not wired in. */}
      <Music />
    </SafeAreaProvider>
  );
}

export default App;
