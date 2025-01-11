import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

interface Profile {
  school: string;
  role: string; // Added role for access control
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

interface Exam {
  examType: string;
  columnNumber: number;
  // If you still want to keep subjectName from the table, you can keep it:
  // subjectName?: string;
}

interface Subject {
  subjectName: string;
  sheetName: string;
}

interface GradeData {
  studentName: string;
  id: number;
  average: string;
  examMarks: { [key: string]: number | string };
}

interface ExamType {
  subjectName?: string; // keep optional or remove if no longer needed
  examType: string;
  columnNumber: number;
  term: string;
  weight: number;
}

const GradeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const [school, setSchool] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [editingCell, setEditingCell] = useState<{
    studentId: number;
    examType: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const terms = ["First Term", "Second Term", "Retakes"];

  const extractTerm = (examTypeName: string): string | null => {
    const termRegex = /(First Term|Second Term|Retakes)/i;
    const match = examTypeName.match(termRegex);
    return match ? match[1] : null;
  };

  const extractWeight = (examTypeName: string): number | null => {
    const weightRegex = /\((\d+)\s*pts?\)/i;
    const match = examTypeName.match(weightRegex);
    return match ? parseInt(match[1], 10) : null;
  };

  const mapColumnNumberToColumnName = (columnNumber: number): string => {
    return `${columnNumber}`;
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setSelectedSubject("");
    setExamTypes([]);
    setGrades([]);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
    setSelectedSubject("");
    setExamTypes([]);
    setGrades([]);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setExamTypes([]);
    setGrades([]);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value);
    setGrades([]);
  };

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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("school, role")
          .eq("id", userId)
          .single();

        if (profileError || !profileData) {
          throw new Error("Failed to fetch profile.");
        }

        const profile = profileData as Profile;
        if (profile.role !== "ADMIN") {
          navigate("/grades");
          return;
        }

        console.log("Profile data:", profile);

        const userSchool = profile.school;
        setSchool(userSchool);
        setRole(profile.role);

        const { data: classData, error: classError } = await supabase
          .from("student")
          .select("className")
          .eq("school", userSchool)
          .neq("className", "")
          .order("className", { ascending: true });

        if (classError || !classData) {
          throw new Error("Failed to fetch classes.");
        }

        const uniqueClasses = Array.from(
          new Set(classData.map((s: Student) => s.className))
        );
        setClasses(uniqueClasses);

        const { data: sectionData, error: sectionError } = await supabase
          .from("student")
          .select("section")
          .eq("school", userSchool)
          .neq("section", "")
          .order("section", { ascending: true });

        if (sectionError || !sectionData) {
          throw new Error("Failed to fetch sections.");
        }

        const uniqueSections = Array.from(
          new Set(sectionData.map((s: Student) => s.section))
        );
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

  useEffect(() => {
    if (selectedClass) {
      const fetchSubjects = async () => {
        try {
          setLoading(true);
          const { data: classSubjects, error: classSubjectsError } = await supabase
            .from("class")
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
            const sub = classSubjects[`sub${i}` as keyof ClassData] as
              | string
              | undefined;
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

  // ------------------------------------------------------------------------------
  // Updated to fetch ONLY examType and columnNumber, ignoring subjectName.
  // ------------------------------------------------------------------------------
  useEffect(() => {
    if (selectedSubject) {
      const fetchExamTypes = async () => {
        try {
          setLoading(true);

          const { data: examData, error: examError } = await supabase
            .from("exam")
            .select("examType, columnNumber")
            .eq("school", school); 
            // Removed .eq("subjectName", selectedSubject) to ignore subjectName

          if (examError) {
            throw new Error("Failed to fetch exam types.");
          }

          if (!examData) {
            throw new Error("No exam types returned from the database.");
          }

          console.log("Exam data:", examData);

          // Same logic for extracting term, weight, validating sum, etc.
          const examTypeList: ExamType[] = examData
            .map((exam: Exam) => {
              const term = extractTerm(exam.examType);
              if (!term) {
                console.warn(`Term not found in examType name: ${exam.examType}`);
                return null;
              }
              const weight = extractWeight(exam.examType);
              if (weight === null) {
                console.warn(
                  `Weight not found or invalid in examType name: ${exam.examType}`
                );
                return null;
              }
              return {
                examType: exam.examType,
                columnNumber: exam.columnNumber,
                term,
                weight,
              };
            })
            .filter((examType): examType is ExamType => examType !== null);

          // Validate each term sums up to 100
          const termWeightMap: { [key: string]: number } = {};
          examTypeList.forEach((et) => {
            if (termWeightMap[et.term]) {
              termWeightMap[et.term] += et.weight;
            } else {
              termWeightMap[et.term] = et.weight;
            }
          });

          const invalidTerms = Object.entries(termWeightMap).filter(
            ([, totalWeight]) => totalWeight !== 100
          );
          if (invalidTerms.length > 0) {
            console.error(
              "The following terms have weights that do not sum to 100:",
              invalidTerms
            );
            throw new Error(
              "Invalid weight distribution. Ensure that the weights for each term sum to 100 points."
            );
          }

          // Sort by columnNumber
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
  // ------------------------------------------------------------------------------

  useEffect(() => {
    if (
      selectedClass &&
      selectedSection &&
      selectedSubject &&
      selectedTerm &&
      examTypes.length > 0
    ) {
      const fetchGrades = async () => {
        try {
          setLoading(true);

          const { data: subjectData, error: subjectError } = await supabase
            .from("subjects")
            .select("sheetName")
            .eq("school", school)
            .eq("subjectName", selectedSubject)
            .single();

          if (subjectError || !subjectData) {
            throw new Error("Failed to fetch sheet name for the selected subject.");
          }

          const sheetData = subjectData as Subject;
          const sheetName = sheetData.sheetName;
          console.log(`Fetched sheetName: ${sheetName}`);

          if (!sheetName) {
            throw new Error("Sheet name is missing for the selected subject.");
          }

          const { data: gradesRows, error: gradesError } = await supabase
            .from(sheetName)
            .select("*")
            .eq("className", selectedClass)
            .eq("section", selectedSection)
            .eq("school", school) // **Added this line to filter by school**
            .order("id", { ascending: true });

          if (gradesError || !gradesRows) {
            throw new Error("Failed to fetch grades data.");
          }

          console.log(`Fetched grades rows:`, gradesRows);

          const filteredExamTypes = examTypes.filter(
            (exam) => exam.term === selectedTerm
          );
          console.log(
            `Filtered exam types for term "${selectedTerm}":`,
            filteredExamTypes
          );

          const gradesData: GradeData[] = gradesRows.map((row: any) => {
            const studentName = row.studentName || "-";
            const studentId = row.id || 0;
            let sumWeightedMarks = 0;
            let sumWeights = 0;
            let markCount = 0;
            let singleMark = 0;
            const examMarks: { [key: string]: number | string } = {};

            filteredExamTypes.forEach((exam) => {
              const columnName = mapColumnNumberToColumnName(exam.columnNumber);
              const mark = row[columnName];

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
                examMarks[exam.examType] =
                  mark !== null && mark !== undefined ? mark : "";
              }
            });

            let average: string;
            if (markCount >= 2 && sumWeights > 0) {
              average = (sumWeightedMarks / sumWeights).toFixed(1) + "%";
            } else if (markCount === 1) {
              average = singleMark.toFixed(1) + "%";
            } else {
              average = "";
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
  }, [
    selectedClass,
    selectedSection,
    selectedSubject,
    selectedTerm,
    examTypes,
    school,
  ]);

  const displayExamTypes = examTypes
    .filter((exam) => exam.term === selectedTerm)
    .sort((a, b) => a.columnNumber - b.columnNumber)
    .map((exam) => exam.examType);

  const calculateAverage = (grade: GradeData) => {
    if (grade.average === "-") return "-";
    if (grade.average.endsWith("%")) {
      return grade.average;
    }
    return grade.average;
  };

  const handleDoubleClick = (studentId: number, examType: string) => {
    setEditingCell({ studentId, examType });
  };

  const handleSaveMark = async (
    studentId: number,
    examType: string,
    newMark: number | string | null
  ) => {
    try {
      const exam = examTypes.find((e) => e.examType === examType);
      if (!exam) {
        throw new Error("Exam type not found.");
      }

      const subjectData = await supabase
        .from("subjects")
        .select("sheetName")
        .eq("school", school)
        .eq("subjectName", selectedSubject)
        .single();

      if (subjectData.error || !subjectData.data) {
        throw new Error("Failed to fetch sheet name for the selected subject.");
      }

      const sheetName = (subjectData.data as Subject).sheetName;

      const { error } = await supabase
        .from(sheetName)
        .update({
          [mapColumnNumberToColumnName(exam.columnNumber)]:
            newMark === "" ? null : newMark,
        })
        .eq("id", studentId);

      if (error) {
        throw new Error("Failed to update the mark.");
      }

      setGrades((prevGrades) =>
        prevGrades.map((grade) => {
          if (grade.id === studentId) {
            return {
              ...grade,
              examMarks: {
                ...grade.examMarks,
                [examType]: newMark === "" ? null : newMark,
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

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    studentId: number,
    examType: string
  ) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const value = target.value;

      // Accept: empty => null, "-", or a valid number
      if (value === "") {
        handleSaveMark(studentId, examType, null);
      } else if (value === "-") {
        handleSaveMark(studentId, examType, value);
      } else {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          handleSaveMark(studentId, examType, parsedValue);
        } else {
          alert("Please enter a valid number, leave empty, or enter '-'.");
          setEditingCell(null);
        }
      }
    }
  };

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
      <div style={styles.floatingContainer}>
        <button
          style={{ ...styles.iconButton, backgroundColor: "#007bff" }}
          onClick={() => navigate("/dashboard")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          📅
        </button>
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
        <h1 style={styles.title}>Grade Dashboard</h1>
        <h3 style={styles.subheading}>School: {school}</h3>

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

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th2, textAlign: "left" }}>Student Name</th>
                <th style={{ ...styles.th }}>Average %</th>
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
                    <td style={{ ...styles.td2, textAlign: "right" }}>
                      {grade.studentName}
                    </td>
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
                            type="text"
                            ref={inputRef}
                            defaultValue={
                              grade.examMarks[exam] !== null
                                ? (grade.examMarks[exam] as string)
                                : ""
                            }
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                handleSaveMark(grade.id, exam, null);
                              } else if (value === "-") {
                                handleSaveMark(grade.id, exam, value);
                              } else {
                                const parsedValue = parseFloat(value);
                                if (!isNaN(parsedValue)) {
                                  handleSaveMark(grade.id, exam, parsedValue);
                                } else {
                                  alert(
                                    "Please enter a valid number, leave empty, or enter '-'."
                                  );
                                  setEditingCell(null);
                                }
                              }
                            }}
                            onKeyPress={(e) =>
                              handleKeyPress(e, grade.id, exam)
                            }
                            style={styles.input}
                          />
                        ) : (
                          grade.examMarks[exam] !== null
                            ? grade.examMarks[exam]
                            : ""
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    style={styles.td}
                    colSpan={2 + displayExamTypes.length}
                  ></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          <footer className="footer">
                  <div className="text-center">
                    &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
              </div>
            </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
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
    backgroundColor: "#dbe346",
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
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#000",
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
    maxWidth: "1200px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    marginLeft: "20px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
    color: "black",
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
    color: "black",
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
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "15px",
    textAlign: "left",
  },
  th2: {
    border: "1px solid #dddddd",
    padding: "10px 70px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    textAlign: "center",
  },
  td: {
    border: "1px solid #dddddd",
    padding: "12px",
    textAlign: "left",
    color: "black",
    cursor: "pointer",
    fontSize: "17px",
  },
  td2: {
    border: "1px solid #dddddd",
    padding: "12px",
    textAlign: "left",
    color: "black",
    cursor: "pointer",
    fontSize: "22px",
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
  input: {
    width: "100%",
    padding: "6px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
};

const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default GradeDashboard;


// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// interface Profile {
//   school: string;
//   role: string; // Added role for access control
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
//   examType: string;
//   columnNumber: number;
//   // If you still want to keep subjectName from the table, you can keep it:
//   // subjectName?: string;
// }

// interface Subject {
//   subjectName: string;
//   sheetName: string;
// }

// interface GradeData {
//   studentName: string;
//   id: number;
//   average: string;
//   examMarks: { [key: string]: number | string };
// }

// interface ExamType {
//   subjectName?: string; // keep optional or remove if no longer needed
//   examType: string;
//   columnNumber: number;
//   term: string;
//   weight: number;
// }

// const GradeDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   const [school, setSchool] = useState<string>("");
//   const [role, setRole] = useState<string>("");
//   const [classes, setClasses] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClass, setSelectedClass] = useState<string>("");
//   const [selectedSection, setSelectedSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   const [editingCell, setEditingCell] = useState<{
//     studentId: number;
//     examType: string;
//   } | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const terms = ["First Term", "Second Term", "Retakes"];

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

//   const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedClass(e.target.value);
//     setSelectedSection("");
//     setSelectedSubject("");
//     setExamTypes([]);
//     setGrades([]);
//   };

//   const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSection(e.target.value);
//     setSelectedSubject("");
//     setExamTypes([]);
//     setGrades([]);
//   };

//   const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedSubject(e.target.value);
//     setExamTypes([]);
//     setGrades([]);
//   };

//   const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTerm(e.target.value);
//     setGrades([]);
//   };

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

//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("school, role")
//           .eq("id", userId)
//           .single();

//         if (profileError || !profileData) {
//           throw new Error("Failed to fetch profile.");
//         }

//         const profile = profileData as Profile;
//         if (profile.role !== "ADMIN") {
//           navigate("/grades");
//           return;
//         }

//         console.log("Profile data:", profile);

//         const userSchool = profile.school;
//         setSchool(userSchool);
//         setRole(profile.role);

//         const { data: classData, error: classError } = await supabase
//           .from("student")
//           .select("className")
//           .eq("school", userSchool)
//           .neq("className", "")
//           .order("className", { ascending: true });

//         if (classError || !classData) {
//           throw new Error("Failed to fetch classes.");
//         }

//         const uniqueClasses = Array.from(
//           new Set(classData.map((s: Student) => s.className))
//         );
//         setClasses(uniqueClasses);

//         const { data: sectionData, error: sectionError } = await supabase
//           .from("student")
//           .select("section")
//           .eq("school", userSchool)
//           .neq("section", "")
//           .order("section", { ascending: true });

//         if (sectionError || !sectionData) {
//           throw new Error("Failed to fetch sections.");
//         }

//         const uniqueSections = Array.from(
//           new Set(sectionData.map((s: Student) => s.section))
//         );
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

//   useEffect(() => {
//     if (selectedClass) {
//       const fetchSubjects = async () => {
//         try {
//           setLoading(true);
//           const { data: classSubjects, error: classSubjectsError } = await supabase
//             .from("class")
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
//             const sub = classSubjects[`sub${i}` as keyof ClassData] as
//               | string
//               | undefined;
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

//   // ------------------------------------------------------------------------------
//   // Updated to fetch ONLY examType and columnNumber, ignoring subjectName.
//   // ------------------------------------------------------------------------------
//   useEffect(() => {
//     if (selectedSubject) {
//       const fetchExamTypes = async () => {
//         try {
//           setLoading(true);

//           const { data: examData, error: examError } = await supabase
//             .from("exam")
//             .select("examType, columnNumber")
//             .eq("school", school); 
//             // Removed .eq("subjectName", selectedSubject) to ignore subjectName

//           if (examError) {
//             throw new Error("Failed to fetch exam types.");
//           }

//           if (!examData) {
//             throw new Error("No exam types returned from the database.");
//           }

//           console.log("Exam data:", examData);

//           // Same logic for extracting term, weight, validating sum, etc.
//           const examTypeList: ExamType[] = examData
//             .map((exam: Exam) => {
//               const term = extractTerm(exam.examType);
//               if (!term) {
//                 console.warn(`Term not found in examType name: ${exam.examType}`);
//                 return null;
//               }
//               const weight = extractWeight(exam.examType);
//               if (weight === null) {
//                 console.warn(
//                   `Weight not found or invalid in examType name: ${exam.examType}`
//                 );
//                 return null;
//               }
//               return {
//                 examType: exam.examType,
//                 columnNumber: exam.columnNumber,
//                 term,
//                 weight,
//               };
//             })
//             .filter((examType): examType is ExamType => examType !== null);

//           // Validate each term sums up to 100
//           const termWeightMap: { [key: string]: number } = {};
//           examTypeList.forEach((et) => {
//             if (termWeightMap[et.term]) {
//               termWeightMap[et.term] += et.weight;
//             } else {
//               termWeightMap[et.term] = et.weight;
//             }
//           });

//           const invalidTerms = Object.entries(termWeightMap).filter(
//             ([, totalWeight]) => totalWeight !== 100
//           );
//           if (invalidTerms.length > 0) {
//             console.error(
//               "The following terms have weights that do not sum to 100:",
//               invalidTerms
//             );
//             throw new Error(
//               "Invalid weight distribution. Ensure that the weights for each term sum to 100 points."
//             );
//           }

//           // Sort by columnNumber
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
//   // ------------------------------------------------------------------------------

//   useEffect(() => {
//     if (
//       selectedClass &&
//       selectedSection &&
//       selectedSubject &&
//       selectedTerm &&
//       examTypes.length > 0
//     ) {
//       const fetchGrades = async () => {
//         try {
//           setLoading(true);

//           const { data: subjectData, error: subjectError } = await supabase
//             .from("subjects")
//             .select("sheetName")
//             .eq("school", school)
//             .eq("subjectName", selectedSubject)
//             .single();

//           if (subjectError || !subjectData) {
//             throw new Error("Failed to fetch sheet name for the selected subject.");
//           }

//           const sheetData = subjectData as Subject;
//           const sheetName = sheetData.sheetName;
//           console.log(`Fetched sheetName: ${sheetName}`);

//           if (!sheetName) {
//             throw new Error("Sheet name is missing for the selected subject.");
//           }

//           const { data: gradesRows, error: gradesError } = await supabase
//             .from(sheetName)
//             .select("*")
//             .eq("className", selectedClass)
//             .eq("section", selectedSection)
//             .order("id", { ascending: true });

//           if (gradesError || !gradesRows) {
//             throw new Error("Failed to fetch grades data.");
//           }

//           console.log(`Fetched grades rows:`, gradesRows);

//           const filteredExamTypes = examTypes.filter(
//             (exam) => exam.term === selectedTerm
//           );
//           console.log(
//             `Filtered exam types for term "${selectedTerm}":`,
//             filteredExamTypes
//           );

//           const gradesData: GradeData[] = gradesRows.map((row: any) => {
//             const studentName = row.studentName || "-";
//             const studentId = row.id || 0;
//             let sumWeightedMarks = 0;
//             let sumWeights = 0;
//             let markCount = 0;
//             let singleMark = 0;
//             const examMarks: { [key: string]: number | string } = {};

//             filteredExamTypes.forEach((exam) => {
//               const columnName = mapColumnNumberToColumnName(exam.columnNumber);
//               const mark = row[columnName];

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
//                 examMarks[exam.examType] =
//                   mark !== null && mark !== undefined ? mark : "";
//               }
//             });

//             let average: string;
//             if (markCount >= 2 && sumWeights > 0) {
//               average = (sumWeightedMarks / sumWeights).toFixed(1) + "%";
//             } else if (markCount === 1) {
//               average = singleMark.toFixed(1) + "%";
//             } else {
//               average = "";
//             }

//             return {
//               studentName,
//               id: studentId,
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
//   }, [
//     selectedClass,
//     selectedSection,
//     selectedSubject,
//     selectedTerm,
//     examTypes,
//     school,
//   ]);

//   const displayExamTypes = examTypes
//     .filter((exam) => exam.term === selectedTerm)
//     .sort((a, b) => a.columnNumber - b.columnNumber)
//     .map((exam) => exam.examType);

//   const calculateAverage = (grade: GradeData) => {
//     if (grade.average === "-") return "-";
//     if (grade.average.endsWith("%")) {
//       return grade.average;
//     }
//     return grade.average;
//   };

//   const handleDoubleClick = (studentId: number, examType: string) => {
//     setEditingCell({ studentId, examType });
//   };

//   const handleSaveMark = async (
//     studentId: number,
//     examType: string,
//     newMark: number | string | null
//   ) => {
//     try {
//       const exam = examTypes.find((e) => e.examType === examType);
//       if (!exam) {
//         throw new Error("Exam type not found.");
//       }

//       const subjectData = await supabase
//         .from("subjects")
//         .select("sheetName")
//         .eq("school", school)
//         .eq("subjectName", selectedSubject)
//         .single();

//       if (subjectData.error || !subjectData.data) {
//         throw new Error("Failed to fetch sheet name for the selected subject.");
//       }

//       const sheetName = (subjectData.data as Subject).sheetName;

//       const { error } = await supabase
//         .from(sheetName)
//         .update({
//           [mapColumnNumberToColumnName(exam.columnNumber)]:
//             newMark === "" ? null : newMark,
//         })
//         .eq("id", studentId);

//       if (error) {
//         throw new Error("Failed to update the mark.");
//       }

//       setGrades((prevGrades) =>
//         prevGrades.map((grade) => {
//           if (grade.id === studentId) {
//             return {
//               ...grade,
//               examMarks: {
//                 ...grade.examMarks,
//                 [examType]: newMark === "" ? null : newMark,
//               },
//             };
//           }
//           return grade;
//         })
//       );
//     } catch (err: any) {
//       console.error("Error saving mark:", err);
//       alert(err.message || "Failed to save the mark.");
//     } finally {
//       setEditingCell(null);
//     }
//   };

//   const handleKeyPress = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     studentId: number,
//     examType: string
//   ) => {
//     if (e.key === "Enter") {
//       const target = e.target as HTMLInputElement;
//       const value = target.value;

//       // Accept: empty => null, "-", or a valid number
//       if (value === "") {
//         handleSaveMark(studentId, examType, null);
//       } else if (value === "-") {
//         handleSaveMark(studentId, examType, value);
//       } else {
//         const parsedValue = parseFloat(value);
//         if (!isNaN(parsedValue)) {
//           handleSaveMark(studentId, examType, parsedValue);
//         } else {
//           alert("Please enter a valid number, leave empty, or enter '-'.");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (editingCell && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [editingCell]);

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
//       <div style={styles.floatingContainer}>
//         <button
//           style={{ ...styles.iconButton, backgroundColor: "#007BA7" }}
//           onClick={() => navigate("/dashboard")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           📅
//         </button>
//         <button
//           style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
//           onClick={() => navigate("/dashboard3")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           +
//         </button>
//         <button
//           style={styles.iconButton}
//           onClick={() => navigate("/")}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           👤
//         </button>
//       </div>

//       <div style={styles.card}>
//         <h1 style={styles.title}>Grade Dashboard</h1>
//         <h3 style={styles.subheading}>School: {school}</h3>

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

//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={{ ...styles.th2, textAlign: "left" }}>Student Name</th>
//                 <th style={{ ...styles.th }}>Average %</th>
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
//                   <tr key={grade.id}>
//                     <td style={{ ...styles.td2, textAlign: "right" }}>
//                       {grade.studentName}
//                     </td>
//                     <td style={styles.td}>{calculateAverage(grade)}</td>
//                     {displayExamTypes.map((exam) => (
//                       <td
//                         key={exam}
//                         style={styles.td}
//                         onDoubleClick={() => {
//                           const studentId = grade.id;
//                           setEditingCell({ studentId, examType: exam });
//                         }}
//                       >
//                         {editingCell &&
//                         editingCell.studentId === grade.id &&
//                         editingCell.examType === exam ? (
//                           <input
//                             type="text"
//                             ref={inputRef}
//                             defaultValue={
//                               grade.examMarks[exam] !== null
//                                 ? (grade.examMarks[exam] as string)
//                                 : ""
//                             }
//                             onBlur={(e) => {
//                               const value = e.target.value;
//                               if (value === "") {
//                                 handleSaveMark(grade.id, exam, null);
//                               } else if (value === "-") {
//                                 handleSaveMark(grade.id, exam, value);
//                               } else {
//                                 const parsedValue = parseFloat(value);
//                                 if (!isNaN(parsedValue)) {
//                                   handleSaveMark(grade.id, exam, parsedValue);
//                                 } else {
//                                   alert(
//                                     "Please enter a valid number, leave empty, or enter '-'."
//                                   );
//                                   setEditingCell(null);
//                                 }
//                               }
//                             }}
//                             onKeyPress={(e) =>
//                               handleKeyPress(e, grade.id, exam)
//                             }
//                             style={styles.input}
//                           />
//                         ) : (
//                           grade.examMarks[exam] !== null
//                             ? grade.examMarks[exam]
//                             : ""
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     style={styles.td}
//                     colSpan={2 + displayExamTypes.length}
//                   ></td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: CSSProperties } = {
//   iconButton: {
//     width: "60px",
//     height: "60px",
//     margin: "12px 0",
//     fontSize: "28px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#Dfff",
//     color: "#fff",
//     border: "3px solid #Dfff",
//     borderRadius: "10px",
//     cursor: "pointer",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//     boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
//   },
//   iconButton2: {
//     width: "60px",
//     height: "60px",
//     margin: "12px 0",
//     fontSize: "34px",
//     padding: "20px",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#Dfff",
//     color: "#fff",
//     border: "1px solid #Dfff",
//     borderRadius: "10px",
//     cursor: "pointer",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//   },
//   iconButtonHover: {
//     transform: "translateY(-2px)",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
//     backgroundColor: "#e8e8e8",
//   },
//   pageContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent: "center",
//     padding: "20px",
//     backgroundColor: "#f5f5f5",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   floatingContainer: {
//     position: "fixed",
//     top: "20px",
//     left: "35px",
//     width: "82px",
//     height: "auto",
//     backgroundColor: "#f2f2f2",
//     borderRadius: "20px",
//     boxShadow: `
//        0 2px 10px rgba(0, 0, 0, 0.3), 
//       0 1px 0px rgba(0, 0, 0, 0.1)
//     `,
//     padding: "5px 10px",
//     zIndex: 1000,
//     flexShrink: 0,
//     border: "1px solid #D6D6D6",
//   },
//   card: {
//     flex: 1,
//     maxWidth: "1200px",
//     backgroundColor: "#ffffff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 5px 3px rgba(0, 0, 0, 0.4)",
//     textAlign: "center",
//     marginLeft: "20px",
//   },
//   title: {
//     fontSize: "32px",
//     marginBottom: "10px",
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
//     flexWrap: "wrap",
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
//     minWidth: "200px",
//     marginRight: "10px",
//     marginBottom: "10px",
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
//     padding: "10px 15px",
//     backgroundColor: "#007bff",
//     color: "white",
//     fontSize: "15px",
//     textAlign: "left",
//   },
//   th2: {
//     border: "1px solid #dddddd",
//     padding: "10px 70px",
//     backgroundColor: "#007bff",
//     color: "white",
//     fontSize: "16px",
//     textAlign: "center",
//   },
//   td: {
//     border: "1px solid #dddddd",
//     padding: "12px",
//     textAlign: "left",
//     color: "black",
//     cursor: "pointer",
//     fontSize: "17px",
//   },
//   td2: {
//     border: "1px solid #dddddd",
//     padding: "12px",
//     textAlign: "left",
//     color: "black",
//     cursor: "pointer",
//     fontSize: "22px",
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
//   input: {
//     width: "100%",
//     padding: "6px",
//     fontSize: "16px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//     boxSizing: "border-box",
//   },
// };

// const styleSheet = document.styleSheets[0];
// const keyframes = `
// @keyframes spin {
//   to { transform: rotate(360deg); }
// }`;
// styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// export default GradeDashboard;
