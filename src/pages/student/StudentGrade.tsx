// StudentGrade.tsx
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
import "./StudentGrade.css"; // Import the CSS file

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
  classAverage: string;
  average: string;
  examMarks: { [key: string]: number | string };
  classExamMarks?: { [key: string]: number };
}

interface ExamType {
  subjectName: string;
  examType: string;
  columnNumber: number;
  term: string;
  weight: number;
}

const StudentGrade: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

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

  const [progressModalVisible, setProgressModalVisible] = useState<boolean>(false);
  const [totalAverageModalVisible, setTotalAverageModalVisible] = useState<boolean>(false);

  const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
  const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
  const [selectedTotalAverageSubjects, setSelectedTotalAverageSubjects] = useState<string[]>([]);
  const [showTotalAverageClassAverage, setShowTotalAverageClassAverage] = useState<boolean>(false);

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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
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

        console.log("Fetching student info with school and studentID:", userSchool, userPassword);
        const { data: student, error: studentError } = await supabase
          .from("student")
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

        console.log("Fetching class subjects:", student.className, userSchool);
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

        console.log("Class data:", classData);

        const fetchedSubjects: string[] = [];
        for (let i = 1; i <= 15; i++) {
          const sub = classData[`sub${i}` as keyof ClassData];
          if (sub && sub.trim() !== "") {
            fetchedSubjects.push(sub.trim());
          }
        }

        console.log("Fetched subjects:", fetchedSubjects);
        setSubjects(fetchedSubjects);
        setSelectedProgressSubjects(fetchedSubjects);
        setSelectedTotalAverageSubjects(fetchedSubjects);

        console.log("Fetching exam types...");
        const { data: examData, error: examError } = await supabase
          .from("exam")
          .select("subjectName, examType, columnNumber")
          .eq("school", userSchool)
          .in("subjectName", fetchedSubjects);

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
              subjectName: exam.subjectName,
              examType: exam.examType,
              columnNumber: exam.columnNumber,
              term: term,
              weight: weight,
            };
          })
          .filter((examType): examType is ExamType => examType !== null);

        const termWeightMap: { [key: string]: number } = {};
        examTypeList.forEach((examType) => {
          if (termWeightMap[examType.term]) {
            termWeightMap[examType.term] += examType.weight;
          } else {
            termWeightMap[examType.term] = examType.weight;
          }
        });

        const invalidTerms = Object.entries(termWeightMap).filter(
          ([, totalWeight]) => totalWeight !== 100
        );

        if (invalidTerms.length > 0) {
          console.error("Invalid weight distribution:", invalidTerms);
          throw new Error(
            "Invalid weight distribution. Weights must sum up to 100 points per term."
          );
        }

        examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
        setExamTypes(examTypeList);

        console.log("Fetching subject sheet names...");
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

        console.log("Subject to Sheet Map:", subjectSheetMap);

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

          const subjectExams = examTypeList.filter(
            (exam) =>
              exam.term === selectedTerm && exam.subjectName === subject
          );

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

              otherStudentsData.forEach((otherStudentRow) => {
                const otherMark = otherStudentRow[columnName];
                let numericMark: number | null = null;
                if (typeof otherMark === "number") numericMark = otherMark;
                else if (typeof otherMark === "string") {
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
            );
            if (validClassAverages.length > 0) {
              const avg =
                validClassAverages.reduce((a, b) => a + b, 0) /
                validClassAverages.length;
              classAverage = avg.toFixed(1);
            }
          }

          gradesData.push({
            subject,
            classAverage,
            average,
            examMarks,
            classExamMarks,
          });
        }

        console.log("Final Grades Data:", gradesData);
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
    return grade.average;
  };

  const openProgressModal = () => {
    setProgressModalVisible(true);
  };

  const closeProgressModal = () => {
    setProgressModalVisible(false);
  };

  const openTotalAverageModal = () => {
    setTotalAverageModalVisible(true);
  };

  const closeTotalAverageModal = () => {
    setTotalAverageModalVisible(false);
  };

  const handleProgressSubjectToggle = (subject: string) => {
    setSelectedProgressSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleTotalAverageSubjectToggle = (subject: string) => {
    setSelectedTotalAverageSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

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

    const datasets: any[] = [
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

  // Separate function for graph button styling is no longer needed as styles are handled by CSS

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        className="back-button"
        onClick={() => navigate("/student")}
      >
        &#9664;
      </button>

      <div className="graph-buttons-container">
        <button
          className="graph-button"
          onClick={openProgressModal}
        >
          Progress 📈
        </button>
        <button
          className="graph-button total-average"
          onClick={openTotalAverageModal}
        >
          Total Average 📊
        </button>
      </div>

      <div className="card">
        <h1 className="title">{school}</h1>
        <h3 className="subheading">
          {className} - {section}
        </h3>

        <div className="dropdown-container">
          <label htmlFor="subject-select" className="label">
            Select Subject:
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="select"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-container">
          <label htmlFor="term-select" className="label">
            Select Term:
          </label>
          <select
            id="term-select"
            value={selectedTerm}
            onChange={handleTermChange}
            className="select"
          >
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Subjects</th>
                <th className="th">Total Class %</th>
                <th className="th">Average %</th>
                {displayExamTypes.map((exam) => (
                  <th key={exam} className="th">
                    {exam}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.subject}>
                  <td className="td">{grade.subject}</td>
                  <td className="td">
                    {grade.classAverage !== "-" ? `${grade.classAverage}%` : "-"}
                  </td>
                  <td className="td">{calculateAverage(grade)}</td>
                  {displayExamTypes.map((exam) => (
                    <td key={exam} className="td">
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

      {progressModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-modal" onClick={closeProgressModal}>
              &times;
            </span>
            <h2 className="modal-title">Progress Graph</h2>

            <div className="dropdown-container">
              <label htmlFor="modal-term-select" className="label">
                Select Term:
              </label>
              <select
                id="modal-term-select"
                value={selectedTerm}
                onChange={handleTermChange}
                className="select"
              >
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div className="legend-container">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className="legend-button"
                  style={{
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
                    className="color-box"
                    style={{
                      backgroundColor: getColor(subject),
                    }}
                  ></span>
                  {subject}
                </button>
              ))}

              <button
                className="legend-button"
                style={{
                  backgroundColor: showProgressClassAverage
                    ? "#6c757d"
                    : "#e9ecef",
                  color: showProgressClassAverage ? "white" : "black",
                }}
                onClick={() => setShowProgressClassAverage((prev) => !prev)}
              >
                <span
                  className="color-box"
                  style={{
                    backgroundColor: "#6c757d",
                  }}
                ></span>
                Class Average
              </button>
            </div>

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

      {totalAverageModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-modal" onClick={closeTotalAverageModal}>
              &times;
            </span>
            <h2 className="modal-title">Total Average Graph</h2>

            <div className="legend-container">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className="legend-button"
                  style={{
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
                    className="color-box"
                    style={{
                      backgroundColor: getColor(subject),
                    }}
                  ></span>
                  {subject}
                </button>
              ))}

              <button
                className="legend-button"
                style={{
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
                  className="color-box"
                  style={{
                    backgroundColor: "#6c757d",
                  }}
                ></span>
                Class Average
              </button>
            </div>

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
//           .from("profiles") // removed generic arguments
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
//           .from("student") // removed generic arguments
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
//           .from("class") // removed generic arguments
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
//           .from("exam") // removed generic arguments
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
//           console.error(
//             "Invalid weight distribution:",
//             invalidTerms
//           );
//           throw new Error(
//             "Invalid weight distribution. Weights must sum up to 100 points per term."
//           );
//         }

//         examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
//         setExamTypes(examTypeList);

//         console.log("Fetching subject sheet names...");
//         const { data: subjectTableData, error: subjectTableError } = await supabase
//           .from("subjects") // removed generic arguments
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

//   // Separate function for graph button styling
//   const graphButton = (type: string): React.CSSProperties => ({
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
//   });

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
//       <button
//         style={styles.backButton}
//         onClick={() => navigate("/student")}
//       >
//         &#9664;
//       </button>

//       <div style={styles.graphButtonsContainer}>
//         <button
//           style={graphButton("Progress")}
//           onClick={openProgressModal}
//         >
//           Progress 📈
//         </button>
//         <button
//           style={graphButton("Total Average")}
//           onClick={openTotalAverageModal}
//         >
//           Total Average 📊
//         </button>
//       </div>

//       <div style={styles.card}>
//         <h1 style={styles.title}>{school}</h1>
//         <h3 style={styles.subheading}>
//           {className} - {section}
//         </h3>

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

//         <div style={styles.dropdownContainer}>
//           <label htmlFor="term-select" style={styles.label}>
//             Select Term:
//           </label>
//           <select
//             id="term-select"
//             value={selectedTerm}
//             onChange={handleTermChange}
//             style={styles.select}
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
//                     {grade.classAverage !== "-" ? `${grade.classAverage}%` : "-"}
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

//       {progressModalVisible && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={closeProgressModal}>
//               &times;
//             </span>
//             <h2 style={styles.modalTitle}>Progress Graph</h2>

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

//               <button
//                 style={{
//                   ...styles.legendButton,
//                   backgroundColor: showProgressClassAverage
//                     ? "#6c757d"
//                     : "#e9ecef",
//                   color: showProgressClassAverage ? "white" : "black",
//                 }}
//                 onClick={() => setShowProgressClassAverage((prev) => !prev)}
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

//       {totalAverageModalVisible && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <span style={styles.closeModal} onClick={closeTotalAverageModal}>
//               &times;
//             </span>
//             <h2 style={styles.modalTitle}>Total Average Graph</h2>

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
//     maxWidth: "1320px",
//     textAlign: "center",
//     position: "relative",
//     marginTop: "20px",
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
//     flexDirection: "column",
//     alignItems: "flex-start",
//     gap: "3px",
//     marginBottom: "14px",
//     marginTop: "10px",
//     width: "100%",
//   },
//   label: {
//     marginRight: "10px",
//     marginBottom: "0px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "black",
//   },
//   select: {
//     width: "100%",
//     maxWidth: "100%",
//     padding: "4px",
//     fontSize: "18px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//     flex: "1",
//   },
//   tableContainer: {
//     overflowX: "auto",
//     marginTop: "30px",
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
//     top: "45px",
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
//     marginBottom: "10px",
//     top: "50px",
//     right: "250px",
//     display: "flex",
//     gap: "0px",
//     zIndex: 1000,
//   },
//   modalOverlay: {
//     position: "fixed",
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
//     position: "relative",
//   },
//   closeModal: {
//     position: "absolute",
//     top: "10px",
//     right: "20px",
//     fontSize: "28px",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
//   modalTitle: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   legendContainer: {
//     display: "flex",
//     flexWrap: "wrap",
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
//   } as React.CSSProperties,
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
