import React, { RefObject } from "react";
import { View, ScrollView, Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { CameraView } from "expo-camera";

interface DocumentScannerProps {
  docType: string;
  cameraRef: any;
  photoBatch: string[];
  pickedFile: { uri: string; name: string; mimeType?: string } | null;
  takePicture: () => void;
  pickDocument: () => void;
  clearBatch: () => void;
  handleConfirmUpload: () => void;
  setPickedFile: (file: null) => void;
}

export default function DocumentScanner({
  docType,
  cameraRef,
  photoBatch,
  pickedFile,
  takePicture,
  pickDocument,
  clearBatch,
  handleConfirmUpload,
  setPickedFile,
}: DocumentScannerProps) {
  return (
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
              className={photoBatch.length === 0 && !pickedFile ? "flex-1" : ""}
            >
              Capture
            </Button>
          </Card.Actions>

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
            buttonColor="#1b13a86a"
            style={{ marginTop: "2%" }}
          >
            Cancel
          </Button>
        </View>
      )}
    </>
  );
}
