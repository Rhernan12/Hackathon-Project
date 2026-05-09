import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Card,
  Text,
  TextInput,
  SegmentedButtons,
  Dialog,
  Portal,
} from "react-native-paper";

interface UserDocument {
  label?: string;
  pictures: string[];
}

export default function ActionTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoBatch, setPhotoBatch] = useState<string[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [province, setProvince] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

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
          We need camera access to scan your documents.
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
        // quality: 0.7, // Compress slightly for faster Python API processing later
        base64: true, // Useful to send the raw image data to the backend
      });
      setPhotoBatch((prev) => [...prev, photo.uri]);
    }
  };

  const clearBatch = () => {
    setPhotoBatch([]);
  };

  const handleConfirmLabel = () => {
    if (!province) {
      Alert.alert(
        "Missing Information",
        "Please select a province before confirming.",
      );
      return;
    }

    const newDoc: UserDocument = {
      label: userLabel,
      pictures: [...photoBatch],
    };
    setDocuments((prev) => [...prev, newDoc]);
    setDialogVisible(true);
  };

  const handleAddAnother = () => {
    setDialogVisible(false);
    setPhotoBatch([]);
    setUserLabel("");
  };

  const handleSendAll = () => {
    setDialogVisible(false);
    console.log(`Ready to send ${documents.length} documents`);

    // Create the structured object for your backend
    const payload = {
      province,
      documents,
    };

    // Convert it to a JSON string
    const jsonPayload = JSON.stringify(payload, null, 2);
    console.log("Ready to send payload to backend:\n", jsonPayload);

    // TODO: Add your fetch or axios request here
    // e.g. fetch('https://api.yourdomain.com/upload', { method: 'POST', body: jsonPayload })

    // Clear out the state after sending
    setDocuments([]);
    setProvince("");
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      enableOnAndroid={true}
      extraScrollHeight={80}
      viewIsInsideTabBar={true}
      keyboardShouldPersistTaps="handled"
    >
      {/*PROVINCE SELECTOR SECTION*/}
      <Card.Content
        className="p-4 bg-white border-b border-slate-200"
        style={{ marginTop: "5%" }}
      >
        <Text
          variant="bodyMedium"
          className="mb-3 text-slate-500 uppercase tracking-wider"
        >
          Select Your Province *
        </Text>
        <SegmentedButtons
          value={province}
          onValueChange={setProvince}
          buttons={[
            { value: "ON", label: "ON" },
            { value: "QC", label: "QC" },
            { value: "BC", label: "BC" },
            { value: "Other", label: "Other" },
          ]}
        />
      </Card.Content>

      {/*Document Scanning Section*/}

      <Card.Title title="Scan documents one at a time" />
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
          <CameraView
            style={{ flex: 1, width: "100%", height: "100%" }}
            facing="back"
            ref={cameraRef}
          />
        </View>
        {photoBatch.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2 flex-row"
            style={{ marginTop: "2%" }}
          >
            {photoBatch.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: 64,
                  height: 64,
                  marginRight: 8,
                  borderRadius: 8,
                }}
              />
            ))}
          </ScrollView>
        )}
      </Card.Content>
      <Card.Actions className="mt-2 flex-wrap">
        {photoBatch.length > 0 && (
          <Button mode="text" onPress={clearBatch} className="mr-2">
            Clear Photos
          </Button>
        )}

        <Button
          mode="contained"
          icon="camera"
          onPress={takePicture}
          className={photoBatch.length === 0 ? "w-full py-1" : ""}
        >
          Capture
        </Button>
      </Card.Actions>

      {/*Photo Label Section*/}

      <Card.Content className="gap-2">
        <Text variant="bodyMedium" className="text-slate-600 mb-2">
          Label Pictures (Optional)
        </Text>

        <TextInput
          mode="outlined"
          label="e.g. Drug Receipt, Insurance Benefits"
          value={userLabel}
          onChangeText={setUserLabel}
          multiline
          numberOfLines={4}
          className="bg-white"
        />
      </Card.Content>
      <Card.Actions className="mt-2">
        <Button mode="text" onPress={() => setUserLabel("")}>
          Clear
        </Button>

        {photoBatch.length > 0 && (
          <Button
            mode="contained"
            onPress={handleConfirmLabel}
            className="mr-2"
          >
            Confirm Label
          </Button>
        )}
      </Card.Actions>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Document Added</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The document has been successfully added. Add another document or
              click Send All to continue.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleAddAnother}>Add Another</Button>
            <Button mode="contained" onPress={handleSendAll}>
              Send All
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAwareScrollView>
  );
}
