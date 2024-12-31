// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Button, Spinner, Alert } from "react-bootstrap"; // Import Bootstrap components
// import "./StudentGrade.css"; // Import the custom CSS
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { FaCoins } from 'react-icons/fa'; // Import the FaCoins icon

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend
// );

// // Interfaces
// interface Profile {
//   school: string;
//   password: string;
// }

// interface Student {
//   className: string;
//   section: string;
// }

// interface ClassData {
//   class: string;
//   sub1?: string;
//   sub2?: string;
//   sub3?: string;
//   sub4?: string;
//   sub5?: string;
//   sub6?: string;
//   sub7?: string;
//   sub8?: string;
//   sub9?: string;
//   sub10?: string;
//   sub11?: string;
//   sub12?: string;
//   sub13?: string;
//   sub14?: string;
//   sub15?: string;
// }

// interface GradeData {
//   subject: string;
//   classAverage: string;
//   average: string;
//   examMarks: { [key: string]: number | string };
//   classExamMarks?: { [key: string]: number };
// }

// interface ExamType {
//   examType: string;
//   columnNumber: number;
//   term: string;
//   weight: number;
// }

// const StudentGrade: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   // State Hooks
//   const [school, setSchool] = useState<string>("");
//   const [className, setClassName] = useState<string>("");
//   const [section, setSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
//   const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
//   const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
//   const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

//   const terms = ["First Term", "Second Term", "Retakes"];

//   // Helper Functions
//   const extractTerm = (examTypeName: string): string | null => {
//     const termRegex = /(First Term|Second Term|Retakes)/i;
//     const match = examTypeName.match(termRegex);
//     return match ? match[1] : null;
//   };

//   const handleGoldCoinClick = () => {
//     navigate("/student-fee");
//   };


//   const extractWeight = (examTypeName: string): number | null => {
//     const weightRegex = /\((\d+)\s*pts?\)/i;
//     const match = examTypeName.match(weightRegex);
//     return match ? parseInt(match[1], 10) : null;
//   };

//   const mapColumnNumberToColumnName = (columnNumber: number): string => {
//     return `${columnNumber}`; // Assuming columnNumber corresponds to column name as a string
//   };

//   // Data Fetching Effect
//   useEffect(() => {
//     if (!session) {
//       navigate("/login");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const userId = session.user.id;
//         console.log("Fetching profile for user ID:", userId);

//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("school, password")
//           .eq("id", userId)
//           .single();

//         if (profileError || !profile) {
//           throw new Error("Failed to fetch profile.");
//         }

//         console.log("Profile data:", profile);

//         const userSchool = profile.school;
//         const userPassword = profile.password;

//         setSchool(userSchool);

//         console.log("Fetching student info with school and studentID:", userSchool, userPassword);
//         const { data: student, error: studentError } = await supabase
//           .from("student")
//           .select("className, section")
//           .eq("school", userSchool)
//           .eq("studentID", userPassword)
//           .single();

//         if (studentError || !student) {
//           throw new Error("Failed to fetch student information.");
//         }

//         console.log("Student data:", student);
//         setClassName(student.className);
//         setSection(student.section);

//         console.log("Fetching class subjects:", student.className, userSchool);
//         const { data: classData, error: classError } = await supabase
//           .from("class")
//           .select(
//             "class, sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
//           )
//           .eq("class", student.className)
//           .eq("school", userSchool)
//           .single();

//         if (classError || !classData) {
//           throw new Error("Failed to fetch class subjects.");
//         }

//         console.log("Class data:", classData);

//         const fetchedSubjects: string[] = [];
//         for (let i = 1; i <= 15; i++) {
//           const sub = classData[`sub${i}` as keyof ClassData];
//           if (sub && sub.trim() !== "") {
//             fetchedSubjects.push(sub.trim());
//           }
//         }

//         console.log("Fetched subjects:", fetchedSubjects);
//         setSubjects(fetchedSubjects);
//         setSelectedProgressSubjects(fetchedSubjects);
//         setSelectedTotalAverageSubjects(fetchedSubjects);

//         console.log("Fetching exam types...");
//         const { data: examData, error: examError } = await supabase
//           .from("exam")
//           .select("examType, columnNumber")
//           .eq("school", userSchool)
//           .ilike("examType", `%${selectedTerm}%`); // Filter examTypes by selectedTerm

//         if (examError || !examData) {
//           throw new Error("Failed to fetch exam types.");
//         }

//         const examTypeList: ExamType[] = examData
//           .map((exam) => {
//             const term = extractTerm(exam.examType);
//             if (!term) return null;
//             const weight = extractWeight(exam.examType);
//             if (weight === null) return null;
//             return {
//               examType: exam.examType,
//               columnNumber: exam.columnNumber,
//               term: term,
//               weight: weight,
//             };
//           })
//           .filter((examType): examType is ExamType => examType !== null);

//         // **Removed Weight Validation Logic**

//         examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
//         setExamTypes(examTypeList);

//         console.log("Fetching subject sheet names...");
//         const { data: subjectTableData, error: subjectTableError } = await supabase
//           .from("subjects")
//           .select("subjectName, sheetName")
//           .eq("school", userSchool)
//           .in("subjectName", fetchedSubjects);

//         if (subjectTableError || !subjectTableData) {
//           throw new Error("Failed to fetch subject sheet names.");
//         }

//         const subjectSheetMap: { [key: string]: string } = {};
//         subjectTableData.forEach((item) => {
//           subjectSheetMap[item.subjectName] = item.sheetName;
//         });

//         console.log("Subject to Sheet Map:", subjectSheetMap);

//         const gradesData: GradeData[] = [];

//         for (const subject of fetchedSubjects) {
//           const sheetName = subjectSheetMap[subject];
//           if (!sheetName) {
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           const { data: sheetRow, error: sheetRowError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("studentID", profile.password)
//             .eq("school", userSchool)
//             .single();

//           if (sheetRowError || !sheetRow) {
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           // Since examTypes are global, no need to filter by subjectName
//           const subjectExams = examTypeList; // Use global examTypes

//           const examMarks: { [key: string]: number | string } = {};
//           const classExamMarks: { [key: string]: number } = {};

//           let sumWeightedMarks = 0;
//           let sumWeights = 0;
//           let markCount = 0;
//           let singleMark = 0;

//           subjectExams.forEach((exam) => {
//             const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//             const mark = sheetRow[columnName];

//             let numericMark: number | null = null;
//             if (typeof mark === "number") {
//               numericMark = mark;
//             } else if (typeof mark === "string") {
//               const parsed = parseFloat(mark);
//               if (!isNaN(parsed)) numericMark = parsed;
//             }

//             if (numericMark !== null) {
//               examMarks[exam.examType] = numericMark;
//               sumWeightedMarks += numericMark * exam.weight;
//               sumWeights += exam.weight;
//               markCount += 1;
//               if (markCount === 1) singleMark = numericMark;
//             } else {
//               examMarks[exam.examType] =
//                 mark !== null && mark !== undefined ? mark : "-";
//             }
//           });

//           let average: string;
//           if (markCount >= 2 && sumWeights > 0) {
//             average = (sumWeightedMarks / sumWeights).toFixed(1) + "";
//           } else if (markCount === 1) {
//             average = singleMark.toString();
//           } else {
//             average = "-";
//           }

//           const { data: otherStudentsData, error: otherStudentsError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("className", className)
//             .eq("school", userSchool)
//             .neq("studentID", profile.password);

//           let classAverage: string = "-";

//           if (!otherStudentsError && otherStudentsData && otherStudentsData.length > 0) {
//             subjectExams.forEach((exam) => {
//               const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//               const marks: number[] = [];

//               otherStudentsData.forEach((otherStudentRow) => {
//                 const otherMark = otherStudentRow[columnName];
//                 let numericMark: number | null = null;
//                 if (typeof otherMark === "number") numericMark = otherMark;
//                 else if (typeof otherMark === "string") {
//                   const parsed = parseFloat(otherMark);
//                   if (!isNaN(parsed)) numericMark = parsed;
//                 }

//                 if (numericMark !== null && numericMark !== undefined) {
//                   marks.push(numericMark);
//                 }
//               });

//               if (marks.length > 0) {
//                 const sum = marks.reduce((a, b) => a + b, 0);
//                 const avg = sum / marks.length;
//                 classExamMarks[exam.examType] = parseFloat(avg.toFixed(1));
//               } else {
//                 classExamMarks[exam.examType] = NaN;
//               }
//             });

//             const validClassAverages = Object.values(classExamMarks).filter(
//               (val) => !isNaN(val)
//             );
//             if (validClassAverages.length > 0) {
//               const avg =
//                 validClassAverages.reduce((a, b) => a + b, 0) /
//                 validClassAverages.length;
//               classAverage = avg.toFixed(1);
//             }
//           }

//           gradesData.push({
//             subject,
//             classAverage,
//             average,
//             examMarks,
//             classExamMarks,
//           });
//         }

//         console.log("Final Grades Data:", gradesData);
//         setGrades(gradesData);
//         setLoading(false);
//       } catch (err: any) {
//         console.error("Error during data fetching:", err);
//         setError(err.message || "An unexpected error occurred.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, navigate, selectedTerm, className, school]);

//   // Event Handlers
//   const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSubject(e.target.value);
//   };

//   const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTerm(e.target.value);
//   };

//   const filteredGrades = grades.filter((grade) => {
//     const subjectMatch = selectedSubject ? grade.subject === selectedSubject : true;
//     return subjectMatch;
//   });

//   const displayExamTypes = examTypes
//     .filter((exam) => exam.term === selectedTerm)
//     .sort((a, b) => a.columnNumber - b.columnNumber)
//     .map((exam) => exam.examType);

//   const calculateAverage = (grade: GradeData) => {
//     if (grade.average === "-") return "-";
//     return grade.average;
//   };

//   const handleProgressGraph = () => {
//     navigate("/progress-graph", {
//       state: {
//         selectedTerm,
//         selectedExamTypes: displayExamTypes, // Renamed for clarity
//         grades,
//       },
//     });
//   };

//   const handleTotalAverageGraph = () => {
//     navigate("/total-average", {
//       state: {
//         selectedSubjects: selectedTotalAverageSubjects,
//         showClassAverage: showTotalAverageClassAverage,
//         grades,
//         selectedTerm,
//       },
//     });
//   };

//   const getColor = (subject: string): string => {
//     const colors: { [key: string]: string } = {
//       Mathematics: "#FF6384",
//       English: "#36A2EB",
//       Science: "#FFCE56",
//       History: "#4BC0C0",
//       Geography: "#9966FF",
//       // Add more subjects and colors as needed
//     };
//     return colors[subject] || "#000000";
//   };

//   // Handle Graph Button Styling through Bootstrap
//   const graphButton = (type: string): string => {
//     return type === "Progress" ? "btn btn-success" : "btn btn-info";
//   };

//   // Rendering
//   if (loading) {
//     return (
//       <div className="loading-container d-flex flex-column align-items-center justify-content-center">
//         <Spinner animation="border" variant="primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container d-flex flex-column align-items-center justify-content-center">
//         <Alert variant="danger">{error}</Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container container">
//       <div className="card-custom mt-3">
//         <div className="d-flex">
//           {/* Back Button */}
//           <button
//             className="back-button"
//             onClick={() => navigate("/student")}
//             aria-label="Back"
//             style={{
//               backgroundColor: "transparent",
//               top: "10px",
//               border: "none",
//               color: "white",
//               fontSize: "24px",
//               cursor: "pointer",
//             }}
//           >
//             <i className="bi bi-chevron-left"></i>
//           </button>
//           <button
//                   className="coin-button position-relative z-index-200 end-0 translate-middle-x mt-1 rounded-circle shadow mb-3"
//                   onClick={handleGoldCoinClick}
//                   aria-label="Navigate to Student Fee Page"
//                 >
//                   <FaCoins className="coin-icon" />
//                 </button>
//           {/* Grade Card */}

//           {/* Title and Subheading */}
//           <div className="d-flex flex-column">
//             <h1 className="title mb-0">{school}</h1>
//             <h3 className="subheading">{className} - {section}</h3>
//           </div>
//         </div>

//         {/* Subject Selection */}
//         <div className="dropdown-container mb-2 mt-0 w-100">
//           {/* <label htmlFor="subject-select" className="form-label label">
//             Select Subject:
//           </label> */}
//           <select
//             id="subject-select"
//             value={selectedSubject}
//             onChange={handleSubjectChange}
//             className="form-select select"
//             style={{
//               backgroundColor: "#3a3a3a",
//               color: "white", // Ensures the text is readable
//               borderColor: "#3a3a3a", // Matches the background
//             }}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((subject) => (
//               <option key={subject} value={subject}>
//                 {subject}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Term Selection */}
//         <div className="dropdown-container mb-3 w-100">
//           {/* <label htmlFor="term-select" className="form-label label">
//             Select Term:
//           </label> */}
//           <select
//             id="term-select"
//             value={selectedTerm}
//             onChange={handleTermChange}
//             className="form-select select"
//             style={{
//               backgroundColor: "#3a3a3a",
//               color: "white", // Ensures the text is readable
//               borderColor: "#3a3a3a", // Matches the background
//             }}
//           >
//             {terms.map((term) => (
//               <option key={term} value={term}>
//                 {term}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Graph Buttons */}
//         <div className="graph-buttons-container d-flex flex-column w-100">
//           <Button
//             variant="success"
//             className="mb-2 w-100"
//             onClick={handleProgressGraph}
//           >
//             Progress 📈
//           </Button>
//           <Button
//             variant="info"
//             className="mb-0 w-100"
//             onClick={handleTotalAverageGraph}
//           >
//             Total Average 📊
//           </Button>
//         </div>

//         {/* Grades Table */}
//         <div className="table-container">
//           <table className="table table-bordered table-custom">
//             <thead className="table-primary">
//               <tr>
//                 <th className="th-custom">Subjects</th>
//                 <th className="th-custom">Total Class %</th>
//                 <th className="th-custom">Average %</th>
//                 {displayExamTypes.map((exam) => (
//                   <th key={exam} className="th-custom">
//                     {exam}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredGrades.map((grade) => (
//                 <tr key={grade.subject}>
//                   <td className="td-custom">{grade.subject}</td>
//                   <td className="td-custom">
//                     {grade.classAverage !== "-" ? `${grade.classAverage}%` : "-"}
//                   </td>
//                   <td className="td-custom">{calculateAverage(grade)}</td>
//                   {displayExamTypes.map((exam) => (
//                     <td key={exam} className="td-custom">
//                       {grade.examMarks[exam] !== undefined
//                         ? grade.examMarks[exam]
//                         : "-"}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentGrade;
// src/pages/student/StudentGrade.tsx
// File: StudentGrade.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap'; // Import Bootstrap components
import { FaCoins } from 'react-icons/fa'; // Import the FaCoins icon
import "./StudentGrade.css"; // Import the custom CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// ---- Interfaces ----
interface Profile {
  school: string;
  password: string;
}

interface Student {
  className: string;
  section: string;
}

interface ClassData {
  class: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  sub4?: string;
  sub5?: string;
  sub6?: string;
  sub7?: string;
  sub8?: string;
  sub9?: string;
  sub10?: string;
  sub11?: string;
  sub12?: string;
  sub13?: string;
  sub14?: string;
  sub15?: string;
}

interface GradeData {
  subject: string;
  classAverage: string;
  average: string;
  examMarks: { [key: string]: number | string };
  classExamMarks?: { [key: string]: number };
}

interface ExamType {
  examType: string;
  columnNumber: number;
  term: string;
  weight: number;
}

const StudentGrade: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  // State Hooks
  const [school, setSchool] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
  const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
  const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
  const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

  const terms = ["First Term", "Second Term", "Retakes"];

  // Helper Functions
  const extractTerm = (examTypeName: string): string | null => {
    const termRegex = /(First Term|Second Term|Retakes)/i;
    const match = examTypeName.match(termRegex);
    return match ? match[1] : null;
  };

  const handleGoldCoinClick = () => {
    navigate("/student-fee");
  };

  const extractWeight = (examTypeName: string): number | null => {
    const weightRegex = /\((\d+)\s*pts?\)/i;
    const match = examTypeName.match(weightRegex);
    return match ? parseInt(match[1], 10) : null;
  };

  const mapColumnNumberToColumnName = (columnNumber: number): string => {
    return `${columnNumber}`; // Assuming columnNumber corresponds to column name as a string
  };

  // Data Fetching Effect
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const userId = session.user.id;

        // 1) Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("school, password")
          .eq("id", userId)
          .single();

        if (profileError || !profile) {
          throw new Error("Failed to fetch profile.");
        }

        const userSchool = profile.school;
        const userPassword = profile.password;

        setSchool(userSchool);

        // 2) Fetch student info (className, section)
        const { data: student, error: studentError } = await supabase
          .from("student")
          .select("className, section")
          .eq("school", userSchool)
          .eq("studentID", userPassword)
          .single();

        if (studentError || !student) {
          throw new Error("Failed to fetch student information.");
        }

        setClassName(student.className);
        setSection(student.section);

        // 3) Fetch the list of subjects for this class
        const { data: classData, error: classError } = await supabase
          .from("class")
          .select(
            "class, sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
          )
          .eq("class", student.className)
          .eq("school", userSchool)
          .single();

        if (classError || !classData) {
          throw new Error("Failed to fetch class subjects.");
        }

        const fetchedSubjects: string[] = [];
        for (let i = 1; i <= 15; i++) {
          const sub = classData[`sub${i}` as keyof ClassData];
          if (sub && sub.trim() !== "") {
            fetchedSubjects.push(sub.trim());
          }
        }

        setSubjects(fetchedSubjects);
        setSelectedProgressSubjects(fetchedSubjects);
        setSelectedTotalAverageSubjects(fetchedSubjects);

        // 4) Fetch exam types that match the selected term
        const { data: examData, error: examError } = await supabase
          .from("exam")
          .select("examType, columnNumber")
          .eq("school", userSchool)
          .ilike("examType", `%${selectedTerm}%`); // Filter examTypes by selectedTerm

        if (examError || !examData) {
          throw new Error("Failed to fetch exam types.");
        }

        const examTypeList: ExamType[] = examData
          .map((exam) => {
            const term = extractTerm(exam.examType);
            if (!term) return null;
            const weight = extractWeight(exam.examType);
            if (weight === null) return null;
            return {
              examType: exam.examType,
              columnNumber: exam.columnNumber,
              term: term,
              weight: weight,
            };
          })
          .filter((examType): examType is ExamType => examType !== null);

        examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
        setExamTypes(examTypeList);

        // 5) Fetch subject sheet names
        const { data: subjectTableData, error: subjectTableError } = await supabase
          .from("subjects")
          .select("subjectName, sheetName")
          .eq("school", userSchool)
          .in("subjectName", fetchedSubjects);

        if (subjectTableError || !subjectTableData) {
          throw new Error("Failed to fetch subject sheet names.");
        }

        const subjectSheetMap: { [key: string]: string } = {};
        subjectTableData.forEach((item) => {
          subjectSheetMap[item.subjectName] = item.sheetName;
        });

        // 6) For each subject, fetch user’s row & compute user/class average
        const gradesData: GradeData[] = [];

        for (const subject of fetchedSubjects) {
          const sheetName = subjectSheetMap[subject];
          if (!sheetName) {
            gradesData.push({
              subject,
              classAverage: "-",
              average: "-",
              examMarks: {},
            });
            continue;
          }

          // Fetch user’s row in the subject’s sheet
          const { data: sheetRow, error: sheetRowError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("studentID", profile.password)
            .eq("school", userSchool)
            .single();

          if (sheetRowError || !sheetRow) {
            gradesData.push({
              subject,
              classAverage: "-",
              average: "-",
              examMarks: {},
            });
            continue;
          }

          // Use global examTypes
          const subjectExams = examTypeList; // Use global examTypes

          const examMarks: { [key: string]: number | string } = {};
          const classExamMarks: { [key: string]: number } = {};

          let sumWeightedMarks = 0;
          let sumWeights = 0;
          let markCount = 0;
          let singleMark = 0;

          subjectExams.forEach((exam) => {
            const columnName = mapColumnNumberToColumnName(exam.columnNumber);
            const mark = sheetRow[columnName];

            let numericMark: number | null = null;
            if (typeof mark === "number") {
              numericMark = mark;
            } else if (typeof mark === "string") {
              const parsed = parseFloat(mark);
              if (!isNaN(parsed)) numericMark = parsed;
            }

            if (numericMark !== null) {
              examMarks[exam.examType] = numericMark;
              sumWeightedMarks += numericMark * exam.weight;
              sumWeights += exam.weight;
              markCount += 1;
              if (markCount === 1) singleMark = numericMark;
            } else {
              examMarks[exam.examType] =
                mark !== null && mark !== undefined ? mark : "-";
            }
          });

          let average: string;
          if (markCount >= 2 && sumWeights > 0) {
            average = (sumWeightedMarks / sumWeights).toFixed(1) + "";
          } else if (markCount === 1) {
            average = singleMark.toString();
          } else {
            average = "-";
          }

          // Compute class average
          const { data: otherStudentsData, error: otherStudentsError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("className", className)
            .eq("school", userSchool)
            .neq("studentID", profile.password);

          let classAverage: string = "-";

          if (!otherStudentsError && otherStudentsData && otherStudentsData.length > 0) {
            subjectExams.forEach((exam) => {
              const columnName = mapColumnNumberToColumnName(exam.columnNumber);
              const marks: number[] = [];

              otherStudentsData.forEach((row) => {
                const otherMark = row[columnName];
                let numericMark: number | null = null;

                if (typeof otherMark === "number") {
                  numericMark = otherMark;
                } else if (typeof otherMark === "string") {
                  const parsed = parseFloat(otherMark);
                  if (!isNaN(parsed)) numericMark = parsed;
                }

                if (numericMark !== null && numericMark !== undefined) {
                  marks.push(numericMark);
                }
              });

              if (marks.length > 0) {
                const sum = marks.reduce((a, b) => a + b, 0);
                const avg = sum / marks.length;
                classExamMarks[exam.examType] = parseFloat(avg.toFixed(1));
              } else {
                classExamMarks[exam.examType] = NaN;
              }
            });

            const validClassAverages = Object.values(classExamMarks).filter(
              (val) => !isNaN(val)
            ) as number[];

            if (validClassAverages.length > 0) {
              const finalAvg =
                validClassAverages.reduce((a, b) => a + b, 0) /
                validClassAverages.length;
              classAverage = finalAvg.toFixed(1);
            }
          }

          gradesData.push({
            subject,
            classAverage,
            average: average,
            examMarks,
            classExamMarks,
          });
        }

        setGrades(gradesData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [session, navigate, selectedTerm, className, school]);

  // Event Handlers
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value);
  };

  const filteredGrades = grades.filter((grade) => {
    const subjectMatch = selectedSubject ? grade.subject === selectedSubject : true;
    return subjectMatch;
  });

  const displayExamTypes = examTypes
    .filter((exam) => exam.term === selectedTerm)
    .sort((a, b) => a.columnNumber - b.columnNumber)
    .map((exam) => exam.examType);

  const calculateAverage = (grade: GradeData) => {
    if (grade.average === "-") return "-";
    return `${grade.average}%`;
  };

  const handleProgressGraph = () => {
    navigate("/progress-graph", {
      state: {
        selectedTerm,
        selectedExamTypes: displayExamTypes, // Renamed for clarity
        grades,
      },
    });
  };

  const handleTotalAverageGraph = () => {
    navigate("/total-average", {
      state: {
        selectedSubjects: selectedTotalAverageSubjects,
        showClassAverage: showTotalAverageClassAverage,
        grades,
        selectedTerm,
      },
    });
  };

  const getColor = (subject: string): string => {
    const colors: { [key: string]: string } = {
      Mathematics: "#FF6384",
      English: "#36A2EB",
      Science: "#FFCE56",
      History: "#4BC0C0",
      Geography: "#9966FF",
      // Add more subjects and colors as needed
    };
    return colors[subject] || "#000000";
  };

  // Handle Graph Button Styling through Bootstrap
  const graphButton = (type: string): string => {
    return type === "Progress" ? "btn btn-success" : "btn btn-info";
  };

  // Rendering
  if (loading) {
    return (
      <div className="loading-container d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container d-flex flex-column align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="page-container container">
      <div className="card-custom mt-3">
        <div className="d-flex align-items-center justify-content-between header-container">
          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => navigate("/student")}
            aria-label="Back"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Header */}
          <div className="header-content text-center">
            <h1 className="title mb-0">{school}</h1>
            <h3 className="subheading">{className} - {section}</h3>
          </div>

          {/* Gold Coin Button */}
          <button
            className="coin-button"
            onClick={handleGoldCoinClick}
            aria-label="Navigate to Student Fee Page"
          >
            <FaCoins className="coin-icon" />
          </button>
        </div>

        {/* Subject Selection */}
        <div className="dropdown-container mb-2 w-100">
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="form-select select"
            style={{
              backgroundColor: "#3a3a3a",
              color: "white", // Ensures the text is readable
              borderColor: "#3a3a3a", // Matches the background
            }}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Term Selection */}
        <div className="dropdown-container mb-3 w-100">
          <select
            id="term-select"
            value={selectedTerm}
            onChange={handleTermChange}
            className="form-select select"
            style={{
              backgroundColor: "#3a3a3a",
              color: "white", // Ensures the text is readable
              borderColor: "#3a3a3a", // Matches the background
            }}
          >
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        {/* Graph Buttons */}
        <div className="graph-buttons-container d-flex flex-column w-100">
          <Button
            variant="success"
            className="mb-2 w-100"
            onClick={handleProgressGraph}
          >
            Progress 📈
          </Button>
          <Button
            variant="info"
            className="mb-0 w-100"
            onClick={handleTotalAverageGraph}
          >
            Total Average 📊
          </Button>
        </div>

        {/* Grades Table */}
        <div className="table-container">
          <table className="table table-bordered table-custom">
            <thead>
              <tr>
                <th className="th-custom">Subjects</th>
                <th className="th-custom">Total Class %</th>
                <th className="th-custom">Average %</th>
                {displayExamTypes.map((exam) => (
                  <th key={exam} className="th-custom">
                    {exam}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.subject}>
                  <td className="td-custom">{grade.subject}</td>
                  <td className="td-custom">
                    {grade.classAverage !== "-" ? `${grade.classAverage}%` : "-"}
                  </td>
                  <td className="td-custom">{calculateAverage(grade)}</td>
                  {displayExamTypes.map((exam) => (
                    <td key={exam} className="td-custom">
                      {grade.examMarks[exam] !== undefined
                        ? grade.examMarks[exam]
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentGrade;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import "./StudentGrade.css"; // Import the custom CSS

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend
// );

// // Interfaces
// interface Profile {
//   school: string;
//   password: string;
// }

// interface Student {
//   className: string;
//   section: string;
// }

// interface ClassData {
//   class: string;
//   sub1?: string;
//   sub2?: string;
//   sub3?: string;
//   sub4?: string;
//   sub5?: string;
//   sub6?: string;
//   sub7?: string;
//   sub8?: string;
//   sub9?: string;
//   sub10?: string;
//   sub11?: string;
//   sub12?: string;
//   sub13?: string;
//   sub14?: string;
//   sub15?: string;
// }

// interface Exam {
//   subjectName: string;
//   examType: string;
//   columnNumber: number;
// }

// interface Subject {
//   subjectName: string;
//   sheetName: string;
// }

// interface GradeData {
//   subject: string;
//   classAverage: string;
//   average: string;
//   examMarks: { [key: string]: number | string };
//   classExamMarks?: { [key: string]: number };
// }

// interface ExamType {
//   subjectName: string;
//   examType: string;
//   columnNumber: number;
//   term: string;
//   weight: number;
// }

// const StudentGrade: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   // State Hooks
//   const [school, setSchool] = useState<string>("");
//   const [className, setClassName] = useState<string>("");
//   const [section, setSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   const [progressModalVisible, setProgressModalVisible] = useState<boolean>(false);
//   const [totalAverageModalVisible, setTotalAverageModalVisible] = useState<boolean>(false);

//   const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
//   const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
//   const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
//   const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

//   const terms = ["First Term", "Second Term", "Retakes"];

//   // Helper Functions
//   const extractTerm = (examTypeName: string): string | null => {
//     const termRegex = /(First Term|Second Term|Retakes)/i;
//     const match = examTypeName.match(termRegex);
//     return match ? match[1] : null;
//   };

//   const extractWeight = (examTypeName: string): number | null => {
//     const weightRegex = /\((\d+)\s*pts?\)/i;
//     const match = examTypeName.match(weightRegex);
//     return match ? parseInt(match[1], 10) : null;
//   };

//   const mapColumnNumberToColumnName = (columnNumber: number): string => {
//     return `${columnNumber}`;
//   };

//   // Data Fetching Effect
//   useEffect(() => {
//     if (!session) {
//       navigate("/login");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const userId = session.user.id;
//         console.log("Fetching profile for user ID:", userId);

//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("school, password")
//           .eq("id", userId)
//           .single();

//         if (profileError || !profile) {
//           throw new Error("Failed to fetch profile.");
//         }

//         console.log("Profile data:", profile);

//         const userSchool = profile.school;
//         const userPassword = profile.password;

//         setSchool(userSchool);

//         console.log("Fetching student info with school and studentID:", userSchool, userPassword);
//         const { data: student, error: studentError } = await supabase
//           .from("student")
//           .select("className, section")
//           .eq("school", userSchool)
//           .eq("studentID", userPassword)
//           .single();

//         if (studentError || !student) {
//           throw new Error("Failed to fetch student information.");
//         }

//         console.log("Student data:", student);
//         setClassName(student.className);
//         setSection(student.section);

//         console.log("Fetching class subjects:", student.className, userSchool);
//         const { data: classData, error: classError } = await supabase
//           .from("class")
//           .select(
//             "class, sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
//           )
//           .eq("class", student.className)
//           .eq("school", userSchool)
//           .single();

//         if (classError || !classData) {
//           throw new Error("Failed to fetch class subjects.");
//         }

//         console.log("Class data:", classData);

//         const fetchedSubjects: string[] = [];
//         for (let i = 1; i <= 15; i++) {
//           const sub = classData[`sub${i}` as keyof ClassData];
//           if (sub && sub.trim() !== "") {
//             fetchedSubjects.push(sub.trim());
//           }
//         }

//         console.log("Fetched subjects:", fetchedSubjects);
//         setSubjects(fetchedSubjects);
//         setSelectedProgressSubjects(fetchedSubjects);
//         setSelectedTotalAverageSubjects(fetchedSubjects);

//         console.log("Fetching exam types...");
//         const { data: examData, error: examError } = await supabase
//           .from("exam")
//           .select("subjectName, examType, columnNumber")
//           .eq("school", userSchool)
//           .in("subjectName", fetchedSubjects);

//         if (examError || !examData) {
//           throw new Error("Failed to fetch exam types.");
//         }

//         const examTypeList: ExamType[] = examData
//           .map((exam) => {
//             const term = extractTerm(exam.examType);
//             if (!term) return null;
//             const weight = extractWeight(exam.examType);
//             if (weight === null) return null;
//             return {
//               subjectName: exam.subjectName,
//               examType: exam.examType,
//               columnNumber: exam.columnNumber,
//               term: term,
//               weight: weight,
//             };
//           })
//           .filter((examType): examType is ExamType => examType !== null);

//         const termWeightMap: { [key: string]: number } = {};
//         examTypeList.forEach((examType) => {
//           if (termWeightMap[examType.term]) {
//             termWeightMap[examType.term] += examType.weight;
//           } else {
//             termWeightMap[examType.term] = examType.weight;
//           }
//         });

//         const invalidTerms = Object.entries(termWeightMap).filter(
//           ([, totalWeight]) => totalWeight !== 100
//         );

//         if (invalidTerms.length > 0) {
//           console.error("Invalid weight distribution:", invalidTerms);
//           throw new Error(
//             "Invalid weight distribution. Weights must sum up to 100 points per term."
//           );
//         }

//         examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
//         setExamTypes(examTypeList);

//         console.log("Fetching subject sheet names...");
//         const { data: subjectTableData, error: subjectTableError } = await supabase
//           .from("subjects")
//           .select("subjectName, sheetName")
//           .eq("school", userSchool)
//           .in("subjectName", fetchedSubjects);

//         if (subjectTableError || !subjectTableData) {
//           throw new Error("Failed to fetch subject sheet names.");
//         }

//         const subjectSheetMap: { [key: string]: string } = {};
//         subjectTableData.forEach((item) => {
//           subjectSheetMap[item.subjectName] = item.sheetName;
//         });

//         console.log("Subject to Sheet Map:", subjectSheetMap);

//         const gradesData: GradeData[] = [];

//         for (const subject of fetchedSubjects) {
//           const sheetName = subjectSheetMap[subject];
//           if (!sheetName) {
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           const { data: sheetRow, error: sheetRowError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("studentID", profile.password)
//             .eq("school", userSchool)
//             .single();

//           if (sheetRowError || !sheetRow) {
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           const subjectExams = examTypeList.filter(
//             (exam) =>
//               exam.term === selectedTerm && exam.subjectName === subject
//           );

//           const examMarks: { [key: string]: number | string } = {};
//           const classExamMarks: { [key: string]: number } = {};

//           let sumWeightedMarks = 0;
//           let sumWeights = 0;
//           let markCount = 0;
//           let singleMark = 0;

//           subjectExams.forEach((exam) => {
//             const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//             const mark = sheetRow[columnName];

//             let numericMark: number | null = null;
//             if (typeof mark === "number") {
//               numericMark = mark;
//             } else if (typeof mark === "string") {
//               const parsed = parseFloat(mark);
//               if (!isNaN(parsed)) numericMark = parsed;
//             }

//             if (numericMark !== null) {
//               examMarks[exam.examType] = numericMark;
//               sumWeightedMarks += numericMark * exam.weight;
//               sumWeights += exam.weight;
//               markCount += 1;
//               if (markCount === 1) singleMark = numericMark;
//             } else {
//               examMarks[exam.examType] =
//                 mark !== null && mark !== undefined ? mark : "-";
//             }
//           });

//           let average: string;
//           if (markCount >= 2 && sumWeights > 0) {
//             average = (sumWeightedMarks / sumWeights).toFixed(1) + "";
//           } else if (markCount === 1) {
//             average = singleMark.toString();
//           } else {
//             average = "-";
//           }

//           const { data: otherStudentsData, error: otherStudentsError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("className", className)
//             .eq("school", userSchool)
//             .neq("studentID", profile.password);

//           let classAverage: string = "-";

//           if (!otherStudentsError && otherStudentsData && otherStudentsData.length > 0) {
//             subjectExams.forEach((exam) => {
//               const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//               const marks: number[] = [];

//               otherStudentsData.forEach((otherStudentRow) => {
//                 const otherMark = otherStudentRow[columnName];
//                 let numericMark: number | null = null;
//                 if (typeof otherMark === "number") numericMark = otherMark;
//                 else if (typeof otherMark === "string") {
//                   const parsed = parseFloat(otherMark);
//                   if (!isNaN(parsed)) numericMark = parsed;
//                 }

//                 if (numericMark !== null && numericMark !== undefined) {
//                   marks.push(numericMark);
//                 }
//               });

//               if (marks.length > 0) {
//                 const sum = marks.reduce((a, b) => a + b, 0);
//                 const avg = sum / marks.length;
//                 classExamMarks[exam.examType] = parseFloat(avg.toFixed(1));
//               } else {
//                 classExamMarks[exam.examType] = NaN;
//               }
//             });

//             const validClassAverages = Object.values(classExamMarks).filter(
//               (val) => !isNaN(val)
//             );
//             if (validClassAverages.length > 0) {
//               const avg =
//                 validClassAverages.reduce((a, b) => a + b, 0) /
//                 validClassAverages.length;
//               classAverage = avg.toFixed(1);
//             }
//           }

//           gradesData.push({
//             subject,
//             classAverage,
//             average,
//             examMarks,
//             classExamMarks,
//           });
//         }

//         console.log("Final Grades Data:", gradesData);
//         setGrades(gradesData);
//         setLoading(false);
//       } catch (err: any) {
//         console.error("Error during data fetching:", err);
//         setError(err.message || "An unexpected error occurred.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, navigate, selectedTerm, className, school]);

//   // Event Handlers
//   const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSubject(e.target.value);
//   };

//   const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTerm(e.target.value);
//   };

//   const filteredGrades = grades.filter((grade) => {
//     const subjectMatch = selectedSubject ? grade.subject === selectedSubject : true;
//     return subjectMatch;
//   });

//   const displayExamTypes = examTypes
//     .filter((exam) => exam.term === selectedTerm)
//     .sort((a, b) => a.columnNumber - b.columnNumber)
//     .map((exam) => exam.examType);

//   const calculateAverage = (grade: GradeData) => {
//     if (grade.average === "-") return "-";
//     return grade.average;
//   };

//   const openProgressModal = () => {
//     setProgressModalVisible(true);
//   };

//   const closeProgressModal = () => {
//     setProgressModalVisible(false);
//   };

//   const openTotalAverageModal = () => {
//     setTotalAverageModalVisible(true);
//   };

//   const closeTotalAverageModal = () => {
//     setTotalAverageModalVisible(false);
//   };

//   const handleProgressSubjectToggle = (subject: string) => {
//     setSelectedProgressSubjects((prev) =>
//       prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
//     );
//   };

//   const handleTotalAverageSubjectToggle = (subject: string) => {
//     setSelectedTotalAverageSubjects((prev) =>
//       prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
//     );
//   };

//   const prepareProgressChartData = () => {
//     const allExamTypes = displayExamTypes;
//     const datasets = filteredGrades
//       .filter((grade) => selectedProgressSubjects.includes(grade.subject))
//       .map((grade) => {
//         const data = allExamTypes.map((examType) =>
//           typeof grade.examMarks[examType] === "number"
//             ? grade.examMarks[examType]
//             : null
//         );

//         const color = getColor(grade.subject);
//         return {
//           label: grade.subject,
//           data: data,
//           borderColor: color,
//           backgroundColor: color,
//           fill: false,
//           tension: 0.1,
//           pointRadius: 3,
//         };
//       });

//     if (showProgressClassAverage) {
//       const selectedSubjectsData = filteredGrades.filter((grade) =>
//         selectedProgressSubjects.includes(grade.subject)
//       );

//       const classAverageData = allExamTypes.map((examType) => {
//         const values: number[] = [];
//         selectedSubjectsData.forEach((grade) => {
//           if (grade.classExamMarks && !isNaN(grade.classExamMarks[examType])) {
//             values.push(grade.classExamMarks[examType]);
//           }
//         });
//         if (values.length > 0) {
//           return values.reduce((a, b) => a + b, 0) / values.length;
//         } else {
//           return null;
//         }
//       });

//       datasets.push({
//         label: "Class Average",
//         data: classAverageData,
//         borderColor: "#6c757d",
//         backgroundColor: "#6c757d",
//         fill: false,
//         tension: 0.1,
//         pointRadius: 3,
//       });
//     }

//     return {
//       labels: allExamTypes,
//       datasets: datasets,
//     };
//   };

//   const prepareTotalAverageChartData = () => {
//     const subjectsToDisplay = filteredGrades.filter((grade) =>
//       selectedTotalAverageSubjects.includes(grade.subject)
//     );

//     const labels = subjectsToDisplay.map((grade) => grade.subject);
//     const studentAverages = subjectsToDisplay.map((grade) =>
//       grade.average !== "-" ? parseFloat(grade.average) : 0
//     );
//     const classAverages = subjectsToDisplay.map((grade) =>
//       grade.classAverage !== "-" ? parseFloat(grade.classAverage) : 0
//     );

//     const datasets: any[] = [
//       {
//         label: "Student Average",
//         data: studentAverages,
//         backgroundColor: "#28a745",
//       },
//     ];

//     if (showTotalAverageClassAverage) {
//       datasets.push({
//         label: "Class Average",
//         data: classAverages,
//         backgroundColor: "#17a2b8",
//       });
//     }

//     return {
//       labels: labels,
//       datasets: datasets,
//     };
//   };

//   const getColor = (subject: string): string => {
//     const colors: { [key: string]: string } = {
//       Mathematics: "#FF6384",
//       English: "#36A2EB",
//       Science: "#FFCE56",
//       History: "#4BC0C0",
//       Geography: "#9966FF",
//     };
//     return colors[subject] || "#000000";
//   };

//   // Handle Graph Button Styling through Bootstrap
//   const graphButton = (type: string): string => {
//     return type === "Progress" ? "btn btn-success me-2" : "btn btn-info";
//   };

//   // Rendering
//   if (loading) {
//     return (
//       <div className="loading-container d-flex flex-column align-items-center justify-content-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container d-flex flex-column align-items-center justify-content-center">
//         <p className="error-message">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container container">
//       {/* Back Button */}
//       <button
//         className="back-button btn btn-secondary"
//         onClick={() => navigate("/student")}
//         aria-label="Back"
//       >
//         &#9664;
//       </button>

//       {/* Graph Buttons */}
//       <div className="graph-buttons-container d-flex flex-column align-items-start">
//         <button
//           className={graphButton("Progress")}
//           onClick={openProgressModal}
//         >
//           Progress 📈
//         </button>
//         <button
//           className={graphButton("Total Average")}
//           onClick={openTotalAverageModal}
//         >
//           Total Average 📊
//         </button>
//       </div>

//       {/* Grade Card */}
//       <div className="card card-custom mt-5">
//         <div className="card-body">
//           <h1 className="title">{school}</h1>
//           <h3 className="subheading">
//             {className} - {section}
//           </h3>

//           {/* Subject Selection */}
//           <div className="dropdown-container mb-3">
//             <label htmlFor="subject-select" className="form-label label">
//               Select Subject:
//             </label>
//             <select
//               id="subject-select"
//               value={selectedSubject}
//               onChange={handleSubjectChange}
//               className="form-select select"
//             >
//               <option value="">All Subjects</option>
//               {subjects.map((subject) => (
//                 <option key={subject} value={subject}>
//                   {subject}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Term Selection */}
//           <div className="dropdown-container mb-3">
//             <label htmlFor="term-select" className="form-label label">
//               Select Term:
//             </label>
//             <select
//               id="term-select"
//               value={selectedTerm}
//               onChange={handleTermChange}
//               className="form-select select"
//             >
//               {terms.map((term) => (
//                 <option key={term} value={term}>
//                   {term}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Grades Table */}
//           <div className="table-container">
//             <table className="table table-bordered table-custom">
//               <thead className="table-primary">
//                 <tr>
//                   <th className="th-custom">Subjects</th>
//                   <th className="th-custom">Total Class %</th>
//                   <th className="th-custom">Average %</th>
//                   {displayExamTypes.map((exam) => (
//                     <th key={exam} className="th-custom">
//                       {exam}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredGrades.map((grade) => (
//                   <tr key={grade.subject}>
//                     <td className="td-custom">{grade.subject}</td>
//                     <td className="td-custom">
//                       {grade.classAverage !== "-" ? `${grade.classAverage}%` : "-"}
//                     </td>
//                     <td className="td-custom">{calculateAverage(grade)}</td>
//                     {displayExamTypes.map((exam) => (
//                       <td key={exam} className="td-custom">
//                         {grade.examMarks[exam] !== undefined
//                           ? grade.examMarks[exam]
//                           : "-"}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Progress Modal */}
//       {progressModalVisible && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <span
//               className="close-modal"
//               onClick={closeProgressModal}
//               aria-label="Close"
//             >
//               &times;
//             </span>
//             <h2 className="modal-title">Progress Graph</h2>

//             {/* Term Selection in Modal */}
//             <div className="dropdown-container mb-3">
//               <label htmlFor="modal-term-select" className="form-label label">
//                 Select Term:
//               </label>
//               <select
//                 id="modal-term-select"
//                 value={selectedTerm}
//                 onChange={handleTermChange}
//                 className="form-select select"
//               >
//                 {terms.map((term) => (
//                   <option key={term} value={term}>
//                     {term}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Legend Buttons */}
//             <div className="legend-container mb-4">
//               {subjects.map((subject) => (
//                 <button
//                   key={subject}
//                   className={`legend-button d-flex align-items-center ${
//                     selectedProgressSubjects.includes(subject) ? "active" : ""
//                   }`}
//                   onClick={() => handleProgressSubjectToggle(subject)}
//                   style={{
//                     backgroundColor: selectedProgressSubjects.includes(subject)
//                       ? getColor(subject)
//                       : "#e9ecef",
//                     color: selectedProgressSubjects.includes(subject)
//                       ? "white"
//                       : "black",
//                   }}
//                 >
//                   <span
//                     className="color-box me-2"
//                     style={{ backgroundColor: getColor(subject) }}
//                   ></span>
//                   {subject}
//                 </button>
//               ))}

//               <button
//                 className={`legend-button d-flex align-items-center ${
//                   showProgressClassAverage ? "active" : ""
//                 }`}
//                 onClick={() => setShowProgressClassAverage((prev) => !prev)}
//                 style={{
//                   backgroundColor: showProgressClassAverage
//                     ? "#6c757d"
//                     : "#e9ecef",
//                   color: showProgressClassAverage ? "white" : "black",
//                 }}
//               >
//                 <span
//                   className="color-box me-2"
//                   style={{ backgroundColor: "#6c757d" }}
//                 ></span>
//                 Class Average
//               </button>
//             </div>

//             {/* Progress Line Chart */}
//             <Line
//               data={prepareProgressChartData()}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: "bottom",
//                   },
//                   tooltip: {
//                     mode: "index",
//                     intersect: false,
//                   },
//                 },
//                 interaction: {
//                   mode: "nearest",
//                   axis: "x",
//                   intersect: false,
//                 },
//                 scales: {
//                   x: {
//                     title: {
//                       display: true,
//                       text: "Exam Type",
//                     },
//                   },
//                   y: {
//                     title: {
//                       display: true,
//                       text: "Average Marks",
//                     },
//                     min: 0,
//                     max: 100,
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Total Average Modal */}
//       {totalAverageModalVisible && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <span
//               className="close-modal"
//               onClick={closeTotalAverageModal}
//               aria-label="Close"
//             >
//               &times;
//             </span>
//             <h2 className="modal-title">Total Average Graph</h2>

//             {/* Legend Buttons */}
//             <div className="legend-container mb-4">
//               {subjects.map((subject) => (
//                 <button
//                   key={subject}
//                   className={`legend-button d-flex align-items-center ${
//                     selectedTotalAverageSubjects.includes(subject) ? "active" : ""
//                   }`}
//                   onClick={() => handleTotalAverageSubjectToggle(subject)}
//                   style={{
//                     backgroundColor: selectedTotalAverageSubjects.includes(subject)
//                       ? getColor(subject)
//                       : "#e9ecef",
//                     color: selectedTotalAverageSubjects.includes(subject)
//                       ? "white"
//                       : "black",
//                   }}
//                 >
//                   <span
//                     className="color-box me-2"
//                     style={{ backgroundColor: getColor(subject) }}
//                   ></span>
//                   {subject}
//                 </button>
//               ))}

//               <button
//                 className={`legend-button d-flex align-items-center ${
//                   showTotalAverageClassAverage ? "active" : ""
//                 }`}
//                 onClick={() =>
//                   setShowTotalAverageClassAverage((prev) => !prev)
//                 }
//                 style={{
//                   backgroundColor: showTotalAverageClassAverage
//                     ? "#6c757d"
//                     : "#e9ecef",
//                   color: showTotalAverageClassAverage ? "white" : "black",
//                 }}
//               >
//                 <span
//                   className="color-box me-2"
//                   style={{ backgroundColor: "#6c757d" }}
//                 ></span>
//                 Class Average
//               </button>
//             </div>

//             {/* Total Average Bar Chart */}
//             <Bar
//               data={prepareTotalAverageChartData()}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: "bottom",
//                   },
//                   tooltip: {
//                     enabled: true,
//                   },
//                 },
//                 scales: {
//                   x: {
//                     title: {
//                       display: true,
//                       text: "Subjects",
//                     },
//                   },
//                   y: {
//                     title: {
//                       display: true,
//                       text: "Average Marks (%)",
//                     },
//                     min: 0,
//                     max: 100,
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentGrade;
