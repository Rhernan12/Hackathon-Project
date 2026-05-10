import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";

interface DashboardErrorProps {
  type: "missing" | "error";
  message?: string;
  onAction: () => void;
}

export default function DashboardError({
  type,
  message,
  onAction,
}: DashboardErrorProps) {
  if (type === "missing") {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-4">
        <Text className="text-slate-500 font-bold mb-4 text-center">
          No analysis data found. Please scan a document first.
        </Text>
        <Button mode="contained" onPress={onAction}>
          Go to Scanner
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 justify-center items-center p-4 gap-4">
      <Text className="text-red-600 font-bold text-xl text-center">
        Analysis Issue
      </Text>
      <Text className="text-slate-600 text-center">{message}</Text>
      <Button mode="contained" onPress={onAction}>
        Try Again
      </Button>
    </View>
  );
}
