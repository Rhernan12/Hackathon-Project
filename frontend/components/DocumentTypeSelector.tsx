import React from "react";
import { Card, Text, SegmentedButtons } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";

interface DocumentTypeSelectorProps {
  docType: string;
  setDocType: (value: string) => void;
  hasReceipt: boolean;
  hasBooklet: boolean;
}

export default function DocumentTypeSelector({
  docType,
  setDocType,
  hasReceipt,
  hasBooklet,
}: DocumentTypeSelectorProps) {
  return (
    <Card.Content className="p-4 bg-white border-b border-slate-200">
      <Text
        variant="bodyMedium"
        className="mb-3 text-slate-500 uppercase tracking-wider"
      >
        What are you scanning? *
      </Text>
      <SegmentedButtons
        value={docType}
        onValueChange={setDocType}
        buttons={[
          {
            value: "receipt",
            label: "Receipt (Required)",
            icon: (props) => <FontAwesome6 name="receipt" {...props} />,
            disabled: hasReceipt,
          },
          {
            value: "booklet",
            label: "Booklet (Optional)",
            icon: "book-open-variant",
            disabled: hasBooklet,
          },
        ]}
      />
    </Card.Content>
  );
}
