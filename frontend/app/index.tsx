import React from "react";
import { ScrollView, View, Linking } from "react-native";
import { Card, Text, Button, Divider, List } from "react-native-paper";

// example data
const data = {
  verdict: "Switch to Generic & Save!",
  total_savings: 58.2,
  generic_name: "Atorvastatin (Generic)",
  out_of_pocket: 82.0,
  generic_cost: 23.8,
  provincial_program: "Ontario Trillium Benefit",
  provincial_link:
    "https://www.ontario.ca/page/get-help-high-prescription-drug-costs",
};

export default function BenefitDashboard() {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* HERO VERDICT */}
      <Text
        variant="headlineMedium"
        className="text-center font-bold text-indigo-900 mb-2"
      >
        {data.verdict}
      </Text>

      {/* TOTAL SAVINGS BUBBLE */}
      <View className="bg-green-100 self-center px-6 py-2 rounded-full mb-6 border border-green-300">
        <Text className="text-green-800 font-bold text-lg">
          Total Savings: ${data.total_savings}
        </Text>
      </View>

      {/* PRICE COMPARISON CARD */}
      <Card className="rounded-2xl mb-4 bg-white shadow-md">
        <Card.Content>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-slate-400 uppercase text-xs font-bold">
                Current Cost
              </Text>
              <Text
                variant="titleLarge"
                className="line-through text-slate-400"
              >
                ${data.out_of_pocket}
              </Text>
            </View>
            <View className="bg-indigo-50 p-2 rounded-lg">
              <Text className="text-indigo-600 font-bold">➔</Text>
            </View>
            <View className="items-end">
              <Text className="text-indigo-600 uppercase text-xs font-bold">
                New Cost
              </Text>
              <Text
                variant="displaySmall"
                className="text-indigo-700 font-bold"
              >
                ${data.generic_cost}
              </Text>
            </View>
          </View>

          <Divider className="mb-4" />

          <List.Item
            title="Recommended Alternative"
            description={data.generic_name}
            left={(props) => (
              <List.Icon {...props} icon="pill" color="#4f46e5" />
            )}
          />
        </Card.Content>
      </Card>

      {/* PROVINCIAL PROGRAM CARD */}
      <Card className="bg-slate-900 rounded-2xl mb-6">
        <Card.Content className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-indigo-300 font-bold mb-1">
              {data.provincial_program}
            </Text>
            <Text className="text-slate-300 text-xs">
              You qualify for this program based on your province.
            </Text>
          </View>
          <Button
            mode="contained"
            buttonColor="#4f46e5"
            onPress={() => Linking.openURL(data.provincial_link)}
          >
            Apply
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
