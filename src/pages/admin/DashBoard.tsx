

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
  const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
  const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
  const inputRef = useRef<number | null>(null);
  const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);
  // For WhatsApp autofill from hovered row.
  const [currentStudentForTooltip, setCurrentStudentForTooltip] = useState("");

  // ***** NEW: Filter for Paid (IQD) *****
  const [filterPaidLE, setFilterPaidLE] = useState("");
  const [filterPaidGE, setFilterPaidGE] = useState("");

  // ***** NEW: Filter for Request (✅) via the 📞 button *****
  const [filterRequest, setFilterRequest] = useState(false);

  // Attendance table names available for export
  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
  const today = new Date();
  const currentDay = today.getDate();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayDate, setDisplayDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
  );

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // For Search
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);

  // For Editing Student Name
  const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
  const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTable, setExportTable] = useState<string>(classTimes[0]);

  // ***** NEW: Tooltip (Schedule Info) State *****
  const [tooltipData, setTooltipData] = useState<{
    classTime: string;
    className: string;
    section: string;
    teacherName: string;
    classRoom: string;
    teacherTel?: string;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userSchool) {
      fetchStudents(userSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassName, selectedSection, userSchool, filterPaidLE, filterPaidGE]);

  // Re-fetch students every 2 minutes if filter by absence is ON
  useEffect(() => {
    let intervalId: number | undefined;
    if (isFilterByAbsence) {
      intervalId = window.setInterval(() => {
        fetchStudents(userSchool);
      }, 120000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFilterByAbsence, userSchool]);

  // ***** NEW: Update Payment Columns on Dashboard load *****
  const updatePaymentInfo = async (students: any[]) => {
    await Promise.all(
      students.map(async (student) => {
        const pValues = [student.P1, student.P2, student.P3, student.P4, student.P5, student.P6]
          .map(val => Number(val) || 0);
        const computedTotal = pValues.reduce((a, b) => a + b, 0);
        if (String(computedTotal) !== student.totalAmount) {
          await supabase
            .from("student")
            .update({ totalAmount: String(computedTotal) })
            .eq("id", student.id);
          student.totalAmount = String(computedTotal);
        }
        const pqValues = [student.PQ1, student.PQ2, student.PQ3]
          .map(val => Number(val) || 0);
        const computedDiscount = pqValues.reduce((a, b) => a + b, 0);
        if (String(computedDiscount) !== student.totalDiscount) {
          await supabase
            .from("student")
            .update({ totalDiscount: String(computedDiscount) })
            .eq("id", student.id);
          student.totalDiscount = String(computedDiscount);
        }
      })
    );
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
      fetchSections(profileData.school);
      fetchStudents(profileData.school);
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      setAlertMessage("Error fetching user information. Please try again.");
      navigate("/sign-up");
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

  const fetchSections = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("school", school)
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

  // Modified to select payment columns and update totals before grouping.
  const fetchStudents = async (school: string) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("student")
        .select(
          `id, studentName, className, section, studentNumber, guardianNumber,
           P1, P2, P3, P4, P5, P6, totalAmount,
           PQ1, PQ2, PQ3, totalDiscount, request`
        )
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
      await updatePaymentInfo(data);
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
      if (searchTerm) {
        const matchSuggestions = data.filter((student: any) => {
          const name = student.studentName.toLowerCase();
          const id = student.id.toString();
          const term = searchTerm.toLowerCase();
          return name.includes(term) || id.includes(term);
        });
        setSuggestions(matchSuggestions);
      } else {
        setSuggestions([]);
      }
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

  const fetchAttendanceDataForDay = async (day: number) => {
    try {
      setIsLoading(true);
      const attendanceMap: Record<string, Record<string, boolean>> = {};
      let studentsList: any[] = [];
      Object.values(studentsGrouped).forEach((list) => {
        studentsList = studentsList.concat(list);
      });
      await Promise.all(
        classTimes.map(async (classTime) => {
          const attendanceTable = getAttendanceTable(classTime);
          if (!attendanceTable) {
            console.warn(`No attendance table mapped for class time: ${classTime}`);
            return;
          }
          const { data, error } = await supabase
            .from(attendanceTable)
            .select(`id, "${day}"`)
            .in("id", studentsList.map((student) => student.id));
          if (error) {
            console.error(`Error fetching attendance from ${attendanceTable}:`, error.message);
            return;
          }
          data.forEach((record: any) => {
            if (!attendanceMap[record.id]) {
              attendanceMap[record.id] = {};
            }
            attendanceMap[record.id][classTime] = record[`${day}`] === true;
          });
        })
      );
      setAttendanceData(attendanceMap);
    } catch (err: any) {
      console.error("Error fetching attendance data for day:", err.message);
      setAlertMessage("Error fetching attendance data for the selected day.");
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

  const generateWhatsAppLink = (number: string, extraMessage: string = "") => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;
    const message = custMessage.trim() || "";
    const fullMsg = encodeURIComponent(`${message} ${extraMessage}`.trim());
    return `https://wa.me/${sanitizedNumber}?text=${fullMsg}`;
  };

  // ***** NEW: When teacher name is clicked in tooltip, fetch teacher telNumber and update tooltip with it.
  const handleTeacherNameClick = async () => {
    if (!tooltipData) return;
    try {
      const { data, error } = await supabase
        .from("teacher")
        .select("telNumber")
        .match({ teacherName: tooltipData.teacherName, school: userSchool })
        .single();
      const tel = data ? data.telNumber : null;
      setTooltipData({ ...tooltipData, teacherTel: tel });
    } catch (err: any) {
      console.error("Error fetching teacher info:", err.message);
      setAlertMessage("Error fetching teacher info. Please try again.");
    }
  };

  // ***** NEW: When teacher telephone (in tooltip) is clicked, open WhatsApp Web.
  const handleTeacherTelClick = () => {
    if (tooltipData && tooltipData.teacherTel) {
      const link = generateWhatsAppLink(tooltipData.teacherTel, currentStudentForTooltip);
      if (link) window.open(link, "_blank");
    } else {
      setAlertMessage("Teacher contact not found.");
    }
  };

  const handlePointerDown = (studentId: number, type: string, currentValue: string | null) => {
    const longPressTimeout = window.setTimeout(() => {
      setEditingPhone({ studentId, type });
      setPhoneValues({ ...phoneValues, [type]: currentValue || "" });
    }, 500);
    inputRef.current = longPressTimeout;
  };

  const handlePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
  };

  const handlePhoneBlur = async (studentId: number, type: string) => {
    try {
      const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
      const { error } = await supabase
        .from("student")
        .update({ [type]: updatedNumber || null })
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

  const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
    const timeoutId = window.setTimeout(() => {
      setEditingStudentNameId(studentId);
      setEditingStudentNameValue(currentValue);
    }, 500);
    inputRef.current = timeoutId;
  };

  const handleStudentNamePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  const handleStudentNameBlur = async (studentId: number) => {
    try {
      const updatedName = editingStudentNameValue.trim();
      if (!updatedName) {
        setEditingStudentNameId(null);
        return;
      }
      // Update the student table
      const { error } = await supabase
        .from("student")
        .update({ studentName: updatedName })
        .eq("id", studentId);
      if (error) throw error;
  
      // Also update the same field in attendance tables C1 to C6
      const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
      for (const tableName of classTimes) {
        const { error: attError } = await supabase
          .from(tableName)
          .update({ studentName: updatedName }) // assuming the attendance table has a studentName column
          .eq("id", studentId);
        if (attError) {
          console.error(`Error updating ${tableName} for student ${studentId}:`, attError.message);
        }
      }
  
      setEditingStudentNameId(null);
      fetchStudents(userSchool);
      setAlertMessage("Student name updated successfully!");
    } catch (error: any) {
      console.error("Error updating student name:", error.message);
      setAlertMessage("Error updating student name. Please try again.");
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setSuggestions([]);
      setFilteredStudentId(null);
    } else {
      fetchStudents(userSchool);
    }
  };

  const handleSuggestionClick = (student: any) => {
    setSearchTerm(student.studentName);
    setFilteredStudentId(student.id);
    setSuggestions([]);
  };

  // ***** NEW: Format number with commas *****
  const formatNumber = (value: string) => {
    const num = Number(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };

  // ***** NEW: Toggle Request filter when phone emoji is pressed *****
  const toggleRequestFilter = () => {
    setFilterRequest(prev => !prev);
  };

  const filteredStudents = () => {
    let allStudents: any[] = [];
    Object.values(studentsGrouped).forEach((list) => {
      allStudents = allStudents.concat(list);
    });
    // Apply Paid (IQD) filters if set.
    if (filterPaidLE) {
      const le = Number(filterPaidLE.replace(/,/g, ""));
      allStudents = allStudents.filter(student => Number(student.totalAmount) <= le);
    }
    if (filterPaidGE) {
      const ge = Number(filterPaidGE.replace(/,/g, ""));
      allStudents = allStudents.filter(student => Number(student.totalAmount) >= ge);
    }
    if (isFilterByAbsence) {
      allStudents = allStudents.filter((student) => hasAbsence(student.id));
    }
    // ***** NEW: If Request filter is ON, only show students with request === true *****
    if (filterRequest) {
      allStudents = allStudents.filter((student) => student.request === true);
    }
    if (filteredStudentId !== null) {
      allStudents = allStudents.filter((student) => student.id === filteredStudentId);
    }
    return allStudents;
  };

  const groupedFilteredStudents = () => {
    const grouped: Record<string, any[]> = {};
    filteredStudents().forEach((student) => {
      const key = `${student.className} - Section ${student.section}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(student);
    });
    return grouped;
  };

  const hasAbsence = (studentId: string): boolean => {
    const attendance = attendanceData[studentId];
    if (!attendance) return false;
    return classTimes.some((classTime) => attendance[classTime]);
  };

  // ***** NEW: Checkbox onClick to trigger tooltip for 5 seconds for attendance cells *****
  const handleCheckboxClick = async (e: React.MouseEvent, classTime: string, group?: string) => {
    // Toggle tooltip: if the same checkbox is clicked, remove the tooltip.
    const newX = e.currentTarget.getBoundingClientRect().left;
    if (tooltipData && tooltipData.classTime === classTime && tooltipPos.x === newX) {
      setTooltipData(null);
      return;
    }
    setTooltipPos({ x: newX, y: e.currentTarget.getBoundingClientRect().bottom + 5 });
    let classNameToUse = selectedClassName;
    let sectionToUse = selectedSection;
    if (!selectedClassName || !selectedSection) {
      if (group) {
        const parts = group.split(" - Section ");
        if (parts.length === 2) {
          classNameToUse = parts[0];
          sectionToUse = parts[1];
        }
      }
    }
    const dayOfWeek = getDayOfWeek(displayDate);
    try {
      let query = supabase
        .from("schedule")
        .select("*")
        .eq("day", dayOfWeek)
        .eq("classTable", classTime)
        .eq("school", userSchool);
      if (classNameToUse) query = query.eq("className", classNameToUse);
      if (sectionToUse) query = query.eq("section", sectionToUse);
      const { data, error } = await query.single();
      if (error) {
        console.error("Error fetching schedule info:", error);
        setTooltipData(null);
        return;
      }
      if (data) {
        setTooltipData({
          classTime: classTime,
          className: data.className,
          section: data.section,
          teacherName: data.teacherName,
          classRoom: data.classRoom,
        });
        // Tooltip remains for 5 seconds.
        setTimeout(() => setTooltipData(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setTooltipData(null);
    }
  };

  // ***** NEW: Handler for Request column checkbox click (toggles student.request)
  // Now updates local state instead of reloading the whole page.
  const handleRequestCheckboxChange = async (student: any, groupKey: string) => {
    try {
      const newValue = !student.request;
      await supabase.from("student").update({ request: newValue }).eq("id", student.id);
      setStudentsGrouped((prev) => {
        const newGrouped = { ...prev };
        if (newGrouped[groupKey]) {
          newGrouped[groupKey] = newGrouped[groupKey].map((s: any) =>
            s.id === student.id ? { ...s, request: newValue } : s
          );
        }
        return newGrouped;
      });
    } catch (error: any) {
      console.error("Error updating request:", error.message);
      setAlertMessage("Error updating request. Please try again.");
    }
  };

  // ***** NEW: Handler for clicking the header for Request column.
  const handleRequestHeaderClick = async () => {
    if (window.confirm("Are you sure you want to unselect all checkboxes?")) {
      try {
        const allStudents = Object.values(studentsGrouped).flat();
        await Promise.all(
          allStudents.map((student: any) => {
            if (student.request !== false) {
              return supabase.from("student").update({ request: false }).eq("id", student.id);
            }
            return Promise.resolve();
          })
        );
        // Update local state: set all students' request to false
        setStudentsGrouped((prev) => {
          const newGrouped = { ...prev };
          Object.keys(newGrouped).forEach((groupKey) => {
            newGrouped[groupKey] = newGrouped[groupKey].map((s: any) => ({ ...s, request: false }));
          });
          return newGrouped;
        });
      } catch (error: any) {
        console.error("Error unselecting all requests:", error.message);
        setAlertMessage("Error unselecting requests. Please try again.");
      }
    }
  };

  // ***** NEW: Convert display date to day of week *****
  const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[date.getDay()];
  };

  const handleExportToExcel = async () => {
    setShowExportModal(false);
    try {
      const dayColumns = Array.from({ length: 31 }, (_, i) => `"${i + 1}"`).join(",");
      const { data: attendanceRecords, error } = await supabase
        .from(exportTable)
        .select(`id, ${dayColumns}, school`)
        .eq("school", userSchool);
      if (error) throw error;
      if (!attendanceRecords) {
        setAlertMessage("No attendance records found.");
        return;
      }
      let studentsList: any[] = [];
      Object.values(studentsGrouped).forEach((group) => {
        studentsList = studentsList.concat(group);
      });
      const studentMap = new Map();
      studentsList.forEach((student) => {
        studentMap.set(student.id, student);
      });
      let csvContent = "";
      let header = `,Student Name,Student ID,ClassName,Section`;
      for (let i = 1; i <= 31; i++) {
        header += `,${i}`;
      }
      csvContent += header + "\n";
      (attendanceRecords as any[]).forEach((record) => {
        const student = studentMap.get(record.id);
        if (!student) return;
        const rowValues: string[] = [
          "",
          student.studentName,
          "\t" + student.id,
          student.className,
          student.section,
        ];
        for (let i = 1; i <= 31; i++) {
          const dayVal = record[i.toString()] === true ? "☑" : "☐";
          rowValues.push(dayVal);
        }
        const escapedRow = rowValues.map((val) => `"${val.replace(/"/g, '""')}"`);
        csvContent += escapedRow.join(",") + "\n";
      });
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${exportTable}_Attendance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Error exporting attendance data:", err.message);
      setAlertMessage("Error exporting attendance data. Please try again.");
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
      marginBottom: "5px",
      textAlign: "center",
      color: "#e0e0e0",
    },
    schoolName: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "25px",
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
      padding: "13px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 1px #000",
      width: "48%",
      minWidth: "280px",
    },
    subHeader: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "0px",
      color: "#fff",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "3px",
      marginTop: "13px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "4px",
      marginTop: "4px",
      fontWeight: "500",
      color: "#fff",
    },
    dropdown: {
      backgroundColor: "#555",
      color: "#fff",
      padding: "20px",
      fontSize: "22px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
      marginTop: "-4px",
    },
    inputField: {
      backgroundColor: "#555",
      marginTop: "-1px",
      color: "#fff",
      padding: "12px",
      width: "100%",
      fontSize: "18px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    customMessageContainer: {
      backgroundColor: "#000",
      padding: "0 25px",
      marginRight: "-15px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "53%",
      minWidth: "280px",
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "column",
    },
    customMessageInnerContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    customMessageInput: {
      width: "100%",
      height: "200px",
      padding: "12px 15px",
      fontSize: "16px",
      color: "#000",
      border: "1px solid #2a2a2a",
      borderRadius: "8px",
      outline: "none",
      resize: "vertical",
    },
    saveButton: {
      marginTop: "10px",
      padding: "10px",
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
    },
    exportAllButton: {
      backgroundColor: "#3ecf8e",
      color: "#000",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "8px 16px",
      cursor: "pointer",
      marginBottom: "10px",
      marginTop: "10px",
      marginLeft: '360px'
    },
    // New container for table control buttons (filter by absence and phone filter)
    tableControlContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "140px",
      marginBottom: "-36px",
      marginLeft: "280px",
      
    },
    tableContainer: {
      marginTop: "10px",
      overflowX: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      padding: "12px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px",
    },
    th: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "10px 2px",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "18px",
      cursor: "default",
    },
    tr: {
      borderBottom: "1px solid #dddddd",
      fontSize: "18px",
      textAlign: "right",
    },
    tr2: {
      borderBottom: "1px solid #dddddd",
      fontSize: "18px",
      textAlign: "center",
    },
    td: {
      border: "1px solid #dddddd",
      textAlign: "right",
      padding: "4px 9px",
      color: "#555",
      position: "relative",
      fontSize: "22px",
    },
    td2: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "4px 9px",
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
      fontSize: "22px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
      textAlign: "right",
    },
    checkboxLabel: {
      position: "relative",
      display: "inline-block",
      width: "20px",
      height: "20px",
      cursor: "pointer",
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
    suggestionContainer: {
      position: "relative",
    },
    suggestionsList: {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      backgroundColor: "#222",
      border: "1px solid #ccc",
      borderRadius: "5px",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
    },
    suggestionItem: {
      padding: "10px",
      cursor: "pointer",
      borderBottom: "1px solid #ddd",
      color: "#007bff",
      backgroundColor: "#e0e1e0",
      transition: "background-color 0.3s",
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
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    iconButton2: {
      width: "60px",
      height: "60px",
      margin: "12px 0",
      fontSize: "34px",
      padding: "20px",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#dbe346",
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
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      backgroundColor: "#e8e8e8",
    },
    pageContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
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
      flex: 1,
      maxWidth: "1400px",
      backgroundColor: "#000",
      padding: "10px 0px",
      borderRadius: "10px",
      boxShadow: "0 10px 10px rgba(0, 0, 0, 0.6)",
      textAlign: "center",
      marginLeft: "20px",
    },
    // ***** NEW: Tooltip styling *****
    tooltip: {
      position: "fixed",
      backgroundColor: "#333",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      zIndex: 10000,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
      fontSize: "14px",
      pointerEvents: "none",
      maxWidth: "300px",
    },
    tooltipRow: {
      marginBottom: "5px",
    },
    tooltipClassTable: {
      color: "#fff",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    tooltipClassNameSection: {
      display: "flex",
      flexDirection: "row",
      gap: "5px",
      marginBottom: "5px",
    },
    tooltipClassName: {
      color: "lightblue",
    },
    tooltipSection: {
      color: "lightblue",
    },
    tooltipTeacherName: {
      color: "red",
      marginBottom: "5px",
      textDecoration: "underline",
      cursor: "pointer"
    },
    // ***** NEW: Style for teacher telephone in tooltip *****
    tooltipTeacherTel: {
      color: "blue",
      textDecoration: "underline",
      cursor: "pointer"
    },
    tooltipClassRoom: {
      color: "orange",
    },
    // ***** NEW: Style for checkbox column and large checkboxes *****
    // Fixed width (70px) and centered content.
    checkboxColumn: {
      width: "70px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    largeCheckbox: {
      transform: "scale(1.5)",
      marginLeft: "420px",
      marginBottom: '10px',
      marginTop: '10px'

    },
  };

  const groupedStudentsToShow = groupedFilteredStudents();

  return (
    <div style={styles.container}>
      <div style={styles.floatingContainer}>
        <button
          style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
          onClick={() => navigate("/dashboard3")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          +
        </button>
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
          onClick={() => navigate("/dash5")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ⏰
        </button>
      </div>
      <div style={styles.card}>
        <h1 style={styles.header}>Student Attendance</h1>
        <p style={styles.schoolName}>{userSchool}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          
        </div>
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
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Search by Name:</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={styles.inputField}
                  placeholder="Student Name or Student ID..."
                />
                {suggestions.length > 0 && (
                  <div style={styles.suggestionsList}>
                    {suggestions.map((student: any) => (
                      <div
                        key={student.id}
                        style={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(student)}
                      >
                        {`${student.studentName} (ID: ${student.id})`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ***** NEW: Paid (IQD) Filters ***** */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Paid (IQD) ≤ :</label>
              <input
                type="text"
                value={filterPaidLE}
                onChange={(e) => setFilterPaidLE(e.target.value)}
                onBlur={(e) => setFilterPaidLE(formatNumber(e.target.value))}
                style={styles.inputField}
                placeholder="Enter maximum Paid (IQD)"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Paid (IQD) ≥ :</label>
              <input
                type="text"
                value={filterPaidGE}
                onChange={(e) => setFilterPaidGE(e.target.value)}
                onBlur={(e) => setFilterPaidGE(formatNumber(e.target.value))}
                style={styles.inputField}
                placeholder="Enter minimum Paid (IQD)"
              />
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
              <button onClick={handleCustomMessageSave} style={styles.saveButton} title="Save Message">
                ✓
              </button>
              <button style={styles.exportAllButton} onClick={() => setShowExportModal(true)}>
            Export to Excel
          </button>
        </div>
        {/* ***** NEW: Table Control Buttons directly above table header ***** */}
        <div style={styles.tableControlContainer}>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
              color: isFilterByAbsence ? "#fff" : "#000",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginRight: "10px",
              marginTop: "19px",
              marginLeft: "59px",
              width: '250px'
            }}
            onClick={() => setIsFilterByAbsence((prev) => !prev)}
          >
            Filter by Absence
          </button>
          <button
            style={{
              ...styles.iconButton,
              backgroundColor: filterRequest ? "green" : "grey",
            }}
            onClick={toggleRequestFilter}
            title="Toggle Request Filter"
          >
            📞
          </button>
            </div>
            
          </div>
        </div>
        {/* ***** Table Container with Header and Rows ***** */}
        <div style={styles.tableContainer}>
          {isLoading ? (
            <p style={styles.loadingText}>Loading...</p>
          ) : Object.keys(groupedStudentsToShow).length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student No</th>
                  <th style={styles.th}>Guardian No</th>
                  <th style={styles.th}>Paid (IQD)</th>
                  <th style={styles.th}>Discount (IQD)</th>
                  <th style={styles.th}>Student Name</th>
                  {classTimes.map((classTime) => (
                    <th
                      key={classTime}
                      style={styles.th}
                      onClick={(e) => handleCheckboxClick(e, classTime, "")}
                    >
                      {classTime}
                    </th>
                  ))}
                  {/* Request Checkbox Column Header placed at the end */}
                  <th style={styles.th} onClick={handleRequestHeaderClick} title="Click to unselect all">
                    ✅
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedStudentsToShow).map(([group, students]) => (
                  <React.Fragment key={group}>
                    <tr style={styles.groupHeaderRow}>
                      <td colSpan={5 + classTimes.length + 1} style={styles.groupHeader}>
                        {group}
                      </td>
                    </tr>
                    {!collapsedGroups[group] &&
                      students.map((student: any) => (
                        <tr key={student.id} style={styles.tr} onMouseEnter={() => setCurrentStudentForTooltip(student.studentName)}>
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
                            ) : (
                              <a
                                href={student.studentNumber ? generateWhatsAppLink(student.studentNumber) || undefined : undefined}
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
                                {student.studentNumber || "—"}
                              </a>
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
                            ) : (
                              <a
                                href={student.guardianNumber ? generateWhatsAppLink(student.guardianNumber) || undefined : undefined}
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
                                {student.guardianNumber || "—"}
                              </a>
                            )}
                          </td>
                          <td style={styles.td}>{Number(student.totalAmount).toLocaleString("en-US")}</td>
                          <td style={styles.td}>{Number(student.totalDiscount).toLocaleString("en-US")}</td>
                          <td style={styles.td}>
                            {editingStudentNameId === student.id ? (
                              <input
                                type="text"
                                value={editingStudentNameValue}
                                onChange={(e) => setEditingStudentNameValue(e.target.value)}
                                onBlur={() => handleStudentNameBlur(student.id)}
                                autoFocus
                                style={styles.editInput}
                              />
                            ) : (
                              <span
                                onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
                                onPointerUp={handleStudentNamePointerUpOrLeave}
                                onPointerLeave={handleStudentNamePointerUpOrLeave}
                                title="Hold to edit"
                                style={{ cursor: "pointer" }}
                              >
                                {student.studentName}
                              </span>
                            )}
                          </td>
                          {classTimes.map((classTime) => (
                            <td
                              key={classTime}
                              style={styles.td}
                              onClick={(e) => handleCheckboxClick(e, classTime, group)}
                            >
                              {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
                                <label style={styles.checkboxLabel}>
                                  <input type="checkbox" checked={true} disabled style={styles.hiddenCheckbox} />
                                  <span style={styles.redCross} title="Absent">
                                    ❌
                                  </span>
                                </label>
                              ) : (
                                <label style={styles.checkboxLabel}>
                                  <input type="checkbox" checked={false} disabled style={styles.hiddenCheckbox} />
                                  <span style={styles.emptyCheckbox} title="Present" />
                                </label>
                              )}
                            </td>
                          ))}
                          {/* Request Checkbox Column Cell placed at the end */}
                          <td style={{ ...styles.td, ...styles.checkboxColumn }}>
                            <input
                              type="checkbox"
                              checked={student.request === true}
                              onChange={() => handleRequestCheckboxChange(student, group)}
                              style={styles.largeCheckbox}
                              title="Toggle Request"
                            />
                          </td>
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
      {showExportModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "450px",
              width: "90%",
              color: "#fff",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowExportModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#555",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              X
            </button>
            <h3 style={{ marginBottom: "20px" }}>Export Attendance</h3>
            <p style={{ marginBottom: "10px" }}>Select which attendance table to export (C1–C6):</p>
            <select
              value={exportTable}
              onChange={(e) => setExportTable(e.target.value)}
              style={{
                backgroundColor: "#555",
                color: "#fff",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #555",
                borderRadius: "5px",
                outline: "none",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              {classTimes.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportToExcel}
              style={{
                backgroundColor: "#3ecf8e",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                padding: "10px 20px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Export
            </button>
          </div>
        </div>
      )}
      {/* ***** NEW: Tooltip for Schedule Info on Click (instead of hover) ***** */}
      {tooltipData && (
        <div
          style={{
            ...styles.tooltip,
            top: tooltipPos.y,
            left: tooltipPos.x,
          }}
        >
          <div style={styles.tooltipRow}>
            <span style={styles.tooltipClassTable}>{tooltipData.classTime}</span>
          </div>
          <div style={{ ...styles.tooltipRow, ...styles.tooltipClassNameSection }}>
            <span style={styles.tooltipClassName}>{tooltipData.className}</span>
            <span style={styles.tooltipSection}>- {tooltipData.section}</span>
          </div>
          <div style={styles.tooltipRow}>
            <span style={styles.tooltipTeacherName} onClick={handleTeacherNameClick}>
              {tooltipData.teacherName}
            </span>
          </div>
          {tooltipData.teacherTel !== undefined && (
            <div style={styles.tooltipRow}>
              <span style={styles.tooltipTeacherTel} onClick={handleTeacherTelClick}>
                {tooltipData.teacherTel ? tooltipData.teacherTel : "N/A"}
              </span>
            </div>
          )}
          <div style={styles.tooltipRow}>
            <span style={styles.tooltipClassRoom}>{tooltipData.classRoom}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;

// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import supabase from "../../supabase";
// import AlertModal from "./../AlertModal";
// import { useNavigate } from "react-router-dom";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
//   const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef<number | null>(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

//   // Attendance table names available for export
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
//   const today = new Date();
//   const currentDay = today.getDate();
//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [showCalendar, setShowCalendar] = useState(false); // Show/hide calendar
//   const [displayDate, setDisplayDate] = useState(
//     `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
//   );

//   const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

//   // For Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);

//   // For Editing Student Name
//   const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
//   const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

//   // ***** NEW: Export Modal State *****
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportTable, setExportTable] = useState<string>(classTimes[0]);

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     // Fetch students whenever selectedClassName or selectedSection changes
//     if (userSchool) {
//       fetchStudents(userSchool);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedClassName, selectedSection, userSchool]);

//   // Re-fetch students every 2 minutes if filter by absence is ON
//   useEffect(() => {
//     let intervalId: number | undefined;
//     if (isFilterByAbsence) {
//       intervalId = window.setInterval(() => {
//         fetchStudents(userSchool);
//       }, 120000); // 2 minutes
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isFilterByAbsence, userSchool]);

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

//       fetchClassNames(profileData.school);
//       fetchSections(profileData.school); // Fetch all sections irrespective of class
//       fetchStudents(profileData.school);
//     } catch (error: any) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/sign-up");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchClassNames = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);

//       if (error) throw error;

//       const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error: any) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Modified fetchSections to fetch all unique sections irrespective of class
//   const fetchSections = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("school", school)
//         .neq("section", null);

//       if (error) throw error;

//       const uniqueSections = [...new Set(data.map((item: any) => item.section))];
//       setSections(uniqueSections);
//     } catch (error: any) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStudents = async (school: string) => {
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

//       const grouped: Record<string, any[]> = {};
//       data.forEach((student: any) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });

//       setStudentsGrouped(grouped);
//       await fetchAttendanceData(data);

//       // Handle Search Suggestions
//       if (searchTerm) {
//         const matchSuggestions = data.filter((student: any) => {
//           const name = student.studentName.toLowerCase();
//           const id = student.id.toString();
//           const term = searchTerm.toLowerCase();
//           return name.includes(term) || id.includes(term);
//         });
//         setSuggestions(matchSuggestions);
//       } else {
//         setSuggestions([]);
//       }
//     } catch (error: any) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAttendanceData = async (studentsList: any[]) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};

//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }

//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));

//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }

//           attendanceDataFetched.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );

//       setAttendanceData(attendanceMap);
//     } catch (error: any) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ***** NEW: Define fetchAttendanceDataForDay *****
//   const fetchAttendanceDataForDay = async (day: number) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};
//       // Flatten students from all groups
//       let studentsList: any[] = [];
//       Object.values(studentsGrouped).forEach((list) => {
//         studentsList = studentsList.concat(list);
//       });
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }
//           const { data, error } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${day}"`)
//             .in("id", studentsList.map((student) => student.id));
//           if (error) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, error.message);
//             return;
//           }
//           data.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${day}`] === true;
//           });
//         })
//       );
//       setAttendanceData(attendanceMap);
//     } catch (err: any) {
//       console.error("Error fetching attendance data for day:", err.message);
//       setAlertMessage("Error fetching attendance data for the selected day.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // ***** END NEW: fetchAttendanceDataForDay *****

//   const getAttendanceTable = (classTime: string) => {
//     const mapping: Record<string, string> = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };
//     return mapping[classTime] || null;
//   };

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

//       const { error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);

//       if (error) throw error;

//       setCustMessage(tempCustMessage);
//       setAlertMessage("Custom message saved successfully!");
//     } catch (error: any) {
//       console.error("Error saving custom message:", error.message);
//       setAlertMessage("Error saving custom message. Please try again.");
//     }
//   };

//   const generateWhatsAppLink = (number: string) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   const handlePointerDown = (studentId: number, type: string, currentValue: string | null) => {
//     const longPressTimeout = window.setTimeout(() => {
//       setEditingPhone({ studentId, type });
//       setPhoneValues({ ...phoneValues, [type]: currentValue || "" });
//     }, 500);
//     inputRef.current = longPressTimeout;
//   };

//   const handlePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleEditClick = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   const handlePhoneBlur = async (studentId: number, type: string) => {
//     try {
//       const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
//       let column = type;

//       const { error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       fetchStudents(userSchool);
//       setAlertMessage("Phone number updated successfully!");
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error: any) {
//       console.error("Error updating phone number:", error.message);
//       setAlertMessage("Error updating phone number. Please try again.");
//     }
//   };

//   const handlePhoneCancel = () => {
//     setEditingPhone({ studentId: null, type: null });
//     setPhoneValues({ studentNumber: "", guardianNumber: "" });
//   };

//   const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
//     const timeoutId = window.setTimeout(() => {
//       setEditingStudentNameId(studentId);
//       setEditingStudentNameValue(currentValue);
//     }, 500);
//     inputRef.current = timeoutId;
//   };

//   const handleStudentNamePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleStudentNameBlur = async (studentId: number) => {
//     try {
//       const updatedName = editingStudentNameValue.trim();
//       if (!updatedName) {
//         setEditingStudentNameId(null);
//         return;
//       }

//       const { error } = await supabase
//         .from("student")
//         .update({ studentName: updatedName })
//         .eq("id", studentId);

//       if (error) throw error;

//       setEditingStudentNameId(null);
//       fetchStudents(userSchool);
//       setAlertMessage("Student name updated successfully!");
//     } catch (error: any) {
//       console.error("Error updating student name:", error.message);
//       setAlertMessage("Error updating student name. Please try again.");
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (!value) {
//       setSuggestions([]);
//       setFilteredStudentId(null);
//     } else {
//       fetchStudents(userSchool);
//     }
//   };

//   const handleSuggestionClick = (student: any) => {
//     setSearchTerm(student.studentName);
//     setFilteredStudentId(student.id);
//     setSuggestions([]);
//   };

//   const filteredStudents = () => {
//     let allStudents: any[] = [];
//     Object.values(studentsGrouped).forEach((list) => {
//       allStudents = allStudents.concat(list);
//     });

//     if (isFilterByAbsence) {
//       allStudents = allStudents.filter((student) => hasAbsence(student.id));
//     }

//     if (filteredStudentId !== null) {
//       allStudents = allStudents.filter((student) => student.id === filteredStudentId);
//     }

//     return allStudents;
//   };

//   const groupedFilteredStudents = () => {
//     const grouped: Record<string, any[]> = {};
//     filteredStudents().forEach((student) => {
//       const key = `${student.className} - Section ${student.section}`;
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(student);
//     });
//     return grouped;
//   };

//   const hasAbsence = (studentId: string): boolean => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((classTime) => attendance[classTime]);
//   };

//   // ***** NEW: Export to Excel functionality *****
//   // ***** NEW: Export to Excel functionality *****
// const handleExportToExcel = async () => {
//   // Close the export modal
//   setShowExportModal(false);
//   try {
//     // Build a select string for days 1 to 31
//     const dayColumns = Array.from({ length: 31 }, (_, i) => `"${i + 1}"`).join(",");
//     // Query the selected attendance table for records matching the user school
//     const { data: attendanceRecords, error } = await supabase
//       .from(exportTable)
//       .select(`id, ${dayColumns}, school`)
//       .eq("school", userSchool);
//     if (error) throw error;
//     if (!attendanceRecords) {
//       setAlertMessage("No attendance records found.");
//       return;
//     }
//     // Flatten the student groups into a list
//     let studentsList: any[] = [];
//     Object.values(studentsGrouped).forEach((group) => {
//       studentsList = studentsList.concat(group);
//     });
//     // Build a map from student id to student data
//     const studentMap = new Map();
//     studentsList.forEach((student) => {
//       studentMap.set(student.id, student);
//     });
//     // Build CSV header. We leave column A empty so that studentName, studentID, className, section go into columns B–E.
//     let csvContent = "";
//     let header = `,Student Name,Student ID,ClassName,Section`;
//     for (let i = 1; i <= 31; i++) {
//       header += `,${i}`;
//     }
//     csvContent += header + "\n";
//     // Loop over each attendance record
//     (attendanceRecords as any[]).forEach((record) => {
//       const student = studentMap.get(record.id);
//       if (!student) return; // Skip if no matching student

//       // Build an array for each row. We leave the first column empty so that
//       // Student Name, Student ID, ClassName, and Section fall into columns B, C, D, and E.
//       const rowValues: string[] = [
//         "", // Empty Column A
//         student.studentName,
//         "\t" + student.id, // Prepend a tab to force Excel to treat it as text
//         student.className,
//         student.section,
//       ];

//       // For days 1 to 31, output a checkmark for true and an empty checkbox for false
//       for (let i = 1; i <= 31; i++) {
//         const dayVal = record[i.toString()] === true ? "☑" : "☐";
//         rowValues.push(dayVal);
//       }

//       // Escape each value and join them with commas
//       const escapedRow = rowValues.map((val) => `"${val.replace(/"/g, '""')}"`);
//       csvContent += escapedRow.join(",") + "\n";
//     });
//     // Prepend a BOM so Excel recognizes UTF-8 encoding
//     const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `${exportTable}_Attendance.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (err: any) {
//     console.error("Error exporting attendance data:", err.message);
//     setAlertMessage("Error exporting attendance data. Please try again.");
//   }
// };
//   // ***** END NEW: Export functionality *****

//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#000",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     header: {
//       fontSize: "32px",
//       fontWeight: "700",
//       marginBottom: "5px",
//       textAlign: "center",
//       color: "#e0e0e0",
//     },
//     schoolName: {
//       fontSize: "20px",
//       fontWeight: "600",
//       marginBottom: "25px",
//       textAlign: "center",
//       color: "#b0b0b0",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "13px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       width: "48%",
//       minWidth: "280px",
//     },
//     subHeader: {
//       fontSize: "22px",
//       fontWeight: "600",
//       marginBottom: "0px",
//       color: "#fff",
//       textAlign: "center",
//     },
//     formGroup: {
//       marginBottom: "3px",
//       marginTop: "13px",
//       display: "flex",
//       flexDirection: "column",
//     },
//     label: {
//       marginBottom: "4px",
//       marginTop: "4px",
//       fontWeight: "500",
//       color: "#fff",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "20px",
//       fontSize: "22px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//       marginTop: "-4px",
//     },
//     inputField: {
//       backgroundColor: "#555",
//       marginTop: "-1px",
//       color: "#fff",
//       padding: "12px",
//       width: "100%",
//       fontSize: "18px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//     },
//     customMessageContainer: {
//       backgroundColor: "#000",
//       padding: "0 25px",
//       marginRight: "-15px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       width: "53%",
//       minWidth: "280px",
//       display: "flex",
//       alignItems: "flex-start",
//     },
//     customMessageInnerContainer: {
//       width: "100%",
//       display: "flex",
//       flexDirection: "column",
//     },
//     customMessageInput: {
//       width: "100%",
//       height: "200px",
//       padding: "12px 15px",
//       fontSize: "16px",
//       color: "#000",
//       border: "1px solid #2a2a2a",
//       borderRadius: "8px",
//       outline: "none",
//       resize: "vertical",
//     },
//     saveButton: {
//       marginTop: "10px",
//       padding: "10px",
//       fontSize: "20px",
//       color: "#ffffff",
//       backgroundColor: "#007bff",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "background-color 0.3s",
//       width: "100%",
//     },
//     // ***** NEW: Export button styling *****
//     exportAllButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "14px",
//       padding: "8px 16px",
//       cursor: "pointer",
//       marginBottom: "10px",
//     },
//     // ***** END NEW *****
//     tableContainer: {
//       marginTop: "50px",
//       overflowX: "auto",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       backgroundColor: "#f9f9f9",
//       padding: "12px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       minWidth: "1000px",
//     },
//     th: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "10px 2px",
//       backgroundColor: "#007bff",
//       color: "white",
//       fontSize: "18px",
//     },
//     tr: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: "18px",
//       textAlign: "right",
//     },
//     tr2: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: "18px",
//       textAlign: "center",
//     },
//     td: {
//       border: "1px solid #dddddd",
//       textAlign: "right",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//       fontSize: "22px",
//     },
//     td2: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     groupHeaderRow: {
//       backgroundColor: "#f1f1f1",
//     },
//     groupHeader: {
//       fontSize: "18px",
//       fontWeight: "600",
//       textAlign: "left",
//       padding: "10px",
//       color: "#333",
//     },
//     phoneLink: {
//       color: "#007bff",
//       textDecoration: "underline",
//       cursor: "pointer",
//       backgroundColor: "#f9f9f9",
//     },
//     noDataMessage: {
//       textAlign: "center",
//       color: "#777",
//       fontSize: "18px",
//     },
//     loadingText: {
//       textAlign: "center",
//       color: "#555",
//       fontSize: "18px",
//     },
//     editInput: {
//       width: "100%",
//       padding: "5px 10px",
//       fontSize: "22px",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//       outline: "none",
//       textAlign: "right",
//     },
//     checkboxLabel: {
//       position: "relative",
//       display: "inline-block",
//       width: "20px",
//       height: "20px",
//       cursor: "default",
//     },
//     hiddenCheckbox: {
//       opacity: 0,
//       width: 0,
//       height: 0,
//     },
//     redCross: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffcccc",
//       border: "1px solid #ff4d4d",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#ff0000",
//       fontSize: "14px",
//     },
//     emptyCheckbox: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffffff",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//     },
//     suggestionContainer: {
//       position: "relative",
//     },
//     suggestionsList: {
//       position: "absolute",
//       top: "100%",
//       left: 0,
//       width: "100%",
//       backgroundColor: "#222",
//       border: "1px solid #ccc",
//       borderRadius: "5px",
//       zIndex: 999,
//       maxHeight: "200px",
//       overflowY: "auto",
//     },
//     suggestionItem: {
//       padding: "10px",
//       cursor: "pointer",
//       borderBottom: "1px solid #ddd",
//       color: "#007bff",
//       backgroundColor: "#e0e1e0",
//       transition: "background-color 0.3s",
//     },
//     iconButton: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "28px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#ff4d4d",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButton2: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "34px",
//       padding: "20px",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#dbe346",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButton3: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "34px",
//       padding: "20px",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#00008B",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButtonHover: {
//       transform: "translateY(-2px)",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//       backgroundColor: "#e8e8e8",
//     },
//     pageContainer: {
//       display: "flex",
//       flexDirection: "row",
//       alignItems: "flex-start",
//       justifyContent: "center",
//       padding: "20px",
//       backgroundColor: "#f5f5f5",
//       minHeight: "100vh",
//       fontFamily: "Arial, sans-serif",
//     },
//     floatingContainer: {
//       position: "fixed",
//       top: "20px",
//       left: "35px",
//       width: "82px",
//       height: "auto",
//       backgroundColor: "#000",
//       borderRadius: "20px",
//       boxShadow: "0 2px 12px 1px #007BA7",
//       padding: "5px 10px",
//       zIndex: 1000,
//       flexShrink: 0,
//     },
//     card: {
//       flex: 1,
//       maxWidth: "1400px",
//       backgroundColor: "#000",
//       padding: "10px 0px",
//       borderRadius: "10px",
//       boxShadow: "0 10px 10px rgba(0, 0, 0, 0.6)",
//       textAlign: "center",
//       marginLeft: "20px",
//     },
//   };

//   const groupedStudentsToShow = groupedFilteredStudents();

//   return (
//     <div style={styles.container}>
//       <div style={styles.floatingContainer}>
//         <button
//           style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
//           onClick={() => navigate("/dashboard3")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           +
//         </button>
//         <button
//           style={styles.iconButton}
//           onClick={() => navigate("/")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           🏠
//         </button>
//         <button
//           style={styles.iconButton2}
//           onClick={() => navigate("/dash5")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           ⏰
//         </button>
//         <button
//           style={styles.iconButton3}
//           onClick={() => navigate("/dash5")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           🧑‍🏫
//         </button>
//       </div>
//       <div style={styles.card}>
//         <h1 style={styles.header}>Student Attendance</h1>
//         <p style={styles.schoolName}>{userSchool}</p>

//         {/* ***** NEW: Export to Excel Button at Top ***** */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//           <button style={styles.exportAllButton} onClick={() => setShowExportModal(true)}>
//             Export to Excel
//           </button>
//         </div>
//         {/* ***** END NEW ***** */}

//         {/* Top Section */}
//         <div style={styles.topSection}>
//           <div style={styles.filterContainer}>
//             <h2 style={styles.subHeader}>Filters</h2>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Class:</label>
//               <select
//                 style={styles.dropdown}
//                 value={selectedClassName}
//                 onChange={(e) => setSelectedClassName(e.target.value)}
//               >
//                 <option value="">All Classes</option>
//                 {classNames.map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 style={styles.dropdown}
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//               >
//                 <option value="">All Sections</option>
//                 {sections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Search by Name:</label>
//               <div style={{ position: "relative" }}>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   style={styles.inputField}
//                   placeholder="Student Name or Student ID..."
//                 />
//                 {suggestions.length > 0 && (
//                   <div style={styles.suggestionsList}>
//                     {suggestions.map((student: any) => (
//                       <div
//                         key={student.id}
//                         style={styles.suggestionItem}
//                         onClick={() => handleSuggestionClick(student)}
//                       >
//                         {`${student.studentName} (ID: ${student.id})`}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div style={styles.customMessageContainer}>
//             <div style={styles.customMessageInnerContainer}>
//               <textarea
//                 placeholder="Type your custom message here..."
//                 value={tempCustMessage}
//                 onChange={(e) => setTempCustMessage(e.target.value)}
//                 style={styles.customMessageInput}
//               />
//               <button onClick={handleCustomMessageSave} style={styles.saveButton} title="Save Message">
//                 ✓
//               </button>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "0px",
//           }}
//         >
//           <div style={{ position: "relative", marginBottom: "-45px" }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <input
//                 type="text"
//                 value={displayDate}
//                 readOnly
//                 style={{
//                   padding: "7px",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                   fontSize: "16px",
//                   width: "220px",
//                   height: "40px",
//                   marginRight: "10px",
//                 }}
//               />
//               <span
//                 style={{ cursor: "pointer", fontSize: "39px", marginTop: "12px" }}
//                 onClick={() => setShowCalendar((prev) => !prev)}
//                 title="Open Calendar"
//               >
//                 📅
//               </span>
//             </div>

//             {showCalendar && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "calc(100% + 5px)",
//                   backgroundColor: "#f9f9f9",
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   padding: "10px",
//                   zIndex: 999,
//                   boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <h4 style={{ margin: "0 0 10px", textAlign: "center", color: "black" }}>Select a Day</h4>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "5px",
//                   }}
//                 >
//                   {Array.from(
//                     { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
//                     (_, index) => index + 1
//                   ).map((day) => (
//                     <div
//                       key={day}
//                       onClick={() => {
//                         setSelectedDate(day);
//                         setDisplayDate(
//                           `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
//                         );
//                         setShowCalendar(false);
//                         fetchAttendanceDataForDay(day);
//                       }}
//                       style={{
//                         textAlign: "center",
//                         cursor: "pointer",
//                         padding: "8px",
//                         borderRadius: "50%",
//                         backgroundColor: day === selectedDate ? "#007BFF" : "#fff",
//                         color: day === selectedDate ? "#fff" : "#000",
//                         fontWeight: "bold",
//                         transition: "background-color 0.2s",
//                       }}
//                     >
//                       {day}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <button
//               style={{
//                 padding: "10px 20px",
//                 fontSize: "16px",
//                 backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//                 color: isFilterByAbsence ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 boxSizing: "border-box",
//                 marginBottom: "-40px",
//               }}
//               onClick={() => setIsFilterByAbsence((prev) => !prev)}
//             >
//               Filter by Absence
//             </button>
//           </div>
//         </div>

//         <div style={styles.tableContainer}>
//           {isLoading ? (
//             <p style={styles.loadingText}>Loading...</p>
//           ) : Object.keys(groupedStudentsToShow).length > 0 ? (
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Student No</th>
//                   <th style={styles.th}>Guardian No</th>
//                   <th style={styles.th}>Student ID</th>
//                   <th style={styles.th}>Student Name</th>
//                   {classTimes.map((classTime) => (
//                     <th key={classTime} style={styles.th}>
//                       {classTime}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(groupedStudentsToShow).map(([group, students]) => (
//                   <React.Fragment key={group}>
//                     <tr style={styles.groupHeaderRow}>
//                       <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                         {group}
//                       </td>
//                     </tr>
//                     {!collapsedGroups[group] &&
//                       students.map((student: any) => (
//                         <tr key={student.id} style={styles.tr}>
//                           <td style={styles.td}>
//                             {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//                               <input
//                                 type="text"
//                                 name="studentNumber"
//                                 value={phoneValues.studentNumber}
//                                 onChange={handlePhoneChange}
//                                 onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <a
//                                 href={student.studentNumber ? generateWhatsAppLink(student.studentNumber) || undefined : undefined}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={styles.phoneLink}
//                                 onPointerDown={() =>
//                                   handlePointerDown(student.id, "studentNumber", student.studentNumber)
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                                 title="Hold to edit"
//                               >
//                                 {student.studentNumber || "—"}
//                               </a>
//                             )}
//                           </td>
//                           <td style={styles.td}>
//                             {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//                               <input
//                                 type="text"
//                                 name="guardianNumber"
//                                 value={phoneValues.guardianNumber}
//                                 onChange={handlePhoneChange}
//                                 onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <a
//                                 href={student.guardianNumber ? generateWhatsAppLink(student.guardianNumber) || undefined : undefined}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={styles.phoneLink}
//                                 onPointerDown={() =>
//                                   handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                                 title="Hold to edit"
//                               >
//                                 {student.guardianNumber || "—"}
//                               </a>
//                             )}
//                           </td>
//                           <td style={styles.td2}>{student.id}</td>
//                           <td style={styles.td}>
//                             {editingStudentNameId === student.id ? (
//                               <input
//                                 type="text"
//                                 value={editingStudentNameValue}
//                                 onChange={(e) => setEditingStudentNameValue(e.target.value)}
//                                 onBlur={() => handleStudentNameBlur(student.id)}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <span
//                                 onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
//                                 onPointerUp={handleStudentNamePointerUpOrLeave}
//                                 onPointerLeave={handleStudentNamePointerUpOrLeave}
//                                 title="Hold to edit"
//                                 style={{ cursor: "pointer" }}
//                               >
//                                 {student.studentName}
//                               </span>
//                             )}
//                           </td>
//                           {classTimes.map((classTime) => (
//                             <td key={classTime} style={styles.td}>
//                               {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
//                                 <label style={styles.checkboxLabel}>
//                                   <input type="checkbox" checked={true} disabled style={styles.hiddenCheckbox} />
//                                   <span style={styles.redCross} title="Absent">
//                                     ❌
//                                   </span>
//                                 </label>
//                               ) : (
//                                 <label style={styles.checkboxLabel}>
//                                   <input type="checkbox" checked={false} disabled style={styles.hiddenCheckbox} />
//                                   <span style={styles.emptyCheckbox} title="Present" />
//                                 </label>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={styles.noDataMessage}>No students found for the selected filters.</p>
//           )}
//         </div>

//         {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
//       </div>

//       {/* ***** NEW: Export Modal ***** */}
//       {showExportModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#2a2a2a",
//               padding: "20px",
//               borderRadius: "10px",
//               maxWidth: "450px",
//               width: "90%",
//               color: "#fff",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={() => setShowExportModal(false)}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 backgroundColor: "#555",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "50%",
//                 width: "30px",
//                 height: "30px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//               }}
//             >
//               X
//             </button>
//             <h3 style={{ marginBottom: "20px" }}>Export Attendance</h3>
//             <p style={{ marginBottom: "10px" }}>
//               Select which attendance table to export (C1–C6):
//             </p>
//             <select
//               value={exportTable}
//               onChange={(e) => setExportTable(e.target.value)}
//               style={{
//                 backgroundColor: "#555",
//                 color: "#fff",
//                 padding: "10px",
//                 fontSize: "16px",
//                 border: "1px solid #555",
//                 borderRadius: "5px",
//                 outline: "none",
//                 width: "100%",
//                 marginBottom: "20px",
//               }}
//             >
//               {classTimes.map((ct) => (
//                 <option key={ct} value={ct}>
//                   {ct}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleExportToExcel}
//               style={{
//                 backgroundColor: "#3ecf8e",
//                 color: "#000",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "16px",
//                 padding: "10px 20px",
//                 cursor: "pointer",
//                 width: "100%",
//               }}
//             >
//               Export
//             </button>
//           </div>
//         </div>
//       )}
//       {/* ***** END NEW: Export Modal ***** */}
//     </div>
//   );
// }

// export default DashBoard;


// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import supabase from "../../supabase";
// import AlertModal from "./../AlertModal";
// import { useNavigate } from "react-router-dom";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
//   const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef<number | null>(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

//   // Attendance table names available for export
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
//   const today = new Date();
//   const currentDay = today.getDate();
//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [displayDate, setDisplayDate] = useState(
//     `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
//   );

//   const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

//   // For Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);

//   // For Editing Student Name
//   const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
//   const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

//   // Export Modal State
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportTable, setExportTable] = useState<string>(classTimes[0]);

//   // ***** NEW: Tooltip (Schedule Info) State *****
//   const [tooltipData, setTooltipData] = useState<{
//     classTime: string;
//     className: string;
//     section: string;
//     teacherName: string;
//     classRoom: string;
//   } | null>(null);
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (userSchool) {
//       fetchStudents(userSchool);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedClassName, selectedSection, userSchool]);

//   // Re-fetch students every 2 minutes if filter by absence is ON
//   useEffect(() => {
//     let intervalId: number | undefined;
//     if (isFilterByAbsence) {
//       intervalId = window.setInterval(() => {
//         fetchStudents(userSchool);
//       }, 120000);
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isFilterByAbsence, userSchool]);

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
//       fetchClassNames(profileData.school);
//       fetchSections(profileData.school);
//       fetchStudents(profileData.school);
//     } catch (error: any) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/sign-up");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchClassNames = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);
//       if (error) throw error;
//       const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error: any) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSections = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("school", school)
//         .neq("section", null);
//       if (error) throw error;
//       const uniqueSections = [...new Set(data.map((item: any) => item.section))];
//       setSections(uniqueSections);
//     } catch (error: any) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStudents = async (school: string) => {
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
//       const grouped: Record<string, any[]> = {};
//       data.forEach((student: any) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });
//       setStudentsGrouped(grouped);
//       await fetchAttendanceData(data);
//       if (searchTerm) {
//         const matchSuggestions = data.filter((student: any) => {
//           const name = student.studentName.toLowerCase();
//           const id = student.id.toString();
//           const term = searchTerm.toLowerCase();
//           return name.includes(term) || id.includes(term);
//         });
//         setSuggestions(matchSuggestions);
//       } else {
//         setSuggestions([]);
//       }
//     } catch (error: any) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAttendanceData = async (studentsList: any[]) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }
//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));
//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }
//           attendanceDataFetched.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );
//       setAttendanceData(attendanceMap);
//     } catch (error: any) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAttendanceDataForDay = async (day: number) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};
//       let studentsList: any[] = [];
//       Object.values(studentsGrouped).forEach((list) => {
//         studentsList = studentsList.concat(list);
//       });
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }
//           const { data, error } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${day}"`)
//             .in("id", studentsList.map((student) => student.id));
//           if (error) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, error.message);
//             return;
//           }
//           data.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${day}`] === true;
//           });
//         })
//       );
//       setAttendanceData(attendanceMap);
//     } catch (err: any) {
//       console.error("Error fetching attendance data for day:", err.message);
//       setAlertMessage("Error fetching attendance data for the selected day.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getAttendanceTable = (classTime: string) => {
//     const mapping: Record<string, string> = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };
//     return mapping[classTime] || null;
//   };

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
//       const { error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);
//       if (error) throw error;
//       setCustMessage(tempCustMessage);
//       setAlertMessage("Custom message saved successfully!");
//     } catch (error: any) {
//       console.error("Error saving custom message:", error.message);
//       setAlertMessage("Error saving custom message. Please try again.");
//     }
//   };

//   const generateWhatsAppLink = (number: string) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;
//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   const handlePointerDown = (studentId: number, type: string, currentValue: string | null) => {
//     const longPressTimeout = window.setTimeout(() => {
//       setEditingPhone({ studentId, type });
//       setPhoneValues({ ...phoneValues, [type]: currentValue || "" });
//     }, 500);
//     inputRef.current = longPressTimeout;
//   };

//   const handlePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleEditClick = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   const handlePhoneBlur = async (studentId: number, type: string) => {
//     try {
//       const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
//       let column = type;
//       const { error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);
//       if (error) throw error;
//       fetchStudents(userSchool);
//       setAlertMessage("Phone number updated successfully!");
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error: any) {
//       console.error("Error updating phone number:", error.message);
//       setAlertMessage("Error updating phone number. Please try again.");
//     }
//   };

//   const handlePhoneCancel = () => {
//     setEditingPhone({ studentId: null, type: null });
//     setPhoneValues({ studentNumber: "", guardianNumber: "" });
//   };

//   const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
//     const timeoutId = window.setTimeout(() => {
//       setEditingStudentNameId(studentId);
//       setEditingStudentNameValue(currentValue);
//     }, 500);
//     inputRef.current = timeoutId;
//   };

//   const handleStudentNamePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleStudentNameBlur = async (studentId: number) => {
//     try {
//       const updatedName = editingStudentNameValue.trim();
//       if (!updatedName) {
//         setEditingStudentNameId(null);
//         return;
//       }
//       const { error } = await supabase
//         .from("student")
//         .update({ studentName: updatedName })
//         .eq("id", studentId);
//       if (error) throw error;
//       setEditingStudentNameId(null);
//       fetchStudents(userSchool);
//       setAlertMessage("Student name updated successfully!");
//     } catch (error: any) {
//       console.error("Error updating student name:", error.message);
//       setAlertMessage("Error updating student name. Please try again.");
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (!value) {
//       setSuggestions([]);
//       setFilteredStudentId(null);
//     } else {
//       fetchStudents(userSchool);
//     }
//   };

//   const handleSuggestionClick = (student: any) => {
//     setSearchTerm(student.studentName);
//     setFilteredStudentId(student.id);
//     setSuggestions([]);
//   };

//   const filteredStudents = () => {
//     let allStudents: any[] = [];
//     Object.values(studentsGrouped).forEach((list) => {
//       allStudents = allStudents.concat(list);
//     });
//     if (isFilterByAbsence) {
//       allStudents = allStudents.filter((student) => hasAbsence(student.id));
//     }
//     if (filteredStudentId !== null) {
//       allStudents = allStudents.filter((student) => student.id === filteredStudentId);
//     }
//     return allStudents;
//   };

//   const groupedFilteredStudents = () => {
//     const grouped: Record<string, any[]> = {};
//     filteredStudents().forEach((student) => {
//       const key = `${student.className} - Section ${student.section}`;
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(student);
//     });
//     return grouped;
//   };

//   const hasAbsence = (studentId: string): boolean => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((classTime) => attendance[classTime]);
//   };

//   // Export to Excel functionality
//   const handleExportToExcel = async () => {
//     setShowExportModal(false);
//     try {
//       const dayColumns = Array.from({ length: 31 }, (_, i) => `"${i + 1}"`).join(",");
//       const { data: attendanceRecords, error } = await supabase
//         .from(exportTable)
//         .select(`id, ${dayColumns}, school`)
//         .eq("school", userSchool);
//       if (error) throw error;
//       if (!attendanceRecords) {
//         setAlertMessage("No attendance records found.");
//         return;
//       }
//       let studentsList: any[] = [];
//       Object.values(studentsGrouped).forEach((group) => {
//         studentsList = studentsList.concat(group);
//       });
//       const studentMap = new Map();
//       studentsList.forEach((student) => {
//         studentMap.set(student.id, student);
//       });
//       let csvContent = "";
//       let header = `,Student Name,Student ID,ClassName,Section`;
//       for (let i = 1; i <= 31; i++) {
//         header += `,${i}`;
//       }
//       csvContent += header + "\n";
//       (attendanceRecords as any[]).forEach((record) => {
//         const student = studentMap.get(record.id);
//         if (!student) return;
//         const rowValues: string[] = [
//           "",
//           student.studentName,
//           "\t" + student.id,
//           student.className,
//           student.section,
//         ];
//         for (let i = 1; i <= 31; i++) {
//           const dayVal = record[i.toString()] === true ? "☑" : "☐";
//           rowValues.push(dayVal);
//         }
//         const escapedRow = rowValues.map((val) => `"${val.replace(/"/g, '""')}"`);
//         csvContent += escapedRow.join(",") + "\n";
//       });
//       const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${exportTable}_Attendance.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err: any) {
//       console.error("Error exporting attendance data:", err.message);
//       setAlertMessage("Error exporting attendance data. Please try again.");
//     }
//   };

//   // ***** NEW: Tooltip Functions for Schedule Info on Hover *****
//   // Convert display date to day of week (e.g., "MONDAY")
//   const getDayOfWeek = (dateStr: string): string => {
//     const date = new Date(dateStr);
//     const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
//     return days[date.getDay()];
//   };

//   const handleCheckboxHover = async (e: React.MouseEvent, classTime: string) => {
//     if (!selectedClassName || !selectedSection || !userSchool) return;
//     // Position the tooltip relative to the hovered cell
//     setTooltipPos({ x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().bottom + 5 });
//     const dayOfWeek = getDayOfWeek(displayDate);
//     try {
//       const { data, error } = await supabase
//         .from("schedule")
//         .select("*")
//         .eq("day", dayOfWeek)
//         .eq("classTable", classTime)
//         .eq("className", selectedClassName)
//         .eq("section", selectedSection)
//         .eq("school", userSchool)
//         .single();
//       if (error) {
//         console.error("Error fetching schedule info:", error);
//         setTooltipData(null);
//         return;
//       }
//       if (data) {
//         setTooltipData({
//           classTime: classTime,
//           className: data.className,
//           section: data.section,
//           teacherName: data.teacherName,
//           classRoom: data.classRoom,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       setTooltipData(null);
//     }
//   };

//   const handleCheckboxLeave = () => {
//     setTooltipData(null);
//   };
//   // ***** END NEW: Tooltip Functions *****

//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#000",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     header: {
//       fontSize: "32px",
//       fontWeight: "700",
//       marginBottom: "5px",
//       textAlign: "center",
//       color: "#e0e0e0",
//     },
//     schoolName: {
//       fontSize: "20px",
//       fontWeight: "600",
//       marginBottom: "25px",
//       textAlign: "center",
//       color: "#b0b0b0",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "13px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       width: "48%",
//       minWidth: "280px",
//     },
//     subHeader: {
//       fontSize: "22px",
//       fontWeight: "600",
//       marginBottom: "0px",
//       color: "#fff",
//       textAlign: "center",
//     },
//     formGroup: {
//       marginBottom: "3px",
//       marginTop: "13px",
//       display: "flex",
//       flexDirection: "column",
//     },
//     label: {
//       marginBottom: "4px",
//       marginTop: "4px",
//       fontWeight: "500",
//       color: "#fff",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "20px",
//       fontSize: "22px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//       marginTop: "-4px",
//     },
//     inputField: {
//       backgroundColor: "#555",
//       marginTop: "-1px",
//       color: "#fff",
//       padding: "12px",
//       width: "100%",
//       fontSize: "18px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//     },
//     customMessageContainer: {
//       backgroundColor: "#000",
//       padding: "0 25px",
//       marginRight: "-15px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       width: "53%",
//       minWidth: "280px",
//       display: "flex",
//       alignItems: "flex-start",
//     },
//     customMessageInnerContainer: {
//       width: "100%",
//       display: "flex",
//       flexDirection: "column",
//     },
//     customMessageInput: {
//       width: "100%",
//       height: "200px",
//       padding: "12px 15px",
//       fontSize: "16px",
//       color: "#000",
//       border: "1px solid #2a2a2a",
//       borderRadius: "8px",
//       outline: "none",
//       resize: "vertical",
//     },
//     saveButton: {
//       marginTop: "10px",
//       padding: "10px",
//       fontSize: "20px",
//       color: "#ffffff",
//       backgroundColor: "#007bff",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "background-color 0.3s",
//       width: "100%",
//     },
//     exportAllButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "14px",
//       padding: "8px 16px",
//       cursor: "pointer",
//       marginBottom: "10px",
//     },
//     tableContainer: {
//       marginTop: "50px",
//       overflowX: "auto",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       backgroundColor: "#f9f9f9",
//       padding: "12px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       minWidth: "1000px",
//     },
//     th: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "10px 2px",
//       backgroundColor: "#007bff",
//       color: "white",
//       fontSize: "18px",
//       cursor: "default",
//     },
//     tr: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: "18px",
//       textAlign: "right",
//     },
//     tr2: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: "18px",
//       textAlign: "center",
//     },
//     td: {
//       border: "1px solid #dddddd",
//       textAlign: "right",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//       fontSize: "22px",
//     },
//     td2: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     groupHeaderRow: {
//       backgroundColor: "#f1f1f1",
//     },
//     groupHeader: {
//       fontSize: "18px",
//       fontWeight: "600",
//       textAlign: "left",
//       padding: "10px",
//       color: "#333",
//     },
//     phoneLink: {
//       color: "#007bff",
//       textDecoration: "underline",
//       cursor: "pointer",
//       backgroundColor: "#f9f9f9",
//     },
//     noDataMessage: {
//       textAlign: "center",
//       color: "#777",
//       fontSize: "18px",
//     },
//     loadingText: {
//       textAlign: "center",
//       color: "#555",
//       fontSize: "18px",
//     },
//     editInput: {
//       width: "100%",
//       padding: "5px 10px",
//       fontSize: "22px",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//       outline: "none",
//       textAlign: "right",
//     },
//     checkboxLabel: {
//       position: "relative",
//       display: "inline-block",
//       width: "20px",
//       height: "20px",
//       cursor: "default",
//     },
//     hiddenCheckbox: {
//       opacity: 0,
//       width: 0,
//       height: 0,
//     },
//     redCross: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffcccc",
//       border: "1px solid #ff4d4d",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#ff0000",
//       fontSize: "14px",
//     },
//     emptyCheckbox: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffffff",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//     },
//     suggestionContainer: {
//       position: "relative",
//     },
//     suggestionsList: {
//       position: "absolute",
//       top: "100%",
//       left: 0,
//       width: "100%",
//       backgroundColor: "#222",
//       border: "1px solid #ccc",
//       borderRadius: "5px",
//       zIndex: 999,
//       maxHeight: "200px",
//       overflowY: "auto",
//     },
//     suggestionItem: {
//       padding: "10px",
//       cursor: "pointer",
//       borderBottom: "1px solid #ddd",
//       color: "#007bff",
//       backgroundColor: "#e0e1e0",
//       transition: "background-color 0.3s",
//     },
//     iconButton: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "28px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#ff4d4d",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButton2: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "34px",
//       padding: "20px",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#dbe346",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButton3: {
//       width: "60px",
//       height: "60px",
//       margin: "12px 0",
//       fontSize: "34px",
//       padding: "20px",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#00008B",
//       color: "#fff",
//       border: "1px solid #Dfff",
//       borderRadius: "10px",
//       cursor: "pointer",
//       transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     },
//     iconButtonHover: {
//       transform: "translateY(-2px)",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//       backgroundColor: "#e8e8e8",
//     },
//     pageContainer: {
//       display: "flex",
//       flexDirection: "row",
//       alignItems: "flex-start",
//       justifyContent: "center",
//       padding: "20px",
//       backgroundColor: "#f5f5f5",
//       minHeight: "100vh",
//       fontFamily: "Arial, sans-serif",
//     },
//     floatingContainer: {
//       position: "fixed",
//       top: "20px",
//       left: "35px",
//       width: "82px",
//       height: "auto",
//       backgroundColor: "#000",
//       borderRadius: "20px",
//       boxShadow: "0 2px 12px 1px #007BA7",
//       padding: "5px 10px",
//       zIndex: 1000,
//       flexShrink: 0,
//     },
//     card: {
//       flex: 1,
//       maxWidth: "1400px",
//       backgroundColor: "#000",
//       padding: "10px 0px",
//       borderRadius: "10px",
//       boxShadow: "0 10px 10px rgba(0, 0, 0, 0.6)",
//       textAlign: "center",
//       marginLeft: "20px",
//     },
//     // ***** NEW: Tooltip styling *****
//     tooltip: {
//       position: "fixed",
//       backgroundColor: "#333",
//       color: "#fff",
//       padding: "10px",
//       borderRadius: "8px",
//       zIndex: 10000,
//       boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
//       fontSize: "14px",
//       pointerEvents: "none",
//       maxWidth: "300px",
//     },
//     tooltipRow: {
//       marginBottom: "5px",
//     },
//     tooltipClassTable: {
//       color: "#fff",
//       fontWeight: "bold",
//       marginBottom: "5px",
//     },
//     tooltipClassNameSection: {
//       display: "flex",
//       flexDirection: "row",
//       gap: "5px",
//       marginBottom: "5px",
//     },
//     tooltipClassName: {
//       color: "lightblue",
//     },
//     tooltipSection: {
//       color: "lightblue",
//     },
//     tooltipTeacherName: {
//       color: "red",
//       marginBottom: "5px",
//     },
//     tooltipClassRoom: {
//       color: "orange",
//     },
//   };

//   const groupedStudentsToShow = groupedFilteredStudents();

//   return (
//     <div style={styles.container}>
//       <div style={styles.floatingContainer}>
//         <button
//           style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
//           onClick={() => navigate("/dashboard3")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           +
//         </button>
//         <button
//           style={styles.iconButton}
//           onClick={() => navigate("/")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           🏠
//         </button>
//         <button
//           style={styles.iconButton2}
//           onClick={() => navigate("/dash5")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           ⏰
//         </button>
//         <button
//           style={styles.iconButton3}
//           onClick={() => navigate("/dash5")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           🧑‍🏫
//         </button>
//       </div>
//       <div style={styles.card}>
//         <h1 style={styles.header}>Student Attendance</h1>
//         <p style={styles.schoolName}>{userSchool}</p>
//         <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//           <button style={styles.exportAllButton} onClick={() => setShowExportModal(true)}>
//             Export to Excel
//           </button>
//         </div>
//         <div style={styles.topSection}>
//           <div style={styles.filterContainer}>
//             <h2 style={styles.subHeader}>Filters</h2>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Class:</label>
//               <select
//                 style={styles.dropdown}
//                 value={selectedClassName}
//                 onChange={(e) => setSelectedClassName(e.target.value)}
//               >
//                 <option value="">All Classes</option>
//                 {classNames.map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 style={styles.dropdown}
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//               >
//                 <option value="">All Sections</option>
//                 {sections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Search by Name:</label>
//               <div style={{ position: "relative" }}>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   style={styles.inputField}
//                   placeholder="Student Name or Student ID..."
//                 />
//                 {suggestions.length > 0 && (
//                   <div style={styles.suggestionsList}>
//                     {suggestions.map((student: any) => (
//                       <div
//                         key={student.id}
//                         style={styles.suggestionItem}
//                         onClick={() => handleSuggestionClick(student)}
//                       >
//                         {`${student.studentName} (ID: ${student.id})`}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div style={styles.customMessageContainer}>
//             <div style={styles.customMessageInnerContainer}>
//               <textarea
//                 placeholder="Type your custom message here..."
//                 value={tempCustMessage}
//                 onChange={(e) => setTempCustMessage(e.target.value)}
//                 style={styles.customMessageInput}
//               />
//               <button onClick={handleCustomMessageSave} style={styles.saveButton} title="Save Message">
//                 ✓
//               </button>
//             </div>
//           </div>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "0px",
//           }}
//         >
//           <div style={{ position: "relative", marginBottom: "-45px" }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <input
//                 type="text"
//                 value={displayDate}
//                 readOnly
//                 style={{
//                   padding: "7px",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                   fontSize: "16px",
//                   width: "220px",
//                   height: "40px",
//                   marginRight: "10px",
//                 }}
//               />
//               <span
//                 style={{ cursor: "pointer", fontSize: "39px", marginTop: "12px" }}
//                 onClick={() => setShowCalendar((prev) => !prev)}
//                 title="Open Calendar"
//               >
//                 📅
//               </span>
//             </div>
//             {showCalendar && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "calc(100% + 5px)",
//                   backgroundColor: "#f9f9f9",
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   padding: "10px",
//                   zIndex: 999,
//                   boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <h4 style={{ margin: "0 0 10px", textAlign: "center", color: "black" }}>Select a Day</h4>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "5px",
//                   }}
//                 >
//                   {Array.from(
//                     { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
//                     (_, index) => index + 1
//                   ).map((day) => (
//                     <div
//                       key={day}
//                       onClick={() => {
//                         setSelectedDate(day);
//                         setDisplayDate(
//                           `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
//                         );
//                         setShowCalendar(false);
//                         fetchAttendanceDataForDay(day);
//                       }}
//                       style={{
//                         textAlign: "center",
//                         cursor: "pointer",
//                         padding: "8px",
//                         borderRadius: "50%",
//                         backgroundColor: day === selectedDate ? "#007BFF" : "#fff",
//                         color: day === selectedDate ? "#fff" : "#000",
//                         fontWeight: "bold",
//                         transition: "background-color 0.2s",
//                       }}
//                     >
//                       {day}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           <div>
//             <button
//               style={{
//                 padding: "10px 20px",
//                 fontSize: "16px",
//                 backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//                 color: isFilterByAbsence ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 boxSizing: "border-box",
//                 marginBottom: "-40px",
//               }}
//               onClick={() => setIsFilterByAbsence((prev) => !prev)}
//             >
//               Filter by Absence
//             </button>
//           </div>
//         </div>
//         <div style={styles.tableContainer}>
//           {isLoading ? (
//             <p style={styles.loadingText}>Loading...</p>
//           ) : Object.keys(groupedStudentsToShow).length > 0 ? (
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Student No</th>
//                   <th style={styles.th}>Guardian No</th>
//                   <th style={styles.th}>Student ID</th>
//                   <th style={styles.th}>Student Name</th>
//                   {classTimes.map((classTime) => (
//                     <th
//                       key={classTime}
//                       style={styles.th}
//                       onMouseEnter={(e) => handleCheckboxHover(e, classTime)}
//                       onMouseLeave={handleCheckboxLeave}
//                     >
//                       {classTime}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(groupedStudentsToShow).map(([group, students]) => (
//                   <React.Fragment key={group}>
//                     <tr style={styles.groupHeaderRow}>
//                       <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                         {group}
//                       </td>
//                     </tr>
//                     {!collapsedGroups[group] &&
//                       students.map((student: any) => (
//                         <tr key={student.id} style={styles.tr}>
//                           <td style={styles.td}>
//                             {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//                               <input
//                                 type="text"
//                                 name="studentNumber"
//                                 value={phoneValues.studentNumber}
//                                 onChange={handlePhoneChange}
//                                 onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <a
//                                 href={student.studentNumber ? generateWhatsAppLink(student.studentNumber) || undefined : undefined}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={styles.phoneLink}
//                                 onPointerDown={() =>
//                                   handlePointerDown(student.id, "studentNumber", student.studentNumber)
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                                 title="Hold to edit"
//                               >
//                                 {student.studentNumber || "—"}
//                               </a>
//                             )}
//                           </td>
//                           <td style={styles.td}>
//                             {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//                               <input
//                                 type="text"
//                                 name="guardianNumber"
//                                 value={phoneValues.guardianNumber}
//                                 onChange={handlePhoneChange}
//                                 onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <a
//                                 href={student.guardianNumber ? generateWhatsAppLink(student.guardianNumber) || undefined : undefined}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={styles.phoneLink}
//                                 onPointerDown={() =>
//                                   handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                                 title="Hold to edit"
//                               >
//                                 {student.guardianNumber || "—"}
//                               </a>
//                             )}
//                           </td>
//                           <td style={styles.td2}>{student.id}</td>
//                           <td style={styles.td}>
//                             {editingStudentNameId === student.id ? (
//                               <input
//                                 type="text"
//                                 value={editingStudentNameValue}
//                                 onChange={(e) => setEditingStudentNameValue(e.target.value)}
//                                 onBlur={() => handleStudentNameBlur(student.id)}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <span
//                                 onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
//                                 onPointerUp={handleStudentNamePointerUpOrLeave}
//                                 onPointerLeave={handleStudentNamePointerUpOrLeave}
//                                 title="Hold to edit"
//                                 style={{ cursor: "pointer" }}
//                               >
//                                 {student.studentName}
//                               </span>
//                             )}
//                           </td>
//                           {classTimes.map((classTime) => (
//                             <td key={classTime} style={styles.td} onMouseEnter={(e) => handleCheckboxHover(e, classTime)} onMouseLeave={handleCheckboxLeave}>
//                               {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
//                                 <label style={styles.checkboxLabel}>
//                                   <input type="checkbox" checked={true} disabled style={styles.hiddenCheckbox} />
//                                   <span style={styles.redCross} title="Absent">
//                                     ❌
//                                   </span>
//                                 </label>
//                               ) : (
//                                 <label style={styles.checkboxLabel}>
//                                   <input type="checkbox" checked={false} disabled style={styles.hiddenCheckbox} />
//                                   <span style={styles.emptyCheckbox} title="Present" />
//                                 </label>
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={styles.noDataMessage}>No students found for the selected filters.</p>
//           )}
//         </div>
//         {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
//       </div>
//       {showExportModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#2a2a2a",
//               padding: "20px",
//               borderRadius: "10px",
//               maxWidth: "450px",
//               width: "90%",
//               color: "#fff",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={() => setShowExportModal(false)}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 backgroundColor: "#555",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "50%",
//                 width: "30px",
//                 height: "30px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//               }}
//             >
//               X
//             </button>
//             <h3 style={{ marginBottom: "20px" }}>Export Attendance</h3>
//             <p style={{ marginBottom: "10px" }}>Select which attendance table to export (C1–C6):</p>
//             <select
//               value={exportTable}
//               onChange={(e) => setExportTable(e.target.value)}
//               style={{
//                 backgroundColor: "#555",
//                 color: "#fff",
//                 padding: "10px",
//                 fontSize: "16px",
//                 border: "1px solid #555",
//                 borderRadius: "5px",
//                 outline: "none",
//                 width: "100%",
//                 marginBottom: "20px",
//               }}
//             >
//               {classTimes.map((ct) => (
//                 <option key={ct} value={ct}>
//                   {ct}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleExportToExcel}
//               style={{
//                 backgroundColor: "#3ecf8e",
//                 color: "#000",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "16px",
//                 padding: "10px 20px",
//                 cursor: "pointer",
//                 width: "100%",
//               }}
//             >
//               Export
//             </button>
//           </div>
//         </div>
//       )}
//       {/* ***** NEW: Tooltip for Schedule Info on Hover ***** */}
//       {tooltipData && (
//         <div
//           style={{
//             ...styles.tooltip,
//             top: tooltipPos.y,
//             left: tooltipPos.x,
//           }}
//         >
//           <div style={styles.tooltipRow}>
//             <span style={styles.tooltipClassTable}>{tooltipData.classTime}</span>
//           </div>
//           <div style={{ ...styles.tooltipRow, ...styles.tooltipClassNameSection }}>
//             <span style={styles.tooltipClassName}>{tooltipData.className}</span>
//             <span style={styles.tooltipSection}>- {tooltipData.section}</span>
//           </div>
//           <div style={styles.tooltipRow}>
//             <span style={styles.tooltipTeacherName}>{tooltipData.teacherName}</span>
//           </div>
//           <div style={styles.tooltipRow}>
//             <span style={styles.tooltipClassRoom}>{tooltipData.classRoom}</span>
//           </div>
//         </div>
//       )}
//       {/* ***** END NEW: Tooltip ***** */}
//     </div>
//   );
// }

// export default DashBoard;
