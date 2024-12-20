import { Link } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { session } = useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching role:", error.message);
        } else {
          setRole(data.role);
        }
      }
    };

    fetchUserRole();
  }, [session]);

  const containerStyle = {
    boxShadow: "0 1px 5px 1px #E8FFE8", // Blue shadow for the containe
  };

  return (
    <main>
      <section  className="main-container">
        <h1 className="header-text">School Mood</h1>
        <p>Current User : {session?.user.email || "None"}</p>

        {/* Show sign-in/sign-out buttons */}
        {session ? (
          <div style={{ marginBottom: "20px" }}>
            {/* Add margin only for this button */}
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        ) : (
          <Link to="/sign-in">Sign In</Link>
        )}

        {/* Only show role-based links if the user is signed in */}
        {session && (
          <>
            {role === "USER" && (
              <>
                <Link to="/student">Attendance</Link>
                <Link to="/grade">Exam Results</Link>
              </>
            )}

            {role === "Teacher" && (
              <>
                <Link to="/attendance">Student Attendance</Link>
                <Link to="/teacherdashboard">Exam Results</Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/dashboard">Student Attendance</Link>
                {/* <Link to="/dashboard">Staff Attendance</Link> */}
                <Link to="/dashboard2">Exam Results</Link>
                <Link to="/dashboard3">Student Manager</Link>
                {/* <Link to="/dashboard5">Staff Manager</Link> */}
                <Link to="/dashboard4">Fee Manager</Link>
              </>
            )}
          </>
        )}

        <div id="divider"></div>
      </section>
    </main>
  );
};

export default HomePage;



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
