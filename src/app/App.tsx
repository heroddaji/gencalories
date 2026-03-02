import { IonApp, setupIonicReact } from "@ionic/react";
import { useMemo } from "react";
import { createWebAppContainer } from "@/app/bootstrap/createWebAppContainer";
import { FoodEntryPage } from "@/features/food-entry/presentation/FoodEntryPage";

setupIonicReact();

export const App = (): JSX.Element => {
  const container = useMemo(() => createWebAppContainer(), []);

  return (
    <IonApp>
      <FoodEntryPage container={container} />
    </IonApp>
  );
};
