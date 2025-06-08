import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./BookAppointment.css";
import supabase from "../../supabase";

interface Service {
  id: number;
  title: string;
}

// NHS vs Private service lists
const NHS_SERVICES: Service[] = [
  { id: 2, title: "Sinusitis" },
  { id: 5, title: "Sore Throat" },
  { id: 8, title: "Earache" },
  { id: 9, title: "Infected Insect Bite" },
  { id: 12, title: "Impetigo" },
  { id: 16, title: "Shingles" },
  { id: 6, title: "Uncomplicated UTI (Women)" },
  { id: 22, title: "Blood Pressure Check" },
  { id: 14, title: "Emergency Contraception" },
  { id: 15, title: "Flu Vaccination" },
  { id: 17, title: "COVID-19 Vaccination" },
];

const PRIVATE_SERVICES: Service[] = [
  { id: 19, title: "Microsuction Earwax Removal" },
  { id: 13, title: "Weight Loss Clinic" },
  { id: 11, title: "Private Flu Jab" },
  { id: 10, title: "Period Delay" },
  { id: 1, title: "Altitude Sickness" },
  { id: 6, title: "Vitamin B12 Injection" },
  { id: 7, title: "Hair Loss" },
  { id: 18, title: "Chickenpox Vaccine" },
  { id: 21, title: "Erectile Dysfunction" },
];

const ALL_SERVICES_MAP: Record<number, string> = {
  1: "Altitude Sickness",
  2: "Sinusitis",
  5: "Sore Throat",
  8: "Earache",
  9: "Infected Insect Bite",
  12: "Impetigo",
  16: "Shingles",
  6: "Uncomplicated UTI (Women)",
  22: "Blood Pressure Check",
  14: "Emergency Contraception",
  15: "Flu Vaccination",
  17: "COVID-19 Vaccination",
  19: "Microsuction Earwax Removal",
  13: "Weight Loss Clinic",
  11: "Private Flu Jab",
  10: "Period Delay",
  7: "Hair Loss",
  18: "Chickenpox Vaccine",
  21: "Erectile Dysfunction",
};

// generate 20-minute time slots between two times
function generateTimeSlots(
  startHour: number,
  startMin: number,
  endHour: number,
  endMin: number
): string[] {
  const slots: string[] = [];
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);
  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current <= end) {
    const hh = current.getHours().toString().padStart(2, "0");
    const mm = current.getMinutes().toString().padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    current = new Date(current.getTime() + 20 * 60 * 1000);
  }
  return slots;
}

// pick daily slots by category
function slotsForDayAndCategory(
  dayIndex: number,
  category: "NHS" | "Private"
): string[] {
  if (category === "NHS") {
    switch (dayIndex) {
      case 1:
      case 2:
      case 3:
      case 4:
        return generateTimeSlots(9, 30, 17, 10);
      case 5:
        return [
          ...generateTimeSlots(9, 30, 12, 10),
          ...generateTimeSlots(15, 30, 17, 10),
        ];
      default:
        return [];
    }
  } else {
    switch (dayIndex) {
      case 1:
      case 2:
      case 3:
        return generateTimeSlots(9, 30, 17, 10);
      case 4:
        return [];
      case 5:
        return [
          ...generateTimeSlots(9, 30, 12, 10),
          ...generateTimeSlots(15, 0, 17, 10),
        ];
      default:
        return [];
    }
  }
}

// fetch booked slots from Supabase
async function fetchExistingBookings(
  dateISO: string,
  category: "NHS" | "Private"
): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time")
    .eq("date", dateISO)
    .eq("cat", category);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }
  return (data as { start_time: string }[]).map((row) => row.start_time);
}

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();

  // --------------------------------
  // 1) new toggle between calendar & form
  // --------------------------------
  const [view, setView] = useState<"calendar" | "form">("calendar");

  const [category, setCategory] = useState<"NHS" | "Private">("NHS");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [chosenTime, setChosenTime] = useState<string | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  // Ref for sticky date header
  const timeSlotRef = useRef<HTMLDivElement | null>(null);

  // reload slots when date or category changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) {
        setAvailableTimes([]);
        return;
      }
      const dow = selectedDate.getDay();
      const allSlots = slotsForDayAndCategory(dow, category);
      const dateISO = selectedDate.toISOString().split("T")[0];
      const booked = await fetchExistingBookings(dateISO, category);
      setAvailableTimes(allSlots.filter((t) => !booked.includes(t)));
    }
    loadSlots();
  }, [selectedDate, category]);

  // scroll label into view
  useEffect(() => {
    if (selectedDate && timeSlotRef.current) {
      setTimeout(() => {
        timeSlotRef.current!.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedDate]);

  // calendar computations
  const firstOfMonth = new Date(displayYear, displayMonth, 1);
  const jsWeekday = firstOfMonth.getDay();
  const firstColumnIndex = (jsWeekday + 6) % 7;
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (
      displayYear > today.getFullYear() ||
      (displayYear === today.getFullYear() &&
        displayMonth > today.getMonth())
    ) {
      const prev = new Date(displayYear, displayMonth - 1, 1);
      setDisplayYear(prev.getFullYear());
      setDisplayMonth(prev.getMonth());
      setSelectedDate(null);
      setChosenTime(null);
    }
  };
  const handleNextMonth = () => {
    const next = new Date(displayYear, displayMonth + 1, 1);
    setDisplayYear(next.getFullYear());
    setDisplayMonth(next.getMonth());
    setSelectedDate(null);
    setChosenTime(null);
  };
  const isShowingCurrentMonth =
    displayYear === today.getFullYear() && displayMonth === today.getMonth();

  const handleDayClick = (day: number) => {
    const dt = new Date(displayYear, displayMonth, day);
    setSelectedDate(dt);
    setChosenTime(null);
  };

  // --------------------------------
  // 2) when time is clicked, swap to form
  // --------------------------------
  const handleTimeClick = (time: string) => {
    setChosenTime(time);
    setView("form");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !chosenTime || selectedServiceId === null) return;

    const dateISO = selectedDate.toISOString().split("T")[0];
    const serviceTitle = ALL_SERVICES_MAP[selectedServiceId] || "";

    const { error } = await supabase.from("bookings").insert([
      {
        date: dateISO,
        start_time: chosenTime,
        cat: category,
        service: serviceTitle,
        patientName,
        telNumber: patientPhone,
        email: patientEmail,
      },
    ]);
    if (error) {
      alert("Error saving booking: " + error.message);
    } else {
      alert("Booking confirmed!");
      navigate("/");
    }
  };

  const footerText =
    selectedDate &&
    selectedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <Header />

      <div className="page-wrapper">
        <div className="container py-3">
          {/* Back & title */}
          <button className="round-back" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2 className="booking-title mb-4">Book an Appointment</h2>

          {/* Category toggle */}
          <div className="d-flex gap-2 mb-4 category-toggle">
            <button
              className={`category-btn ${category === "NHS" ? "active" : ""}`}
              onClick={() => {
                setCategory("NHS");
                setSelectedServiceId(null);
                setSelectedDate(null);
                setChosenTime(null);
                setView("calendar");
              }}
            >
              NHS
            </button>
            <button
              className={`category-btn ${
                category === "Private" ? "active" : ""
              }`}
              onClick={() => {
                setCategory("Private");
                setSelectedServiceId(null);
                setSelectedDate(null);
                setChosenTime(null);
                setView("calendar");
              }}
            >
              Private
            </button>
          </div>

          {/* Service selector */}
          {category === "NHS" && (
            <select
              className="form-select mb-4"
              value={selectedServiceId ?? ""}
              onChange={(e) => {
                setSelectedServiceId(Number(e.target.value));
                setSelectedDate(null);
                setChosenTime(null);
                setView("calendar");
              }}
            >
              <option value="" disabled>
                Select NHS Service
              </option>
              {NHS_SERVICES.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.title}
                </option>
              ))}
            </select>
          )}
          {category === "Private" && (
            <select
              className="form-select mb-4"
              value={selectedServiceId ?? ""}
              onChange={(e) => {
                setSelectedServiceId(Number(e.target.value));
                setSelectedDate(null);
                setChosenTime(null);
                setView("calendar");
              }}
            >
              <option value="" disabled>
                Select Private Service
              </option>
              {PRIVATE_SERVICES.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.title}
                </option>
              ))}
            </select>
          )}

          {/* CALENDAR & TIME SLOTS */}
          {view === "calendar" && selectedServiceId !== null && (
            <>
              {/* Calendar */}
              <div className="calendar-container">
                <div className="calendar-header-box">
                  <button
                    className="btn header-arrow"
                    onClick={handlePrevMonth}
                    disabled={isShowingCurrentMonth}
                  >
                    ‹
                  </button>
                  <span className="header-month">
                    {new Date(displayYear, displayMonth).toLocaleDateString(
                      "en-GB",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                  <button
                    className="btn header-arrow"
                    onClick={handleNextMonth}
                  >
                    ›
                  </button>
                </div>
                <div className="row text-center weekday-row">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (wd) => (
                      <div key={wd} className="col-1 px-0">
                        {wd}
                      </div>
                    )
                  )}
                </div>
                <div className="row calendar-grid">
                  {Array.from({ length: firstColumnIndex }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="col-1 px-0" />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const thisDate = new Date(
                        displayYear,
                        displayMonth,
                        day
                      );
                      const dateInPast =
                        thisDate <
                        new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate()
                        );
                      const isSelected =
                        selectedDate &&
                        thisDate.toDateString() ===
                          selectedDate.toDateString();
                      let dayClass = "";
                      if (isSelected) dayClass = "selected-day";
                      else if (
                        thisDate.toDateString() === today.toDateString()
                      )
                        dayClass = "today-day";

                      return (
                        <div key={day} className="col-1 px-0">
                          <button
                            onClick={() =>
                              !dateInPast && handleDayClick(day)
                            }
                            className={`btn day-btn ${
                              dateInPast ? "past-day" : dayClass
                            }`}
                            disabled={dateInPast}
                          >
                            {day}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <hr />

              {/* Time slots */}
              {selectedDate ? (
                <div className="times-container">
                  <div
                    className="selected-date-label"
                    ref={timeSlotRef}
                  >
                    {footerText}
                  </div>
                  <div className="row gx-0 time-row">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((t) => {
                        const isChosen = chosenTime === t;
                        return (
                          <div key={t} className="col-12 px-0 mb-2">
                            <button
                              className={`btn time-slot-btn ${
                                isChosen ? "selected-time" : ""
                              }`}
                              onClick={() => handleTimeClick(t)}
                            >
                              {t}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="select-date-text">
                        No available slots for this date.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="select-date-text">
                  Select a date to see available times
                </p>
              )}
            </>
          )}

          {/* CONFIRM BOOKING FORM */}
          {view === "form" &&
            selectedDate &&
            chosenTime &&
            selectedServiceId !== null && (
              <div className="form-fullpage">
                <div className="form-header">
                  <button
                    className="back-btn"
                    onClick={() => {
                      setView("calendar");
                      setChosenTime(null);
                    }}
                  >
                    ←
                  </button>
                  <span className="form-title">Confirm Your Booking</span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <strong>Category:</strong> {category}
                  </div>
                  <div className="detail-row">
                    <strong>Service:</strong>{" "}
                    {ALL_SERVICES_MAP[selectedServiceId]}
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong>{" "}
                    {selectedDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="detail-row">
                    <strong>Time:</strong> {chosenTime}
                  </div>
                </div>

                <form
                  className="booking-form"
                  onSubmit={handleBookingSubmit}
                >
                  <label htmlFor="patientName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    className="form-control"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />

                  <label htmlFor="patientPhone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="patientPhone"
                    className="form-control"
                    value={patientPhone}
                    onChange={(e) =>
                      setPatientPhone(e.target.value)
                    }
                    required
                  />

                  <label htmlFor="patientEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="patientEmail"
                    className="form-control"
                    value={patientEmail}
                    onChange={(e) =>
                      setPatientEmail(e.target.value)
                    }
                    required
                  />

                  <button type="submit" className="submit-btn">
                    Confirm Booking
                  </button>
                </form>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
// // src/pages/BookAppointment.tsx
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../Header";
// import "./BookAppointment.css";
// import supabase from "../../supabase";

// interface Service {
//   id: number;
//   title: string;
// }

// const NHS_SERVICES: Service[] = [
//   { id: 2, title: "Sinusitis" },
//   { id: 5, title: "Sore Throat" },
//   { id: 8, title: "Earache" },
//   { id: 9, title: "Infected Insect Bite" },
//   { id: 12, title: "Impetigo" },
//   { id: 16, title: "Shingles" },
//   { id: 6, title: "Uncomplicated UTI (Women)" },
//   { id: 22, title: "Blood Pressure Check" },
//   { id: 14, title: "Emergency Contraception" },
//   { id: 15, title: "Flu Vaccination" },
//   { id: 17, title: "COVID-19 Vaccination" },
// ];

// const PRIVATE_SERVICES: Service[] = [
//   { id: 19, title: "Microsuction Earwax Removal" },
//   { id: 13, title: "Weight Loss Clinic" },
//   { id: 11, title: "Private Flu Jab" },
//   { id: 10, title: "Period Delay" },
//   { id: 1, title: "Altitude Sickness" },
//   { id: 6, title: "Vitamin B12 Injection" },
//   { id: 7, title: "Hair Loss" },
//   { id: 18, title: "Chickenpox Vaccine" },
//   { id: 21, title: "Erectile Dysfunction" },
// ];

// const ALL_SERVICES_MAP: Record<number, string> = {
//   1: "Altitude Sickness",
//   2: "Sinusitis",
//   5: "Sore Throat",
//   8: "Earache",
//   9: "Infected Insect Bite",
//   12: "Impetigo",
//   16: "Shingles",
//   6: "Uncomplicated UTI (Women)",
//   22: "Blood Pressure Check",
//   14: "Emergency Contraception",
//   15: "Flu Vaccination",
//   17: "COVID-19 Vaccination",
//   19: "Microsuction Earwax Removal",
//   13: "Weight Loss Clinic",
//   11: "Private Flu Jab",
//   10: "Period Delay",
//   7: "Hair Loss",
//   18: "Chickenpox Vaccine",
//   21: "Erectile Dysfunction",
// };

// function generateTimeSlots(
//   startHour: number,
//   startMin: number,
//   endHour: number,
//   endMin: number
// ): string[] {
//   const slots: string[] = [];
//   let current = new Date();
//   current.setHours(startHour, startMin, 0, 0);
//   const end = new Date();
//   end.setHours(endHour, endMin, 0, 0);

//   while (current <= end) {
//     const hh = current.getHours().toString().padStart(2, "0");
//     const mm = current.getMinutes().toString().padStart(2, "0");
//     slots.push(`${hh}:${mm}`);
//     current = new Date(current.getTime() + 20 * 60 * 1000);
//   }
//   return slots;
// }

// function slotsForDayAndCategory(
//   dayIndex: number,
//   category: "NHS" | "Private"
// ): string[] {
//   if (category === "NHS") {
//     switch (dayIndex) {
//       case 1:
//       case 2:
//       case 3:
//       case 4:
//         return generateTimeSlots(9, 30, 17, 10);
//       case 5:
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 30, 17, 10),
//         ];
//       default:
//         return [];
//     }
//   } else {
//     switch (dayIndex) {
//       case 1:
//       case 2:
//       case 3:
//         return generateTimeSlots(9, 30, 17, 10);
//       case 4:
//         return [];
//       case 5:
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 0, 17, 10),
//         ];
//       default:
//         return [];
//     }
//   }
// }

// async function fetchExistingBookings(
//   dateISO: string,
//   category: "NHS" | "Private"
// ): Promise<string[]> {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("start_time")
//     .eq("date", dateISO)
//     .eq("cat", category);

//   if (error) {
//     console.error("Supabase fetch error:", error.message);
//     return [];
//   }
//   return (data as { start_time: string }[]).map((row) => row.start_time);
// }

// const BookAppointment: React.FC = () => {
//   const navigate = useNavigate();

//   const [category, setCategory] = useState<"NHS" | "Private">("NHS");
//   const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

//   const today = new Date();
//   const [displayYear, setDisplayYear] = useState(today.getFullYear());
//   const [displayMonth, setDisplayMonth] = useState(today.getMonth());
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);
//   const [chosenTime, setChosenTime] = useState<string | null>(null);

//   const [patientName, setPatientName] = useState("");
//   const [patientPhone, setPatientPhone] = useState("");
//   const [patientEmail, setPatientEmail] = useState("");

//   // Ref for the date header above the time slots:
//   const timeSlotRef = useRef<HTMLDivElement | null>(null);

//   // Load available time slots when selectedDate or category changes
//   useEffect(() => {
//     async function loadSlots() {
//       if (!selectedDate) {
//         setAvailableTimes([]);
//         return;
//       }
//       const dow = selectedDate.getDay(); // 0=Sun…6=Sat
//       const allSlots = slotsForDayAndCategory(dow, category);
//       const dateISO = selectedDate.toISOString().split("T")[0];
//       const booked = await fetchExistingBookings(dateISO, category);
//       const freeSlots = allSlots.filter((t) => !booked.includes(t));
//       setAvailableTimes(freeSlots);
//     }
//     loadSlots();
//   }, [selectedDate, category]);

//   // Scroll the "selected-date-label" into view whenever a date is chosen
//   useEffect(() => {
//     if (selectedDate && timeSlotRef.current) {
//       // Slight delay to ensure the slots have rendered, then scroll:
//       setTimeout(() => {
//         timeSlotRef.current!.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }, 100);
//     }
//   }, [selectedDate]);

//   // Calendar calculations:
//   const firstOfMonth = new Date(displayYear, displayMonth, 1);
//   const jsWeekday = firstOfMonth.getDay(); // 0=Sun…6=Sat
//   const firstColumnIndex = (jsWeekday + 6) % 7; // shift so Mon=0…Sun=6
//   const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

//   // Navigate to previous month (unless already at current)
//   const handlePrevMonth = () => {
//     if (
//       displayYear > today.getFullYear() ||
//       (displayYear === today.getFullYear() && displayMonth > today.getMonth())
//     ) {
//       const prev = new Date(displayYear, displayMonth - 1, 1);
//       setDisplayYear(prev.getFullYear());
//       setDisplayMonth(prev.getMonth());
//       setSelectedDate(null);
//       setChosenTime(null);
//     }
//   };
//   // Navigate to next month
//   const handleNextMonth = () => {
//     const next = new Date(displayYear, displayMonth + 1, 1);
//     setDisplayYear(next.getFullYear());
//     setDisplayMonth(next.getMonth());
//     setSelectedDate(null);
//     setChosenTime(null);
//   };
//   const isShowingCurrentMonth =
//     displayYear === today.getFullYear() && displayMonth === today.getMonth();

//   // When a calendar day is clicked:
//   const handleDayClick = (day: number) => {
//     const dt = new Date(displayYear, displayMonth, day);
//     setSelectedDate(dt);
//     setChosenTime(null);
//   };

//   // When a time slot is clicked:
//   const handleTimeClick = (time: string) => {
//     setChosenTime(time);
//   };

//   // Submit booking form to Supabase
//   const handleBookingSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDate || !chosenTime || selectedServiceId === null) return;

//     const dateISO = selectedDate.toISOString().split("T")[0];
//     const serviceTitle = ALL_SERVICES_MAP[selectedServiceId] || "";

//     try {
//       const { error } = await supabase.from("bookings").insert([
//         {
//           date: dateISO,
//           start_time: chosenTime,
//           cat: category,
//           service: serviceTitle,
//           patientName: patientName,
//           telNumber: patientPhone,
//           email: patientEmail,
//         },
//       ]);
//       if (error) throw error;
//       alert("Booking confirmed!");
//       navigate("/");
//     } catch (err: any) {
//       alert("Error saving booking: " + err.message);
//       console.error(err);
//     }
//   };

//   // Format the header text under the time slots (“Tuesday 10 Jun 2025” etc.)
//   const footerText =
//     selectedDate &&
//     selectedDate.toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   return (
//     <>
//       <Header />

//       <div className="page-wrapper">
//         <div className="container py-3">
//           {/* Rounded back button */}
//           <button className="round-back" onClick={() => navigate(-1)}>
//             ←
//           </button>

//           <h2 className="booking-title mb-4">Book an Appointment</h2>

//           {/* Category toggle */}
//           <div className="d-flex gap-2 mb-4 category-toggle">
//             <button
//               className={`category-btn ${category === "NHS" ? "active" : ""}`}
//               onClick={() => {
//                 setCategory("NHS");
//                 setSelectedServiceId(null);
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               NHS
//             </button>
//             <button
//               className={`category-btn ${category === "Private" ? "active" : ""}`}
//               onClick={() => {
//                 setCategory("Private");
//                 setSelectedServiceId(null);
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               Private
//             </button>
//           </div>

//           {/* Service dropdown */}
//           {category === "NHS" && (
//             <select
//               className="form-select mb-4"
//               value={selectedServiceId ?? ""}
//               onChange={(e) => {
//                 setSelectedServiceId(Number(e.target.value));
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               <option value="" disabled>
//                 Select NHS Service
//               </option>
//               {NHS_SERVICES.map((svc) => (
//                 <option key={svc.id} value={svc.id}>
//                   {svc.title}
//                 </option>
//               ))}
//             </select>
//           )}
//           {category === "Private" && (
//             <select
//               className="form-select mb-4"
//               value={selectedServiceId ?? ""}
//               onChange={(e) => {
//                 setSelectedServiceId(Number(e.target.value));
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               <option value="" disabled>
//                 Select Private Service
//               </option>
//               {PRIVATE_SERVICES.map((svc) => (
//                 <option key={svc.id} value={svc.id}>
//                   {svc.title}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* Calendar + Time Slots */}
//           {selectedServiceId !== null && (
//             <>
//               {/* Calendar Container */}
//               <div className="calendar-container">
//                 {/* BOXED HEADER */}
//                 <div className="calendar-header-box">
//                   <button
//                     className="btn header-arrow"
//                     onClick={handlePrevMonth}
//                     disabled={isShowingCurrentMonth}
//                   >
//                     ‹
//                   </button>
//                   <span className="header-month">
//                     {new Date(displayYear, displayMonth).toLocaleDateString(
//                       "en-GB",
//                       { month: "long", year: "numeric" }
//                     )}
//                   </span>
//                   <button
//                     className="btn header-arrow"
//                     onClick={handleNextMonth}
//                   >
//                     ›
//                   </button>
//                 </div>

//                 <div className="row text-center weekday-row">
//                   {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((wd) => (
//                     <div key={wd} className="col-1 px-0">
//                       {wd}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="row calendar-grid">
//                   {Array.from({ length: firstColumnIndex }).map((_, idx) => (
//                     <div key={`empty-${idx}`} className="col-1 px-0" />
//                   ))}
//                   {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//                     const thisDate = new Date(displayYear, displayMonth, day);
//                     const dateInPast =
//                       thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
//                     const isSelected =
//                       selectedDate && thisDate.toDateString() === selectedDate.toDateString();
//                     let dayClass = "";
//                     if (isSelected) {
//                       dayClass = "selected-day";
//                     } else if (thisDate.toDateString() === today.toDateString()) {
//                       dayClass = "today-day";
//                     }

//                     return (
//                       <div key={day} className="col-1 px-0">
//                         <button
//                           onClick={() => !dateInPast && handleDayClick(day)}
//                           className={`btn day-btn ${
//                             dateInPast ? "past-day" : dayClass
//                           }`}
//                           disabled={dateInPast}
//                         >
//                           {day}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <hr />

//               {selectedDate ? (
//                 <div className="times-container">
//                   {/* Attach ref here so this label scrolls into view */}
//                   <div
//                     className="selected-date-label"
//                     ref={timeSlotRef}
//                   >
//                     {footerText}
//                   </div>
//                   <div className="row gx-0 time-row">
//                     {availableTimes.length > 0 ? (
//                       availableTimes.map((t) => {
//                         const isChosen = chosenTime === t;
//                         return (
//                           <div key={t} className="col-12 px-0 mb-2">
//                             <button
//                               className={`btn time-slot-btn ${
//                                 isChosen ? "selected-time" : ""
//                               }`}
//                               onClick={() => handleTimeClick(t)}
//                             >
//                               {t}
//                             </button>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <p className="select-date-text">
//                         No available slots for this date.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="select-date-text">
//                   Select a date to see available times
//                 </p>
//               )}
//             </>
//           )}

//           {/* Confirm Your Booking Form */}
//           {chosenTime && selectedDate && selectedServiceId !== null && (
//             <div className="form-fullpage">
//               <div className="form-header">
//                 <button
//                   className="back-btn"
//                   onClick={() => {
//                     setChosenTime(null);
//                   }}
//                 >
//                   ←
//                 </button>
//                 <span className="form-title">Confirm Your Booking</span>
//               </div>

//               <div className="booking-details">
//                 <div className="detail-row">
//                   <strong>Category:</strong> {category}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Service:</strong> {ALL_SERVICES_MAP[selectedServiceId]}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Date:</strong>{" "}
//                   {selectedDate.toLocaleDateString("en-GB", {
//                     weekday: "long",
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Time:</strong> {chosenTime}
//                 </div>
//               </div>

//               <form className="booking-form" onSubmit={handleBookingSubmit}>
//                 <label htmlFor="patientName" className="form-label">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="patientName"
//                   className="form-control"
//                   value={patientName}
//                   onChange={(e) => setPatientName(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="patientPhone" className="form-label">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   id="patientPhone"
//                   className="form-control"
//                   value={patientPhone}
//                   onChange={(e) => setPatientPhone(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="patientEmail" className="form-label">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="patientEmail"
//                   className="form-control"
//                   value={patientEmail}
//                   onChange={(e) => setPatientEmail(e.target.value)}
//                   required
//                 />

//                 <button type="submit" className="submit-btn">
//                   Confirm Booking
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookAppointment;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../Header";
// import "./BookAppointment.css";
// import supabase from "../../supabase"; // ← Make sure this path points to your supabase client export

// // ————————————————————————————————————————————————————————————————
// // Interfaces & Constants
// // ————————————————————————————————————————————————————————————————

// interface Service {
//   id: number;
//   title: string;
// }

// // All NHS‐category services (use the same IDs that your main “sampleServices” used):
// const NHS_SERVICES: Service[] = [
//   { id: 2, title: "Sinusitis" },
//   { id: 5, title: "Sore Throat" },
//   { id: 8, title: "Earache" },
//   { id: 9, title: "Infected Insect Bite" },
//   { id: 12, title: "Impetigo" },
//   { id: 16, title: "Shingles" },
//   { id: 6, title: "Uncomplicated UTI (Women)" },
//   { id: 22, title: "Blood Pressure Check" },
//   { id: 14, title: "Emergency Contraception" },
//   { id: 15, title: "Flu Vaccination" },
//   { id: 17, title: "COVID-19 Vaccination" },
// ];

// // All Private‐category services:
// const PRIVATE_SERVICES: Service[] = [
//   { id: 19, title: "Microsuction Earwax Removal" },
//   { id: 13, title: "Weight Loss Clinic" },
//   { id: 11, title: "Private Flu Jab" },
//   { id: 10, title: "Period Delay" },
//   { id: 1, title: "Altitude Sickness" },
//   { id: 6, title: "Vitamin B12 Injection" },
//   { id: 7, title: "Hair Loss" },
//   { id: 18, title: "Chickenpox Vaccine" },
//   { id: 21, title: "Erectile Dysfunction" },
// ];

// // A map from service ID → full “service” name (used when inserting into Supabase)
// const ALL_SERVICES_MAP: Record<number, string> = {
//   1: "Altitude Sickness",
//   2: "Sinusitis",
//   5: "Sore Throat",
//   8: "Earache",
//   9: "Infected Insect Bite",
//   12: "Impetigo",
//   16: "Shingles",
//   6: "Uncomplicated UTI (Women)",
//   22: "Blood Pressure Check",
//   14: "Emergency Contraception",
//   15: "Flu Vaccination",
//   17: "COVID-19 Vaccination",
//   19: "Microsuction Earwax Removal",
//   13: "Weight Loss Clinic",
//   11: "Private Flu Jab",
//   10: "Period Delay",
//   7: "Hair Loss",
//   18: "Chickenpox Vaccine",
//   21: "Erectile Dysfunction",
// };

// // Helper: generate 20‐minute‐increment time slots between HH:MM start and HH:MM end
// function generateTimeSlots(
//   startHour: number,
//   startMin: number,
//   endHour: number,
//   endMin: number
// ): string[] {
//   const slots: string[] = [];
//   let current = new Date();
//   current.setHours(startHour, startMin, 0, 0);
//   const end = new Date();
//   end.setHours(endHour, endMin, 0, 0);

//   while (current <= end) {
//     const hh = current.getHours().toString().padStart(2, "0");
//     const mm = current.getMinutes().toString().padStart(2, "0");
//     slots.push(`${hh}:${mm}`);
//     current = new Date(current.getTime() + 20 * 60 * 1000);
//   }
//   return slots;
// }

// // Return all possible slots for a given JS weekday (0=Sun…6=Sat) and category
// function slotsForDayAndCategory(
//   dayIndex: number,
//   category: "NHS" | "Private"
// ): string[] {
//   if (category === "NHS") {
//     switch (dayIndex) {
//       case 1: // Monday
//       case 2: // Tuesday
//       case 3: // Wednesday
//       case 4: // Thursday
//         return generateTimeSlots(9, 30, 17, 10);
//       case 5: // Friday
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 30, 17, 10),
//         ];
//       default:
//         return []; // Saturday/Sunday: no NHS
//     }
//   } else {
//     // Private
//     switch (dayIndex) {
//       case 1: // Monday
//       case 2: // Tuesday
//       case 3: // Wednesday
//         return generateTimeSlots(9, 30, 17, 10);
//       case 4: // Thursday: no Private
//         return [];
//       case 5: // Friday
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 0, 17, 10),
//         ];
//       default:
//         return []; // Saturday/Sunday: no Private
//     }
//   }
// }

// // Fetch already‐booked start_time slots (strings) for a given date (YYYY‐MM‐DD) & category
// async function fetchExistingBookings(
//   dateISO: string,
//   category: "NHS" | "Private"
// ): Promise<string[]> {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("start_time")
//     .eq("date", dateISO)
//     .eq("cat", category);

//   if (error) {
//     console.error("Supabase fetch error:", error.message);
//     return [];
//   }
//   return (data as { start_time: string }[]).map((row) => row.start_time);
// }

// // ————————————————————————————————————————————————————————————————
// // BookAppointment Component
// // ————————————————————————————————————————————————————————————————

// const BookAppointment: React.FC = () => {
//   const navigate = useNavigate();

//   // 1) category toggle: "NHS" or "Private"
//   const [category, setCategory] = useState<"NHS" | "Private">("NHS");

//   // 2) which service ID was chosen
//   const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

//   // 3) calendar state
//   const today = new Date();
//   const [displayYear, setDisplayYear] = useState(today.getFullYear());
//   const [displayMonth, setDisplayMonth] = useState(today.getMonth()); // 0=Jan…11=Dec
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   // 4) available time‐slots (strings)
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);

//   // 5) once a time‐slot is clicked, show the form
//   const [chosenTime, setChosenTime] = useState<string | null>(null);

//   // 6) form fields
//   const [patientName, setPatientName] = useState("");
//   const [patientPhone, setPatientPhone] = useState("");
//   const [patientEmail, setPatientEmail] = useState("");

//   // Whenever `category` or `selectedDate` changes, re‐load the free slots:
//   useEffect(() => {
//     async function loadSlots() {
//       if (!selectedDate) {
//         setAvailableTimes([]);
//         return;
//       }
//       const dow = selectedDate.getDay(); // Sunday=0…Saturday=6
//       const allSlots = slotsForDayAndCategory(dow, category);
//       const dateISO = selectedDate.toISOString().split("T")[0]; // YYYY‐MM‐DD

//       // Fetch existing bookings for this date & category, then filter them out
//       const booked = await fetchExistingBookings(dateISO, category);
//       const freeSlots = allSlots.filter((t) => !booked.includes(t));
//       setAvailableTimes(freeSlots);
//     }
//     loadSlots();
//   }, [selectedDate, category]);

//   // Calendar calculations:
//   const firstOfMonth = new Date(displayYear, displayMonth, 1);
//   const jsWeekday = firstOfMonth.getDay(); // Sunday=0…Saturday=6
//   const firstColumnIndex = (jsWeekday + 6) % 7; // shift so Monday=0…Sunday=6
//   const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

//   // Handlers to navigate months:
//   const handlePrevMonth = () => {
//     // Prevent going earlier than current month:
//     if (
//       displayYear > today.getFullYear() ||
//       (displayYear === today.getFullYear() && displayMonth > today.getMonth())
//     ) {
//       const prev = new Date(displayYear, displayMonth - 1, 1);
//       setDisplayYear(prev.getFullYear());
//       setDisplayMonth(prev.getMonth());
//       setSelectedDate(null);
//       setChosenTime(null);
//     }
//   };
//   const handleNextMonth = () => {
//     const next = new Date(displayYear, displayMonth + 1, 1);
//     setDisplayYear(next.getFullYear());
//     setDisplayMonth(next.getMonth());
//     setSelectedDate(null);
//     setChosenTime(null);
//   };
//   const isShowingCurrentMonth =
//     displayYear === today.getFullYear() && displayMonth === today.getMonth();

//   // When a calendar‐day is clicked:
//   const handleDayClick = (day: number) => {
//     const dt = new Date(displayYear, displayMonth, day);
//     setSelectedDate(dt);
//     setChosenTime(null);
//   };

//   // When a time‐slot is clicked:
//   const handleTimeClick = (time: string) => {
//     setChosenTime(time);
//   };

//   // Submit booking form→ Supabase:
//   const handleBookingSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDate || !chosenTime || selectedServiceId === null) return;

//     const dateISO = selectedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
//     const serviceTitle = ALL_SERVICES_MAP[selectedServiceId] || "";

//     try {
//       const { error } = await supabase.from("bookings").insert([
//         {
//           date: dateISO,
//           start_time: chosenTime,
//           cat: category,
//           service: serviceTitle,
//           patientName: patientName,
//           telNumber: patientPhone,
//           email: patientEmail,
//         },
//       ]);

//       if (error) throw error;

//       alert("Booking confirmed!");
//       navigate("/");
//     } catch (err: any) {
//       alert("Error saving booking: " + err.message);
//       console.error(err);
//     }
//   };

//   // Format selectedDate for display under “Available Times”:
//   const footerText =
//     selectedDate &&
//     selectedDate.toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   return (
//     <>
//       <Header />

//       <div className="page-wrapper">
//         <div className="container py-3">
//           {/* Back arrow */}
//           <button className="btn btn-light btn-sm mb-3" onClick={() => navigate(-1)}>
//             ←
//           </button>

//           <h2 className="fw-bold mb-4">Book an Appointment</h2>

//           {/* ————————————— Category Toggle Buttons ————————————— */}
//           <div className="d-flex gap-2 mb-4">
//             <button
//               className={`category-btn ${category === "NHS" ? "active" : ""}`}
//               onClick={() => {
//                 setCategory("NHS");
//                 setSelectedServiceId(null);
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               NHS
//             </button>
//             <button
//               className={`category-btn ${category === "Private" ? "active" : ""}`}
//               onClick={() => {
//                 setCategory("Private");
//                 setSelectedServiceId(null);
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               Private
//             </button>
//           </div>

//           {/* ————————————— Service Dropdown ————————————— */}
//           {category === "NHS" && (
//             <select
//               className="form-select mb-4"
//               value={selectedServiceId ?? ""}
//               onChange={(e) => {
//                 setSelectedServiceId(Number(e.target.value));
//                 // Reset calendar & form:
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               <option value="" disabled>
//                 Select NHS Service
//               </option>
//               {NHS_SERVICES.map((svc) => (
//                 <option key={svc.id} value={svc.id}>
//                   {svc.title}
//                 </option>
//               ))}
//             </select>
//           )}
//           {category === "Private" && (
//             <select
//               className="form-select mb-4"
//               value={selectedServiceId ?? ""}
//               onChange={(e) => {
//                 setSelectedServiceId(Number(e.target.value));
//                 setSelectedDate(null);
//                 setChosenTime(null);
//               }}
//             >
//               <option value="" disabled>
//                 Select Private Service
//               </option>
//               {PRIVATE_SERVICES.map((svc) => (
//                 <option key={svc.id} value={svc.id}>
//                   {svc.title}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* ————————————— Calendar + Time Slots ————————————— */}
//           {selectedServiceId !== null && (
//             <>
//               {/* Calendar Header */}
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <button
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={handlePrevMonth}
//                   disabled={isShowingCurrentMonth}
//                 >
//                   ‹
//                 </button>
//                 <h5 className="mb-0">
//                   {new Date(displayYear, displayMonth).toLocaleDateString("en-GB", {
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </h5>
//                 <button
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={handleNextMonth}
//                 >
//                   ›
//                 </button>
//               </div>

//               {/* Weekday Labels */}
//               <div className="row text-center text-muted small">
//                 {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((wd) => (
//                   <div key={wd} className="col-1 px-0">
//                     {wd}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Grid */}
//               <div className="row g-2 justify-content-start mb-4">
//                 {/* Blank placeholders until day “1” lines up */}
//                 {Array.from({ length: firstColumnIndex }).map((_, idx) => (
//                   <div key={`empty-${idx}`} className="col-1 px-0" />
//                 ))}
//                 {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//                   const thisDate = new Date(displayYear, displayMonth, day);
//                   const dateInPast =
//                     thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
//                   const isSelected =
//                     selectedDate && thisDate.toDateString() === selectedDate.toDateString();

//                   return (
//                     <div key={day} className="col-1 px-0">
//                       <button
//                         onClick={() => !dateInPast && handleDayClick(day)}
//                         className={`btn btn-sm w-100 ${
//                           dateInPast
//                             ? "btn-outline-secondary text-muted"
//                             : isSelected
//                             ? "btn-dark text-white"
//                             : "btn-outline-secondary"
//                         }`}
//                         disabled={dateInPast}
//                       >
//                         {day}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               <hr />

//               {/* Available Times for selectedDate */}
//               {selectedDate ? (
//                 <div>
//                   <h6 className="mb-2">{footerText}</h6>
//                   <div className="row gx-2">
//                     {availableTimes.length > 0 ? (
//                       availableTimes.map((t) => (
//                         <div key={t} className="col-auto mb-2">
//                           <button
//                             className={`btn btn-sm ${
//                               chosenTime === t
//                                 ? "btn-dark text-white"
//                                 : "btn-outline-primary"
//                             }`}
//                             onClick={() => handleTimeClick(t)}
//                           >
//                             {t}
//                           </button>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-muted">No available slots for this date.</p>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-muted">Select a date to see available times</p>
//               )}
//             </>
//           )}

//           {/* ————————————— “Confirm Your Booking” Form ————————————— */}
//           {chosenTime && selectedDate && selectedServiceId !== null && (
//             <>
//               <hr className="mt-4" />

//               <h5 className="mt-4 mb-3">Confirm Your Booking</h5>
//               <div className="mb-2">
//                 <strong>Category:</strong> {category}
//               </div>
//               <div className="mb-2">
//                 <strong>Service:</strong> {ALL_SERVICES_MAP[selectedServiceId]}
//               </div>
//               <div className="mb-2">
//                 <strong>Date:</strong>{" "}
//                 {selectedDate.toLocaleDateString("en-GB", {
//                   weekday: "long",
//                   day: "numeric",
//                   month: "short",
//                   year: "numeric",
//                 })}
//               </div>
//               <div className="mb-3">
//                 <strong>Time:</strong> {chosenTime}
//               </div>

//               <form onSubmit={handleBookingSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="patientName" className="form-label">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="patientName"
//                     className="form-control"
//                     value={patientName}
//                     onChange={(e) => setPatientName(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="patientPhone" className="form-label">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     id="patientPhone"
//                     className="form-control"
//                     value={patientPhone}
//                     onChange={(e) => setPatientPhone(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="patientEmail" className="form-label">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="patientEmail"
//                     className="form-control"
//                     value={patientEmail}
//                     onChange={(e) => setPatientEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary">
//                   Confirm Booking
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookAppointment;
