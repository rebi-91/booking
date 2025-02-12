
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';

// Define interfaces for Payment and Discount Rows
interface PaymentRow {
  index: number;
  P: number | null;
  D: string | null;
  R: string | null;
}

interface DiscountRow {
  index: number;
  PQ: number | null;
  DQ: string | null;
  RQ: string | null;
}

function StudentFee() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // For grouping students by "className - Section"
  const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // For custom message
  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");

  // Editing phone / name states
  const [editingField, setEditingField] = useState<{ studentId: number | null; type: string | null }>({
    studentId: null,
    type: null
  });
  const [fieldValues, setFieldValues] = useState<{ studentNumber: string; guardianNumber: string; studentName: string }>({
    studentNumber: "",
    guardianNumber: "",
    studentName: ""
  });

  // For the new search input
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]); // optional, if you'd like to display a dropdown of matches

  // This array of times for columns
  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;

  // For filtering out no-tick columns
  const [filterNoTickCols, setFilterNoTickCols] = useState<string[]>([]);
  // For hiding columns if desired
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  // Fee Modal States
  const [feeModalVisible, setFeeModalVisible] = useState(false);
  const [currentFeeColumn, setCurrentFeeColumn] = useState<string | null>(null);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [feeValue, setFeeValue] = useState("");
  const [feeDate, setFeeDate] = useState<Date | null>(new Date());
  const [feeRefNo, setFeeRefNo] = useState("");

  // Student Detail Modal
  const [studentDetailModalVisible, setStudentDetailModalVisible] = useState(false);
  const [studentDetail, setStudentDetail] = useState<any | null>(null);
  const [editingFees, setEditingFees] = useState<Record<string, boolean>>({});
  const [editingModalFields, setEditingModalFields] = useState<Record<string, boolean>>({});

  // Discount States (PQ1..3)
  const [addingDiscount, setAddingDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountDate, setDiscountDate] = useState<Date | null>(new Date());
  const [discountReason, setDiscountReason] = useState("");

  // Amount to Pay
  const [amountToPay, setAmountToPay] = useState("1,500,000");

  const columnMap: Record<string, string> = { C1: '1', C2: '2', C3: '3', C4: '4', C5: '5', C6: '6' };
  const longPressRef = useRef<number | null>(null);

  // Utility
  const formatFeeValue = (value: string | number) => {
    const numeric = typeof value === 'string' ? value.replace(/\D/g, "") : value.toString();
    if (!numeric) return "";
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Select all text on focus
  const handleFocusSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const totalWithoutCommas = (str: string) => parseInt(str.replace(/,/g, ''), 10) || 0;

  // Summations
  const sumP = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) {
        const numVal = typeof val === 'string' ? parseInt(val.replace(/,/g, ''), 10) : val;
        if (!isNaN(numVal)) sum += numVal;
      }
    }
    return sum;
  };

  const sumPQ = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i = 1; i <= 3; i++) {
      const val = studentDetail[`PQ${i}`];
      if (val != null) {
        const numVal = typeof val === 'string' ? parseInt(val.replace(/,/g, ''), 10) : val;
        if (!isNaN(numVal)) sum += numVal;
      }
    }
    return sum;
  };

  const combinedTotal = sumP() + sumPQ();
  const amountLeft = studentDetail ? totalWithoutCommas(amountToPay) - combinedTotal : 0;

  // Fetch students
  const fetchStudents = async (school: string) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("student")
        .select("*")
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
      (data as any[]).forEach((student) => {
        const key = `${student.className} - Section ${student.section}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(student);
      });

      setStudentsGrouped(grouped);
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch class names
  const fetchClassNames = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school)
        .neq("className", null);

      if (error) throw error;

      const uniqueClassNames = [...new Set((data as any[]).map((item) => item.className))];
      setClassNames(uniqueClassNames);
    } catch (error: any) {
      console.error("Error fetching class names:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sections
  const fetchSections = async (className: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("className", className)
        .neq("section", null);

      if (error) throw error;

      const uniqueSections = [...new Set((data as any[]).map((item) => item.section))];
      setSections(uniqueSections);
    } catch (error: any) {
      console.error("Error fetching sections:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data on mount
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
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Save custom message
  const handleCustomMessageSave = async () => {
    try {
      if (!tempCustMessage.trim()) {
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
    } catch (error: any) {
      console.error("Error saving custom message:", error.message);
    }
  };

  // Generate WhatsApp link
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

  // Handle changes in the new search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);

    // Build a simple suggestions array (IDs + Names).
    const allPossible: string[] = [];
    Object.values(studentsGrouped).forEach((students) => {
      students.forEach((stud) => {
        allPossible.push(String(stud.id));
        if (stud.studentName) {
          allPossible.push(stud.studentName);
        }
      });
    });

    // Filter out empty strings & duplicates
    const uniqueList = Array.from(new Set(allPossible.filter(Boolean)));
    // Basic substring match
    const matched = uniqueList.filter((item) => item.toLowerCase().includes(val.toLowerCase()));
    setSuggestions(matched);
  };

  // Common function for onBlur saving of phone or name
  const handleFieldBlur = async (studentId: number, type: string) => {
    // type can be "studentNumber", "guardianNumber", or "studentName"
    const newValue = fieldValues[type as "studentNumber" | "guardianNumber" | "studentName"].trim();
    let column = type; // direct match

    try {
      if (!column) return;
      const { error } = await supabase
        .from("student")
        .update({ [column]: newValue || null })
        .eq("id", studentId);

      if (error) throw error;
      // Re-fetch after update
      fetchStudents(userSchool);

      setEditingField({ studentId: null, type: null });
      setFieldValues({ ...fieldValues, [type]: "" });
    } catch (error: any) {
      console.error(`Error updating ${type}:`, error.message);
    }
  };

  // Long press logic
  const handleLongPressStart = (
    e: React.MouseEvent | React.TouchEvent,
    rowIndex: number,
    field: string,
    currentValue: any
  ) => {
    e.preventDefault();
    longPressRef.current = window.setTimeout(() => {
      // If field is "studentNumber", "guardianNumber", or "studentName", we set editing
      // Otherwise, handle fee columns
      if (field === "studentNumber" || field === "guardianNumber" || field === "studentName") {
        setEditingField({ studentId: rowIndex, type: field });
        setFieldValues({ ...fieldValues, [field]: currentValue });
      } else {
        // Payment or date columns => same as existing handleFeeEditClick
        handleFeeEditClick(rowIndex, field);
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  // Fee logic
  const handleFeeEditClick = (rowIndex: number, field: string) => {
    setEditingFees({ ...editingFees, [`${field}${rowIndex}`]: true });
  };

  const handleFeeEditSaveDirect = async (col: string, value: any) => {
    if (!studentDetail) return false;
    const { error } = await supabase
      .from("student")
      .update({ [col]: value })
      .eq("id", studentDetail.id);

    if (error) {
      console.error("Error updating data:", error);
      return false;
    }
    const updatedStudent = { ...studentDetail, [col]: value };
    setStudentDetail(updatedStudent);
    return true;
  };

  const handleFeeEditSaveInModal = async (rowIndex: number, field: string, value: any) => {
    const success = await handleFeeEditSaveDirect(field, value);

    // If editing P1..P6 => auto update the 1..6 column to true
    if (success && field.startsWith("P") && !field.startsWith("PQ")) {
      const rawValue = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;
      const feeVal = isNaN(rawValue) ? null : rawValue;
      const colIndex = field.replace("P", "");
      const checkColumn = colIndex;
      await supabase
        .from("student")
        .update({ [checkColumn]: feeVal !== null ? true : null })
        .eq("id", studentDetail?.id);

      const { data } = await supabase
        .from("student")
        .select("*")
        .eq("id", studentDetail?.id)
        .single();

      setStudentDetail(data);
    }

    if (!success) return;
    setEditingFees({ ...editingFees, [`${field}${rowIndex}`]: false });
  };
  // Fee Value Change
  const handleFeeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeeValue(formatFeeValue(e.target.value));
  };

  // Handle checkbox in main table
  const handleCheckboxChange = (student: any, classTime: string) => {
    const col = columnMap[classTime];
    setCurrentStudent(student);
    setCurrentFeeColumn(col);

    const pVal = student[`P${col}`] || "";
    const dVal = student[`D${col}`] || "";
    const rVal = student[`R${col}`] || "";

    setFeeValue(pVal ? formatFeeValue(pVal.toString()) : "");
    setFeeDate(dVal ? new Date(dVal) : new Date());
    setFeeRefNo(rVal || "");
    setFeeModalVisible(true);
  };

  // Title click to hide/show column
  const handleColumnTitleClick = (classTime: string) => {
    if (hiddenColumns.includes(classTime)) {
      setHiddenColumns(hiddenColumns.filter((c) => c !== classTime));
    } else {
      setHiddenColumns([...hiddenColumns, classTime]);
    }
  };

  // Round filter icon
  const handleFilterClick = (classTime: string) => {
    if (filterNoTickCols.includes(classTime)) {
      setFilterNoTickCols(filterNoTickCols.filter((c) => c !== classTime));
    } else {
      setFilterNoTickCols([...filterNoTickCols, classTime]);
    }
  };

  // Confirm Fee Modal
  const handleFeeConfirm = async () => {
    if (!feeDate || !currentFeeColumn || !currentStudent) return;
    const pCol = `P${currentFeeColumn}`;
    const dCol = `D${currentFeeColumn}`;
    const rCol = `R${currentFeeColumn}`;
    const chkCol = currentFeeColumn;

    const rawFee = feeValue.replace(/,/g, "");
    const feeNumber = parseInt(rawFee, 10) || null;
    const dateVal = feeDate ? feeDate.toISOString().split('T')[0] : null;

    const { error } = await supabase
      .from("student")
      .update({
        [chkCol]: feeNumber !== null ? true : null,
        [pCol]: feeNumber,
        [dCol]: dateVal,
        [rCol]: feeRefNo || null,
      })
      .eq("id", currentStudent.id);

    if (error) console.error("Error saving fee data:", error);

    setFeeModalVisible(false);
    setCurrentStudent(null);
    setCurrentFeeColumn(null);
    fetchStudents(userSchool);
  };

  // Close Fee Modal
  const handleFeeModalClose = () => {
    setFeeModalVisible(false);
    setCurrentStudent(null);
    setCurrentFeeColumn(null);
  };

  // Delete Fee Entry
  const handleDeleteEntry = async () => {
    if (!currentFeeColumn || !currentStudent) return;
    const pCol = `P${currentFeeColumn}`;
    const dCol = `D${currentFeeColumn}`;
    const rCol = `R${currentFeeColumn}`;
    const chkCol = currentFeeColumn;

    const { error } = await supabase
      .from("student")
      .update({
        [chkCol]: null,
        [pCol]: null,
        [dCol]: null,
        [rCol]: null,
      })
      .eq("id", currentStudent.id);

    if (error) console.error("Error deleting fee entry:", error);

    setFeeModalVisible(false);
    setCurrentStudent(null);
    setCurrentFeeColumn(null);
    fetchStudents(userSchool);
  };

  // Render Payment Table
  const renderPaymentTable = () => {
    if (!studentDetail) return null;

    // We'll reuse the same getRowsToDisplay logic:
    const payments = getRowsToDisplay("P", 6) as PaymentRow[];

    return (
      <div style={styles.modalTableContainer}>
        <h3 style={{ color: '#fff' }}>Payments</h3>
        <table style={styles.modalTable}>
          <thead>
            <tr>
              <th style={styles.modalTh}>Payment</th>
              <th style={styles.modalTh}>Date</th>
              <th style={styles.modalTh}>Reference No</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.index}>
                {/* Payment Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, payment.index, "P", payment.P || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, payment.index, "P", payment.P || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`P${payment.index}`] ? (
                    <input
                      type="text"
                      value={payment.P != null ? formatFeeValue(payment.P.toString()) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const num = parseInt(raw, 10);
                        handleFeeEditSaveInModal(payment.index, `P${payment.index}`, isNaN(num) ? null : num);
                      }}
                      onBlur={() => setEditingFees({ ...editingFees, [`P${payment.index}`]: false })}
                      autoFocus
                      className="modal-edit-input"
                      onFocus={handleFocusSelectAll}
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {payment.P != null ? formatFeeValue(payment.P.toString()) : "---"}
                    </span>
                  )}
                </td>

                {/* Date Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, payment.index, "D", payment.D || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, payment.index, "D", payment.D || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`D${payment.index}`] ? (
                    <DatePicker
                      selected={payment.D ? new Date(payment.D) : null}
                      onChange={async (date: Date | null) => {
                        const iso = date ? date.toISOString().split('T')[0] : null;
                        await handleFeeEditSaveInModal(payment.index, `D${payment.index}`, iso);
                      }}
                      // isClearable
                      placeholderText="Select date"
                      className="form-control myDatePicker"
                      onBlur={() => setEditingFees({ ...editingFees, [`D${payment.index}`]: false })}
                      autoFocus
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {payment.D ? new Date(payment.D).toLocaleDateString() : "---"}
                    </span>
                  )}
                </td>

                {/* Reference No Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, payment.index, "R", payment.R || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, payment.index, "R", payment.R || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`R${payment.index}`] ? (
                    <input
                      type="text"
                      value={payment.R || ""}
                      onChange={(e) => handleFeeEditSaveInModal(payment.index, `R${payment.index}`, e.target.value)}
                      onBlur={() => setEditingFees({ ...editingFees, [`R${payment.index}`]: false })}
                      autoFocus
                      className="modal-edit-input"
                      onFocus={handleFocusSelectAll}
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {payment.R || "---"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Discount Table
  const renderDiscountTable = () => {
    if (!studentDetail) return null;

    const discounts = getRowsToDisplay("PQ", 3) as DiscountRow[];

    return (
      <div style={styles.modalTableContainer}>
        <h3 style={{ color: '#fff' }}>Discounts</h3>
        <table style={styles.modalTable}>
          <thead>
            <tr>
              <th style={styles.modalTh}>Discount</th>
              <th style={styles.modalTh}>Date</th>
              <th style={styles.modalTh}>Reason for Discount</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.index}>
                {/* Discount Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, discount.index, "PQ", discount.PQ || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, discount.index, "PQ", discount.PQ || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`PQ${discount.index}`] ? (
                    <input
                      type="text"
                      value={discount.PQ != null ? formatFeeValue(discount.PQ.toString()) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const num = parseInt(raw, 10);
                        handleFeeEditSaveInModal(discount.index, `PQ${discount.index}`, isNaN(num) ? null : num);
                      }}
                      onBlur={() => setEditingFees({ ...editingFees, [`PQ${discount.index}`]: false })}
                      autoFocus
                      className="modal-edit-input"
                      onFocus={handleFocusSelectAll}
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {discount.PQ != null ? formatFeeValue(discount.PQ.toString()) : "---"}
                    </span>
                  )}
                </td>

                {/* Discount Date Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, discount.index, "DQ", discount.DQ || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, discount.index, "DQ", discount.DQ || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`DQ${discount.index}`] ? (
                    <DatePicker
                      selected={discount.DQ ? new Date(discount.DQ) : null}
                      onChange={async (date: Date | null) => {
                        const iso = date ? date.toISOString().split('T')[0] : null;
                        await handleFeeEditSaveInModal(discount.index, `DQ${discount.index}`, iso);
                      }}
                      // isClearable
                      placeholderText="Select date"
                      className="form-control myDatePicker"
                      onBlur={() => setEditingFees({ ...editingFees, [`DQ${discount.index}`]: false })}
                      autoFocus
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {discount.DQ ? new Date(discount.DQ).toLocaleDateString() : "---"}
                    </span>
                  )}
                </td>

                {/* Reason for Discount Cell */}
                <td
                  style={styles.modalTd}
                  onMouseDown={(e) => handleLongPressStart(e, discount.index, "RQ", discount.RQ || "")}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, discount.index, "RQ", discount.RQ || "")}
                  onTouchEnd={handleLongPressEnd}
                >
                  {editingFees[`RQ${discount.index}`] ? (
                    <input
                      type="text"
                      value={discount.RQ || ""}
                      onChange={(e) => handleFeeEditSaveInModal(discount.index, `RQ${discount.index}`, e.target.value)}
                      onBlur={() => setEditingFees({ ...editingFees, [`RQ${discount.index}`]: false })}
                      autoFocus
                      className="modal-edit-input"
                      onFocus={handleFocusSelectAll}
                    />
                  ) : (
                    <span style={{ cursor: 'pointer' }}>
                      {discount.RQ || "---"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper to open detail modal
  const handleStudentNameClick = async (student: any) => {
    // If user is in long-press editing mode for the same cell, do nothing
    if (editingField.studentId === student.id && editingField.type === "studentName") {
      return;
    }
    if (!student) {
      console.error("No student data available");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("student")
        .select("*")
        .eq("id", student.id)
        .single();

      if (error) throw error;

      setStudentDetail(data);
      setAddingDiscount(false);
      setDiscountValue("");
      setDiscountDate(new Date());
      setDiscountReason("");

      const amt = data.totalAmount != null ? data.totalAmount.toString() : "1500000";
      setAmountToPay(formatFeeValue(amt));

      setStudentDetailModalVisible(true);
    } catch (error: any) {
      console.error("Error fetching student details:", error.message);
      window.alert("Error fetching student details. Please try again.");
    }
  };

  // Utility for constructing PaymentRow/DiscountRow arrays
  const getRowsToDisplay = (prefix: string, limit: number): (PaymentRow | DiscountRow)[] => {
    if (!studentDetail) return [];

    const filledRows: number[] = [];
    for (let i = 1; i <= limit; i++) {
      const value = studentDetail[`${prefix}${i}`];
      const date = prefix.startsWith("PQ") ? studentDetail[`DQ${i}`] : studentDetail[`D${i}`];
      const ref = prefix.startsWith("PQ") ? studentDetail[`RQ${i}`] : studentDetail[`R${i}`];
      if (value || date || ref) {
        filledRows.push(i);
      }
    }

    let rows: (PaymentRow | DiscountRow)[] = [];

    if (prefix === "P") {
      rows = filledRows.map((i) => ({
        index: i,
        P: studentDetail[`P${i}`],
        D: studentDetail[`D${i}`],
        R: studentDetail[`R${i}`],
      }));
      if (filledRows.length < limit) {
        rows.push({ index: filledRows.length + 1, P: null, D: null, R: null });
      }
    } else if (prefix === "PQ") {
      rows = filledRows.map((i) => ({
        index: i,
        PQ: studentDetail[`PQ${i}`],
        DQ: studentDetail[`DQ${i}`],
        RQ: studentDetail[`RQ${i}`],
      }));
      if (filledRows.length < limit) {
        rows.push({ index: filledRows.length + 1, PQ: null, DQ: null, RQ: null });
      }
    }

    if (filledRows.length === 0) {
      if (prefix === "P") {
        rows.push({ index: 1, P: null, D: null, R: null });
      } else if (prefix === "PQ") {
        rows.push({ index: 1, PQ: null, DQ: null, RQ: null });
      }
    }

    return rows;
  };

  // Chart data
  const getFeeDataForChart = () => {
    if (!studentDetail) return { labels: [], datasets: [] };

    const fees: number[] = [];
    const feeLabels: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) {
        feeLabels.push(`P${i}`);
        fees.push(val);
      }
    }

    const discounts: number[] = [];
    const discountLabels: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const val = studentDetail[`PQ${i}`];
      if (val != null) {
        discountLabels.push(`Discount ${i}`);
        discounts.push(val);
      }
    }

    return {
      labels: [...feeLabels, ...discountLabels, 'Amount Left'],
      datasets: [
        {
          label: "Fees",
          data: [...fees, ...Array(discountLabels.length).fill(null), null],
          backgroundColor: "#007bff", // Lighter blue
          borderColor: "#64b5f6",
          borderWidth: 1,
          barPercentage: 1.5,        // default is usually 0.9
          categoryPercentage: 1.5, 
        },
        {
          label: "Discounts",
          data: [...Array(feeLabels.length).fill(null), ...discounts, null],
          backgroundColor: "#3ecf8e",
          borderColor: "#3ecf8e",
          borderWidth: 1,
          barPercentage: 1.5,        // default is usually 0.9
          categoryPercentage: 1.5, 
        },
        {
          label: "Amount Left to Pay",
          data: [...Array(feeLabels.length + discountLabels.length).fill(null), amountLeft],
          backgroundColor: "red", // Lighter blue
  borderColor: "red",
          borderWidth: 1,
          barPercentage: 1.5,        // default is usually 0.9
          categoryPercentage: 1.5, 
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        }
      },
      tooltip: {
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.8)',
      }
    },
    scales: {
      x: {
        barPercentage: 0.1,        // default is usually 0.9
        categoryPercentage: 0.2, 
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        }
      }
    }
  };

  // Effects
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedClassName) {
      fetchSections(selectedClassName);
    } else {
      setSections([]);
      setSelectedSection("");
      fetchStudents(userSchool);
    }
    // eslint-disable-next-line
  }, [selectedClassName]);

  useEffect(() => {
    fetchStudents(userSchool);
    // eslint-disable-next-line
  }, [selectedSection]);

  useEffect(() => {
    return () => {
      if (longPressRef.current) clearTimeout(longPressRef.current);
    };
  }, []);

  // Save Amount to Pay
  const handleSaveAmountToPay = async () => {
    if (!studentDetail) return;
    const rawAmt = totalWithoutCommas(amountToPay);
    const { error } = await supabase
      .from("student")
      .update({ totalAmount: rawAmt })
      .eq("id", studentDetail.id);

    if (error) console.error("Error saving amount to pay:", error);

    const updatedStudent = { ...studentDetail, totalAmount: rawAmt };
    setStudentDetail(updatedStudent);
  };

  // Discount logic
  const handleDiscountButton = () => {
    setAddingDiscount(!addingDiscount);
  };

  const handleSaveDiscount = async () => {
    if (!studentDetail) return;
    let slot: number | null = null;
    for (let i = 1; i <= 3; i++) {
      if (!studentDetail[`PQ${i}`]) {
        slot = i;
        break;
      }
    }

    if (!slot) {
      console.error("No more discount slots available.");
      return;
    }

    const raw = discountValue.replace(/\D/g, "");
    const discNum = raw ? parseInt(raw, 10) : null;
    const dDate = discountDate ? discountDate.toISOString().split('T')[0] : null;
    const dReason = discountReason.trim() || null;

    const { error } = await supabase
      .from("student")
      .update({
        [`PQ${slot}`]: discNum,
        [`DQ${slot}`]: dDate,
        [`RQ${slot}`]: dReason
      })
      .eq("id", studentDetail.id);

    if (error) {
      console.error("Error saving discount:", error);
      return;
    }

    const updatedStudent = {
      ...studentDetail,
      [`PQ${slot}`]: discNum,
      [`DQ${slot}`]: dDate,
      [`RQ${slot}`]: dReason
    };
    setStudentDetail(updatedStudent);
    setAddingDiscount(false);
    setDiscountValue("");
    setDiscountDate(new Date());
    setDiscountReason("");
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountValue(formatFeeValue(e.target.value));
  };

  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToPay(formatFeeValue(e.target.value));
  };

  const handleStudentDetailModalClose = () => {
    setStudentDetailModalVisible(false);
    setStudentDetail(null);
    setEditingModalFields({});
  };

  {/* Utility function to determine alignment based on text content */}
const getAlignment = (text: string) => {
  const englishRegex = /^[A-Za-z\s]+$/; // Matches English letters and spaces
  return englishRegex.test(text) ? "right" : "left";
};

  return (
    <div style={styles.container2}>
    {/* Floating Container */}
    <div style={styles.floatingContainer}>
      {/* <button
        style={{ ...styles.iconButton2, backgroundColor: "#666" }}
        onClick={() => navigate("/dashboard2")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🎓
      </button> */}
      {/* <button
        style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
        onClick={() => navigate("/dashboard3")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        +
      </button> */}
      <button
        style={styles.iconButton2}
        onClick={() => navigate("/dashboard")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        📅
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
        style={styles.iconButton3}
        onClick={() => navigate("/dash5")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🧑‍🏫
      </button>
    </div>
    <div style={styles.container}>
      <h1 style={styles.header}>Student Fee</h1>
      <p style={styles.schoolName}>{userSchool}</p>

      {/* Top Section: Filters, including new search, and Custom Message */}
      <div style={styles.topSection}>
        {/* Filter Container */}
        <div style={styles.filterContainer}>
          <h2 style={styles.subHeader}>Filters</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Class:</label>
            <select
              style={styles.dropdown as CSSProperties}
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
            >
              <option value="">All Classes</option>
              {classNames.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Section:</label>
            <select
              style={styles.dropdown as CSSProperties}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClassName}
            >
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* New Search Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Search:</label>
            <input
              type="text"
              placeholder="Search by Name or ID..."
              style={{ textAlign: "right", backgroundColor: "#555", color: "#fff", border: "1px solid #555", borderRadius: "5px", padding: "10px" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/* Example suggestions dropdown (optional) */}
            {/* 
            {searchTerm && suggestions.length > 0 && (
              <ul style={{ maxHeight: "100px", overflowY: "auto", backgroundColor: "#222" }}>
                {suggestions.map((sug) => (
                  <li key={sug} style={{ color: "#fff", padding: "5px" }}>
                    {sug}
                  </li>
                ))}
              </ul>
            )}
            */}
          </div>
        </div>

        {/* Custom Message Container */}
        <div style={styles.customMessageContainer}>
          <h2 style={styles.subHeader}>Custom Message</h2>
          <Form>
            <Form.Group controlId="customMessage">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Type your custom message here..."
                value={tempCustMessage}
                onChange={(e) => setTempCustMessage(e.target.value)}
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: "5px",
                  padding: "10px",
                  resize: "vertical",
                  textAlign: "right" // right align the text
                }}
              />
            </Form.Group>
            <Button
              onClick={handleCustomMessageSave}
              variant="primary"
              className="mt-3"
              style={styles.submitButton}
            >
              Save Message
            </Button>
          </Form>
        </div>
      </div>

      {/* Students Table */}
      <div style={styles.tableContainer}>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#fff', fontSize: '18px' }}>
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading...</p>
          </div>
        ) : Object.keys(studentsGrouped).length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Select</th>
                <th style={styles.th}>Student No</th>
                <th style={styles.th}>Guardian No</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Student Name</th>
                {classTimes.map((classTime) => (
                  hiddenColumns.includes(classTime) ? null : (
                    <th key={classTime} style={styles.th}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => handleColumnTitleClick(classTime)}>
                          {classTime}
                        </span>
                        {/* Round Filter Icon */}
                        <span
                          style={{
                            cursor: 'pointer',
                            backgroundColor: filterNoTickCols.includes(classTime) ? 'red' : 'grey',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleFilterClick(classTime)}
                          title="Toggle filter for students who haven't paid"
                        >
                          ⚲
                        </span>
                      </div>
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(studentsGrouped).map(([group, students]) => (
                <React.Fragment key={group}>
                  <tr style={{ backgroundColor: '#333' }}>
                    <td colSpan={5 + classTimes.length} style={{ fontSize: '18px', fontWeight: '600', textAlign: 'left', padding: '10px', color: '#fff' }}>
                      {group}
                    </td>
                  </tr>
                  {students
                    // Filter by searchTerm (name or ID)
                    .filter((stud) => {
                      if (!searchTerm.trim()) return true;
                      const term = searchTerm.toLowerCase();
                      const name = (stud.studentName || "").toLowerCase();
                      const idStr = String(stud.id).toLowerCase();
                      return name.includes(term) || idStr.includes(term);
                    })
                    .map((student) => {
                      // Apply per-column filters
                      for (let ct of filterNoTickCols) {
                        const colCheck = columnMap[ct];
                        if (student[colCheck] === true) {
                          return null;
                        }
                      }

                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid #555' }}>
                          {/* Checkbox Cell (unused) */}
                          <td style={styles.td}>
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => {}}
                              style={styles.checkbox}
                            />
                          </td>

                          {/* Student No */}
                          <td style={styles.td}>
                            {editingField.studentId === student.id && editingField.type === "studentNumber" ? (
                              <input
                                type="text"
                                name="studentNumber"
                                value={fieldValues.studentNumber}
                                onChange={(e) => setFieldValues({ ...fieldValues, studentNumber: e.target.value })}
                                onBlur={() => handleFieldBlur(student.id, "studentNumber")}
                                autoFocus
                                style={{ width: '100%', padding: '5px 10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                onFocus={handleFocusSelectAll}
                              />
                            ) : student.studentNumber ? (
                              <a
                                href={generateWhatsAppLink(student.studentNumber) || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3ecf8e', textDecoration: 'underline', cursor: 'pointer', backgroundColor: '#1e1e1e' }}
                                onMouseDown={(e) => handleLongPressStart(e, student.id, "studentNumber", student.studentNumber)}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                onTouchStart={(e) => handleLongPressStart(e, student.id, "studentNumber", student.studentNumber)}
                                onTouchEnd={handleLongPressEnd}
                                title="Hold to edit"
                              >
                                {student.studentNumber}
                              </a>
                            ) : (
                              "---"
                            )}
                          </td>

                          {/* Guardian No */}
                          <td style={styles.td}>
                            {editingField.studentId === student.id && editingField.type === "guardianNumber" ? (
                              <input
                                type="text"
                                name="guardianNumber"
                                value={fieldValues.guardianNumber}
                                onChange={(e) => setFieldValues({ ...fieldValues, guardianNumber: e.target.value })}
                                onBlur={() => handleFieldBlur(student.id, "guardianNumber")}
                                autoFocus
                                style={{ width: '100%', padding: '5px 10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                onFocus={handleFocusSelectAll}
                              />
                            ) : student.guardianNumber ? (
                              <a
                                href={generateWhatsAppLink(student.guardianNumber) || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3ecf8e', textDecoration: 'underline', cursor: 'pointer', backgroundColor: '#1e1e1e' }}
                                onMouseDown={(e) => handleLongPressStart(e, student.id, "guardianNumber", student.guardianNumber)}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                onTouchStart={(e) => handleLongPressStart(e, student.id, "guardianNumber", student.guardianNumber)}
                                onTouchEnd={handleLongPressEnd}
                                title="Hold to edit"
                              >
                                {student.guardianNumber}
                              </a>
                            ) : (
                              "---"
                            )}
                          </td>

                          {/* Student ID */}
                          <td style={styles.td}>{student.id}</td>

                          {/* Student Name */}
                          <td style={styles.td}>
                            {editingField.studentId === student.id && editingField.type === "studentName" ? (
                              <input
                                type="text"
                                name="studentName"
                                value={fieldValues.studentName}
                                onChange={(e) => setFieldValues({ ...fieldValues, studentName: e.target.value })}
                                onBlur={() => handleFieldBlur(student.id, "studentName")}
                                autoFocus
                                style={{ width: '100%', textAlign: student.studentName.match(/^[A-Za-z\s]+$/) ? "left" : "right", padding: '5px 10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                onFocus={handleFocusSelectAll}
                              />
                            ) : (
                              <span
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#3ecf8e',textAlign: getAlignment(fieldValues.studentName), 
                                }}
                                onClick={() => handleStudentNameClick(student)}
                                onMouseDown={(e) => handleLongPressStart(e, student.id, "studentName", student.studentName)}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                onTouchStart={(e) => handleLongPressStart(e, student.id, "studentName", student.studentName)}
                                onTouchEnd={handleLongPressEnd}
                                title="Hold to edit"
                              >
                                {student.studentName}
                              </span>
                            )}
                          </td>

                          {/* Fee Checkbox Columns */}
                          {classTimes.map((classTime) => {
                            if (hiddenColumns.includes(classTime)) return null;
                            const col = columnMap[classTime];
                            const checked = student[col] === true;
                            return (
                              <td key={classTime} style={styles.td}>
                                <label style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={checked || false}
                                    onChange={() => handleCheckboxChange(student, classTime)}
                                    style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                                  />
                                  <span style={{
                                    backgroundColor: checked ? '#28a745' : '#ffffff',
                                    borderColor: checked ? '#28a745' : '#ccc',
                                    color: checked ? '#28a745' : 'transparent',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '20px',
                                    width: '20px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                  }} title={checked ? "Fee Paid" : "Not Paid"}>
                                    {checked && '✓'}
                                  </span>
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: '#fff', fontSize: '18px' }}>
            No students found for the selected filters.
          </p>
        )}
      </div>

      {/* Fee Modal */}
      <Modal show={feeModalVisible && currentStudent} onHide={handleFeeModalClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1e1e1e", color: "#fff", borderBottom: "1px solid #555" }}>
          <Modal.Title>{currentStudent?.studentName} - Fee {currentFeeColumn}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
          <Form>
            <Form.Group controlId="feeValue">
              <Form.Label style={{ color: "#fff" }}>Fee Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter Fee P${currentFeeColumn}`}
                value={feeValue}
                onChange={handleFeeValueChange}
                style={{ backgroundColor: "#555", color: "#fff", border: "1px solid #555", borderRadius: "5px" }}
                onFocus={handleFocusSelectAll}
              />
              <Form.Text className="text-muted" style={{ color: "#ccc" }}>
                Enter the fee amount without commas.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="feeDate" className="mt-3">
              <Form.Label style={{ color: "#fff" }}>Payment Date</Form.Label>
              {editingFees[`D${currentFeeColumn}`] ? (
                <DatePicker
                  selected={feeDate}
                  onChange={async (date: Date | null) => {
                    const iso = date ? date.toISOString().split('T')[0] : null;
                    await handleFeeEditSaveInModal(parseInt(currentFeeColumn || "0"), `D${currentFeeColumn}`, iso);
                  }}
                  // isClearable
                  placeholderText="Select date"
                  className="form-control myDatePicker"
                  onBlur={() => setEditingFees({ ...editingFees, [`D${currentFeeColumn}`]: false })}
                  autoFocus
                />
              ) : (
                <span style={{ cursor: 'pointer' }} onClick={() => handleFeeEditClick(parseInt(currentFeeColumn || "0"), `D${currentFeeColumn}`)}>
                  {feeDate ? feeDate.toLocaleDateString() : "---"}
                </span>
              )}
            </Form.Group>

            <Form.Group controlId="feeRefNo" className="mt-3">
              <Form.Label style={{ color: "#fff" }}>Reference Number</Form.Label>
              {editingFees[`R${currentFeeColumn}`] ? (
                <input
                  type="text"
                  value={feeRefNo || ""}
                  onChange={(e) => handleFeeEditSaveInModal(parseInt(currentFeeColumn || "0"), `R${currentFeeColumn}`, e.target.value)}
                  onBlur={() => setEditingFees({ ...editingFees, [`R${currentFeeColumn}`]: false })}
                  autoFocus
                  style={styles.modalEditInput}
                  onFocus={handleFocusSelectAll}
                />
              ) : (
                <span style={{ cursor: 'pointer' }} onClick={() => handleFeeEditClick(parseInt(currentFeeColumn || "0"), `R${currentFeeColumn}`)}>
                  {feeRefNo || "---"}
                </span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#1e1e1e", borderTop: "1px solid #555" }}>
          <Button variant="danger" onClick={handleDeleteEntry} style={styles.modalDeleteButton}>
            Delete Entry
          </Button>
          <Button variant="secondary" onClick={handleFeeModalClose} style={styles.modalCloseButton}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFeeConfirm} disabled={!feeValue.trim() || !feeRefNo.trim()} style={styles.modalSubmitButton}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Detail Modal */}
      <Modal show={studentDetailModalVisible && studentDetail} onHide={handleStudentDetailModalClose} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1e1e1e", color: "#fff", borderBottom: "1px solid #555" }}>
          <Modal.Title>{studentDetail?.studentName} - Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
            Total Payments: {formatFeeValue(sumP().toString())}
            <span style={{ color: '#3ecf8e' }}>
              {" "}+ Discounts: {formatFeeValue(sumPQ().toString())}
            </span>
            {" "}= {formatFeeValue((sumP() + sumPQ()).toString())}
            <span style={{ color: 'red' }}>
              {" "}+ {formatFeeValue(amountLeft.toString())}
            </span>
          </p>

          <p style={{ fontWeight: 'bold' }}>
            {studentDetail?.className} - {studentDetail?.section}
          </p>

          {renderPaymentTable()}
          {renderDiscountTable()}

          {/* Add Discount Section */}
          {addingDiscount && (
            <div style={{ marginTop: '20px' }}>
              <div style={styles.modalTableContainer}>
                <h3 style={{ color: '#fff' }}>Add Discount</h3>
                <Form>
                  <Form.Group controlId="discountValue">
                    <Form.Label style={{ color: "#fff" }}>Discount Amount</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Discount Amount"
                      value={discountValue}
                      onChange={handleDiscountValueChange}
                      style={{ backgroundColor: "#555", color: "#fff", border: "1px solid #555", borderRadius: "5px" }}
                      onFocus={handleFocusSelectAll}
                    />
                  </Form.Group>

                  <Form.Group controlId="discountDate" className="mt-3">
                    <Form.Label style={{ color: "#fff" }}>Discount Date:&nbsp;</Form.Label>
                    {editingFees[`DQ${currentFeeColumn}`] ? (
                      <DatePicker
                        selected={discountDate ? new Date(discountDate) : null}
                        onChange={async (date: Date | null) => {
                          const iso = date ? date.toISOString().split('T')[0] : null;
                          await handleFeeEditSaveInModal(parseInt(currentFeeColumn || "0"), `DQ${currentFeeColumn}`, iso);
                        }}
                        // isClearable
                        placeholderText="Select date"
                        className="form-control myDatePicker"
                        onBlur={() => setEditingFees({ ...editingFees, [`DQ${currentFeeColumn}`]: false })}
                        autoFocus
                      />
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={() => handleFeeEditClick(parseInt(currentFeeColumn || "0"), `DQ${currentFeeColumn}`)}>
                        {discountDate ? discountDate.toLocaleDateString() : "---"}
                      </span>
                    )}
                  </Form.Group>

                  <Form.Group controlId="discountReason" className="mt-3">
                    <Form.Label style={{ color: "#fff" }}>Reason for Discount&nbsp;</Form.Label>
                    {editingFees[`RQ${currentFeeColumn}`] ? (
                      <input
                        type="text"
                        value={discountReason || ""}
                        onChange={(e) => handleFeeEditSaveInModal(parseInt(currentFeeColumn || "0"), `RQ${currentFeeColumn}`, e.target.value)}
                        onBlur={() => setEditingFees({ ...editingFees, [`RQ${currentFeeColumn}`]: false })}
                        autoFocus
                        style={styles.modalEditInput}
                        onFocus={handleFocusSelectAll}
                      />
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={() => handleFeeEditClick(parseInt(currentFeeColumn || "0"), `RQ${currentFeeColumn}`)}>
                        {discountReason || "---"}
                      </span>
                    )}
                  </Form.Group>
                </Form>
              </div>
            </div>
          )}

          <Button
            variant={addingDiscount ? 'success' : 'primary'}
            onClick={addingDiscount ? handleSaveDiscount : handleDiscountButton}
            className="mt-3 w-100"
            style={{ backgroundColor: addingDiscount ? '#28a745' : '#007bff', borderColor: addingDiscount ? '#28a745' : '#007bff' }}
          >
            {addingDiscount ? 'Save Discount' : 'Add Discount'}
          </Button>

          {/* Amount to Pay Section */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <Form.Control
              type="text"
              placeholder="Amount to Pay"
              value={amountToPay}
              onChange={handleAmountToPayChange}
              style={{ marginRight: '10px', backgroundColor: '#555', color: '#fff', border: '1px solid #555', borderRadius: '5px', padding: '10px' }}
              onFocus={handleFocusSelectAll}
            />
            <Button
              variant="secondary"
              onClick={handleSaveAmountToPay}
              style={{ padding: '10px 20px', borderRadius: '5px' }}
            >
              Save
            </Button>
          </div>

          {/* Chart */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ height: "400px" }}>
              <Bar data={getFeeDataForChart()} options={chartOptions} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#1e1e1e", borderTop: "1px solid #555" }}>
          <Button variant="secondary" onClick={handleStudentDetailModalClose} style={styles.modalCloseButton}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
}

// Styles
const styles: Record<string, CSSProperties> = {
  container: {
    width: "95%",
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#121212",
    boxShadow: "0 4px 20px 1px #007BA7",
    borderRadius: "10px",
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
    border: "1px solid #Dfff", // Border for button definition
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
    border: "1px solid #Dfff", // Border for button definition
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
  subHeader: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "15px",
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#555",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #555",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  customMessageContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px 1px #000",
    flex: "1",
    minWidth: "280px",
  },
  submitButton: {
    backgroundColor: "#3ecf8e",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    marginTop: "50px",
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
    minWidth: "800px",
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
    position: "relative",
    cursor: "pointer",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  modalTableContainer: {
    marginTop: "20px",
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#1e1e1e",
    padding: "12px",
    marginBottom: "20px",
  },
  modalTable: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
    color: "#fff",
    fontSize: "16px",
  },
  modalTh: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "8px",
    backgroundColor: "#3ecf8e",
    color: "#000",
    fontSize: "16px",
  },
  modalTd: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  modalEditInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "5px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  modalSubmitButton: {
    backgroundColor: "#3ecf8e",
    color: "#000",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
  modalDeleteButton: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
  modalCloseButton: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
};

export default StudentFee;

