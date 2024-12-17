import { Link } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";

const HomePage = () => {
  const { session } = useSession();
  return (
    <main>
      <section className="main-container">
        <h1 className="header-text">School Mood</h1>
        <p>Current User : {session?.user.email || "None"}</p>
        {session ? (
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        ) : (
          <Link to="/sign-in">Sign In</Link>
        )}
        {/* <Link to="/student">Attendance</Link>
        <Link to="/grade">Exam Results</Link> */}
        <div id="divider"></div>
      </section>
    </main>
  );
};

export default HomePage;
