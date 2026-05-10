import React from "react";
import { Card, Text, SegmentedButtons } from "react-native-paper";

interface ProvinceSelectorProps {
  province: string;
  setProvince: (value: string) => void;
}

export default function ProvinceSelector({
  province,
  setProvince,
}: ProvinceSelectorProps) {
  return (
    <Card.Content
      className="p-4 bg-white border-b border-slate-200"
      style={{ marginTop: "5%" }}
    >
      <Text
        variant="bodyMedium"
        className="mb-3 text-slate-500 uppercase tracking-wider"
      >
        Select Your Province *
      </Text>
      <SegmentedButtons
        value={province}
        onValueChange={setProvince}
        buttons={[
          { value: "ON", label: "ON" },
          { value: "QC", label: "QC" },
          { value: "BC", label: "BC" },
          { value: "Other", label: "Other" },
        ]}
      />
    </Card.Content>
  );
}
