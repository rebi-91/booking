import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import AlertModal from "./../AlertModal";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>(
    {}
  );
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
  const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
  const inputRef = useRef<number | null>(null);
  const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
  const today = new Date();
  const currentDay = today.getDate();

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassName) {
      fetchSections(selectedClassName);
    } else {
      setSections([]);
      setSelectedSection("");
      fetchStudents(userSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassName]);

  useEffect(() => {
    fetchStudents(userSchool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const hasAbsence = (studentId: string): boolean => {
    const attendance = attendanceData[studentId];
    if (!attendance) return false;
    return classTimes.some((classTime) => !attendance[classTime]);
  };

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
        .select("school, custMessage")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        throw new Error("Failed to retrieve profile information.");
      }

      setUserSchool(profileData.school);
      setCustMessage(profileData.custMessage || "");
      setTempCustMessage(profileData.custMessage || "");

      fetchClassNames(profileData.school);
      fetchStudents(profileData.school);
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      setAlertMessage("Error fetching user information. Please try again.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClassNames = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school)
        .neq("className", null);

      if (error) throw error;

      const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
      setClassNames(uniqueClassNames);
    } catch (error: any) {
      console.error("Error fetching class names:", error.message);
      setAlertMessage("Error fetching class names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSections = async (className: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("className", className)
        .neq("section", null);

      if (error) throw error;

      const uniqueSections = [...new Set(data.map((item: any) => item.section))];
      setSections(uniqueSections);
    } catch (error: any) {
      console.error("Error fetching sections:", error.message);
      setAlertMessage("Error fetching sections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (school: string) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("student")
        .select("id, studentName, className, section, studentNumber, guardianNumber")
        .eq("school", school)
        .order("className", { ascending: true })
        .order("section", { ascending: true })
        .order("id", { ascending: true });

      if (selectedClassName) {
        query = query.eq("className", selectedClassName);
      }

      if (selectedSection) {
        query = query.eq("section", selectedSection);
      }

      const { data, error } = await query;

      if (error) throw error;

      const grouped: Record<string, any[]> = {};
      data.forEach((student: any) => {
        const key = `${student.className} - Section ${student.section}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(student);
      });

      setStudentsGrouped(grouped);
      await fetchAttendanceData(data);
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      setAlertMessage("Error fetching students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceData = async (studentsList: any[]) => {
    try {
      setIsLoading(true);
      const attendanceMap: Record<string, Record<string, boolean>> = {};

      await Promise.all(
        classTimes.map(async (classTime) => {
          const attendanceTable = getAttendanceTable(classTime);
          if (!attendanceTable) {
            console.warn(`No attendance table mapped for class time: ${classTime}`);
            return;
          }

          const { data: attendanceDataFetched, error: attendanceError } = await supabase
            .from(attendanceTable)
            .select(`id, "${currentDay}"`)
            .in("id", studentsList.map((student) => student.id));

          if (attendanceError) {
            console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
            return;
          }

          attendanceDataFetched.forEach((record: any) => {
            if (!attendanceMap[record.id]) {
              attendanceMap[record.id] = {};
            }
            attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
          });
        })
      );

      setAttendanceData(attendanceMap);
    } catch (error: any) {
      console.error("Error fetching attendance data:", error.message);
      setAlertMessage("Error fetching attendance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceTable = (classTime: string) => {
    const mapping: Record<string, string> = {
      C1: "C1",
      C2: "C2",
      C3: "C3",
      C4: "C4",
      C5: "C5",
      C6: "C6",
    };

    return mapping[classTime] || null;
  };

  const handleCustomMessageSave = async () => {
    try {
      if (!tempCustMessage.trim()) {
        setAlertMessage("Custom message cannot be empty.");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated.");
      }

      const { error } = await supabase
        .from("profiles")
        .update({ custMessage: tempCustMessage })
        .eq("id", user.id);

      if (error) throw error;

      setCustMessage(tempCustMessage);
      setAlertMessage("Custom message saved successfully!");
    } catch (error: any) {
      console.error("Error saving custom message:", error.message);
      setAlertMessage("Error saving custom message. Please try again.");
    }
  };

  const generateWhatsAppLink = (number: string) => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;

    if (custMessage.trim()) {
      return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
    } else {
      return `https://wa.me/${sanitizedNumber}`;
    }
  };

  const handleEditClick = (studentId: number, type: string, currentValue: string) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
  };

  const handlePhoneBlur = async (studentId: number, type: string) => {
    try {
      const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
      let column = "";

      if (type === "studentNumber") {
        column = "studentNumber";
      } else if (type === "guardianNumber") {
        column = "guardianNumber";
      } else {
        throw new Error("Invalid phone type.");
      }

      const { error } = await supabase
        .from("student")
        .update({ [column]: updatedNumber || null })
        .eq("id", studentId);

      if (error) throw error;

      fetchStudents(userSchool);
      setAlertMessage("Phone number updated successfully!");
      setEditingPhone({ studentId: null, type: null });
      setPhoneValues({ studentNumber: "", guardianNumber: "" });
    } catch (error: any) {
      console.error("Error updating phone number:", error.message);
      setAlertMessage("Error updating phone number. Please try again.");
    }
  };

  const handlePhoneCancel = () => {
    setEditingPhone({ studentId: null, type: null });
    setPhoneValues({ studentNumber: "", guardianNumber: "" });
  };

  const handleLongPress = (studentId: number, type: string, currentValue: string) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };

  const handlePointerDown = (studentId: number, type: string, currentValue: string) => {
    const longPressTimeout = window.setTimeout(() => {
      handleLongPress(studentId, type, currentValue);
    }, 500);
    inputRef.current = longPressTimeout;
  };

  const handlePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  const styles: Record<string, CSSProperties> = {
    container: {
      width: "95%",
      maxWidth: "1400px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#000",
      boxShadow: "0 4px 20px 1px #007BA7",
      borderRadius: "10px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "10px",
      textAlign: "center",
      color: "#e0e0e0",
    },
    schoolName: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
      color: "#b0b0b0",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    filterContainer: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 1px #000",
      width: "48%",
      minWidth: "280px",
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
    dropdown: {
      backgroundColor: "#555",
      color: "#fff",
      padding: "15px",
      fontSize: "22px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    customMessageContainer: {
      backgroundColor: "#000",
      padding: "0 25px",
      marginRight: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "48%",
      minWidth: "280px",
      display: "flex",
      alignItems: "flex-start",
    },
    customMessageInnerContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    customMessageInput: {
      width: "100%",
      height: "160px",
      padding: "12px 15px",
      fontSize: "16px",
      color: "#000",
      border: "1px solid #2a2a2a",
      borderRadius: "8px",
      outline: "none",
      resize: "vertical",
      backgroundColor: "#f1f1f1",
    },
    saveButton: {
      marginTop: "10px",
      padding: "10px 0",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
    },
    tableContainer: {
      marginTop: "50px",
      overflowX: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      padding: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px",
    },
    th: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
    },
    tr: {
      borderBottom: "1px solid #dddddd",
    },
    td: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "12px",
      color: "#555",
      position: "relative",
    },
    groupHeaderRow: {
      backgroundColor: "#f1f1f1",
    },
    groupHeader: {
      fontSize: "18px",
      fontWeight: "600",
      textAlign: "left",
      padding: "10px",
      color: "#333",
    },
    phoneLink: {
      color: "#007bff",
      textDecoration: "underline",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
    },
    noDataMessage: {
      textAlign: "center",
      color: "#777",
      fontSize: "18px",
    },
    loadingText: {
      textAlign: "center",
      color: "#555",
      fontSize: "18px",
    },
    editInput: {
      width: "100%",
      padding: "5px 10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
    },
    checkboxLabel: {
      position: "relative",
      display: "inline-block",
      width: "20px",
      height: "20px",
      cursor: "default",
    },
    hiddenCheckbox: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    redCross: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "20px",
      width: "20px",
      backgroundColor: "#ffcccc",
      border: "1px solid #ff4d4d",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ff0000",
      fontSize: "14px",
    },
    emptyCheckbox: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "20px",
      width: "20px",
      backgroundColor: "#ffffff",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Dashboard</h1>
      <p style={styles.schoolName}>{userSchool}</p>

      <div style={styles.topSection}>
        <div style={styles.filterContainer}>
          <h2 style={styles.subHeader}>Filters</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Class:</label>
            <select
              style={styles.dropdown}
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
            >
              <option value="">All Classes</option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Section:</label>
            <select
              style={styles.dropdown}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClassName}
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.customMessageContainer}>
          <div style={styles.customMessageInnerContainer}>
            <textarea
              placeholder="Type your custom message here..."
              value={tempCustMessage}
              onChange={(e) => setTempCustMessage(e.target.value)}
              style={styles.customMessageInput}
            />
            <button
              onClick={handleCustomMessageSave}
              style={styles.saveButton}
              title="Save Message"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <div style={{ position: "absolute", right: "0" }}>
          <button
            style={{
              padding: "15px 30px",
              marginTop: "-30px",
              marginRight: "20px",
              fontSize: "16px",
              backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
              color: isFilterByAbsence ? "#fff" : "#000",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={() => setIsFilterByAbsence((prev) => !prev)}
          >
            Filter by Absence
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {isLoading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : Object.keys(studentsGrouped).length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student No</th>
                <th style={styles.th}>Guardian No</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Student Name</th>
                {classTimes.map((classTime) => (
                  <th key={classTime} style={styles.th}>
                    {classTime}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(studentsGrouped).map(([group, students]) => (
                <React.Fragment key={group}>
                  <tr style={styles.groupHeaderRow}>
                    <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
                      {group}
                    </td>
                  </tr>
                  {students
                    .filter((student) => !isFilterByAbsence || hasAbsence(student.id))
                    .map((student: any) => (
                      <tr key={student.id} style={styles.tr}>
                        <td style={styles.td}>
                          {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
                            <input
                              type="text"
                              name="studentNumber"
                              value={phoneValues.studentNumber}
                              onChange={handlePhoneChange}
                              onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
                              autoFocus
                              style={styles.editInput}
                            />
                          ) : student.studentNumber ? (
                            <a
                              href={generateWhatsAppLink(student.studentNumber) || undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.phoneLink}
                              onPointerDown={() =>
                                handlePointerDown(student.id, "studentNumber", student.studentNumber)
                              }
                              onPointerUp={handlePointerUpOrLeave}
                              onPointerLeave={handlePointerUpOrLeave}
                              title="Hold to edit"
                            >
                              {student.studentNumber}
                            </a>
                          ) : (
                            ""
                          )}
                        </td>

                        <td style={styles.td}>
                          {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
                            <input
                              type="text"
                              name="guardianNumber"
                              value={phoneValues.guardianNumber}
                              onChange={handlePhoneChange}
                              onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
                              autoFocus
                              style={styles.editInput}
                            />
                          ) : student.guardianNumber ? (
                            <a
                              href={generateWhatsAppLink(student.guardianNumber) || undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.phoneLink}
                              onPointerDown={() =>
                                handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
                              }
                              onPointerUp={handlePointerUpOrLeave}
                              onPointerLeave={handlePointerUpOrLeave}
                              title="Hold to edit"
                            >
                              {student.guardianNumber}
                            </a>
                          ) : (
                            ""
                          )}
                        </td>

                        <td style={styles.td}>{student.id}</td>
                        <td style={styles.td}>{student.studentName}</td>
                        {classTimes.map((classTime) => (
                          <td key={classTime} style={styles.td}>
                            {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
                              <label style={styles.checkboxLabel}>
                                <input
                                  type="checkbox"
                                  checked={true}
                                  disabled
                                  style={styles.hiddenCheckbox}
                                />
                                <span style={styles.redCross} title="Absent">
                                  ❌
                                </span>
                              </label>
                            ) : (
                              <label style={styles.checkboxLabel}>
                                <input
                                  type="checkbox"
                                  checked={false}
                                  disabled
                                  style={styles.hiddenCheckbox}
                                />
                                <span style={styles.emptyCheckbox} title="Present" />
                              </label>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noDataMessage}>No students found for the selected filters.</p>
        )}
      </div>

      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
    </div>
  );
}

export default DashBoard;


// import React, { useState, useEffect, useRef } from "react";
// import supabase from "../../supabase";
// import AlertModal from "./../AlertModal"; // Ensure you have this component
// import { useNavigate } from "react-router-dom";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState({});
//   const [attendanceData, setAttendanceData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

// const hasAbsence = (studentId) => {
//   const attendance = attendanceData[studentId];
//   if (!attendance) return false;
//   return classTimes.some((classTime) => !attendance[classTime]);
// };


//   // Define class times
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];

//   // Get today's date
//   const today = new Date();
//   const currentDay = today.getDate(); // 1 - 31

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       fetchStudents(userSchool);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedClassName]);

//   useEffect(() => {
//     fetchStudents(userSchool);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedSection]);

//   // Fetch user data: school and custMessage
//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("User not authenticated.");
//       }

//       // Fetch the user's school and custMessage from the profiles table
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("school, custMessage")
//         .eq("id", user.id)
//         .single();

//       if (profileError || !profileData) {
//         throw new Error("Failed to retrieve profile information.");
//       }

//       setUserSchool(profileData.school);
//       setCustMessage(profileData.custMessage || "");
//       setTempCustMessage(profileData.custMessage || "");

//       // Fetch class names for the school
//       fetchClassNames(profileData.school);

//       // Fetch all students initially
//       fetchStudents(profileData.school);
//     } catch (error) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch class names based on the school
//   const fetchClassNames = async (school) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);

//       if (error) throw error;

//       const uniqueClassNames = [...new Set(data.map((item) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch sections based on the selected class
//   const fetchSections = async (className) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("className", className)
//         .neq("section", null);

//       if (error) throw error;

//       const uniqueSections = [...new Set(data.map((item) => item.section))];
//       setSections(uniqueSections);
//     } catch (error) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch students based on selected filters
//   const fetchStudents = async (school) => {
//     try {
//       setIsLoading(true);
//       let query = supabase
//         .from("student")
//         .select("id, studentName, className, section, studentNumber, guardianNumber")
//         .eq("school", school)
//         .order("className", { ascending: true })
//         .order("section", { ascending: true })
//         .order("id", { ascending: true });

//       if (selectedClassName) {
//         query = query.eq("className", selectedClassName);
//       }

//       if (selectedSection) {
//         query = query.eq("section", selectedSection);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       // Group students by className and section
//       const grouped = {};
//       data.forEach((student) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });

//       setStudentsGrouped(grouped);

//       // Fetch attendance data
//       await fetchAttendanceData(data);
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch attendance data for all students
//   const fetchAttendanceData = async (studentsList) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap = {};

//       // Fetch attendance data for each class time
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }

//           // Fetch attendance for the current day from the respective attendance table
//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));

//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }

//           // Map attendance data
//           attendanceDataFetched.forEach((record) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );

//       setAttendanceData(attendanceMap);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Map classTime to attendance table. Adjust this mapping based on your actual table names.
//   const getAttendanceTable = (classTime) => {
//     const mapping = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };

//     return mapping[classTime] || null;
//   };

//   // Handle saving the custom message
//   const handleCustomMessageSave = async () => {
//     try {
//       if (!tempCustMessage.trim()) {
//         setAlertMessage("Custom message cannot be empty.");
//         return;
//       }

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("User not authenticated.");
//       }

//       const { data, error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);

//       if (error) throw error;

//       setCustMessage(tempCustMessage);
//       setAlertMessage("Custom message saved successfully!");
//     } catch (error) {
//       console.error("Error saving custom message:", error.message);
//       setAlertMessage("Error saving custom message. Please try again.");
//     }
//   };

//   // Generate WhatsApp link
//   const generateWhatsAppLink = (number) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   // Handle phone number edit initiation
//   const handleEditClick = (studentId, type, currentValue) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   // Handle phone number change
//   const handlePhoneChange = (e) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   // Handle phone number save on blur
//   const handlePhoneBlur = async (studentId, type) => {
//     try {
//       const updatedNumber = phoneValues[type].trim();
//       let column = "";

//       if (type === "studentNumber") {
//         column = "studentNumber";
//       } else if (type === "guardianNumber") {
//         column = "guardianNumber";
//       } else {
//         throw new Error("Invalid phone type.");
//       }

//       const { data, error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       // Update the local state
//       fetchStudents(userSchool);

//       setAlertMessage("Phone number updated successfully!");
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error) {
//       console.error("Error updating phone number:", error.message);
//       setAlertMessage("Error updating phone number. Please try again.");
//     }
//   };

//   // Handle phone number cancel (optional since save is on blur)
//   const handlePhoneCancel = () => {
//     setEditingPhone({ studentId: null, type: null });
//     setPhoneValues({ studentNumber: "", guardianNumber: "" });
//   };

//   const handleLongPress = (studentId, type, currentValue) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };
  
//   const handlePointerDown = (studentId, type, currentValue) => {
//     const longPressTimeout = setTimeout(() => {
//       handleLongPress(studentId, type, currentValue);
//     }, 500); // 500ms for long press
  
//     inputRef.current = longPressTimeout;
//   };
  
//   const handlePointerUpOrLeave = () => {
//     clearTimeout(inputRef.current);
//   };
  

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Dashboard</h1>
//       <p style={styles.schoolName}>{userSchool}</p>

//       {/* Top Section: Filters and Custom Message Side by Side */}
//       <div style={styles.topSection}>
//         {/* Filters Container */}
//         <div style={styles.filterContainer}>
//           <h2 style={styles.subHeader}>Filters</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Class:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedClassName}
//               onChange={(e) => setSelectedClassName(e.target.value)}
//             >
//               <option value="">All Classes</option>
//               {classNames.map((className) => (
//                 <option key={className} value={className}>
//                   {className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Section:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               disabled={!selectedClassName}
//             >
//               <option value="">All Sections</option>
//               {sections.map((section) => (
//                 <option key={section} value={section}>
//                   {section}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Custom Message Container */}
//         <div style={styles.customMessageContainer}>
//           <div style={styles.customMessageInnerContainer}>
//             <textarea
//               placeholder="Type your custom message here..."
//               value={tempCustMessage}
//               onChange={(e) => setTempCustMessage(e.target.value)}
//               style={styles.customMessageInput}
//             />
//             <button
//               onClick={handleCustomMessageSave}
//               style={styles.saveButton}
//               title="Save Message"
//             >
//               ✓
//             </button>
//           </div>
//         </div>
//       </div>
//       <div style={{ position: "relative", marginBottom: "20px" }}>
//   {/* Button Container */}
//   <div style={{ position: "absolute", right: "0" }}>
//     <button
//       style={{
//         padding: "15px 30px",
//         marginTop: '-30px',
//         marginRight: '20px',
//         fontSize: "16px",
//         backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//         color: isFilterByAbsence ? "#fff" : "#000",
//         border: "none",
//         borderRadius: "20px",
//         cursor: "pointer",
//       }}
//       onClick={() => setIsFilterByAbsence((prev) => !prev)}
//     >
//       Filter by Absence
//     </button>
//   </div>
// </div>


//       {/* Student Attendance Table */}
//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : Object.keys(studentsGrouped).length > 0 ? (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Student No</th>
//                 <th style={styles.th}>Guardian No</th>
//                 <th style={styles.th}>Student ID</th>
//                 <th style={styles.th}>Student Name</th>
//                 {classTimes.map((classTime) => (
//                   <th key={classTime} style={styles.th}>
//                     {classTime}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentsGrouped).map(([group, students]) => (
//                 <React.Fragment key={group}>
//                   {/* Group Header */}
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                     </td>
//                   </tr>
//                   {/* Students */}
//                   {students
//                   .filter((student) => !isFilterByAbsence || hasAbsence(student.id))
//                   .map((student) => (
//                     <tr key={student.id} style={styles.tr}>
//                       {/* Student Number */}
//                       <td style={styles.td}>
//   {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//     <input
//       type="text"
//       name="studentNumber"
//       value={phoneValues.studentNumber}
//       onChange={handlePhoneChange}
//       onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//       autoFocus
//       style={styles.editInput}
//     />
//   ) : student.studentNumber ? (
//     <a
//       href={generateWhatsAppLink(student.studentNumber)}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={styles.phoneLink}
//       onPointerDown={() =>
//         handlePointerDown(student.id, "studentNumber", student.studentNumber)
//       }
//       onPointerUp={handlePointerUpOrLeave}
//       onPointerLeave={handlePointerUpOrLeave}
//       title="Hold to edit"
//     >
//       {student.studentNumber}
//     </a>
//   ) : (
//     ""
//   )}
// </td>

// {/* Guardian Number */}
// <td style={styles.td}>
//   {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//     <input
//       type="text"
//       name="guardianNumber"
//       value={phoneValues.guardianNumber}
//       onChange={handlePhoneChange}
//       onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//       autoFocus
//       style={styles.editInput}
//     />
//   ) : student.guardianNumber ? (
//     <a
//       href={generateWhatsAppLink(student.guardianNumber)}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={styles.phoneLink}
//       onPointerDown={() =>
//         handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//       }
//       onPointerUp={handlePointerUpOrLeave}
//       onPointerLeave={handlePointerUpOrLeave}
//       title="Hold to edit"
//     >
//       {student.guardianNumber}
//     </a>
//   ) : (
//     ""
//   )}
// </td>

//                       {/* Student ID */}
//                       <td style={styles.td}>{student.id}</td>

//                       {/* Student Name */}
//                       <td style={styles.td}>{student.studentName}</td>

//                       {/* Attendance Columns */}
//                       {classTimes.map((classTime) => (
//                         <td key={classTime} style={styles.td}>
//                           {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={true}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.redCross} title="Absent">
//                                 ❌
//                               </span>
//                             </label>
//                           ) : (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={false}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.emptyCheckbox} title="Present">
//                                 {/* Empty checkbox */}
//                               </span>
//                             </label>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p style={styles.noDataMessage}>
//             No students found for the selected filters.
//           </p>
//         )}
//       </div>

//       {/* Alert Modal */}
//       {alertMessage && (
//         <AlertModal
//           message={alertMessage}
//           onClose={() => setAlertMessage("")}
//         />
//       )}
//     </div>
//   );
// }

// /* Inline Styles */

// const styles = {
//   container: {
//     width: "95%",
//     maxWidth: "1400px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#000",
//     boxShadow: "0 4px 20px 1px #007BA7",
  
//     borderRadius: "10px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   header: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "10px",
//     textAlign: "center",
//     color: "#e0e0e0",
//   },
//   schoolName: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     textAlign: "center",
//     color: "#b0b0b0",
//   },
//   topSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "30px",
//     flexWrap: "wrap",
//   },
//   filterContainer: {
//     backgroundColor: "#2a2a2a",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "48%",
//     minWidth: "280px",
//     boxShadow: "0 2px 12px 1px #000",
//   },
//   subHeader: {
//     fontSize: "22px",
//     fontWeight: "600",
//     marginBottom: "15px",
//     color: "#fff",
//     textAlign: "center",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     display: "flex",
//     flexDirection: "column",
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//     color: "#fff",
//   },
//   dropdown: {
//     backgroundColor: "#555",
//     color: "#fff",
//     padding: "15px",
//     fontSize: "22px",
//     border: "1px solid #555",
//     borderRadius: "5px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   customMessageContainer: {
//     backgroundColor: "#000",
//     paddingHorizontal: "25px",
//     marginRight: "15px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "48%",
//     minWidth: "280px",
//     display: "flex",
//     alignItems: "flex-start",
//   },
//   customMessageInnerContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",

//   },
//   customMessageInput: {
//     width: "100%",
//     height: "160px", // Increased height
//     padding: "12px 15px",
//     fontSize: "16px",
//     color: "#000",
//     border: "1px solid #2a2a2a",
//     borderRadius: "8px",
//     outline: "none",
//     resize: "vertical",
//     backgroundColor: "#f1f1f1",
//   },
//   saveButton: {
//     marginTop: "10px",
//     padding: "10px 0",
//     fontSize: "18px",
//     color: "#ffffff",
//     backgroundColor: "#007bff",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//     width: "100%", // Same width as input
//   },
//   tableContainer: {
//     marginTop: '50px',
//     overflowX: "auto",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#f9f9f9",
//     padding: "20px",
//   },
//   table: {
    
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "1000px",
//   },
//   th: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "white",
//   },
//   tr: {
//     borderBottom: "1px solid #dddddd",
//   },
//   td: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     color: "#555",
//     position: "relative",
//   },
//   groupHeaderRow: {
//     backgroundColor: "#f1f1f1",
//   },
//   groupHeader: {
//     fontSize: "18px",
//     fontWeight: "600",
//     textAlign: "left",
//     padding: "10px",
//     color: "#333",
//   },
//   phoneLink: {
//     color: "#007bff",
//     textDecoration: "underline",
//     cursor: "pointer",
//     backgroundColor: "#f9f9f9"
//   },
//   absentIcon: {
//     color: "#ff4d4d",
//     fontSize: "18px",
//   },
//   presentIcon: {
//     color: "#28a745",
//     fontSize: "18px",
//   },
//   noDataMessage: {
//     textAlign: "center",
//     color: "#777",
//     fontSize: "18px",
//   },
//   loadingText: {
//     textAlign: "center",
//     color: "#555",
//     fontSize: "18px",
//   },
//   editInput: {
//     width: "100%",
//     padding: "5px 10px",
//     fontSize: "14px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     outline: "none",
//   },
//   checkboxLabel: {
//     position: "relative",
//     display: "inline-block",
//     width: "20px",
//     height: "20px",
//     cursor: "default", // Prevent cursor change since it's disabled
//   },
//   hiddenCheckbox: {
//     opacity: 0,
//     width: 0,
//     height: 0,
//   },
//   redCross: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffcccc",
//     border: "1px solid #ff4d4d",
//     borderRadius: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#ff0000",
//     fontSize: "14px",
//   },
//   emptyCheckbox: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffffff",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     // Optional: add hover effects or other styles
//   },
// };

// export default DashBoard;
