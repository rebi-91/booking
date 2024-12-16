import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function StudentFee() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
  const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
  const inputRef = useRef<number | null>(null);
  const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]); 
  const [filterNoTickCols, setFilterNoTickCols] = useState<string[]>([]);

  // Fee Modal States
  const [feeModalVisible, setFeeModalVisible] = useState(false);
  const [currentFeeColumn, setCurrentFeeColumn] = useState<string | null>(null);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [feeValue, setFeeValue] = useState("");
  const [feeDate, setFeeDate] = useState<Date | null>(new Date());
  const [feeRefNo, setFeeRefNo] = useState("");

  // Student Detail Modal
  const [studentDetailModalVisible, setStudentDetailModalVisible] = useState(false);
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [editingFees, setEditingFees] = useState<Record<string, boolean>>({});

  // Discount States (PQ1-3 only)
  const [addingDiscount, setAddingDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountDate, setDiscountDate] = useState<Date | null>(new Date());
  const [discountReason, setDiscountReason] = useState("");

  // Amount to Pay
  const [amountToPay, setAmountToPay] = useState("1,500,000");

  const columnMap: Record<string, string> = { C1: '1', C2: '2', C3: '3', C4: '4', C5: '5', C6: '6' };

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

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

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

  const handleCustomMessageSave = async () => {
    try {
      if (!tempCustMessage.trim()) {
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

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

      if (type === "studentNumber") column = "studentNumber";
      else if (type === "guardianNumber") column = "guardianNumber";

      const { error } = await supabase
        .from("student")
        .update({ [column]: updatedNumber || null })
        .eq("id", studentId);

      if (error) throw error;

      fetchStudents(userSchool);
      setEditingPhone({ studentId: null, type: null });
      setPhoneValues({ studentNumber: "", guardianNumber: "" });
    } catch (error: any) {
      console.error("Error updating phone number:", error.message);
    }
  };

  const handlePointerDown = (studentId: number, type: string, currentValue: string) => {
    const longPressTimeout = window.setTimeout(() => {
      handleEditClick(studentId, type, currentValue);
    }, 500);
    inputRef.current = longPressTimeout;
  };

  const handlePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  const formatFeeValue = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

  const handleColumnTitleClick = (classTime: string) => {
    if (hiddenColumns.includes(classTime)) {
      setHiddenColumns(hiddenColumns.filter((c) => c !== classTime));
    } else {
      setHiddenColumns([...hiddenColumns, classTime]);
    }
  };

  const handleMinusClick = (classTime: string) => {
    if (filterNoTickCols.includes(classTime)) {
      setFilterNoTickCols(filterNoTickCols.filter((c) => c !== classTime));
    } else {
      setFilterNoTickCols([...filterNoTickCols, classTime]);
    }
  };

  const allFeeFieldsFilled = feeValue.trim() !== "" && feeRefNo.trim() !== "";

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

  const handleFeeModalClose = () => {
    setFeeModalVisible(false);
    setCurrentStudent(null);
    setCurrentFeeColumn(null);
  };

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

  const handleFeeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFeeValue(formatFeeValue(val));
  };

  const handleAppend000 = () => {
    const rawFee = feeValue.replace(/,/g, "");
    const newVal = rawFee + "000";
    setFeeValue(formatFeeValue(newVal));
  };

  const handleStudentNameClick = async (student: any) => {
    setStudentDetail(student);
    setAddingDiscount(false);
    setDiscountValue("");
    setDiscountDate(new Date());
    setDiscountReason("");

    const amt = student.totalAmount != null ? student.totalAmount.toString() : "1500000";
    setAmountToPay(formatFeeValue(amt));

    setStudentDetailModalVisible(true);
  };

  const totalWithoutCommas = (str: string) => parseInt(str.replace(/,/g,''),10)||0;

  const sumP = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i=1; i<=6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) sum += val;
    }
    return sum;
  };

  const sumPQ = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i=1; i<=3; i++) {
      const val = studentDetail[`PQ${i}`];
      if (val != null) sum += val;
    }
    return sum;
  };

  const getFilledLines = (prefix: string) => {
    if (!studentDetail) return [];
    const filled: number[] = [];
    const limit = prefix.startsWith("PQ")||prefix.startsWith("DQ")||prefix.startsWith("RQ") ? 3 : 6;
    for (let i=1; i<=limit; i++){
      const val = studentDetail[`${prefix}${i}`];
      if (val != null) filled.push(i);
    }
    if (filled.length < limit) {
      filled.push((filled[filled.length-1] || 0)+1);
    }
    return filled.sort((a,b)=>a-b);
  };

  const feeLines = studentDetail ? getFilledLines("P") : [];
  const discountLines = studentDetail ? getFilledLines("PQ") : [];

  const handleFeeEditClick = (i: number, type: string) => {
    setEditingFees({...editingFees, [`${type}${i}`]: true});
  };

  const handleFeeEditSaveDirect = async (col: string, value: any) => {
    const {error} = await supabase
      .from("student")
      .update({ [col]: value })
      .eq("id", studentDetail.id);

    if (error) {
      console.error("Error updating data:", error);
      return false;
    }

    const updatedStudent = {...studentDetail, [col]: value};
    setStudentDetail(updatedStudent);
    return true;
  };

  const handleFeeEditSave = async (i: number, type: string, newVal: string) => {
    const col = `${type}${i}`;
    let updateVal: any = newVal;
    if (type === "P" || type === "PQ") {
      const raw = newVal.replace(/,/g, "");
      updateVal = raw ? parseInt(raw,10) : null;
    }

    if (type === "D" || type === "DQ") {
      if (!updateVal) updateVal = null;
    }

    const success = await handleFeeEditSaveDirect(col, updateVal);
    if (!success) return;

    setEditingFees({...editingFees, [col]: false});
  };

  const handleStudentDetailModalClose = () => {
    setStudentDetailModalVisible(false);
    setStudentDetail(null);
  };

  const handleDiscountButton = () => {
    setAddingDiscount(!addingDiscount);
  };

  const handleSaveDiscount = async () => {
    if (!studentDetail) return;
    let slot: number | null = null;
    for (let i=1; i<=3; i++) {
      if (!studentDetail[`PQ${i}`]) {
        slot = i;
        break;
      }
    }

    if (!slot) {
      console.error("No more discount slots available.");
      return;
    }

    const raw = discountValue.replace(/,/g, "");
    const discNum = raw ? parseInt(raw,10) : null;
    const dDate = discountDate ? discountDate.toISOString().split('T')[0] : null;
    const dReason = discountReason.trim() || null;

    const {error} = await supabase
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
    const val = e.target.value;
    setDiscountValue(formatFeeValue(val));
  };

  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToPay(formatFeeValue(e.target.value));
  };

  const handleSaveAmountToPay = async () => {
    if (!studentDetail) return;
    const rawAmt = totalWithoutCommas(amountToPay);
    const {error} = await supabase
      .from("student")
      .update({ totalAmount: rawAmt })
      .eq("id", studentDetail.id);

    if (error) console.error("Error saving amount to pay:", error);

    const updatedStudent = {...studentDetail, totalAmount: rawAmt};
    setStudentDetail(updatedStudent);
  };

  const pTotal = sumP();
  const dTotal = sumPQ();
  const combinedTotal = pTotal + dTotal;

  const rawAmountToPay = totalWithoutCommas(amountToPay);
  const amountLeft = rawAmountToPay - (pTotal + dTotal);

  const clearInputValue = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (input) {
      input.value = "";
    }
  };

  const renderLine = (i: number, isDiscount=false) => {
    if (!studentDetail) return null;
    const prefix = isDiscount ? "Q" : "";
    const pCol = isDiscount ? `PQ${i}` : `P${i}`;
    const dCol = isDiscount ? `DQ${i}` : `D${i}`;
    const rCol = isDiscount ? `RQ${i}` : `R${i}`;

    const pVal = studentDetail[pCol] != null ? formatFeeValue(studentDetail[pCol].toString()) : "";
    const dVal = studentDetail[dCol] || "";
    const rVal = studentDetail[rCol] || "";

    const isEditingP = editingFees[pCol];
    const isEditingD = editingFees[dCol];
    const isEditingR = editingFees[rCol];

    const prefixTypeP = isDiscount?"PQ":"P";
    const prefixTypeD = isDiscount?"DQ":"D";
    const prefixTypeR = isDiscount?"RQ":"R";

    return (
      <div key={i} style={lineContainerStyle}>
        <div style={lineItemStyle}>
          <label style={lineLabelStyle}>{pCol}:</label>
          {isEditingP ? (
            <div style={{position:'relative', display:'flex', alignItems:'center'}}>
              <input
                defaultValue={pVal}
                style={detailInputStyle}
                id={`edit_${pCol}`}
                autoFocus
              />
              <button 
                onClick={()=>{clearInputValue(`edit_${pCol}`)}}
                style={clearButtonStyle}>x</button>
              <span style={editTickStyle} onClick={async()=>{
                const el = document.getElementById(`edit_${pCol}`) as HTMLInputElement;
                const newVal = el.value;
                await handleFeeEditSave(i,prefixTypeP,newVal);
              }}>✓</span>
            </div>
          ) : (
            <div style={feeDisplayStyle} onClick={()=>handleFeeEditClick(i,prefixTypeP)}>
              {pVal || '---'}
            </div>
          )}
        </div>
        <div style={lineItemStyle}>
          <label style={lineLabelStyle}>{dCol}:</label>
          {isEditingD ? (
            <div style={{position:'relative', display:'flex', alignItems:'center'}}>
              <DatePicker
                selected={dVal ? new Date(dVal) : null}
                onChange={async(date: Date|null)=>{
                  const dateString = date ? date.toISOString().split('T')[0] : null;
                  await handleFeeEditSave(i,prefixTypeD,dateString||"");
                }}
                isClearable
                placeholderText="Select date"
              />
            </div>
          ) : (
            <div style={feeDisplayStyle} onClick={()=>handleFeeEditClick(i,prefixTypeD)}>
              {dVal || '---'}
            </div>
          )}
        </div>
        <div style={lineItemStyle}>
          <label style={lineLabelStyle}>{rCol}:</label>
          {isEditingR ? (
            <div style={{position:'relative', display:'flex', alignItems:'center'}}>
              <input
                defaultValue={rVal}
                style={detailInputStyle}
                id={`edit_${rCol}`}
                autoFocus
              />
              <button 
                onClick={()=>{clearInputValue(`edit_${rCol}`)}}
                style={clearButtonStyle}>x</button>
              <span style={editTickStyle} onClick={async()=>{
                const el = document.getElementById(`edit_${rCol}`) as HTMLInputElement;
                const newVal = el.value;
                await handleFeeEditSave(i,prefixTypeR,newVal);
              }}>✓</span>
            </div>
          ) : (
            <div style={feeDisplayStyle} onClick={()=>handleFeeEditClick(i,prefixTypeR)}>
              {rVal || '---'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getFeeDataForChart = () => {
    if (!studentDetail) return {labels:[], datasets:[]};

    const fees: number[] = [];
    const feeLabels: string[] = [];
    for (let i=1; i<=6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) {
        feeLabels.push(`P${i}`);
        fees.push(val);
      }
    }

    const discounts: number[] = [];
    const discountLabels: string[] = [];
    for (let i=1; i<=3; i++){
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
          backgroundColor: "blue"
        },
        {
          label: "Discounts",
          data: [...Array(feeLabels.length).fill(null), ...discounts, null],
          backgroundColor: "green"
        },
        {
          label: "Amount Left to Pay",
          data: [...Array(feeLabels.length+discountLabels.length).fill(null), amountLeft],
          backgroundColor: "red"
        }
      ]
    };
  };

  return (
    <div style={styles.container as CSSProperties}>
      <h1 style={{...styles.header, textAlign:'center' as const}}>StudentFee</h1>
      <p style={{...styles.schoolName, textAlign:'center' as const}}>{userSchool}</p>

      <div style={{...styles.topSection, flexWrap:'wrap' as const, display:'flex', justifyContent:'space-between'}}>
        <div style={{...styles.filterContainer}}>
          <h2 style={{...styles.subHeader, textAlign:'center' as const}}>Filters</h2>
          <div style={{...styles.formGroup, flexDirection:'column' as const}}>
            <label style={{...styles.label}}>Class:</label>
            <select
              style={styles.dropdown as CSSProperties}
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
            >
              <option value="">All Classes</option>
              {classNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{...styles.formGroup, flexDirection:'column' as const}}>
            <label style={styles.label}>Section:</label>
            <select
              style={styles.dropdown as CSSProperties}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClassName}
            >
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{...styles.customMessageContainer, padding:'0 25px', display:'flex', alignItems:'flex-start'}}>
          <div style={{...styles.customMessageInnerContainer, display:'flex', flexDirection:'column' as const}}>
            <textarea
              placeholder="Type your custom message here..."
              value={tempCustMessage}
              onChange={(e) => setTempCustMessage(e.target.value)}
              style={{
                width:'100%',
                height:'160px',
                padding:'12px 15px',
                fontSize:'16px',
                color:'#000',
                border:'1px solid #2a2a2a',
                borderRadius:'8px',
                outline:'none',
                backgroundColor:'#f1f1f1',
                resize:'vertical' as const
              }}
            />
            <button
              onClick={handleCustomMessageSave}
              style={{
                marginTop:'10px',
                padding:'10px 0',
                fontSize:'18px',
                color:'#ffffff',
                backgroundColor:'#007bff',
                border:'none',
                borderRadius:'8px',
                cursor:'pointer',
                transition:'background-color 0.3s',
                width:'100%'
              }}
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
              marginTop: '-30px',
              marginRight: '20px',
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


      <div style={{
        marginTop:'50px',
        overflowX:'auto' as const,
        borderRadius:'10px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor:'#f9f9f9',
        padding:'20px'
      }}>
        {isLoading ? (
          <p style={{textAlign:'center' as const, color:'#555', fontSize:'18px'}}>Loading...</p>
        ) : Object.keys(studentsGrouped).length > 0 ? (
          <table style={{width:'100%', borderCollapse:'collapse' as const, minWidth:'1000px'}}>
            <thead>
              <tr>
                <th style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', backgroundColor:'#007bff', color:'white'}}>Student No</th>
                <th style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', backgroundColor:'#007bff', color:'white'}}>Guardian No</th>
                <th style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', backgroundColor:'#007bff', color:'white'}}>Student ID</th>
                <th style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', backgroundColor:'#007bff', color:'white'}}>Student Name</th>
                {classTimes.map((classTime) => (
                  hiddenColumns.includes(classTime) ? null : (
                  <th key={classTime} style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', backgroundColor:'#007bff', color:'white'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>handleColumnTitleClick(classTime)}>
                        {classTime}
                      </span>
                      <span
                        style={{
                          cursor:'pointer',
                          backgroundColor: filterNoTickCols.includes(classTime)?'red':'grey',
                          borderRadius:'50%',
                          width:'20px',
                          height:'20px',
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          color:'white',
                          fontWeight:'bold'
                        }}
                        onClick={()=>handleMinusClick(classTime)}
                      >
                        -
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
                  <tr style={{backgroundColor:'#f1f1f1'}}>
                    <td colSpan={4 + classTimes.length} style={{fontSize:'18px', fontWeight:'600', textAlign:'left' as const, padding:'10px', color:'#333'}}>
                      {group}
                    </td>
                  </tr>
                  {students
                  .filter((student) => {
                    // If filtering by absence, you'd implement logic. For now, it just returns true as per original code
                    return !isFilterByAbsence || true;
                  })
                  .map((student) => {
                    for (let ct of filterNoTickCols) {
                      const col = columnMap[ct];
                      if (student[col] === true) {
                        return null; 
                      }
                    }

                    return (
                    <tr key={student.id} style={{borderBottom:'1px solid #dddddd'}}>
                      <td style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', color:'#555'}}>
                        {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
                          <input
                            type="text"
                            name="studentNumber"
                            value={phoneValues.studentNumber}
                            onChange={handlePhoneChange}
                            onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
                            autoFocus
                            style={{width:'100%', padding:'5px 10px', fontSize:'14px', border:'1px solid #ccc', borderRadius:'4px', outline:'none'}}
                          />
                        ) : student.studentNumber ? (
                          <a
                            href={generateWhatsAppLink(student.studentNumber) || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{color:'#007bff', textDecoration:'underline', cursor:'pointer', backgroundColor:'#f9f9f9'}}
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

                      <td style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', color:'#555'}}>
                        {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
                          <input
                            type="text"
                            name="guardianNumber"
                            value={phoneValues.guardianNumber}
                            onChange={handlePhoneChange}
                            onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
                            autoFocus
                            style={{width:'100%', padding:'5px 10px', fontSize:'14px', border:'1px solid #ccc', borderRadius:'4px', outline:'none'}}
                          />
                        ) : student.guardianNumber ? (
                          <a
                            href={generateWhatsAppLink(student.guardianNumber) || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{color:'#007bff', textDecoration:'underline', cursor:'pointer', backgroundColor:'#f9f9f9'}}
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

                      <td style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', color:'#555'}}>{student.id}</td>
                      <td style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', color:'#555'}}>
                        <span style={{cursor:'pointer', textDecoration:'underline', color:'#007bff'}} onClick={()=>handleStudentNameClick(student)}>{student.studentName}</span>
                      </td>

                      {classTimes.map((classTime) => {
                        if (hiddenColumns.includes(classTime)) return null;
                        const col = columnMap[classTime];
                        const checked = student[col] === true;
                        return (
                          <td key={classTime} style={{border:'1px solid #dddddd', textAlign:'center' as const, padding:'12px', color:'#555', position:'relative' as const}}>
                            <label style={{position:'relative' as const, display:'inline-block', width:'20px', height:'20px', cursor:'pointer'}}>
                              <input
                                type="checkbox"
                                checked={checked || false}
                                onChange={()=>handleCheckboxChange(student, classTime)}
                                style={{opacity:0 as const, width:0, height:0, position:'absolute' as const}}
                              />
                              <span style={{
                                backgroundColor: checked ? '#ccffcc':'#ffffff',
                                borderColor: checked ? '#28a745':'#ccc',
                                color: checked ? '#28a745':'transparent',
                                position:'absolute' as const,
                                top:0,
                                left:0,
                                height:'20px',
                                width:'20px',
                                border:'1px solid #ccc',
                                borderRadius:'4px',
                                fontSize:'14px',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                boxSizing:'border-box' as const
                              }} title={checked?"Fee Paid":"Not Paid"}>
                                ✓
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  )})}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{textAlign:'center' as const, color:'#777', fontSize:'18px'}}>
            No students found for the selected filters.
          </p>
        )}
      </div>

      {/* Fee Modal */}
      {feeModalVisible && currentStudent && (
        <div style={{
          position:'fixed' as const,
          top:0,
          left:0,
          width:'100%',
          height:'100%',
          backgroundColor:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000
        }}>
          <div style={{
            backgroundColor:'#ffffff',
            padding:'20px',
            borderRadius:'10px',
            width:'80%',
            maxWidth:'800px',
            position:'relative' as const
          }}>
            <span style={{
              position:'absolute' as const,
              top:'10px',
              right:'20px',
              fontSize:'28px',
              fontWeight:'bold',
              cursor:'pointer',
              color:'#333'
            }} onClick={handleFeeModalClose}>&times;</span>
            <h2 style={{textAlign:'center' as const, marginBottom:'20px', color:'#333'}}>{currentStudent.studentName}</h2>
            <p style={{color:'#555', fontWeight:'bold', textAlign:'center' as const}}>{currentStudent.className} - {currentStudent.section}</p>
            <div style={{marginTop:'20px'}}>
              <input
                type="text"
                placeholder={`Student Fee ${currentFeeColumn}`}
                value={feeValue}
                onChange={handleFeeValueChange}
                style={{width:'100%', padding:'10px',marginBottom:'10px', boxSizing:'border-box'}}
              />
              <button style={{padding:'5px 10px', borderRadius:'10px', backgroundColor:'#e0e0e0', cursor:'pointer'}} onClick={handleAppend000}>x1000</button>
            </div>
            <div style={{marginTop:'10px'}}>
              <DatePicker
                selected={feeDate}
                onChange={(date:Date|null)=>setFeeDate(date||new Date())}
                isClearable
                placeholderText="Select date"
              />
            </div>
            <div style={{marginTop:'10px'}}>
              <input
                type="text"
                placeholder="Ref no"
                value={feeRefNo}
                onChange={(e)=>setFeeRefNo(e.target.value)}
                style={{width:'100%', padding:'10px', boxSizing:'border-box'}}
              />
            </div>
            <button
              onClick={handleFeeConfirm}
              style={{
                marginTop:'20px',
                width:'100%',
                padding:'10px',
                backgroundColor: allFeeFieldsFilled ? '#28a745' : 'lightgreen',
                border:'none',
                borderRadius:'5px',
                color:'#fff',
                cursor: allFeeFieldsFilled?'pointer':'not-allowed'
              }}
              disabled={!allFeeFieldsFilled}
            >
              Confirm
            </button>
            <button
              onClick={handleDeleteEntry}
              style={{
                marginTop:'10px',
                width:'100%',
                padding:'10px',
                backgroundColor:'#ff4d4d',
                border:'none',
                borderRadius:'5px',
                color:'#fff',
                cursor:'pointer'
              }}
            >
              Delete Entry
            </button>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {studentDetailModalVisible && studentDetail && (
        <div style={{
          position:'fixed' as const,
          top:0,
          left:0,
          width:'100%',
          height:'100%',
          backgroundColor:'rgba(0,0,0,0.5)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000
        }}>
          <div style={{
            backgroundColor:'#ffffff',
            padding:'20px',
            borderRadius:'10px',
            width:'80%',
            maxWidth:'800px',
            position:'relative' as const
          }}>
            <span style={{
              position:'absolute' as const,
              top:'10px',
              right:'20px',
              fontSize:'28px',
              fontWeight:'bold',
              cursor:'pointer',
              color:'#333'
            }} onClick={handleStudentDetailModalClose}>&times;</span>
            <h2 style={{color:'#333', marginBottom:'5px'}}>{studentDetail.studentName}</h2>
            <p style={{color:'#555', fontWeight:'bold', marginBottom:'20px'}}>{studentDetail.className} - {studentDetail.section}</p>

            <div style={{marginBottom:'20px', fontSize:'20px', fontWeight:'bold', display:'flex', alignItems:'center'}}>
              <span style={{color:'black'}}>{pTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              {dTotal > 0 && (
                <>
                  <span style={{margin:'0 10px'}}>+</span>
                  <span style={{color:'green'}}>{dTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  <span style={{margin:'0 10px'}}>=</span>
                  <span style={{color:'black'}}>{combinedTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                </>
              )}
            </div>

            {studentDetail && feeLines.map((i) => renderLine(i,false))}
            {studentDetail && discountLines.map((i) => renderLine(i,true))}

            {addingDiscount && (
              <div style={{marginTop:'20px'}}>
                <div style={lineContainerStyle}>
                  <div style={lineItemStyle}>
                    <label style={lineLabelStyle}>Discount:</label>
                    <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                      <input
                        type="text"
                        placeholder="Discount"
                        value={discountValue}
                        onChange={handleDiscountValueChange}
                        style={detailInputStyle}
                        id="discountInput"
                      />
                      <button 
                        onClick={()=>{clearInputValue('discountInput');setDiscountValue('')}}
                        style={clearButtonStyle}>x</button>
                    </div>
                  </div>
                  <div style={lineItemStyle}>
                    <label style={lineLabelStyle}>Date:</label>
                    <DatePicker
                      selected={discountDate}
                      onChange={(date:Date|null)=>setDiscountDate(date||new Date())}
                      isClearable
                      placeholderText="Select date"
                    />
                  </div>
                  <div style={lineItemStyle}>
                    <label style={lineLabelStyle}>Reason:</label>
                    <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                      <input
                        type="text"
                        placeholder="Reason"
                        value={discountReason}
                        onChange={(e)=>setDiscountReason(e.target.value)}
                        style={detailInputStyle}
                        id="reasonInput"
                      />
                      <button 
                        onClick={()=>{clearInputValue('reasonInput');setDiscountReason('')}}
                        style={clearButtonStyle}>x</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={addingDiscount ? handleSaveDiscount : handleDiscountButton}
              style={{
                marginTop:'20px',
                marginBottom:'20px',
                width:'100%',
                padding:'10px',
                backgroundColor: addingDiscount?'#28a745':'#008000',
                border:'none',
                borderRadius:'5px',
                color:'#fff',
                cursor:'pointer',
                fontWeight:'bold'
              }}
            >
              {addingDiscount ? 'Save Discount' : 'Discount'}
            </button>

            <div style={{display:'flex', alignItems:'center', marginBottom:'20px'}}>
              <input
                type="text"
                placeholder="Amount to Pay"
                value={amountToPay}
                onChange={handleAmountToPayChange}
                style={{...detailInputStyle, marginRight:'10px', backgroundColor:'#d3d3d3', color:'#000'}}
              />
              <button
                onClick={handleSaveAmountToPay}
                style={{
                  padding:'10px 20px',
                  backgroundColor:'#007bff',
                  color:'#fff',
                  border:'none',
                  borderRadius:'5px',
                  cursor:'pointer'
                }}
              >
                Save
              </button>
            </div>

            <div style={{marginTop:'20px'}}>
              <Bar data={getFeeDataForChart()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    color: "#e0e0e0",
  },
  schoolName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#b0b0b0",
  },
  topSection: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between"
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
  },
  formGroup: {
    marginBottom: "15px",
    display:'flex'
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
    marginRight: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "48%",
    minWidth: "280px",
  },
  customMessageInnerContainer: {
    width: "100%",
  }
};

const lineContainerStyle: CSSProperties = {
  display:'flex',
  justifyContent:'space-between',
  marginBottom:'20px',
  alignItems:'flex-start'
};

const lineItemStyle: CSSProperties = {
  display:'flex',
  flexDirection:'column' as const,
  width:'30%'
};

const lineLabelStyle: CSSProperties = {
  marginBottom:'5px',
  fontWeight:'bold',
  color:'#333'
};

const detailInputStyle: CSSProperties = {
  padding:'5px',
  border:'1px solid #ccc',
  borderRadius:'4px',
  width:'100%',
  color:'#333'
};

const feeDisplayStyle: CSSProperties = {
  border:'1px solid #ccc',
  borderRadius:'4px',
  padding:'5px',
  textAlign:'center' as const,
  cursor:'pointer',
  backgroundColor:'#f9f9f9',
  color:'#333'
};

const editTickStyle: CSSProperties = {
  marginLeft:'5px',
  cursor:'pointer',
  backgroundColor:'#ccc',
  borderRadius:'4px',
  padding:'0 5px',
  color:'#000',
  fontWeight:'bold'
};

const clearButtonStyle: CSSProperties = {
  marginLeft:'5px',
  cursor:'pointer',
  backgroundColor:'#ccc',
  border:'none',
  borderRadius:'50%',
  width:'20px',
  height:'20px',
  color:'#000',
  fontWeight:'bold',
  textAlign:'center' as const,
  lineHeight:'20px'
};

export default StudentFee;

// import React, { useState, useEffect, useRef } from "react";
// import supabase from "../../supabase";
// import { useNavigate } from "react-router-dom";
// import { Bar } from "react-chartjs-2";
// import 'chart.js/auto';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function StudentFee() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];

//   const [hiddenColumns, setHiddenColumns] = useState([]); 
//   const [filterNoTickCols, setFilterNoTickCols] = useState([]);

//   // Fee Modal States
//   const [feeModalVisible, setFeeModalVisible] = useState(false);
//   const [currentFeeColumn, setCurrentFeeColumn] = useState(null);
//   const [currentStudent, setCurrentStudent] = useState(null);
//   const [feeValue, setFeeValue] = useState("");
//   const [feeDate, setFeeDate] = useState(new Date());
//   const [feeRefNo, setFeeRefNo] = useState("");

//   // Student Detail Modal
//   const [studentDetailModalVisible, setStudentDetailModalVisible] = useState(false);
//   const [studentDetail, setStudentDetail] = useState(null);
//   const [editingFees, setEditingFees] = useState({});

//   // Discount States (PQ1-3 only)
//   const [addingDiscount, setAddingDiscount] = useState(false);
//   const [discountValue, setDiscountValue] = useState("");
//   const [discountDate, setDiscountDate] = useState(new Date());
//   const [discountReason, setDiscountReason] = useState("");

//   // Amount to Pay
//   const [amountToPay, setAmountToPay] = useState("1,500,000");

//   const columnMap = { C1: '1', C2: '2', C3: '3', C4: '4', C5: '5', C6: '6' };

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       fetchStudents(userSchool);
//     }
//     // eslint-disable-next-line
//   }, [selectedClassName]);

//   useEffect(() => {
//     fetchStudents(userSchool);
//     // eslint-disable-next-line
//   }, [selectedSection]);

//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       const { data: { user }, error: userError } = await supabase.auth.getUser();

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
//       fetchStudents(profileData.school);
//     } catch (error) {
//       console.error("Error fetching user data:", error.message);
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStudents = async (school) => {
//     try {
//       setIsLoading(true);
//       let query = supabase
//         .from("student")
//         .select("*")
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

//       const grouped = {};
//       data.forEach((student) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });

//       setStudentsGrouped(grouped);
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCustomMessageSave = async () => {
//     try {
//       if (!tempCustMessage.trim()) {
//         return;
//       }

//       const { data: { user }, error: userError } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("User not authenticated.");
//       }

//       const { error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);

//       if (error) throw error;

//       setCustMessage(tempCustMessage);
//     } catch (error) {
//       console.error("Error saving custom message:", error.message);
//     }
//   };

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

//   const handleEditClick = (studentId, type, currentValue) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePhoneChange = (e) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   const handlePhoneBlur = async (studentId, type) => {
//     try {
//       const updatedNumber = phoneValues[type].trim();
//       let column = "";

//       if (type === "studentNumber") column = "studentNumber";
//       else if (type === "guardianNumber") column = "guardianNumber";

//       const { error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       fetchStudents(userSchool);
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error) {
//       console.error("Error updating phone number:", error.message);
//     }
//   };

//   const handlePointerDown = (studentId, type, currentValue) => {
//     const longPressTimeout = setTimeout(() => {
//       handleEditClick(studentId, type, currentValue);
//     }, 500); 
//     inputRef.current = longPressTimeout;
//   };

//   const handlePointerUpOrLeave = () => {
//     clearTimeout(inputRef.current);
//   };

//   const formatFeeValue = (value) => {
//     const numeric = value.replace(/\D/g, "");
//     if (!numeric) return "";
//     return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const handleCheckboxChange = (student, classTime) => {
//     const col = columnMap[classTime];
//     setCurrentStudent(student);
//     setCurrentFeeColumn(col);

//     const pVal = student[`P${col}`] || "";
//     const dVal = student[`D${col}`] || "";
//     const rVal = student[`R${col}`] || "";

//     setFeeValue(pVal ? formatFeeValue(pVal.toString()) : "");
//     setFeeDate(dVal ? new Date(dVal) : new Date());
//     setFeeRefNo(rVal || "");
//     setFeeModalVisible(true);
//   };

//   const handleColumnTitleClick = (classTime) => {
//     if (hiddenColumns.includes(classTime)) {
//       setHiddenColumns(hiddenColumns.filter((c) => c !== classTime));
//     } else {
//       setHiddenColumns([...hiddenColumns, classTime]);
//     }
//   };

//   const handleMinusClick = (classTime) => {
//     if (filterNoTickCols.includes(classTime)) {
//       setFilterNoTickCols(filterNoTickCols.filter((c) => c !== classTime));
//     } else {
//       setFilterNoTickCols([...filterNoTickCols, classTime]);
//     }
//   };

//   const allFeeFieldsFilled = feeValue.trim() !== "" && feeRefNo.trim() !== "";

//   const handleFeeConfirm = async () => {
//     const pCol = `P${currentFeeColumn}`;
//     const dCol = `D${currentFeeColumn}`;
//     const rCol = `R${currentFeeColumn}`;
//     const chkCol = currentFeeColumn;

//     const rawFee = feeValue.replace(/,/g, "");
//     const feeNumber = parseInt(rawFee, 10) || null;
//     const dateVal = feeDate ? feeDate.toISOString().split('T')[0] : null;

//     const { error } = await supabase
//       .from("student")
//       .update({
//         [chkCol]: feeNumber !== null ? true : null,
//         [pCol]: feeNumber,
//         [dCol]: dateVal,
//         [rCol]: feeRefNo || null,
//       })
//       .eq("id", currentStudent.id);

//     if (error) console.error("Error saving fee data:", error);

//     setFeeModalVisible(false);
//     setCurrentStudent(null);
//     setCurrentFeeColumn(null);
//     fetchStudents(userSchool);
//   };

//   const handleFeeModalClose = () => {
//     setFeeModalVisible(false);
//     setCurrentStudent(null);
//     setCurrentFeeColumn(null);
//   };

//   const handleDeleteEntry = async () => {
//     const pCol = `P${currentFeeColumn}`;
//     const dCol = `D${currentFeeColumn}`;
//     const rCol = `R${currentFeeColumn}`;
//     const chkCol = currentFeeColumn;

//     const { error } = await supabase
//       .from("student")
//       .update({
//         [chkCol]: null,
//         [pCol]: null,
//         [dCol]: null,
//         [rCol]: null,
//       })
//       .eq("id", currentStudent.id);

//     if (error) console.error("Error deleting fee entry:", error);

//     setFeeModalVisible(false);
//     setCurrentStudent(null);
//     setCurrentFeeColumn(null);
//     fetchStudents(userSchool);
//   };

//   const handleFeeValueChange = (e) => {
//     const val = e.target.value;
//     setFeeValue(formatFeeValue(val));
//   };

//   const handleAppend000 = () => {
//     const rawFee = feeValue.replace(/,/g, "");
//     const newVal = rawFee + "000";
//     setFeeValue(formatFeeValue(newVal));
//   };

//   const handleStudentNameClick = async (student) => {
//     setStudentDetail(student);
//     setAddingDiscount(false);
//     setDiscountValue("");
//     setDiscountDate(new Date());
//     setDiscountReason("");

//     const amt = student.totalAmount != null ? student.totalAmount.toString() : "1500000";
//     setAmountToPay(formatFeeValue(amt));

//     setStudentDetailModalVisible(true);
//   };

//   const totalWithoutCommas = (str) => parseInt(str.replace(/,/g,''),10)||0;

//   const sumP = () => {
//     if (!studentDetail) return 0;
//     let sum = 0;
//     for (let i=1; i<=6; i++) {
//       const val = studentDetail[`P${i}`];
//       if (val != null) sum += val;
//     }
//     return sum;
//   };

//   const sumPQ = () => {
//     if (!studentDetail) return 0;
//     let sum = 0;
//     for (let i=1; i<=3; i++) {
//       const val = studentDetail[`PQ${i}`];
//       if (val != null) sum += val;
//     }
//     return sum;
//   };

//   const getFilledLines = (prefix, max=6) => {
//     if (!studentDetail) return [];
//     const filled = [];
//     const limit = prefix.startsWith("PQ")||prefix.startsWith("DQ")||prefix.startsWith("RQ") ? 3 : 6;
//     for (let i=1; i<=limit; i++){
//       const val = studentDetail[`${prefix}${i}`];
//       if (val != null) filled.push(i);
//     }
//     if (filled.length < limit) {
//       filled.push((filled[filled.length-1] || 0)+1);
//     }
//     return filled.sort((a,b)=>a-b);
//   };

//   const feeLines = studentDetail ? getFilledLines("P") : [];
//   const discountLines = studentDetail ? getFilledLines("PQ") : [];

//   const handleFeeEditClick = (i, type) => {
//     setEditingFees({...editingFees, [`${type}${i}`]: true});
//   };

//   const handleFeeEditSaveDirect = async (col, value) => {
//     const {error} = await supabase
//       .from("student")
//       .update({ [col]: value })
//       .eq("id", studentDetail.id);

//     if (error) {
//       console.error("Error updating data:", error);
//       return false;
//     }

//     const updatedStudent = {...studentDetail, [col]: value};
//     setStudentDetail(updatedStudent);
//     return true;
//   }

//   const handleFeeEditSave = async (i, type, newVal) => {
//     const col = `${type}${i}`;
//     let updateVal = newVal;
//     if (type === "P" || type === "PQ") {
//       const raw = newVal.replace(/,/g, "");
//       updateVal = raw ? parseInt(raw,10) : null;
//     }

//     if (type === "D" || type === "DQ") {
//       if (!updateVal) updateVal = null;
//     }

//     const success = await handleFeeEditSaveDirect(col, updateVal);
//     if (!success) return;

//     setEditingFees({...editingFees, [`${type}${i}`]: false});
//   };

//   const handleStudentDetailModalClose = () => {
//     setStudentDetailModalVisible(false);
//     setStudentDetail(null);
//   };

//   const handleDiscountButton = () => {
//     setAddingDiscount(!addingDiscount);
//   };

//   const handleSaveDiscount = async () => {
//     let slot = null;
//     for (let i=1; i<=3; i++) {
//       if (!studentDetail[`PQ${i}`]) {
//         slot = i;
//         break;
//       }
//     }

//     if (!slot) {
//       console.error("No more discount slots available.");
//       return;
//     }

//     const raw = discountValue.replace(/,/g, "");
//     const discNum = raw ? parseInt(raw,10) : null;
//     const dDate = discountDate ? discountDate.toISOString().split('T')[0] : null;
//     const dReason = discountReason.trim() || null;

//     const {error} = await supabase
//       .from("student")
//       .update({
//         [`PQ${slot}`]: discNum,
//         [`DQ${slot}`]: dDate,
//         [`RQ${slot}`]: dReason
//       })
//       .eq("id", studentDetail.id);

//     if (error) {
//       console.error("Error saving discount:", error);
//       return;
//     }

//     const updatedStudent = {
//       ...studentDetail,
//       [`PQ${slot}`]: discNum,
//       [`DQ${slot}`]: dDate,
//       [`RQ${slot}`]: dReason
//     };
//     setStudentDetail(updatedStudent);
//     setAddingDiscount(false);
//     setDiscountValue("");
//     setDiscountDate(new Date());
//     setDiscountReason("");
//   };

//   const handleDiscountValueChange = (e) => {
//     const val = e.target.value;
//     setDiscountValue(formatFeeValue(val));
//   };

//   const handleAmountToPayChange = (e) => {
//     setAmountToPay(formatFeeValue(e.target.value));
//   };

//   const handleSaveAmountToPay = async () => {
//     const rawAmt = totalWithoutCommas(amountToPay);
//     const {error} = await supabase
//       .from("student")
//       .update({ totalAmount: rawAmt })
//       .eq("id", studentDetail.id);

//     if (error) console.error("Error saving amount to pay:", error);

//     const updatedStudent = {...studentDetail, totalAmount: rawAmt};
//     setStudentDetail(updatedStudent);
//   };

//   const pTotal = sumP();
//   const dTotal = sumPQ();
//   const combinedTotal = pTotal + dTotal;

//   const rawAmountToPay = totalWithoutCommas(amountToPay);
//   const amountLeft = rawAmountToPay - (pTotal + dTotal);

//   const clearInputValue = (id) => {
//     const input = document.getElementById(id);
//     if (input) {
//       input.value = "";
//     }
//   };

//   const renderLine = (i, isDiscount=false) => {
//     if (!studentDetail) return null;
//     const pCol = isDiscount ? `PQ${i}` : `P${i}`;
//     const dCol = isDiscount ? `DQ${i}` : `D${i}`;
//     const rCol = isDiscount ? `RQ${i}` : `R${i}`;

//     const pVal = studentDetail[pCol] != null ? formatFeeValue(studentDetail[pCol].toString()) : "";
//     const dVal = studentDetail[dCol] || "";
//     const rVal = studentDetail[rCol] || "";

//     const isEditingP = editingFees[pCol];
//     const isEditingD = editingFees[dCol];
//     const isEditingR = editingFees[rCol];

//     return (
//       <div key={i} style={styles.lineContainer}>
//         {/* P/PQ line */}
//         <div style={styles.lineItem}>
//           <label style={styles.lineLabel}>{pCol}:</label>
//           {isEditingP ? (
//             <div style={{position:'relative', display:'flex', alignItems:'center'}}>
//               <input
//                 defaultValue={pVal}
//                 style={styles.detailInput}
//                 id={`edit_${pCol}`}
//                 autoFocus
//               />
//               <button 
//                 onClick={()=>{clearInputValue(`edit_${pCol}`)}}
//                 style={styles.clearButton}>x</button>
//               <span style={styles.editTick} onClick={async()=>{
//                 const newVal = document.getElementById(`edit_${pCol}`).value;
//                 await handleFeeEditSave(i,isDiscount?"PQ":"P",newVal);
//               }}>✓</span>
//             </div>
//           ) : (
//             <div style={styles.feeDisplay} onClick={()=>handleFeeEditClick(i,isDiscount?"PQ":"P")}>
//               {pVal || '---'}
//             </div>
//           )}
//         </div>
//         {/* D/DQ line */}
//         <div style={styles.lineItem}>
//           <label style={styles.lineLabel}>{dCol}:</label>
//           {isEditingD ? (
//             <div style={{position:'relative', display:'flex', alignItems:'center'}}>
//               <DatePicker
//                 selected={dVal ? new Date(dVal) : null}
//                 onChange={async(date)=>{
//                   const dateString = date ? date.toISOString().split('T')[0] : null;
//                   await handleFeeEditSave(i,isDiscount?"DQ":"D",dateString);
//                 }}
//                 isClearable
//                 placeholderText="Select date"
//                 style={styles.detailInput}
//               />
//               {/* For date, clearing is through the datepicker's own clear button */}
//               {/* Tick not needed as onChange updates immediately */}
//             </div>
//           ) : (
//             <div style={styles.feeDisplay} onClick={()=>handleFeeEditClick(i,isDiscount?"DQ":"D")}>
//               {dVal || '---'}
//             </div>
//           )}
//         </div>
//         {/* R/RQ line */}
//         <div style={styles.lineItem}>
//           <label style={styles.lineLabel}>{rCol}:</label>
//           {isEditingR ? (
//             <div style={{position:'relative', display:'flex', alignItems:'center'}}>
//               <input
//                 defaultValue={rVal}
//                 style={styles.detailInput}
//                 id={`edit_${rCol}`}
//                 autoFocus
//               />
//               <button 
//                 onClick={()=>{clearInputValue(`edit_${rCol}`)}}
//                 style={styles.clearButton}>x</button>
//               <span style={styles.editTick} onClick={async()=>{
//                 const newVal = document.getElementById(`edit_${rCol}`).value;
//                 await handleFeeEditSave(i,isDiscount?"RQ":"R",newVal);
//               }}>✓</span>
//             </div>
//           ) : (
//             <div style={styles.feeDisplay} onClick={()=>handleFeeEditClick(i,isDiscount?"RQ":"R")}>
//               {rVal || '---'}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const getFeeDataForChart = () => {
//     if (!studentDetail) return {labels:[], datasets:[]};

//     const fees = [];
//     const feeLabels = [];
//     for (let i=1; i<=6; i++) {
//       const val = studentDetail[`P${i}`];
//       if (val != null) {
//         feeLabels.push(`P${i}`);
//         fees.push(val);
//       }
//     }

//     const discounts = [];
//     const discountLabels = [];
//     for (let i=1; i<=3; i++){
//       const val = studentDetail[`PQ${i}`];
//       if (val != null) {
//         discountLabels.push(`Discount ${i}`);
//         discounts.push(val);
//       }
//     }

//     return {
//       labels: [...feeLabels, ...discountLabels, 'Amount Left'],
//       datasets: [
//         {
//           label: "Fees",
//           data: [...fees, ...Array(discountLabels.length).fill(null), null],
//           backgroundColor: "blue"
//         },
//         {
//           label: "Discounts",
//           data: [...Array(feeLabels.length).fill(null), ...discounts, null],
//           backgroundColor: "green"
//         },
//         {
//           label: "Amount Left to Pay",
//           data: [...Array(feeLabels.length+discountLabels.length).fill(null), amountLeft],
//           backgroundColor: "red"
//         }
//       ]
//     };
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>StudentFee</h1>
//       <p style={styles.schoolName}>{userSchool}</p>

//       <div style={styles.topSection}>
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
//               {classNames.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
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
//               {sections.map((sec) => (
//                 <option key={sec} value={sec}>
//                   {sec}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

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
//         <div style={{ position: "absolute", right: "0" }}>
//           <button
//             style={{
//               padding: "15px 30px",
//               marginTop: '-30px',
//               marginRight: '20px',
//               fontSize: "16px",
//               backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//               color: isFilterByAbsence ? "#fff" : "#000",
//               border: "none",
//               borderRadius: "20px",
//               cursor: "pointer",
//             }}
//             onClick={() => setIsFilterByAbsence((prev) => !prev)}
//           >
//             Filter by Absence
//           </button>
//         </div>
//       </div>


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
//                   hiddenColumns.includes(classTime) ? null : (
//                   <th key={classTime} style={styles.th}>
//                     <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
//                       <span style={{cursor:'pointer'}} onClick={()=>handleColumnTitleClick(classTime)}>
//                         {classTime}
//                       </span>
//                       <span
//                         style={{
//                           cursor:'pointer',
//                           backgroundColor: filterNoTickCols.includes(classTime)?'red':'grey',
//                           borderRadius:'50%',
//                           width:'20px',
//                           height:'20px',
//                           display:'flex',
//                           alignItems:'center',
//                           justifyContent:'center',
//                           color:'white',
//                           fontWeight:'bold'
//                         }}
//                         onClick={()=>handleMinusClick(classTime)}
//                       >
//                         -
//                       </span>
//                     </div>
//                   </th>
//                   )
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentsGrouped).map(([group, students]) => (
//                 <React.Fragment key={group}>
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                     </td>
//                   </tr>
//                   {students
//                   .filter(() => !isFilterByAbsence || true)
//                   .map((student) => {
//                     for (let ct of filterNoTickCols) {
//                       const col = columnMap[ct];
//                       if (student[col] === true) {
//                         return null; 
//                       }
//                     }

//                     return (
//                     <tr key={student.id} style={styles.tr}>
//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//                           <input
//                             type="text"
//                             name="studentNumber"
//                             value={phoneValues.studentNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.studentNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.studentNumber)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "studentNumber", student.studentNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.studentNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//                           <input
//                             type="text"
//                             name="guardianNumber"
//                             value={phoneValues.guardianNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.guardianNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.guardianNumber)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.guardianNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       <td style={styles.td}>{student.id}</td>
//                       <td style={styles.td}>
//                         <span style={{cursor:'pointer', textDecoration:'underline', color:'#007bff'}} onClick={()=>handleStudentNameClick(student)}>{student.studentName}</span>
//                       </td>

//                       {classTimes.map((classTime) => {
//                         if (hiddenColumns.includes(classTime)) return null;
//                         const col = columnMap[classTime];
//                         const checked = student[col] === true;
//                         return (
//                           <td key={classTime} style={styles.td}>
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={checked || false}
//                                 onChange={()=>handleCheckboxChange(student, classTime)}
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={{
//                                 ...styles.checkboxSquare,
//                                 backgroundColor: checked ? '#ccffcc':'#ffffff',
//                                 borderColor: checked ? '#28a745':'#ccc',
//                                 color: checked ? '#28a745':'transparent'
//                               }} title={checked?"Fee Paid":"Not Paid"}>
//                                 ✓
//                               </span>
//                             </label>
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   )})}
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

//       {/* No AlertModal and no alerts used now */}

//       {/* Fee Modal */}
//       {feeModalVisible && currentStudent && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={handleFeeModalClose}>&times;</span>
//             <h2 style={{...styles.modalTitle, color:'#333'}}>{currentStudent.studentName}</h2>
//             <p style={{color:'#555', fontWeight:'bold'}}>{currentStudent.className} - {currentStudent.section}</p>
//             <div style={{marginTop:'20px'}}>
//               <input
//                 type="text"
//                 placeholder={`Student Fee ${currentFeeColumn}`}
//                 value={feeValue}
//                 onChange={handleFeeValueChange}
//                 style={{width:'100%', padding:'10px',marginBottom:'10px', boxSizing:'border-box'}}
//               />
//               <button style={{padding:'5px 10px', borderRadius:'10px', backgroundColor:'#e0e0e0', cursor:'pointer'}} onClick={handleAppend000}>x1000</button>
//             </div>
//             <div style={{marginTop:'10px'}}>
//               <DatePicker selected={feeDate} onChange={(date)=>setFeeDate(date)} style={{width:'100%'}} />
//             </div>
//             <div style={{marginTop:'10px'}}>
//               <input
//                 type="text"
//                 placeholder="Ref no"
//                 value={feeRefNo}
//                 onChange={(e)=>setFeeRefNo(e.target.value)}
//                 style={{width:'100%', padding:'10px', boxSizing:'border-box'}}
//               />
//             </div>
//             <button
//               onClick={handleFeeConfirm}
//               style={{
//                 marginTop:'20px',
//                 width:'100%',
//                 padding:'10px',
//                 backgroundColor: allFeeFieldsFilled ? '#28a745' : 'lightgreen',
//                 border:'none',
//                 borderRadius:'5px',
//                 color:'#fff',
//                 cursor: allFeeFieldsFilled?'pointer':'not-allowed'
//               }}
//               disabled={!allFeeFieldsFilled}
//             >
//               Confirm
//             </button>
//             <button
//               onClick={handleDeleteEntry}
//               style={{
//                 marginTop:'10px',
//                 width:'100%',
//                 padding:'10px',
//                 backgroundColor:'#ff4d4d',
//                 border:'none',
//                 borderRadius:'5px',
//                 color:'#fff',
//                 cursor:'pointer'
//               }}
//             >
//               Delete Entry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Student Detail Modal */}
//       {studentDetailModalVisible && studentDetail && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={handleStudentDetailModalClose}>&times;</span>
//             <h2 style={{...styles.modalTitle, color:'#333', marginBottom:'5px'}}>{studentDetail.studentName}</h2>
//             <p style={{color:'#555', fontWeight:'bold', marginBottom:'20px'}}>{studentDetail.className} - {studentDetail.section}</p>

//             {/* Top totals */}
//             <div style={{marginBottom:'20px', fontSize:'20px', fontWeight:'bold', display:'flex', alignItems:'center'}}>
//               <span style={{color:'black'}}>{pTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
//               {dTotal > 0 && (
//                 <>
//                   <span style={{margin:'0 10px'}}>+</span>
//                   <span style={{color:'green'}}>{dTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
//                   <span style={{margin:'0 10px'}}>=</span>
//                   <span style={{color:'black'}}>{combinedTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
//                 </>
//               )}
//             </div>

//             {/* Fee lines */}
//             {studentDetail && feeLines.map((i) => renderLine(i,false))}

//             {/* Discount lines (PQ1-3 only) */}
//             {studentDetail && discountLines.map((i) => renderLine(i,true))}

//             {addingDiscount && (
//               <div style={{marginTop:'20px'}}>
//                 <div style={styles.lineContainer}>
//                   <div style={styles.lineItem}>
//                     <label style={styles.lineLabel}>Discount:</label>
//                     <div style={{position:'relative', display:'flex', alignItems:'center'}}>
//                       <input
//                         type="text"
//                         placeholder="Discount"
//                         value={discountValue}
//                         onChange={handleDiscountValueChange}
//                         style={styles.detailInput}
//                         id="discountInput"
//                       />
//                       <button 
//                         onClick={()=>{clearInputValue('discountInput');setDiscountValue('')}}
//                         style={styles.clearButton}>x</button>
//                     </div>
//                   </div>
//                   <div style={styles.lineItem}>
//                     <label style={styles.lineLabel}>Date:</label>
//                     <DatePicker
//                       selected={discountDate}
//                       onChange={(date)=>setDiscountDate(date)}
//                       isClearable
//                       placeholderText="Select date"
//                       style={styles.detailInput}
//                     />
//                   </div>
//                   <div style={styles.lineItem}>
//                     <label style={styles.lineLabel}>Reason:</label>
//                     <div style={{position:'relative', display:'flex', alignItems:'center'}}>
//                       <input
//                         type="text"
//                         placeholder="Reason"
//                         value={discountReason}
//                         onChange={(e)=>setDiscountReason(e.target.value)}
//                         style={styles.detailInput}
//                         id="reasonInput"
//                       />
//                       <button 
//                         onClick={()=>{clearInputValue('reasonInput');setDiscountReason('')}}
//                         style={styles.clearButton}>x</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={addingDiscount ? handleSaveDiscount : handleDiscountButton}
//               style={{
//                 marginTop:'20px',
//                 marginBottom:'20px',
//                 width:'100%',
//                 padding:'10px',
//                 backgroundColor: addingDiscount?'#28a745':'#008000',
//                 border:'none',
//                 borderRadius:'5px',
//                 color:'#fff',
//                 cursor:'pointer',
//                 fontWeight:'bold'
//               }}
//             >
//               {addingDiscount ? 'Save Discount' : 'Discount'}
//             </button>

//             {/* Amount to Pay */}
//             <div style={{display:'flex', alignItems:'center', marginBottom:'20px'}}>
//               <input
//                 type="text"
//                 placeholder="Amount to Pay"
//                 value={amountToPay}
//                 onChange={handleAmountToPayChange}
//                 style={{...styles.detailInput, marginRight:'10px', backgroundColor:'#d3d3d3', color:'#000'}}
//               />
//               <button
//                 onClick={handleSaveAmountToPay}
//                 style={{
//                   padding:'10px 20px',
//                   backgroundColor:'#007bff',
//                   color:'#fff',
//                   border:'none',
//                   borderRadius:'5px',
//                   cursor:'pointer'
//                 }}
//               >
//                 Save
//               </button>
//             </div>

//             <div style={{marginTop:'20px'}}>
//               <Bar data={getFeeDataForChart()} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
//     boxShadow: "0 2px 12px 1px #000",
//     width: "48%",
//     minWidth: "280px",
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
//     height: "160px",
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
//     width: "100%",
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
//     cursor: "pointer",
//   },
//   hiddenCheckbox: {
//     opacity: 0,
//     width: 0,
//     height: 0,
//     position:'absolute'
//   },
//   checkboxSquare: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     fontSize: "14px",
//     display:'flex',
//     alignItems:'center',
//     justifyContent:'center',
//     boxSizing:'border-box'
//   },
//   modalOverlay: {
//     position: "fixed",
//     top:0,
//     left:0,
//     width:"100%",
//     height:"100%",
//     backgroundColor:"rgba(0,0,0,0.5)",
//     display:"flex",
//     alignItems:"center",
//     justifyContent:"center",
//     zIndex:1000
//   },
//   modalContent: {
//     backgroundColor:"#ffffff",
//     padding:"20px",
//     borderRadius:"10px",
//     width:"80%",
//     maxWidth:"800px",
//     position:"relative",
//   },
//   closeModal: {
//     position:"absolute",
//     top:"10px",
//     right:"20px",
//     fontSize:"28px",
//     fontWeight:"bold",
//     cursor:"pointer",
//     color:'#333'
//   },
//   modalTitle: {
//     textAlign:"center",
//     marginBottom:"20px",
//   },
//   detailInput: {
//     padding:'5px', 
//     border:'1px solid #ccc', 
//     borderRadius:'4px',
//     width:'100%',
//     color:'#333'
//   },
//   feeDisplay: {
//     border:'1px solid #ccc',
//     borderRadius:'4px',
//     padding:'5px',
//     textAlign:'center',
//     cursor:'pointer',
//     backgroundColor:'#f9f9f9',
//     color:'#333'
//   },
//   lineContainer: {
//     display:'flex',
//     justifyContent:'space-between',
//     marginBottom:'20px',
//     alignItems:'flex-start',
//   },
//   lineItem: {
//     display:'flex',
//     flexDirection:'column',
//     width:'30%',
//   },
//   lineLabel: {
//     marginBottom:'5px',
//     fontWeight:'bold',
//     color:'#333'
//   },
//   editTick: {
//     marginLeft:'5px',
//     cursor:'pointer',
//     backgroundColor:'#ccc',
//     borderRadius:'4px',
//     padding:'0 5px',
//     color:'#000',
//     fontWeight:'bold'
//   },
//   clearButton: {
//     marginLeft:'5px',
//     cursor:'pointer',
//     backgroundColor:'#ccc',
//     border:'none',
//     borderRadius:'50%',
//     width:'20px',
//     height:'20px',
//     color:'#000',
//     fontWeight:'bold',
//     textAlign:'center',
//     lineHeight:'20px'
//   }
// };

// export default StudentFee;
