import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
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
  const [dailyGoal, setDailyGoal] = useState("2000");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadGoal = async (): Promise<void> => {
      const goal = await container.userGoalRepository.getDailyCalorieGoal(container.userId);
      setDailyGoal(String(goal));
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
      setMessage(`Daily goal updated to ${Math.round(parsedGoal)} kcal.`);
    } catch {
      setMessage("Unable to update daily goal.");
    }
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Profile</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Daily Calorie Goal</IonLabel>
            <IonInput
              type="number"
              value={dailyGoal}
              onIonInput={(event) => {
                setDailyGoal(event.detail.value ?? "");
              }}
            />
          </IonItem>
          <IonButton expand="block" onClick={() => void handleSetGoal()}>
            Save Goal
          </IonButton>

          {message ? <p>{message}</p> : null}
        </IonCardContent>
      </IonCard>
    </>
  );
};
