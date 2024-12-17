// import { createBrowserRouter } from "react-router-dom";
// import HomePage from "../pages/HomePage.tsx";
// import SignInPage from "../pages/auth/SignInPage.tsx";
// import SignUpPage from "../pages/auth/SignUpPage.tsx";
// import ProtectedPage from "../pages/ProtectedPage.tsx";
// import NotFoundPage from "../pages/404Page.tsx";
// import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
// import Providers from "../Providers.tsx";
// import PickSchoolPage from "../pages/PickSchoolPage.tsx"; // Import the PickSchoolPage component

// const router = createBrowserRouter([
//   // I recommend you reflect the routes here in the pages folder
//   {
//     path: "/",
//     element: <Providers />,
//     children: [
//       // Public routes
//       {
//         path: "/",
//         element: <HomePage />,
//       },
//       {
//         path: "/auth/sign-in",
//         element: <SignInPage />,
//       },
//       {
//         path: "/auth/sign-up",
//         element: <SignUpPage />,
//       },
//       {
//         path: "/pick-school",
//         element: <PickSchoolPage />, // Add PickSchoolPage route
//       },
//       // Auth Protected routes
//       {
//         path: "/",
//         element: <AuthProtectedRoute />,
//         children: [
//           {
//             path: "/protected",
//             element: <ProtectedPage />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
// ]);

// export default router;
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
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
//STUDENT
import StudentPage from "../pages/student/StudentPage.tsx";
import StudentGrade from "../pages/student/StudentGrade.tsx";
//TEACHER
import AttendancePage from "../pages/teacher/AttendancePage.tsx";
import TeacherDashboard from "../pages/teacher/TeacherDashboard.tsx";

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
      //STUDENT
      {
        path: "/student",
        element: <StudentPage />,
      },
      {
        path: "/grade",
        element: <StudentGrade />,
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
