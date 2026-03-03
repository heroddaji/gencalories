import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import type { AppContainer } from "@/app/di/container";

interface ProfilePageProps {
  container: AppContainer;
}

const parsePositiveNumber = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const ProfilePage = ({ container }: ProfilePageProps): JSX.Element => {
  const [dailyGoal, setDailyGoal] = useState("");
  const [currentGoal, setCurrentGoal] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadGoal = async (): Promise<void> => {
      const goal = await container.userGoalRepository.getDailyCalorieGoal(container.userId);
      setCurrentGoal(goal);
      setDailyGoal(goal === null ? "" : String(goal));
    };

    void loadGoal();
  }, [container]);

  const handleSetGoal = async (): Promise<void> => {
    const parsedGoal = parsePositiveNumber(dailyGoal);
    if (!parsedGoal) {
      setMessage("Daily goal must be a positive number.");
      return;
    }

    try {
      await container.setDailyGoalUseCase.execute(container.userId, parsedGoal);
      setCurrentGoal(Math.round(parsedGoal));
      setMessage(`Daily goal updated to ${Math.round(parsedGoal)} kcal.`);
    } catch {
      setMessage("Unable to update daily goal.");
    }
  };

  return (
    <IonCard className="profile-goal-card">
      <IonCardHeader>
        <IonCardTitle>Profile</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText color="medium">
          <p>
            Current target calories: <strong>{currentGoal ?? "Not set"}</strong>
          </p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Daily Calorie Goal</IonLabel>
          <IonInput
            type="number"
            value={dailyGoal}
            placeholder="e.g. 2000"
            onIonInput={(event) => {
              setDailyGoal(event.detail.value ?? "");
            }}
          />
        </IonItem>
        <IonButton expand="block" onClick={() => void handleSetGoal()}>
          Save Goal
        </IonButton>

        {message ? (
          <IonText color="success">
            <p>{message}</p>
          </IonText>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
};
