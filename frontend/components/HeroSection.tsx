import React from "react";
import { Text } from "react-native-paper";

interface HeroSectionProps {
  displayVerdict: string;
  displaySubtitle: string;
}

export default function HeroSection({
  displayVerdict,
  displaySubtitle,
}: HeroSectionProps) {
  return (
    <>
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
    </>
  );
}
