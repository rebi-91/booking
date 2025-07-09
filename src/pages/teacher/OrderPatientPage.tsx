
// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaHome, FaUserAlt } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Order {
//   id: number;
//   createdAt: string;
//   customerID: string;
//   service: string;
//   treatment: string;
//   dosage: string;
//   date: string;
//   status: string;
// }

// interface Profile {
//   id: string;
//   full_name: string;
// }

// export default function OrderingPatientPage() {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Track dropdown values locally before ordering
//   const [selectedDosages, setSelectedDosages] = useState<Record<number, string>>({});

//   // Date range filter
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);
//   const [showCalendar, setShowCalendar] = useState(true);
//   const [lastChanged, setLastChanged] = useState<"start" | "end" | null>(null);

//   // Load orders and profiles
//   useEffect(() => {
//     if (!session) return;
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data: ordersData, error: ordersError } = await supabase
//           .from("orders")
//           .select("*");
//         const { data: profilesData, error: profilesError } = await supabase
//           .from("profiles")
//           .select("id, full_name");
//         if (ordersError || profilesError) throw ordersError || profilesError;
//         setAllOrders(ordersData as Order[]);
//         setProfiles(profilesData as Profile[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [session]);

//   // Filter orders by selected date range
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allOrders.filter(order => {
//       const d = new Date(order.date);
//       if (!showCalendar) return d >= s0 && d <= e0;
//       if (lastChanged === "start") return d >= s0;
//       if (lastChanged === "end") return d <= e0;
//       return true;
//     });
//   }, [allOrders, range, showCalendar, lastChanged]);

//   // Group orders by date
//   const grouped = useMemo(() =>
//     filtered.reduce<Record<string, Order[]>>((acc, order) => {
//       (acc[order.date] ||= []).push(order);
//       return acc;
//     }, {}),
//   [filtered]
//   );

//   // Find profile by customerID
//   const getProfile = (customerID: string) =>
//     profiles.find(p => p.id === customerID);

//   // Optimistic dosage change + DB update
//  const handleDosageChange = async (orderId: number, newDosage: string) => {
//   // Optimistic UI update
//   setAllOrders(prev =>
//     prev.map(o =>
//       o.id === orderId ? { ...o, dosage: newDosage } : o
//     )
//   );

//   // Update in database
//   try {
//     const { error } = await supabase
//       .from("orders")
//       .update({ dosage: newDosage })
//       .eq("id", orderId);
    
//     if (error) throw error;
//   } catch (e: any) {
//     setError(e.message);
//     // Revert optimistic update if failed
//     setAllOrders(prev =>
//       prev.map(o =>
//         o.id === orderId ? { ...o, dosage: o.dosage } : o
//       )
//     );
//   }
// };

//   // Place a new order: compute next id, copy fields, set status
//   const handleOrder = async (order: Order, dosage: string) => {
//     try {
//       const maxId = allOrders.length
//         ? Math.max(...allOrders.map(o => o.id))
//         : 0;
//       const nextId = maxId + 1;
//       const today = new Date().toISOString().split('T')[0];
//       const now = new Date().toISOString();

//       const newOrder: Order = {
//         id: nextId,
//         customerID: order.customerID,
//         service: order.service,
//         treatment: order.treatment,
//         dosage,
//         date: today,
//         status: "Ordered",
//         createdAt: now,
//       };

//       // Optimistically update UI
//       setAllOrders(prev => [...prev, newOrder]);

//       // Persist
//       const { error } = await supabase
//         .from("orders")
//         .insert([ newOrder ]);
//       if (error) throw error;
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   // Cancel an order
//   const handleCancel = async (orderId: number) => {
//     try {
//       const { error } = await supabase
//         .from("orders")
//         .update({ status: "Cancelled" })
//         .eq("id", orderId);
//       if (error) throw error;
//       setAllOrders(prev =>
//         prev.map(o =>
//           o.id === orderId ? { ...o, status: "Cancelled" } : o
//         )
//       );
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   // Styles
//   const styles: Record<string, CSSProperties> = {
//     page: { background: "#000", minHeight: "100vh", color: "#fff", padding: 20 },
//     container: { maxWidth: 900, margin: "0 auto", background: "#111", borderRadius: 8, padding: 20, position: "relative" },
//     homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#0af", cursor: "pointer" },
//     homeBtn2: { position: "absolute", top: 19.8, right: 62, fontSize: 19, color: "#0af", cursor: "pointer" },
//     title: { fontSize: "1.5rem", fontWeight: 600, marginBottom: 16, color: "#3b7" },
//     controls: { display: "flex", gap: 10, marginBottom: 20, alignItems: "center" },
//     dateRange: { padding: 2, background: "rgb(5,234,255)", borderRadius: 0 },
//     dateButton: { padding: "8px 12px", borderRadius: 4, background: "#222", color: "#fff", border: "1px solid #444", cursor: "pointer" },
//     dateHeader: { marginTop: 24, marginBottom: 8, fontWeight: 600, color: "rgb(255,67,126)" },
//     tableWrapper: { overflowX: "auto", marginBottom: 24 },
//     table: { width: "100%", borderCollapse: "collapse", background: "#fff", color: "#000" },
//     th: { padding: 8, border: "1px solid #ccc", background: "rgba(28,65,199,0.92)", color: "rgb(0,255,251)" },
//     td: { padding: 8, border: "1px solid #ccc", textAlign: "center" },
//     select: { padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" },
//     orderBtn: { padding: "6px 12px", borderRadius: "20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" },
//     cancelBtn: { padding: "6px 12px", borderRadius: "20px", background: "#dc3545", color: "white", border: "none", cursor: "pointer" },
//   };

//   if (loading) return <div style={styles.page}>Loading...</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome style={styles.homeBtn} onClick={() => navigate("/")} title="Home" />
//         <FaUserAlt style={styles.homeBtn2} onClick={() => navigate("/login")} title="Profile" />
//         <h1 style={styles.title}>Patient Orders</h1>

//         {/* Date Picker */}
//         <div style={styles.controls}>
//           {showCalendar ? (
//             <div style={styles.dateRange}>
//               <DateRange
//                 ranges={range}
//                 onChange={(item: RangeKeyDict) => {
//                   let { startDate, endDate } = item.selection;
//                   if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
//                   setRange([{ ...item.selection, startDate, endDate }]);
//                   if (startDate!.getTime() !== range[0].startDate!.getTime()) {
//                     setLastChanged("start");
//                   } else if (endDate!.getTime() !== range[0].endDate!.getTime()) {
//                     setLastChanged("end");
//                   }
//                   if (startDate && endDate) setShowCalendar(false);
//                 }}
//                 rangeColors={["rgba(105,133,247,0.92)"]}
//               />
//             </div>
//           ) : (
//             <>
//               <button style={styles.dateButton} onClick={() => setShowCalendar(true)}>
//                 {range[0].startDate!.toLocaleDateString("en-GB")}
//               </button>
//               <span>-</span>
//               <button style={styles.dateButton} onClick={() => setShowCalendar(true)}>
//                 {range[0].endDate!.toLocaleDateString("en-GB")}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Orders by date */}
//         {Object.entries(grouped).map(([date, orders]) => (
//           <div key={date}>
//             <h2 style={styles.dateHeader}>
//               {new Date(date).toLocaleDateString("en-GB")} - {orders.length} orders
//             </h2>
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Service</th>
//                     <th style={styles.th}>Treatment</th>
//                     <th style={styles.th}>Dosage</th>
//                     <th style={styles.th}>Patient</th>
//                     <th style={styles.th}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map(order => {
//                     const profile = getProfile(order.customerID);
//                     const selected = selectedDosages[order.id] ?? order.dosage ?? "Remain";
//                     return (
//                       <tr key={order.id}>
//                         <td style={styles.td}>{order.service}</td>
//                         <td style={styles.td}>{order.treatment}</td>
//                         <td style={styles.td}>
//                           <select
//                             style={styles.select}
//                             value={selected}
//                             onChange={e => handleDosageChange(order.id, e.target.value)}
//                           >
//                             <option value="Increase dosage">Increase dosage</option>
//                             <option value="Remain">Remain</option>
//                             <option value="Decrease dosage">Decrease dosage</option>
//                           </select>
//                         </td>
//                         <td style={styles.td}>{profile?.full_name || "Unknown"}</td>
//                         <td style={styles.td}>
//                           {order.status === "Ordered" ? (
//                             <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>
//                               Cancel
//                             </button>
//                           ) : (
//                             <button style={styles.orderBtn} onClick={() => handleOrder(order, selected)}>
//                               Order
//                             </button>
//                           )}
//                         </td>
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
import React, { useState, useEffect, useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaHome } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Order {
  id: number;
  createdAt: string;
  customerID: string;
  service: string;
  treatment: string;
  dosage: string;
  date: string;
  status: string;
}

export default function OrderingPatientPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Track dropdown values locally
  const [selectedDosages, setSelectedDosages] = useState<Record<number, string>>({});

  // Date filter state
  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  }]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [lastChanged, setLastChanged] = useState<"start"|"end"|null>(null);

  useEffect(() => {
    if (!session) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("orders").select("*");
        if (error) throw error;
        setAllOrders(data as Order[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  const filtered = useMemo(() => {
    const s0 = range[0].startDate!;
    const e0 = range[0].endDate!;
    return allOrders.filter(o => {
      const d = new Date(o.date);
      if (!showCalendar) return d >= s0 && d <= e0;
      if (lastChanged === "start") return d >= s0;
      if (lastChanged === "end") return d <= e0;
      return true;
    });
  }, [allOrders, range, showCalendar, lastChanged]);

  const grouped = useMemo(() =>
    filtered.reduce<Record<string, Order[]>>((acc, o) => {
      (acc[o.date] ||= []).push(o);
      return acc;
    }, {}), [filtered]
  );

  // Change dosage locally + update DB
  const handleDosageChange = async (orderId: number, newDosage: string) => {
    setAllOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, dosage: newDosage } : o
    ));
    try {
      const { error } = await supabase
        .from("orders")
        .update({ dosage: newDosage })
        .eq("id", orderId);
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Create a new order if not already ordered
  const handleOrder = async (order: Order, dosage: string) => {
    // Prevent duplicates: same customerID + treatment with status 'Ordered'
    const exists = allOrders.some(o =>
      o.customerID === order.customerID &&
      o.treatment === order.treatment &&
      o.status === "Ordered"
    );
    if (exists) {
      alert(
        `You already have an active order for '${order.treatment}'. Please wait for it to be processed.`
      );
      return;
    }

    try {
      const maxId = allOrders.length ? Math.max(...allOrders.map(o => o.id)) : 0;
      const nextId = maxId + 1;
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: nextId,
        customerID: order.customerID,
        service: order.service,
        treatment: order.treatment,
        dosage,
        date: today,
        status: "Ordered",
        createdAt: now,
      };

      setAllOrders(prev => [...prev, newOrder]);
      const { error } = await supabase.from("orders").insert([newOrder]);
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Delete order
  const handleCancel = async (orderId: number) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      setAllOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: { background: "#121212", minHeight: "100vh", color: "#EEE", padding: "2rem", fontFamily: "Segoe UI, sans-serif" },
    container: { maxWidth: 1200, margin: "0 auto", padding: "2rem", background: "#1E1E1E", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", position: "relative" },
    homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#4A90E2", cursor: "pointer" },
    title: { color: "#4A90E2", fontSize: "2rem", marginBottom: "1rem" },
    controls: { display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" },
    dateRange: { border: "1px solid #333", borderRadius: 8, overflow: "hidden" },
    tableWrapper: { overflowX: "auto", marginBottom: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", borderRadius: 8 },
    table: { width: "100%", minWidth: 700, borderCollapse: "collapse", background: "#FFF", color: "#222", borderRadius: 8, overflow: "hidden" },
    th: { padding: "0.75rem 1rem", background: "#4A90E2", color: "#FFF", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.05em", textAlign: "left" },
    td: { padding: "1rem", borderBottom: "1px solid #EEE", textAlign: "left", verticalAlign: "middle", fontSize: "0.95rem" },
    tr: { transition: "background .2s" },
    select: { padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" },
    orderBtn: { padding: "6px 12px", borderRadius: 20, background: "#28a745", color: "#FFF", border: "none", cursor: "pointer" },
    cancelBtn: { padding: "6px 12px", borderRadius: 20, background: "#dc3545", color: "#FFF", border: "none", cursor: "pointer" },
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error) return <div style={styles.page}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <FaHome style={styles.homeBtn} onClick={() => navigate("/")} title="Home" />
        <h1 style={styles.title}>Patient Orders</h1>

        <div style={styles.controls}>
          <div style={styles.dateRange}>
            <DateRange
              ranges={range}
              onChange={(item: RangeKeyDict) => {
                let { startDate, endDate } = item.selection;
                if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
                setRange([{ ...item.selection, startDate, endDate }]);
                if (startDate!.getTime() !== range[0].startDate!.getTime()) setLastChanged("start");
                else if (endDate!.getTime() !== range[0].endDate!.getTime()) setLastChanged("end");
                if (startDate && endDate) setShowCalendar(false);
              }}
              moveRangeOnFirstSelection
              rangeColors={["#4A90E2"]}
            />
          </div>
        </div>

        {Object.entries(grouped).map(([date, orders]) => (
          <div key={date} style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#F23657" }}>
              {new Date(date).toLocaleDateString("en-GB")} — {orders.length} order{orders.length!==1?"s":""}
            </h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Treatment</th>
                    <th style={styles.th}>Dosage</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr
                      key={o.id}
                      style={styles.tr}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <td style={styles.td}>{o.service}</td>
                      <td style={styles.td}>{o.treatment}</td>
                      <td style={styles.td}>
                        <select
                          style={styles.select}
                          value={selectedDosages[o.id] ?? o.dosage ?? "Remain"}
                          onChange={e => handleDosageChange(o.id, e.target.value)}
                        >
                          <option value="Increase dosage">Increase dosage</option>
                          <option value="Remain">Remain</option>
                          <option value="Decrease dosage">Decrease dosage</option>
                        </select>
                      </td>
                      <td style={styles.td}>{o.status}</td>
                      <td style={styles.td}>
                        {o.status === "Ordered" ? (
                          <button style={styles.cancelBtn} onClick={() => handleCancel(o.id)}>Delete</button>
                        ) : (
                          <button style={styles.orderBtn} onClick={() => handleOrder(o, selectedDosages[o.id] ?? o.dosage)}>
                            Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
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
// import { FaHome, FaUserAlt } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Order {
//   id: number;
//   createdAt: string;
//   customerID: string;
//   service: string;
//   treatment: string;
//   dosage: string;
//   date: string;
//   status: string;
// }

// export default function OrderingPatientPage() {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Track dropdown values locally before ordering
//   const [selectedDosages, setSelectedDosages] = useState<Record<number, string>>({});

//   // Date range filter
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);
//   const [showCalendar, setShowCalendar] = useState(true);
//   const [lastChanged, setLastChanged] = useState<"start" | "end" | null>(null);

//   // Load orders
//   useEffect(() => {
//     if (!session) return;
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase.from("orders").select("*");
//         if (error) throw error;
//         setAllOrders(data as Order[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [session]);

//   // Filter orders by date
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allOrders.filter(order => {
//       const d = new Date(order.date);
//       if (!showCalendar) return d >= s0 && d <= e0;
//       if (lastChanged === "start") return d >= s0;
//       if (lastChanged === "end") return d <= e0;
//       return true;
//     });
//   }, [allOrders, range, showCalendar, lastChanged]);

//   // Group orders by date
//   const grouped = useMemo(() =>
//     filtered.reduce<Record<string, Order[]>>((acc, order) => {
//       (acc[order.date] ||= []).push(order);
//       return acc;
//     }, {}),
//   [filtered]
//   );

//   // Update dosage
//   const handleDosageChange = async (orderId: number, newDosage: string) => {
//     setAllOrders(prev =>
//       prev.map(o => (o.id === orderId ? { ...o, dosage: newDosage } : o))
//     );
//     try {
//       const { error } = await supabase
//         .from("orders")
//         .update({ dosage: newDosage })
//         .eq("id", orderId);
//       if (error) throw error;
//     } catch (e: any) {
//       setError(e.message);
//       // No revert for brevity
//     }
//   };

//   // Place new order
//   const handleOrder = async (order: Order, dosage: string) => {
//     try {
//       const maxId = allOrders.length ? Math.max(...allOrders.map(o => o.id)) : 0;
//       const nextId = maxId + 1;
//       const today = new Date().toISOString().split("T")[0];
//       const now = new Date().toISOString();
//       const newOrder: Order = {
//         id: nextId,
//         customerID: order.customerID,
//         service: order.service,
//         treatment: order.treatment,
//         dosage,
//         date: today,
//         status: "Ordered",
//         createdAt: now,
//       };
//       setAllOrders(prev => [...prev, newOrder]);
//       const { error } = await supabase.from("orders").insert([newOrder]);
//       if (error) throw error;
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   // Cancel (delete) order
//   const handleCancel = async (orderId: number) => {
//     try {
//       const { error } = await supabase.from("orders").delete().eq("id", orderId);
//       if (error) throw error;
//       setAllOrders(prev => prev.filter(o => o.id !== orderId));
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   // Styles matching example
//   const styles: Record<string, CSSProperties> = {
//     page: { background: "#121212", minHeight: "100vh", color: "#EEE", padding: "2rem", fontFamily: "Segoe UI, sans-serif" },
//     container: { maxWidth: 1200, margin: "0 auto", padding: "2rem", background: "#1E1E1E", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", position: "relative" },
//     homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#4A90E2", cursor: "pointer" },
//     title: { color: "#4A90E2", fontSize: "2rem", marginBottom: "1rem" },
//     controls: { display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" },
//     input: { padding: "0.5rem 1rem", borderRadius: 6, border: "1px solid #333", background: "#2A2A2A", color: "#EEE", fontSize: "1rem", outline: "none" },
//     dateRange: { border: "1px solid #333", borderRadius: 8, overflow: "hidden" },
//     tableWrapper: { overflowX: "auto", marginBottom: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", borderRadius: 8 },
//     table: { width: "100%", minWidth: 700, borderCollapse: "collapse", background: "#FFF", color: "#222", borderRadius: 8, overflow: "hidden" },
//     th: { padding: "0.75rem 1rem", background: "#4A90E2", color: "#FFF", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.05em", textAlign: "left" },
//     td: { padding: "1rem", borderBottom: "1px solid #EEE", textAlign: "left", verticalAlign: "middle", fontSize: "0.95rem" },
//     tr: { transition: "background .2s" },
//     select: { padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" },
//     orderBtn: { padding: "6px 12px", borderRadius: 20, background: "#28a745", color: "#FFF", border: "none", cursor: "pointer" },
//     cancelBtn: { padding: "6px 12px", borderRadius: 20, background: "#dc3545", color: "#FFF", border: "none", cursor: "pointer" },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome style={styles.homeBtn} onClick={() => navigate("/")} title="Home" />
//         <h1 style={styles.title}>Patient Orders</h1>

//         {/* Date Picker */}
//         <div style={styles.controls}>
//           <div style={styles.dateRange}>
//             <DateRange
//               ranges={range}
//               onChange={(item: RangeKeyDict) => {
//                 let { startDate, endDate } = item.selection;
//                 if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
//                 setRange([{ ...item.selection, startDate, endDate }]);
//                 if (startDate!.getTime() !== range[0].startDate!.getTime()) setLastChanged("start");
//                 else if (endDate!.getTime() !== range[0].endDate!.getTime()) setLastChanged("end");
//                 if (startDate && endDate) setShowCalendar(false);
//               }}
//               moveRangeOnFirstSelection
//               rangeColors={["#4A90E2"]}
//             />
//           </div>
//         </div>

//         {Object.entries(grouped).map(([date, orders]) => (
//           <div key={date} style={{ marginBottom: "2rem" }}>
//             <h2 style={{ color: "#F23657" }}>
//               {new Date(date).toLocaleDateString("en-GB")} — {orders.length} order{orders.length!==1?"s":""}
//             </h2>
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Service</th>
//                     <th style={styles.th}>Treatment</th>
//                     <th style={styles.th}>Dosage</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map(order => (
//                     <tr
//                       key={order.id}
//                       style={styles.tr}
//                       onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
//                       onMouseLeave={e => (e.currentTarget.style.background = "")}
//                     >
//                       <td style={styles.td}>{order.service}</td>
//                       <td style={styles.td}>{order.treatment}</td>
//                       <td style={styles.td}>
//                         <select
//                           style={styles.select}
//                           value={selectedDosages[order.id] ?? order.dosage ?? "Remain"}
//                           onChange={e => handleDosageChange(order.id, e.target.value)}
//                         >
//                           <option value="Increase dosage">Increase dosage</option>
//                           <option value="Remain">Remain</option>
//                           <option value="Decrease dosage">Decrease dosage</option>
//                         </select>
//                       </td>
//                       <td style={styles.td}>{order.status}</td>
//                       <td style={styles.td}>
//                         {order.status === "Ordered" ? (
//                           <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>Delete</button>
//                         ) : (
//                           <button style={styles.orderBtn} onClick={() => handleOrder(order, selectedDosages[order.id] ?? order.dosage)}>Order</button>
//                         )}
//                       </td>
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

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext"; // Make sure this path is correct
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaHome, FaUserAlt } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// interface Order {
//   id: number;
//   createdAt: string;
//   customerID: string;
//   service: string;
//   treatment: string;
//   date: string;
//   status: string;
// }

// interface Profile {
//   id: string;
//   full_name: string;
//   email: string;
//   phone: string;
// }

// export default function OrderingPatientPage() {
//   const navigate = useNavigate(); // Fixed: Properly initialized navigate
//   const { session } = useSession(); // Fixed: Properly initialized session
//   const [allOrders, setAllOrders] = useState<Order[]>([]);
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Date range filter
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);
//   const [showCalendar, setShowCalendar] = useState(true);
//   const [lastChanged, setLastChanged] = useState<"start" | "end" | null>(null);

//   // Load orders and profiles
//   useEffect(() => {
//     if (!session) return;
    
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch orders
//         const { data: ordersData, error: ordersError } = await supabase
//           .from("orders")
//           .select("*");
        
//         // Fetch profiles
//         const { data: profilesData, error: profilesError } = await supabase
//           .from("profiles")
//           .select("*");
        
//         if (ordersError || profilesError) throw ordersError || profilesError;
        
//         setAllOrders(ordersData as Order[]);
//         setProfiles(profilesData as Profile[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [session]);


//   // Filter orders by date range
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allOrders.filter((order) => {
//       const d = new Date(order.date);
//       if (!showCalendar) return d >= s0 && d <= e0;
//       if (lastChanged === "start") return d >= s0;
//       if (lastChanged === "end") return d <= e0;
//       return true;
//     });
//   }, [allOrders, range, showCalendar, lastChanged]);

//   // Group orders by date
//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Order[]>>((acc, order) => {
//       (acc[order.date] ||= []).push(order);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // Match orders with profiles
//   const getProfile = (customerID: string) => {
//     return profiles.find(profile => profile.id === customerID);
//   };

//   // Styles
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#000",
//       minHeight: "100vh",
//       color: "#fff",
//       padding: 20,
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
//     homeBtn2: {
//       position: "absolute",
//       top: 19.8,
//       right: 62,
//       fontSize: 19,
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
//       gap: 10,
//       marginBottom: 20,
//       alignItems: "center",
//     },
//     dateRange: {
//       padding: 2,
//       background: "rgb(5,234,255)",
//       borderRadius: 0,
//     },
//     dateButton: {
//       padding: "8px 12px",
//       borderRadius: 4,
//       background: "#222",
//       color: "#fff",
//       border: "1px solid #444",
//       cursor: "pointer",
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
//   };

//   if (loading) return <div style={styles.page}>Loading...</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome
//           style={styles.homeBtn}
//           onClick={() => navigate("/")} // Fixed: using the navigate from useNavigate()
//           title="Home"
//         />
//         <FaUserAlt
//           style={styles.homeBtn2}
//           onClick={() => navigate("/login")} // Fixed: using the navigate from useNavigate()
//           title="Profile"
//         />
//         <h1 style={styles.title}>Patient Orders</h1>

//         {/* Date Picker */}
//         <div style={styles.controls}>
//           {showCalendar ? (
//             <div style={styles.dateRange}>
//               <DateRange
//                 ranges={range}
//                 onChange={(item: RangeKeyDict) => {
//                   let { startDate, endDate } = item.selection;
//                   if (startDate! > endDate!) [startDate, endDate] = [endDate!, startDate!];
//                   setRange([{ ...item.selection, startDate, endDate }]);
                  
//                   if (startDate!.getTime() !== range[0].startDate!.getTime()) {
//                     setLastChanged("start");
//                   } else if (endDate!.getTime() !== range[0].endDate!.getTime()) {
//                     setLastChanged("end");
//                   }
                  
//                   if (startDate && endDate) setShowCalendar(false);
//                 }}
//                 rangeColors={["rgba(105,133,247,0.92)"]}
//               />
//             </div>
//           ) : (
//             <>
//               <button
//                 style={styles.dateButton}
//                 onClick={() => setShowCalendar(true)}
//               >
//                 {range[0].startDate!.toLocaleDateString("en-GB")}
//               </button>
//               <span>-</span>
//               <button
//                 style={styles.dateButton}
//                 onClick={() => setShowCalendar(true)}
//               >
//                 {range[0].endDate!.toLocaleDateString("en-GB")}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Orders grouped by date */}
//         {Object.entries(grouped).map(([date, orders]) => (
//           <div key={date}>
//             <h2 style={styles.dateHeader}>
//               {new Date(date).toLocaleDateString("en-GB")} - {orders.length} orders
//             </h2>
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Service</th>
//                     <th style={styles.th}>Treatment</th>
//                     <th style={styles.th}>Patient</th>
//                     <th style={styles.th}>Email</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => {
//                     const profile = getProfile(order.customerID);
//                     return (
//                       <tr key={order.id}>
//                         <td style={styles.td}>{order.service}</td>
//                         <td style={styles.td}>{order.treatment}</td>
//                         <td style={styles.td}>{profile?.full_name || "Unknown"}</td>
//                         <td style={styles.td}>{profile?.email || "—"}</td>
//                         <td style={styles.td}>{profile?.phone || "—"}</td>
//                         <td style={styles.td}>{order.status}</td>
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