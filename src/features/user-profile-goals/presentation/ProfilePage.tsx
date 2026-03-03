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
import {
  bmiScalePosition,
  bmiStatusLabel,
  calculateBmi,
  isHealthyBmi,
} from "@/features/user-profile-goals/domain/bmi";
import type { UserProfile } from "@/shared/types/core";

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
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [currentWeightKg, setCurrentWeightKg] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfileData = async (): Promise<void> => {
      const [goal, profile] = await Promise.all([
        container.userGoalRepository.getDailyCalorieGoal(container.userId),
        container.userProfileRepository.getProfile(container.userId),
      ]);

      setCurrentGoal(goal);
      setDailyGoal(goal === null ? "" : String(goal));

      setAge(profile.age === null ? "" : String(profile.age));
      setHeightCm(profile.heightCm === null ? "" : String(profile.heightCm));
      setCurrentWeightKg(profile.currentWeightKg === null ? "" : String(profile.currentWeightKg));
      setTargetWeightKg(profile.targetWeightKg === null ? "" : String(profile.targetWeightKg));
    };

    void loadProfileData();
  }, [container]);

  const handleSetGoal = async (): Promise<void> => {
    const parsedGoal = parsePositiveNumber(dailyGoal);
    if (!parsedGoal) {
      setMessage("Daily goal must be a positive number.");
      return;
    }

    const profile: UserProfile = {
      age: parsePositiveNumber(age),
      heightCm: parsePositiveNumber(heightCm),
      currentWeightKg: parsePositiveNumber(currentWeightKg),
      targetWeightKg: parsePositiveNumber(targetWeightKg),
    };

    try {
      await Promise.all([
        container.setDailyGoalUseCase.execute(container.userId, parsedGoal),
        container.saveUserProfileUseCase.execute(container.userId, profile),
      ]);

      setCurrentGoal(Math.round(parsedGoal));
      setMessage("Profile and daily goal saved.");
    } catch {
      setMessage("Unable to save profile.");
    }
  };

  const currentBmi = calculateBmi(
    parsePositiveNumber(currentWeightKg),
    parsePositiveNumber(heightCm),
  );
  const targetBmi = calculateBmi(
    parsePositiveNumber(targetWeightKg),
    parsePositiveNumber(heightCm),
  );
  const currentBmiPosition = bmiScalePosition(currentBmi);
  const targetBmiPosition = bmiScalePosition(targetBmi);
  const currentHealthy = isHealthyBmi(currentBmi);
  const targetHealthy = isHealthyBmi(targetBmi);

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
          <IonLabel position="stacked">Age</IonLabel>
          <IonInput
            type="number"
            value={age}
            placeholder="e.g. 30"
            onIonInput={(event) => {
              setAge(event.detail.value ?? "");
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Height (cm)</IonLabel>
          <IonInput
            type="number"
            value={heightCm}
            placeholder="e.g. 170"
            onIonInput={(event) => {
              setHeightCm(event.detail.value ?? "");
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Current Weight (kg)</IonLabel>
          <IonInput
            type="number"
            value={currentWeightKg}
            placeholder="e.g. 70"
            onIonInput={(event) => {
              setCurrentWeightKg(event.detail.value ?? "");
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Target Weight (kg)</IonLabel>
          <IonInput
            type="number"
            value={targetWeightKg}
            placeholder="e.g. 65"
            onIonInput={(event) => {
              setTargetWeightKg(event.detail.value ?? "");
            }}
          />
        </IonItem>

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

        <div className="bmi-summary-grid">
          <div>
            <small>Current BMI</small>
            <p>
              <strong>{currentBmi ?? "--"}</strong> ({bmiStatusLabel(currentBmi)})
            </p>
            <IonText color={currentHealthy ? "success" : "warning"}>
              <small>
                {currentHealthy === null
                  ? "Add height + weight"
                  : currentHealthy
                    ? "In healthy range"
                    : "Outside healthy range"}
              </small>
            </IonText>
          </div>
          <div>
            <small>Target BMI</small>
            <p>
              <strong>{targetBmi ?? "--"}</strong> ({bmiStatusLabel(targetBmi)})
            </p>
            <IonText color={targetHealthy ? "success" : "warning"}>
              <small>
                {targetHealthy === null
                  ? "Add target weight"
                  : targetHealthy
                    ? "Healthy target"
                    : "Review target"}
              </small>
            </IonText>
          </div>
        </div>

        <div className="bmi-scale" aria-label="BMI visualization">
          <div className="bmi-healthy-band" />
          {currentBmiPosition !== null ? (
            <div className="bmi-marker current" style={{ left: `${currentBmiPosition}%` }}>
              C
            </div>
          ) : null}
          {targetBmiPosition !== null ? (
            <div className="bmi-marker target" style={{ left: `${targetBmiPosition}%` }}>
              T
            </div>
          ) : null}
        </div>

        <IonButton expand="block" onClick={() => void handleSetGoal()}>
          Save Profile
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
