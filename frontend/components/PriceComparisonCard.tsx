import React from "react";
import { View } from "react-native";
import { Card, Text, List } from "react-native-paper";

interface PriceComparisonCardProps {
  isPriceHigher: boolean;
  noSavingsFound: boolean;
  currentCost: number;
  newCost: number;
  genericName: string;
}

export default function PriceComparisonCard({
  isPriceHigher,
  noSavingsFound,
  currentCost,
  newCost,
  genericName,
}: PriceComparisonCardProps) {
  const cardColor = isPriceHigher
    ? "#ff832B"
    : noSavingsFound
      ? "#747a7f"
      : "#22c55e";

  return (
    <Card
      className="rounded-2xl mb-4 shadow-md"
      style={{ backgroundColor: cardColor }}
    >
      <Card.Content>
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-slate-200 uppercase text-xs font-bold">
              Current Cost
            </Text>
            <Text variant="titleLarge" className="line-through text-slate-200">
              ${currentCost.toFixed(2)}
            </Text>
          </View>
          {newCost !== 0 && (
            <View className="p-2 rounded-lg">
              <View>
                <Text className="font-bold">➔</Text>
              </View>
              <View className="items-end">
                <Text className="text-white uppercase text-xs font-bold">
                  New Cost
                </Text>
                <Text variant="displaySmall" className="text-white font-bold">
                  ${newCost.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {!noSavingsFound && (
          <List.Item
            title={"Recommended Alternative"}
            description={genericName}
            left={(props) => (
              <List.Icon {...props} icon="pill" color="#4f46e5" />
            )}
          />
        )}
      </Card.Content>
    </Card>
  );
}
