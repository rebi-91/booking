import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";
import styles from "./HomePage.module.css"; // Import the CSS module

const HomePage: React.FC = () => {
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
          .select("role, password, school")
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

  // Handler for sign-out
  const handleSignOut = async () => {
    if (!session?.user?.id) return;

    setStatus("Signing out...");
    setError("");

    try {
      // Sign out the user immediately
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw new Error(signOutError.message);
      }

      setStatus("Signed out successfully.");
      // Redirect to the Sign-In page immediately (or after a short delay if desired)
      navigate("/sign-in");
    } catch (err: any) {
      console.error("Sign out error:", err.message);
      setError(err.message || "An unexpected error occurred during sign out.");
      setStatus("");
    }
  };

  return (
    <>
      {/* Conditionally render the banner image if not signed in */}
      {!session && (
        <img
          src="https://i.imgur.com/PYQR2W0.jpeg"
          alt="School Banner"
          className={styles.bannerImage}
        />
        // <img
        //   src="https://i.imgur.com/FmRXvJG.png"
        //   alt="School Banner"
        //   className={styles.bannerImage}
        // />
      )}

      <main className={styles.container}>
        {/* Header Text */}
        <h1 className={styles.headerText}></h1>

        {/* Subtext: Current User Email */}
        <p className={styles.subText}>
          Current User: {session?.user?.email || "None"}
        </p>

        {/* Authentication Buttons */}
        {session ? (
          <button
            onClick={handleSignOut}
            className={styles.authButton}
            disabled={status !== ""}
          >
            {status !== "" ? (
              <div className={styles.loader}></div>
            ) : (
              "Sign Out"
            )}
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

        {/* Role-Based Links */}
        {session && role && (
          <div className={styles.roleLinksContainer}>
            {role === "USER" && (
              <>
                <Link to="/student" className={styles.roleLink}>
                  Attendance
                </Link>
                {/* <Link to="/grade" className={styles.roleLink}>
                  Exam Results
                </Link> */}
                <Link to="/student-fee" className={styles.roleLink}>
                  Student Fee
                </Link>
              </>
            )}

            {role === "Teacher" && (
              <>
                <Link to="/attendance" className={styles.roleLink}>
                  Student Attendance
                </Link>
                {/* <Link to="/teacherdashboard" className={styles.roleLink}>
                  Exam Results
                </Link> */}
                <Link to="/my-attendance" className={styles.roleLink}>
                  My Attendance
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/dashboard" className={styles.roleLink}>
                  Student Attendance
                </Link>
                {/* <Link to="/dashboard2" className={styles.roleLink}>
                  Exam Results
                </Link> */}
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

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Status and Error Messages */}
        {status && <p className={styles.status}>{status}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </>
  );
};

export default HomePage;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";
// import styles from "./HomePage.module.css"; // Import the CSS module

// const HomePage: React.FC = () => {
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
//           .select("role, password, school") // Fetch role, password (teacherID), and school
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
//       // Fetch the user's profile to get teacherID (from password) and school
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("role, password, school")
//         .eq("id", session.user.id)
//         .single();

//       if (profileError || !profileData) {
//         throw new Error("Failed to retrieve user profile information.");
//       }

//       const { role, password: teacherID, school } = profileData;

//       // If the user is a Teacher, update the 'Logout' column in the 'teacher' table
//       if (role === "Teacher") {
//         // Ensure that 'teacherID' and 'school' are present
//         if (!teacherID || !school) {
//           throw new Error("Incomplete teacher profile information.");
//         }

//         // Get current time in Baghdad timezone formatted as "HH:MM"
//         const currentDate = new Date();
//         const options: Intl.DateTimeFormatOptions = {
//           hour: "2-digit",
//           minute: "2-digit",
//           timeZone: "Asia/Baghdad",
//           hour12: false,
//         };
//         const formattedLogoutTime = currentDate.toLocaleTimeString(
//           "en-US",
//           options
//         );

//         // Update the 'Logout' column with the formatted time
//         const { error: updateError } = await supabase
//           .from("teacher")
//           .update({ Logout: formattedLogoutTime }) // Set to "HH:MM" format
//           .eq("teacherID", teacherID)
//           .eq("school", school);

//         if (updateError) {
//           throw new Error("Failed to update logout time.");
//         }
//       }

//       // Proceed to sign out
//       const { error: signOutError } = await supabase.auth.signOut();

//       if (signOutError) {
//         throw new Error(signOutError.message);
//       }

//       setStatus("Signed out successfully.");
//       // Redirect to the Sign-In page after a short delay
//       setTimeout(() => {
//         navigate("/sign-in");
//       }, 2000);
//     } catch (err: any) {
//       console.error("Sign out error:", err.message);
//       setError(err.message || "An unexpected error occurred during sign out.");
//       setStatus("");
//     }
//   };

//   return (
//     <>
//       {/* Image above the container */}
//       <img
//         src="https://i.imgur.com/FmRXvJG.png"
//         alt="School Banner"
//         style={{
//           display: "block",
//     // Top margin to move the image further down
//           margin: "0px auto 0 auto",
//           marginRight: "0px auto 0 auto",
//           transform: "rotate(15deg) scale(0.46)", 
//           transformOrigin: "center",
//           position: "relative",
//           left: "-45px"
//         }}
//       />

//       <main className={styles.container}>
//         {/* Header Text */}
//         <h1 className={styles.headerText}></h1>

//         {/* Subtext: Current User Email */}
//         <p className={styles.subText}>
//           Current User: {session?.user?.email || "None"}
//         </p>

//         {/* Authentication Buttons */}
//         {session ? (
//           <button
//             onClick={handleSignOut}
//             className={styles.authButton}
//             disabled={status !== ""}
//           >
//             {status !== "" ? (
//               <div className={styles.loader}></div>
//             ) : (
//               "Sign Out"
//             )}
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

//         {/* Role-Based Links */}
//         {session && role && (
//           <div className={styles.roleLinksContainer}>
//             {role === "USER" && (
//               <>
//                 <Link to="/student" className={styles.roleLink}>
//                   Attendance
//                 </Link>
//                 <Link to="/grade" className={styles.roleLink}>
//                   Exam Results
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
//                 <Link to="/teacherdashboard" className={styles.roleLink}>
//                   Exam Results
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
//                 <Link to="/dashboard2" className={styles.roleLink}>
//                   Exam Results
//                 </Link>
//                 <Link to="/dashboard3" className={styles.roleLink}>
//                   Student Manager
//                 </Link>
//                 {/* <Link to="/dashboard4" className={styles.roleLink}>
//                   Fee Manager
//                 </Link> */}
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

//         {/* Divider */}
//         <div className={styles.divider}></div>

//         {/* Status and Error Messages */}
//         {status && <p className={styles.status}>{status}</p>}
//         {error && <p className={styles.error}>{error}</p>}
//       </main>
//     </>
//   );
// };

// export default HomePage;

// import { Link } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";

// const HomePage = () => {
//   const { session } = useSession();
//   return (
//     <main>
//       <section className="main-container">
//         <h1 className="header-text">School Mood</h1>
//         <p>Current User : {session?.user.email || "None"}</p>
//         {session ? (
//           <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
//         ) : (
//           <Link to="/sign-in">Sign In</Link>
//         )}
//         //Student/Guardian - USER 
//         <Link to="/student">Attendance</Link>
//         <Link to="/grade">Exam Results</Link>

//         //Teacher
//         <Link to="/attendance">Student Attendance</Link>
//         <Link to="/teacherdashboard">Exam Results</Link>
        
//         //ADMIN 
//         <Link to="/dashboard">Student Attendance</Link>
//         {/* <Link to="/dashboard">Staff Attendance</Link> */}
//         <Link to="/dashboard2">Exam Results</Link>
//         <Link to="/dashboard3">Student Manager</Link>
//         {/* <Link to="/dashboard5">Staff Manager</Link> */}
//         <Link to="/dashboard4">Fee Manager</Link>
        
//         <div id="divider"></div>
//       </section>
//     </main>
//   );
// };

// export default HomePage;
