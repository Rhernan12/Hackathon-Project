import React from "react";
import { View } from "react-native";
import {
  Button,
  Text,
  Dialog,
  Portal,
  ActivityIndicator,
} from "react-native-paper";

interface ActionDialogsProps {
  dialogVisible: boolean;
  isUploading: boolean;
  docType: string;
  documentCount: number;
  hasReceipt: boolean;
  handleAddAnother: () => void;
  handleSendAll: () => void;
}

export default function ActionDialogs({
  dialogVisible,
  isUploading,
  docType,
  documentCount,
  hasReceipt,
  handleAddAnother,
  handleSendAll,
}: ActionDialogsProps) {
  return (
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
            {documentCount === 2
              ? " Both documents have been saved. You can now begin the analysis."
              : docType === "receipt"
                ? " You can now analyze it, or add an optional Benefit Booklet for better results."
                : " A receipt is required. Please add your receipt to continue."}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <View className="w-full flex-col gap-3 pb-2 px-2">
            {documentCount < 2 && (
              <Button mode="outlined" onPress={handleAddAnother} icon="plus">
                Add Another Document
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleSendAll}
              buttonColor={hasReceipt ? "#22c55e" : undefined}
              disabled={!hasReceipt || isUploading}
              loading={isUploading}
              icon="check-circle"
              style={{ marginTop: "5%" }}
            >
              Analyze Documents
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        visible={isUploading}
        dismissable={false}
        style={{ backgroundColor: "white" }}
      >
        <Dialog.Content className="items-center py-6">
          <ActivityIndicator animating={true} size="large" color="#4f46e5" />
          <Text variant="titleMedium" className="mt-4 font-bold text-slate-800">
            Analyzing Documents...
          </Text>
          <Text
            variant="bodyMedium"
            className="mt-2 text-slate-500 text-center"
          >
            Please wait while our AI processes your files.
          </Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
