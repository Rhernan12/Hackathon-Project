import React from "react";
import { View, Linking } from "react-native";
import { Card, Text, Button } from "react-native-paper";

interface ProvincialProgramCardProps {
  programName: string;
  programLink: string;
}

export default function ProvincialProgramCard({
  programName,
  programLink,
}: ProvincialProgramCardProps) {
  return (
    <Card className="bg-slate-900 rounded-2xl mb-6" style={{ marginTop: "5%" }}>
      <Card.Content className="flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-indigo-300 font-bold mb-1">{programName}</Text>
          <Text className="text-slate-300 text-xs">
            You qualify for this program based on your province.
          </Text>
        </View>
        <Button
          mode="contained"
          buttonColor="#4f46e5"
          onPress={() => Linking.openURL(programLink)}
        >
          Apply
        </Button>
      </Card.Content>
    </Card>
  );
}
