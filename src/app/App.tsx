import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { useMemo, useState } from "react";
import { barChartOutline, homeOutline, personOutline } from "ionicons/icons";
import { Capacitor } from "@capacitor/core";
import { createMobileAppContainer } from "@/app/bootstrap/createMobileAppContainer";
import { createWebAppContainer } from "@/app/bootstrap/createWebAppContainer";
import { SummaryPage } from "@/features/daily-summary/presentation/SummaryPage";
import { FoodEntryPage } from "@/features/food-entry/presentation/FoodEntryPage";
import { ProfilePage } from "@/features/user-profile-goals/presentation/ProfilePage";

setupIonicReact();

export const App = (): React.ReactElement => {
  const container = useMemo(
    () =>
      Capacitor.isNativePlatform() ? createMobileAppContainer() : createWebAppContainer(),
    [],
  );
  const [activeTab, setActiveTab] = useState<"home" | "summary" | "profile">("home");

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>GenCalories</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="app-content">
            {activeTab === "home" ? (
              <FoodEntryPage container={container} />
            ) : activeTab === "summary" ? (
              <SummaryPage container={container} />
            ) : (
              <ProfilePage container={container} />
            )}
          </div>
        </IonContent>

        <IonFooter>
          <IonTabBar selectedTab={activeTab}>
            <IonTabButton tab="home" onClick={() => setActiveTab("home")}>
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="summary" onClick={() => setActiveTab("summary")}>
              <IonIcon icon={barChartOutline} />
              <IonLabel>Summary</IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" onClick={() => setActiveTab("profile")}>
              <IonIcon icon={personOutline} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonFooter>
      </IonPage>
    </IonApp>
  );
};
