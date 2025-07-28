// // src/router/index.tsx
// import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';

// import Providers from '../Providers.tsx';
// import AuthProtectedRoute from './AuthProtectedRoute.tsx';

// import HomePage from '../pages/HomePage.tsx';
// import ServicePage from '../pages/auth/ServicePage.tsx';
// import BookingPage from '../pages/auth/BookingPage.tsx';
// import BookAppointment from '../pages/auth/BookAppointment.tsx';
// import SignInPage from '../pages/auth/SignInPage.tsx';
// import SignUpPage from '../pages/auth/SignUpPage.tsx';
// import PickSchoolPage from '../pages/auth/PickSchoolPage.tsx';

// // newly added pages for each service
// import TravelClinicPage from '../pages/auth/TravelClinicPage.tsx';
// import PrivateTreatmentsPage from '../pages/auth/PrivateTreatmentsPage.tsx';
// import NHSTreatmentsPage from '../pages/auth/NHSTreatmentsPage.tsx';
// import PharmacyFirstPage from '../pages/auth/PharmacyFirstPage.tsx';
// import MicrosuctionPage from '../pages/auth/MicrosuctionPage.tsx';
// import WeightLossClinicPage from '../pages/auth/WeightLossClinicPage.tsx';
// import PrivateFluPage from '../pages/auth/PrivateFluPage.tsx';
// import PeriodDelayPage from '../pages/auth/PeriodDelayPage.tsx';
// import AltitudeSicknessPage from '../pages/auth/AltitudeSicknessPage.tsx';
// import VitaminB12Page from '../pages/auth/VitaminB12Page.tsx';
// import HairLossPage from '../pages/auth/HairLossPage.tsx';
// import ChickenpoxVaccinePage from '../pages/auth/ChickenpoxVaccinePage.tsx';
// import ErectileDysfunctionPage from '../pages/auth/ErectileDysfunctionPage.tsx';
// import BloodPressureCheckPage from '../pages/auth/BloodPressureCheckPage.tsx';
// import EmergencyOral ContraceptionPage from '../pages/auth/EmergencyOral ContraceptionPage.tsx';
// import FluVaccinationPage from '../pages/auth/FluVaccinationPage.tsx';
// import CovidVaccinationPage from '../pages/auth/CovidVaccinationPage.tsx';

// // existing "weight-loss-management" pages
// import WeightlossPage from '../pages/auth/WeightlossPage.tsx';
// import WeGovyPage from '../pages/auth/WeGovyPage.tsx';
// import MounjaroPage from '../pages/auth/MounjaroPage.tsx';

// // authentication
// import LoginPage from '../pages/LoginPage.tsx';
// import ProtectedPage from '../pages/ProtectedPage.tsx';
// import NotFoundPage from '../pages/404Page.tsx';

// // admin
// import DashBoard from '../pages/admin/DashBoard.tsx';
// import GradeDashboard from '../pages/admin/GradeDashboard.tsx';
// import StudentForm from '../pages/admin/StudentForm.tsx';
// import StudentFee from '../pages/admin/StudentFee.tsx';
// import StaffAttendance from '../pages/admin/StaffAttendance.tsx';

// // student
// import StudentPage from '../pages/student/StudentPage.tsx';
// import StudentGrade from '../pages/student/StudentGrade.tsx';
// import ProgressGraph from '../pages/student/ProgressGraph.tsx';
// import TotalAverage from '../pages/student/TotalAverage.tsx';
// import StudentFeeGraph from '../pages/student/StudentFeeGraph.tsx';

// // teacher
// import AttendancePage from '../pages/teacher/AttendancePage.tsx';
// import TeacherDashboard from '../pages/teacher/TeacherDashboard.tsx';
// import StaffPage from '../pages/teacher/StaffPage.tsx';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Providers />,
//     children: [
//       // public routes
//       { path: '/', element: <HomePage /> },
//       { path: '/services', element: <ServicePage /> },
//       { path: '/travel-clinic', element: <TravelClinicPage /> },
//       { path: '/private-treatments', element: <PrivateTreatmentsPage /> },
//       { path: '/nhs-treatments', element: <NHSTreatmentsPage /> },
//       { path: '/pharmacy-first', element: <PharmacyFirstPage /> },

//       // specific service detail pages
//       { path: '/microsuction-earwax-removal', element: <MicrosuctionPage /> },
//       { path: '/weight-loss-clinic', element: <WeightLossClinicPage /> },
//       { path: '/private-flu-jab', element: <PrivateFluPage /> },
//       { path: '/period-delay', element: <PeriodDelayPage /> },
//       { path: '/altitude-sickness', element: <AltitudeSicknessPage /> },
//       { path: '/vitamin-b12-injection', element: <VitaminB12Page /> },
//       { path: '/hair-loss', element: <HairLossPage /> },
//       { path: '/chickenpox-vaccine', element: <ChickenpoxVaccinePage /> },
//       { path: '/erectile-dysfunction', element: <ErectileDysfunctionPage /> },
//       { path: '/blood-pressure-check', element: <BloodPressureCheckPage /> },
//       { path: '/emergency-Oral Contraception', element: <EmergencyOral ContraceptionPage /> },
//       { path: '/flu-vaccination', element: <FluVaccinationPage /> },
//       { path: '/covid-19-vaccination', element: <CovidVaccinationPage /> },

//       // existing weight-loss injections
//       { path: '/weight-loss-management', element: <WeightlossPage /> },
//       { path: '/wegovy', element: <WeGovyPage /> },
//       { path: '/mounjaro', element: <MounjaroPage /> },

//       // booking
//       { path: '/book/:id', element: <BookingPage /> },
//       { path: '/book', element: <BookAppointment /> },

//       // auth
//       { path: '/sign-in', element: <SignInPage /> },
//       { path: '/sign-up', element: <SignUpPage /> },
//       { path: '/pick-school', element: <PickSchoolPage /> },

//       // admin
//       { path: '/dashboard', element: <DashBoard /> },
//       { path: '/dashboard2', element: <GradeDashboard /> },
//       { path: '/dashboard3', element: <StudentForm /> },
//       { path: '/dashboard4', element: <StudentFee /> },
//       { path: '/dash5', element: <StaffAttendance /> },

//       // student
//       { path: '/student', element: <StudentPage /> },
//       { path: '/grade', element: <StudentGrade /> },
//       { path: '/progress-graph', element: <ProgressGraph /> },
//       { path: '/total-average', element: <TotalAverage /> },
//       { path: '/student-fee', element: <StudentFeeGraph /> },

//       // teacher
//       { path: '/attendance', element: <AttendancePage /> },
//       { path: '/teacherdashboard', element: <TeacherDashboard /> },
//       { path: '/my-attendance', element: <StaffPage /> },

//       // protected
//       {
//         element: <AuthProtectedRoute />,
//         children: [
//           { path: '/protected', element: <ProtectedPage /> },
//         ],
//       },
//     ],
//   },
//   { path: '*', element: <NotFoundPage /> },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import ServicePage from "../pages/auth/ServicePage.tsx";
import WeightlossPage from "../pages/auth/WeightlossPage.tsx";
import WeGovyPage from "../pages/auth/WeGovyPage.tsx";
import MounjaroPage from "../pages/auth/MounjaroPage.tsx";
import MicrosuctionPage from '../pages/auth/MicrosuctionPage.tsx';
import ContraPage from '../pages/auth/ContraPage.tsx';

import BookingPage from "../pages/auth/BookingPage.tsx"; 
import BookAppointment from "../pages/auth/BookAppointment.tsx"; 
import SignInPage from "../pages/auth/SignInPage.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";
import PickSchoolPage from "../pages/auth/PickSchoolPage.tsx";
import SetupProfilePage from "../pages/auth/SetupProfilePage.tsx";

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
import StaffLog from "../pages/teacher/StaffLog.tsx";
import BookingBoard from "../pages/teacher/BookingBoard.tsx";
import MyBooking from "../pages/teacher/MyBooking.tsx";
import EmergencySupply from "../pages/auth/EmergencySupply.tsx";
import OrderingPatientPage from "../pages/teacher/OrderPatientPage.tsx";
import OrderPage from "../pages/teacher/OrderPage.tsx";

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
        path: "/emergency-supply",
        element: <EmergencySupply />,
      },
      {
        path: "/weight-loss-management",
        element: <WeightlossPage />,
      },
      {
        path: "/wegovy",
        element: <WeGovyPage />,
      },
      {
        path: "/mounjaro",
        element: <MounjaroPage />,
      },
      {
        path: "/microsuction-earwax-removal",
        element: <MicrosuctionPage />,
      },
      {
        path: "/oral-contraceptives",
        element: <ContraPage />,
      },
      {
        path: "/book/:id",
        element: <BookingPage />,
      },
      {
        path: "/book-appointment",
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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/pick-school",
        element: <PickSchoolPage />,
      },
     
      {
        path: "/setup-profile",
        element: <SetupProfilePage />,
      },
     
      //ADMIN
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/bookings",
        element: <BookingBoard />,
      },
      {
        path: "/my-orders",
        element: <OrderingPatientPage />,
      },
      {
        path: "/my-bookings",
        element: <MyBooking />,
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
        path: "/staffattendance",
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
      {
        path: "/attendance",
        element: <StaffLog />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
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
