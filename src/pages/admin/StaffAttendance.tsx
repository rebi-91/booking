
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

// Define interfaces for Attendance Rows
interface AttendanceRow {
  index: number;
  Login: string | null; // Fetched dynamically from teacher["inN"]
  Logout: string | null; // Fetched dynamically from teacher["outN"]
  telNumber: string | null;
  teacherID: string | null;
  teacherName: string | null;
  Start: boolean | number | null; // Fetched dynamically from teacher["N"] (where N is day)
  Finish: boolean | number | null; // Fetched dynamically from teacher["eN"] (where N is day)
  minLate: number | null; // Fetched dynamically from teacher["minLateN"]
  totalLate: number | null;
  present: number | null; // Count of TRUE values across 1..31
  presentEvening: number | null; // Count of TRUE values across e1..e31
  days: Record<string, boolean | number | null>;
}

function StaffAttendance() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [userRole, setUserRole] = useState(""); // New state for role from profiles
  const [teachers, setTeachers] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // For searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState<AttendanceRow[]>([]);

  // Filters for Start and Finish (not present / present)
  const [filterNotPresentStart, setFilterNotPresentStart] = useState(false);
  const [filterNotPresentFinish, setFilterNotPresentFinish] = useState(false);
  const [filterPresentStart, setFilterPresentStart] = useState(false);
  const [filterPresentFinish, setFilterPresentFinish] = useState(false);

  // For selection (check rows)
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // For editing
  const [editingField, setEditingField] = useState<{ teacherID: string | null; field: string | null }>({
    teacherID: null,
    field: null,
  });
  const [fieldValues, setFieldValues] = useState<{ telNumber: string; teacherName: string }>({
    telNumber: "",
    teacherName: "",
  });

  // For adding new staff
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [newStaff, setNewStaff] = useState<{ teacherName: string; teacherID: string; telNumber: string }>({
    teacherName: "",
    teacherID: "",
    telNumber: "",
  });

  // For deleting staff
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // For long press to edit
  const longPressRef = useRef<number | null>(null);

  // For DatePicker (only allow selection within current month)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // -----------------------------------
  // Fetch user data on mount
  // -----------------------------------
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated.");
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("school, role")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        throw new Error("Failed to retrieve profile information.");
      }

      setUserSchool(profileData.school);
      setUserRole(profileData.role); // Save the role from the profile

      // Fetch teachers for the initially selected date
      await fetchTeachers(profileData.school, selectedDate);
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      alert(`Error: ${error.message}`); // Provide user feedback
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------
  // Fetch teachers with dynamic columns based on selectedDate
  // -----------------------------------
  const fetchTeachers = async (school: string, date: Date) => {
    try {
      setIsLoading(true);

      // The day of the month to use for dynamic columns
      const day = date.getDate();
      const dayStr = day.toString();
      const eveningDayStr = `e${day}`;
      const loginColumn = `in${day}`;
      const logoutColumn = `out${day}`;
      const minLateColumn = `minLate${day}`;

      const { data, error } = await supabase
        .from("teacher")
        .select("*")
        .eq("school", school)
        .order("teacherName", { ascending: true });

      if (error) throw error;

      // For each teacher row, build an AttendanceRow
      const newRows: AttendanceRow[] = [];
      for (const teacher of data as any[]) {
        // Build out the days object
        const days: Record<string, boolean | number | null> = {};
        for (let i = 1; i <= 31; i++) {
          const dStr = i.toString();
          const eStr = `e${i}`;
          days[dStr] = teacher[dStr] !== undefined ? teacher[dStr] : null;
          days[eStr] = teacher[eStr] !== undefined ? teacher[eStr] : null;
        }

        // Count how many columns 1..31 are TRUE
        const loginDaysCount = countTrueValues(days, false);
        // Count how many columns e1..e31 are TRUE
        const logoutDaysCount = countTrueValues(days, true);

        // Prepare the row object
        const row: AttendanceRow = {
          index: teacher.id,
          Login: teacher[loginColumn] || null,
          Logout: teacher[logoutColumn] || null,
          telNumber: teacher.telNumber,
          teacherID: teacher.teacherID,
          teacherName: teacher.teacherName,
          // Start/Finish from day/eveningDay
          Start: teacher[dayStr] !== undefined ? teacher[dayStr] : null,
          Finish: teacher[eveningDayStr] !== undefined ? teacher[eveningDayStr] : null,
          minLate: teacher[minLateColumn] || 0,
          totalLate: teacher.totalLate || 0,
          // Updated present & presentEvening
          present: loginDaysCount,
          presentEvening: logoutDaysCount,
          days,
        };

        // Check if we need to update teacher.present or teacher.presentEvening
        // If they differ, we'll do an update to Supabase
        const updateData: any = {};
        let updateNeeded = false;

        if (teacher.present !== loginDaysCount) {
          updateData.present = loginDaysCount;
          updateNeeded = true;
        }
        if (teacher.presentEvening !== logoutDaysCount) {
          updateData.presentEvening = logoutDaysCount;
          updateNeeded = true;
        }

        if (updateNeeded) {
          const { error: updateError } = await supabase
            .from("teacher")
            .update(updateData)
            .eq("teacherID", teacher.teacherID);

          if (updateError) {
            console.error(
              `Error updating present counts for Teacher ID ${teacher.teacherID}:`,
              updateError.message
            );
          }
        }

        newRows.push(row);
      }

      setTeachers(newRows);
      setFilteredTeachers(newRows);
    } catch (error: any) {
      console.error("Error fetching teachers:", error.message);
      alert(`Error fetching teachers: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------
  // Count how many columns are TRUE (1..31 vs e1..31)
  // -----------------------------------
  const countTrueValues = (
    days: Record<string, boolean | number | null>,
    isEvening: boolean
  ): number => {
    let count = 0;
    for (let i = 1; i <= 31; i++) {
      const dayKey = isEvening ? `e${i}` : i.toString();
      if (days[dayKey] === true) {
        count++;
      }
    }
    return count;
  };

  // -----------------------------------
  // useEffect => apply filters
  // -----------------------------------
  useEffect(() => {
    let temp = [...teachers];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        (t) =>
          (t.teacherName && t.teacherName.toLowerCase().includes(term)) ||
          (t.teacherID && t.teacherID.toLowerCase().includes(term))
      );
    }

    // Filter for Start
    if (filterNotPresentStart) {
      temp = temp.filter((t) => t.Start === false || t.Start === null);
    }
    if (filterPresentStart) {
      temp = temp.filter((t) => t.Start === true);
    }

    // Filter for Finish
    if (filterNotPresentFinish) {
      temp = temp.filter((t) => t.Finish === false || t.Finish === null);
    }
    if (filterPresentFinish) {
      temp = temp.filter((t) => t.Finish === true);
    }

    setFilteredTeachers(temp);
  }, [
    searchTerm,
    teachers,
    filterNotPresentStart,
    filterPresentStart,
    filterNotPresentFinish,
    filterPresentFinish,
  ]);

  // -----------------------------------
  // Handle DatePicker
  // -----------------------------------
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchTeachers(userSchool, date);
  };

  // -----------------------------------
  // Long Press -> edit
  // -----------------------------------
  const handleLongPressStart = (
    e: React.MouseEvent | React.TouchEvent,
    teacherID: string,
    field: string,
    currentValue: any
  ) => {
    e.preventDefault();
    longPressRef.current = window.setTimeout(() => {
      setEditingField({ teacherID, field });
      if (field === "telNumber" || field === "teacherName") {
        setFieldValues({ ...fieldValues, [field]: currentValue || "" });
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  // -----------------------------------
  // On blur => Save changes
  // -----------------------------------
  const handleFieldBlur = async (teacherID: string, field: string) => {
    const newValue = fieldValues[field as keyof typeof fieldValues].trim();
    try {
      const updateData: any = {};
      updateData[field] = newValue || null;

      const { error } = await supabase
        .from("teacher")
        .update(updateData)
        .eq("teacherID", teacherID);

      if (error) throw error;

      // Re-fetch
      await fetchTeachers(userSchool, selectedDate);

      setEditingField({ teacherID: null, field: null });
      setFieldValues({ ...fieldValues, [field]: "" });
      alert(
        `${field === "telNumber" ? "Phone Number" : "Full Name"} updated successfully!`
      );
    } catch (error: any) {
      console.error(`Error updating ${field}:`, error.message);
      alert(
        `Error updating ${
          field === "telNumber" ? "Phone Number" : "Full Name"
        }: ${error.message}`
      );
    }
  };

  // -----------------------------------
  // Generate WhatsApp link
  // -----------------------------------
  const generateWhatsAppLink = (number: string) => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;
    return `https://wa.me/${sanitizedNumber}`;
  };

  // -----------------------------------
  // Handle row selection
  // -----------------------------------
  const handleRowSelect = (teacherID: string) => {
    const newSelected = new Set(selectedTeachers);
    if (newSelected.has(teacherID)) {
      newSelected.delete(teacherID);
    } else {
      newSelected.add(teacherID);
    }
    setSelectedTeachers(newSelected);
    setSelectAll(newSelected.size === filteredTeachers.length);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedTeachers(new Set());
    } else {
      const allIDs = filteredTeachers.map((teacher) => teacher.teacherID!);
      setSelectedTeachers(new Set(allIDs));
    }
    setSelectAll(!selectAll);
  };

  // -----------------------------------
  // Delete staff
  // -----------------------------------
  const handleDeleteStaff = async () => {
    try {
      setIsLoading(true);
      for (let teacherID of selectedTeachers) {
        const { error } = await supabase
          .from("teacher")
          .delete()
          .eq("teacherID", teacherID);
        if (error) throw error;
      }
      await fetchTeachers(userSchool, selectedDate);
      setSelectedTeachers(new Set());
      setDeleteConfirmVisible(false);
      alert("Selected staff members have been deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting staff:", error.message);
      alert(`Error deleting staff: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------
  // Add new staff
  // -----------------------------------
  const handleAddStaff = async () => {
    const { teacherName, teacherID, telNumber } = newStaff;
    if (!teacherName || !teacherID || !telNumber) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      // Determine the current day to set minLateN
      const currentDay = selectedDate.getDate();
      const minLateColumn = `minLate${currentDay}`;

      // Check if teacherID already exists
      const { data: existingTeacher, error: fetchError } = await supabase
        .from("teacher")
        .select("teacherID")
        .eq("teacherID", teacherID)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116: No rows found
        throw fetchError;
      }

      if (existingTeacher) {
        alert("A staff member with this Teacher ID already exists.");
        return;
      }

      // Prepare the insert data with dynamic minLateN
      const insertData: any = {
        teacherName,
        teacherID,
        telNumber,
        school: userSchool,
        present: 0,
        presentEvening: 0,
        totalLate: 0,
      };

      // Initialize minLateN to 0 for the current day
      insertData[minLateColumn] = 0;

      const { error } = await supabase.from("teacher").insert([insertData]);

      if (error) {
        throw error;
      }

      await fetchTeachers(userSchool, selectedDate);
      setAddStaffModalVisible(false);
      setNewStaff({ teacherName: "", teacherID: "", telNumber: "" });
      alert("Staff member added successfully!");
    } catch (error: any) {
      console.error("Error adding new staff:", error.message);
      alert(`Error adding staff: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------
  // Render Start or Finish
  // -----------------------------------
  const getAttendanceDisplay = (value: boolean | number | null) => {
    if (value === true) {
      return (
        <input
          type="checkbox"
          checked={true}
          readOnly
          style={{
            width: "20px",
            height: "20px",
            cursor: "default",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "4px",
          }}
        />
      );
    } else if (value === false || value === null) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: "#dc3545", fontSize: "18px" }}>❌</span>
        </div>
      );
    } else if (typeof value === "number") {
      return <span style={{ color: "#dc3545", fontWeight: "bold" }}>{value}</span>;
    } else {
      return "---";
    }
  };

  // -----------------------------------
  // On mount
  // -----------------------------------
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  // -----------------------------------
  // Render
  // -----------------------------------
  return (
    <div style={styles.container2}>
      {/* Floating Container */}
      <div style={styles.floatingContainer}>
        {/* Show the plus button only if userRole === 'ADMIN' */}
        {userRole === "ADMIN" && (
          <button
            style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
            onClick={() => navigate("/dashboard3")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            +
          </button>
        )}
        <button
          style={styles.iconButton}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🏠
        </button>
        <button
          style={styles.iconButton2}
          onClick={() => navigate("/dashboard")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          📅
        </button>
        {/* Show the accountant button only if the user's role is ACCOUNTANT */}
        {userRole === "ACCOUNTANT" && (
          <button
            style={styles.iconButton3}
            onClick={() => navigate("/dashboard4")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            💵
          </button>
        )}
      </div>
      <div style={styles.card}>
        <h1 style={styles.header}>Staff Attendance</h1>
        <p style={styles.schoolName}>{userSchool}</p>

        {/* Top Section: Filters & Add Staff */}
        <div style={styles.topSection}>
          {/* Filter Container */}
          <div style={styles.filterContainer}>
            <h2 style={styles.subHeader}>Filters</h2>

            {/* Search Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Search:</label>
              <input
                type="text"
                placeholder="Search by Full Name or Staff ID..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Present / Not Present Filters for Start & Finish */}
            <div style={styles.formGroup}>
              {/* Present (Start) */}
              <Button
                onClick={() => {
                  setFilterPresentStart(!filterPresentStart);
                  if (filterNotPresentStart) setFilterNotPresentStart(false);
                }}
                variant={filterPresentStart ? "success" : "secondary"}
                style={{ ...styles.filterButton, marginBottom: "10px", width: "100%" }}
                title="Show staff who are present (TRUE) in Start"
              >
                {filterPresentStart ? "✅ Present (Start)" : "🕒 Present (Start)"}
              </Button>

              {/* Not Present (Start) */}
              <Button
                onClick={() => {
                  setFilterNotPresentStart(!filterNotPresentStart);
                  if (filterPresentStart) setFilterPresentStart(false);
                }}
                variant={filterNotPresentStart ? "danger" : "secondary"}
                style={{ ...styles.filterButton, marginBottom: "10px", width: "100%" }}
                title="Show staff who are NOT present (null/false) in Start"
              >
                {filterNotPresentStart ? "🔴 Not Present (Start)" : "🕒 Not Present (Start)"}
              </Button>

              {/* Extra gap */}
              <div style={{ marginBottom: "10px" }} />

              {/* Present (Finish) */}
              <Button
                onClick={() => {
                  setFilterPresentFinish(!filterPresentFinish);
                  if (filterNotPresentFinish) setFilterNotPresentFinish(false);
                }}
                variant={filterPresentFinish ? "success" : "secondary"}
                style={{ ...styles.filterButton, marginBottom: "10px", width: "100%" }}
                title="Show staff who are present (TRUE) in Finish"
              >
                {filterPresentFinish ? "✅ Present (Finish)" : "🕒 Present (Finish)"}
              </Button>

              {/* Not Present (Finish) */}
              <Button
                onClick={() => {
                  setFilterNotPresentFinish(!filterNotPresentFinish);
                  if (filterPresentFinish) setFilterPresentFinish(false);
                }}
                variant={filterNotPresentFinish ? "danger" : "secondary"}
                style={{ ...styles.filterButton, width: "100%" }}
                title="Show staff who are NOT present (null/false) in Finish"
              >
                {filterNotPresentFinish ? "🔴 Not Present (Finish)" : "🕒 Not Present (Finish)"}
              </Button>
            </div>
          </div>

          {/* Add Staff Container + DatePicker */}
          <div style={styles.addStaffContainer}>
            <h2 style={styles.subHeader}>Add New Staff</h2>
            <Button
              onClick={() => setAddStaffModalVisible(true)}
              variant="primary"
              style={styles.addStaffButton}
            >
              ➕ Add Staff
            </Button>

            {/* Date Picker - only allow selecting days within the current month */}
            <div style={styles.datePickerContainer}>
              <h4 style={{ marginBottom: "10px", color: "#fff", textAlign: "center" }}>Select Day</h4>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)}
                maxDate={new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)}
                inline
              />
            </div>
          </div>
        </div>

        {/* Delete Staff Button if any rows are checked */}
        {selectedTeachers.size > 0 && (
          <div style={styles.deleteButtonContainer}>
            <Button
              onClick={() => setDeleteConfirmVisible(true)}
              variant="danger"
              style={styles.deleteStaffButton}
            >
              Delete Staff
            </Button>
          </div>
        )}

        {/* Teachers Table */}
        <div style={styles.tableContainer}>
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading...</p>
            </div>
          ) : filteredTeachers.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  {/* Select All */}
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      style={styles.checkbox}
                    />
                  </th>
                  {/* 1) Login */}
                  <th style={styles.th}>Login</th>
                  {/* 2) Logout */}
                  <th style={styles.th}>Logout</th>
                  <th style={styles.th}>Phone Number</th>
                  <th style={styles.th}>Staff ID</th>
                  <th style={styles.th}>Full Name</th>
                  {/* Start & Finish */}
                  <th style={styles.th}>Start</th>
                  <th style={styles.th}>Finish</th>
                  <th style={styles.th}>mins Late</th>
                  <th style={styles.th}>Total mins Late</th>
                  {/* Login (Days) */}
                  <th style={styles.th}>Login (Days)</th>
                  {/* Logout (Days) */}
                  <th style={styles.th}>Logout (Days)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.teacherID} style={styles.tr}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedTeachers.has(teacher.teacherID!)}
                        onChange={() => handleRowSelect(teacher.teacherID!)}
                        style={styles.checkbox}
                      />
                    </td>

                    {/* Login Column */}
                    <td style={styles.td}>{teacher.Login || "---"}</td>

                    {/* Logout Column */}
                    <td style={styles.td}>{teacher.Logout || "---"}</td>

                    {/* Phone Number (editable via long press) */}
                    <td style={styles.td}>
                      {editingField.teacherID === teacher.teacherID &&
                      editingField.field === "telNumber" ? (
                        <input
                          type="text"
                          value={fieldValues.telNumber}
                          onChange={(e) =>
                            setFieldValues({ ...fieldValues, telNumber: e.target.value })
                          }
                          onBlur={() => handleFieldBlur(teacher.teacherID!, "telNumber")}
                          autoFocus
                          style={styles.editInput}
                          onFocus={(e) => e.currentTarget.select()}
                        />
                      ) : (
                        <a
                          href={generateWhatsAppLink(teacher.telNumber!) || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.phoneLink}
                          onMouseDown={(e) =>
                            handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)
                          }
                          onMouseUp={handleLongPressEnd}
                          onMouseLeave={handleLongPressEnd}
                          onTouchStart={(e) =>
                            handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)
                          }
                          onTouchEnd={handleLongPressEnd}
                          title="Click to message on WhatsApp or hold to edit"
                        >
                          {teacher.telNumber || "---"}
                        </a>
                      )}
                    </td>

                    {/* Staff ID */}
                    <td style={styles.td}>{teacher.teacherID || "---"}</td>

                    {/* Full Name (editable via long press) */}
                    <td style={styles.td}>
                      {editingField.teacherID === teacher.teacherID &&
                      editingField.field === "teacherName" ? (
                        <input
                          type="text"
                          value={fieldValues.teacherName}
                          onChange={(e) =>
                            setFieldValues({ ...fieldValues, teacherName: e.target.value })
                          }
                          onBlur={() => handleFieldBlur(teacher.teacherID!, "teacherName")}
                          autoFocus
                          style={styles.editInput}
                          onFocus={(e) => e.currentTarget.select()}
                        />
                      ) : (
                        <span
                          style={styles.editableText}
                          onMouseDown={(e) =>
                            handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)
                          }
                          onMouseUp={handleLongPressEnd}
                          onMouseLeave={handleLongPressEnd}
                          onTouchStart={(e) =>
                            handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)
                          }
                          onTouchEnd={handleLongPressEnd}
                          title="Hold to edit"
                        >
                          {teacher.teacherName || "---"}
                        </span>
                      )}
                    </td>

                    {/* Start */}
                    <td style={styles.td}>{getAttendanceDisplay(teacher.Start)}</td>

                    {/* Finish */}
                    <td style={styles.td}>{getAttendanceDisplay(teacher.Finish)}</td>

                    {/* min Late */}
                    <td style={styles.td}>{teacher.minLate || 0}</td>

                    {/* Total mins Late */}
                    <td style={styles.td}>{teacher.totalLate || 0}</td>

                    {/* Login (Days) */}
                    <td style={styles.td}>{teacher.present}</td>

                    {/* Logout (Days) */}
                    <td style={styles.td}>{teacher.presentEvening}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={styles.noDataText}>No staff found for the selected filters.</p>
          )}
        </div>

        {/* Add Staff Modal */}
        <Modal show={addStaffModalVisible} onHide={() => setAddStaffModalVisible(false)} centered>
          <Modal.Header closeButton style={styles.modalHeader}>
            <Modal.Title>Add New Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <Form>
              <Form.Group controlId="staffFullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={newStaff.teacherName}
                  onChange={(e) => setNewStaff({ ...newStaff, teacherName: e.target.value })}
                  style={styles.modalInput}
                />
              </Form.Group>

              <Form.Group controlId="staffID" className="mb-3">
                <Form.Label>Staff ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter staff ID"
                  value={newStaff.teacherID}
                  onChange={(e) => setNewStaff({ ...newStaff, teacherID: e.target.value })}
                  style={styles.modalInput}
                />
              </Form.Group>

              <Form.Group controlId="staffPhone" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={newStaff.telNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, telNumber: e.target.value })}
                  style={styles.modalInput}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setAddStaffModalVisible(false)} style={styles.modalCloseButton}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddStaff} style={styles.modalSubmitButton}>
              Add Staff
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={deleteConfirmVisible} onHide={() => setDeleteConfirmVisible(false)} centered>
          <Modal.Header closeButton style={styles.modalHeader}>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            Are you sure you want to delete the selected staff members?
          </Modal.Body>
          <Modal.Footer style={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setDeleteConfirmVisible(false)} style={styles.modalCloseButton}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteStaff} style={styles.modalDeleteButton}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

// ------------------------------------
// Styles
// ------------------------------------
const styles: Record<string, CSSProperties> = {
  container2: {
    position: "relative",
    width: "95%",
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff",
  },
  floatingContainer: {
    position: "fixed",
    top: "20px",
    left: "35px",
    width: "82px",
    height: "auto",
    backgroundColor: "#000",
    borderRadius: "20px",
    boxShadow: "0 2px 12px 1px #007BA7",
    padding: "5px 10px",
    zIndex: 1000,
    flexShrink: 0,
  },
  card: {
    margin: "0 auto",
    width: "95%",
    maxWidth: "1400px",
    padding: "20px",
    backgroundColor: "#000",
    boxShadow: "0 4px 20px 1px #007BA7",
    borderRadius: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff",
  },
  iconButton: {
    width: "60px",
    height: "60px",
    margin: "12px 0",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "1px solid #Dfff",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
  },
  iconButton2: {
    width: "60px",
    height: "60px",
    margin: "12px 0",
    fontSize: "34px",
    padding: "20px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "1px solid #Dfff",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  iconButton3: {
    width: "60px",
    height: "60px",
    margin: "12px 0",
    fontSize: "34px",
    padding: "20px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00008B",
    color: "#fff",
    border: "1px solid #Dfff",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  iconButtonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
    backgroundColor: "#e8e8e8",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#e0e0e0",
    textAlign: "center",
  },
  schoolName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#b0b0b0",
    textAlign: "center",
  },
  topSection: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },
  filterContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px 1px #000",
    flex: "1",
    minWidth: "280px",
  },
  addStaffContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px 1px #000",
    flex: "1",
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  subHeader: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
    color: "#fff",
  },
  searchInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.3s ease",
  },
  filterButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  addStaffButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteButtonContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "flex-start",
  },
  deleteStaffButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#1e1e1e",
    padding: "12px",
    position: "relative",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
    color: "#fff",
    fontSize: "16px",
  },
  th: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#3ecf8e",
    color: "#000",
    fontSize: "18px",
  },
  td: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "10px",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
  },
  tr: {
    borderBottom: "1px solid #555",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  editableText: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#3ecf8e",
  },
  editInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "5px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  phoneLink: {
    color: "#3ecf8e",
    textDecoration: "underline",
    cursor: "pointer",
    backgroundColor: "#1e1e1e",
  },
  noDataText: {
    textAlign: "center",
    color: "#fff",
    fontSize: "18px",
    padding: "20px",
  },
  loadingContainer: {
    textAlign: "center",
    color: "#fff",
    fontSize: "18px",
  },
  modalHeader: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderBottom: "1px solid #555",
  },
  modalBody: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  modalFooter: {
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #555",
  },
  modalInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    width: "100%",
  },
  modalSubmitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  modalDeleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
  modalCloseButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
  datePickerContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
};

export default StaffAttendance;
