import { Page, Navbar, Button } from "framework7-react";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import { useUserStore } from "@/store/userStore";

export const ProfilePage = () => {
  const { executeGoogleSignIn, executeSignOut, loading, error } =
    useGoogleSignIn();
  const user = useUserStore((state) => state.user);

  return (
    <Page name="profile">
      <Navbar title="Profile" />

      {user ? (
        <div style={{ textAlign: "center" }}>
          {user.photoUrl && (
            <img
              src={user.photoUrl}
              alt="Profile"
              style={{ width: 80, borderRadius: "50%" }}
            />
          )}
          <h3>Welcome, {user.displayName}</h3>
          <p>{user.email}</p>

          <Button onClick={executeSignOut} style={{ marginTop: "10px" }}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* STEP 1: User Action (The Click Event) */}
          <Button
            onClick={executeGoogleSignIn}
            disabled={loading}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            {loading ? "Connecting to Google..." : "Sign In With Google"}
          </Button>
        </div>
      )}
    </Page>
  );
};
