// // File: src/pages/teacher/MyBooking.tsx

// import React, { useState, useEffect, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { FaHome } from "react-icons/fa";
// import "./MyBooking.css";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;    // YYYY-MM-DD
//   pending: string;
// }

// export default function MyBooking() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-in");
//       return;
//     }
//     (async () => {
//       setLoading(true);
//       try {
//         // Check role
//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("role")
//           .eq("id", session.user.id)
//           .single();
//         if (profileError) throw profileError;
//         if (profile?.role !== "Patient") {
//           navigate("/");
//           return;
//         }

//         // Fetch bookings for this user, excluding cancelled
//         const { data, error: fetchError } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("customerID", session.user.id)
//           .neq("pending", "cancel");
//         if (fetchError) throw fetchError;

//         if (data) {
//           // Sort by date descending, then time ascending
//           const sorted = (data as Booking[]).sort((a, b) => {
//             if (a.date !== b.date) return b.date.localeCompare(a.date);
//             return a.start_time.localeCompare(b.start_time);
//           });
//           setAllBookings(sorted);
//         }
//       } catch (err: any) {
//         setError(err.message);
//       }
//       setLoading(false);
//     })();
//   }, [session, navigate]);

//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#000",
//       minHeight: "100vh",
//       color: "#fff",
//       padding: "20px",
//     },
//     container: {
//       maxWidth: "800px",
//       margin: "0 auto",
//       background: "#111",
//       borderRadius: 8,
//       padding: 20,
//       position: "relative",
//     },
//     homeBtn: {
//       position: "absolute",
//       top: 16,
//       right: 16,
//       fontSize: 24,
//       color: "#0af",
//       cursor: "pointer",
//     },
//     title: {
//       color: "#3b7",
//       fontSize: "1.5rem",
//       marginBottom: 16,
//     },
//     tableWrapper: {
//       overflowX: "auto",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       background: "#fff",
//       color: "#000",
//     },
//     th: {
//       padding: 8,
//       border: "1px solid #ccc",
//       background: "#247",
//       color: "#cff",
//     },
//     td: {
//       padding: 8,
//       border: "1px solid #ccc",
//       textAlign: "center",
//     },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error)   return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome
//           style={styles.homeBtn}
//           onClick={() => navigate("/login")}
//           title="Home"
//         />
//         <h1 style={styles.title}>My Bookings</h1>

//         <div style={styles.tableWrapper}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Date</th>
//                 <th style={styles.th}>Time</th>
//                 <th style={styles.th}>Service</th>
//                 <th style={styles.th}>Category</th>
//                 <th style={styles.th}>Patient</th>
//                 <th style={styles.th}>Phone</th>
//                 <th style={styles.th}>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allBookings.map((b) => (
//                 <tr key={b.id}>
//                   <td style={styles.td}>{b.date}</td>
//                   <td style={styles.td}>{b.start_time}</td>
//                   <td style={styles.td}>{b.service}</td>
//                   <td style={styles.td}>{b.cat}</td>
//                   <td style={styles.td}>{b.patientName}</td>
//                   <td style={styles.td}>{b.telNumber}</td>
//                   <td style={styles.td}>{b.email || "—"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // File: src/pages/teacher/BookingBoard.tsx
// File: src/pages/patient/MyBooking.tsx
// File: src/pages/patient/MyBooking.tsx

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaHome, FaUserAlt } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;           // YYYY-MM-DD
//   pending: string | null; // null, "Attending" or "Cancelled"
// }

// export default function MyBooking() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // date-range filter
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);
//   const [showCalendar, setShowCalendar] = useState(true);
//   const [lastChanged, setLastChanged] = useState<"start" | "end" | null>(
//     null
//   );

//   // ── redirect non-patients ────────────────────────────────────────────────
//   useEffect(() => {
//     if (!session) return navigate("/sign-in");
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Patient") navigate("/");
//     })();
//   }, [session, navigate]);

//   // ── load bookings ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!session) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("customerID", session.user.id);
//         if (error) throw error;
//         const sorted = (data as Booking[]).sort((a, b) =>
//           a.date !== b.date
//             ? b.date.localeCompare(a.date)
//             : a.start_time.localeCompare(b.start_time)
//         );
//         setAllBookings(sorted);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session]);

//   // ── toggle Attending ↔ Cancelled ────────────────────────────────────────
//   const toggleStatus = async (b: Booking) => {
//     const newStatus =
//       (b.pending || "Attending") === "Attending" ? "Cancelled" : "Attending";
//     await supabase
//       .from("bookings")
//       .update({ pending: newStatus })
//       .eq("id", b.id);
//     setAllBookings((prev) =>
//       prev.map((x) => (x.id === b.id ? { ...x, pending: newStatus } : x))
//     );
//   };

//   // ── filter logic ────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings.filter((b) => {
//       const d = new Date(b.date);
//       if (!showCalendar) {
//         return d >= s0 && d <= e0;
//       }
//       if (lastChanged === "start") {
//         return d >= s0;
//       }
//       if (lastChanged === "end") {
//         return d <= e0;
//       }
//       return true;
//     });
//   }, [allBookings, range, showCalendar, lastChanged]);

//   // ── group by date ───────────────────────────────────────────────────────
//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // ── styles ─────────────────────────────────────────────────────────────
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#121212",
//       minHeight: "100vh",
//       color: "#EEE",
//       padding: "2rem",
//       fontFamily: "Segoe UI, sans-serif",
//     },
//     container: {
//       maxWidth: 900,
//       margin: "0 auto",
//       background: "#1E1E1E",
//       borderRadius: 12,
//       padding: "2rem",
//       position: "relative",
//       boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//     },
//     homeBtn: {
//       position: "absolute",
//       top: 16,
//       right: 16,
//       fontSize: 24,
//       color: "#4A90E2",
//       cursor: "pointer",
//     },
//     profileBtn: {
//       position: "absolute",
//       top: 16,
//       right: 56,
//       fontSize: 20,
//       color: "#4A90E2",
//       cursor: "pointer",
//     },
//     title: {
//       fontSize: "2rem",
//       fontWeight: 600,
//       marginBottom: "1rem",
//       color: "#4A90E2",
//       textAlign: "center",
//     },
//     controls: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       gap: "1rem",
//       marginBottom: "1.5rem",
//     },
//     dateRange: {
//       border: "1px solid #333",
//       borderRadius: 8,
//       overflow: "hidden",
//     },
//     dateButton: {
//       padding: "0.5rem 1rem",
//       borderRadius: 6,
//       background: "#2A2A2A",
//       color: "#EEE",
//       border: "1px solid #333",
//       cursor: "pointer",
//       fontSize: "1rem",
//     },
//     dateButtonOutline: {
//       outline: "2px solid #4A90E2",
//     },
//     dateHeader: {
//       marginTop: "2rem",
//       marginBottom: "0.5rem",
//       fontWeight: 600,
//       color: "#F23657",
//     },
//     tableWrapper: {
//       overflowX: "auto",
//       marginBottom: "2rem",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//       borderRadius: 8,
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       background: "#FFF",
//       color: "#222",
//       borderRadius: 8,
//       overflow: "hidden",
//     },
//     th: {
//       padding: "0.75rem 1rem",
//       background: "#4A90E2",
//       color: "#FFF",
//       textTransform: "uppercase",
//       fontSize: "0.875rem",
//       textAlign: "left",
//     },
//     td: {
//       padding: "1rem",
//       borderBottom: "1px solid #EEE",
//       textAlign: "left",
//       verticalAlign: "middle",
//     },
//     select: {
//       padding: "0.5rem",
//       borderRadius: 6,
//       border: "1px solid #333",
//       background: "#2A2A2A",
//       color: "#EEE",
//       cursor: "pointer",
//       fontSize: "1rem",
//     },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   const { startDate, endDate } = range[0];

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome
//           style={styles.homeBtn}
//           onClick={() => navigate("/")}
//           title="Home"
//         />
//         <FaUserAlt
//           style={styles.profileBtn}
//           onClick={() => navigate("/login")}
//           title="Profile"
//         />

//         <h1 style={styles.title}>My Bookings</h1>

//         {/* Date Picker / Buttons */}
//         <div style={styles.controls}>
//           {showCalendar ? (
//             <div style={styles.dateRange}>
//               <DateRange
//                 ranges={range}
//                 retainEndDateOnFirstSelection
//                 onChange={(item: RangeKeyDict) => {
//                   let { startDate, endDate } = item.selection;
//                   if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
//                   setRange([{ ...item.selection, startDate, endDate }]);
//                   const prev = range[0];
//                   if (startDate!.getTime() !== prev.startDate!.getTime()) {
//                     setLastChanged("start");
//                   } else {
//                     setLastChanged("end");
//                   }
//                   if (startDate && endDate) setShowCalendar(false);
//                 }}
//                 rangeColors={["#4A90E2"]}
//               />
//             </div>
//           ) : (
//             <>
//               <button
//                 style={{
//                   ...styles.dateButton,
//                   ...(lastChanged === "start" ? styles.dateButtonOutline : {})
//                 }}
//                 onClick={() => setShowCalendar(true)}
//               >
//                 {startDate!.toLocaleDateString()}
//               </button>
//               <span>–</span>
//               <button
//                 style={{
//                   ...styles.dateButton,
//                   ...(lastChanged === "end" ? styles.dateButtonOutline : {})
//                 }}
//                 onClick={() => setShowCalendar(true)}
//               >
//                 {endDate!.toLocaleDateString()}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Bookings by Date */}
//         {Object.entries(grouped).map(([date, list]) => (
//           <div key={date}>
//             <h2 style={styles.dateHeader}>
//               {new Date(date).toLocaleDateString()} — {list.length}{" "}
//               {list.length > 1 ? "bookings" : "booking"}
//             </h2>
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Time</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                     <th style={styles.th}>Patient</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map((b) => (
//                     <tr key={b.id}>
//                       <td style={styles.td}>{b.start_time}</td>
//                       <td style={styles.td}>
//                         <select
//                           style={styles.select}
//                           value={b.pending || "Attending"}
//                           onChange={() => toggleStatus(b)}
//                         >
//                           <option>Attending</option>
//                           <option>Cancelled</option>
//                         </select>
//                       </td>
//                       <td style={styles.td}>{b.cat}</td>
//                       <td style={styles.td}>{b.service}</td>
//                       <td style={styles.td}>{b.patientName}</td>
//                       <td style={styles.td}>{b.telNumber}</td>
//                       <td style={styles.td}>{b.email || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

import React, {
  useState,
  useEffect,
  useMemo,
  CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaHome } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Booking {
  id: number;
  createdAt: string;
  patientName: string;
  telNumber: string;
  email: string;
  start_time: string;
  cat: string;
  service: string;
  date: string;           // YYYY-MM-DD
  pending: string | null; // null, "Attending" or "Cancelled"
  medication?: string | null;   // ✅ new
  amount?: string | null; 
}

export default function MyBooking() {
  const { session } = useSession();
  const navigate = useNavigate();

  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // date-range filter
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [lastChanged, setLastChanged] = useState<"start" | "end" | null>(
    null
  );

  // → redirect non-patients
  useEffect(() => {
    if (!session) return navigate("/sign-in");
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data?.role !== "Patient") navigate("/");
    })();
  }, [session, navigate]);

  // → load bookings
  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("customerID", session.user.id);
        if (error) throw error;
        // sort by date desc, then time asc
        const sorted = (data as Booking[]).sort((a, b) =>
          a.date !== b.date
            ? b.date.localeCompare(a.date)
            : a.start_time.localeCompare(b.start_time)
        );
        setAllBookings(sorted);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  // → toggle Attending ↔ Cancelled
  const toggleStatus = async (b: Booking) => {
    const newStatus =
      (b.pending || "Attending") === "Attending"
        ? "Cancelled"
        : "Attending";
    await supabase
      .from("bookings")
      .update({ pending: newStatus })
      .eq("id", b.id);
    setAllBookings((prev) =>
      prev.map((x) =>
        x.id === b.id ? { ...x, pending: newStatus } : x
      )
    );
  };


  // …inside your MyBooking component…

// 1) Add showCalendar and lastChanged to your deps:
const filtered = useMemo(() => {
  const s0 = range[0].startDate!;
  const e0 = range[0].endDate!;
  return allBookings.filter((b) => {
    const d = new Date(b.date);
    // If the calendar is collapsed (i.e. you've picked both), do the full range:
    if (!showCalendar) {
      return d >= s0 && d <= e0;
    }
    // Otherwise if you only just picked START, show everything from that day on:
    if (lastChanged === "start") {
      return d >= s0;
    }
    // Or if you only just picked END, show everything up to that day:
    if (lastChanged === "end") {
      return d <= e0;
    }
    // Before you pick anything, show all bookings:
    return true;
  });
}, [allBookings, range, showCalendar, lastChanged]);

  // → group by date
  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
      (acc[b.date] ||= []).push(b);
      return acc;
    }, {});
  }, [filtered]);

  // → styles
  const styles: Record<string, CSSProperties> = {
    page: {
      background: "#000",
      minHeight: "100vh",
      color: "#fff",
      padding: 20,
    },
    container: {
      maxWidth: 900,
      margin: "0 auto",
      background: "#111",
      borderRadius: 8,
      padding: 20,
      position: "relative",
    },
    homeBtn: {
      position: "absolute",
      top: 16,
      right: 16,
      fontSize: 24,
      color: "#0af",
      cursor: "pointer",
    },
    homeBtn2: {
      position: "absolute",
      top: 19.8,
      right: 62,
      fontSize: 19,
      color: "#0af",
     
      cursor: "pointer",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 600,
      marginBottom: 16,
      color: "#3b7",
    },
    controls: {
      display: "flex",
      gap: 10,
      marginBottom: 20,
      alignItems: "center",
    },
    dateRange: {
      padding: 2,
      background: "rgb(5,234,255)",
      borderRadius: 0,
    },
    dateButton: {
      padding: "8px 12px",
      borderRadius: 4,
      background: "#222",
      color: "#fff",
      border: "1px solid #444",
      cursor: "pointer",
      outline:
        lastChanged === "start"
          ? "2px solid cyan"
          : lastChanged === "end"
          ? "2px solid magenta"
          : undefined,
    },
    dateHeader: {
      marginTop: 24,
      marginBottom: 8,
      fontWeight: 600,
      color: "rgb(255,67,126)",
    },
    tableWrapper: {
      overflowX: "auto",
      marginBottom: 24,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      color: "#000",
    },
    th: {
      padding: 8,
      border: "1px solid #ccc",
      background: "rgba(28,65,199,0.92)",
      color: "rgb(0,255,251)",
    },
    td: {
      padding: 8,
      border: "1px solid #ccc",
      textAlign: "center",
    },
    statusSelect: {
      padding: 4,
      borderRadius: 4,
      border: "1px solid #666",
      background: "#222",
      color: "#fff",
      cursor: "pointer",
    },
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error) return <div style={styles.page}>Error: {error}</div>;

  const { startDate, endDate } = range[0];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <FaHome
          style={styles.homeBtn}
          onClick={() => navigate("/")}
          title="Home"
        />
      
        <FaUserAlt
          style={styles.homeBtn2}
          onClick={() => navigate("/login")}
          title="Profile"
        />
        <h1 style={styles.title}>My Bookings</h1>

        {/* ── Date Picker / Buttons ──────────────────── */}
        <div style={styles.controls}>
          {showCalendar ? (
            <div style={styles.dateRange}>
              <DateRange
                ranges={range}
                  retainEndDateOnFirstSelection
                  onChange={(item: RangeKeyDict) => {
                   let { startDate, endDate } = item.selection;
                   // if user picked “end” before “start”, swap for you
                   if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
                   setRange([{ ...item.selection, startDate, endDate }]);
                
                  // detect which changed
                  const prev = range[0];
                  if (
                    startDate.getTime() !== prev.startDate!.getTime()
                  ) {
                    setLastChanged("start");
                  } else if (
                    endDate.getTime() !== prev.endDate!.getTime()
                  ) {
                    setLastChanged("end");
                  }
                  setRange([{ ...item.selection, startDate, endDate }]);
                  // only collapse once both picked
                  if (startDate && endDate) {
                    setShowCalendar(false);
                  }
                }}
                rangeColors={["rgba(105,133,247,0.92)"]}
              />
            </div>
          ) : (
            <>
              <button
                style={styles.dateButton}
                onClick={() => setShowCalendar(true)}
              >
                {startDate!.toLocaleDateString("en-GB")}
              </button>
              <span>–</span>
              <button
                style={{
                  ...styles.dateButton,
                  outline:
                    lastChanged === "end"
                      ? "2px solid magenta"
                      : undefined,
                }}
                onClick={() => setShowCalendar(true)}
              >
                {endDate!.toLocaleDateString("en-GB")}
              </button>
            </>
          )}
        </div>

        {/* ── Bookings by Date ──────────────────────── */}
        {Object.entries(grouped).map(([date, list]) => (
          <div key={date}>
            <h2 style={styles.dateHeader}>
              {new Date(date).toLocaleDateString("en-GB")} —{" "}
              {list.length} {list.length > 1 ? "bookings" : "booking"}
            </h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Medication</th> {/* ✅ new */}
                    <th style={styles.th}>Amount</th>  
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((b) => {
                    const status = b.pending || "Attending";
                    return (
                      <tr key={b.id}>
                        <td style={styles.td}>{b.start_time}</td>
                        <td style={styles.td}>
                          <select
                            style={styles.statusSelect}
                            value={status}
                            onChange={() => toggleStatus(b)}
                          >
                            <option>Attending</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                        <td style={styles.td}>{b.cat}</td>
                        <td style={styles.td}>{b.service}</td>
                        <td style={styles.td}>{b.medication || "—"}</td>
                        <td style={styles.td}>{b.amount || "—"}</td>
                        <td style={styles.td}>{b.patientName}</td>
                        <td style={styles.td}>{b.telNumber}</td>
                        <td style={styles.td}>{b.email || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaHome } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;           // YYYY-MM-DD
//   pending: string | null; // null, "Attending" or "Cancelled"
// }

// export default function MyBooking() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" }
//   ]);

//   // → Redirect non‐patients
//   useEffect(() => {
//     if (!session) return navigate("/sign-in");
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Patient") navigate("/");
//     })();
//   }, [session, navigate]);

//   // → Load this patient's bookings
//   useEffect(() => {
//     if (!session) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("customerID", session.user.id);
//         if (error) throw error;
//         // sort newest date first, then time ascending
//         const sorted = (data as Booking[]).sort((a, b) =>
//           a.date !== b.date
//             ? b.date.localeCompare(a.date)
//             : a.start_time.localeCompare(b.start_time)
//         );
//         setAllBookings(sorted);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session]);

//   // → Toggle between Attending ↔ Cancelled
//   const toggleStatus = async (b: Booking) => {
//     const newStatus =
//       (b.pending || "Attending") === "Attending"
//         ? "Cancelled"
//         : "Attending";
//     await supabase
//       .from("bookings")
//       .update({ pending: newStatus })
//       .eq("id", b.id);
//     setAllBookings((prev) =>
//       prev.map((x) =>
//         x.id === b.id ? { ...x, pending: newStatus } : x
//       )
//     );
//   };

//   // → Filter by date-range + text searches
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings.filter((b) => {
//       const d = new Date(b.date);
//       if (d < s0 || d > e0) return false;
//       if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//       if (
//         searchName &&
//         !b.patientName.toLowerCase().includes(searchName.toLowerCase())
//       )
//         return false;
//       if (
//         searchEmail &&
//         !b.email.toLowerCase().includes(searchEmail.toLowerCase())
//       )
//         return false;
//       return true;
//     });
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   // → Group into { "YYYY-MM-DD": [bookings...] }
//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // → Inline styles
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#000",
//       minHeight: "100vh",
//       color: "#fff",
//       padding: "20px",
//     },
//     container: {
//       maxWidth: 900,
//       margin: "0 auto",
//       background: "#111",
//       borderRadius: 8,
//       padding: 20,
//       position: "relative",
//     },
//     homeBtn: {
//       position: "absolute",
//       top: 16,
//       right: 16,
//       fontSize: 24,
//       color: "#0af",
//       cursor: "pointer",
//     },
//     title: {
//       fontSize: "1.5rem",
//       fontWeight: 600,
//       marginBottom: 16,
//       color: "#3b7",
//     },
//     controls: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: 10,
//       marginBottom: 20,
//     },
//     input: {
//       flex: "1 1 200px",
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//     },
//     dateRange: {
//       padding: 2,
//       background: "rgb(5,234,255)",
//       borderRadius: 0,
//     },
//     dateHeader: {
//       marginTop: 24,
//       marginBottom: 8,
//       fontWeight: 600,
//       color: "rgb(255,67,126)",
//     },
//     tableWrapper: {
//       overflowX: "auto",
//       marginBottom: 24,
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       background: "#fff",
//       color: "#000",
//     },
//     th: {
//       padding: 8,
//       border: "1px solid #ccc",
//       background: "rgba(28,65,199,0.92)",
//       color: "rgb(0,255,251)",
//     },
//     td: {
//       padding: 8,
//       border: "1px solid #ccc",
//       textAlign: "center",
//     },
//     statusSelect: {
//       padding: 4,
//       borderRadius: 4,
//       border: "1px solid #666",
//       background: "#222",
//       color: "#fff",
//       cursor: "pointer",
//     },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome
//           style={styles.homeBtn}
//           onClick={() => navigate("/login")}
//           title="Home"
//         />
//         <h1 style={styles.title}>My Bookings</h1>

//         {/* ── Filters ─────────────────────────────────── */}
//         <div style={styles.controls}>
//           <div style={styles.dateRange}>
//             <DateRange
//               ranges={range}
//               moveRangeOnFirstSelection
//               onChange={(item: RangeKeyDict) =>
//                 setRange([item.selection])
//               }
//               rangeColors={["rgba(105,133,247,0.92)"]}
//             />
//           </div>
//         </div>

//         {/* ── Grouped by Date ────────────────────────── */}
//         {Object.entries(grouped).map(([date, list]) => (
//           <div key={date}>
//             <h2 style={styles.dateHeader}>
//               {new Date(date).toLocaleDateString("en-GB")} —{" "}
//               {list.length}{" "}
//               {list.length > 1 ? "bookings" : "booking"}
//             </h2>

//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Time</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                     <th style={styles.th}>Patient</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map((b) => {
//                     const status = b.pending || "Attending";
//                     return (
//                       <tr key={b.id}>
//                         <td style={styles.td}>{b.start_time}</td>
//                         <td style={styles.td}>
//                           <select
//                             style={styles.statusSelect}
//                             value={status}
//                             onChange={() => toggleStatus(b)}
//                           >
//                             <option>Attending</option>
//                             <option>Cancelled</option>
//                           </select>
//                         </td>
//                         <td style={styles.td}>{b.cat}</td>
//                         <td style={styles.td}>{b.service}</td>
//                         <td style={styles.td}>{b.patientName}</td>
//                         <td style={styles.td}>{b.telNumber}</td>
//                         <td style={styles.td}>{b.email || "—"}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaWhatsapp, FaEnvelope, FaHome } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string; // YYYY-MM-DD
// }

// export default function MyBooking() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // state
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");

//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" }
//   ]);

//   // auth+role guard
//   useEffect(() => {
//     if (!session) return navigate("/sign-in");
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Patient") navigate("/");
//     })();
//   }, [session, navigate]);

//   // fetch bookings
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("customerID", session!.user.id);
//         if (error) throw error;
//         setAllBookings(data as Booking[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // filter + sort + group
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings
//       .filter(b => {
//         // date range
//         const d = new Date(b.date);
//         if (d < s0 || d > e0) return false;
//         // phone, name, email
//         if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//         if (searchName && !b.patientName.toLowerCase().includes(searchName.toLowerCase())) return false;
//         if (searchEmail && !b.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
//         return true;
//       })
//       .sort((a, b) => {
//         // first by date ascending
//         if (a.date !== b.date) return a.date < b.date ? -1 : 1;
//         // then by time ascending
//         return a.start_time < b.start_time ? -1 : 1;
//       });
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // styles
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#000",
//       minHeight: "100vh",
//       overflowY: "auto",  
//       color: "#fff",
//       padding: "5px"
//     },
//     container: {
//       maxWidth: "1200px",
//       marginTop: "10px",
//       position: "relative",
//       paddingLeft: "20px",
//       paddingRight: "20px",
//       paddingTop: "30px",
//       background: "#111",
//       borderRadius: "8px",
//       boxShadow: "0px 0px 300px rgba(77, 89, 141, 0.97)",
//     },
//     homeBtn: {
//       position: "absolute",
//       top: "16px",
//       right: "16px",
//       fontSize: "24px",
//       color: "rgb(10, 239, 247)",
//       cursor: "pointer"
      
//     },
//     title: {
//         color: "rgba(49, 91, 241, 0.92)",    // ← use `color` not `font-color`
//         fontSize: "1.5rem",         // you can also add fontSize, fontWeight, etc.
//         fontWeight: 600,
//         marginBottom: '15px',

//     },
//     controls: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "10px",
//       marginBottom: "20px"    },

//     input: {
//       padding: "8px",
//       borderRadius: "4px",
//       border: "1px solid #444",
//       background: "#222",
      
//       color: "#fff",
//       flex: "1 1 200px"
//     },
//     dateRange: {
        
//         borderRadius: "0px",         // rounded corners
//         backgroundColor: "rgb(5, 234, 255)",  // whatever dark bg you like
//         padding: "2px",
//     },
//     tableWrapper: {
//       overflowX: "auto",
//       marginBottom: "30px"
//     },
//     table: {
//       width: "100%",
//       minWidth: "600px",
//       borderCollapse: "collapse",
//       background: "#fff",
//       color: "#000"
//     },
//     th: {
//       padding: "8px",
//       border: "1px solid #ccc",
//       background: "rgba(28, 65, 199, 0.92)",
//       color: "rgb(0, 255, 251)",
     
//     },
//     date: {
//       padding: "8px",
//       color: "rgb(255, 67, 126)",
     
//     },
//     td: {
//       padding: "8px",
//       border: "1px solid #ccc",
//       textAlign: "center"
//     },
//     mobileIcon: {
//       fontSize: "20px",
//       cursor: "pointer"
//     }
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error)   return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome
//           style={styles.homeBtn}
//           onClick={() => navigate("/login")}
//           title="Home"
//         />

//         <h1 style={styles.title}>Bookings</h1>

//         <div style={styles.controls}>
//           <input
//             placeholder="Search Phone…"
//             value={searchPhone}
//             onChange={e => setSearchPhone(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Name…"
//             value={searchName}
//             onChange={e => setSearchName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Email…"
//             value={searchEmail}
//             onChange={e => setSearchEmail(e.target.value)}
//             style={styles.input}
//           />
//           <div style={styles.dateRange}>
//             <DateRange
//               onChange={(item: RangeKeyDict) => setRange([item.selection])}
//               moveRangeOnFirstSelection
//               ranges={range}
//               rangeColors={["rgba(105, 133, 247, 0.92)"]}
//             />
//           </div>
//         </div>

//         {Object.entries(grouped).map(([date, list]) => (
//           <div key={date}>
//             <h2 style={styles.date}>
//               {date} — {list.length} result{list.length !== 1 && "s"}
//             </h2>

//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Time</th>
//                     <th style={styles.th}>Patient</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map(b => {
//                     // normalize for WhatsApp
//                     const clean = b.telNumber.replace(/^0+/, "");
//                     const full = clean.startsWith("+") ? clean : "+44" + clean;
//                     return (
//                       <tr key={b.id}>
//                         <td style={styles.td}>{b.start_time}</td>
//                         <td style={styles.td}>{b.patientName}</td>
//                         <td style={styles.td}>
//                           {window.innerWidth < 768 ? (
//                             <FaWhatsapp
//                               style={styles.mobileIcon}
//                               onClick={() =>
//                                 window.open(`https://wa.me/${full}`, "_blank")
//                               }
//                             />
//                           ) : (
//                             full
//                           )}
//                         </td>
//                         <td style={styles.td}>
//                           {b.email ? (
//                             window.innerWidth < 768 ? (
//                               <FaEnvelope
//                                 style={styles.mobileIcon}
//                                 onClick={() =>
//                                   window.location.assign(`mailto:${b.email}`)
//                                 }
//                               />
//                             ) : (
//                               b.email
//                             )
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                         <td style={styles.td}>{b.cat}</td>
//                         <td style={styles.td}>{b.service}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}

//         {filtered.length === 0 && (
//           <p>No bookings for the selected range.</p>
//         )}
//       </div>
//     </div>
//   );
// }
