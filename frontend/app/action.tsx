import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import React, { useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Text, Card } from "react-native-paper";

import { UserDocument } from "../types/types";
import ProvinceSelector from "../components/ProvinceSelector";
import DocumentTypeSelector from "../components/DocumentTypeSelector";
import DocumentScanner from "../components/DocumentScanner";
import ActionDialogs from "../components/ActionDialogs";

export default function ActionTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // State
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
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  // Derived state
  const hasReceipt = documents.some((d) => d.type === "receipt");
  const hasBooklet = documents.some((d) => d.type === "booklet");

  // Logic Functions
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        setPhotoBatch((prev) => [...prev, photo.uri]);
        setPickedFile(null);
      } catch (err) {
        Alert.alert("Error", "Could not capture photo. Please try again.");
      }
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setPickedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
        });
        setPhotoBatch([]);
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

  const handleSendAll = async () => {
    if (!hasReceipt) {
      Alert.alert(
        "Receipt Required",
        "You must add a receipt before analyzing your documents.",
      );
      return;
    }

    setDialogVisible(false);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("province", province);

      documents.forEach((doc) => {
        let fileToUpload: any;
        if (doc.file) {
          fileToUpload = {
            uri: doc.file.uri,
            type: doc.file.mimeType || "application/octet-stream",
            name: doc.file.name,
          };
        } else if (doc.pictures && doc.pictures.length > 0) {
          fileToUpload = {
            uri: doc.pictures[0],
            type: "image/jpeg",
            name: `${doc.type}.jpg`,
          };
        }

        if (fileToUpload) formData.append(doc.type || "file", fileToUpload);
      });

      const response = await fetch(
        "https://scrimmage-mothproof-liberty.ngrok-free.dev/analyze",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok)
        throw new Error(`Upload failed (Status ${response.status})`);

      const resultData = await response.json();

      setDocuments([]);
      setProvince("");
      setPhotoBatch([]);
      setPickedFile(null);
      setDocType("receipt");

      router.replace({
        pathname: "/dashboard",
        params: { result: JSON.stringify(resultData) },
      });
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        "There was an error communicating with the server.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Render Permission Blocks
  if (!permission)
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <Text>Loading camera...</Text>
      </View>
    );
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

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <ProvinceSelector province={province} setProvince={setProvince} />

      <DocumentTypeSelector
        docType={docType}
        setDocType={setDocType}
        hasReceipt={hasReceipt}
        hasBooklet={hasBooklet}
      />

      {documents.length < 2 && (
        <DocumentScanner
          docType={docType}
          cameraRef={cameraRef}
          photoBatch={photoBatch}
          pickedFile={pickedFile}
          takePicture={takePicture}
          pickDocument={pickDocument}
          clearBatch={clearBatch}
          handleConfirmUpload={handleConfirmUpload}
          setPickedFile={setPickedFile}
        />
      )}

      {documents.length > 0 &&
        photoBatch.length === 0 &&
        pickedFile === null && (
          <Card.Content className="mt-4 pb-4">
            <Button
              mode="contained"
              buttonColor={hasReceipt ? "#22c55e" : undefined}
              disabled={!hasReceipt || isUploading}
              loading={isUploading}
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

      <ActionDialogs
        dialogVisible={dialogVisible}
        isUploading={isUploading}
        docType={docType}
        documentCount={documents.length}
        hasReceipt={hasReceipt}
        handleAddAnother={handleAddAnother}
        handleSendAll={handleSendAll}
      />
    </ScrollView>
  );
}
