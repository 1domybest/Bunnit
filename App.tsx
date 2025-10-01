/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {ThemeProvider} from "./src/context/theme/ThemeContext.tsx";
import RootNavigator from "./src/navigation/RootNavigator.tsx";
import {GestureHandlerRootView} from "react-native-gesture-handler";

function App() {

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
              <SafeAreaProvider>
                  <RootNavigator/>
              </SafeAreaProvider>
          </ThemeProvider>
      </GestureHandlerRootView>

  );
}

export default App;
