import "./App.css";
import MainHeader from "./Components/MainHeader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainSection from "./Components/MainSection";
import Footer from "./Components/Footer";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import TeacherInfo from "./Components/TeacherInfo";
import PeriodInfo from "./Components/PeriodInfo";
import TeachersDashboard from "./Components/TeachersDashboard";
import Subheader from "./Components/Subheader";
import EditPeriodInfo from "./Components/EditPeriodInfo";
import AdminPanel from "./Components/AdminPanel";
import Shuffling from "./Components/Shuffling";

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* //MainPage */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MainHeader />
                <MainSection />
                <Footer />
              </>
            }
          />

          {/* //Signup */}
          <Route
            path="/signup"
            element={
              <>
                <Signup />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Signin />
              </>
            }
          />

          <Route
            path="/teacherinfo"
            element={
              <>
                <TeacherInfo />
              </>
            }
          />

          <Route
            path="/periodinfo"
            element={
              <>
                <PeriodInfo />
              </>
            }
          />

          <Route
            path="teacherdashboard"
            element={
              <>
                <Subheader title="Your Dashboard" />
                <TeachersDashboard />
                <Footer />
              </>
            }
          />

          <Route
            path="/editperiodinfo"
            element={
              <>
                <EditPeriodInfo />
              </>
            }
          />
          <Route
            path="/adminpanel"
            element={
              <>
                <Subheader title="Admin Panel" />
                <AdminPanel />
                <Footer />
              </>
            }
          />
          <Route
            path="/shuffle"
            element={
              <>
                <Subheader title="Shuffle Students" />
                <Shuffling />
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
