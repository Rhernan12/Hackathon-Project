import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import React, { useRef, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Text,
  SegmentedButtons,
  Dialog,
  Portal,
} from "react-native-paper";

import { FontAwesome6 } from "@expo/vector-icons";

interface UserDocument {
  label?: string;
  type?: string;
  pictures?: string[];
  file?: { uri: string; name: string; mimeType?: string };
}

export default function ActionTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoBatch, setPhotoBatch] = useState<string[]>([]);
  const [pickedFile, setPickedFile] = useState<{
    uri: string;
    name: string;
    mimeType?: string;
  } | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [province, setProvince] = useState("");
  const [docType, setDocType] = useState("receipt");
  const [dialogVisible, setDialogVisible] = useState(false);
  const router = useRouter();
  const [isUploading, setIsUploading] = React.useState(false);

  const hasReceipt = documents.some((d) => d.type === "receipt");
  const hasBooklet = documents.some((d) => d.type === "booklet");

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
      try {
        // Take the photo and get the local URI
        const photo = await cameraRef.current.takePictureAsync({
          // quality: 0.7, // Compress slightly for faster Python API processing later
          base64: true, // Useful to send the raw image data to the backend
        });
        setPhotoBatch((prev) => [...prev, photo.uri]);
        setPickedFile(null); // Clear picked file if taking a new photo
      } catch (err) {
        console.error("Failed to take picture:", err);
        Alert.alert("Error", "Could not capture photo. Please try again.");
      }
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allows any file type. You can restrict this to ["application/pdf", "application/msword", ...]
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setPickedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
        });
        setPhotoBatch([]); // Clear photos if picking a document
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const clearBatch = () => {
    setPhotoBatch([]);
    setPickedFile(null);
  };

  const handleConfirmUpload = () => {
    if (!province) {
      Alert.alert(
        "Missing Information",
        "Please select a province before confirming.",
      );
      return;
    }

    const newDoc: UserDocument = {
      type: docType,
      pictures: [...photoBatch],
      file: pickedFile ? { ...pickedFile } : undefined,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setDialogVisible(true);
  };

  const handleAddAnother = () => {
    setDialogVisible(false);
    setPhotoBatch([]);
    setPickedFile(null);
    setDocType(docType === "receipt" ? "booklet" : "receipt");
  };

  const handleSendAll = () => {
    if (!hasReceipt) {
      Alert.alert(
        "Receipt Required",
        "You must add a receipt before analyzing your documents.",
      );
      return;
    }

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
    setPhotoBatch([]);
    setPickedFile(null);
    setDocType("receipt");

    // Redirect to the dashboard to show the results
    router.replace("/");
  };

  return (
    <ScrollView className="flex-1 bg-slate-100">
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

      {/* DOCUMENT TYPE SELECTOR (NEW) */}
      <Card.Content className="p-4 bg-white border-b border-slate-200">
        <Text
          variant="bodyMedium"
          className="mb-3 text-slate-500 uppercase tracking-wider"
        >
          What are you scanning? *
        </Text>
        <SegmentedButtons
          value={docType}
          onValueChange={setDocType}
          buttons={[
            {
              value: "receipt",
              label: "Receipt (Required)",
              icon: (props) => <FontAwesome6 name="receipt" {...props} />,
              disabled: hasReceipt,
            },
            {
              value: "booklet",
              label: "Booklet (Optional)",
              icon: "book-open-variant",
              disabled: hasBooklet,
            },
          ]}
        />
      </Card.Content>

      {/* DOCUMENT SCANNING SECTION */}
      {documents.length < 2 && (
        <>
          <Card.Title
            title={`Scan or Upload ${docType === "receipt" ? "Receipt" : "Benefit Booklet"}`}
          />

          {pickedFile === null && (
            <View>
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
                    Clear
                  </Button>
                )}
                <Button
                  mode="contained"
                  icon="camera"
                  onPress={takePicture}
                  className={
                    photoBatch.length === 0 && !pickedFile ? "flex-1" : ""
                  }
                >
                  Capture
                </Button>
              </Card.Actions>

              {/* CONFIRM UPLOAD ACTIONS */}
              <Card.Actions className="mt-2 justify-end">
                {(photoBatch.length > 0 || pickedFile) && (
                  <Button
                    mode="contained"
                    buttonColor="#4f46e5"
                    onPress={handleConfirmUpload}
                    className="w-full mt-4"
                    contentStyle={{ height: 50 }}
                  >
                    Save {docType === "receipt" ? "Receipt" : "Booklet"}
                  </Button>
                )}
              </Card.Actions>
            </View>
          )}

          {/* DOCUMENT UPLOAD SECTION */}
          {photoBatch.length === 0 && pickedFile === null && (
            <Card.Content className="mt-4">
              <Button
                mode="contained-tonal"
                icon="upload"
                onPress={pickDocument}
                className="w-full"
              >
                Upload {docType === "receipt" ? "Receipt" : "Booklet"} PDF/Image
              </Button>
            </Card.Content>
          )}

          {pickedFile && (
            <View className="flex-1 justify-center items-center bg-slate-800 p-6 mx-4 rounded-xl mt-4">
              <Text className="text-white font-bold text-center text-lg mb-2">
                📄 {pickedFile.name}
              </Text>
              <Text className="text-slate-300 text-center mb-4">
                {docType === "receipt" ? "Receipt" : "Benefit Booklet"} Selected
              </Text>
              <Button
                mode="contained"
                onPress={handleConfirmUpload}
                className="w-full"
                buttonColor="#4f46e5"
              >
                Confirm File
              </Button>
              <Button
                mode="text"
                textColor="white"
                onPress={() => setPickedFile(null)}
                className="mt-2"
              >
                Cancel
              </Button>
            </View>
          )}
        </>
      )}

      {documents.length > 0 &&
        photoBatch.length === 0 &&
        pickedFile === null && (
          <Card.Content className="mt-4 pb-4">
            <Button
              mode="contained"
              buttonColor={hasReceipt ? "#22c55e" : undefined}
              disabled={!hasReceipt}
              icon="check-circle"
              onPress={handleSendAll}
              className="w-full"
              contentStyle={{ height: 50 }}
              style={{ marginTop: "5%" }}
            >
              {hasReceipt
                ? `Analyze ${documents.length} Saved Document(s)`
                : "Receipt Required to Analyze"}
            </Button>
          </Card.Content>
        )}

      {/* DIALOG PORTAL */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          dismissable={false}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title>Document Saved</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Successfully added as a {docType}.
              {documents.length === 2
                ? " Both documents have been saved. You can now begin the analysis."
                : docType === "receipt"
                  ? " You can now analyze it, or add an optional Benefit Booklet for better results."
                  : " A receipt is required. Please add your receipt to continue."}
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <View className="w-full flex-col gap-3 pb-2 px-2">
              {documents.length < 2 && (
                <Button mode="outlined" onPress={handleAddAnother} icon="plus">
                  Add Another Document
                </Button>
              )}
              <Button
                mode="contained"
                onPress={handleSendAll}
                buttonColor={hasReceipt ? "#22c55e" : undefined}
                disabled={!hasReceipt}
                icon="check-circle"
                style={{ marginTop: "5%" }}
              >
                Analyze Documents
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}
