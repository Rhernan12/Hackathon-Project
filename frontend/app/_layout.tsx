import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  MD3LightTheme,
  PaperProvider,
  configureFonts,
} from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const baseFont = {
  fontFamily: "Poppins-Regular",
} as const;

const customTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: baseFont }),
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6366f1",
    secondary: "#14b8a6",
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <PaperProvider theme={customTheme}>
      <Stack
        initialRouteName="action"
        screenOptions={{
          headerStyle: { backgroundColor: "#6366f1" },
          headerTitleStyle: { fontFamily: "Poppins-Medium" },
          headerTintColor: "#ffffff",
        }}
      >
        <Stack.Screen name="action" options={{ title: "Scan Documents" }} />
        <Stack.Screen name="dashboard" options={{ title: "Results" }} />
      </Stack>
    </PaperProvider>
  );
}
