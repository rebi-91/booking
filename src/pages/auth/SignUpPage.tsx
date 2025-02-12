
// import React from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { useForm } from "react-hook-form";
// import styles from "./hooks/SignUpPage.module.css"; // Import the new CSS module

// // TypeScript interfaces
// interface FormValues {
//   email: string;
//   password: string;
// }

// const SignUpPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   // If the user is already logged in, redirect to home
//   if (session) return <Navigate to="/" />;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>(); // Initialize react-hook-form

//   // Local state for status messages
//   const [status, setStatus] = React.useState<string>("");
//   const [error, setError] = React.useState<string>("");

//   const onSubmit = handleSubmit(async (data) => {
//     setStatus("Creating account...");
//     setError("");
//     try {
//       const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//       });

//       if (signUpError) {
//         throw new Error(signUpError.message);
//       }

//       if (signUpData.user) {
//         setStatus("Account created successfully! Redirecting...");
//         // Optionally, you can automatically navigate or require email confirmation
//         // For this example, we'll redirect to the SignInPage after a short delay
//         setTimeout(() => {
//           navigate("/sign-in");
//         }, 3000);
//       } else {
//         // If no user data is returned, prompt email confirmation
//         setStatus("Please check your email to confirm your account.");
//       }
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred.");
//       setStatus("");
//     }
//   });

//   return (
//     <main className={styles.container}>
//       <Link className={styles.homeLink} to="/">
//         ◄ Home
//       </Link>
//       <form className={styles.form} onSubmit={onSubmit}>
//         <h1 className={styles.headerText}>Sign Up</h1>

//         {/* Email Input */}
//         <label htmlFor="email" className={styles.label}>
//           Email:
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Email"
//           {...register("email", { 
//             required: "Email is required.", 
//             pattern: {
//               value: /^\S+@\S+$/i,
//               message: "Invalid email address.",
//             },
//           })}
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
//           {...register("password", { 
//             required: "Password is required.",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters.",
//             },
//           })}
//           className={styles.input}
//         />
//         {errors.password && (
//           <p className={styles.error}>{errors.password.message}</p>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className={styles.button}
//           disabled={status !== ""} // Disable the button while processing
//         >
//           {status !== "" ? (
//             <div className={styles.loader}></div>
//           ) : (
//             "Create Account"
//           )}
//         </button>

//         {/* Sign-In Link */}
//         <Link className={styles.authLink} to="/sign-in">
//           Already have an account? Sign In
//         </Link>

//         {/* Status Message */}
//         {status && <p className={styles.status}>{status}</p>}

//         {/* Error Message */}
//         {error && <p className={styles.error}>{error}</p>}
//       </form>
//     </main>
//   );
// };

// export default SignUpPage;
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { useForm } from "react-hook-form";
import styles from "./hooks/SignUpPage.module.css"; // Import the new CSS module

// TypeScript interfaces
interface FormValues {
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  // If the user is already logged in, redirect to home
  if (session) return <Navigate to="/" />;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>(); // Initialize react-hook-form

  // Local state for status messages
  const [status, setStatus] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onSubmit = handleSubmit(async (data) => {
    setStatus("Creating account...");
    setError("");
    try {
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (signUpData.user) {
        setStatus("Account created successfully! Redirecting...");
        // Redirect to the PickSchoolPage after a short delay
        setTimeout(() => {
          navigate("/pick-school");
        }, 3000);
      } else {
        // If no user data is returned, prompt email confirmation
        setStatus("Please check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus("");
    }
  });

  return (
    <main className={styles.container}>
      <Link className={styles.homeLink} to="/">
        ◄ Home
      </Link>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.headerText}>Sign Up</h1>

        {/* Email Input */}
        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email", { 
            required: "Email is required.", 
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address.",
            },
          })}
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
          {...register("password", { 
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.button}
          disabled={status !== ""} // Disable the button while processing
        >
          {status !== "" ? (
            <div className={styles.loader}></div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Sign-In Link */}
        <Link className={styles.authLink} to="/sign-in">
          Already have an account? Sign In
        </Link>

        {/* Status Message */}
        {status && <p className={styles.status}>{status}</p>}

        {/* Error Message */}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignUpPage;
