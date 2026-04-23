import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";

import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/Dashboard/Home";
import UserList from "./pages/UserList/UserList";
import GiftingManager from "./pages/Gifting/GiftingManager";
import EmojiManager from "./pages/Emoji/EmojiManager";
import IdEntryManager from "./pages/IdEntry/IdEntryManager";
import FrameManager from "./pages/Frame/FrameManager";
import CoinManager from "./pages/CoinManage/CoinManager";
import LevelBadgeManager from "./pages/LevelBadgeManage/LevelBadgeManager";
import AgencyManager from "./pages/Agency/AgencyManager";
import AgencyDetails from "./pages/Agency/AgencyDetails";
import ThemeManager from "./pages/ThemeManager/ThemeManager";
import RoomSkinManager from "./pages/RoomThemeManage/RoomSkinManager";
import AboutUsManager from "./pages/AboutUs/AboutUsManager";
import LiveModerator from "./pages/BoardManager/LiveModerator";
import AudioRoomList from "./pages/BoardManager/AudioBoard/AudioRoomList";
import VideoLiveList from "./pages/BoardManager/VideoBoard/VideoLiveList";
import Support from "./pages/Support/Support";;
import { useAuth } from "./lib/AuthProvider";
import SignIn from "./AuthPage/SignIn";
import { ProtectedRoute, ROLES } from "./routes/ProtectedRoute";
import AdminManagement from "./pages/AdminManagement/AdminManagement";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              
              <Route path="/admin-management" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN]}>
                  <AdminManagement />
                </ProtectedRoute>
              } />

              <Route path="/users" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <UserList />
                </ProtectedRoute>
              } />

              <Route path="/gifts" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <GiftingManager />
                </ProtectedRoute>
              } />

              <Route path="/emojis" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <EmojiManager />
                </ProtectedRoute>
              } />

              <Route path="/id-entry" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <IdEntryManager />
                </ProtectedRoute>
              } />

              <Route path="/frames" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <FrameManager />
                </ProtectedRoute>
              } />

              <Route path="/Coin-manage" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.RESELLER]}>
                  <CoinManager />
                </ProtectedRoute>
              } />

              <Route path="/level-badge-manage" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <LevelBadgeManager />
                </ProtectedRoute>
              } />

              <Route path="/room-skins" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <RoomSkinManager />
                </ProtectedRoute>
              } />

              <Route path="/agencies" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <AgencyManager />
                </ProtectedRoute>
              } />

              <Route path="/agency/:id" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.AGENCY]}>
                  <AgencyDetails />
                </ProtectedRoute>
              } />

              <Route path="/theme-upload" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <ThemeManager />
                </ProtectedRoute>
              } />

              <Route path="/about-us" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <AboutUsManager />
                </ProtectedRoute>
              } />

              <Route path="/audio-board" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <AudioRoomList />
                </ProtectedRoute>
              } />

              <Route path="/video-board" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <VideoLiveList />
                </ProtectedRoute>
              } />

              <Route path="/live-moderate/:mode/:roomId" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                  <LiveModerator />
                </ProtectedRoute>
              } />

              <Route path="/support" element={
                <ProtectedRoute allowedRoles={[ROLES.MOTHER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.AGENCY, ROLES.RESELLER]}>
                  <Support />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="/signin" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
}