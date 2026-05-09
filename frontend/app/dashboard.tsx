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

  // Check for AI misreads where the suggested price is worse
  const isPriceHigher = newCost > currentCost;
  const noSavingsFound = totalSavings <= 0;
  const displayVerdict = isPriceHigher ? "Please Verify Receipt" : verdict;
  const displaySubtitle = isPriceHigher
    ? "The suggested alternative is more expensive than your current cost. This usually happens if the AI misread the receipt. Please try scanning it again."
    : subtitle;

  const didSaveMoney = totalSavings > 0;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 p-4">
        {/* HERO VERDICT */}
        <Text
          style={{ margin: "2%" }}
          variant="headlineSmall"
          className="text-center font-bold text-indigo-900 mb-2"
        >
          {displayVerdict}
        </Text>

        {displaySubtitle ? (
          <Text
            className="text-center text-slate-600 mb-4 px-2"
            style={{ margin: "2%" }}
          >
            {displaySubtitle}
          </Text>
        ) : null}

        {/* TOTAL SAVINGS BUBBLE */}
        {isPriceHigher ? (
          <View
            className="bg-orange-100 self-center px-6 py-2 rounded-full mb-6 border border-orange-300"
            style={{ margin: "2%" }}
          >
            <Text className="text-orange-800 font-bold text-lg text-center">
              Possible Misread
            </Text>
          </View>
        ) : noSavingsFound ? (
          <View
            className="bg-slate-200 self-center px-6 py-2 rounded-full mb-6 border border-slate-300"
            style={{ margin: "2%" }}
          >
            <Text className="text-slate-800 font-bold text-lg text-center">
              Already Best Price
            </Text>
          </View>
        ) : (
          <View
            className="bg-green-100 self-center px-6 py-2 rounded-full mb-6 border border-green-300"
            style={{ margin: "2%" }}
          >
            <Text className="text-green-800 font-bold text-lg text-center">
              Total Savings: ${Math.max(0, totalSavings).toFixed(2)}
            </Text>
          </View>
        )}

        {/* PRICE COMPARISON CARD */}
        <Card
          className="rounded-2xl mb-4 shadow-md"
          style={{
            backgroundColor: isPriceHigher
              ? "#ff832B"
              : noSavingsFound
                ? "#687076"
                : "#22c55e",
          }}
        >
          <Card.Content>
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-slate-200 uppercase text-xs font-bold">
                  Current Cost
                </Text>
                <Text
                  variant="titleLarge"
                  className="line-through text-slate-200"
                >
                  ${currentCost.toFixed(2)}
                </Text>
              </View>
              <View
                className="p-2 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
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

            <Divider
              className="mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            />

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

        {/* PROVINCIAL PROGRAM CARD */}
        {parsedData.provincial_covered && (
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
        )}

        {/* SCAN ANOTHER BUTTON */}
        <Button
          mode="outlined"
          icon="camera"
          onPress={() => router.replace("/action")}
          className="mb-8 border-indigo-600"
          textColor="#4f46e5"
          style={{ margin: "5%" }}
        >
          Scan Another Receipt
        </Button>
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
