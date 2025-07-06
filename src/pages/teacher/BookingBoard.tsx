// // src/pages/teacher/BookingBoard.tsx

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaWhatsapp, FaEnvelope, FaHome } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// const USER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//user.png";
// const NOUSER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//nouser.png";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;               // YYYY-MM-DD
//   dateBirth?: string | null;  // from bookings
//   customerID?: string | null;
//   title?: string | null;
// }

// export default function BookingBoard() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // ── AUTH & ROLE GUARD ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-in");
//       return;
//     }
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Staff") {
//         navigate("/");
//       }
//     })();
//   }, []);

//   // ── STATE ───────────────────────────────────────────────────────────────
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);

//   // ── MODAL STATE ─────────────────────────────────────────────────────────
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalName, setModalName] = useState("");
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPhone, setModalPhone] = useState("");
//   const [modalAddress, setModalAddress] = useState("");
//   const [modalPostcode, setModalPostcode] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalErrorMsg, setModalErrorMsg] = useState("");

//   // ── FETCH BOOKINGS ──────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*, dateBirth");
//         if (error) throw error;
//         setAllBookings(data as Booking[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── FILTER / SORT / GROUP ───────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings
//       .filter((b) => {
//         const d = new Date(b.date);
//         if (d < s0 || d > e0) return false;
//         if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//         if (
//           searchName &&
//           !b.patientName.toLowerCase().includes(searchName.toLowerCase())
//         )
//           return false;
//         if (
//           searchEmail &&
//           !b.email.toLowerCase().includes(searchEmail.toLowerCase())
//         )
//           return false;
//         return true;
//       })
//       .sort((a, b) =>
//         a.date !== b.date
//           ? a.date < b.date
//             ? -1
//             : 1
//           : a.start_time < b.start_time
//           ? -1
//           : 1
//       );
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // ── MODAL HANDLERS ──────────────────────────────────────────────────────
//   const openModal = (bk: Booking) => {
//     setSelectedBooking(bk);
//     setModalTitle(bk.title ?? "");
//     setModalName(bk.patientName);
//     setModalEmail(bk.email);
//     setModalPhone(bk.telNumber);
//     setModalAddress("");
//     setModalPostcode("");
//     setModalPassword("");
//     setModalErrorMsg("");
//   };
//   const closeModal = () => setSelectedBooking(null);

//   // ── SUBMIT & PROFILES INSERT/UPDATE ─────────────────────────────────────
//   const handleModalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       // 1️⃣ Create the auth user
//       const { data: signUpData, error: signUpError } =
//         await supabase.auth.signUp({ email: modalEmail, password: modalPassword })
//       if (signUpError) throw signUpError
//       const newUserId = signUpData.user!.id
  
//       // 2️⃣ Upsert entire profile row in one go
//       const { error: upsertError } = await supabase
//         .from("profiles")
//         .upsert(
//           {
//             id:         newUserId,
//             role:       "Patient",
//             name:       modalName,
//             email:      modalEmail,
//             telNumber:  modalPhone,
//             dateBirth:  selectedBooking!.dateBirth,
//             title:      modalTitle || null,
//             address:    modalAddress || null,
//             postcode:   modalPostcode || null,
//           },
//           { onConflict: "id" }
//         )
//       if (upsertError) throw upsertError
  
//       // 3️⃣ Link booking → new user
//       const { error: linkError } = await supabase
//         .from("bookings")
//         .update({ customerID: newUserId })
//         .eq("id", selectedBooking!.id)
//       if (linkError) throw linkError
  
//       // 4️⃣ Refresh bookings list
//       const { data } = await supabase.from("bookings").select("*, dateBirth")
//       setAllBookings(data as Booking[])
  
//       closeModal()
//     } catch (err: any) {
//       setModalErrorMsg(err.message)
//     }
//   }
  

//   // ── STYLES ──────────────────────────────────────────────────────────────
//   const styles: Record<string, CSSProperties> = {
//     page: { background: "#000", minHeight: "100vh", color: "#fff", padding: 5 },
//     container: {
//       maxWidth: 1200,
//       marginTop: 10,
//       position: "relative",
//       padding: 20,
//       background: "#111",
//       borderRadius: 8,
//       boxShadow: "0 0 300px rgba(77,89,141,0.97)",
//     },
//     homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#0af", cursor: "pointer" },
//     title: { color: "rgba(49,91,241,0.92)", fontSize: "1.5rem", fontWeight: 600, marginBottom: 15 },
//     controls: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//     input: {
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       flex: "1 1 200px",
//     },
//     dateRange: { borderRadius: 0, backgroundColor: "rgb(5,234,255)", padding: 2 },
//     tableWrapper: { overflowX: "auto", marginBottom: 30 },
//     table: { width: "100%", minWidth: 700, borderCollapse: "collapse", background: "#fff", color: "#000" },
//     th: { padding: 8, border: "1px solid #ccc", background: "rgba(28,65,199,0.92)", color: "rgb(0,255,251)" },
//     date: { padding: 8, color: "rgb(255,67,126)" },
//     td: { padding: 8, border: "1px solid #ccc", textAlign: "center" },
//     mobileIcon: { fontSize: 20, cursor: "pointer" },
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       background: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     },
//     modalCard: {
//       background: "#111",
//       borderRadius: 8,
//       padding: 20,
//       width: "90%",
//       maxWidth: 400,
//       color: "#fff",
//       position: "relative",
//       boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//     },
//     modalClose: {
//       position: "absolute",
//       top: 10,
//       right: 10,
//       background: "#222",
//       border: "none",
//       borderRadius: "50%",
//       width: 30,
//       height: 30,
//       color: "#fff",
//       fontSize: 20,
//       cursor: "pointer",
//       lineHeight: 1,
//     },
//     modalTitle: { margin: "0 0 10px", fontSize: "1.25rem", textAlign: "center" },
//     modalForm: { display: "flex", flexDirection: "column", gap: 10 },
//     modalLabel: { display: "flex", flexDirection: "column", fontSize: "0.875rem" },
//     modalInput: {
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       width: "100%",
//     },
//     modalSubmit: { marginTop: 10, padding: 10, borderRadius: 999, border: "none", background: "rgba(49,91,241,0.92)", color: "#fff", cursor: "pointer" },
//     modalError: { color: "#f66", fontSize: "0.875rem", textAlign: "center" },
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

//         <h1 style={styles.title}>Bookings</h1>

//         <div style={styles.controls}>
//           <input
//             placeholder="Search Phone…"
//             value={searchPhone}
//             onChange={(e) => setSearchPhone(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Name…"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Email…"
//             value={searchEmail}
//             onChange={(e) => setSearchEmail(e.target.value)}
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
//                     <th style={styles.th}>User?</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map((b) => {
//                     const clean = b.telNumber.replace(/^0+/, "");
//                     const full = clean.startsWith("+") ? clean : "+44" + clean;
//                     return (
//                       <tr key={b.id}>
//                         <td style={styles.td}>{b.start_time}</td>
//                         <td style={styles.td}>{b.patientName}</td>
//                         <td style={styles.td}>
//                           {b.customerID ? (
//                             <img src={USER_ICON} alt="User exists" style={{ width: 24, height: 24 }} />
//                           ) : (
//                             <button
//                               style={{ background: "none", border: "none", cursor: "pointer" }}
//                               onClick={() => openModal(b)}
//                             >
//                               <img src={NOUSER_ICON} alt="Create user" style={{ width: 24, height: 24 }} />
//                             </button>
//                           )}
//                         </td>
//                         <td style={styles.td}>
//                           {window.innerWidth < 768 ? (
//                             <FaWhatsapp
//                               style={styles.mobileIcon}
//                               onClick={() => window.open(`https://wa.me/${full}`, "_blank")}
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
//                                 onClick={() => (window.location.href = `mailto:${b.email}`)}
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

//         {filtered.length === 0 && <p>No bookings for the selected range.</p>}

//         {selectedBooking && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalCard}>
//               <button style={styles.modalClose} onClick={closeModal}>
//                 ×
//               </button>
//               <h2 style={styles.modalTitle}>Create New User</h2>
//               <form style={styles.modalForm} onSubmit={handleModalSubmit}>
//                 {/* Title dropdown */}
//                 <label style={styles.modalLabel}>
//   Title
//   <select
//     id="title"
//     style={styles.modalInput}
//     value={modalTitle}
//     onChange={e => setModalTitle(e.target.value)}
//     required
//   >
//     <option value="" disabled hidden>
//       Select title
//     </option>
//     <option>Mr</option>
//     <option>Mrs</option>
//     <option>Miss</option>
//     <option>Master</option>
//     <option>Dr</option>
//     <option>Prof</option>
//   </select>
// </label>
            

//                 {/* Name */}
//                 <label style={styles.modalLabel}>
//                   Name
//                   <input
//                     name="name"
//                     style={styles.modalInput}
//                     value={modalName}
//                     onChange={(e) => setModalName(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Email */}
//                 <label style={styles.modalLabel}>
//                   Email
//                   <input
//                     name="email"
//                     type="email"
//                     style={styles.modalInput}
//                     value={modalEmail}
//                     onChange={(e) => setModalEmail(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Phone */}
//                 <label style={styles.modalLabel}>
//                   Phone
//                   <input
//                     name="phone"
//                     style={styles.modalInput}
//                     value={modalPhone}
//                     onChange={(e) => setModalPhone(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Address */}
//                 <label style={styles.modalLabel}>
//                   First Line of Address (optional)
//                   <input
//                     name="address"
//                     style={styles.modalInput}
//                     value={modalAddress}
//                     onChange={(e) => setModalAddress(e.target.value)}
//                   />
//                 </label>

//                 {/* Postcode */}
//                 <label style={styles.modalLabel}>
//                   Postcode (optional)
//                   <input
//                     name="postcode"
//                     style={styles.modalInput}
//                     value={modalPostcode}
//                     onChange={(e) => setModalPostcode(e.target.value)}
//                   />
//                 </label>

//                 {/* Password */}
//                 <label style={styles.modalLabel}>
//                   Password
//                   <input
//                     name="password"
//                     type="password"
//                     style={styles.modalInput}
//                     value={modalPassword}
//                     onChange={(e) => setModalPassword(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {modalErrorMsg && <p style={styles.modalError}>{modalErrorMsg}</p>}
//                 <button type="submit" style={styles.modalSubmit}>
//                   Create New User
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/teacher/BookingBoard.tsx
// src/pages/teacher/BookingBoard.tsx
// src/pages/teacher/BookingBoard.tsx

import React, { useState, useEffect, useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaWhatsapp, FaEnvelope, FaHome } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const USER_ICON =
  "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//user.png";
const NOUSER_ICON =
  "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//nouser.png";

interface Booking {
  id: number;
  createdAt: string;
  patientName: string;
  telNumber: string;
  email: string;
  start_time: string;
  cat: string;
  service: string;
  date: string;               // YYYY-MM-DD
  dateBirth?: string | null;
  customerID?: string | null;
  title?: string | null;
  address?: string | null;
  postcode?: string | null;
}

interface Service {
  id: number;
  title: string;
  duration: string;
  address: string;
  price: string;
}
const sampleServices: Record<number, Service> = {
  1:  { id: 1,  title: 'Altitude sickness', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00' },
  2:  { id: 2,  title: 'Sore throat (Ages 5+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  3:  { id: 3,  title: 'Travel Consultation', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00 – deducted if go ahead with treatment' },
  4:  { id: 4,  title: 'Travel vaccine', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies – depends on what vaccine(s) needed' },
  5:  { id: 5,  title: 'Uncomplicated UTI (Women aged 16–64)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  6:  { id: 6,  title: 'Vitamin B12 Injection', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£30.00' },
  7:  { id: 7,  title: 'Impetigo (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  8:  { id: 8,  title: 'Infected insect bite (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  9:  { id: 9,  title: 'Traveller’s Diarrhoea', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Azithromycin for £20' },
  10: { id: 10, title: 'Private flu jab', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£20.00' },
  12: { id: 12, title: 'Weight Loss Management', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on Treatment' },
  13: { id: 13, title: 'Oral Contraception', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  14: { id: 14, title: 'Flu Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  15: { id: 15, title: 'Blood Pressure Check', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  16: { id: 16, title: 'COVID-19 Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  17: { id: 17, title: 'Yellow fever', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '—' },
  18: { id: 18, title: 'Ear wax removal', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£35 one ear / £55 both ears' },
  19: { id: 19, title: 'Earache (Ages 1–17)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  20: { id: 20, title: 'Erectile dysfunction', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Sildenafil/Tadalafil – 2 tabs £10, 4 tabs £15, 8 tabs £25' },
  21: { id: 21, title: 'Sinusitis (Ages 12+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
  22: { id: 22, title: 'Acid Reflux', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'PPIs (omeprazole etc.) for £8' },
  23: { id: 23, title: 'Pain Relief', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Naproxen 500mg for £8' },
  24: { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Finasteride 1mg for £20' },
  25: { id: 25, title: 'Female Hirsutism in Women', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Vaniqa cream for £69.99' },
  26: { id: 26, title: 'Jet Lag', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Melatonin MR – 5 tabs £18.99 / 30 tabs £39.99' },
  28: { id: 28, title: 'Oral Thrush', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on treatment' },
  30: { id: 30, title: 'Diphtheria, Tetanus and Polio', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00 - only 1 dose' },
  31: { id: 31, title: 'Hepatitis A (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
  32: { id: 32, title: 'Hepatitis B (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
  33: { id: 33, title: 'Typhoid (1 dose or orally)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00' },
  34: { id: 34, title: 'Rabies (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00 per dose' },
  35: { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00' },
  36: { id: 36, title: 'Cholera (2 doses – special cases)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00' },
  37: { id: 37, title: 'Japanese Encephalitis', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£100.00 per dose' },
  38: { id: 38, title: 'Chicken Pox', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£80.00' },
  39: { id: 39, title: 'Meningitis B', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£140.00' },
  40: { id: 40, title: 'Shingles vaccination (Zostavax)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£200.00' },
  41: { id: 41, title: 'Anti-malarials', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Malarone £40 / Doxycycline £25' },
  42: { id: 42, title: 'HPV', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Gardasil-9 – £184.50/dose, £362 (2 doses), £540 (3 doses)' },
  43: { id: 43, title: 'Dengue Fever (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Qdenga - £130 per dose' },
};

const initialTreatmentOptions: Record<number, string[]> = {
  0: [],
  12: ["Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg",
       "Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg"],
  55: ["Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg"],
  66: ["Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg"],
  ...Object.keys(sampleServices).reduce((acc,k)=>{
    const id = +k;
    if (![0,12,55,66].includes(id)) acc[id] = [];
    return acc;
  }, {} as Record<number,string[]>),
};

export default function BookingBoard() {
  const { session } = useSession();
  const navigate = useNavigate();

  // Auth & role guard
  useEffect(() => {
    if (!session) { navigate("/sign-in"); return; }
    (async () => {
      const { data } = await supabase.from("profiles")
        .select("role").eq("id", session.user.id).single();
      if (data?.role !== "Staff") navigate("/");
    })();
  }, [session, navigate]);

  // State
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);

  // New-User modal
  const [selectedBooking, setSelectedBooking] = useState<Booking|null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalAddress, setModalAddress] = useState("");
  const [modalPostcode, setModalPostcode] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalErrorMsg, setModalErrorMsg] = useState("");

  // Create-Order modal
  const [orderModalBooking, setOrderModalBooking] = useState<Booking|null>(null);
  const [orderFields, setOrderFields] = useState({ serviceId: 0, treatment: "" });
  const [orderError, setOrderError] = useState("");
  const [treatmentOptionsState, setTreatmentOptionsState] = useState(initialTreatmentOptions);

  // Fetch bookings
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("bookings").select("*, dateBirth");
        if (error) throw error;
        setAllBookings(data as Booking[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter / group
  const filtered = useMemo(() => {
    const [s0,e0] = [range[0].startDate!, range[0].endDate!];
    return allBookings.filter(b => {
      const d = new Date(b.date);
      if (d<s0||d>e0) return false;
      if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
      if (searchName && !b.patientName.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchEmail && !b.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
      return true;
    }).sort((a,b) =>
      a.date!==b.date ? (a.date<b.date?-1:1) :
      a.start_time<b.start_time?-1:1
    );
  }, [allBookings, range, searchPhone, searchName, searchEmail]);

  const grouped = useMemo(() =>
    filtered.reduce<Record<string,Booking[]>>((acc,b)=>{
      (acc[b.date] ||= []).push(b);
      return acc;
    },{}), [filtered]
  );

  // Handlers...
  const openModal = (bk: Booking) => {
    setSelectedBooking(bk);
    setModalTitle(bk.title||"");
    setModalName(bk.patientName);
    setModalEmail(bk.email);
    setModalPhone(bk.telNumber);
    setModalAddress(bk.address||"");
    setModalPostcode(bk.postcode||"");
    setModalPassword("");
    setModalErrorMsg("");
  };
  const closeModal = () => setSelectedBooking(null);

  const handleModalSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    // …create user & link booking…
  };

  const openOrderModal = (bk: Booking) => {
    setOrderModalBooking(bk);
    setOrderFields({ serviceId:Number(bk.service), treatment:"" });
    setOrderError("");
  };
  const closeOrderModal = () => setOrderModalBooking(null);

  const handleOrderSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    try {
      const o = orderModalBooking!;
      const newOrder = {
        id:           o.id.toString(),
        customerID:   o.customerID,
        patientName:  o.patientName,
        telNumber:    o.telNumber,
        email:        o.email,
        cat:          o.cat,
        date:         o.date,
        dateBirth:    o.dateBirth,
        title:        o.title,
        address:      o.address,
        postcode:     o.postcode,
        service:      sampleServices[orderFields.serviceId].title,
        treatment:    orderFields.treatment,
      };
      const { error } = await supabase.from("orders").insert([newOrder]);
      if (error) throw error;
      closeOrderModal();
    } catch(err:any){
      setOrderError(err.message);
    }
  };

  // Styles
  const styles: Record<string, CSSProperties> = {
    page: {
      background: "#121212",
      minHeight: "100vh",
      color: "#EEE",
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif",
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "2rem",
      background: "#1E1E1E",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      position: "relative",
    },
    homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#4A90E2", cursor: "pointer" },
    title: { color: "#4A90E2", fontSize: "2rem", marginBottom: "1rem" },
    controls1: {
      display: "flex",
      justifyContent: "space-between",
      gap: "2rem",
      marginBottom: "1.5rem",
    },
    controls: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      flex: "1 1 auto",
    },
    input: {
      padding: "0.5rem 1rem",
      borderRadius: 6,
      border: "1px solid #333",
      background: "#2A2A2A",
      color: "#EEE",
      fontSize: "1rem",
      width: "100%",
      boxSizing: "border-box",
      outline: "none",
    },
    dateRange: {
      flexShrink: 0,
      border: "1px solid #333",
      borderRadius: 8,
      overflow: "hidden",
    },
    tableWrapper: {
      overflowX: "auto",
      marginBottom: "2rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      borderRadius: 8,
    },
    table: {
      width: "100%",
      minWidth: 700,
      borderCollapse: "collapse",
      background: "#FFF",
      color: "#222",
      borderRadius: 8,
      overflow: "hidden",
    },
    th: {
      padding: "0.75rem 1rem",
      background: "#4A90E2",
      color: "#FFF",
      textTransform: "uppercase",
      fontSize: "0.875rem",
      letterSpacing: "0.05em",
      textAlign: "left",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #EEE",
      textAlign: "left",
      verticalAlign: "middle",
      fontSize: "0.95rem",
    },
    tr: {
      transition: "background .2s",
    },
    modalOverlay: {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000,
    },
    modalCard: {
      background: "#1E1E1E", borderRadius: 12, padding: "2rem",
      width: "100%", maxWidth: 400, color: "#EEE",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      position: "relative",
    },
    modalClose: {
      position: "absolute", top: 10, right: 10, background: "#333",
      border: "none", borderRadius: "50%", width: 30, height: 30,
      color: "#FFF", fontSize: 18, cursor: "pointer", lineHeight: 1,
    },
    modalTitle: { margin: "0 0 1rem", fontSize: "1.5rem", textAlign: "center" },
    modalForm: { display: "flex", flexDirection: "column", gap: 12 },
    modalLabel: { fontSize: "0.9rem", color: "#CCC", display: "flex", flexDirection: "column", gap: 4 },
    modalInput: {
      padding: "0.5rem 1rem", width: '100%', borderRadius: 6, border: "1px solid #333",
      background: "#2A2A2A", color: "#EEE", fontSize: "1rem",
    },
    modalSubmit: {
      marginTop: 12, padding: "0.75rem", width: '100%', borderRadius: 6,
      border: "none", background: "#4A90E2", color: "#FFF",
      fontSize: "1rem", cursor: "pointer",
    },
    modalError: { color: "#f66", fontSize: "0.875rem", textAlign: "center" },
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error)   return <div style={styles.page}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <FaHome style={styles.homeBtn} onClick={() => navigate("/login")} title="Home" />
        <h1 style={styles.title}>Bookings</h1>

        <div style={styles.controls1}>
          <div style={styles.controls}>
            <input
              placeholder="Search Phone…"
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Search Name…"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Search Email…"
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.dateRange}>
            <DateRange
              ranges={range}
              onChange={(item: RangeKeyDict) => setRange([item.selection])}
              moveRangeOnFirstSelection
              rangeColors={["#4A90E2"]}
            />
          </div>
        </div>

        {Object.entries(grouped).map(([date, list]) => (
          <div key={date} style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#F23657" }}>
              {date} — {list.length} result{list.length !== 1 ? "s" : ""}
            </h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(b => {
                    const clean = b.telNumber.replace(/^0+/, "");
                    const full = clean.startsWith("+") ? clean : "+44" + clean;
                    return (
                      <tr
                        key={b.id}
                        style={styles.tr}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
                        onMouseLeave={e => (e.currentTarget.style.background = "")}
                      >
                        <td style={styles.td}>{b.start_time}</td>
                        <td style={styles.td}>{b.patientName}</td>
                        <td style={styles.td}>
                          {b.customerID ? (
                            <button
                              style={{ background: "none", border: "none", cursor: "pointer" }}
                              onClick={() => openOrderModal(b)}
                            >
                              <img src={USER_ICON} alt="Create order" width={24} height={24} />
                            </button>
                          ) : (
                            <button
                              style={{ background: "none", border: "none", cursor: "pointer" }}
                              onClick={() => openModal(b)}
                            >
                              <img src={NOUSER_ICON} alt="Create user" width={24} height={24} />
                            </button>
                          )}
                        </td>
                        <td style={styles.td}>
                          {window.innerWidth < 768 ? (
                            <FaWhatsapp style={{ cursor: "pointer" }} onClick={() => window.open(`https://wa.me/${full}`, "_blank")} />
                          ) : (
                            full
                          )}
                        </td>
                        <td style={styles.td}>
                          {b.email ? (
                            window.innerWidth < 768 ? (
                              <FaEnvelope style={{ cursor: "pointer" }} onClick={() => (window.location.href = `mailto:${b.email}`)} />
                            ) : (
                              b.email
                            )
                          ) : "—"}
                        </td>
                        <td style={styles.td}>{b.cat}</td>
                        <td style={styles.td}>{b.service}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {selectedBooking && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <button style={styles.modalClose} onClick={closeModal}>×</button>
              <h2 style={styles.modalTitle}>Create New User</h2>
              <form style={styles.modalForm} onSubmit={handleModalSubmit}>
                <label style={styles.modalLabel}>
                  Title
                  <select style={styles.modalInput} value={modalTitle} onChange={e => setModalTitle(e.target.value)} required>
                    <option value="" disabled hidden>Select title</option>
                    <option>Mr</option><option>Mrs</option><option>Miss</option>
                    <option>Master</option><option>Dr</option><option>Prof</option>
                  </select>
                </label>
                <label style={styles.modalLabel}>
                  Name
                  <input style={styles.modalInput} value={modalName} onChange={e => setModalName(e.target.value)} required />
                </label>
                <label style={styles.modalLabel}>
                  Email
                  <input type="email" style={styles.modalInput} value={modalEmail} onChange={e => setModalEmail(e.target.value)} required />
                </label>
                <label style={styles.modalLabel}>
                  Phone
                  <input style={styles.modalInput} value={modalPhone} onChange={e => setModalPhone(e.target.value)} required />
                </label>
                <label style={styles.modalLabel}>
                  Address
                  <input style={styles.modalInput} value={modalAddress} onChange={e => setModalAddress(e.target.value)} />
                </label>
                <label style={styles.modalLabel}>
                  Postcode
                  <input style={styles.modalInput} value={modalPostcode} onChange={e => setModalPostcode(e.target.value)} />
                </label>
                <label style={styles.modalLabel}>
                  Password
                  <input type="password" style={styles.modalInput} value={modalPassword} onChange={e => setModalPassword(e.target.value)} required />
                </label>
                {modalErrorMsg && <p style={styles.modalError}>{modalErrorMsg}</p>}
                <button type="submit" style={styles.modalSubmit}>Create New User</button>
              </form>
            </div>
          </div>
        )}

        {orderModalBooking && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <button style={styles.modalClose} onClick={closeOrderModal}>×</button>
              <h2 style={styles.modalTitle}>Create Order for {orderModalBooking.patientName}</h2>
              <form style={styles.modalForm} onSubmit={handleOrderSubmit}>
                <label style={styles.modalLabel}>
                <label style={styles.modalLabel}>
                  Service
                  <select
                    style={styles.modalInput}
                    value={orderFields.serviceId}
                    onChange={e => setOrderFields(f => ({ ...f, serviceId: Number(e.target.value), treatment: "" }))}
                    required
                  >
                    <option value={0} disabled>Select a service</option>
                    {Object.values(sampleServices).map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.duration})</option>
                    ))}
                  </select>
                </label>
                <label style={styles.modalLabel}>
                  Treatment
                  <select
                    style={styles.modalInput}
                    value={orderFields.treatment}
                    onChange={e => setOrderFields(f => ({ ...f, treatment: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Select a treatment</option>
                    {(treatmentOptionsState[orderFields.serviceId]||[]).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
                  Name
                  <input readOnly style={styles.modalInput} value={orderModalBooking.patientName} />
                </label>
                <label style={styles.modalLabel}>
                  Email
                  <input readOnly style={styles.modalInput} value={orderModalBooking.email} />
                </label>
                <label style={styles.modalLabel}>
                  Phone
                  <input readOnly style={styles.modalInput} value={orderModalBooking.telNumber} />
                </label>
                <label style={styles.modalLabel}>
                  Date of Birth
                  <input readOnly style={styles.modalInput} value={orderModalBooking.dateBirth||""} />
                </label>
                <label style={styles.modalLabel}>
                  Title
                  <input readOnly style={styles.modalInput} value={orderModalBooking.title||""} />
                </label>
                <label style={styles.modalLabel}>
                  Address
                  <input readOnly style={styles.modalInput} value={orderModalBooking.address||""} />
                </label>
                <label style={styles.modalLabel}>
                  Postcode
                  <input readOnly style={styles.modalInput} value={orderModalBooking.postcode||""} />
                </label>
                {orderError && <p style={styles.modalError}>{orderError}</p>}
                <button type="submit" style={styles.modalSubmit}>Create Order Patient</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useMemo, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../../context/SessionContext";
// import supabase from "../../supabase";
// import { DateRange, RangeKeyDict } from "react-date-range";
// import { FaWhatsapp, FaEnvelope, FaHome } from "react-icons/fa";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// const USER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//user.png";
// const NOUSER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//nouser.png";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;               // YYYY-MM-DD
//   dateBirth?: string | null;
//   customerID?: string | null;
//   title?: string | null;
//   address?: string | null;
//   postcode?: string | null;
// }

// interface Service {
//   id: number;
//   title: string;
//   duration: string;
//   address: string;
//   price: string;
// }
// const sampleServices: Record<number, Service> = {
//   1:  { id: 1,  title: 'Altitude sickness', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00' },
//   2:  { id: 2,  title: 'Sore throat (Ages 5+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   3:  { id: 3,  title: 'Travel Consultation', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00 – deducted if go ahead with treatment' },
//   4:  { id: 4,  title: 'Travel vaccine', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies – depends on what vaccine(s) needed' },
//   5:  { id: 5,  title: 'Uncomplicated UTI (Women aged 16–64)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   6:  { id: 6,  title: 'Vitamin B12 Injection', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£30.00' },
//   7:  { id: 7,  title: 'Impetigo (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   8:  { id: 8,  title: 'Infected insect bite (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   9:  { id: 9,  title: 'Traveller’s Diarrhoea', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Azithromycin for £20' },
//   10: { id: 10, title: 'Private flu jab', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£20.00' },
//   12: { id: 12, title: 'Weight Loss Management', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on Treatment' },
//   13: { id: 13, title: 'Oral Contraception', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   14: { id: 14, title: 'Flu Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   15: { id: 15, title: 'Blood Pressure Check', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   16: { id: 16, title: 'COVID-19 Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   17: { id: 17, title: 'Yellow fever', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '—' },
//   18: { id: 18, title: 'Ear wax removal', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£35 one ear / £55 both ears' },
//   19: { id: 19, title: 'Earache (Ages 1–17)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   20: { id: 20, title: 'Erectile dysfunction', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Sildenafil/Tadalafil – 2 tabs £10, 4 tabs £15, 8 tabs £25' },
//   21: { id: 21, title: 'Sinusitis (Ages 12+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   22: { id: 22, title: 'Acid Reflux', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'PPIs (omeprazole etc.) for £8' },
//   23: { id: 23, title: 'Pain Relief', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Naproxen 500mg for £8' },
//   24: { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Finasteride 1mg for £20' },
//   25: { id: 25, title: 'Female Hirsutism in Women', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Vaniqa cream for £69.99' },
//   26: { id: 26, title: 'Jet Lag', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Melatonin MR – 5 tabs £18.99 / 30 tabs £39.99' },
//   28: { id: 28, title: 'Oral Thrush', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on treatment' },
//   30: { id: 30, title: 'Diphtheria, Tetanus and Polio', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00 - only 1 dose' },
//   31: { id: 31, title: 'Hepatitis A (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
//   32: { id: 32, title: 'Hepatitis B (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
//   33: { id: 33, title: 'Typhoid (1 dose or orally)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00' },
//   34: { id: 34, title: 'Rabies (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00 per dose' },
//   35: { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00' },
//   36: { id: 36, title: 'Cholera (2 doses – special cases)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00' },
//   37: { id: 37, title: 'Japanese Encephalitis', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£100.00 per dose' },
//   38: { id: 38, title: 'Chicken Pox', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£80.00' },
//   39: { id: 39, title: 'Meningitis B', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£140.00' },
//   40: { id: 40, title: 'Shingles vaccination (Zostavax)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£200.00' },
//   41: { id: 41, title: 'Anti-malarials', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Malarone £40 / Doxycycline £25' },
//   42: { id: 42, title: 'HPV', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Gardasil-9 – £184.50/dose, £362 (2 doses), £540 (3 doses)' },
//   43: { id: 43, title: 'Dengue Fever (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Qdenga - £130 per dose' },
// };

// const initialTreatmentOptions: Record<number, string[]> = {
//   0: [],
//   12: [
//     "Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg",
//     "Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg",
//   ],
//   55: ["Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg"],
//   66: ["Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg"],
//   ...Object.keys(sampleServices).reduce((acc,k)=>{const id=+k; if (![0,12,55,66].includes(id)) acc[id]=[]; return acc;},{} as Record<number,string[]>)
// };

// export default function BookingBoard() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // ── AUTH & ROLE GUARD ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-in");
//       return;
//     }
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Staff") {
//         navigate("/");
//       }
//     })();
//   }, [session, navigate]);

//   // ── STATE ───────────────────────────────────────────────────────────────
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);

//   // ── New‐User Modal State ───────────────────────────────────────────────
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalName, setModalName] = useState("");
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPhone, setModalPhone] = useState("");
//   const [modalAddress, setModalAddress] = useState("");
//   const [modalPostcode, setModalPostcode] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalErrorMsg, setModalErrorMsg] = useState("");

//   // ── Create‐Order Modal State ──────────────────────────────────────────
//   const [orderModalBooking, setOrderModalBooking] = useState<Booking | null>(null);
//   const [orderFields, setOrderFields] = useState({ serviceId: 0, treatment: "" });
//   const [orderError, setOrderError] = useState("");
//   const [treatmentOptions, setTreatmentOptions] = useState(initialTreatmentOptions);

//   // ── FETCH BOOKINGS ──────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*, dateBirth");
//         if (error) throw error;
//         setAllBookings(data as Booking[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── FILTER / SORT / GROUP ───────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings
//       .filter((b) => {
//         const d = new Date(b.date);
//         if (d < s0 || d > e0) return false;
//         if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//         if (
//           searchName &&
//           !b.patientName.toLowerCase().includes(searchName.toLowerCase())
//         )
//           return false;
//         if (
//           searchEmail &&
//           !b.email.toLowerCase().includes(searchEmail.toLowerCase())
//         )
//           return false;
//         return true;
//       })
//       .sort((a, b) =>
//         a.date !== b.date
//           ? a.date < b.date
//             ? -1
//             : 1
//           : a.start_time < b.start_time
//           ? -1
//           : 1
//       );
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // ── MODAL HANDLERS ──────────────────────────────────────────────────────
//   const openModal = (bk: Booking) => {
//     setSelectedBooking(bk);
//     setModalTitle(bk.title ?? "");
//     setModalName(bk.patientName);
//     setModalEmail(bk.email);
//     setModalPhone(bk.telNumber);
//     setModalAddress(bk.address ?? "");
//     setModalPostcode(bk.postcode ?? "");
//     setModalPassword("");
//     setModalErrorMsg("");
//   };
//   const closeModal = () => setSelectedBooking(null);

//   const handleModalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // 1️⃣ Create the auth user
//       const { data: signUpData, error: signUpError } =
//         await supabase.auth.signUp({ email: modalEmail, password: modalPassword });
//       if (signUpError) throw signUpError;
//       const newUserId = signUpData.user!.id;

//       // 2️⃣ Upsert entire profile row in one go
//       const { error: upsertError } = await supabase
//         .from("profiles")
//         .upsert(
//           {
//             id: newUserId,
//             role: "Patient",
//             name: modalName,
//             email: modalEmail,
//             telNumber: modalPhone,
//             dateBirth: selectedBooking!.dateBirth,
//             title: modalTitle || null,
//             address: modalAddress || null,
//             postcode: modalPostcode || null,
//           },
//           { onConflict: "id" }
//         );
//       if (upsertError) throw upsertError;

//       // 3️⃣ Link booking → new user
//       const { error: linkError } = await supabase
//         .from("bookings")
//         .update({ customerID: newUserId })
//         .eq("id", selectedBooking!.id);
//       if (linkError) throw linkError;

//       // 4️⃣ Refresh bookings list
//       const { data } = await supabase.from("bookings").select("*, dateBirth");
//       setAllBookings(data as Booking[]);

//       closeModal();
//     } catch (err: any) {
//       setModalErrorMsg(err.message);
//     }
//   };

//   const openOrderModal = (bk: Booking) => {
//     setOrderModalBooking(bk);
//     setOrderFields({ serviceId: Number(bk.service), treatment: "" });
//     setOrderError("");
//   };
//   const closeOrderModal = () => setOrderModalBooking(null);

//   const handleOrderSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const o = orderModalBooking!;
//       const newOrder = {
//         id: o.id.toString(),                  // use booking.id as id
//         customerID: o.customerID,
//         patientName: o.patientName,
//         telNumber: o.telNumber,
//         email: o.email,
//         cat: o.cat,
//         date: o.date,
//         dateBirth: o.dateBirth,
//         title: o.title,
//         address: o.address,
//         postcode: o.postcode,
//         service: sampleServices[orderFields.serviceId].title,
//         treatment: orderFields.treatment,
//       };

//       const { error } = await supabase.from("orders").insert([newOrder]);
//       if (error) throw error;

//       closeOrderModal();
//     } catch (err: any) {
//       setOrderError(err.message);
//     }
//   };

//   // ── STYLES ──────────────────────────────────────────────────────────────
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       display: "flex",
//       justifyContent: "center",   // horizontal centering
//       alignItems: "flex-start",   // for vertical centering, use "center"
//       background: "#000",
//       minHeight: "100vh",
//       color: "#fff",
//       padding: 5,
//     },
//     container: {
//       maxWidth: 1200,
//       width: "90%",             // so margin auto can work
//       margin: "20px auto",       // centers horizontally
//       position: "relative",
//       padding: 40,
//       background: "#111",
//       borderRadius: 8,
//       boxShadow: "0 0 300px rgba(77,89,141,0.97)",
//     },
//     homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#0af", cursor: "pointer" },
//     title: { color: "rgba(49,91,241,0.92)", fontSize: "1.5rem", fontWeight: 600, marginBottom: 15 },
//     controls1: {
//       display: "flex",
//       justifyContent: "space-between", // inputs left, calendar right
//       alignItems: "flex-start",
//       marginBottom: 20,
//     },
  
//     // stack inputs vertically
//     controls: {
//       display: "flex",
//       width: '50px',
//       flexDirection: "column",
//       gap: 10,      // space between each input
//       flex: "1 1 200px",
//     },
  
//     // smaller padding on inputs
//     input: {
//       padding: "4px 8px",  // was 8px; now 4px top/bottom
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       width: "100%",       // fill the left column
//       boxSizing: "border-box",
//     },
    
//     // input: {
//     //   padding: 8,
//     //   borderRadius: 4,
//     //   border: "1px solid #444",
//     //   background: "#222",
//     //   color: "#fff",
//     //   flex: "1 1 200px",
//     // },
//     dateRange: { borderRadius: 0, backgroundColor: "rgb(5,234,255)", padding: 2 },
//     tableWrapper: { overflowX: "auto", marginBottom: 30 },
//     table: { width: "100%", minWidth: 700, borderCollapse: "collapse", background: "#fff", color: "#000" },
//     th: { padding: 8, border: "1px solid #ccc", background: "rgba(28,65,199,0.92)", color: "rgb(0,255,251)" },
//     date: { padding: 8, color: "rgb(255,67,126)" },
//     td: { padding: 8, border: "1px solid #ccc", textAlign: "center" },
//     mobileIcon: { fontSize: 20, cursor: "pointer" },
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       background: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     },
//     modalCard: {
//       background: "#111",
//       borderRadius: 8,
//       padding: 20,
//       width: "90%",
//       maxWidth: 400,
//       color: "#fff",
//       position: "relative",
//       boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//     },
//     modalClose: {
//       position: "absolute",
//       top: 10,
//       right: 10,
//       background: "#222",
//       border: "none",
//       borderRadius: "50%",
//       width: 30,
//       height: 30,
//       color: "#fff",
//       fontSize: 20,
//       cursor: "pointer",
//       lineHeight: 1,
//     },
//     modalTitle: { margin: "0 0 10px", fontSize: "1.25rem", textAlign: "center" },
//     modalForm: { display: "flex", flexDirection: "column", gap: 10 },
//     modalLabel: { display: "flex", flexDirection: "column", fontSize: "0.875rem" },
//     modalInput: {
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       width: "100%",
//     },
//     modalSubmit: {
//       marginTop: 10,
//       padding: 10,
//       borderRadius: 999,
//       border: "none",
//       background: "rgba(49,91,241,0.92)",
//       color: "#fff",
//       cursor: "pointer",
//     },
//     modalError: { color: "#f66", fontSize: "0.875rem", textAlign: "center" },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome style={styles.homeBtn} onClick={() => navigate("/login")} title="Home" />

//         <h1 style={styles.title}>Bookings</h1>

//         <div style={styles.controls1}>
//         <div style={styles.controls}>
//           <input
//             placeholder="Search Phone…"
//             value={searchPhone}
//             onChange={(e) => setSearchPhone(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Name…"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Email…"
//             value={searchEmail}
//             onChange={(e) => setSearchEmail(e.target.value)}
//             style={styles.input}
//             />
//             </div>
//           <div style={styles.dateRange}>
//             <DateRange
//               onChange={(item: RangeKeyDict) => setRange([item.selection])}
//               moveRangeOnFirstSelection
//               ranges={range}
//               rangeColors={["rgba(105, 133, 247, 0.92)"]}
//             />
//         </div>
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
//                     <th style={styles.th}>Action</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map((b) => {
//                     const clean = b.telNumber.replace(/^0+/, "");
//                     const full = clean.startsWith("+") ? clean : "+44" + clean;
//                     return (
//                       <tr key={b.id}>
//                         <td style={styles.td}>{b.start_time}</td>
//                         <td style={styles.td}>{b.patientName}</td>
//                         <td style={styles.td}>
//                           {b.customerID ? (
//                             <button
//                               style={{ background: "none", border: "none", cursor: "pointer" }}
//                               onClick={() => openOrderModal(b)}
//                             >
//                               <img src={USER_ICON} alt="Create order" style={{ width: 24, height: 24 }} />
//                             </button>
//                           ) : (
//                             <button
//                               style={{ background: "none", border: "none", cursor: "pointer" }}
//                               onClick={() => openModal(b)}
//                             >
//                               <img src={NOUSER_ICON} alt="Create user" style={{ width: 24, height: 24 }} />
//                             </button>
//                           )}
//                         </td>
//                         <td style={styles.td}>
//                           {window.innerWidth < 768 ? (
//                             <FaWhatsapp
//                               style={styles.mobileIcon}
//                               onClick={() => window.open(`https://wa.me/${full}`, "_blank")}
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
//                                 onClick={() => (window.location.href = `mailto:${b.email}`)}
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

//         {filtered.length === 0 && <p>No bookings for the selected range.</p>}

//         {selectedBooking && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalCard}>
//               <button style={styles.modalClose} onClick={closeModal}>
//                 ×
//               </button>
//               <h2 style={styles.modalTitle}>Create New User</h2>
//               <form style={styles.modalForm} onSubmit={handleModalSubmit}>
//                 {/* Title dropdown */}
//                 <label style={styles.modalLabel}>
//                   Title
//                   <select
//                     id="title"
//                     style={styles.modalInput}
//                     value={modalTitle}
//                     onChange={(e) => setModalTitle(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled hidden>
//                       Select title
//                     </option>
//                     <option>Mr</option>
//                     <option>Mrs</option>
//                     <option>Miss</option>
//                     <option>Master</option>
//                     <option>Dr</option>
//                     <option>Prof</option>
//                   </select>
//                 </label>

//                 {/* Name */}
//                 <label style={styles.modalLabel}>
//                   Name
//                   <input
//                     name="name"
//                     style={styles.modalInput}
//                     value={modalName}
//                     onChange={(e) => setModalName(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Email */}
//                 <label style={styles.modalLabel}>
//                   Email
//                   <input
//                     name="email"
//                     type="email"
//                     style={styles.modalInput}
//                     value={modalEmail}
//                     onChange={(e) => setModalEmail(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Phone */}
//                 <label style={styles.modalLabel}>
//                   Phone
//                   <input
//                     name="phone"
//                     style={styles.modalInput}
//                     value={modalPhone}
//                     onChange={(e) => setModalPhone(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {/* Address */}
//                 <label style={styles.modalLabel}>
//                   First Line of Address (optional)
//                   <input
//                     name="address"
//                     style={styles.modalInput}
//                     value={modalAddress}
//                     onChange={(e) => setModalAddress(e.target.value)}
//                   />
//                 </label>

//                 {/* Postcode */}
//                 <label style={styles.modalLabel}>
//                   Postcode (optional)
//                   <input
//                     name="postcode"
//                     style={styles.modalInput}
//                     value={modalPostcode}
//                     onChange={(e) => setModalPostcode(e.target.value)}
//                   />
//                 </label>

//                 {/* Password */}
//                 <label style={styles.modalLabel}>
//                   Password
//                   <input
//                     name="password"
//                     type="password"
//                     style={styles.modalInput}
//                     value={modalPassword}
//                     onChange={(e) => setModalPassword(e.target.value)}
//                     required
//                   />
//                 </label>

//                 {modalErrorMsg && <p style={styles.modalError}>{modalErrorMsg}</p>}
//                 <button type="submit" style={styles.modalSubmit}>
//                   Create New User
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {orderModalBooking && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalCard}>
//               <button style={styles.modalClose} onClick={closeOrderModal}>
//                 ×
//               </button>
//               <h2 style={styles.modalTitle}>
//                 Create Order for {orderModalBooking.patientName}
//               </h2>
//               <form style={styles.modalForm} onSubmit={handleOrderSubmit}>
//                 <label style={styles.modalLabel}>
//                   Name
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.patientName}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Email
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.email}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Phone
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.telNumber}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Date of Birth
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.dateBirth || ""}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Title
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.title || ""}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Address
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.address || ""}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Postcode
//                   <input
//                     readOnly
//                     style={styles.modalInput}
//                     value={orderModalBooking.postcode || ""}
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Service
//                   <select
//                     style={styles.modalInput}
//                     value={orderFields.serviceId}
//                     onChange={(e) =>
//                       setOrderFields((f) => ({
//                         ...f,
//                         serviceId: Number(e.target.value),
//                         treatment: ""
//                       }))
//                     }
//                     required
//                   >
//                     <option value={0} disabled>
//                       Select a service
//                     </option>
//                     {Object.values(sampleServices).map((s) => (
//                       <option key={s.id} value={s.id}>
//                         {s.title} ({s.duration})
//                       </option>
//                     ))}
//                   </select>
//                 </label>

//                 <label style={styles.modalLabel}>
//                   Treatment
//                   <select
//                     style={styles.modalInput}
//                     value={orderFields.treatment}
//                     onChange={(e) =>
//                       setOrderFields((f) => ({ ...f, treatment: e.target.value }))
//                     }
//                     required
//                   >
//                     <option value="" disabled>
//                       Select a treatment
//                     </option>
//                     {(treatmentOptions[orderFields.serviceId] || []).map((opt) => (
//                       <option key={opt} value={opt}>
//                         {opt}
//                       </option>
//                     ))}
//                   </select>
//                 </label>

//                 {orderError && <p style={styles.modalError}>{orderError}</p>}
//                 <button type="submit" style={styles.modalSubmit}>
//                   Create Order Patient
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
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

// const USER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//user.png";
// const NOUSER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//nouser.png";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;      // as string in bookings
//   date: string;         // YYYY-MM-DD
//   dateBirth?: string | null;
//   customerID?: string | null;
//   title?: string | null;
//   address?: string | null;
// }

// interface Service {
//   id: number;
//   title: string;
//   duration: string;
//   address: string;
//   price: string;
// }
// const sampleServices: Record<number, Service> = {
//   1: { id: 1, title: 'Altitude sickness', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00' },
//   2: { id: 2, title: 'Sore throat (Ages 5+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   3: { id: 3, title: 'Travel Consultation', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00 – deducted if go ahead with treatment' },
//   4: { id: 4, title: 'Travel vaccine', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies – depends on what vaccine(s) needed' },
//   5: { id: 5, title: 'Uncomplicated UTI (Women aged 16–64)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   6: { id: 6, title: 'Vitamin B12 Injection', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£30.00' },
//   7: { id: 7, title: 'Impetigo (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   8: { id: 8, title: 'Infected insect bite (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   9: { id: 9, title: 'Traveller’s Diarrhoea', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Azithromycin for £20' },
//   10: { id: 10, title: 'Private flu jab', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£20.00' },
//   12: { id: 12, title: 'Weight Loss Management', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on Treatment' },
//   13: { id: 13, title: 'Oral Contraception', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   14: { id: 14, title: 'Flu Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   15: { id: 15, title: 'Blood Pressure Check', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   16: { id: 16, title: 'COVID-19 Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   17: { id: 17, title: 'Yellow fever', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '—' },
//   18: { id: 18, title: 'Ear wax removal', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£35 one ear / £55 both ears' },
//   19: { id: 19, title: 'Earache (Ages 1–17)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   20: { id: 20, title: 'Erectile dysfunction', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Sildenafil/Tadalafil – 2 tabs £10, 4 tabs £15, 8 tabs £25' },
//   21: { id: 21, title: 'Sinusitis (Ages 12+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
//   22: { id: 22, title: 'Acid Reflux', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'PPIs (omeprazole etc.) for £8' },
//   23: { id: 23, title: 'Pain Relief', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Naproxen 500mg for £8' },
//   24: { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Finasteride 1mg for £20' },
//   25: { id: 25, title: 'Female Hirsutism in Women', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Vaniqa cream for £69.99' },
//   26: { id: 26, title: 'Jet Lag', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Melatonin MR – 5 tabs £18.99 / 30 tabs £39.99' },
//   28: { id: 28, title: 'Oral Thrush', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on treatment' },
//   30: { id: 30, title: 'Diphtheria, Tetanus and Polio', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00 - only 1 dose' },
//   31: { id: 31, title: 'Hepatitis A (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
//   32: { id: 32, title: 'Hepatitis B (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
//   33: { id: 33, title: 'Typhoid (1 dose or orally)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00' },
//   34: { id: 34, title: 'Rabies (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00 per dose' },
//   35: { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00' },
//   36: { id: 36, title: 'Cholera (2 doses – special cases)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00' },
//   37: { id: 37, title: 'Japanese Encephalitis', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£100.00 per dose' },
//   38: { id: 38, title: 'Chicken Pox', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£80.00' },
//   39: { id: 39, title: 'Meningitis B', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£140.00' },
//   40: { id: 40, title: 'Shingles vaccination (Zostavax)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£200.00' },
//   41: { id: 41, title: 'Anti-malarials', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Malarone £40 / Doxycycline £25' },
//   42: { id: 42, title: 'HPV', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Gardasil-9 – £184.50/dose, £362 (2 doses), £540 (3 doses)' },
//   43: { id: 43, title: 'Dengue Fever (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Qdenga - £130 per dose' }
// };

// // ── Placeholder treatment-options map ───────────────────────────────────
// // Fill each array with the specific treatments you want per service ID
// const initialTreatmentOptions: Record<number, string[]> = {
//   1: [],  2: [],  3: [],  4: [],
//   5: [],  6: [],  7: [],  8: [],
//   9: [], 10: [], 12: [], 13: [],
//   14: [], 15: [], 16: [], 17: [],
//   18: [], 19: [], 20: [], 21: [],
//   22: [], 23: [], 24: [], 25: [],
//   26: [], 28: [], 30: [], 31: [],
//   32: [], 33: [], 34: [], 35: [],
//   36: [], 37: [], 38: [], 39: [],
//   40: [], 41: [], 42: [], 43: []
// };

// export default function BookingBoard() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // ── AUTH & ROLE ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!session) return void navigate("/sign-in");
//     (async () => {
//       const { data } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", session.user.id)
//         .single();
//       if (data?.role !== "Staff") navigate("/");
//     })();
//   }, [session]);

//   // ── STATE ─────────────────────────────────────────────────────────────
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);

//   // ── New‐User Modal State ───────────────────────────────────────────────
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalName, setModalName] = useState("");
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPhone, setModalPhone] = useState("");
//   const [modalAddress, setModalAddress] = useState("");
//   const [modalPostcode, setModalPostcode] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalErrorMsg, setModalErrorMsg] = useState("");

//   // ── Create‐Order Modal State ──────────────────────────────────────────
//   const [orderModalBooking, setOrderModalBooking] = useState<Booking | null>(null);
//   const [orderFields, setOrderFields] = useState({
//     serviceId: 0,
//     treatment: "",
//   });
//   const [treatmentOptions, setTreatmentOptions] = useState(initialTreatmentOptions);

//   // ── FETCH BOOKINGS ────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*, dateBirth");
//         if (error) throw error;
//         setAllBookings(data as Booking[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── FILTER / GROUP ─────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const [s0, e0] = [range[0].startDate!, range[0].endDate!];
//     return allBookings
//       .filter(b => {
//         const d = new Date(b.date);
//         if (d < s0 || d > e0) return false;
//         if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//         if (searchName && !b.patientName.toLowerCase().includes(searchName.toLowerCase())) return false;
//         if (searchEmail && !b.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
//         return true;
//       })
//       .sort((a, b) =>
//         a.date !== b.date
//           ? a.date < b.date ? -1 : 1
//           : a.start_time < b.start_time ? -1 : 1
//       );
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // ── NEW‐USER MODAL HANDLERS ────────────────────────────────────────────
//   const openModal = (bk: Booking) => {
//     setSelectedBooking(bk);
//     setModalTitle(bk.title ?? "");
//     setModalName(bk.patientName);
//     setModalEmail(bk.email);
//     setModalPhone(bk.telNumber);
//     setModalAddress("");
//     setModalPostcode("");
//     setModalPassword("");
//     setModalErrorMsg("");
//   };
//   const closeModal = () => setSelectedBooking(null);

//   const handleModalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data: signUpData, error: signUpError } =
//         await supabase.auth.signUp({ email: modalEmail, password: modalPassword });
//       if (signUpError) throw signUpError;
//       const newUserId = signUpData.user!.id;

//       const { error: upsertError } = await supabase
//         .from("profiles")
//         .upsert({
//           id:         newUserId,
//           role:       "Patient",
//           name:       modalName,
//           email:      modalEmail,
//           telNumber:  modalPhone,
//           dateBirth:  selectedBooking!.dateBirth,
//           title:      modalTitle || null,
//           address:    modalAddress || null,
//           postcode:   modalPostcode || null,
//         }, { onConflict: "id" });
//       if (upsertError) throw upsertError;

//       await supabase
//         .from("bookings")
//         .update({ customerID: newUserId })
//         .eq("id", selectedBooking!.id);

//       const { data } = await supabase.from("bookings").select("*, dateBirth");
//       setAllBookings(data as Booking[]);
//       closeModal();
//     } catch (err: any) {
//       setModalErrorMsg(err.message);
//     }
//   };

//   // ── ORDER MODAL HANDLERS ───────────────────────────────────────────────
//   const openOrderModal = (bk: Booking) => {
//     setOrderModalBooking(bk);
//     setOrderFields({ serviceId: Number(bk.service), treatment: "" });
//     // when ready, you can load specific treatments:
//     // fetchTreatmentsForService(+bk.service).then(opts =>
//     //   setTreatmentOptions(prev => ({ ...prev, [bk.service]: opts }))
//     // );
//   };
//   const closeOrderModal = () => setOrderModalBooking(null);

//   // ── STYLES ─────────────────────────────────────────────────────────────
//   const styles: Record<string, CSSProperties> = {
//     page: { background: "#000", minHeight: "100vh", color: "#fff", padding: 5 },
//     container: {
//       maxWidth: 1200,
//       marginTop: 10,
//       position: "relative",
//       padding: 20,
//       background: "#111",
//       borderRadius: 8,
//       boxShadow: "0 0 300px rgba(77,89,141,0.97)",
//     },
//     homeBtn: { position: "absolute", top: 16, right: 16, fontSize: 24, color: "#0af", cursor: "pointer" },
//     title: { color: "rgba(49,91,241,0.92)", fontSize: "1.5rem", fontWeight: 600, marginBottom: 15 },
//     controls: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//     input: {
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       flex: "1 1 200px",
//     },
//     dateRange: { borderRadius: 0, backgroundColor: "rgb(5,234,255)", padding: 2 },
//     tableWrapper: { overflowX: "auto", marginBottom: 30 },
//     table: { width: "100%", minWidth: 700, borderCollapse: "collapse", background: "#fff", color: "#000" },
//     th: { padding: 8, border: "1px solid #ccc", background: "rgba(28,65,199,0.92)", color: "rgb(0,255,251)" },
//     date: { padding: 8, color: "rgb(255,67,126)" },
//     td: { padding: 8, border: "1px solid #ccc", textAlign: "center" },
//     mobileIcon: { fontSize: 20, cursor: "pointer" },
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       background: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     },
//     modalCard: {
//       background: "#111",
//       borderRadius: 8,
//       padding: 20,
//       width: "90%",
//       maxWidth: 400,
//       color: "#fff",
//       position: "relative",
//       boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//     },
//     modalClose: {
//       position: "absolute",
//       top: 10,
//       right: 10,
//       background: "#222",
//       border: "none",
//       borderRadius: "50%",
//       width: 30,
//       height: 30,
//       color: "#fff",
//       fontSize: 20,
//       cursor: "pointer",
//       lineHeight: 1,
//     },
//     modalTitle: { margin: "0 0 10px", fontSize: "1.25rem", textAlign: "center" },
//     modalForm: { display: "flex", flexDirection: "column", gap: 10 },
//     modalLabel: { display: "flex", flexDirection: "column", fontSize: "0.875rem" },
//     modalInput: {
//       padding: 8,
//       borderRadius: 4,
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       width: "100%",
//     },
//     modalSubmit: {
//       marginTop: 10,
//       padding: 10,
//       borderRadius: 999,
//       border: "none",
//       background: "rgba(49,91,241,0.92)",
//       color: "#fff",
//       cursor: "pointer",
//     },
//     modalError: { color: "#f66", fontSize: "0.875rem", textAlign: "center" },
//   };

//   if (loading) return <div style={styles.page}>Loading…</div>;
//   if (error) return <div style={styles.page}>Error: {error}</div>;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <FaHome style={styles.homeBtn} onClick={() => navigate("/login")} title="Home" />

//         <h1 style={styles.title}>Bookings</h1>

//         {/* …search controls & table as before… */}

//         {orderModalBooking && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalCard}>
//               <button style={styles.modalClose} onClick={closeOrderModal}>×</button>
//               <h2 style={styles.modalTitle}>
//                 Create Order for {orderModalBooking.patientName}
//               </h2>
//               <form
//                 style={styles.modalForm}
//                 onSubmit={async e => {
//                   e.preventDefault();
//                   const newOrder = {
//                     bookingID:    orderModalBooking.id,
//                     customerID:   orderModalBooking.customerID,
//                     patientName:  orderModalBooking.patientName,
//                     dateBirth:    orderModalBooking.dateBirth,
//                     title:        orderModalBooking.title,
//                     address:      orderModalBooking.address,
//                     email:        orderModalBooking.email,
//                     service:      sampleServices[orderFields.serviceId].title,
//                     treatment:    orderFields.treatment,
//                   };
//                   const { error } = await supabase.from("orders").insert([newOrder]);
//                   if (error) console.error(error);
//                   else closeOrderModal();
//                 }}
//               >
//                 {/* Service dropdown */}
//                 <label style={styles.modalLabel}>
//                   Service
//                   <select
//                     style={styles.modalInput}
//                     value={orderFields.serviceId}
//                     onChange={e =>
//                       setOrderFields(f => ({
//                         ...f,
//                         serviceId: Number(e.target.value),
//                         treatment: ""
//                       }))
//                     }
//                     required
//                   >
//                     <option value={0} disabled>Select a service</option>
//                     {Object.values(sampleServices).map(s => (
//                       <option key={s.id} value={s.id}>
//                         {s.title} ({s.duration})
//                       </option>
//                     ))}
//                   </select>
//                 </label>

//                 {/* Treatment dropdown (options from treatmentOptions map) */}
//                 <label style={styles.modalLabel}>
//                   Treatment
//                   <select
//                     style={styles.modalInput}
//                     value={orderFields.treatment}
//                     onChange={e =>
//                       setOrderFields(f => ({ ...f, treatment: e.target.value }))
//                     }
//                     required
//                   >
//                     <option value="" disabled>Select a treatment</option>
//                     {treatmentOptions[orderFields.serviceId].map(opt => (
//                       <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                   </select>
//                 </label>

//                 <button type="submit" style={styles.modalSubmit}>
//                   Create Order Patient
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
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

// const USER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//user.png";
// const NOUSER_ICON =
//   "https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//nouser.png";

// interface Booking {
//   id: number;
//   createdAt: string;
//   patientName: string;
//   telNumber: string;
//   email: string;
//   start_time: string;
//   cat: string;
//   service: string;
//   date: string;               // appointment date (YYYY-MM-DD)
//   dateBirth?: string | null;  // patient's DOB from bookings table
//   customerID?: string | null;
//   title?: string | null;
// }

// export default function BookingBoard() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // ── AUTH & ROLE GUARD (run once on mount) ────────────────────────────────
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-in");
//     } else {
//       (async () => {
//         const { data } = await supabase
//           .from("profiles")
//           .select("role")
//           .eq("id", session.user.id)
//           .single();
//         if (data?.role !== "Staff") {
//           navigate("/");
//         }
//       })();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── STATE ────────────────────────────────────────────────────────────────
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [searchPhone, setSearchPhone] = useState("");
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [range, setRange] = useState([
//     { startDate: new Date(), endDate: new Date(), key: "selection" },
//   ]);

//   // Modal form state
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalName, setModalName] = useState("");
//   const [modalEmail, setModalEmail] = useState("");
//   const [modalPhone, setModalPhone] = useState("");
//   const [modalPassword, setModalPassword] = useState("");
//   const [modalErrorMsg, setModalErrorMsg] = useState("");

//   // ── FETCH BOOKINGS (include dateBirth) ───────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*, dateBirth");
//         if (error) throw error;
//         setAllBookings(data as Booking[]);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── FILTER, SORT, GROUP ──────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const s0 = range[0].startDate!;
//     const e0 = range[0].endDate!;
//     return allBookings
//       .filter((b) => {
//         const d = new Date(b.date);
//         if (d < s0 || d > e0) return false;
//         if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
//         if (
//           searchName &&
//           !b.patientName.toLowerCase().includes(searchName.toLowerCase())
//         )
//           return false;
//         if (
//           searchEmail &&
//           !b.email.toLowerCase().includes(searchEmail.toLowerCase())
//         )
//           return false;
//         return true;
//       })
//       .sort((a, b) =>
//         a.date !== b.date
//           ? a.date < b.date
//             ? -1
//             : 1
//           : a.start_time < b.start_time
//           ? -1
//           : 1
//       );
//   }, [allBookings, range, searchPhone, searchName, searchEmail]);

//   const grouped = useMemo(() => {
//     return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
//       (acc[b.date] ||= []).push(b);
//       return acc;
//     }, {});
//   }, [filtered]);

//   // ── MODAL HANDLERS ─────────────────────────────────────────────────────
//   const openModal = (bk: Booking) => {
//     setSelectedBooking(bk);
//     setModalTitle(bk.title ?? "");
//     setModalName(bk.patientName);
//     setModalEmail(bk.email);
//     setModalPhone(bk.telNumber);
//     setModalPassword("");
//     setModalErrorMsg("");
//   };
//   const closeModal = () => setSelectedBooking(null);

//   const handleModalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // 1️⃣ Create the auth user
//       const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//         email: modalEmail,
//         password: modalPassword,
//       });
//       if (signUpError) throw signUpError;
//       const newUserId = signUpData.user!.id;

//       // 2️⃣ Insert minimal profile, copy fields including dateBirth
//       await supabase.from("profiles").insert({
//         id:         newUserId,
//         role:       "Patient",
//         name:       modalName,
//         telNumber:  modalPhone,
//         email:      modalEmail,
//         dateBirth:  selectedBooking!.dateBirth,       // copied from bookings.dateBirth
//         ...(modalTitle && { title: modalTitle }),
//       });

//       // 3️⃣ Link booking → new user
//       await supabase
//         .from("bookings")
//         .update({ customerID: newUserId })
//         .eq("id", selectedBooking!.id);

//       // 4️⃣ Refresh bookings (include dateBirth)
//       const { data } = await supabase
//         .from("bookings")
//         .select("*, dateBirth");
//       setAllBookings(data as Booking[]);

//       closeModal();
//     } catch (err: any) {
//       setModalErrorMsg(err.message);
//     }
//   };

//   // ── STYLES ─────────────────────────────────────────────────────────────
//   const styles: Record<string, CSSProperties> = {
//     page: {
//       background: "#000",
//       minHeight: "100vh",
//       overflowY: "auto",
//       color: "#fff",
//       padding: "5px",
//     },
//     container: {
//       maxWidth: "1200px",
//       marginTop: "10px",
//       position: "relative",
//       padding: "20px",
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
//       cursor: "pointer",
//     },
//     title: {
//       color: "rgba(49, 91, 241, 0.92)",
//       fontSize: "1.5rem",
//       fontWeight: 600,
//       marginBottom: "15px",
//     },
//     controls: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "10px",
//       marginBottom: "20px",
//     },
//     input: {
//       padding: "8px",
//       borderRadius: "4px",
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       flex: "1 1 200px",
//     },
//     dateRange: {
//       borderRadius: "0px",
//       backgroundColor: "rgb(5, 234, 255)",
//       padding: "2px",
//     },
//     tableWrapper: { overflowX: "auto", marginBottom: "30px" },
//     table: {
//       width: "100%",
//       minWidth: "700px",
//       borderCollapse: "collapse",
//       background: "#fff",
//       color: "#000",
//     },
//     th: {
//       padding: "8px",
//       border: "1px solid #ccc",
//       background: "rgba(28, 65, 199, 0.92)",
//       color: "rgb(0, 255, 251)",
//     },
//     date: { padding: "8px", color: "rgb(255, 67, 126)" },
//     td: {
//       padding: "8px",
//       border: "1px solid #ccc",
//       textAlign: "center",
//     },
//     mobileIcon: { fontSize: "20px", cursor: "pointer" },

//     // modal styles
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       background: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     },
//     modalCard: {
//       background: "#111",
//       borderRadius: "8px",
//       padding: "20px",
//       width: "90%",
//       maxWidth: "400px",
//       color: "#fff",
//       position: "relative",
//       boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//     },
//     modalClose: {
//       position: "absolute",
//       top: "10px",
//       right: "10px",
//       background: "#222",
//       border: "none",
//       borderRadius: "50%",
//       width: "30px",
//       height: "30px",
//       color: "#fff",
//       fontSize: "20px",
//       cursor: "pointer",
//       lineHeight: 1,
//     },
//     modalTitle: {
//       margin: "0 0 10px",
//       fontSize: "1.25rem",
//       textAlign: "center",
//     },
//     modalForm: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//     },
//     modalLabel: {
//       display: "flex",
//       flexDirection: "column",
//       fontSize: "0.875rem",
//     },
//     modalInput: {
//       padding: "8px",
//       borderRadius: "4px",
//       border: "1px solid #444",
//       background: "#222",
//       color: "#fff",
//       width: "100%",
//     },
//     modalSubmit: {
//       marginTop: "10px",
//       padding: "10px",
//       borderRadius: "999px",
//       border: "none",
//       background: "rgba(49, 91, 241, 0.92)",
//       color: "#fff",
//       cursor: "pointer",
//     },
//     modalError: { color: "#f66", fontSize: "0.875rem", textAlign: "center" },
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

//         <h1 style={styles.title}>Bookings</h1>

//         <div style={styles.controls}>
//           <input
//             placeholder="Search Phone…"
//             value={searchPhone}
//             onChange={(e) => setSearchPhone(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Name…"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             placeholder="Search Email…"
//             value={searchEmail}
//             onChange={(e) => setSearchEmail(e.target.value)}
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
//                     <th style={styles.th}>User?</th>
//                     <th style={styles.th}>Phone</th>
//                     <th style={styles.th}>Email</th>
//                     <th style={styles.th}>Category</th>
//                     <th style={styles.th}>Service</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {list.map((b) => {
//                     const clean = b.telNumber.replace(/^0+/, "");
//                     const full = clean.startsWith("+") ? clean : "+44" + clean;
//                     return (
//                       <tr key={b.id}>
//                         <td style={styles.td}>{b.start_time}</td>
//                         <td style={styles.td}>{b.patientName}</td>
//                         <td style={styles.td}>
//                           {b.customerID ? (
//                             <img
//                               src={USER_ICON}
//                               alt="User exists"
//                               style={{ width: 24, height: 24 }}
//                             />
//                           ) : (
//                             <button
//                               style={{
//                                 background: "none",
//                                 border: "none",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => openModal(b)}
//                             >
//                               <img
//                                 src={NOUSER_ICON}
//                                 alt="Create user"
//                                 style={{ width: 24, height: 24 }}
//                               />
//                             </button>
//                           )}
//                         </td>
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
//                                   (window.location.href = `mailto:${b.email}`)
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

//         {filtered.length === 0 && <p>No bookings for the selected range.</p>}

//         {selectedBooking && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalCard}>
//               <button style={styles.modalClose} onClick={closeModal}>
//                 ×
//               </button>
//               <h2 style={styles.modalTitle}>Create New User</h2>
//               <form style={styles.modalForm} onSubmit={handleModalSubmit}>
//                 {!selectedBooking.title && (
//                   <label style={styles.modalLabel}>
//                     Title
//                     <input
//                       name="title"
//                       style={styles.modalInput}
//                       value={modalTitle}
//                       onChange={(e) => setModalTitle(e.target.value)}
//                       placeholder="Mr, Mrs, Dr…"
//                     />
//                   </label>
//                 )}
//                 <label style={styles.modalLabel}>
//                   Name
//                   <input
//                     name="name"
//                     style={styles.modalInput}
//                     value={modalName}
//                     onChange={(e) => setModalName(e.target.value)}
//                     required
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Email
//                   <input
//                     name="email"
//                     type="email"
//                     style={styles.modalInput}
//                     value={modalEmail}
//                     onChange={(e) => setModalEmail(e.target.value)}
//                     required
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Phone
//                   <input
//                     name="phone"
//                     style={styles.modalInput}
//                     value={modalPhone}
//                     onChange={(e) => setModalPhone(e.target.value)}
//                     required
//                   />
//                 </label>
//                 <label style={styles.modalLabel}>
//                   Password
//                   <input
//                     name="password"
//                     type="password"
//                     style={styles.modalInput}
//                     value={modalPassword}
//                     onChange={(e) => setModalPassword(e.target.value)}
//                     required
//                   />
//                 </label>
//                 {modalErrorMsg && (
//                   <p style={styles.modalError}>{modalErrorMsg}</p>
//                 )}
//                 <button type="submit" style={styles.modalSubmit}>
//                   Create New User
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// // File: src/pages/teacher/BookingBoard.tsx

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

// export default function BookingBoard() {
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
//       if (data?.role !== "Staff") navigate("/");
//     })();
//   }, [session, navigate]);

//   // fetch bookings
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("bookings")
//           .select("*");
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
