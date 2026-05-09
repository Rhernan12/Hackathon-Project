import React, { useMemo } from "react";
import { ScrollView, View, Linking, Dimensions } from "react-native";
import { Card, Text, Button, Divider, List } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BenefitDashboard() {
  const { result } = useLocalSearchParams();
  const router = useRouter();

  const parsedData = useMemo(() => {
    if (!result) return null;
    try {
      return JSON.parse(result as string);
    } catch (e) {
      console.error("Failed to parse result", e);
      return null;
    }
  }, [result]);

  if (!parsedData) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-4">
        <Text className="text-slate-500 font-bold mb-4 text-center">
          No analysis data found. Please scan a document first.
        </Text>
        <Button mode="contained" onPress={() => router.replace("/action")}>
          Go to Scanner
        </Button>
      </View>
    );
  }

  if (parsedData.error) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-4 gap-4">
        <Text className="text-red-600 font-bold text-xl text-center">
          Analysis Issue
        </Text>
        <Text className="text-slate-600 text-center">{parsedData.message}</Text>
        <Button mode="contained" onPress={() => router.replace("/action")}>
          Try Again
        </Button>
      </View>
    );
  }

  // Backend data mapping with safe fallbacks
  const verdict = parsedData.verdict || "Analysis Complete";
  const subtitle = parsedData.message || "";
  const totalSavings = Number(parsedData.total_savings) || 0;
  const currentCost =
    parsedData.out_of_pocket !== undefined
      ? Number(parsedData.out_of_pocket)
      : Number(parsedData.brand_cost) || 0;
  const newCost =
    parsedData.generic_cost !== undefined
      ? Number(parsedData.generic_cost)
      : Math.max(0, currentCost - totalSavings);
  const genericName =
    parsedData.generic_name || parsedData.drug_name || "Alternative Medication";
  const programName =
    parsedData.provincial_program || "Provincial Support Program";
  const programLink =
    parsedData.provincial_link ||
    "https://www.canada.ca/en/health-canada/services/health-care-system/pharmaceuticals/provincial-territorial-public-drug-benefit-programs.html";

  const didSaveMoney = totalSavings > 0;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 p-4">
        {/* HERO VERDICT */}
        <Text
          variant="headlineSmall"
          className="text-center font-bold text-indigo-900 mb-2"
        >
          {verdict}
        </Text>

        {subtitle ? (
          <Text className="text-center text-slate-600 mb-4 px-2">
            {subtitle}
          </Text>
        ) : null}

        {/* TOTAL SAVINGS BUBBLE */}
        <View className="bg-green-100 self-center px-6 py-2 rounded-full mb-6 border border-green-300">
          <Text className="text-green-800 font-bold text-lg">
            Total Savings: ${totalSavings.toFixed(2)}
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
                  ${currentCost.toFixed(2)}
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
                  ${newCost.toFixed(2)}
                </Text>
              </View>
            </View>

            <Divider className="mb-4" />

            <List.Item
              title="Recommended Alternative"
              description={genericName}
              left={(props) => (
                <List.Icon {...props} icon="pill" color="#4f46e5" />
              )}
            />
          </Card.Content>
        </Card>

        {/* PROVINCIAL PROGRAM CARD */}
        <Card
          className="bg-slate-900 rounded-2xl mb-6"
          style={{ marginTop: "5%" }}
        >
          <Card.Content className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="text-indigo-300 font-bold mb-1">
                {programName}
              </Text>
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
      </ScrollView>

      {/* CONFETTI ANIMATION */}
      {didSaveMoney && (
        <ConfettiCannon
          count={150}
          origin={{ x: Dimensions.get("window").width / 2, y: -100 }}
          fadeOut={true}
          fallSpeed={5000}
        />
      )}
    </View>
  );
}
