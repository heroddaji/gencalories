import Framework7 from "framework7/lite-bundle";
import Framework7React, {
  App,
  Link,
  Toolbar,
  View,
  Views,
} from "framework7-react";
import { DashboardPage } from "@/features/dashboard/presentation/DashboardPage";
import { DailySummaryPage } from "@/features/daily-summary/presentation/DailySummaryPage";
import { ProfilePage } from "@/features/profile/presentation/ProfilePage";
import { authService } from "@/services/auth.service";
import { firebaseService } from "@/services/firebase.service";

// init the app
Framework7.use(Framework7React);

// Sign in anonymously to Firebase for analytics purposes
firebaseService.initializeApp;
authService.signInAnonymously().then((signInResult) => {
  console.log("Signed in anonymously with signInResult:", signInResult);
});

const appParameters = {
  name: "GenCalories",
  theme: "ios" as const,
  routes: [
    {
      path: "/",
      component: DashboardPage,
    },
    {
      path: "/daily-summary/",
      component: DailySummaryPage,
    },
    {
      path: "/profile/",
      component: ProfilePage,
    },
  ],
};

export default function App2() {
  return (
    <App {...appParameters}>
      <Views tabs className="safe-areas">
        {/* 1. GLOBAL TOOLBAR: Stays at the bottom forever */}
        <Toolbar bottom tabbar>
          <Link
            tabLink="#view-dashboard"
            text="Home"
            tabLinkActive
            iconF7="house_fill"
          />
          <Link
            tabLink="#view-daily-summary"
            text="Summary"
            iconF7="chart_bar_fill"
          />
          <Link tabLink="#view-profile" text="Profile" iconF7="person_fill" />
        </Toolbar>

        <View id="view-dashboard" main tab tabActive url="/" />
        <View
          id="view-daily-summary"
          name="Summary"
          tab
          url="/daily-summary/"
        />
        <View id="view-profile" name="Profile" tab url="/profile/" />
      </Views>
    </App>
  );
}
