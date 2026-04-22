import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
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

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/users" element={<UserList />} />
            <Route path="/gifts" element={<GiftingManager />} />
            <Route path="/emojis" element={<EmojiManager />} />
            <Route path="/id-entry" element={<IdEntryManager />} />
            <Route path="/frames" element={<FrameManager />} />
            <Route path="/Coin-manage" element={<CoinManager />} />
            <Route path="/level-badge-manage" element={<LevelBadgeManager />} />
            <Route path="/room-skins" element={<RoomSkinManager />} />
            <Route path="/agencies" element={<AgencyManager />} />
            <Route path="/agency/:id" element={<AgencyDetails />} />
            <Route path="/theme-upload" element={<ThemeManager />} />
            <Route path="/about-us" element={<AboutUsManager />} />
            
            <Route path="/audio-board" element={<AudioRoomList />} />
            <Route path="/video-board" element={<VideoLiveList />} />
            <Route
              path="/live-moderate/:mode/:roomId"
              element={<LiveModerator />}
            />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
