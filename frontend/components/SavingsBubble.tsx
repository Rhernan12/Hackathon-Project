import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface SavingsBubbleProps {
  isPriceHigher: boolean;
  noSavingsFound: boolean;
  totalSavings: number;
}

export default function SavingsBubble({
  isPriceHigher,
  noSavingsFound,
  totalSavings,
}: SavingsBubbleProps) {
  if (isPriceHigher) {
    return (
      <View
        className="bg-orange-100 self-center px-6 py-2 rounded-full mb-6 border border-orange-300"
        style={{ margin: "2%" }}
      >
        <Text className="text-orange-800 font-bold text-lg text-center">
          Possible Misread
        </Text>
      </View>
    );
  }

  if (noSavingsFound) {
    return (
      <View
        className="bg-slate-200 self-center px-6 py-2 rounded-full mb-6 border border-slate-300"
        style={{ margin: "2%" }}
      >
        <Text className="text-slate-800 font-bold text-lg text-center">
          Already Best Price
        </Text>
      </View>
    );
  }

  return (
    <View
      className="bg-green-100 self-center px-6 py-2 rounded-full mb-6 border border-green-300"
      style={{ margin: "2%" }}
    >
      <Text className="text-green-800 font-bold text-lg text-center">
        Total Savings: ${Math.max(0, totalSavings).toFixed(2)}
      </Text>
    </View>
  );
}
