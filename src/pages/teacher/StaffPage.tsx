import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Container, Row, Col, Table, Spinner, Alert, Form, Button } from "react-bootstrap";

import useGeolocation from "../auth/hooks/useGeolocation";   
import { getDistanceFromLatLonInMeters } from "../auth/hooks/distance";

import "./StaffPage.css"; // Custom CSS

ChartJS.register(ArcElement, Tooltip, Legend);

function StaffPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const geolocation = useGeolocation(); // For geolocation checks

  // Teacher info
  const [teacherName, setTeacherName] = useState("");
  const [school, setSchool] = useState("");
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [logoutTime, setLogoutTime] = useState<string | null>(null);
  const [minLate, setMinLate] = useState<number | null>(null);
  const [totalLate, setTotalLate] = useState<number | null>(null);

  // Shift dropdown
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState("");

  // Date info
  const today = new Date();
  const currentDay = today.getDate();  // e.g. 3
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ] as const;
  const currentMonthName = monthNames[currentMonth];
  const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  // Start = columns 1..31, Finish = e1..e31
  const [startAttendance, setStartAttendance] = useState<(boolean | null)[]>([]);
  const [finishAttendance, setFinishAttendance] = useState<(boolean | null)[]>([]);

  // present / presentEvening
  const [present, setPresent] = useState(0);
  const [presentEvening, setPresentEvening] = useState(0);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pie chart slices
  const [startPresentCount, setStartPresentCount] = useState(0);
  const [startAbsentCount, setStartAbsentCount] = useState(0);
  const [finishPresentCount, setFinishPresentCount] = useState(0);
  const [finishAbsentCount, setFinishAbsentCount] = useState(0);

  // If no session
  useEffect(() => {
    if (!session) {
      setError("No active session. Please log in.");
      setLoading(false);
    }
  }, [session]);

  // 1) Fetch shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const { data, error } = await supabase.from("shift").select("*");
        if (error) throw error;
        setShifts(data || []);
      } catch (err: any) {
        console.error("Error fetching shifts:", err.message);
      }
    };
    fetchShifts();
  }, []);

  // 2) Fetch teacher row
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);

        // Auth user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        // from 'profiles' => role=Teacher, password=teacherID, school=school
        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("role, password, school")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileError || !profileRow) {
          setError("Failed to retrieve profile or not a teacher.");
          setLoading(false);
          return;
        }
        if (profileRow.role !== "Teacher") {
          setError("You are not authorized. Only role=Teacher is allowed here.");
          setLoading(false);
          return;
        }

        const teacherID = profileRow.password;
        const schoolName = profileRow.school;
        setSchool(schoolName || "");

        // fetch row from teacher table
        const { data: teacherRow, error: teacherError } = await supabase
          .from("teacher")
          .select("*")
          .eq("teacherID", teacherID)
          .eq("school", schoolName)
          .maybeSingle();

        if (teacherError || !teacherRow) {
          setError("No teacher record found for your ID & school.");
          setLoading(false);
          return;
        }

        // fill local states
        setTeacherName(teacherRow.teacherName || "");
        // loginTime from inN
        setLoginTime(teacherRow[`in${currentDay}`] || null);
        // logoutTime from outN
        setLogoutTime(teacherRow[`out${currentDay}`] || null);
        // minLate from minLateN
        setMinLate(teacherRow[`minLate${currentDay}`] ?? 0);
        setTotalLate(teacherRow.totalLate ?? 0);

        // present/presentEvening
        setPresent(teacherRow.present || 0);
        setPresentEvening(teacherRow.presentEvening || 0);

        // build arrays for start & finish
        const tempStart: (boolean | null)[] = [];
        const tempFinish: (boolean | null)[] = [];
        for (let d = 1; d <= numberOfDays; d++) {
          tempStart.push(teacherRow[`${d}`] === true ? true : null);
          tempFinish.push(teacherRow[`e${d}`] === true ? true : null);
        }
        setStartAttendance(tempStart);
        setFinishAttendance(tempFinish);

      } catch (err: any) {
        console.error("Error fetching teacher data:", err.message);
        setError(err.message || "Unexpected error.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTeacherData();
    }
    // eslint-disable-next-line
  }, [session]);

  // 3) Compute present/absent counts for Login/Logout charts
  useEffect(() => {
    if (startAttendance.length > 0) {
      let present = 0, absent = 0;
      startAttendance.forEach((val) => {
        if (val === true) present++;
        else absent++;
      });
      setStartPresentCount(present);
      setStartAbsentCount(absent);
    }

    if (finishAttendance.length > 0) {
      let present = 0, absent = 0;
      finishAttendance.forEach((val) => {
        if (val === true) present++;
        else absent++;
      });
      setFinishPresentCount(present);
      setFinishAbsentCount(absent);
    }
  }, [startAttendance, finishAttendance]);

  // Filter shifts to match teacher's school, only show Evening if hour >= 14
  const baghdadTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Baghdad" });
  const baghdadDate = new Date(baghdadTime);
  const baghdadHour = baghdadDate.getHours();

  const filteredShifts = shifts.filter((sh) => {
    if (sh.school !== school) return false;
    if (sh.shift === "Evening" && baghdadHour < 14) return false;
    return true;
  });

  const shiftLabel = (sh: any) => `${sh.shift} [${sh.cutOff} - ${sh.earlyOff}]`;

  // Re-count present / presentEvening after changes
  const updateMonthlyCounters = async (teacherRow: any, teacherID: string, schoolName: string) => {
    try {
      let countStart = 0;
      for (let i = 1; i <= 31; i++) {
        if (teacherRow[`${i}`] === true) countStart++;
      }
      let countFinish = 0;
      for (let i = 1; i <= 31; i++) {
        if (teacherRow[`e${i}`] === true) countFinish++;
      }

      const updateObj: any = {};
      let needsUpdate = false;
      if (countStart !== teacherRow.present) {
        updateObj.present = countStart;
        needsUpdate = true;
      }
      if (countFinish !== teacherRow.presentEvening) {
        updateObj.presentEvening = countFinish;
        needsUpdate = true;
      }

      if (needsUpdate) {
        const { error } = await supabase
          .from("teacher")
          .update(updateObj)
          .eq("teacherID", teacherID)
          .eq("school", schoolName);

        if (!error) {
          setPresent(countStart);
          setPresentEvening(countFinish);
        }
      }
    } catch (err: any) {
      console.error("Error updating monthly counters:", err.message);
    }
  };

  // Geolocation check (50m) but fetch from 'schoolName' column in school table
  const verifySchoolRange = async (schoolName: string) => {
    const { data: schoolRow, error: schoolErr } = await supabase
      .from("school")
      .select("lat, long")
      // CHANGED: match 'schoolName' column in the school table
      .eq("schoolName", schoolName)
      .maybeSingle();

    if (schoolErr || !schoolRow) {
      throw new Error(`Could not load lat/long from school table where schoolName='${schoolName}'.`);
    }
    if (geolocation.loading) {
      throw new Error("Geolocation is still loading, please wait...");
    }
    if (geolocation.error) {
      throw new Error(geolocation.error);
    }

    const distance = getDistanceFromLatLonInMeters(
      geolocation.latitude!,
      geolocation.longitude!,
      schoolRow.lat,
      schoolRow.long
    );
    if (distance > 450) {
      throw new Error(
        `You are over 50m from your assigned school. Distance: ${distance.toFixed(1)}m`
      );
    }
  };

  const findShiftByLabel = (label: string) => {
    return filteredShifts.find((sh) => shiftLabel(sh) === label) || null;
  };

  // =================== handleLogin ===================
  const handleLogin = async () => {
    try {
      if (!selectedShift) {
        alert("Please select a shift first.");
        return;
      }
      // geolocation
      await verifySchoolRange(school);

      // shift
      const chosenShift = findShiftByLabel(selectedShift);
      if (!chosenShift) {
        throw new Error("Invalid shift selection.");
      }

      // compare current time vs. cutOff
      const [cutOffHour, cutOffMin] = chosenShift.cutOff.split(":").map(Number);
      const nowBaghdad = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baghdad" }));
      const cutOffTime = new Date(nowBaghdad);
      cutOffTime.setHours(cutOffHour, cutOffMin, 0, 0);
      const isLate = nowBaghdad > cutOffTime;

      // fetch teacher row again
      const userRes = await supabase.auth.getUser();
      if (!userRes.data?.user) throw new Error("User not found in session.");
      const userId = userRes.data.user.id;

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("password, school")
        .eq("id", userId)
        .maybeSingle();
      if (!profileRow) throw new Error("No teacher profile found.");

      const teacherID = profileRow.password;
      const schoolName = profileRow.school;

      const { data: teacherRow, error: tErr } = await supabase
        .from("teacher")
        .select("*")
        .eq("teacherID", teacherID)
        .eq("school", schoolName)
        .maybeSingle();

      if (tErr || !teacherRow) {
        throw new Error("Teacher row not found for login.");
      }

      const dayStr = currentDay.toString();

      // NO MULTIPLE SIGN-INS => if dayStr or inN is set, disallow
      if (teacherRow[dayStr] === true) {
        throw new Error("You have already signed in today.");
      }
      if (teacherRow[`in${dayStr}`]) {
        throw new Error("Login time for today is already recorded.");
      }

      // build update
      const updateObj: any = {};
      updateObj[dayStr] = true;

      // record inN
      const baghdadTimeStr = nowBaghdad.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Baghdad",
      });
      updateObj[`in${dayStr}`] = baghdadTimeStr;

      // if late => minLateN
      let minutesLate = 0;
      if (isLate) {
        const diffMs = nowBaghdad.getTime() - cutOffTime.getTime();
        minutesLate = Math.floor(diffMs / 60000);
      }
      updateObj[`minLate${dayStr}`] = minutesLate.toString();

      // add to totalLate
      const oldTotalLate = parseInt(teacherRow.totalLate || "0", 10);
      const newTotalLate = oldTotalLate + minutesLate;
      updateObj.totalLate = newTotalLate.toString();

      // update DB
      const { error: updErr } = await supabase
        .from("teacher")
        .update(updateObj)
        .eq("teacherID", teacherID)
        .eq("school", schoolName);

      if (updErr) throw new Error("Failed to record login: " + updErr.message);

      // success => update local UI
      setLoginTime(baghdadTimeStr);
      setMinLate(minutesLate);
      setTotalLate(newTotalLate);

      // set day => true in startAttendance
      const copy = [...startAttendance];
      copy[currentDay - 1] = true;
      setStartAttendance(copy);

      // re-fetch row to update counters
      const { data: afterRow } = await supabase
        .from("teacher")
        .select("*")
        .eq("teacherID", teacherID)
        .eq("school", schoolName)
        .maybeSingle();

      if (afterRow) {
        await updateMonthlyCounters(afterRow, teacherID, schoolName);
      }

      alert("Login successful.");
    } catch (err: any) {
      alert(err.message);
      console.error("Login error:", err.message);
    }
  };

  // =================== handleLogout ===================
  const handleLogout = async () => {
    try {
      if (!selectedShift) {
        alert("Please select a shift first.");
        return;
      }
      // geolocation
      await verifySchoolRange(school);

      // shift
      const chosenShift = findShiftByLabel(selectedShift);
      if (!chosenShift) {
        throw new Error("Invalid shift selection for logout.");
      }

      // 30 min before earlyOff
      const [eoHour, eoMin] = chosenShift.earlyOff.split(":").map(Number);
      const nowBaghdad = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Baghdad" }));
      const earlyOffTime = new Date(nowBaghdad);
      earlyOffTime.setHours(eoHour, eoMin, 0, 0);

      // The teacher can only logout if now >= (earlyOff - 30 min)
      const cutoffLogout = new Date(earlyOffTime.getTime() - 30 * 60000);
      if (nowBaghdad < cutoffLogout) {
        throw new Error("Logout 30 mins before shift ends. Thank you!");
      }

      // fetch teacher row
      const userRes = await supabase.auth.getUser();
      if (!userRes.data?.user) throw new Error("User not found in session.");
      const userId = userRes.data.user.id;

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("password, school")
        .eq("id", userId)
        .maybeSingle();

      if (!profileRow) throw new Error("No teacher profile found for logout.");

      const teacherID = profileRow.password;
      const schoolName = profileRow.school;

      const { data: teacherRow, error: tErr } = await supabase
        .from("teacher")
        .select("*")
        .eq("teacherID", teacherID)
        .eq("school", schoolName)
        .maybeSingle();

      if (tErr || !teacherRow) {
        throw new Error("Teacher not found for logout. Contact Admin");
      }

      const eDayStr = `e${currentDay}`;

      // We DO NOT block if eN is already TRUE => we allow overwriting
      // if (teacherRow[eDayStr] === true) {
      //   // no error => multiple sign-outs are allowed
      // }

      // build update
      const updateObj: any = {};
      updateObj[eDayStr] = true;  // always set to TRUE or keep it if it was already true

      // record outN
      const baghdadTimeStr = nowBaghdad.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Baghdad",
      });
      updateObj[`out${currentDay}`] = baghdadTimeStr;

      // update DB
      const { error: updErr } = await supabase
        .from("teacher")
        .update(updateObj)
        .eq("teacherID", teacherID)
        .eq("school", schoolName);

      if (updErr) {
        throw new Error("Failed to record logout: " + updErr.message);
      }

      // success => update UI
      setLogoutTime(baghdadTimeStr);

      // mark eN => true in finishAttendance
      const copy = [...finishAttendance];
      copy[currentDay - 1] = true;
      setFinishAttendance(copy);

      // re-fetch row to update counters
      const { data: afterRow } = await supabase
        .from("teacher")
        .select("*")
        .eq("teacherID", teacherID)
        .eq("school", schoolName)
        .maybeSingle();

      if (afterRow) {
        await updateMonthlyCounters(afterRow, teacherID, schoolName);
      }

      alert("Logout successful.");
    } catch (err: any) {
      alert(err.message);
      console.error("Logout error:", err.message);
    }
  };

  // If loading
  if (loading) {
    return (
      <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  // If error
  if (error) {
    return (
      <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Build chart data
  const loginData = {
    labels: ["Present (Login)", "Absent (Login)"],
    datasets: [
      {
        label: "Login Attendance",
        data: [startPresentCount, startAbsentCount],
        backgroundColor: ["#007bff", "#ff4d4d"],
        hoverBackgroundColor: ["#0056b3", "#cc0000"],
      },
    ],
  };
  const logoutData = {
    labels: ["Present (Logout)", "Absent (Logout)"],
    datasets: [
      {
        label: "Logout Attendance",
        data: [finishPresentCount, finishAbsentCount],
        backgroundColor: ["#50B755", "#ff4d4d"],
        hoverBackgroundColor: ["#379d3a", "#cc0000"],
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  // Format month-year
  const getCurrentMonthYear = () => {
    return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  };

  return (
    <Container fluid className="staffpage-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="bg-dark text-white p-4 rounded shadow">

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
              <div>
                <h2 className="text-primary mb-1">
                  {teacherName || "Unknown Teacher"}
                </h2>
                <p className="mb-0">
                  <strong>School:</strong> {school}
                </p>
                <p className="current-month-year">{getCurrentMonthYear()}</p>
              </div>
              <div className="d-flex flex-row align-items-end mt-3 mt-md-0">
                {/* Buttons exactly the same as the previous example */}
                <button
                  className="teacher-icon-button me-2"
                  onClick={() => navigate("/teacherdashboard")}
                  title="Go to Teacher Dashboard"
                >
                  🎓
                </button>
                <button
                  className="teacher-icon-button2 me-2"
                  onClick={() => navigate("/attendance")}
                  title="Go to Attendance Page"
                >
                  📃
                </button>
                <button
                  className="teacher-icon-button3"
                  onClick={() => navigate("/")}
                  title="Go to Home Page"
                >
                  🏠
                </button>
              </div>
            </div>

            {/* SHIFT DROPDOWN */}
            <div className="mb-3">
              <Form.Group>
                <Form.Label>Select Shift:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  <option value="">-- Select a Shift --</option>
                  {filteredShifts.map((sh) => {
                    const lbl = shiftLabel(sh);
                    return (
                      <option key={lbl} value={lbl}>
                        {lbl}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </div>

            {/* Top Container: Login, Logout, minLate, totalLate */}
            <div className="stats-container mb-4">
              <Row>
                {/* Login container => handleLogin */}
                <Col xs={6} md={3} className="mb-2">
                  <div
                    className="stat-box clickable"
                    title="Click to Login"
                    onClick={handleLogin}
                  >
                    <span className="stat-label">Login</span>
                    <span className="stat-value">{loginTime || "---"}</span>
                  </div>
                </Col>

                {/* Logout container => handleLogout */}
                <Col xs={6} md={3} className="mb-2">
                  <div
                    className="stat-box clickable"
                    title="Click to Logout"
                    onClick={handleLogout}
                  >
                    <span className="stat-label">Logout</span>
                    <span className="stat-value">{logoutTime || "---"}</span>
                  </div>
                </Col>

                {/* Minutes Late */}
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Minutes Late</span>
                    <span className="stat-value">
                      {minLate !== null ? minLate : "---"}
                    </span>
                  </div>
                </Col>

                {/* Total Late */}
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Total Late</span>
                    <span
                      className="stat-value"
                      style={{
                        color: totalLate === 0 ? "#50B755" : "#ff4d4d",
                        fontWeight: "bold",
                      }}
                    >
                      {totalLate !== null ? totalLate : "---"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Pie Charts: "Login" & "Logout" */}
            <Row className="justify-content-center">
              <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
                <h5 className="chart-title" style={{ backgroundColor: "#007bff" }}>
                  Login Attendance
                </h5>
                <div className="pie-container">
                  <Pie data={loginData} options={chartOptions} />
                  <div className="pie-center-text">
                    {startPresentCount + startAbsentCount > 0
                      ? (
                          (startPresentCount /
                            (startPresentCount + startAbsentCount)) *
                          100
                        ).toFixed(1)
                      : 0
                    }%
                  </div>
                </div>
              </Col>
              <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
                <h5 className="chart-title" style={{ backgroundColor: "#50B755" }}>
                  Logout Attendance
                </h5>
                <div className="pie-container">
                  <Pie data={logoutData} options={chartOptions} />
                  <div className="pie-center-text">
                    {finishPresentCount + finishAbsentCount > 0
                      ? (
                          (finishPresentCount /
                            (finishPresentCount + finishAbsentCount)) *
                          100
                        ).toFixed(1)
                      : 0
                    }%
                  </div>
                </div>
              </Col>
            </Row>

            {/* present => "Login (Days)", presentEvening => "Logout (Days)" */}
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={6} lg={4} className="d-flex justify-content-center">
                <div className="present-container p-4 rounded shadow">
                  <Row>
                    <Col xs={6} className="text-center">
                      <h6>Login (Days)</h6>
                      <p className="present-count">{present}</p>
                    </Col>
                    <Col xs={6} className="text-center">
                      <h6>Logout (Days)</h6>
                      <p className="present-evening-count">{presentEvening}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Table: two columns for Login/Logout, then Day, then Start/Finish */}
            <div className="table-responsive">
              <Table bordered hover className="text-center align-middle w-100 table-custom">
                <thead>
                  <tr>
                    <th>Login</th>
                    <th>Logout</th>
                    <th>Day</th>
                    <th>Start</th>
                    <th>Finish</th>
                  </tr>
                </thead>
                <tbody>
                  {daysArray.map((day) => {
                    const startVal = startAttendance[day - 1];  
                    const finishVal = finishAttendance[day - 1]; 

                    return (
                      <tr key={day}>
                        {/* Show today's inN/outN or '---' */}
                        <td>
                          {day === currentDay ? (loginTime || "---") : "---"}
                        </td>
                        <td>
                          {day === currentDay ? (logoutTime || "---") : "---"}
                        </td>
                        <td className="fw-bold">{day}</td>
                        <td>{startVal === true ? "✅" : "❌"}</td>
                        <td>{finishVal === true ? "✅" : "❌"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default StaffPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";

// import './StaffPage.css'; // Our custom CSS

// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffPage() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // Basic state
//   const [teacherName, setTeacherName] = useState("");
//   const [school, setSchool] = useState("");
//   const [loginTime, setLoginTime] = useState<string | null>(null);
//   const [logoutTime, setLogoutTime] = useState<string | null>(null);
//   const [minLate, setMinLate] = useState<number | null>(null);
//   const [totalLate, setTotalLate] = useState<number | null>(null);

//   // Columns for days in the month (1..31)
//   const today = new Date();
//   const currentMonth = today.getMonth(); 
//   const currentYear = today.getFullYear();
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ] as const;
//   const currentMonthName = monthNames[currentMonth];
//   const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate(); 
//   const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

//   // We'll store morning attendance T/F for each day in an array
//   // We'll store evening attendance T/F for each day in a separate array
//   const [morningAttendance, setMorningAttendance] = useState<(boolean | null)[]>([]);
//   const [eveningAttendance, setEveningAttendance] = useState<(boolean | null)[]>([]);

//   // Add state variables for present and presentEvening
//   const [present, setPresent] = useState<number>(0);
//   const [presentEvening, setPresentEvening] = useState<number>(0);

//   // For loading & error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // We'll compute for the pie charts
//   const [morningPresentCount, setMorningPresentCount] = useState(0);
//   const [morningAbsentCount, setMorningAbsentCount] = useState(0);
//   const [eveningPresentCount, setEveningPresentCount] = useState(0);
//   const [eveningAbsentCount, setEveningAbsentCount] = useState(0);

//   // Utility: if a column is TRUE => present, if null => absent
//   const isPresent = (val: any) => val === true;

//   // 1) Check role => if not Teacher => sign-up
//   // 2) Match teacher row => password == teacherID, plus same school
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // 1) fetch user role, password, and school
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError || !user) {
//           setError("Not authenticated. Please log in.");
//           navigate("/sign-up");
//           return;
//         }

//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("role, password, school")
//           .eq("id", user.id)
//           .single();

//         if (profileError || !profileData) {
//           setError("Failed to retrieve profile data.");
//           navigate("/sign-up");
//           return;
//         }

//         if (profileData.role !== "Teacher") {
//           setError("You are not authorized as a Teacher.");
//           navigate("/sign-up");
//           return;
//         }

//         // password => teacherID
//         const teacherID = profileData.password;
//         const schoolName = profileData.school || "";

//         // 2) fetch teacher row
//         const { data: teacherRow, error: teacherError } = await supabase
//           .from("teacher")
//           .select("*")
//           .eq("teacherID", teacherID)
//           .eq("school", schoolName)
//           .single();

//         if (teacherError || !teacherRow) {
//           setError("No matching teacher found in 'teacher' table.");
//           return;
//         }

//         // Now we have the teacher row. Extract attendance
//         setTeacherName(teacherRow.teacherName || "");
//         setSchool(teacherRow.school || "");

//         // top stats
//         setLoginTime(teacherRow.Login || null);
//         setLogoutTime(teacherRow.Logout || null);
//         setMinLate(teacherRow.minLate || 0);
//         setTotalLate(teacherRow.totalLate || 0);

//         // Set present and presentEvening
//         const fetchedPresent = teacherRow.present || 0;
//         const fetchedPresentEvening = teacherRow.presentEvening || 0;

//         setPresent(fetchedPresent);
//         setPresentEvening(fetchedPresentEvening);

//         // build morning and evening attendance arrays
//         let tempMorning: (boolean | null)[] = [];
//         let tempEvening: (boolean | null)[] = [];

//         for (let day = 1; day <= numberOfDays; day++) {
//           const dayVal = teacherRow[`${day}`]; 
//           const eveningVal = teacherRow[`e${day}`];
//           tempMorning.push(dayVal === true ? true : null);
//           tempEvening.push(eveningVal === true ? true : null);
//         }

//         setMorningAttendance(tempMorning);
//         setEveningAttendance(tempEvening);
//       } catch (err: any) {
//         console.error("Error fetching teacher data:", err);
//         setError(err.message || "Unexpected error.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Pie Chart calculation
//   useEffect(() => {
//     if (morningAttendance.length > 0) {
//       let presentM = 0;
//       let absentM = 0;
//       morningAttendance.forEach((val) => {
//         if (val === true) presentM++;
//         else absentM++;
//       });
//       setMorningPresentCount(presentM);
//       setMorningAbsentCount(absentM);
//     }

//     if (eveningAttendance.length > 0) {
//       let presentE = 0;
//       let absentE = 0;
//       eveningAttendance.forEach((val) => {
//         if (val === true) presentE++;
//         else absentE++;
//       });
//       setEveningPresentCount(presentE);
//       setEveningAbsentCount(absentE);
//     }
//   }, [morningAttendance, eveningAttendance]);

//   // Pie data for Morning
//   const morningData = {
//     labels: ["Present (M)", "Absent (M)"],
//     datasets: [
//       {
//         label: "Morning Attendance",
//         data: [morningPresentCount, morningAbsentCount],
//         backgroundColor: ["#007bff", "#ff4d4d"], // Blue for present, red for absent
//         hoverBackgroundColor: ["#0056b3", "#cc0000"], // Darker blue and darker red on hover
//       },
//     ],
//   };

//   // Pie data for Evening
//   const eveningData = {
//     labels: ["Present (E)", "Absent (E)"],
//     datasets: [
//       {
//         label: "Evening Attendance",
//         data: [eveningPresentCount, eveningAbsentCount],
//         backgroundColor: ["#50B755", "#ff4d4d"], // Green for present, red for absent
//         hoverBackgroundColor: ["#379d3a", "#cc0000"], // Darker green and darker red on hover
//       },
//     ],
//   };

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   };

//   // UI Interactions
//   const handleGraduateClick = () => {
//     navigate("/teacherdashboard");
//   };
//   const handleFormClick = () => {
//     navigate("/attendance");
//   };

//   // Function to get current month and year
//   const getCurrentMonthYear = () => {
//     const date = new Date();
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${month} ${year}`;
//   };

//   // Rendering
//   if (loading) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Spinner animation="border" variant="primary" role="status" />
//         <p className="mt-3">Loading...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="staffpage-container py-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark text-white p-4 rounded shadow">
//             {/* Header / Teacher info */}
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
//               <div>
//                 <h2 className="text-primary mb-1">
//                   {teacherName || "Teacher Name"}
//                 </h2>
//                 <p className="mb-0">
//                   <strong>School:</strong> {school}
//                 </p>
//                 {/* Current Month and Year */}
//                 <p className="current-month-year">{getCurrentMonthYear()}</p>
//               </div>
//               <div className="d-flex flex-row align-items-end mt-3 mt-md-0">
//                 {/* Nav Buttons */}
//                 <button
//                   className="teacher-icon-button me-2"
//                   onClick={handleGraduateClick}
//                   title="Go to Teacher Dashboard"
//                 >
//                   🎓
//                 </button>
//                 <button
//                   className="teacher-icon-button2 me-2"
//                   onClick={handleFormClick}
//                   title="Go to Attendance Page"
//                 >
//                   📃
//                 </button>
//                 {/* Optional: HomePage Button */}
//                 <button
//                   className="teacher-icon-button3"
//                   onClick={() => navigate("/")}
//                   title="Go to Home Page"
//                 >
//                   🏠
//                 </button>
//               </div>
//             </div>

//             {/* Top container for login, logout, minLate, totalLate */}
//             <div className="stats-container mb-4">
//               <Row>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Login</span>
//                     <span className="stat-value">{loginTime || "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Logout</span>
//                     <span className="stat-value">{logoutTime || "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Minutes Late</span>
//                     <span className="stat-value">{minLate !== null ? minLate : "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Total Late</span>
//                     <span
//                       className="stat-value"
//                       style={{
//                         color: totalLate === 0 ? "#50B755" : "#ff4d4d",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {totalLate !== null ? totalLate : "---"}
//                     </span>
//                   </div>
//                 </Col>
//               </Row>
//             </div>

//             {/* Two Pie Charts: Morning & Evening */}
//             <Row className="justify-content-center">
//               {/* Morning Attendance Pie Chart */}
//               <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#007bff' }}>
//                   Morning Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={morningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {morningPresentCount + morningAbsentCount > 0
//                       ? (
//                           (morningPresentCount /
//                             (morningPresentCount + morningAbsentCount)) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>

//               {/* Evening Attendance Pie Chart */}
//               <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#50B755' }}>
//                   Evening Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={eveningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {eveningPresentCount + eveningAbsentCount > 0
//                       ? (
//                           (eveningPresentCount /
//                             (eveningPresentCount + eveningAbsentCount)) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* New Container for Present and PresentEvening */}
//             <Row className="justify-content-center mb-4">
//               <Col xs={12} md={6} lg={4} className="d-flex justify-content-center">
//                 <div className="present-container p-4 rounded shadow">
//                   <Row>
//                     <Col xs={6} className="text-center">
//                       <h6>Morning (Day)</h6>
//                       <p className="present-count">{present}</p>
//                     </Col>
//                     <Col xs={6} className="text-center">
//                       <h6>Evening (Day)</h6>
//                       <p className="present-evening-count">{presentEvening}</p>
//                     </Col>
//                   </Row>
//                 </div>
//               </Col>
//             </Row>

//             {/* Attendance Table (Day, M, E) */}
//             <div className="table-responsive">
//               <Table bordered hover className="text-center align-middle w-100 table-custom">
//                 <thead>
//                   <tr>
//                     <th className="th-day">Day</th>
//                     <th className="th-morning">M</th>
//                     <th className="th-evening">E</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {daysArray.map((day) => {
//                     const morningVal = morningAttendance[day - 1];
//                     const eveningVal = eveningAttendance[day - 1];
//                     return (
//                       <tr key={day}>
//                         <td className="fw-bold day-col">{day}</td>
//                         <td>
//                           {morningVal === true ? "✅" : "❌"}
//                         </td>
//                         <td>
//                           {eveningVal === true ? "✅" : "❌"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default StaffPage;
