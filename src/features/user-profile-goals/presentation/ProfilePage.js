import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonItem, IonLabel, IonText, } from "@ionic/react";
import { useEffect, useState } from "react";
import { bmiScalePosition, bmiStatusLabel, calculateBmi, isHealthyBmi, } from "@/features/user-profile-goals/domain/bmi";
const parsePositiveNumber = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
};
export const ProfilePage = ({ container }) => {
    const [dailyGoal, setDailyGoal] = useState("");
    const [currentGoal, setCurrentGoal] = useState(null);
    const [age, setAge] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [currentWeightKg, setCurrentWeightKg] = useState("");
    const [targetWeightKg, setTargetWeightKg] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        const loadProfileData = async () => {
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
    const handleSetGoal = async () => {
        const parsedGoal = parsePositiveNumber(dailyGoal);
        if (!parsedGoal) {
            setMessage("Daily goal must be a positive number.");
            return;
        }
        const profile = {
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
        }
        catch {
            setMessage("Unable to save profile.");
        }
    };
    const currentBmi = calculateBmi(parsePositiveNumber(currentWeightKg), parsePositiveNumber(heightCm));
    const targetBmi = calculateBmi(parsePositiveNumber(targetWeightKg), parsePositiveNumber(heightCm));
    const currentBmiPosition = bmiScalePosition(currentBmi);
    const targetBmiPosition = bmiScalePosition(targetBmi);
    const currentHealthy = isHealthyBmi(currentBmi);
    const targetHealthy = isHealthyBmi(targetBmi);
    return (_jsxs(IonCard, { className: "profile-goal-card", children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: "Profile" }) }), _jsxs(IonCardContent, { children: [_jsx(IonText, { color: "medium", children: _jsxs("p", { children: ["Current target calories: ", _jsx("strong", { children: currentGoal ?? "Not set" })] }) }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Age" }), _jsx(IonInput, { type: "number", value: age, placeholder: "e.g. 30", onIonInput: (event) => {
                                    setAge(event.detail.value ?? "");
                                } })] }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Height (cm)" }), _jsx(IonInput, { type: "number", value: heightCm, placeholder: "e.g. 170", onIonInput: (event) => {
                                    setHeightCm(event.detail.value ?? "");
                                } })] }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Current Weight (kg)" }), _jsx(IonInput, { type: "number", value: currentWeightKg, placeholder: "e.g. 70", onIonInput: (event) => {
                                    setCurrentWeightKg(event.detail.value ?? "");
                                } })] }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Target Weight (kg)" }), _jsx(IonInput, { type: "number", value: targetWeightKg, placeholder: "e.g. 65", onIonInput: (event) => {
                                    setTargetWeightKg(event.detail.value ?? "");
                                } })] }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Daily Calorie Goal" }), _jsx(IonInput, { type: "number", value: dailyGoal, placeholder: "e.g. 2000", onIonInput: (event) => {
                                    setDailyGoal(event.detail.value ?? "");
                                } })] }), _jsxs("div", { className: "bmi-summary-grid", children: [_jsxs("div", { children: [_jsx("small", { children: "Current BMI" }), _jsxs("p", { children: [_jsx("strong", { children: currentBmi ?? "--" }), " (", bmiStatusLabel(currentBmi), ")"] }), _jsx(IonText, { color: currentHealthy ? "success" : "warning", children: _jsx("small", { children: currentHealthy === null
                                                ? "Add height + weight"
                                                : currentHealthy
                                                    ? "In healthy range"
                                                    : "Outside healthy range" }) })] }), _jsxs("div", { children: [_jsx("small", { children: "Target BMI" }), _jsxs("p", { children: [_jsx("strong", { children: targetBmi ?? "--" }), " (", bmiStatusLabel(targetBmi), ")"] }), _jsx(IonText, { color: targetHealthy ? "success" : "warning", children: _jsx("small", { children: targetHealthy === null
                                                ? "Add target weight"
                                                : targetHealthy
                                                    ? "Healthy target"
                                                    : "Review target" }) })] })] }), _jsxs("div", { className: "bmi-scale", "aria-label": "BMI visualization", children: [_jsx("div", { className: "bmi-healthy-band" }), currentBmiPosition !== null ? (_jsx("div", { className: "bmi-marker current", style: { left: `${currentBmiPosition}%` }, children: "C" })) : null, targetBmiPosition !== null ? (_jsx("div", { className: "bmi-marker target", style: { left: `${targetBmiPosition}%` }, children: "T" })) : null] }), _jsx(IonButton, { expand: "block", onClick: () => void handleSetGoal(), children: "Save Profile" }), message ? (_jsx(IonText, { color: "success", children: _jsx("p", { children: message }) })) : null] })] }));
};
