// import { Outlet } from "react-router-dom";
// import NotFoundPage from "../pages/404Page";
// import { useSession } from "../context/SessionContext";

// const AuthProtectedRoute = () => {
//   const { session } = useSession();
//   if (!session) {
//     // or you can redirect to a different page and show a message
//     return <NotFoundPage />;
//   }
//   return <Outlet />;
// };

// export default AuthProtectedRoute;
// File: src/router/AuthProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const AuthProtectedRoute = () => {
  const { session } = useSession();

  if (!session) {
    // Redirect unauthenticated users to /sign-in
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
