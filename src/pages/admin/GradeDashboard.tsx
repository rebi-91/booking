// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../supabase";
// import { useSession } from "../context/SessionContext";

// // Define TypeScript interfaces for the data structures
// interface Profile {
//   school: string;
//   role: string; // Added role for access control
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
//   // Removed 'weight' as weight is embedded in 'examType'
//   columnNumber: number;
// }

// interface Subject {
//   subjectName: string;
//   sheetName: string;
// }

// interface GradeData {
//   studentName: string;
//   average: string;
//   examMarks: { [key: string]: number | string };
// }

// interface ExamType {
//   subjectName: string; // Included subjectName
//   examType: string;
//   columnNumber: number;
//   term: string;
//   weight: number; // Added weight parsed from examType name
// }

// const GradeDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession(); // Assuming SessionContext provides 'session'

//   // State variables
//   const [school, setSchool] = useState<string>("");
//   const [role, setRole] = useState<string>("");
//   const [classes, setClasses] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClass, setSelectedClass] = useState<string>("");
//   const [selectedSection, setSelectedSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term"); // Default to "First Term"
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

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

//   // Handle Class Selection
//   const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedClass(e.target.value);
//     setSelectedSection(""); // Reset section when class changes
//     setSelectedSubject(""); // Reset subject when class changes
//     setExamTypes([]); // Reset exam types when class changes
//     setGrades([]); // Reset grades when class changes
//   };

//   // Handle Section Selection
//   const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSection(e.target.value);
//     setSelectedSubject(""); // Reset subject when section changes
//     setExamTypes([]); // Reset exam types when section changes
//     setGrades([]); // Reset grades when section changes
//   };

//   // Handle Subject Selection
//   const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSubject(e.target.value);
//     setExamTypes([]); // Reset exam types when subject changes
//     setGrades([]); // Reset grades when subject changes
//   };

//   // Handle Term Selection
//   const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTerm(e.target.value);
//     setGrades([]); // Reset grades when term changes
//   };

//   // Initial Data Fetching: Profile, Classes, and Sections
//   useEffect(() => {
//     if (!session) {
//       navigate("/login");
//       return;
//     }

//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);

//         const userId = session.user.id;
//         console.log("Fetching profile for user ID:", userId);

//         // 1. Fetch profile
//         const { data: profile, error: profileError } = await supabase
//           .from<Profile>("profiles")
//           .select("school, role")
//           .eq("id", userId)
//           .single();

//         if (profileError || !profile) {
//           throw new Error("Failed to fetch profile.");
//         }

//         if (profile.role !== "ADMIN") {
//           navigate("/grades");
//           return;
//         }

//         console.log("Profile data:", profile);

//         const userSchool = profile.school;
//         setSchool(userSchool);
//         setRole(profile.role);

//         // 2. Fetch classes
//         const { data: classData, error: classError } = await supabase
//           .from<Student>("student")
//           .select("className")
//           .eq("school", userSchool)
//           .neq("className", "")
//           .order("className", { ascending: true });

//         if (classError || !classData) {
//           throw new Error("Failed to fetch classes.");
//         }

//         const uniqueClasses = Array.from(new Set(classData.map((s) => s.className)));
//         setClasses(uniqueClasses);

//         // 3. Fetch sections
//         const { data: sectionData, error: sectionError } = await supabase
//           .from<Student>("student")
//           .select("section")
//           .eq("school", userSchool)
//           .neq("section", "")
//           .order("section", { ascending: true });

//         if (sectionError || !sectionData) {
//           throw new Error("Failed to fetch sections.");
//         }

//         const uniqueSections = Array.from(new Set(sectionData.map((s) => s.section)));
//         setSections(uniqueSections);
//       } catch (err: any) {
//         console.error("Error during initial data fetching:", err);
//         setError(err.message || "An unexpected error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, [session, navigate]);

//   // Fetch Subjects based on Selected Class
//   useEffect(() => {
//     if (selectedClass) {
//       const fetchSubjects = async () => {
//         try {
//           setLoading(true);
//           const { data: classSubjects, error: classSubjectsError } = await supabase
//             .from<ClassData>("class")
//             .select(
//               "sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
//             )
//             .eq("class", selectedClass)
//             .eq("school", school)
//             .single();

//           if (classSubjectsError || !classSubjects) {
//             throw new Error("Failed to fetch class subjects.");
//           }

//           const fetchedSubjects: string[] = [];
//           for (let i = 1; i <= 15; i++) {
//             const sub = classSubjects[`sub${i}` as keyof ClassData];
//             if (sub && sub.trim() !== "") {
//               fetchedSubjects.push(sub.trim());
//             }
//           }

//           setSubjects(fetchedSubjects);
//         } catch (err: any) {
//           console.error("Error fetching subjects:", err);
//           setError(err.message || "An unexpected error occurred.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchSubjects();
//     } else {
//       setSubjects([]);
//     }
//   }, [selectedClass, school]);

//   // Fetch Exam Types based on Selected Subject
//   useEffect(() => {
//     if (selectedSubject) {
//       const fetchExamTypes = async () => {
//         try {
//           setLoading(true);

//           const { data: examData, error: examError } = await supabase
//             .from<Exam>("exam")
//             .select("subjectName, examType, columnNumber")
//             .eq("school", school)
//             .eq("subjectName", selectedSubject);

//           if (examError || !examData) {
//             throw new Error("Failed to fetch exam types.");
//           }

//           console.log("Exam data:", examData);

//           // Extract exam types with term and weight information
//           const examTypeList: ExamType[] = examData
//             .map((exam) => {
//               const term = extractTerm(exam.examType);
//               if (!term) {
//                 console.warn(`Term not found in examType name: ${exam.examType}`);
//                 return null; // Exclude examTypes without a term
//               }
//               const weight = extractWeight(exam.examType);
//               if (weight === null) {
//                 console.warn(`Weight not found or invalid in examType name: ${exam.examType}`);
//                 return null; // Exclude examTypes without a valid weight
//               }
//               return {
//                 subjectName: exam.subjectName, // Include subjectName
//                 examType: exam.examType,
//                 columnNumber: exam.columnNumber,
//                 term: term,
//                 weight: weight, // Assign parsed weight
//               };
//             })
//             .filter((examType): examType is ExamType => examType !== null);

//           // Validate that for each term, weights sum to 100
//           const termWeightMap: { [key: string]: number } = {};
//           examTypeList.forEach((examType) => {
//             if (termWeightMap[examType.term]) {
//               termWeightMap[examType.term] += examType.weight;
//             } else {
//               termWeightMap[examType.term] = examType.weight;
//             }
//           });

//           // Check if any term's total weight does not sum to 100
//           const invalidTerms = Object.entries(termWeightMap).filter(
//             ([, totalWeight]) => totalWeight !== 100
//           );

//           if (invalidTerms.length > 0) {
//             console.error(
//               "The following terms have weights that do not sum to 100:",
//               invalidTerms
//             );
//             throw new Error(
//               "Invalid weight distribution. Ensure that the weights for each term sum up to 100 points."
//             );
//           }

//           // Sort examTypes within each term by columnNumber ascending
//           examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);

//           setExamTypes(examTypeList);
//         } catch (err: any) {
//           console.error("Error fetching exam types:", err);
//           setError(err.message || "An unexpected error occurred.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchExamTypes();
//     } else {
//       setExamTypes([]);
//     }
//   }, [selectedSubject, school]);

//   // Fetch Grades based on Selected Class, Section, Subject, and Term
//   useEffect(() => {
//     if (selectedClass && selectedSection && selectedSubject && selectedTerm && examTypes.length > 0) {
//       const fetchGrades = async () => {
//         try {
//           setLoading(true);

//           // 1. Fetch sheetName from subjects table
//           const { data: subjectData, error: subjectError } = await supabase
//             .from<Subject>("subjects")
//             .select("sheetName")
//             .eq("school", school)
//             .eq("subjectName", selectedSubject)
//             .single();

//           if (subjectError || !subjectData) {
//             throw new Error("Failed to fetch sheet name for the selected subject.");
//           }

//           const sheetName = subjectData.sheetName;
//           console.log(`Fetched sheetName: ${sheetName}`);

//           if (!sheetName) {
//             throw new Error("Sheet name is missing for the selected subject.");
//           }

//           // 2. Fetch all students' grades from the sheetName table matching class and section
//           const { data: gradesRows, error: gradesError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("className", selectedClass)
//             .eq("section", selectedSection);

//           if (gradesError || !gradesRows) {
//             throw new Error("Failed to fetch grades data.");
//           }

//           console.log(`Fetched grades rows:`, gradesRows);

//           // 3. Prepare examTypes for the selected term
//           const filteredExamTypes = examTypes.filter((exam) => exam.term === selectedTerm);
//           console.log(`Filtered exam types for term "${selectedTerm}":`, filteredExamTypes);

//           // 4. For each student, calculate average and collect exam marks
//           const gradesData: GradeData[] = gradesRows.map((row: any) => {
//             const studentName = row.studentName || "-";
//             let sumWeightedMarks = 0;
//             let sumWeights = 0;
//             let markCount = 0;
//             let singleMark = 0;
//             const examMarks: { [key: string]: number | string } = {};

//             filteredExamTypes.forEach((exam) => {
//               const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//               const mark = row[columnName];

//               // Attempt to parse mark as a number
//               let numericMark: number | null = null;
//               if (typeof mark === "number") {
//                 numericMark = mark;
//               } else if (typeof mark === "string") {
//                 numericMark = parseFloat(mark);
//                 if (isNaN(numericMark)) {
//                   numericMark = null;
//                 }
//               }

//               if (numericMark !== null) {
//                 examMarks[exam.examType] = numericMark;
//                 sumWeightedMarks += numericMark * exam.weight;
//                 sumWeights += exam.weight;
//                 markCount += 1;
//                 if (markCount === 1) {
//                   singleMark = numericMark;
//                 }
//               } else {
//                 examMarks[exam.examType] = mark !== null && mark !== undefined ? mark : "-";
//               }
//             });

//             let average: string;
//             if (markCount >= 2 && sumWeights > 0) {
//               average = (sumWeightedMarks / sumWeights).toFixed(1) + "%";
//               console.log(
//                 `Computed average for ${studentName}: ${average} (Sum Weighted Marks: ${sumWeightedMarks}, Sum Weights: ${sumWeights})`
//               );
//             } else if (markCount === 1) {
//               average = singleMark.toString();
//               console.log(`Single mark for ${studentName}: ${average}`);
//             } else {
//               average = "-";
//               console.log(`No valid marks for ${studentName}. Setting average to "-".`);
//             }

//             return {
//               studentName,
//               average,
//               examMarks,
//             };
//           });

//           console.log("Final Grades Data:", gradesData);

//           setGrades(gradesData);
//         } catch (err: any) {
//           console.error("Error fetching grades:", err);
//           setError(err.message || "An unexpected error occurred.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchGrades();
//     } else {
//       setGrades([]);
//     }
//   }, [selectedClass, selectedSection, selectedSubject, selectedTerm, examTypes, school]);

//   // Filter grades based on selectedSubject
//   // Not needed anymore as grades are already for the selected subject
//   // Removed the previous filter

//   // Get all exam types to display as columns, sorted by columnNumber ascending
//   const displayExamTypes = examTypes
//     .filter((exam) => exam.term === selectedTerm)
//     .sort((a, b) => a.columnNumber - b.columnNumber) // Ensure sorting
//     .map((exam) => exam.examType);

//   // Calculate averages
//   const calculateAverage = (grade: GradeData) => {
//     if (grade.average === "-") return "-";
//     if (grade.average.endsWith("%")) {
//       return grade.average;
//     }
//     return grade.average; // Single mark without %
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

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.card}>
//         {/* Title and Subheading */}
//         <h1 style={styles.title}>Grade Dashboard</h1>
//         <h3 style={styles.subheading}>
//           School: {school}
//         </h3>

//         {/* Class Dropdown */}
//         <div style={styles.dropdownContainer}>
//           <label htmlFor="class-select" style={styles.label}>
//             Select Class:
//           </label>
//           <select
//             id="class-select"
//             value={selectedClass}
//             onChange={handleClassChange}
//             style={styles.select}
//           >
//             <option value="">All Classes</option>
//             {classes.map((className) => (
//               <option key={className} value={className}>
//                 {className}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Section Dropdown */}
//         <div style={styles.dropdownContainer}>
//           <label htmlFor="section-select" style={styles.label}>
//             Select Section:
//           </label>
//           <select
//             id="section-select"
//             value={selectedSection}
//             onChange={handleSectionChange}
//             style={styles.select}
//             disabled={!selectedClass}
//           >
//             <option value="">All Sections</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>

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
//             disabled={!selectedClass || !selectedSection}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((subject) => (
//               <option key={subject} value={subject}>
//                 {subject}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Term Dropdown */}
//         <div style={styles.dropdownContainer}>
//           <label htmlFor="term-select" style={styles.label}>
//             Select Term:
//           </label>
//           <select
//             id="term-select"
//             value={selectedTerm}
//             onChange={handleTermChange}
//             style={styles.select}
//             disabled={!selectedSubject}
//           >
//             {terms.map((term) => (
//               <option key={term} value={term}>
//                 {term}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Grades Table */}
//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Student Name</th>
//                 <th style={styles.th}>Average %</th>
//                 {displayExamTypes.map((exam) => (
//                   <th key={exam} style={styles.th}>
//                     {exam}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {grades.length > 0 ? (
//                 grades.map((grade) => (
//                   <tr key={grade.studentName}>
//                     <td style={styles.td}>{grade.studentName}</td>
//                     <td style={styles.td}>{calculateAverage(grade)}</td>
//                     {displayExamTypes.map((exam) => (
//                       <td key={exam} style={styles.td}>
//                         {grade.examMarks[exam] !== undefined
//                           ? grade.examMarks[exam]
//                           : "-"}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td style={styles.td} colSpan={2 + displayExamTypes.length}>
//                     No grades available for the selected filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Inline styles for the component
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
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
//   },
//   title: {
//     fontSize: "32px",
//     marginBottom: "10px",
//     color: "black", // Set title color to black
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
//   },
//   label: {
//     marginRight: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "black", // Ensure labels are black
//   },
//   select: {
//     padding: "8px",
//     fontSize: "16px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//     flex: "1",
//     minWidth: "200px",
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
//     color: "black", // Set table cell text color to black
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
//     border: "8px solid #f3f3f3", // Light grey
//     borderTop: "8px solid #007bff", // Blue
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
// };

// // Keyframes for spinner animation
// const styleSheet = document.styleSheets[0];
// const keyframes = `
// @keyframes spin {
//   to { transform: rotate(360deg); }
// }`;
// styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// export default GradeDashboard;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

// Define TypeScript interfaces for the data structures
interface Profile {
  school: string;
  role: string; // Added role for access control
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
  // Removed 'weight' as weight is embedded in 'examType'
  columnNumber: number;
}

interface Subject {
  subjectName: string;
  sheetName: string;
}

interface GradeData {
  studentName: string;
  id: number; // Assuming there's an 'id' column to sort by
  average: string;
  examMarks: { [key: string]: number | string };
}

interface ExamType {
  subjectName: string; // Included subjectName
  examType: string;
  columnNumber: number;
  term: string;
  weight: number; // Added weight parsed from examType name
}

const GradeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession(); // Assuming SessionContext provides 'session'

  // State variables
  const [school, setSchool] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term"); // Default to "First Term"
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // To track which cell is being edited
  const [editingCell, setEditingCell] = useState<{ studentId: number; examType: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Handle Class Selection
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection(""); // Reset section when class changes
    setSelectedSubject(""); // Reset subject when class changes
    setExamTypes([]); // Reset exam types when class changes
    setGrades([]); // Reset grades when class changes
  };

  // Handle Section Selection
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
    setSelectedSubject(""); // Reset subject when section changes
    setExamTypes([]); // Reset exam types when section changes
    setGrades([]); // Reset grades when section changes
  };

  // Handle Subject Selection
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setExamTypes([]); // Reset exam types when subject changes
    setGrades([]); // Reset grades when subject changes
  };

  // Handle Term Selection
  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value);
    setGrades([]); // Reset grades when term changes
  };

  // Initial Data Fetching: Profile, Classes, and Sections
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const userId = session.user.id;
        console.log("Fetching profile for user ID:", userId);

        // 1. Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from<Profile>("profiles")
          .select("school, role")
          .eq("id", userId)
          .single();

        if (profileError || !profile) {
          throw new Error("Failed to fetch profile.");
        }

        if (profile.role !== "ADMIN") {
          navigate("/grades");
          return;
        }

        console.log("Profile data:", profile);

        const userSchool = profile.school;
        setSchool(userSchool);
        setRole(profile.role);

        // 2. Fetch classes
        const { data: classData, error: classError } = await supabase
          .from<Student>("student")
          .select("className")
          .eq("school", userSchool)
          .neq("className", "")
          .order("className", { ascending: true });

        if (classError || !classData) {
          throw new Error("Failed to fetch classes.");
        }

        const uniqueClasses = Array.from(new Set(classData.map((s) => s.className)));
        setClasses(uniqueClasses);

        // 3. Fetch sections based on selectedClass
        // Initially, no class is selected, so sections are all unique sections in the school
        const { data: sectionData, error: sectionError } = await supabase
          .from<Student>("student")
          .select("section")
          .eq("school", userSchool)
          .neq("section", "")
          .order("section", { ascending: true });

        if (sectionError || !sectionData) {
          throw new Error("Failed to fetch sections.");
        }

        const uniqueSections = Array.from(new Set(sectionData.map((s) => s.section)));
        setSections(uniqueSections);
      } catch (err: any) {
        console.error("Error during initial data fetching:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [session, navigate]);

  // Fetch Subjects based on Selected Class
  useEffect(() => {
    if (selectedClass) {
      const fetchSubjects = async () => {
        try {
          setLoading(true);
          const { data: classSubjects, error: classSubjectsError } = await supabase
            .from<ClassData>("class")
            .select(
              "sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11, sub12, sub13, sub14, sub15"
            )
            .eq("class", selectedClass)
            .eq("school", school)
            .single();

          if (classSubjectsError || !classSubjects) {
            throw new Error("Failed to fetch class subjects.");
          }

          const fetchedSubjects: string[] = [];
          for (let i = 1; i <= 15; i++) {
            const sub = classSubjects[`sub${i}` as keyof ClassData];
            if (sub && sub.trim() !== "") {
              fetchedSubjects.push(sub.trim());
            }
          }

          setSubjects(fetchedSubjects);
        } catch (err: any) {
          console.error("Error fetching subjects:", err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedClass, school]);

  // Fetch Exam Types based on Selected Subject
  useEffect(() => {
    if (selectedSubject) {
      const fetchExamTypes = async () => {
        try {
          setLoading(true);

          const { data: examData, error: examError } = await supabase
            .from<Exam>("exam")
            .select("subjectName, examType, columnNumber")
            .eq("school", school)
            .eq("subjectName", selectedSubject);

          if (examError || !examData) {
            throw new Error("Failed to fetch exam types.");
          }

          console.log("Exam data:", examData);

          // Extract exam types with term and weight information
          const examTypeList: ExamType[] = examData
            .map((exam) => {
              const term = extractTerm(exam.examType);
              if (!term) {
                console.warn(`Term not found in examType name: ${exam.examType}`);
                return null; // Exclude examTypes without a term
              }
              const weight = extractWeight(exam.examType);
              if (weight === null) {
                console.warn(`Weight not found or invalid in examType name: ${exam.examType}`);
                return null; // Exclude examTypes without a valid weight
              }
              return {
                subjectName: exam.subjectName, // Include subjectName
                examType: exam.examType,
                columnNumber: exam.columnNumber,
                term: term,
                weight: weight, // Assign parsed weight
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
        } catch (err: any) {
          console.error("Error fetching exam types:", err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchExamTypes();
    } else {
      setExamTypes([]);
    }
  }, [selectedSubject, school]);

  // Fetch Grades based on Selected Class, Section, Subject, and Term
  useEffect(() => {
    if (selectedClass && selectedSection && selectedSubject && selectedTerm && examTypes.length > 0) {
      const fetchGrades = async () => {
        try {
          setLoading(true);

          // 1. Fetch sheetName from subjects table
          const { data: subjectData, error: subjectError } = await supabase
            .from<Subject>("subjects")
            .select("sheetName")
            .eq("school", school)
            .eq("subjectName", selectedSubject)
            .single();

          if (subjectError || !subjectData) {
            throw new Error("Failed to fetch sheet name for the selected subject.");
          }

          const sheetName = subjectData.sheetName;
          console.log(`Fetched sheetName: ${sheetName}`);

          if (!sheetName) {
            throw new Error("Sheet name is missing for the selected subject.");
          }

          // 2. Fetch all students' grades from the sheetName table matching class and section
          const { data: gradesRows, error: gradesError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("className", selectedClass)
            .eq("section", selectedSection)
            .order("id", { ascending: true }); // Assuming there's an 'id' column for sorting

          if (gradesError || !gradesRows) {
            throw new Error("Failed to fetch grades data.");
          }

          console.log(`Fetched grades rows:`, gradesRows);

          // 3. Prepare examTypes for the selected term
          const filteredExamTypes = examTypes.filter((exam) => exam.term === selectedTerm);
          console.log(`Filtered exam types for term "${selectedTerm}":`, filteredExamTypes);

          // 4. For each student, calculate average and collect exam marks
          const gradesData: GradeData[] = gradesRows.map((row: any) => {
            const studentName = row.studentName || "-";
            const studentId = row.id || 0; // Assuming there's an 'id' column
            let sumWeightedMarks = 0;
            let sumWeights = 0;
            let markCount = 0;
            let singleMark = 0;
            const examMarks: { [key: string]: number | string } = {};

            filteredExamTypes.forEach((exam) => {
              const columnName = mapColumnNumberToColumnName(exam.columnNumber);
              const mark = row[columnName];

              // Attempt to parse mark as a number
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
                // If mark is null or empty, show nothing
                examMarks[exam.examType] = mark !== null && mark !== undefined ? mark : "";
              }
            });

            let average: string;
            if (markCount >= 2 && sumWeights > 0) {
              average = (sumWeightedMarks / sumWeights).toFixed(1) + "%";
              console.log(
                `Computed average for ${studentName}: ${average} (Sum Weighted Marks: ${sumWeightedMarks}, Sum Weights: ${sumWeights})`
              );
            } else if (markCount === 1) {
              average = singleMark.toFixed(1) + "%"; // Always show %
              console.log(`Single mark for ${studentName}: ${average}`);
            } else {
              average = "";
              console.log(`No valid marks for ${studentName}. Setting average to empty.`);
            }

            return {
              studentName,
              id: studentId,
              average,
              examMarks,
            };
          });

          console.log("Final Grades Data:", gradesData);

          setGrades(gradesData);
        } catch (err: any) {
          console.error("Error fetching grades:", err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchGrades();
    } else {
      setGrades([]);
    }
  }, [selectedClass, selectedSection, selectedSubject, selectedTerm, examTypes, school]);

  // Get all exam types to display as columns, sorted by columnNumber ascending
  const displayExamTypes = examTypes
    .filter((exam) => exam.term === selectedTerm)
    .sort((a, b) => a.columnNumber - b.columnNumber) // Ensure sorting
    .map((exam) => exam.examType);

  // Calculate averages (already handled during data fetching)
  const calculateAverage = (grade: GradeData) => {
    if (grade.average === "-") return "-";
    if (grade.average.endsWith("%")) {
      return grade.average;
    }
    return grade.average; // Single mark without %
  };

  // Handle double-click to edit a cell
  const handleDoubleClick = (studentId: number, examType: string) => {
    setEditingCell({ studentId, examType });
  };

  // Handle saving the edited mark
  const handleSaveMark = async (studentId: number, examType: string, newMark: number | string) => {
    try {
      // Find the examType details
      const exam = examTypes.find((e) => e.examType === examType);
      if (!exam) {
        throw new Error("Exam type not found.");
      }

      // Find the sheetName from subjects
      const subjectData = await supabase
        .from<Subject>("subjects")
        .select("sheetName")
        .eq("school", school)
        .eq("subjectName", selectedSubject)
        .single();

      if (subjectData.error || !subjectData.data) {
        throw new Error("Failed to fetch sheet name for the selected subject.");
      }

      const sheetName = subjectData.data.sheetName;

      // Update the mark in the sheet
      const { error } = await supabase
        .from(sheetName)
        .update({ [mapColumnNumberToColumnName(exam.columnNumber)]: newMark })
        .eq("id", studentId); // Assuming 'id' is the unique identifier

      if (error) {
        throw new Error("Failed to update the mark.");
      }

      // Update the local state
      setGrades((prevGrades) =>
        prevGrades.map((grade) => {
          if (grade.id === studentId) {
            return {
              ...grade,
              examMarks: {
                ...grade.examMarks,
                [examType]: newMark,
              },
            };
          }
          return grade;
        })
      );
    } catch (err: any) {
      console.error("Error saving mark:", err);
      alert(err.message || "Failed to save the mark.");
    } finally {
      setEditingCell(null);
    }
  };

  // Handle key press (ENTER) in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, studentId: number, examType: string) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        handleSaveMark(studentId, examType, parsedValue);
      } else {
        alert("Please enter a valid number.");
      }
    }
  };

  // Focus on the input field when it appears
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Title and Subheading */}
        <h1 style={styles.title}>Grade Dashboard</h1>
        <h3 style={styles.subheading}>
          School: {school}
        </h3>

        {/* Class Dropdown */}
        <div style={styles.dropdownContainer}>
          <label htmlFor="class-select" style={styles.label}>
            Select Class:
          </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={handleClassChange}
            style={styles.select}
          >
            <option value="">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Section Dropdown */}
        <div style={styles.dropdownContainer}>
          <label htmlFor="section-select" style={styles.label}>
            Select Section:
          </label>
          <select
            id="section-select"
            value={selectedSection}
            onChange={handleSectionChange}
            style={styles.select}
            disabled={!selectedClass}
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

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
            disabled={!selectedClass || !selectedSection}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Term Dropdown */}
        <div style={styles.dropdownContainer}>
          <label htmlFor="term-select" style={styles.label}>
            Select Term:
          </label>
          <select
            id="term-select"
            value={selectedTerm}
            onChange={handleTermChange}
            style={styles.select}
            disabled={!selectedSubject}
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
                <th style={{ ...styles.th, textAlign: "right" }}>Student Name</th>
                <th style={styles.th}>Average %</th>
                {displayExamTypes.map((exam) => (
                  <th key={exam} style={styles.th}>
                    {exam}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <tr key={grade.id}>
                    <td style={{ ...styles.td, textAlign: "right" }}>{grade.studentName}</td>
                    <td style={styles.td}>{calculateAverage(grade)}</td>
                    {displayExamTypes.map((exam) => (
                      <td
                        key={exam}
                        style={styles.td}
                        onDoubleClick={() => {
                          const studentId = grade.id;
                          setEditingCell({ studentId, examType: exam });
                        }}
                      >
                        {editingCell &&
                        editingCell.studentId === grade.id &&
                        editingCell.examType === exam ? (
                          <input
                            type="number"
                            ref={inputRef}
                            defaultValue={grade.examMarks[exam] !== "" ? grade.examMarks[exam] : ""}
                            onBlur={(e) => {
                              const value = e.target.value;
                              const parsedValue = parseFloat(value);
                              if (!isNaN(parsedValue)) {
                                handleSaveMark(grade.id, exam, parsedValue);
                              } else {
                                alert("Please enter a valid number.");
                                setEditingCell(null);
                              }
                            }}
                            onKeyPress={(e) => handleKeyPress(e, grade.id, exam)}
                            style={styles.input}
                          />
                        ) : (
                          grade.examMarks[exam] !== "" ? grade.examMarks[exam] : ""
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan={2 + displayExamTypes.length}>
                    
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
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
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
    color: "black", // Set title color to black
  },
  subheading: {
    fontSize: "20px",
    color: "#555555",
    marginBottom: "30px",
  },
  dropdownContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  label: {
    marginRight: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "black", // Ensure labels are black
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flex: "1",
    minWidth: "200px",
    marginRight: "10px",
    marginBottom: "10px",
  },
  tableContainer: {
    overflowX: "auto",
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
    color: "black", // Set table cell text color to black
    cursor: "pointer",
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
    border: "8px solid #f3f3f3", // Light grey
    borderTop: "8px solid #007bff", // Blue
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
  input: {
    width: "100%",
    padding: "6px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
};

// Keyframes for spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default GradeDashboard;
