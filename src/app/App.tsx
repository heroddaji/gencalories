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
import { homeOutline, personOutline } from "ionicons/icons";
import { createWebAppContainer } from "@/app/bootstrap/createWebAppContainer";
import { FoodEntryPage } from "@/features/food-entry/presentation/FoodEntryPage";
import { ProfilePage } from "@/features/user-profile-goals/presentation/ProfilePage";

setupIonicReact();

export const App = (): JSX.Element => {
  const container = useMemo(() => createWebAppContainer(), []);
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>GenCalories</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {activeTab === "home" ? (
            <FoodEntryPage container={container} />
          ) : (
            <ProfilePage container={container} />
          )}
        </IonContent>

        <IonFooter>
          <IonTabBar selectedTab={activeTab}>
            <IonTabButton tab="home" onClick={() => setActiveTab("home")}>
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
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
