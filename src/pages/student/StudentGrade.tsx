
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

// // Define TypeScript interfaces for the data structures
// interface Profile {
//   school: string;
//   password: string; // Assuming 'password' is used as 'studentID'
// }

// interface Student {
//   className: string;
//   section: string;
// }

// interface ClassData {
//   class: string; // Ensure this matches your Supabase 'class' column
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
//   classAverage: string; // Single final average for reference
//   average: string;
//   examMarks: { [key: string]: number | string };
//   classExamMarks?: { [key: string]: number }; // New field for class averages per examType
// }

// interface ExamType {
//   subjectName: string; // Included subjectName
//   examType: string;
//   columnNumber: number;
//   term: string;
//   weight: number; // Added weight parsed from examType name
// }

// const StudentGrade: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession(); // Assuming SessionContext provides 'session'

//   // State variables
//   const [school, setSchool] = useState<string>("");
//   const [className, setClassName] = useState<string>("");
//   const [section, setSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]); // Includes term and subjectName
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term"); // Default to "First Term"
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   // Modal state variables
//   const [progressModalVisible, setProgressModalVisible] = useState<boolean>(false);
//   const [totalAverageModalVisible, setTotalAverageModalVisible] = useState<boolean>(false);

//   // Chart state variables
//   const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
//   const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
//   const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
//   const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

//   // List of terms
//   const terms = ["First Term", "Second Term", "Retakes"];

//   // Helper function to extract term from examType name
//   const extractTerm = (examTypeName: string): string | null => {
//     const termRegex = /(First Term|Second Term|Retakes)/i;
//     const match = examTypeName.match(termRegex);
//     return match ? match[1] : null;
//   };

//   // Helper function to extract weight from examType name
//   const extractWeight = (examTypeName: string): number | null => {
//     const weightRegex = /\((\d+)\s*pts?\)/i;
//     const match = examTypeName.match(weightRegex);
//     return match ? parseInt(match[1], 10) : null;
//   };

//   // Helper function to map columnNumber to column name in the sheet
//   const mapColumnNumberToColumnName = (columnNumber: number): string => {
//     return `${columnNumber}`;
//   };

//   // Fetch all necessary data on component mount and when selections change
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

//         // 1. Fetch profile
//         const { data: profile, error: profileError } = await supabase
//           .from<Profile>("profiles")
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

//         // 2. Fetch student information
//         console.log(
//           "Fetching student information for school:",
//           userSchool,
//           "and studentID:",
//           userPassword
//         );
//         const { data: student, error: studentError } = await supabase
//           .from<Student>("student")
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

//         // 3. Fetch class subjects (sub1 to sub15)
//         console.log(
//           "Fetching class subjects for class:",
//           student.className,
//           "and school:",
//           userSchool
//         );
//         const { data: classData, error: classError } = await supabase
//           .from<ClassData>("class")
//           .select(
//             "class, sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
//           )
//           .eq("class", student.className) // Matching 'class' column with 'className'
//           .eq("school", userSchool)
//           .single();

//         if (classError || !classData) {
//           throw new Error("Failed to fetch class subjects.");
//         }

//         console.log("Class data:", classData);

//         // Extract non-empty subjects
//         const fetchedSubjects: string[] = [];
//         for (let i = 1; i <= 15; i++) {
//           const sub = classData[`sub${i}` as keyof ClassData];
//           if (sub && sub.trim() !== "") {
//             fetchedSubjects.push(sub.trim());
//           }
//         }

//         console.log("Fetched subjects:", fetchedSubjects);

//         setSubjects(fetchedSubjects);

//         // Initialize selected subjects for charts
//         setSelectedProgressSubjects(fetchedSubjects);
//         setSelectedTotalAverageSubjects(fetchedSubjects);

//         // 4. Fetch exam types from exam table based on subjects and school
//         console.log(
//           "Fetching exam types for subjects:",
//           fetchedSubjects,
//           "and school:",
//           userSchool
//         );
//         const { data: examData, error: examError } = await supabase
//           .from<Exam>("exam")
//           .select("subjectName, examType, columnNumber")
//           .eq("school", userSchool)
//           .in("subjectName", fetchedSubjects);

//         if (examError || !examData) {
//           throw new Error("Failed to fetch exam types.");
//         }

//         console.log("Exam data:", examData);

//         // Extract exam types with term and weight information
//         const examTypeList: ExamType[] = examData
//           .map((exam) => {
//             const term = extractTerm(exam.examType);
//             if (!term) {
//               console.warn(
//                 `Term not found in examType name: ${exam.examType}`
//               );
//               return null; // Exclude examTypes without a term
//             }
//             const weight = extractWeight(exam.examType);
//             if (weight === null) {
//               console.warn(
//                 `Weight not found or invalid in examType name: ${exam.examType}`
//               );
//               return null; // Exclude examTypes without a valid weight
//             }
//             return {
//               subjectName: exam.subjectName, // Include subjectName
//               examType: exam.examType,
//               columnNumber: exam.columnNumber,
//               term: term,
//               weight: weight,
//             };
//           })
//           .filter((examType): examType is ExamType => examType !== null);

//         // Validate that for each term, weights sum to 100
//         const termWeightMap: { [key: string]: number } = {};
//         examTypeList.forEach((examType) => {
//           if (termWeightMap[examType.term]) {
//             termWeightMap[examType.term] += examType.weight;
//           } else {
//             termWeightMap[examType.term] = examType.weight;
//           }
//         });

//         // Check if any term's total weight does not sum to 100
//         const invalidTerms = Object.entries(termWeightMap).filter(
//           ([, totalWeight]) => totalWeight !== 100
//         );

//         if (invalidTerms.length > 0) {
//           console.error(
//             "The following terms have weights that do not sum to 100:",
//             invalidTerms
//           );
//           throw new Error(
//             "Invalid weight distribution. Ensure that the weights for each term sum up to 100 points."
//           );
//         }

//         // Sort examTypes within each term by columnNumber ascending
//         examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);

//         setExamTypes(examTypeList);

//         // 5. Fetch sheet names from subjects table based on subjects and school
//         console.log(
//           "Fetching sheet names for subjects:",
//           fetchedSubjects,
//           "and school:",
//           userSchool
//         );
//         const { data: subjectTableData, error: subjectTableError } = await supabase
//           .from<Subject>("subjects")
//           .select("subjectName, sheetName")
//           .eq("school", userSchool)
//           .in("subjectName", fetchedSubjects);

//         if (subjectTableError || !subjectTableData) {
//           throw new Error("Failed to fetch subject sheet names.");
//         }

//         console.log("Subject table data:", subjectTableData);

//         // Create a map of subjectName to sheetName
//         const subjectSheetMap: { [key: string]: string } = {};
//         subjectTableData.forEach((item) => {
//           subjectSheetMap[item.subjectName] = item.sheetName;
//         });

//         console.log("Subject to Sheet Map:", subjectSheetMap);

//         // 6. Fetch grades from each subject sheet based on selected term
//         console.log(
//           "Fetching grades for selected term:",
//           selectedTerm,
//           "and each subject."
//         );
//         const gradesData: GradeData[] = [];

//         for (const subject of fetchedSubjects) {
//           const sheetName = subjectSheetMap[subject];
//           if (!sheetName) {
//             console.warn(`Sheet name not found for subject: ${subject}`);
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           console.log(
//             `Fetching grades from sheet: ${sheetName} for studentID: ${userPassword}`
//           );

//           // Fetch the student's row from the subject sheet
//           const { data: sheetRow, error: sheetRowError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("studentID", userPassword)
//             .eq("school", userSchool)
//             .single();

//           if (sheetRowError || !sheetRow) {
//             console.warn(
//               `No grade data found in sheet: ${sheetName} for studentID: ${userPassword}`
//             );
//             gradesData.push({
//               subject,
//               classAverage: "-",
//               average: "-",
//               examMarks: {},
//             });
//             continue;
//           }

//           console.log(`Sheet row data for ${subject}:`, sheetRow);

//           // Get exams for this subject and selected term
//           const subjectExams = examTypeList.filter(
//             (exam) =>
//               exam.term === selectedTerm && exam.subjectName === subject
//           );

//           // Initialize examMarks
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
//               numericMark = parseFloat(mark);
//               if (isNaN(numericMark)) {
//                 numericMark = null;
//               }
//             }

//             if (numericMark !== null) {
//               examMarks[exam.examType] = numericMark;
//               sumWeightedMarks += numericMark * exam.weight;
//               sumWeights += exam.weight;
//               markCount += 1;
//               if (markCount === 1) {
//                 singleMark = numericMark;
//               }
//             } else {
//               examMarks[exam.examType] = mark !== null && mark !== undefined ? mark : "-";
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

//           console.log(`Computed average for ${subject}: ${average}`);

//           // Compute class averages per examType column
//           console.log(
//             `Fetching other students' grades from sheet: ${sheetName} for class: ${className}`
//           );
//           const { data: otherStudentsData, error: otherStudentsError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("className", className)
//             .eq("school", userSchool)
//             .neq("studentID", userPassword); // Fetch all other students in the same class & school

//           let classAverage: string = "-";

//           if (otherStudentsError) {
//             console.warn(`Failed to fetch other students' data from sheet: ${sheetName}`);
//           }

//           if (otherStudentsData && otherStudentsData.length > 0) {
//             // For each examType, gather all other students' marks, ignoring empty/null
//             subjectExams.forEach((exam) => {
//               const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//               const marks: number[] = [];

//               otherStudentsData.forEach((otherStudentRow) => {
//                 const otherMark = otherStudentRow[columnName];
//                 let numericMark: number | null = null;
//                 if (typeof otherMark === "number") {
//                   numericMark = otherMark;
//                 } else if (typeof otherMark === "string") {
//                   const parsed = parseFloat(otherMark);
//                   if (!isNaN(parsed)) numericMark = parsed;
//                 }
//                 // Only include valid numeric marks (exclude null, '-' or empty)
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

//             // Compute an overall classAverage for reference
//             const validClassAverages = Object.values(classExamMarks).filter(
//               (val) => !isNaN(val)
//             );
//             if (validClassAverages.length > 0) {
//               const avg = validClassAverages.reduce((a, b) => a + b, 0) / validClassAverages.length;
//               classAverage = avg.toFixed(1);
//             }

//             console.log(`Computed class average for ${subject}: ${classAverage}`);
//           } else {
//             console.log(`No valid marks from other students for ${subject}. Class average remains "-".`);
//           }

//           gradesData.push({
//             subject,
//             classAverage,
//             average,
//             examMarks,
//             classExamMarks,
//           });
//         }

//         console.log("Final Grades Data with Class Averages:", gradesData);

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

//   // Handle Subject Selection
//   const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSubject(e.target.value);
//   };

//   // Handle Term Selection
//   const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTerm(e.target.value);
//   };

//   // Filter grades based on selectedSubject
//   const filteredGrades = grades.filter((grade) => {
//     const subjectMatch = selectedSubject ? grade.subject === selectedSubject : true;
//     return subjectMatch;
//   });

//   // Get exam types for the current term
//   const displayExamTypes = examTypes
//     .filter((exam) => exam.term === selectedTerm)
//     .sort((a, b) => a.columnNumber - b.columnNumber)
//     .map((exam) => exam.examType);

//   // Calculate averages
//   const calculateAverage = (grade: GradeData) => {
//     if (grade.average === "-") return "-";
//     if (grade.average.endsWith("")) {
//       return grade.average;
//     }
//     return grade.average; // Single mark without %
//   };

//   // Handle Progress Graph Modal
//   const openProgressModal = () => {
//     setProgressModalVisible(true);
//   };

//   const closeProgressModal = () => {
//     setProgressModalVisible(false);
//   };

//   // Handle Total Average Graph Modal
//   const openTotalAverageModal = () => {
//     setTotalAverageModalVisible(true);
//   };

//   const closeTotalAverageModal = () => {
//     setTotalAverageModalVisible(false);
//   };

//   // Handle Progress Subject Toggle
//   const handleProgressSubjectToggle = (subject: string) => {
//     setSelectedProgressSubjects((prev) =>
//       prev.includes(subject)
//         ? prev.filter((s) => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   // Handle Total Average Subject Toggle
//   const handleTotalAverageSubjectToggle = (subject: string) => {
//     setSelectedTotalAverageSubjects((prev) =>
//       prev.includes(subject)
//         ? prev.filter((s) => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.errorContainer}>
//         <p style={styles.errorMessage}>{error}</p>
//       </div>
//     );
//   }

//   // Prepare data for Progress Chart
//   const prepareProgressChartData = () => {
//     // Use only examTypes for the selected term
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

//     // Add class average line if requested
//     if (showProgressClassAverage) {
//       // Compute class average per examType by averaging classExamMarks of all selected subjects
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

//   // Prepare data for Total Average Chart
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

//     const datasets = [
//       {
//         label: "Student Average",
//         data: studentAverages,
//         backgroundColor: "#28a745", // Green
//       },
//     ];

//     if (showTotalAverageClassAverage) {
//       datasets.push({
//         label: "Class Average",
//         data: classAverages,
//         backgroundColor: "#17a2b8", // Teal
//       });
//     }

//     return {
//       labels: labels,
//       datasets: datasets,
//     };
//   };

//   // Function to get color for each subject
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

//   return (
//     <div style={styles.pageContainer}>
//       {/* Navigation Button */}
//       <button
//         style={styles.backButton}
//         onClick={() => navigate("/student")}
//       >
//         &#9664;
//       </button>

//       {/* Graph Buttons */}
//       <div style={styles.graphButtonsContainer}>
//         <button
//           style={styles.graphButton("Progress")}
//           onClick={openProgressModal}
//         >
//           Progress 📈
//         </button>
//         <button
//           style={styles.graphButton("Total Average")}
//           onClick={openTotalAverageModal}
//         >
//           Total Average 📊
//         </button>
//       </div>

//       <div style={styles.card}>
//         {/* Title and Subheading */}
//         <h1 style={styles.title}>{school}</h1>
//         <h3 style={styles.subheading}>
//           {className} - {section}
//         </h3>

//         {/* Subject Dropdown */}
//         <div style={styles.dropdownContainer}>
//           <label htmlFor="subject-select" style={styles.label}>
//             Select Subject:
//           </label>
//           <select
//             id="subject-select"
//             value={selectedSubject}
//             onChange={handleSubjectChange}
//             style={styles.select}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((subject) => (
//               <option key={subject} value={subject}>
//                 {subject}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Grades Table */}
//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Subjects</th>
//                 <th style={styles.th}>Total Class %</th>
//                 <th style={styles.th}>Average %</th>
//                 {displayExamTypes.map((exam) => (
//                   <th key={exam} style={styles.th}>
//                     {exam}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredGrades.map((grade) => (
//                 <tr key={grade.subject}>
//                   <td style={styles.td}>{grade.subject}</td>
//                   <td style={styles.td}>
//                     {grade.classAverage !== "-"
//                       ? `${grade.classAverage}%`
//                       : "-"}
//                   </td>
//                   <td style={styles.td}>{calculateAverage(grade)}</td>
//                   {displayExamTypes.map((exam) => (
//                     <td key={exam} style={styles.td}>
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

//       {/* Progress Modal */}
//       {progressModalVisible && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={closeProgressModal}>
//               &times;
//             </span>
//             <h2 style={styles.modalTitle}>Progress Graph</h2>

//             {/* Term Dropdown Inside Modal */}
//             <div style={styles.dropdownContainer}>
//               <label htmlFor="modal-term-select" style={styles.label}>
//                 Select Term:
//               </label>
//               <select
//                 id="modal-term-select"
//                 value={selectedTerm}
//                 onChange={handleTermChange}
//                 style={styles.select}
//               >
//                 {terms.map((term) => (
//                   <option key={term} value={term}>
//                     {term}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Legend and Toggle Buttons */}
//             <div style={styles.legendContainer}>
//               {subjects.map((subject) => (
//                 <button
//                   key={subject}
//                   style={{
//                     ...styles.legendButton,
//                     backgroundColor: selectedProgressSubjects.includes(subject)
//                       ? getColor(subject)
//                       : "#e9ecef",
//                     color: selectedProgressSubjects.includes(subject)
//                       ? "white"
//                       : "black",
//                   }}
//                   onClick={() => handleProgressSubjectToggle(subject)}
//                 >
//                   <span
//                     style={{
//                       ...styles.colorBox,
//                       backgroundColor: getColor(subject),
//                     }}
//                   ></span>
//                   {subject}
//                 </button>
//               ))}

//               {/* Class Average Toggle */}
//               <button
//                 style={{
//                   ...styles.legendButton,
//                   backgroundColor: showProgressClassAverage
//                     ? "#6c757d"
//                     : "#e9ecef",
//                   color: showProgressClassAverage ? "white" : "black",
//                 }}
//                 onClick={() =>
//                   setShowProgressClassAverage((prev) => !prev)
//                 }
//               >
//                 <span
//                   style={{
//                     ...styles.colorBox,
//                     backgroundColor: "#6c757d",
//                   }}
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
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={closeTotalAverageModal}>
//               &times;
//             </span>
//             <h2 style={styles.modalTitle}>Total Average Graph</h2>

//             {/* Legend and Toggle Buttons */}
//             <div style={styles.legendContainer}>
//               {subjects.map((subject) => (
//                 <button
//                   key={subject}
//                   style={{
//                     ...styles.legendButton,
//                     backgroundColor: selectedTotalAverageSubjects.includes(subject)
//                       ? getColor(subject)
//                       : "#e9ecef",
//                     color: selectedTotalAverageSubjects.includes(subject)
//                       ? "white"
//                       : "black",
//                   }}
//                   onClick={() => handleTotalAverageSubjectToggle(subject)}
//                 >
//                   <span
//                     style={{
//                       ...styles.colorBox,
//                       backgroundColor: getColor(subject),
//                     }}
//                   ></span>
//                   {subject}
//                 </button>
//               ))}

//               {/* Class Average Toggle */}
//               <button
//                 style={{
//                   ...styles.legendButton,
//                   backgroundColor: showTotalAverageClassAverage
//                     ? "#6c757d"
//                     : "#e9ecef",
//                   color: showTotalAverageClassAverage ? "white" : "black",
//                 }}
//                 onClick={() =>
//                   setShowTotalAverageClassAverage((prev) => !prev)
//                 }
//               >
//                 <span
//                   style={{
//                     ...styles.colorBox,
//                     backgroundColor: "#6c757d",
//                   }}
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

// // Inline styles for the component
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: {
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "20px",
//     backgroundColor: "#f5f5f5",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//     width: "100%",
//     maxWidth: "1200px",
//     textAlign: "center",
//     position: "relative",
//   },
//   title: {
//     fontSize: "32px",
//     marginBottom: "10px",
//     marginTop: "50px",
//     color: "black",
//   },
//   subheading: {
//     fontSize: "20px",
//     color: "#555555",
//     marginBottom: "30px",
//   },
//   dropdownContainer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: "20px",
//     marginTop: "40px",
//   },
//   label: {
//     marginRight: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "black",
//   },
//   select: {
//     padding: "8px",
//     fontSize: "16px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//     flex: "1",
//   },
//   tableContainer: {
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     border: "1px solid #dddddd",
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "white",
//     textAlign: "left",
//   },
//   td: {
//     border: "1px solid #dddddd",
//     padding: "12px",
//     textAlign: "left",
//     color: "black",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   spinner: {
//     border: "8px solid #f3f3f3",
//     borderTop: "8px solid #007bff",
//     borderRadius: "50%",
//     width: "60px",
//     height: "60px",
//     animation: "spin 1s linear infinite",
//     marginBottom: "20px",
//   },
//   errorContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   errorMessage: {
//     color: "red",
//     fontSize: "18px",
//   },
//   backButton: {
//     position: "absolute",
//     top: "20px",
//     left: "250px",
//     backgroundColor: "#5555",
//     color: "white",
//     border: "none",
//     borderRadius: "50%",
//     width: "60px",
//     height: "60px",
//     fontSize: "24px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   },
//   graphButtonsContainer: {
//     position: "absolute",
//     flexDirection: "column",
//     marginBottom: '10px',
//     top: "20px",
//     right: "250px",
//     display: "flex",
//     gap: "0px",
//     zIndex: 1000,
//   },
//   graphButton: (type: string) => ({
//     backgroundColor: type === "Progress" ? "#28a745" : "#17a2b8",
//     color: "white",
//     border: "none",
//     borderRadius: "30px",
//     padding: "10px 20px",
//     fontSize: "16px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//   }),
//   modalOverlay: {
//     position: "fixed" as "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   },
//   modalContent: {
//     backgroundColor: "#ffffff",
//     padding: "20px",
//     borderRadius: "10px",
//     width: "80%",
//     maxWidth: "800px",
//     position: "relative" as "relative",
//   },
//   closeModal: {
//     position: "absolute" as "absolute",
//     top: "10px",
//     right: "20px",
//     fontSize: "28px",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
//   modalTitle: {
//     textAlign: "center" as "center",
//     marginBottom: "20px",
//   },
//   legendContainer: {
//     display: "flex",
//     flexWrap: "wrap" as "wrap",
//     gap: "10px",
//     justifyContent: "center",
//     marginBottom: "20px",
//   },
//   legendButton: {
//     display: "flex",
//     alignItems: "center",
//     padding: "8px 12px",
//     margin: "5px",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontSize: "14px",
//     transition: "background-color 0.3s, color 0.3s",
//   },
//   colorBox: {
//     width: "12px",
//     height: "12px",
//     marginRight: "8px",
//     borderRadius: "2px",
//   },
// };

// // Keyframes for spinner animation
// const styleSheet = document.styleSheets[0];
// const keyframes = `
// @keyframes spin {
//   to { transform: rotate(360deg); }
// }`;
// styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// export default StudentGrade;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";
import { Bar, Line } from "react-chartjs-2";
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

// Define TypeScript interfaces for the data structures
interface Profile {
  school: string;
  password: string; // Assuming 'password' is used as 'studentID'
}

interface Student {
  className: string;
  section: string;
}

interface ClassData {
  class: string; // Ensure this matches your Supabase 'class' column
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

interface Exam {
  subjectName: string;
  examType: string;
  columnNumber: number;
}

interface Subject {
  subjectName: string;
  sheetName: string;
}

interface GradeData {
  subject: string;
  classAverage: string; // Single final average for reference
  average: string;
  examMarks: { [key: string]: number | string };
  classExamMarks?: { [key: string]: number }; // New field for class averages per examType
}

interface ExamType {
  subjectName: string; // Included subjectName
  examType: string;
  columnNumber: number;
  term: string;
  weight: number; // Added weight parsed from examType name
}

const StudentGrade: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession(); // Assuming SessionContext provides 'session'

  // State variables
  const [school, setSchool] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]); // Includes term and subjectName
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term"); // Default to "First Term"
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Modal state variables
  const [progressModalVisible, setProgressModalVisible] = useState<boolean>(false);
  const [totalAverageModalVisible, setTotalAverageModalVisible] = useState<boolean>(false);

  // Chart state variables
  const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
  const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
  const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
  const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

  // List of terms
  const terms = ["First Term", "Second Term", "Retakes"];

  // Helper function to extract term from examType name
  const extractTerm = (examTypeName: string): string | null => {
    const termRegex = /(First Term|Second Term|Retakes)/i;
    const match = examTypeName.match(termRegex);
    return match ? match[1] : null;
  };

  // Helper function to extract weight from examType name
  const extractWeight = (examTypeName: string): number | null => {
    const weightRegex = /\((\d+)\s*pts?\)/i;
    const match = examTypeName.match(weightRegex);
    return match ? parseInt(match[1], 10) : null;
  };

  // Helper function to map columnNumber to column name in the sheet
  const mapColumnNumberToColumnName = (columnNumber: number): string => {
    return `${columnNumber}`;
  };

  // Fetch all necessary data on component mount and when selections change
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const userId = session.user.id;
        console.log("Fetching profile for user ID:", userId);

        // 1. Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from<Profile>("profiles")
          .select("school, password")
          .eq("id", userId)
          .single();

        if (profileError || !profile) {
          throw new Error("Failed to fetch profile.");
        }

        console.log("Profile data:", profile);

        const userSchool = profile.school;
        const userPassword = profile.password;

        setSchool(userSchool);

        // 2. Fetch student information
        console.log(
          "Fetching student information for school:",
          userSchool,
          "and studentID:",
          userPassword
        );
        const { data: student, error: studentError } = await supabase
          .from<Student>("student")
          .select("className, section")
          .eq("school", userSchool)
          .eq("studentID", userPassword)
          .single();

        if (studentError || !student) {
          throw new Error("Failed to fetch student information.");
        }

        console.log("Student data:", student);

        setClassName(student.className);
        setSection(student.section);

        // 3. Fetch class subjects (sub1 to sub15)
        console.log(
          "Fetching class subjects for class:",
          student.className,
          "and school:",
          userSchool
        );
        const { data: classData, error: classError } = await supabase
          .from<ClassData>("class")
          .select(
            "class, sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
          )
          .eq("class", student.className) // Matching 'class' column with 'className'
          .eq("school", userSchool)
          .single();

        if (classError || !classData) {
          throw new Error("Failed to fetch class subjects.");
        }

        console.log("Class data:", classData);

        // Extract non-empty subjects
        const fetchedSubjects: string[] = [];
        for (let i = 1; i <= 15; i++) {
          const sub = classData[`sub${i}` as keyof ClassData];
          if (sub && sub.trim() !== "") {
            fetchedSubjects.push(sub.trim());
          }
        }

        console.log("Fetched subjects:", fetchedSubjects);

        setSubjects(fetchedSubjects);

        // Initialize selected subjects for charts
        setSelectedProgressSubjects(fetchedSubjects);
        setSelectedTotalAverageSubjects(fetchedSubjects);

        // 4. Fetch exam types from exam table based on subjects and school
        console.log(
          "Fetching exam types for subjects:",
          fetchedSubjects,
          "and school:",
          userSchool
        );
        const { data: examData, error: examError } = await supabase
          .from<Exam>("exam")
          .select("subjectName, examType, columnNumber")
          .eq("school", userSchool)
          .in("subjectName", fetchedSubjects);

        if (examError || !examData) {
          throw new Error("Failed to fetch exam types.");
        }

        console.log("Exam data:", examData);

        // Extract exam types with term and weight information
        const examTypeList: ExamType[] = examData
          .map((exam) => {
            const term = extractTerm(exam.examType);
            if (!term) {
              console.warn(
                `Term not found in examType name: ${exam.examType}`
              );
              return null; // Exclude examTypes without a term
            }
            const weight = extractWeight(exam.examType);
            if (weight === null) {
              console.warn(
                `Weight not found or invalid in examType name: ${exam.examType}`
              );
              return null; // Exclude examTypes without a valid weight
            }
            return {
              subjectName: exam.subjectName, // Include subjectName
              examType: exam.examType,
              columnNumber: exam.columnNumber,
              term: term,
              weight: weight,
            };
          })
          .filter((examType): examType is ExamType => examType !== null);

        // Validate that for each term, weights sum to 100
        const termWeightMap: { [key: string]: number } = {};
        examTypeList.forEach((examType) => {
          if (termWeightMap[examType.term]) {
            termWeightMap[examType.term] += examType.weight;
          } else {
            termWeightMap[examType.term] = examType.weight;
          }
        });

        // Check if any term's total weight does not sum to 100
        const invalidTerms = Object.entries(termWeightMap).filter(
          ([, totalWeight]) => totalWeight !== 100
        );

        if (invalidTerms.length > 0) {
          console.error(
            "The following terms have weights that do not sum to 100:",
            invalidTerms
          );
          throw new Error(
            "Invalid weight distribution. Ensure that the weights for each term sum up to 100 points."
          );
        }

        // Sort examTypes within each term by columnNumber ascending
        examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);

        setExamTypes(examTypeList);

        // 5. Fetch sheet names from subjects table based on subjects and school
        console.log(
          "Fetching sheet names for subjects:",
          fetchedSubjects,
          "and school:",
          userSchool
        );
        const { data: subjectTableData, error: subjectTableError } = await supabase
          .from<Subject>("subjects")
          .select("subjectName, sheetName")
          .eq("school", userSchool)
          .in("subjectName", fetchedSubjects);

        if (subjectTableError || !subjectTableData) {
          throw new Error("Failed to fetch subject sheet names.");
        }

        console.log("Subject table data:", subjectTableData);

        // Create a map of subjectName to sheetName
        const subjectSheetMap: { [key: string]: string } = {};
        subjectTableData.forEach((item) => {
          subjectSheetMap[item.subjectName] = item.sheetName;
        });

        console.log("Subject to Sheet Map:", subjectSheetMap);

        // 6. Fetch grades from each subject sheet based on selected term
        console.log(
          "Fetching grades for selected term:",
          selectedTerm,
          "and each subject."
        );
        const gradesData: GradeData[] = [];

        for (const subject of fetchedSubjects) {
          const sheetName = subjectSheetMap[subject];
          if (!sheetName) {
            console.warn(`Sheet name not found for subject: ${subject}`);
            gradesData.push({
              subject,
              classAverage: "-",
              average: "-",
              examMarks: {},
            });
            continue;
          }

          console.log(
            `Fetching grades from sheet: ${sheetName} for studentID: ${userPassword}`
          );

          // Fetch the student's row from the subject sheet
          const { data: sheetRow, error: sheetRowError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("studentID", userPassword)
            .eq("school", userSchool)
            .single();

          if (sheetRowError || !sheetRow) {
            console.warn(
              `No grade data found in sheet: ${sheetName} for studentID: ${userPassword}`
            );
            gradesData.push({
              subject,
              classAverage: "-",
              average: "-",
              examMarks: {},
            });
            continue;
          }

          console.log(`Sheet row data for ${subject}:`, sheetRow);

          // Get exams for this subject and selected term
          const subjectExams = examTypeList.filter(
            (exam) =>
              exam.term === selectedTerm && exam.subjectName === subject
          );

          // Initialize examMarks
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
              numericMark = parseFloat(mark);
              if (isNaN(numericMark)) {
                numericMark = null;
              }
            }

            if (numericMark !== null) {
              examMarks[exam.examType] = numericMark;
              sumWeightedMarks += numericMark * exam.weight;
              sumWeights += exam.weight;
              markCount += 1;
              if (markCount === 1) {
                singleMark = numericMark;
              }
            } else {
              examMarks[exam.examType] = mark !== null && mark !== undefined ? mark : "-";
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

          console.log(`Computed average for ${subject}: ${average}`);

          // Compute class averages per examType column
          console.log(
            `Fetching other students' grades from sheet: ${sheetName} for class: ${className}`
          );
          const { data: otherStudentsData, error: otherStudentsError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("className", className)
            .eq("school", userSchool)
            .neq("studentID", userPassword); // Fetch all other students in the same class & school

          let classAverage: string = "-";

          if (otherStudentsError) {
            console.warn(`Failed to fetch other students' data from sheet: ${sheetName}`);
          }

          if (otherStudentsData && otherStudentsData.length > 0) {
            // For each examType, gather all other students' marks, ignoring empty/null
            subjectExams.forEach((exam) => {
              const columnName = mapColumnNumberToColumnName(exam.columnNumber);
              const marks: number[] = [];

              otherStudentsData.forEach((otherStudentRow) => {
                const otherMark = otherStudentRow[columnName];
                let numericMark: number | null = null;
                if (typeof otherMark === "number") {
                  numericMark = otherMark;
                } else if (typeof otherMark === "string") {
                  const parsed = parseFloat(otherMark);
                  if (!isNaN(parsed)) numericMark = parsed;
                }
                // Only include valid numeric marks (exclude null, '-' or empty)
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

            // Compute an overall classAverage for reference
            const validClassAverages = Object.values(classExamMarks).filter(
              (val) => !isNaN(val)
            );
            if (validClassAverages.length > 0) {
              const avg = validClassAverages.reduce((a, b) => a + b, 0) / validClassAverages.length;
              classAverage = avg.toFixed(1);
            }

            console.log(`Computed class average for ${subject}: ${classAverage}`);
          } else {
            console.log(`No valid marks from other students for ${subject}. Class average remains "-".`);
          }

          gradesData.push({
            subject,
            classAverage,
            average,
            examMarks,
            classExamMarks,
          });
        }

        console.log("Final Grades Data with Class Averages:", gradesData);

        setGrades(gradesData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error during data fetching:", err);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [session, navigate, selectedTerm, className, school]);

  // Handle Subject Selection
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  // Handle Term Selection
  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value);
  };

  // Filter grades based on selectedSubject
  const filteredGrades = grades.filter((grade) => {
    const subjectMatch = selectedSubject ? grade.subject === selectedSubject : true;
    return subjectMatch;
  });

  // Get exam types for the current term
  const displayExamTypes = examTypes
    .filter((exam) => exam.term === selectedTerm)
    .sort((a, b) => a.columnNumber - b.columnNumber)
    .map((exam) => exam.examType);

  // Calculate averages
  const calculateAverage = (grade: GradeData) => {
    if (grade.average === "-") return "-";
    return grade.average; // Single mark without %
  };

  // Handle Progress Graph Modal
  const openProgressModal = () => {
    setProgressModalVisible(true);
  };

  const closeProgressModal = () => {
    setProgressModalVisible(false);
  };

  // Handle Total Average Graph Modal
  const openTotalAverageModal = () => {
    setTotalAverageModalVisible(true);
  };

  const closeTotalAverageModal = () => {
    setTotalAverageModalVisible(false);
  };

  // Handle Progress Subject Toggle
  const handleProgressSubjectToggle = (subject: string) => {
    setSelectedProgressSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle Total Average Subject Toggle
  const handleTotalAverageSubjectToggle = (subject: string) => {
    setSelectedTotalAverageSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  // Prepare data for Progress Chart
  const prepareProgressChartData = () => {
    const allExamTypes = displayExamTypes;
    const datasets = filteredGrades
      .filter((grade) => selectedProgressSubjects.includes(grade.subject))
      .map((grade) => {
        const data = allExamTypes.map((examType) =>
          typeof grade.examMarks[examType] === "number"
            ? grade.examMarks[examType]
            : null
        );

        const color = getColor(grade.subject);
        return {
          label: grade.subject,
          data: data,
          borderColor: color,
          backgroundColor: color,
          fill: false,
          tension: 0.1,
          pointRadius: 3,
        };
      });

    if (showProgressClassAverage) {
      const selectedSubjectsData = filteredGrades.filter((grade) =>
        selectedProgressSubjects.includes(grade.subject)
      );

      const classAverageData = allExamTypes.map((examType) => {
        const values: number[] = [];
        selectedSubjectsData.forEach((grade) => {
          if (grade.classExamMarks && !isNaN(grade.classExamMarks[examType])) {
            values.push(grade.classExamMarks[examType]);
          }
        });
        if (values.length > 0) {
          return values.reduce((a, b) => a + b, 0) / values.length;
        } else {
          return null;
        }
      });

      datasets.push({
        label: "Class Average",
        data: classAverageData,
        borderColor: "#6c757d",
        backgroundColor: "#6c757d",
        fill: false,
        tension: 0.1,
        pointRadius: 3,
      });
    }

    return {
      labels: allExamTypes,
      datasets: datasets,
    };
  };

  // Prepare data for Total Average Chart
  const prepareTotalAverageChartData = () => {
    const subjectsToDisplay = filteredGrades.filter((grade) =>
      selectedTotalAverageSubjects.includes(grade.subject)
    );

    const labels = subjectsToDisplay.map((grade) => grade.subject);
    const studentAverages = subjectsToDisplay.map((grade) =>
      grade.average !== "-" ? parseFloat(grade.average) : 0
    );
    const classAverages = subjectsToDisplay.map((grade) =>
      grade.classAverage !== "-" ? parseFloat(grade.classAverage) : 0
    );

    const datasets = [
      {
        label: "Student Average",
        data: studentAverages,
        backgroundColor: "#28a745",
      },
    ];

    if (showTotalAverageClassAverage) {
      datasets.push({
        label: "Class Average",
        data: classAverages,
        backgroundColor: "#17a2b8",
      });
    }

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const getColor = (subject: string): string => {
    const colors: { [key: string]: string } = {
      Mathematics: "#FF6384",
      English: "#36A2EB",
      Science: "#FFCE56",
      History: "#4BC0C0",
      Geography: "#9966FF",
    };
    return colors[subject] || "#000000";
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate("/student")}
      >
        &#9664;
      </button>

      {/* Graph Buttons */}
      <div style={styles.graphButtonsContainer}>
        <button
          style={styles.graphButton("Progress")}
          onClick={openProgressModal}
        >
          Progress 📈
        </button>
        <button
          style={styles.graphButton("Total Average")}
          onClick={openTotalAverageModal}
        >
          Total Average 📊
        </button>
      </div>

      <div style={styles.card}>
        {/* Title and Subheading */}
        <h1 style={styles.title}>{school}</h1>
        <h3 style={styles.subheading}>
          {className} - {section}
        </h3>

        {/* Subject Dropdown */}
        <div style={styles.dropdownContainer}>
          <label htmlFor="subject-select" style={styles.label}>
            Select Subject:
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            style={styles.select}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Term Dropdown (Reintroduced on Main Page) */}
        <div style={styles.dropdownContainer}>
          <label htmlFor="term-select" style={styles.label}>
            Select Term:
          </label>
          <select
            id="term-select"
            value={selectedTerm}
            onChange={handleTermChange}
            style={styles.select}
          >
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        {/* Grades Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subjects</th>
                <th style={styles.th}>Total Class %</th>
                <th style={styles.th}>Average %</th>
                {displayExamTypes.map((exam) => (
                  <th key={exam} style={styles.th}>
                    {exam}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.subject}>
                  <td style={styles.td}>{grade.subject}</td>
                  <td style={styles.td}>
                    {grade.classAverage !== "-"
                      ? `${grade.classAverage}%`
                      : "-"}
                  </td>
                  <td style={styles.td}>{calculateAverage(grade)}</td>
                  {displayExamTypes.map((exam) => (
                    <td key={exam} style={styles.td}>
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

      {/* Progress Modal */}
      {progressModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <span style={styles.closeModal} onClick={closeProgressModal}>
              &times;
            </span>
            <h2 style={styles.modalTitle}>Progress Graph</h2>

            {/* Term Dropdown Inside Modal */}
            <div style={styles.dropdownContainer}>
              <label htmlFor="modal-term-select" style={styles.label}>
                Select Term:
              </label>
              <select
                id="modal-term-select"
                value={selectedTerm}
                onChange={handleTermChange}
                style={styles.select}
              >
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            {/* Legend and Toggle Buttons */}
            <div style={styles.legendContainer}>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  style={{
                    ...styles.legendButton,
                    backgroundColor: selectedProgressSubjects.includes(subject)
                      ? getColor(subject)
                      : "#e9ecef",
                    color: selectedProgressSubjects.includes(subject)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => handleProgressSubjectToggle(subject)}
                >
                  <span
                    style={{
                      ...styles.colorBox,
                      backgroundColor: getColor(subject),
                    }}
                  ></span>
                  {subject}
                </button>
              ))}

              {/* Class Average Toggle */}
              <button
                style={{
                  ...styles.legendButton,
                  backgroundColor: showProgressClassAverage
                    ? "#6c757d"
                    : "#e9ecef",
                  color: showProgressClassAverage ? "white" : "black",
                }}
                onClick={() =>
                  setShowProgressClassAverage((prev) => !prev)
                }
              >
                <span
                  style={{
                    ...styles.colorBox,
                    backgroundColor: "#6c757d",
                  }}
                ></span>
                Class Average
              </button>
            </div>

            {/* Progress Line Chart */}
            <Line
              data={prepareProgressChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                interaction: {
                  mode: "nearest",
                  axis: "x",
                  intersect: false,
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Exam Type",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Average Marks",
                    },
                    min: 0,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Total Average Modal */}
      {totalAverageModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <span style={styles.closeModal} onClick={closeTotalAverageModal}>
              &times;
            </span>
            <h2 style={styles.modalTitle}>Total Average Graph</h2>

            {/* Legend and Toggle Buttons */}
            <div style={styles.legendContainer}>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  style={{
                    ...styles.legendButton,
                    backgroundColor: selectedTotalAverageSubjects.includes(subject)
                      ? getColor(subject)
                      : "#e9ecef",
                    color: selectedTotalAverageSubjects.includes(subject)
                      ? "white"
                      : "black",
                  }}
                  onClick={() => handleTotalAverageSubjectToggle(subject)}
                >
                  <span
                    style={{
                      ...styles.colorBox,
                      backgroundColor: getColor(subject),
                    }}
                  ></span>
                  {subject}
                </button>
              ))}

              {/* Class Average Toggle */}
              <button
                style={{
                  ...styles.legendButton,
                  backgroundColor: showTotalAverageClassAverage
                    ? "#6c757d"
                    : "#e9ecef",
                  color: showTotalAverageClassAverage ? "white" : "black",
                }}
                onClick={() =>
                  setShowTotalAverageClassAverage((prev) => !prev)
                }
              >
                <span
                  style={{
                    ...styles.colorBox,
                    backgroundColor: "#6c757d",
                  }}
                ></span>
                Class Average
              </button>
            </div>

            {/* Total Average Bar Chart */}
            <Bar
              data={prepareTotalAverageChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Subjects",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Average Marks (%)",
                    },
                    min: 0,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "1200px",
    textAlign: "center",
    position: "relative",
    marginTop: "20px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
    marginTop: "50px",
    color: "black",
  },
  subheading: {
    fontSize: "20px",
    color: "#555555",
    marginBottom: "30px",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "column", // Stacks the dropdowns vertically
    alignItems: "flex-start", // Aligns them to start at the same position
    gap: "3px", // Adds consistent spacing between the dropdowns
    marginBottom: "14px",
    marginTop: "10px",
    width: '100%'
  },
  label: {
    marginRight: "10px",
    marginBottom: "0px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "black",
  },
  select: {
    width: "100%", // Ensure consistent width
    maxWidth: "100%",
    padding: "4px",
    fontSize: "18px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flex: "1",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #dddddd",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "left",
  },
  td: {
    border: "1px solid #dddddd",
    padding: "12px",
    textAlign: "left",
    color: "black",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  spinner: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #007bff",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  errorMessage: {
    color: "red",
    fontSize: "18px",
  },
  backButton: {
    position: "absolute",
    top: "45px",
    left: "250px",
    backgroundColor: "#5555",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  graphButtonsContainer: {
    position: "absolute",
    flexDirection: "column",
    marginBottom: '10px',
    top: "50px",
    right: "250px",
    display: "flex",
    gap: "0px",
    zIndex: 1000,
  },
  graphButton: (type: string) => ({
    backgroundColor: type === "Progress" ? "#28a745" : "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "30px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  }),
  modalOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "800px",
    position: "relative" as "relative",
  },
  closeModal: {
    position: "absolute" as "absolute",
    top: "10px",
    right: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  modalTitle: {
    textAlign: "center" as "center",
    marginBottom: "20px",
  },
  legendContainer: {
    display: "flex",
    flexWrap: "wrap" as "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  legendButton: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    margin: "5px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s, color 0.3s",
  },
  colorBox: {
    width: "12px",
    height: "12px",
    marginRight: "8px",
    borderRadius: "2px",
  },
};

// Keyframes for spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default StudentGrade;
