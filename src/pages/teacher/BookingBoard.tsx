// File: src/pages/teacher/BookingBoard.tsx

import React, { useState, useEffect, useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaWhatsapp, FaEnvelope, FaHome } from "react-icons/fa";
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
  date: string; // YYYY-MM-DD
}

export default function BookingBoard() {
  const { session } = useSession();
  const navigate = useNavigate();

  // state
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" }
  ]);

  // auth+role guard
  useEffect(() => {
    if (!session) return navigate("/sign-in");
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data?.role !== "Staff") navigate("/");
    })();
  }, [session, navigate]);

  // fetch bookings
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*");
        if (error) throw error;
        setAllBookings(data as Booking[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filter + sort + group
  const filtered = useMemo(() => {
    const s0 = range[0].startDate!;
    const e0 = range[0].endDate!;
    return allBookings
      .filter(b => {
        // date range
        const d = new Date(b.date);
        if (d < s0 || d > e0) return false;
        // phone, name, email
        if (searchPhone && !b.telNumber.includes(searchPhone)) return false;
        if (searchName && !b.patientName.toLowerCase().includes(searchName.toLowerCase())) return false;
        if (searchEmail && !b.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        // first by date ascending
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        // then by time ascending
        return a.start_time < b.start_time ? -1 : 1;
      });
  }, [allBookings, range, searchPhone, searchName, searchEmail]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Booking[]>>((acc, b) => {
      (acc[b.date] ||= []).push(b);
      return acc;
    }, {});
  }, [filtered]);

  // styles
  const styles: Record<string, CSSProperties> = {
    page: {
      background: "#000",
      minHeight: "100vh",
      overflowY: "auto",  
      color: "#fff",
      padding: "5px"
    },
    container: {
      maxWidth: "1200px",
      marginTop: "10px",
      position: "relative",
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "30px",
      background: "#111",
      borderRadius: "8px",
      boxShadow: "0px 0px 300px rgba(77, 89, 141, 0.97)",
    },
    homeBtn: {
      position: "absolute",
      top: "16px",
      right: "16px",
      fontSize: "24px",
      color: "rgb(10, 239, 247)",
      cursor: "pointer"
      
    },
    title: {
        color: "rgba(49, 91, 241, 0.92)",    // ← use `color` not `font-color`
        fontSize: "1.5rem",         // you can also add fontSize, fontWeight, etc.
        fontWeight: 600,
        marginBottom: '15px',

    },
    controls: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px"    },

    input: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #444",
      background: "#222",
      
      color: "#fff",
      flex: "1 1 200px"
    },
    dateRange: {
        
        borderRadius: "0px",         // rounded corners
        backgroundColor: "rgb(5, 234, 255)",  // whatever dark bg you like
        padding: "2px",
    },
    tableWrapper: {
      overflowX: "auto",
      marginBottom: "30px"
    },
    table: {
      width: "100%",
      minWidth: "600px",
      borderCollapse: "collapse",
      background: "#fff",
      color: "#000"
    },
    th: {
      padding: "8px",
      border: "1px solid #ccc",
      background: "rgba(28, 65, 199, 0.92)",
      color: "rgb(0, 255, 251)",
     
    },
    date: {
      padding: "8px",
      color: "rgb(255, 67, 126)",
     
    },
    td: {
      padding: "8px",
      border: "1px solid #ccc",
      textAlign: "center"
    },
    mobileIcon: {
      fontSize: "20px",
      cursor: "pointer"
    }
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error)   return <div style={styles.page}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <FaHome
          style={styles.homeBtn}
          onClick={() => navigate("/login")}
          title="Home"
        />

        <h1 style={styles.title}>Bookings</h1>

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
          <div style={styles.dateRange}>
            <DateRange
              onChange={(item: RangeKeyDict) => setRange([item.selection])}
              moveRangeOnFirstSelection
              ranges={range}
              rangeColors={["rgba(105, 133, 247, 0.92)"]}
            />
          </div>
        </div>

        {Object.entries(grouped).map(([date, list]) => (
          <div key={date}>
            <h2 style={styles.date}>
              {date} — {list.length} result{list.length !== 1 && "s"}
            </h2>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(b => {
                    // normalize for WhatsApp
                    const clean = b.telNumber.replace(/^0+/, "");
                    const full = clean.startsWith("+") ? clean : "+44" + clean;
                    return (
                      <tr key={b.id}>
                        <td style={styles.td}>{b.start_time}</td>
                        <td style={styles.td}>{b.patientName}</td>
                        <td style={styles.td}>
                          {window.innerWidth < 768 ? (
                            <FaWhatsapp
                              style={styles.mobileIcon}
                              onClick={() =>
                                window.open(`https://wa.me/${full}`, "_blank")
                              }
                            />
                          ) : (
                            full
                          )}
                        </td>
                        <td style={styles.td}>
                          {b.email ? (
                            window.innerWidth < 768 ? (
                              <FaEnvelope
                                style={styles.mobileIcon}
                                onClick={() =>
                                  window.location.assign(`mailto:${b.email}`)
                                }
                              />
                            ) : (
                              b.email
                            )
                          ) : (
                            "—"
                          )}
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

        {filtered.length === 0 && (
          <p>No bookings for the selected range.</p>
        )}
      </div>
    </div>
  );
}
