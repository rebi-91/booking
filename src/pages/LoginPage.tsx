// // File: src/pages/HomePage.tsx

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";
// import styles from "./HomePage.module.css";

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [role, setRole] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   // Fetch the user's role; if missing or invalid, send to profile setup
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (!session?.user?.id) return;
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();

//       if (error) {
//         console.error("Error fetching role:", error.message);
//         setError("Failed to retrieve user role.");
//         navigate("/setup-profile");
//       } else {
//         const r = data.role;
//         if (r === "Patient" || r === "Staff" || r === "ADMIN") {
//           setRole(r);
//         } else {
//           navigate("/setup-profile");
//         }
//       }
//     };
//     fetchUserRole();
//   }, [session, navigate]);

//   // Sign out handler
//   const handleSignOut = async () => {
//     setStatus("Signing out...");
//     setError("");
//     try {
//       const { error: signOutError } = await supabase.auth.signOut();
//       // ignore "session missing" errors
//       if (signOutError && !signOutError.message.includes("Auth session missing")) {
//         throw signOutError;
//       }
//       navigate("/sign-in", { replace: true });
//     } catch (err: any) {
//       console.error("Sign out error:", err.message);
//       setError(err.message || "Error signing out");
//       setStatus("");
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       {/* Header with back‐home chevron and banner */}
//       <div className={styles.header}>
//         <button
//           onClick={() => navigate("/")}
//           className={styles.backButton}
//           aria-label="Go to Homepage"
//         >
//           <img
//             src="https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//backhome.png"
//             alt="Back to Home"
//           />
//         </button>
//         <img
//           src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//Unknown.jpeg"
//           alt="Coleshill Pharmacy Logo"
//           className={styles.bannerImage}
//         />
//       </div>

//       {/* Main card */}
//       <main className={styles.container}>
//         <p className={styles.subText}>
//           {session ? `Email: ${session.user.email}` : "Please sign in..."}
//         </p>

//         {session ? (
//           <button
//             onClick={handleSignOut}
//             className={styles.authButton}
//             disabled={!!status}
//           >
//             {status ? <div className={styles.loader} /> : "Sign Out"}
//           </button>
//         ) : (
//           <div className={styles.roleLinksContainer}>
//             <Link to="/sign-in" className={styles.authButton}>
//               Sign In
//             </Link>
//             <Link to="/sign-up" className={styles.authButton}>
//               Sign Up
//             </Link>
//           </div>
//         )}

//         {session && role && (
//           <div className={styles.roleLinksContainer}>
//             {role === "Patient" ? (
//               <>
//                 <Link to="/my-orders" className={styles.roleLink}>
//                   Orders
//                 </Link>
//                 <Link to="/my-bookings" className={styles.roleLink}>
//                   My Bookings
//                 </Link>
//                 <Link to="/edit-profile" className={styles.roleLink}>
//                   Edit Profile
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link to="/attendance" className={styles.roleLink}>
//                   Staff Attendance
//                 </Link>
//                 {/* <Link to="/my-attendance" className={styles.roleLink}>
//                   My Attendance
//                 </Link> */}
//                 <Link to="/bookings" className={styles.roleLink}>
//                   Bookings
//                 </Link>
//                 <Link to="/orders" className={styles.roleLink}>
//                   Orders
//                 </Link>
//               </>
//             )}
//           </div>
//         )}

//         <div className={styles.divider} />

//         {error && <p className={styles.error}>{error}</p>}
//       </main>
//     </div>
//   );
// };

// export default HomePage;
// File: src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch the user's role; if missing or invalid, send to profile setup
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching role:", error.message);
        setError("Failed to retrieve user role.");
        navigate("/setup-profile");
      } else {
        const r = data.role;
        if (r === "Patient" || r === "Staff" || r === "ADMIN") {
          setRole(r);
        } else {
          navigate("/setup-profile");
        }
      }
    };
    fetchUserRole();
  }, [session, navigate]);

  // Sign out handler
  const handleSignOut = async () => {
    setStatus("Signing out...");
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError && !signOutError.message.includes("Auth session missing")) {
        throw signOutError;
      }
      navigate("/sign-in", { replace: true });
    } catch (err: any) {
      console.error("Sign out error:", err.message);
      setError(err.message || "Error signing out");
      setStatus("");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header with back‐home chevron and banner */}
      <div className={styles.header}>
        <button
          onClick={() => navigate("/")}
          className={styles.backButton}
          aria-label="Go to Homepage"
        >
          <img
            src="https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//backhome.png"
            alt="Back to Home"
          />
        </button>
        <img
          src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//Unknown.jpeg"
          alt="Coleshill Pharmacy Logo"
          className={styles.bannerImage}
        />
      </div>

      {/* Main card */}
      <main className={styles.container}>
        <p className={styles.subText}>
          {session ? `Email: ${session.user.email}` : "Please sign in..."}
        </p>

        {session ? (
          <button
            onClick={handleSignOut}
            className={styles.authButton}
            disabled={!!status}
          >
            {status ? <div className={styles.loader} /> : "Sign Out"}
          </button>
        ) : (
          <div className={styles.roleLinksContainer}>
            <Link to="/sign-in" className={styles.authButton}>
              Sign In
            </Link>
            <Link to="/sign-up" className={styles.authButton}>
              Sign Up
            </Link>
          </div>
        )}

        {session && role && (
          <div className={styles.roleLinksContainer}>
            {role === "Patient" ? (
              <>
                <Link to="/my-orders" className={styles.roleLink}>
                  Orders
                </Link>
                <Link to="/my-bookings" className={styles.roleLink}>
                  My Bookings
                </Link>
                <Link to="/edit-profile" className={styles.roleLink}>
                  Edit Profile
                </Link>
              </>
            ) : role === "ADMIN" ? (
              <>
                <Link to="/staffattendance" className={styles.roleLink}>
                  Attendance
                </Link>
                <Link to="/bookings" className={styles.roleLink}>
                  Bookings
                </Link>
                <Link to="/orders" className={styles.roleLink}>
                  Orders
                </Link>
                <Link to="/store" className={styles.roleLink}>
                  Store
                </Link>
              </>
            ) : (
              // role === "Staff"
              <Link to="/attendance" className={styles.roleLink}>
                Staff Attendance
              </Link>
            )}
          </div>
        )}

        <div className={styles.divider} />

        {error && <p className={styles.error}>{error}</p>}
      </main>
    </div>
  );
};

export default HomePage;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";
// import styles from "./HomePage.module.css";

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [role, setRole] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   // Fetch the role—and redirect if missing or invalid
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (!session?.user?.id) return;
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();

//       if (error) {
//         console.error("Error fetching role:", error.message);
//         setError("Failed to retrieve user role.");
//         // redirect to setup so they can complete
//         navigate("/setup-profile");
//       } else {
//         const r = data.role;
//         if (r === "Patient" || r === "Staff") {
//           setRole(r);
//         } else {
//           // no valid role → send to setup
//           navigate("/setup-profile");
//         }
//       }
//     };

//     fetchUserRole();
//   }, [session, navigate]);

//   const handleSignOut = async () => {
//     setStatus("Signing out...");
//     setError("");
//     try {
//       const { error: signOutError } = await supabase.auth.signOut();
//       // Treat "Auth session missing" as already signed out
//       if (signOutError && !signOutError.message.includes("Auth session missing")) {
//         throw signOutError;
//       }
//       navigate("/sign-in");
//     } catch (err: any) {
//       console.error("Sign out error:", err.message);
//       setError(err.message || "Error signing out");
//       setStatus("");
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       <img
//         src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//Unknown.jpeg"
//         alt="Coleshill Pharmacy Logo"
//         className={styles.logo}
//       />

//       <main className={styles.container}>
//         <p className={styles.subText}>
//           {session
//             ? `Email: ${session.user.email}`
//             : "Please sign in..."}
//         </p>

//         {session ? (
//           <button
//             onClick={handleSignOut}
//             className={styles.authButton}
//             disabled={!!status}
//           >
//             {status ? <div className={styles.loader} /> : "Sign Out"}
//           </button>
//         ) : (
//           <div className={styles.roleLinksContainer}>
//             <Link to="/sign-in" className={styles.authButton}>
//               Sign In
//             </Link>
//             <Link to="/sign-up" className={styles.authButton}>
//               Sign Up
//             </Link>
//           </div>
//         )}

//         {/* once signed in & role is loaded, show the role‐specific tabs */}
//         {session && role && (
//           <div className={styles.roleLinksContainer}>
//             {role === "Patient" && (
//               <>
//                 <Link to="/orders" className={styles.roleLink}>
//                   Orders
//                 </Link>
//                 <Link to="/my-bookings" className={styles.roleLink}>
//                   My Bookings
//                 </Link>
//                 <Link to="/edit-profile" className={styles.roleLink}>
//                   Edit Profile
//                 </Link>
//                 <Link to="/" className={styles.roleLink}>
//                   Home
//                 </Link>
//               </>
//             )}

//             {role === "Staff" && (
//               <>
//                 <Link to="/my-attendance" className={styles.roleLink}>
//                   My Attendance
//                 </Link>
//                 <Link to="/bookings" className={styles.roleLink}>
//                   Bookings
//                 </Link>
//               </>
//             )}
//           </div>
//         )}

//         <div className={styles.divider} />
//         {error && <p className={styles.error}>{error}</p>}
//       </main>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";
// import styles from "./HomePage.module.css";

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [role, setRole] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   // Fetch the role—and redirect if missing or invalid
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (!session?.user?.id) return;
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();

//       if (error) {
//         console.error("Error fetching role:", error.message);
//         setError("Failed to retrieve user role.");
//         // redirect to setup so they can complete
//         navigate("/setup-profile");
//       } else {
//         const r = data.role;
//         if (r === "Patient" || r === "Staff") {
//           setRole(r);
//         } else {
//           // no valid role → send to setup
//           navigate("/setup-profile");
//         }
//       }
//     };

//     fetchUserRole();
//   }, [session, navigate]);

//   const handleSignOut = async () => {
//     if (!session?.user) return;
//     setStatus("Signing out...");
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       navigate("/sign-in");
//     } catch (err: any) {
//       console.error("Sign out error:", err.message);
//       setError(err.message || "Error signing out");
//       setStatus("");
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       <img
//         src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//Unknown.jpeg"
//         alt="Coleshill Pharmacy Logo"
//         className={styles.logo}
//       />

//       <main className={styles.container}>
//         <p className={styles.subText}>
//           {session
//             ? `Email: ${session.user.email}`
//             : "Please sign in..."}
//         </p>

//         {session ? (
//           <button
//             onClick={handleSignOut}
//             className={styles.authButton}
//             disabled={!!status}
//           >
//             {status ? <div className={styles.loader} /> : "Sign Out"}
//           </button>
//         ) : (
//           <div className={styles.roleLinksContainer}>
//             <Link to="/sign-in" className={styles.authButton}>
//               Sign In
//             </Link>
//             <Link to="/sign-up" className={styles.authButton}>
//               Sign Up
//             </Link>
//           </div>
//         )}

//         {/* once signed in & role is loaded, show the role‐specific tabs */}
//         {session && role && (
//           <div className={styles.roleLinksContainer}>
//             {role === "Patient" && (
//               <>
//                 <Link to="/orders" className={styles.roleLink}>
//                   Orders
//                 </Link>
//                 <Link to="/my-bookings" className={styles.roleLink}>
//                   My Bookings
//                 </Link>
//                 <Link to="/edit-profile" className={styles.roleLink}>
//                   Edit Profile
//                 </Link>
//                 <Link to="/" className={styles.roleLink}>
//                   Home
//                 </Link>
//               </>
//             )}

//             {role === "Staff" && (
//               <>
//                 <Link to="/my-attendance" className={styles.roleLink}>
//                   My Attendance
//                 </Link>
//                 <Link to="/bookings" className={styles.roleLink}>
//                   Bookings
//                 </Link>
//               </>
//             )}
//           </div>
//         )}

//         <div className={styles.divider} />
//         {error && <p className={styles.error}>{error}</p>}
//       </main>
//     </div>
//   );
// };

// export default HomePage;
