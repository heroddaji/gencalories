import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonApp, IonContent, IonFooter, IonHeader, IonPage, IonTabBar, IonTabButton, IonTitle, IonToolbar, IonIcon, IonLabel, setupIonicReact, } from "@ionic/react";
import { useMemo, useState } from "react";
import { barChartOutline, homeOutline, personOutline } from "ionicons/icons";
import { Capacitor } from "@capacitor/core";
import { createMobileAppContainer } from "@/app/bootstrap/createMobileAppContainer";
import { createWebAppContainer } from "@/app/bootstrap/createWebAppContainer";
import { SummaryPage } from "@/features/daily-summary/presentation/SummaryPage";
import { FoodEntryPage } from "@/features/food-entry/presentation/FoodEntryPage";
import { ProfilePage } from "@/features/user-profile-goals/presentation/ProfilePage";
setupIonicReact();
export const App = () => {
    const container = useMemo(() => Capacitor.isNativePlatform() ? createMobileAppContainer() : createWebAppContainer(), []);
    const [activeTab, setActiveTab] = useState("home");
    return (_jsx(IonApp, { children: _jsxs(IonPage, { children: [_jsx(IonHeader, { children: _jsx(IonToolbar, { children: _jsx(IonTitle, { children: "GenCalories" }) }) }), _jsx(IonContent, { className: "ion-padding", children: _jsx("div", { className: "app-content", children: activeTab === "home" ? (_jsx(FoodEntryPage, { container: container })) : activeTab === "summary" ? (_jsx(SummaryPage, { container: container })) : (_jsx(ProfilePage, { container: container })) }) }), _jsx(IonFooter, { children: _jsxs(IonTabBar, { selectedTab: activeTab, children: [_jsxs(IonTabButton, { tab: "home", onClick: () => setActiveTab("home"), children: [_jsx(IonIcon, { icon: homeOutline }), _jsx(IonLabel, { children: "Home" })] }), _jsxs(IonTabButton, { tab: "summary", onClick: () => setActiveTab("summary"), children: [_jsx(IonIcon, { icon: barChartOutline }), _jsx(IonLabel, { children: "Summary" })] }), _jsxs(IonTabButton, { tab: "profile", onClick: () => setActiveTab("profile"), children: [_jsx(IonIcon, { icon: personOutline }), _jsx(IonLabel, { children: "Profile" })] })] }) })] }) }));
};
