import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function ActionTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    console.log(inputText);
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center p-4">
        <Text className="text-center mb-4 font-bold text-slate-800">
          We need camera access to scan the environment.
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      // Take the photo and get the local URI
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, // Compress slightly for faster Python API processing later
        base64: true, // Useful to send the raw image data to the backend
      });
      setCapturedPhoto(photo.uri);
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4 flex-1 gap-4">
        <Card className="rounded-xl overflow-hidden shadow-sm">
          <Card.Title title="Action Menu" subtitle="System Ready" />
          <Card.Content className="gap-2">
            <View
              style={{
                height: 320,
                width: "100%",
                backgroundColor: "black",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* If we have a photo, show it. Otherwise, show the live camera feed. */}
              {capturedPhoto ? (
                <Image
                  source={{ uri: capturedPhoto }}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <CameraView
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  facing="back"
                  ref={cameraRef}
                />
              )}
            </View>
          </Card.Content>
          <Card.Actions className="mt-2">
            {capturedPhoto && (
              <Button mode="text" onPress={retakePicture} className="mr-2">
                Retake
              </Button>
            )}
            {capturedPhoto ? (
              <Button
                mode="contained"
                onPress={() =>
                  console.log("Ready to send to Python/MedGemma backend!")
                }
              >
                Analyze Image
              </Button>
            ) : (
              <Button
                mode="contained"
                icon="camera"
                onPress={takePicture}
                className="w-full py-1"
              >
                Capture Target
              </Button>
            )}
          </Card.Actions>
          <Card.Content className="gap-2">
            <Text variant="bodyMedium" className="text-slate-600 mb-2">
              Enter text input
            </Text>

            <TextInput
              mode="outlined"
              label="Input Data"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
              className="bg-white"
            />
          </Card.Content>
          <Card.Actions className="mt-2">
            <Button mode="text" onPress={() => setInputText("")}>
              Clear
            </Button>

            <Button mode="contained" onPress={handleSend}>
              Send
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </KeyboardAwareScrollView>
  );
}
