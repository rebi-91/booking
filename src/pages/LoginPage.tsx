// // import React, { useEffect, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import supabase from "../supabase";
// // import { useSession } from "../context/SessionContext";
// // import styles from "./HomePage.module.css"; // Import the CSS module

// // const HomePage: React.FC = () => {
// //   const navigate = useNavigate();
// //   const { session } = useSession();
// //   const [role, setRole] = useState<string | null>(null);
// //   const [status, setStatus] = useState<string>("");
// //   const [error, setError] = useState<string>("");

// //   useEffect(() => {
// //     const fetchUserRole = async () => {
// //       if (session?.user?.id) {
// //         const { data, error } = await supabase
// //           .from("profiles")
// //           .select("role, password, school")
// //           .eq("id", session.user.id)
// //           .single();

// //         if (error) {
// //           console.error("Error fetching role:", error.message);
// //           setError("Failed to retrieve user role.");
// //         } else {
// //           setRole(data.role);
// //         }
// //       }
// //     };

// //     fetchUserRole();
// //   }, [session]);

// //   // Handler for sign-out
// //   const handleSignOut = async () => {
// //     if (!session?.user?.id) return;

// //     setStatus("Signing out...");
// //     setError("");

// //     try {
// //       const { error: signOutError } = await supabase.auth.signOut();
// //       if (signOutError) {
// //         throw new Error(signOutError.message);
// //       }
// //       setStatus("Signed out successfully.");
// //       navigate("/sign-in");
// //     } catch (err: any) {
// //       console.error("Sign out error:", err.message);
// //       setError(err.message || "An unexpected error occurred during sign out.");
// //       setStatus("");
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Always render the banner image. If the user is signed in, apply signedInBanner styling. */}
// //       <img
// //         src="https://i.imgur.com/G6vPcuS.jpeg"
// //         alt="School Banner"
// //         className={`${styles.bannerImage} ${session ? styles.signedInBanner : ""}`}
// //       />

// //       <main className={styles.container}>
      
// //         <p className={styles.subText}>
// //           {session ? `Email: ${session.user.email}` : "Please sign in..."}
// //         </p>

// //         {session ? (
// //           <button
// //             onClick={handleSignOut}
// //             className={styles.authButton}
// //             disabled={status !== ""}
// //           >
// //             {status !== "" ? <div className={styles.loader}></div> : "Sign Out"}
// //           </button>
// //         ) : (
// //           <div className={styles.roleLinksContainer}>
// //             <Link to="/sign-in" className={styles.authButton}>
// //               Sign In
// //             </Link>
// //             <Link to="/sign-up" className={styles.authButton}>
// //               Sign Up
// //             </Link>
// //           </div>
// //         )}

// //         {session && role && (
// //           <div className={styles.roleLinksContainer}>
// //             {role === "USER" && (
// //               <>
// //                 <Link to="/student" className={styles.roleLink}>
// //                   Attendance
// //                 </Link>
// //                 <Link to="/student-fee" className={styles.roleLink}>
// //                   Student Fee
// //                 </Link>
// //               </>
// //             )}

// //             {role === "Teacher" && (
// //               <>
// //                 <Link to="/attendance" className={styles.roleLink}>
// //                   Student Attendance
// //                 </Link>
// //                 <Link to="/my-attendance" className={styles.roleLink}>
// //                   My Attendance
// //                 </Link>
// //               </>
// //             )}

// //             {role === "ADMIN" && (
// //               <>
// //                 <Link to="/dashboard" className={styles.roleLink}>
// //                   Student Attendance
// //                 </Link>
// //                 <Link to="/dashboard3" className={styles.roleLink}>
// //                   Student Manager
// //                 </Link>
// //                 <Link to="/dashboard4" className={styles.roleLink}>
// //                   Student Fee
// //                 </Link>
// //                 <Link to="/dash5" className={styles.roleLink}>
// //                   Staff Attendance
// //                 </Link>
// //               </>
// //             )}

// //             {role === "ACCOUNTANT" && (
// //               <>
// //                 <Link to="/dashboard4" className={styles.roleLink}>
// //                   Fee Manager
// //                 </Link>
// //                 <Link to="/dash5" className={styles.roleLink}>
// //                   Staff Attendance
// //                 </Link>
// //               </>
// //             )}
// //           </div>
// //         )}

// //         <div className={styles.divider}></div>
// //         {status && <p className={styles.status}>{status}</p>}
// //         {error && <p className={styles.error}>{error}</p>}
// //       </main>
// //     </>
// //   );
// // };

// // export default HomePage;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";
// import styles from "./HomePage.module.css"; // Import the CSS module

// const darkBg = "#1e1e1e";

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [role, setRole] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (session?.user?.id) {
//         const { data, error } = await supabase
//           .from("profiles")
//           .select("role, password, school")
//           .eq("id", session.user.id)
//           .single();

//         if (error) {
//           console.error("Error fetching role:", error.message);
//           setError("Failed to retrieve user role.");
//         } else {
//           setRole(data.role);
//         }
//       }
//     };

//     fetchUserRole();
//   }, [session]);

//   // Handler for sign-out
//   const handleSignOut = async () => {
//     if (!session?.user?.id) return;

//     setStatus("Signing out...");
//     setError("");

//     try {
//       const { error: signOutError } = await supabase.auth.signOut();
//       if (signOutError) {
//         throw new Error(signOutError.message);
//       }
//       setStatus("Signed out successfully.");
//       navigate("/sign-in");
//     } catch (err: any) {
//       console.error("Sign out error:", err.message);
//       setError(err.message || "An unexpected error occurred during sign out.");
//       setStatus("");
//     }
//   };

//   // Inline styles
//   const wrapperStyle: React.CSSProperties = {
//     backgroundColor: darkBg,
//     minHeight: "100vh",
//     paddingTop: "env(safe-area-inset-top)",    // iOS notch
//     paddingLeft: "env(safe-area-inset-left)",
//     paddingRight: "env(safe-area-inset-right)",
//     paddingBottom: "env(safe-area-inset-bottom)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   const containerStyle: React.CSSProperties = {
//     width: "100%",
//     maxWidth: 500,
//     backgroundColor: darkBg,
//     borderRadius: 10,
//     padding: 20,
//     boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
//     color: "#fff",
//   };

//   const videoStyle: React.CSSProperties = {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     zIndex: 1,
//     opacity: 0.3,
//   };
  
//   return (
//     <>
//      <div style={{ backgroundColor: "#1e1e1e", minHeight: "100vh" }}>

//       {/* If not logged in, show the video background with rounded corners */}
//       {!session ? (
//         <video autoPlay loop muted className={styles.backgroundVideo}>
//           <source src="/video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       ) : (
//         <video autoPlay loop muted className={styles.backgroundVideo}>
//           <source src="/video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       )}

//       <main className={styles.container}>
//         <p className={styles.subText}>
//           {session ? `Email: ${session.user.email}` : "Please sign in..."}
//         </p>

//         {session ? (
//           <button
//           onClick={handleSignOut}
//           className={styles.authButton}
//           disabled={status !== ""}
//           >
//             {status !== "" ? <div className={styles.loader}></div> : "Sign Out"}
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
//             {role === "USER" && (
//               <>
//                 <Link to="/student" className={styles.roleLink}>
//                   Attendance
//                 </Link>
//                 <Link to="/student-fee" className={styles.roleLink}>
//                   Student Fee
//                 </Link>
//               </>
//             )}

//             {role === "Teacher" && (
//               <>
//                 <Link to="/attendance" className={styles.roleLink}>
//                   Student Attendance
//                 </Link>
//                 <Link to="/my-attendance" className={styles.roleLink}>
//                   My Attendance
//                 </Link>
//               </>
//             )}

//             {role === "ADMIN" && (
//               <>
//                 <Link to="/dashboard" className={styles.roleLink}>
//                   Student Attendance
//                 </Link>
//                 <Link to="/dashboard3" className={styles.roleLink}>
//                   Student Manager
//                 </Link>
                
//                 <Link to="/dash5" className={styles.roleLink}>
//                   Staff Attendance
//                 </Link>
//               </>
//             )}

//             {role === "ACCOUNTANT" && (
//               <>
//                 <Link to="/dashboard4" className={styles.roleLink}>
//                   Fee Manager
//                 </Link>
//                 <Link to="/dash5" className={styles.roleLink}>
//                   Staff Attendance
//                 </Link>
//               </>
//             )}
//           </div>
//         )}

//         <div className={styles.divider}></div>
//         {status && <p className={styles.status}>{status}</p>}
//         {error && <p className={styles.error}>{error}</p>}
//       </main>
//         </div>
//     </>
//   );
// };

// export default LoginPage;
// src/pages/LoginPage.tsx


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";
import styles from "./HomePage.module.css"; // Import the CSS module

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role, staffID")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching role:", error.message);
          setError("Failed to retrieve user role.");
        } else {
          setRole(data.role);
        }
      }
    };
    fetchUserRole();
  }, [session]);

  const handleSignOut = async () => {
    if (!session?.user?.id) return;
    setStatus("Signing out...");
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw new Error(signOutError.message);
      setStatus("Signed out successfully.");
      navigate("/sign-in");
    } catch (err: any) {
      console.error("Sign out error:", err.message);
      setError(err.message || "An unexpected error occurred during sign out.");
      setStatus("");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ← Logo replaces the video */}
      <img
        src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//Unknown.jpeg"
        alt="Coleshill Pharmacy Logo"
        className={styles.logo}
      />
      

      <main className={styles.container}>
        <p className={styles.subText}>
          {session ? `Email: ${session.user.email}` : "Please sign in..."}
        </p>

        {session ? (
          <button
            onClick={handleSignOut}
            className={styles.authButton}
            disabled={status !== ""}
          >
            {status !== "" ? <div className={styles.loader}></div> : "Sign Out"}
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
            {role === "Patient" && (
              <>
                <Link to="/student" className={styles.roleLink}>
                  Attendance
                </Link>
                <Link to="/student-fee" className={styles.roleLink}>
                  Student Fee
                </Link>
              </>
            )}
            {role === "Staff" && (
              <>
                <Link to="/my-attendance" className={styles.roleLink}>
                  My Attendance
                </Link>
                <Link to="/bookings" className={styles.roleLink}>
                  Bookings
                </Link>
              </>
            )}
            {role === "ADMIN" && (
              <>
                <Link to="/dashboard" className={styles.roleLink}>
                  Student Attendance
                </Link>
                <Link to="/dashboard3" className={styles.roleLink}>
                  Student Manager
                </Link>
                <Link to="/dash5" className={styles.roleLink}>
                  Staff Attendance
                </Link>
              </>
            )}
            {role === "ACCOUNTANT" && (
              <>
                <Link to="/dashboard4" className={styles.roleLink}>
                  Fee Manager
                </Link>
                <Link to="/dash5" className={styles.roleLink}>
                  Staff Attendance
                </Link>
              </>
            )}
          </div>
        )}

        <div className={styles.divider}></div>
        {status && <p className={styles.status}>{status}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </div>
  );
};

export default LoginPage;
