import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
} from "@ionic/react";
import type { ReactElement } from "react";

export interface SuggestionItemView {
  key: string;
  label: string;
  source: "history" | "catalog";
  normalizedName?: string;
  useCount?: number;
  quantity?: number;
  unit?: string;
}

interface SuggestionListProps {
  suggestions: SuggestionItemView[];
  onSelect: (suggestion: SuggestionItemView) => void;
  onDelete?: (normalizedName: string) => void;
}

export const SuggestionList = ({
  suggestions,
  onSelect,
  onDelete,
}: SuggestionListProps): ReactElement | null => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <IonList inset>
      {suggestions.map((suggestion) => (
        <IonItem
          button
          key={suggestion.key}
          onClick={() => {
            onSelect(suggestion);
          }}
        >
          <IonLabel>
            <h3>{suggestion.label}</h3>
            <p>
              {suggestion.source === "history" ? "From your history" : "From local catalog"}
              {suggestion.useCount ? ` • used ${suggestion.useCount} times` : ""}
            </p>
          </IonLabel>
          {suggestion.source === "history" && suggestion.normalizedName && onDelete ? (
            <IonButton
              slot="end"
              color="danger"
              fill="clear"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(suggestion.normalizedName as string);
              }}
            >
              delete
            </IonButton>
          ) : null}
          {suggestion.quantity && suggestion.unit ? (
            <IonNote slot="end" color="medium">
              {suggestion.quantity} {suggestion.unit}
            </IonNote>
          ) : (
            <IonText slot="end" color="medium">
              pick
            </IonText>
          )}
        </IonItem>
      ))}
    </IonList>
  );
};
