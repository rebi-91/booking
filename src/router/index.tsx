
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import ServicePage from "../pages/auth/ServicePage.tsx";
import BookingPage from "../pages/auth/BookingPage.tsx"; 
import BookAppointment from "../pages/auth/BookAppointment.tsx"; 
import SignInPage from "../pages/auth/SignInPage.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";
import PickSchoolPage from "../pages/auth/PickSchoolPage.tsx";

import ProtectedPage from "../pages/ProtectedPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../Providers.tsx";
//ADMIN
import StudentForm from "../pages/admin/StudentForm.tsx";
import StudentFee from "../pages/admin/StudentFee.tsx";
import DashBoard from "../pages/admin/DashBoard.tsx";
import GradeDashboard from "../pages/admin/GradeDashboard.tsx";
import StaffAttendance from "../pages/admin/StaffAttendance.tsx";
//STUDENT
import StudentPage from "../pages/student/StudentPage.tsx";
import StudentGrade from "../pages/student/StudentGrade.tsx";
//TEACHER
import AttendancePage from "../pages/teacher/AttendancePage.tsx";
import TeacherDashboard from "../pages/teacher/TeacherDashboard.tsx";
import ProgressGraph from "../pages/student/ProgressGraph.tsx";
import TotalAverage from "../pages/student/TotalAverage.tsx";
import StudentFeeGraph from "../pages/student/StudentFeeGraph.tsx";
import StaffPage from "../pages/teacher/StaffPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      //AUTH
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/services",
        element: <ServicePage />,
      },
      {
        path: "/book/:id",
        element: <BookingPage />,
      },
      {
        path: "/book",
        element: <BookAppointment />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/pick-school",
        element: <PickSchoolPage />,
      },
     
      //ADMIN
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/dashboard2",
        element: <GradeDashboard />,
      },
      {
        path: "/dashboard3",
        element: <StudentForm />,
      },
      {
        path: "/dashboard4",
        element: <StudentFee />,
      },
      {
        path: "/dash5",
        element: <StaffAttendance />,
      },
      //STUDENT
      {
        path: "/student",
        element: <StudentPage />,
      },
      {
        path: "/grade",
        element: <StudentGrade />,
      },
      {
        path: "/progress-graph",
        element: <ProgressGraph />,
      },
      {
        path: "/total-average",
        element: <TotalAverage />,
      },
      {
        path: "/student-fee",
        element: <StudentFeeGraph />,
      },
      //TEACHER
      {
        path: "/attendance",
        element: <AttendancePage />,
      },
      {
        path: "/teacherdashboard",
        element: <TeacherDashboard />,
      },
      {
        path: "/my-attendance",
        element: <StaffPage />,
      },
      
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <ProtectedPage />,
          },
          
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
