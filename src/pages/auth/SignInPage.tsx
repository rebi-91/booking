
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext"; // Ensure this context is correctly set up
import supabase from "../../supabase";
import { useForm } from "react-hook-form";
import useAuth from "./hooks/useAuth";
import useGeolocation from "./hooks/useGeolocation";
import { getDistanceFromLatLonInMeters } from "./hooks/distance";
import styles from "./hooks/SignInPage.module.css"; // Adjusted import path

// TypeScript interfaces
interface Profile {
  id: string;
  role: string;
  school: string;
  password: string; // Acts as teacherID
}

interface School {
  schoolName: string;
  lat: number;
  long: number;
}

interface Shift {
  shift: string;
  cutOff: string; // Format: "HH:MM"
  school: string;
}

interface Teacher {
  teacherID: string;
  school: string;
  present: string | null; // Number of TRUEs in '1'-'today'
  presentEvening: string | null; // Number of TRUEs in 'e1'-'etoday'
  Login: string | null;
  Logout: string | null;
  telNumber: string | null;
  minLate: string | null;      // Changed to string
  totalLate: string | null;    // Changed to string
  // Dynamic day columns '1' to '31' and 'e1' to 'e31' as boolean | null
  [key: string]: boolean | string | null;
}

interface FormValues {
  email: string;
  password: string;
  notInSchool: boolean; // New field for the checkbox
}

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { session: contextSession } = useSession(); // Assuming useSession provides the current session
  const { authState, signIn } = useAuth();
  const geolocation = useGeolocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>(); // Initializing useForm

  // Local state for status and error messages
  const [status, setStatus] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onSubmit = handleSubmit(async (data) => {
    setStatus("Logging in...");
    setError("");
    try {
      const { email, password, notInSchool } = data;

      // Step 1: Authenticate the user
      const { user, session } = await signIn(email, password);

      // Ensure the session is set
      if (!session) {
        throw new Error("Authentication session not established.");
      }

      // Step 2: Fetch the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, school, password") // Selecting 'role', 'school', and 'password' as teacherID
        .eq("id", user.id)
        .single<Profile>();

      if (profileError || !profileData) {
        throw new Error(profileError?.message || "Failed to retrieve profile information.");
      }

      const { role, school, password: profilePassword } = profileData;
      const teacherID = profilePassword; // Mapping 'password' to 'teacherID'

      // If the user is not a Teacher, proceed normally
      if (role !== "Teacher") {
        setStatus("Signed in successfully.");
        navigate("/"); // Redirect to home or appropriate page
        return;
      }

      // If 'Not in school' is checked, skip attendance and geolocation
      if (notInSchool) {
        setStatus("Signed in successfully.");
        navigate("/"); // Redirect to home or appropriate page
        return;
      }

      // Step 3: Fetch school details
      const { data: schoolData, error: schoolError } = await supabase
        .from("school")
        .select("schoolName, lat, long")
        .eq("schoolName", school)
        .single<School>();

      if (schoolError || !schoolData) {
        throw new Error("School information not found.");
      }

      const { lat: schoolLat, long: schoolLong } = schoolData;

      // Step 4: Ensure geolocation is loaded
      if (geolocation.loading) {
        setStatus("Retrieving your location...");
        return;
      }

      if (geolocation.error) {
        throw new Error(geolocation.error);
      }

      const userLocation = {
        latitude: geolocation.latitude!,
        longitude: geolocation.longitude!,
      };

      // Step 5: Calculate distance between user and school
      const distance = getDistanceFromLatLonInMeters(
        userLocation.latitude,
        userLocation.longitude,
        schoolLat,
        schoolLong
      );

      if (distance > 50) {
        // User is more than 50 meters away
        await supabase.auth.signOut();
        throw new Error("You are not within the permitted location to sign in.");
      }

      // Step 6: Determine current shift based on time
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      const isMorning = currentHour < 14; // Shift changes to Evening at 2 PM
      const shiftType = isMorning ? "Morning" : "Evening";

      // Step 7: Fetch shift details
      const { data: shiftData, error: shiftError } = await supabase
        .from("shift")
        .select("cutOff")
        .eq("shift", shiftType)
        .eq("school", school)
        .single<Shift>();

      if (shiftError || !shiftData) {
        throw new Error("Shift information not found.");
      }

      const { cutOff } = shiftData; // Format: "HH:MM"

      // Parse cutOff time
      const [cutOffHour, cutOffMinute] = cutOff.split(":").map(Number);
      const cutOffTime = new Date(currentDate);
      cutOffTime.setHours(cutOffHour, cutOffMinute, 0, 0);

      // Compare current time with cutOff
      const isOnTime = currentDate <= cutOffTime;

      // Step 8: Fetch teacher's attendance record
      const { data: teacherData, error: teacherError } = await supabase
        .from("teacher")
        .select("*")
        .eq("teacherID", teacherID) // Identifying the correct row by teacherID
        .eq("school", school)
        .single<Teacher>();

      if (teacherError || !teacherData) {
        throw new Error("Teacher information not found.");
      }

      const today = currentDate.getDate(); // e.g., 29
      const todayStr = today.toString();    // e.g., '29'
      const eveningTodayStr = `e${todayStr}`; // e.g., 'e29'

      // Determine the column to update based on shift
      const isEveningShift = shiftType === "Evening";
      const columnToUpdate = isEveningShift ? eveningTodayStr : todayStr;

      // Determine the range for 'present' or 'presentEvening' calculation
      const dayRange = isEveningShift
        ? Array.from({ length: today }, (_, i) => `e${i + 1}`)
        : Array.from({ length: today }, (_, i) => `${i + 1}`);

      // Check if the column to update is already filled (TRUE)
      const columnValue = teacherData[columnToUpdate];
      if (columnValue === true) {
        if (isEveningShift) {
          setStatus("Attendance for today (Evening) is already recorded.");
        } else {
          setStatus("Attendance for today is already recorded.");
        }
        navigate("/"); // Redirect to home or appropriate page
        return;
      }

      // Step 9: Prepare attendance update
      const attendanceUpdate: Partial<Teacher> = {};

      if (isMorning) {
        // **Morning Shift Logic**

        // Always set today's column to TRUE
        attendanceUpdate[columnToUpdate] = true; // Set to TRUE regardless of on time or late

        if (!isOnTime) {
          // Calculate minutes late
          const diffMs = currentDate.getTime() - cutOffTime.getTime();
          const minutesLate = Math.floor(diffMs / 60000);

          // Record lateness details
          attendanceUpdate.minLate = minutesLate.toString(); // Set minutes late as string

          // Parse existing totalLate, add minutesLate, and convert back to string
          const existingTotalLate = parseInt(teacherData.totalLate || "0", 10);
          const newTotalLate = existingTotalLate + minutesLate;
          attendanceUpdate.totalLate = newTotalLate.toString();
        } else {
          // Teacher is on time; set minLate to "0"
          attendanceUpdate.minLate = "0";
        }
      } else {
        // **Evening Shift Logic**

        // Always set e(today) to TRUE
        attendanceUpdate[columnToUpdate] = true;

        if (!isOnTime) {
          // Late: Update minLate, totalLate, and Login
          // Calculate minutes late
          const diffMs = currentDate.getTime() - cutOffTime.getTime();
          const minutesLate = Math.floor(diffMs / 60000);

          // Record lateness details
          attendanceUpdate.minLate = minutesLate.toString(); // Set minutes late as string

          // Parse existing totalLate, add minutesLate, and convert back to string
          const existingTotalLate = parseInt(teacherData.totalLate || "0", 10);
          const newTotalLate = existingTotalLate + minutesLate;
          attendanceUpdate.totalLate = newTotalLate.toString();

          // **Format Login time as "HH:MM" in Baghdad timezone**
          const formattedLoginTime = currentDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Baghdad',
            hour12: false,
          });

          // **Update Login time with formatted time**
          attendanceUpdate.Login = formattedLoginTime;
        } else {
          // Teacher is on time; set minLate to "0"
          attendanceUpdate.minLate = "0";
        }
      }

      // Step 10: Update 'present' or 'presentEvening' count
      let presentCount = 0;
      if (isEveningShift) {
        presentCount = dayRange.reduce((count, col) => {
          return count + (teacherData[col] === true ? 1 : 0);
        }, 0);
        // Increment by 1 if the current shift is being marked as present
        presentCount += 1;
        attendanceUpdate.presentEvening = presentCount.toString();
      } else {
        presentCount = dayRange.reduce((count, col) => {
          return count + (teacherData[col] === true ? 1 : 0);
        }, 0);
        // Increment by 1 if the current shift is being marked as present
        presentCount += 1;
        attendanceUpdate.present = presentCount.toString();
      }

      // Step 11: Update attendance atomically
      const { data: updateData, error: updateError } = await supabase
        .from("teacher")
        .update({
          ...attendanceUpdate, // Updating the relevant column and other fields
        })
        .eq("teacherID", teacherID) // Ensuring the correct row is updated by teacherID
        .eq("school", school)
        .select(); // Fetch the updated row for confirmation

      if (updateError) {
        throw new Error("Failed to update attendance.");
      }

      // Step 12: Sign-in successful
      setStatus("Signed in successfully.");
      navigate("/"); // Redirect to home or appropriate page
    } catch (err: any) {
      // Handle errors and prevent sign-in for Teachers
      if (
        err.message.includes("permission denied") ||
        err.message.includes("unavailable") ||
        err.message.includes("not within the permitted location") ||
        err.message.includes("Attendance") ||
        err.message.includes("Failed to")
      ) {
        // Show a generic alert
        alert("Error occurred. Please try again!");
      } else {
        // Handle other errors normally
        setError(err.message || "An unexpected error occurred.");
      }
      setStatus("");
    }
  });

  // Early return if already signed in
  if (contextSession) return <Navigate to="/" />;

  return (
    <main className={styles.container}>
      {/* Retained Home Link */}
      <Link className={styles.homeLink} to="/">
        ◄ Home
      </Link>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.headerText}>Sign In</h1>

        {/* Email Input */}
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required." })}
          className={styles.input}
        />
        {errors.email && (
          <p className={styles.error}>{errors.email.message}</p>
        )}

        {/* Password Input */}
        <label htmlFor="password" className={styles.label}>
          Password:
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required." })}
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        {/* Checkbox: Not in school (Staff only) */}
        <div className={styles.checkboxContainer}>
          <input
            id="notInSchool"
            type="checkbox"
            {...register("notInSchool")}
            className={styles.checkbox}
          />
          <label htmlFor="notInSchool" className={styles.checkboxLabel}>
            Not in school (Staff only)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.button}
          disabled={authState.loading || geolocation.loading}
        >
          {authState.loading || geolocation.loading ? (
            <div className={styles.loader}></div>
          ) : (
            "Login"
          )}
        </button>

        {/* Sign-Up Link */}
        <Link className={styles.authLink} to="/sign-up">
          Don't have an account? Sign Up
        </Link>

        {/* Status Message */}
        {status && <p className={styles.status}>{status}</p>}

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignInPage;

// import React from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext"; // Ensure this context is correctly set up
// import supabase from "../../supabase";
// import { useForm } from "react-hook-form";
// import useAuth from "./hooks/useAuth";
// import useGeolocation from "./hooks/useGeolocation";
// import { getDistanceFromLatLonInMeters } from "./hooks/distance";
// import styles from "./hooks/SignInPage.module.css";

// // Define interfaces based on your Supabase tables
// interface Profile {
//   id: string; // Ensure 'id' is included if it's used in RLS
//   role: string;
//   school: string;
//   teacherID: string;
// }

// interface School {
//   schoolName: string;
//   lat: number;
//   long: number;
// }

// interface Shift {
//   shift: string;
//   cutOff: string; // Format: "HH:MM"
//   school: string;
// }

// interface Teacher {
//   teacherID: string;
//   school: string;
//   present: number | null;
//   Login: string | null;
//   Logout: string | null;
//   telNumber: string | null;
//   minLate: number | null;
//   totalLate: number | null;
//   // Dynamic day columns '1' to '31'
//   [key: string]: any;
// }

// interface FormValues {
//   email: string;
//   password: string;
// }

// const SignInPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session: contextSession } = useSession(); // Assuming useSession provides the current session
//   const { authState, signIn } = useAuth();
//   const geolocation = useGeolocation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>(); // Initializing useForm

//   // Local state for status and error messages
//   const [status, setStatus] = React.useState<string>("");
//   const [error, setError] = React.useState<string>("");

//   const onSubmit = handleSubmit(async (data) => {
//     setStatus("Logging in...");
//     setError("");
//     try {
//       // Step 1: Authenticate the user
//       const { user, session } = await signIn(data.email, data.password);
//       console.log("Authenticated User ID:", user.id);
//       console.log("Session:", session);

//       // Ensure the session is set
//       if (!session) {
//         throw new Error("Authentication session not established.");
//       }

//       // Step 2: Fetch the user's profile
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("id, role, school, teacherID")
//         .eq("id", user.id)
//         .single<Profile>();

//       console.log("Profile Data:", profileData);
//       console.log("Profile Error:", profileError);

//       if (profileError || !profileData) {
//         throw new Error(profileError?.message || "Failed to retrieve profile information.");
//       }

//       const { role, school, teacherID } = profileData;

//       // If the user is not a Teacher, proceed normally
//       if (role !== "Teacher") {
//         setStatus("Signed in successfully.");
//         navigate("/"); // Redirect to home or appropriate page
//         return;
//       }

//       // Step 3: Fetch school details
//       const { data: schoolData, error: schoolError } = await supabase
//         .from("school")
//         .select("schoolName, lat, long")
//         .eq("schoolName", school)
//         .single<School>();

//       console.log("School Data:", schoolData);
//       console.log("School Error:", schoolError);

//       if (schoolError || !schoolData) {
//         throw new Error("School information not found.");
//       }

//       const { lat: schoolLat, long: schoolLong } = schoolData;

//       // Step 4: Ensure geolocation is loaded
//       if (geolocation.loading) {
//         setStatus("Retrieving your location...");
//         return;
//       }

//       if (geolocation.error) {
//         throw new Error(geolocation.error);
//       }

//       const userLocation = {
//         latitude: geolocation.latitude!,
//         longitude: geolocation.longitude!,
//       };

//       console.log("User Location:", userLocation);

//       // Step 5: Calculate distance between user and school
//       const distance = getDistanceFromLatLonInMeters(
//         userLocation.latitude,
//         userLocation.longitude,
//         schoolLat,
//         schoolLong
//       );

//       console.log("Distance from School (meters):", distance);

//       if (distance > 50) {
//         // User is more than 50 meters away
//         await supabase.auth.signOut();
//         throw new Error(
//           "You are not within the permitted location to sign in."
//         );
//       }

//       // Step 6: Determine current shift based on time
//       const currentDate = new Date();
//       const currentHour = currentDate.getHours();
//       const isMorning = currentHour < 12;
//       const shiftType = isMorning ? "Morning" : "Evening";

//       console.log("Shift Type:", shiftType);

//       // Step 7: Fetch shift details
//       const { data: shiftData, error: shiftError } = await supabase
//         .from("shift")
//         .select("cutOff")
//         .eq("shift", shiftType)
//         .eq("school", school)
//         .single<Shift>();

//       console.log("Shift Data:", shiftData);
//       console.log("Shift Error:", shiftError);

//       if (shiftError || !shiftData) {
//         throw new Error("Shift information not found.");
//       }

//       const { cutOff } = shiftData; // Format: "HH:MM"

//       // Parse cutOff time
//       const [cutOffHour, cutOffMinute] = cutOff.split(":").map(Number);
//       const cutOffTime = new Date(currentDate);
//       cutOffTime.setHours(cutOffHour, cutOffMinute, 0, 0);

//       // Compare current time with cutOff
//       const isOnTime = currentDate <= cutOffTime;

//       console.log("Is On Time:", isOnTime);

//       // Step 8: Fetch teacher's attendance record
//       const { data: teacherData, error: teacherError } = await supabase
//         .from("teacher")
//         .select("*")
//         .eq("teacherID", teacherID)
//         .eq("school", school)
//         .single<Teacher>();

//       console.log("Teacher Data:", teacherData);
//       console.log("Teacher Error:", teacherError);

//       if (teacherError || !teacherData) {
//         throw new Error("Teacher information not found.");
//       }

//       const today = currentDate.getDate().toString(); // e.g., '28'

//       if (teacherData[today] !== null && teacherData[today] !== undefined) {
//         // Today's column is already filled
//         setStatus("Signed in successfully.");
//         navigate("/"); // Redirect to home or appropriate page
//         return;
//       }

//       // Step 9: Prepare attendance update
//       const attendanceUpdate: Partial<Teacher> = {};
//       if (isOnTime) {
//         attendanceUpdate[today] = true;
//       } else {
//         // Calculate minutes late
//         const diffMs = currentDate.getTime() - cutOffTime.getTime();
//         const minutesLate = Math.floor(diffMs / 60000);
//         attendanceUpdate[today] = minutesLate;
//         attendanceUpdate.totalLate =
//           (teacherData.totalLate || 0) + minutesLate;
//       }

//       console.log("Attendance Update:", attendanceUpdate);

//       // Step 10: Update attendance and log sign-in time atomically
//       const { error: updateError } = await supabase
//         .from("teacher")
//         .update({
//           ...attendanceUpdate,
//           Login: currentDate.toISOString(),
//         })
//         .eq("teacherID", teacherID)
//         .eq("school", school);

//       console.log("Update Error:", updateError);

//       if (updateError) {
//         throw new Error("Failed to update attendance.");
//       }

//       // Step 11: Sign-in successful
//       setStatus("Signed in successfully.");
//       navigate("/"); // Redirect to home or appropriate page
//     } catch (err: any) {
//       console.error("Error during sign-in:", err);
//       setError(err.message || "An unexpected error occurred.");
//       setStatus("");
//     }
//   });

//   // Early return if already signed in
//   if (contextSession) return <Navigate to="/" />;

//   return (
//     <main className={styles.container}>
//       <Link className={styles.homeLink} to="/">
//         ◄ Home
//       </Link>
//       <form className={styles.form} onSubmit={onSubmit}>
//         <h1 className={styles.headerText}>Sign In</h1>

//         {/* Email Input */}
//         <label htmlFor="email" className={styles.label}>
//           Email:
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Email"
//           {...register("email", { required: "Email is required." })}
//           className={styles.input}
//         />
//         {errors.email && (
//           <p className={styles.error}>{errors.email.message}</p>
//         )}

//         {/* Password Input */}
//         <label htmlFor="password" className={styles.label}>
//           Password:
//         </label>
//         <input
//           id="password"
//           type="password"
//           placeholder="Password"
//           {...register("password", { required: "Password is required." })}
//           className={styles.input}
//         />
//         {errors.password && (
//           <p className={styles.error}>{errors.password.message}</p>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className={styles.button}
//           disabled={authState.loading || geolocation.loading}
//         >
//           {authState.loading ? (
//             <div className={styles.loader}></div>
//           ) : (
//             "Login"
//           )}
//         </button>

//         {/* Sign-Up Link */}
//         <Link className={styles.authLink} to="/sign-up">
//           Don't have an account? Sign Up
//         </Link>

//         {/* Status Message */}
//         {status && <p className={styles.status}>{status}</p>}

//         {/* Error Message */}
//         {error && <p className={styles.error}>{error}</p>}
//       </form>
//     </main>
//   );
// };

// export default SignInPage;



// import { useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";

// const SignInPage = () => {
//   // ==============================
//   // If user is already logged in, redirect to home
//   // This logic is being repeated in SignIn and SignUp..
//   const { session } = useSession();
//   if (session) return <Navigate to="/" />;
//   // maybe we can create a wrapper component for these pages
//   // just like the ./router/AuthProtectedRoute.tsx? up to you.
//   // ==============================
//   const [status, setStatus] = useState("");
//   const [formValues, setFormValues] = useState({
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormValues({ ...formValues, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setStatus("Logging in...");
//     const { error } = await supabase.auth.signInWithPassword({
//       email: formValues.email,
//       password: formValues.password,
//     });
//     if (error) {
//       alert(error.message);
//     }
//     setStatus("");
//   };
//   return (
//     <main>
//       <Link className="home-link" to="/">
//         ◄ Home
//       </Link>
//       <form className="main-container" onSubmit={handleSubmit}>
//         <h1 className="header-text">Sign In</h1>
//         <input
//           name="email"
//           onChange={handleInputChange}
//           type="email"
//           placeholder="Email"
//         />
//         <input
//           name="password"
//           onChange={handleInputChange}
//           type="password"
//           placeholder="Password"
//         />
//         <button type="submit">Login</button>
//         <Link className="auth-link" to="/sign-up">
//           Don't have an account? Sign Up
//         </Link>
//         {status && <p>{status}</p>}
//       </form>
//     </main>
//   );
// };

// export default SignInPage;
