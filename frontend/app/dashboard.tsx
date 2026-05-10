import React, { useMemo } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AnalysisData } from "../types/types";
import DashboardError from "../components/DashboardError";
import HeroSection from "../components/HeroSection";
import SavingsBubble from "../components/SavingsBubble";
import PriceComparisonCard from "../components/PriceComparisonCard";
import ProvincialProgramCard from "../components/ProvincialProgramCard";

export default function BenefitDashboard() {
  const { result } = useLocalSearchParams();
  const router = useRouter();

  const parsedData = useMemo<AnalysisData | null>(() => {
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
      <DashboardError
        type="missing"
        onAction={() => router.replace("/action")}
      />
    );
  }

  if (parsedData.error) {
    return (
      <DashboardError
        type="error"
        message={parsedData.message}
        onAction={() => router.replace("/action")}
      />
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
  const didSaveMoney = totalSavings > 0;

  const displayVerdict = isPriceHigher ? "Please Verify Receipt" : verdict;
  const displaySubtitle = isPriceHigher
    ? "The suggested alternative is more expensive than your current cost. This usually happens if the AI misread the receipt. Please try scanning it again."
    : subtitle;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 p-4">
        <HeroSection
          displayVerdict={displayVerdict}
          displaySubtitle={displaySubtitle}
        />

        <SavingsBubble
          isPriceHigher={isPriceHigher}
          noSavingsFound={noSavingsFound}
          totalSavings={totalSavings}
        />

        <PriceComparisonCard
          isPriceHigher={isPriceHigher}
          noSavingsFound={noSavingsFound}
          currentCost={currentCost}
          newCost={newCost}
          genericName={genericName}
        />

        {parsedData.provincial_covered && (
          <ProvincialProgramCard
            programName={programName}
            programLink={programLink}
          />
        )}

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
