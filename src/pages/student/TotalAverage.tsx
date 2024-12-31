// File: TotalAverage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend as ChartLegend,
  ChartOptions,
} from "chart.js";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import "./TotalAverage.css"; // Ensure this file includes your necessary styles
import { useSession } from "../../context/SessionContext"; // For the logged-in user session

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartLegend);

// ---- Interfaces ----
interface GradeData {
  subject: string;
  classAverage: string;             // e.g. "55.2" or "-"
  average: string;                  // e.g. "60.0" or "-"
  examMarks: { [key: string]: number | string };
  classExamMarks?: { [key: string]: number }; // e.g. { "Mid Term": 55, "Final": 60 }
}

interface ExamType {
  examType: string;     // e.g. "First Term (10 pts)"
  columnNumber: number; // e.g. 1, 2, 3...
  term: string;         // e.g. "First Term"
  weight: number;       // e.g. 10
}

interface ClassData {
  class: string;
  [key: string]: any; // for sub1, sub2... etc
}

const TotalAverage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession(); // Access the current user's session

  // ----- State -----
  const [school, setSchool] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Chart/Selection Toggles
  const [showGridline, setShowGridline] = useState<boolean>(true);
  const [showStudentAverage, setShowStudentAverage] = useState<boolean>(true);
  const [showClassAverage, setShowClassAverage] = useState<boolean>(true);

  // Allow the user to pick from "First Term", "Second Term", "Retakes", etc.
  const terms = ["First Term", "Second Term", "Retakes"];
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term");

  // Track which subjects are selected for the bar chart
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // ---- Helper Functions ----
  const extractTerm = (examTypeName: string): string | null => {
    // Looks for "First Term", "Second Term", or "Retakes" in examTypeName
    const termRegex = /(First Term|Second Term|Retakes)/i;
    const match = examTypeName.match(termRegex);
    return match ? match[1] : null;
  };

  const extractWeight = (examTypeName: string): number | null => {
    // Looks for something like "(10 pts)" or "(10 pt)" in examTypeName
    const weightRegex = /\((\d+)\s*pts?\)/i;
    const match = examTypeName.match(weightRegex);
    return match ? parseInt(match[1], 10) : null;
  };

  const mapColumnNumberToColumnName = (columnNumber: number): string => {
    // If your table columns are literally named "1", "2", "3" ...
    return `${columnNumber}`;
  };

  // ---- Fetch Data Based on selectedTerm ----
  const fetchData = async (newTerm: string) => {
    try {
      setLoading(true);
      setError("");

      // 1) Ensure we have a logged in user
      if (!session || !session.user) {
        throw new Error("No user session found. Please log in.");
      }
      const userId = session.user.id;

      // 2) Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("school, password")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Failed to fetch user profile.");
      }

      const userSchool = profile.school;
      const userPassword = profile.password;
      setSchool(userSchool);

      // 3) Fetch student info (className, section)
      const { data: student, error: studentError } = await supabase
        .from("student")
        .select("className, section")
        .eq("school", userSchool)
        .eq("studentID", userPassword)
        .single();

      if (studentError || !student) {
        throw new Error("Failed to fetch student record.");
      }

      setClassName(student.className);
      setSection(student.section);

      // 4) Fetch the list of subjects for this class
      const { data: classData, error: classError } = await supabase
        .from("class")
        .select("*") // sub1, sub2, ...
        .eq("class", student.className)
        .eq("school", userSchool)
        .single();

      if (classError || !classData) {
        throw new Error("Failed to fetch class data.");
      }

      // Extract sub1...sub15 from classData
      const fetchedSubjects: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const subKey = `sub${i}`;
        const subVal = classData[subKey];
        if (subVal && typeof subVal === "string" && subVal.trim() !== "") {
          fetchedSubjects.push(subVal.trim());
        }
      }

      setSubjects(fetchedSubjects);

      // If no subjects selected yet, default to all
      if (selectedSubjects.length === 0) {
        setSelectedSubjects(fetchedSubjects);
      }

      // 5) Fetch exam types that match the selected term
      const { data: examData, error: examError } = await supabase
        .from("exam")
        .select("examType, columnNumber")
        .eq("school", userSchool)
        .ilike("examType", `%${newTerm}%`); // Filter e.g. "First Term", "Second Term"

      if (examError || !examData) {
        throw new Error("Failed to fetch exam types for this term.");
      }

      const examTypeList: ExamType[] = examData
        .map((exam) => {
          const term = extractTerm(exam.examType);
          const weight = extractWeight(exam.examType);
          if (!term || weight === null) return null;
          return {
            examType: exam.examType,
            columnNumber: exam.columnNumber,
            term,
            weight,
          };
        })
        .filter((et): et is ExamType => et !== null);

      // Sort by columnNumber ascending
      examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
      setExamTypes(examTypeList);

      // 6) We need the sheetName for each subject from "subjects" table
      const { data: subjectTables, error: subjectTablesError } = await supabase
        .from("subjects")
        .select("subjectName, sheetName")
        .eq("school", userSchool)
        .in("subjectName", fetchedSubjects);

      if (subjectTablesError || !subjectTables) {
        throw new Error("Failed to fetch subject sheet mappings.");
      }

      // Create a map from subject => sheetName
      const subjectSheetMap: { [key: string]: string } = {};
      subjectTables.forEach((item) => {
        subjectSheetMap[item.subjectName] = item.sheetName;
      });

      // 7) For each subject, fetch user’s row & compute user/class average
      const newGradesData: GradeData[] = [];

      for (const subject of fetchedSubjects) {
        const sheetName = subjectSheetMap[subject];
        if (!sheetName) {
          // If no sheet is found, store placeholder
          newGradesData.push({
            subject,
            classAverage: "-",
            average: "-",
            examMarks: {},
          });
          continue;
        }

        // 7a) Fetch user’s row in the subject’s sheet
        const { data: userRow, error: userRowError } = await supabase
          .from(sheetName)
          .select("*")
          .eq("studentID", userPassword)
          .eq("school", userSchool)
          .single();

        if (userRowError || !userRow) {
          newGradesData.push({
            subject,
            classAverage: "-",
            average: "-",
            examMarks: {},
          });
          continue;
        }

        // 7b) Filter exam types to only those for the chosen term
        const termExamTypes = examTypeList.filter(
          (et) => et.term === newTerm
        );

        // We'll store exam marks in an object
        const examMarks: { [key: string]: number | string } = {};
        const classExamMarks: { [key: string]: number } = {};

        // Weighted average calculation
        let sumWeightedMarks = 0;
        let sumWeights = 0;
        let markCount = 0;
        let singleMark = 0; // if only 1 mark found

        // 7c) Loop through exam types for that term
        termExamTypes.forEach((exam) => {
          const columnName = mapColumnNumberToColumnName(exam.columnNumber);
          const mark = userRow[columnName];

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
            examMarks[exam.examType] = mark ?? "-";
          }
        });

        // 7d) Final average
        let userAvg: string = "-";
        if (markCount >= 2 && sumWeights > 0) {
          userAvg = (sumWeightedMarks / sumWeights).toFixed(1);
        } else if (markCount === 1) {
          userAvg = singleMark.toString();
        }

        // 7e) Compute class average
        let classAverage = "-";

        // 7f) Grab all "other" students' rows for this subject
        const { data: otherStudentsData, error: otherStudentsError } = await supabase
          .from(sheetName)
          .select("*")
          .eq("className", className)
          .eq("school", userSchool)
          .neq("studentID", userPassword);

        if (!otherStudentsError && otherStudentsData && otherStudentsData.length > 0) {
          // For each exam type in the term
          termExamTypes.forEach((exam) => {
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

              if (numericMark !== null) {
                marks.push(numericMark);
              }
            });

            if (marks.length > 0) {
              const sum = marks.reduce((a, b) => a + b, 0);
              const avg = sum / marks.length;
              classExamMarks[exam.examType] = parseFloat(avg.toFixed(1));
            } else {
              classExamMarks[exam.examType] = NaN; // or 0
            }
          });

          // If at least one exam had a valid average
          const validAverages = Object.values(classExamMarks).filter(
            (val) => !isNaN(val)
          ) as number[];

          if (validAverages.length > 0) {
            const finalAvg = 
              validAverages.reduce((a, b) => a + b, 0) /
              validAverages.length;
            classAverage = finalAvg.toFixed(1);
          }
        }

        // 7g) Push final data
        newGradesData.push({
          subject,
          classAverage,
          average: userAvg,
          examMarks,
          classExamMarks,
        });
      }

      setGrades(newGradesData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error in fetchData:", err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // ---- On component mount or whenever selectedTerm changes ----
  useEffect(() => {
    if (!session) {
      // If not logged in, go to login
      navigate("/sign-in");
      return;
    }

    // Fetch data for the newly selected term
    fetchData(selectedTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTerm, session]);

  // ---- Handler: Subject Toggle (NO limit) ----
  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      // Remove it
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      // Add it
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // ---- Handler: Deselect All ----
  const handleDeselectAll = () => {
    setSelectedSubjects([]);
  };

  // ---- Handler: Class Average toggle (no restrictions) ----
  const handleClassAverageToggle = () => {
    setShowClassAverage((prev) => !prev);
  };

  // ---- Handler: Student Average toggle ----
  const handleStudentAverageToggle = () => {
    setShowStudentAverage((prev) => !prev);
  };

  // ---- Handler: Gridline toggle ----
  const handleGridlineToggle = () => {
    setShowGridline((prev) => !prev);
  };

  // ---- Handler: Term Selection ----
  const handleTermChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTerm = e.target.value;
    setSelectedTerm(newTerm);
    // No need to manually call fetchData here, 
    // because the useEffect on selectedTerm will automatically do it.
  };

  // ---- Prepare Chart Data ----
  const prepareChartData = () => {
    const labels = selectedSubjects; // x-axis are the selected subjects

    // Build arrays for each dataset
    // 1) Student average
    const studentAverages = labels.map((subject) => {
      const found = grades.find((g) => g.subject === subject);
      if (!found || found.average === "-" || !found.average) return 0;
      return parseFloat(found.average);
    });

    // 2) Class average
    const classAverages = labels.map((subject) => {
      const found = grades.find((g) => g.subject === subject);
      if (!found || found.classAverage === "-" || !found.classAverage) return 0;
      return parseFloat(found.classAverage);
    });

    // We can set dynamic bar thickness if you like
    const barThickness = 30; // or compute based on selectedSubjects.length

    const datasets = [];
    if (showStudentAverage) {
      datasets.push({
        label: "Student Average",
        data: studentAverages,
        backgroundColor: "#36A2EB", // Blue
        barThickness,
      });
    }
    if (showClassAverage) {
      datasets.push({
        label: "Class Average",
        data: classAverages,
        backgroundColor: "#FF6384", // Pink
        barThickness,
      });
    }

    return {
      labels,
      datasets,
    };
  };

  // ---- Chart Options ----
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#c3c3c3",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Average Marks (%)",
          color: "#c3c3c3",
          font: {
            size: 16,
          },
        },
        grid: {
          display: showGridline,
          color: "rgba(195, 195, 195, 0.2)",
          lineWidth: 1,
        },
        ticks: {
          stepSize: 10,
          color: "#c3c3c3",
          font: {
            size: 12,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Subjects",
          color: "#c3c3c3",
          font: {
            size: 16,
          },
        },
        ticks: {
          color: "#c3c3c3",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false, // Hide vertical lines
        },
      },
    },
  };

  const chartData = prepareChartData();

  // ---- Rendering ----
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
    <Container fluid className="total-average-container p-3">
      {/* Back Button */}
      <Row className="mb-3 justify-content-center">
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            &#9664; Back
          </Button>
        </Col>
      </Row>

      {/* Title and Selected Term */}
      <Row className="mb-4 justify-content-center">
        <Col xs="auto" className="text-center">
          <h2 className="total-average-title">Total Average Graph</h2>
          <h5 className="text-muted">Term: {selectedTerm}</h5>
        </Col>
      </Row>

      {/* Term Selection Dropdown */}
      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={6}>
          <Form.Group controlId="term-select">
            <Form.Label>Select Term:</Form.Label>
            <Form.Select
              value={selectedTerm}
              onChange={handleTermChange}
              className="form-select"
            >
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Chart Container */}
      <Row>
        <Col xs={12}>
          <div className="chart-container" style={{ height: "400px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Col>
      </Row>

      {/* Custom Legend / Toggles */}
      <Row className="mt-4 justify-content-center">
        <Col xs={12} md={8}>
          <div className="custom-legend d-flex flex-column gap-3">
            {/* Toggle Gridlines */}
            <Form.Check
              type="checkbox"
              id="gridline-toggle"
              label="Show Gridlines"
              checked={showGridline}
              onChange={handleGridlineToggle}
              className="legend-item"
            />

            {/* Toggle Student Average */}
            <Form.Check
              type="checkbox"
              id="student-average-toggle"
              label="Show Student Average"
              checked={showStudentAverage}
              onChange={handleStudentAverageToggle}
              className="legend-item"
            />

            {/* Toggle Class Average */}
            <Form.Check
              type="checkbox"
              id="class-average-toggle"
              label="Show Class Average"
              checked={showClassAverage}
              onChange={handleClassAverageToggle}
              className="legend-item"
            />

            {/* Subjects Selection */}
            <h5 className="legend-title mt-3">Subjects</h5>
            <div className="subjects-legend d-flex flex-column gap-1"> {/* Reduced gap */}
              {subjects.map((sub) => (
                <Form.Check
                  key={sub}
                  type="checkbox"
                  id={`subject-toggle-${sub}`}
                  label={sub}
                  checked={selectedSubjects.includes(sub)}
                  onChange={() => handleSubjectToggle(sub)}
                  className="legend-item"
                />
              ))}
            </div>
            <Button
              variant="link"
              className="p-0 mt-2"
              onClick={handleDeselectAll}
            >
              Deselect All Subjects
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TotalAverage;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend as ChartLegend,
//   ChartOptions,
// } from "chart.js";
// import {
//   Container,
//   Button,
//   Spinner,
//   Alert,
//   Row,
//   Col,
//   Form,
// } from "react-bootstrap";
// import "./TotalAverage.css"; // Ensure this file includes your necessary styles
// import { useSession } from "../../context/SessionContext"; // For the logged-in user session

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartLegend);

// // ---- Interfaces ----
// interface GradeData {
//   subject: string;
//   classAverage: string;             // e.g. "55.2" or "-"
//   average: string;                  // e.g. "60.0" or "-"
//   examMarks: { [key: string]: number | string };
//   classExamMarks?: { [key: string]: number }; // e.g. { "Mid Term": 55, "Final": 60 }
// }

// interface ExamType {
//   examType: string;     // e.g. "First Term (10 pts)"
//   columnNumber: number; // e.g. 1, 2, 3...
//   term: string;         // e.g. "First Term"
//   weight: number;       // e.g. 10
// }

// interface ClassData {
//   class: string;
//   [key: string]: any; // for sub1, sub2... etc
// }

// const TotalAverage: React.FC = () => {
//   const navigate = useNavigate();
//   const { session } = useSession(); // Access the current user's session

//   // ----- State -----
//   const [school, setSchool] = useState<string>("");
//   const [className, setClassName] = useState<string>("");
//   const [section, setSection] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [grades, setGrades] = useState<GradeData[]>([]);
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   // Chart/Selection Toggles
//   const [showGridline, setShowGridline] = useState<boolean>(true);
//   const [showStudentAverage, setShowStudentAverage] = useState<boolean>(true);
//   const [showClassAverage, setShowClassAverage] = useState<boolean>(true);

//   // Allow the user to pick from "First Term", "Second Term", "Retakes", etc.
//   const terms = ["First Term", "Second Term", "Retakes"];
//   const [selectedTerm, setSelectedTerm] = useState<string>("First Term");

//   // Track which subjects are selected for the bar chart
//   const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

//   // ---- Helper Functions ----
//   const extractTerm = (examTypeName: string): string | null => {
//     // Looks for "First Term", "Second Term", or "Retakes" in examTypeName
//     const termRegex = /(First Term|Second Term|Retakes)/i;
//     const match = examTypeName.match(termRegex);
//     return match ? match[1] : null;
//   };

//   const extractWeight = (examTypeName: string): number | null => {
//     // Looks for something like "(10 pts)" or "(10 pt)" in examTypeName
//     const weightRegex = /\((\d+)\s*pts?\)/i;
//     const match = examTypeName.match(weightRegex);
//     return match ? parseInt(match[1], 10) : null;
//   };

//   const mapColumnNumberToColumnName = (columnNumber: number): string => {
//     // If your table columns are literally named "1", "2", "3" ...
//     return `${columnNumber}`;
//   };

//   // ---- Fetch Data Based on selectedTerm ----
//   const fetchData = async (newTerm: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       // 1) Ensure we have a logged in user
//       if (!session || !session.user) {
//         throw new Error("No user session found. Please log in.");
//       }
//       const userId = session.user.id;

//       // 2) Fetch user profile
//       const { data: profile, error: profileError } = await supabase
//         .from("profiles")
//         .select("school, password")
//         .eq("id", userId)
//         .single();

//       if (profileError || !profile) {
//         throw new Error("Failed to fetch user profile.");
//       }

//       const userSchool = profile.school;
//       const userPassword = profile.password;
//       setSchool(userSchool);

//       // 3) Fetch student info (className, section)
//       const { data: student, error: studentError } = await supabase
//         .from("student")
//         .select("className, section")
//         .eq("school", userSchool)
//         .eq("studentID", userPassword)
//         .single();

//       if (studentError || !student) {
//         throw new Error("Failed to fetch student record.");
//       }

//       setClassName(student.className);
//       setSection(student.section);

//       // 4) Fetch the list of subjects for this class
//       const { data: classData, error: classError } = await supabase
//         .from("class")
//         .select("*") // sub1, sub2, ...
//         .eq("class", student.className)
//         .eq("school", userSchool)
//         .single();

//       if (classError || !classData) {
//         throw new Error("Failed to fetch class data.");
//       }

//       // Extract sub1...sub15 from classData
//       const fetchedSubjects: string[] = [];
//       for (let i = 1; i <= 15; i++) {
//         const subKey = `sub${i}`;
//         const subVal = classData[subKey];
//         if (subVal && typeof subVal === "string" && subVal.trim() !== "") {
//           fetchedSubjects.push(subVal.trim());
//         }
//       }

//       setSubjects(fetchedSubjects);

//       // If no subjects selected yet, default to all
//       if (selectedSubjects.length === 0) {
//         setSelectedSubjects(fetchedSubjects);
//       }

//       // 5) Fetch exam types that match the selected term
//       const { data: examData, error: examError } = await supabase
//         .from("exam")
//         .select("examType, columnNumber")
//         .eq("school", userSchool)
//         .ilike("examType", `%${newTerm}%`); // Filter e.g. "First Term", "Second Term"

//       if (examError || !examData) {
//         throw new Error("Failed to fetch exam types for this term.");
//       }

//       const examTypeList: ExamType[] = examData
//         .map((exam) => {
//           const term = extractTerm(exam.examType);
//           const weight = extractWeight(exam.examType);
//           if (!term || weight === null) return null;
//           return {
//             examType: exam.examType,
//             columnNumber: exam.columnNumber,
//             term,
//             weight,
//           };
//         })
//         .filter((et): et is ExamType => et !== null);

//       // Sort by columnNumber ascending
//       examTypeList.sort((a, b) => a.columnNumber - b.columnNumber);
//       setExamTypes(examTypeList);

//       // 6) We need the sheetName for each subject from "subjects" table
//       const { data: subjectTables, error: subjectTablesError } = await supabase
//         .from("subjects")
//         .select("subjectName, sheetName")
//         .eq("school", userSchool)
//         .in("subjectName", fetchedSubjects);

//       if (subjectTablesError || !subjectTables) {
//         throw new Error("Failed to fetch subject sheet mappings.");
//       }

//       // Create a map from subject => sheetName
//       const subjectSheetMap: { [key: string]: string } = {};
//       subjectTables.forEach((item) => {
//         subjectSheetMap[item.subjectName] = item.sheetName;
//       });

//       // 7) For each subject, fetch user’s row & compute user/class average
//       const newGradesData: GradeData[] = [];

//       for (const subject of fetchedSubjects) {
//         const sheetName = subjectSheetMap[subject];
//         if (!sheetName) {
//           // If no sheet is found, store placeholder
//           newGradesData.push({
//             subject,
//             classAverage: "-",
//             average: "-",
//             examMarks: {},
//           });
//           continue;
//         }

//         // 7a) Fetch user’s row in the subject’s sheet
//         const { data: userRow, error: userRowError } = await supabase
//           .from(sheetName)
//           .select("*")
//           .eq("studentID", userPassword)
//           .eq("school", userSchool)
//           .single();

//         if (userRowError || !userRow) {
//           newGradesData.push({
//             subject,
//             classAverage: "-",
//             average: "-",
//             examMarks: {},
//           });
//           continue;
//         }

//         // 7b) Filter exam types to only those for the chosen term
//         const termExamTypes = examTypeList.filter(
//           (et) => et.term === newTerm
//         );

//         // We'll store exam marks in an object
//         const examMarks: { [key: string]: number | string } = {};
//         const classExamMarks: { [key: string]: number } = {};

//         // Weighted average calculation
//         let sumWeightedMarks = 0;
//         let sumWeights = 0;
//         let markCount = 0;
//         let singleMark = 0; // if only 1 mark found

//         // 7c) Loop through exam types for that term
//         termExamTypes.forEach((exam) => {
//           const colName = mapColumnNumberToColumnName(exam.columnNumber);
//           const mark = userRow[colName];

//           let numericMark: number | null = null;
//           if (typeof mark === "number") {
//             numericMark = mark;
//           } else if (typeof mark === "string") {
//             const parsed = parseFloat(mark);
//             if (!isNaN(parsed)) numericMark = parsed;
//           }

//           if (numericMark !== null) {
//             examMarks[exam.examType] = numericMark;
//             sumWeightedMarks += numericMark * exam.weight;
//             sumWeights += exam.weight;
//             markCount += 1;
//             if (markCount === 1) singleMark = numericMark;
//           } else {
//             examMarks[exam.examType] = mark ?? "-";
//           }
//         });

//         // 7d) Final average
//         let userAvg: string = "-";
//         if (markCount >= 2 && sumWeights > 0) {
//           userAvg = (sumWeightedMarks / sumWeights).toFixed(1);
//         } else if (markCount === 1) {
//           userAvg = singleMark.toString();
//         }

//         // 7e) Compute class average
//         let classAverage = "-";

//         // 7f) Grab all "other" students' rows for this subject
//         const { data: otherStudentsData, error: otherStudentsError } = await supabase
//           .from(sheetName)
//           .select("*")
//           .eq("school", userSchool)
//           .eq("className", student.className)
//           .neq("studentID", userPassword);

//         if (!otherStudentsError && otherStudentsData && otherStudentsData.length > 0) {
//           // For each exam type in the term
//           termExamTypes.forEach((exam) => {
//             const colName = mapColumnNumberToColumnName(exam.columnNumber);
//             const marks: number[] = [];

//             otherStudentsData.forEach((row) => {
//               const otherMark = row[colName];
//               let numericMark: number | null = null;

//               if (typeof otherMark === "number") {
//                 numericMark = otherMark;
//               } else if (typeof otherMark === "string") {
//                 const parsed = parseFloat(otherMark);
//                 if (!isNaN(parsed)) numericMark = parsed;
//               }

//               if (numericMark !== null) {
//                 marks.push(numericMark);
//               }
//             });

//             if (marks.length > 0) {
//               const sum = marks.reduce((a, b) => a + b, 0);
//               const avg = sum / marks.length;
//               classExamMarks[exam.examType] = parseFloat(avg.toFixed(1));
//             } else {
//               classExamMarks[exam.examType] = NaN; // or 0
//             }
//           });

//           // If at least one exam had a valid average
//           const validAverages = Object.values(classExamMarks).filter(
//             (val) => !isNaN(val)
//           ) as number[];

//           if (validAverages.length > 0) {
//             const finalAvg = 
//               validAverages.reduce((a, b) => a + b, 0) / validAverages.length;
//             classAverage = finalAvg.toFixed(1);
//           }
//         }

//         // 7g) Push final data
//         newGradesData.push({
//           subject,
//           classAverage,
//           average: userAvg,
//           examMarks,
//           classExamMarks,
//         });
//       }

//       setGrades(newGradesData);
//       setLoading(false);
//     } catch (err: any) {
//       console.error("Error in fetchData:", err);
//       setError(err.message || "An unexpected error occurred.");
//       setLoading(false);
//     }
//   };

//   // ---- On component mount or whenever selectedTerm changes ----
//   useEffect(() => {
//     if (!session) {
//       // If not logged in, go to login
//       navigate("/sign-in");
//       return;
//     }

//     // Fetch data for the newly selected term
//     fetchData(selectedTerm);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTerm, session]);

//   // ---- Handler: Subject Toggle (NO limit) ----
//   const handleSubjectToggle = (subject: string) => {
//     if (selectedSubjects.includes(subject)) {
//       // Remove it
//       setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
//     } else {
//       // Add it
//       setSelectedSubjects([...selectedSubjects, subject]);
//     }
//   };

//   // ---- Handler: Deselect All ----
//   const handleDeselectAll = () => {
//     setSelectedSubjects([]);
//   };

//   // ---- Handler: Class Average toggle (no restrictions) ----
//   const handleClassAverageToggle = () => {
//     setShowClassAverage((prev) => !prev);
//   };

//   // ---- Handler: Student Average toggle ----
//   const handleStudentAverageToggle = () => {
//     setShowStudentAverage((prev) => !prev);
//   };

//   // ---- Handler: Gridline toggle ----
//   const handleGridlineToggle = () => {
//     setShowGridline((prev) => !prev);
//   };

//   // ---- Handler: Term Selection ----
//   const handleTermChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newTerm = e.target.value;
//     setSelectedTerm(newTerm);
//     // No need to manually call fetchData here, 
//     // because the useEffect on selectedTerm will automatically do it.
//   };

//   // ---- Prepare Chart Data ----
//   const prepareChartData = () => {
//     const labels = selectedSubjects; // x-axis are the selected subjects

//     // Build arrays for each dataset
//     // 1) Student average
//     const studentAverages = labels.map((subject) => {
//       const found = grades.find((g) => g.subject === subject);
//       if (!found || found.average === "-" || !found.average) return 0;
//       return parseFloat(found.average);
//     });

//     // 2) Class average
//     const classAverages = labels.map((subject) => {
//       const found = grades.find((g) => g.subject === subject);
//       if (!found || found.classAverage === "-" || !found.classAverage) return 0;
//       return parseFloat(found.classAverage);
//     });

//     // We can set dynamic bar thickness if you like
//     const barThickness = 30; // or compute based on selectedSubjects.length

//     const datasets = [];
//     if (showStudentAverage) {
//       datasets.push({
//         label: "Student Average",
//         data: studentAverages,
//         backgroundColor: "#36A2EB", // Blue
//         barThickness,
//       });
//     }
//     if (showClassAverage) {
//       datasets.push({
//         label: "Class Average",
//         data: classAverages,
//         backgroundColor: "#FF6384", // Pink
//         barThickness,
//       });
//     }

//     return {
//       labels,
//       datasets,
//     };
//   };

//   // ---- Chart Options ----
//   const chartOptions: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: "bottom",
//         labels: {
//           color: "#c3c3c3",
//           font: {
//             size: 14,
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//         title: {
//           display: true,
//           text: "Average Marks (%)",
//           color: "#c3c3c3",
//           font: {
//             size: 16,
//           },
//         },
//         grid: {
//           display: showGridline,
//           color: "rgba(195, 195, 195, 0.2)",
//           lineWidth: 1,
//         },
//         ticks: {
//           stepSize: 10,
//           color: "#c3c3c3",
//           font: {
//             size: 12,
//           },
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Subjects",
//           color: "#c3c3c3",
//           font: {
//             size: 16,
//           },
//         },
//         ticks: {
//           color: "#c3c3c3",
//           font: {
//             size: 12,
//           },
//         },
//         grid: {
//           display: false, // Hide vertical lines
//         },
//       },
//     },
//   };

//   const chartData = prepareChartData();

//   // ---- Rendering ----
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
//     <Container fluid className="total-average-container p-3">
//       {/* Back Button */}
//       <Row className="mb-3 justify-content-center">
//         <Col xs="auto">
//           <Button variant="secondary" onClick={() => navigate(-1)}>
//             &#9664; Back
//           </Button>
//         </Col>
//       </Row>

//       {/* Title and Selected Term */}
//       <Row className="mb-4 justify-content-center">
//         <Col xs="auto" className="text-center">
//           <h2 className="total-average-title">Total Average Graph</h2>
//           <h5 className="text-muted">Term: {selectedTerm}</h5>
//         </Col>
//       </Row>

//       {/* Term Selection Dropdown */}
//       <Row className="mb-4 justify-content-center">
//         <Col xs={12} md={6}>
//           <Form.Group controlId="term-select">
//             <Form.Label>Select Term:</Form.Label>
//             <Form.Select
//               value={selectedTerm}
//               onChange={handleTermChange}
//               className="form-select"
//             >
//               {terms.map((term) => (
//                 <option key={term} value={term}>
//                   {term}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {/* Chart Container */}
//       <Row>
//         <Col xs={12}>
//           <div className="chart-container" style={{ height: "400px" }}>
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//         </Col>
//       </Row>

//       {/* Custom Legend / Toggles */}
//       <Row className="mt-4 justify-content-center">
//         <Col xs={12} md={8}>
//           <div className="custom-legend d-flex flex-column gap-3">
//             {/* Toggle Gridlines */}
//             <Form.Check
//               type="checkbox"
//               id="gridline-toggle"
//               label="Show Gridlines"
//               checked={showGridline}
//               onChange={handleGridlineToggle}
//             />

//             {/* Toggle Student Average */}
//             <Form.Check
//               type="checkbox"
//               id="student-average-toggle"
//               label="Show Student Average"
//               checked={showStudentAverage}
//               onChange={handleStudentAverageToggle}
//             />

//             {/* Toggle Class Average */}
//             <Form.Check
//               type="checkbox"
//               id="class-average-toggle"
//               label="Show Class Average"
//               checked={showClassAverage}
//               onChange={handleClassAverageToggle}
//             />

//             {/* Subjects Selection */}
//             <h5 className="legend-title mt-3">Subjects</h5>
//             {subjects.map((sub) => (
//               <Form.Check
//                 key={sub}
//                 type="checkbox"
//                 id={`subject-toggle-${sub}`}
//                 label={sub}
//                 checked={selectedSubjects.includes(sub)}
//                 onChange={() => handleSubjectToggle(sub)}
//               />
//             ))}
//             <Button
//               variant="link"
//               className="p-0 mt-2"
//               onClick={handleDeselectAll}
//             >
//               Deselect All Subjects
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TotalAverage;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend as ChartLegend,
//   ChartOptions,
// } from "chart.js";
// import {
//   Container,
//   Button,
//   Spinner,
//   Alert,
//   Row,
//   Col,
//   Form,
// } from "react-bootstrap";
// import "./TotalAverage.css"; // Ensure this file includes necessary styles

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartLegend);

// // Interfaces
// interface GradeData {
//   subject: string;
//   classAverage: string;
//   average: string;
//   examMarks: { [key: string]: number | string };
//   classExamMarks?: { [key: string]: number };
// }

// interface LocationState {
//   selectedSubjects: string[];
//   showClassAverage: boolean;
//   grades: GradeData[];
//   selectedTerm: string; // Optional
// }

// const TotalAverage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const state = location.state as LocationState;

//   // Destructure passed state with default values
//   const {
//     selectedSubjects: initialSelectedSubjects = [],
//     showClassAverage: initialShowClassAverage = true,
//     grades = [],
//     selectedTerm, // Optional
//   } = state || {};

//   // State Hooks for Toggles
//   const [showGridline, setShowGridline] = useState<boolean>(true);
//   const [showStudentAverage, setShowStudentAverage] = useState<boolean>(true);
//   const [showClassAverage, setShowClassAverage] = useState<boolean>(
//     initialShowClassAverage
//   );
//   const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
//     initialSelectedSubjects.length > 0 ? initialSelectedSubjects : grades.map(g => g.subject)
//   );

//   // State for Y-Axis Labels
//   const [yAxisLabels, setYAxisLabels] = useState<number[]>([]);

//   // Initialize Y-Axis Labels
//   useEffect(() => {
//     const labels = [];
//     for (let i = 100; i >= 0; i -= 10) {
//       labels.push(i);
//     }
//     setYAxisLabels(labels);
//   }, []);

//   // Handle cases where state might be undefined or data is missing
//   if (!state || !grades || selectedSubjects.length === 0) {
//     return (
//       <Container
//         className="d-flex flex-column align-items-center justify-content-center"
//         style={{ height: "100vh" }}
//       >
//         <Alert variant="danger">
//           No data available. Please navigate from the Student Grade page.
//         </Alert>
//         <Button variant="primary" onClick={() => navigate("/student")}>
//           Go Back
//         </Button>
//       </Container>
//     );
//   }

//   // Handler functions for toggles
//   const handleGridlineToggle = () => {
//     setShowGridline((prev) => !prev);
//   };

//   const handleStudentAverageToggle = () => {
//     setShowStudentAverage((prev) => !prev);
//   };

//   const handleClassAverageToggle = () => {
//     setShowClassAverage((prev) => !prev);
//   };

//   const handleSubjectToggle = (subject: string) => {
//     setSelectedSubjects((prev) =>
//       prev.includes(subject)
//         ? prev.filter((s) => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   const handleDeselectAll = () => {
//     setSelectedSubjects([]);
//   };

//   // Function to calculate bar thickness based on the number of selected subjects
//   const calculateBarThickness = () => {
//     const maxBarThickness = 50;
//     const minBarThickness = 20; // Increased minimum thickness for better visibility
//     const numSubjects = selectedSubjects.length || 1;
//     const thickness = Math.max(
//       minBarThickness,
//       maxBarThickness - numSubjects * 2
//     );
//     return thickness;
//   };

//   // Prepare Chart Data
//   const prepareTotalAverageChartData = () => {
//     const labels = selectedSubjects;
//     const studentAverages = selectedSubjects.map((subject) =>
//       grades.find((grade) => grade.subject === subject)?.average !== "-"
//         ? parseFloat(grades.find((grade) => grade.subject === subject)!.average)
//         : 0
//     );
//     const classAverages = selectedSubjects.map((subject) =>
//       grades.find((grade) => grade.subject === subject)?.classAverage !== "-"
//         ? parseFloat(
//             grades.find((grade) => grade.subject === subject)!.classAverage
//           )
//         : 0
//     );

//     const barThickness = calculateBarThickness();

//     const datasets = [];

//     if (showStudentAverage) {
//       datasets.push({
//         label: "Student Average",
//         data: studentAverages,
//         backgroundColor: "#36A2EB", // Blue color
//         barThickness: barThickness, // Dynamic thickness
//       });
//     }

//     if (showClassAverage) {
//       datasets.push({
//         label: "Class Average",
//         data: classAverages,
//         backgroundColor: "#FF6384", // Bright Pink color
//         barThickness: barThickness,
//       });
//     }

//     return {
//       labels: labels,
//       datasets: datasets,
//     };
//   };

//   // Chart Options
//   const chartOptions: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true, // Show legend
//         position: "bottom" as const, // Position legend at the bottom
//         labels: {
//           color: "#c3c3c3", // Match y-axis text color
//           font: {
//             size: 14,
//           },
//           usePointStyle: true,
//           pointStyle: "rectRounded",
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Average Marks (%)",
//           color: "#c3c3c3", // Y-axis title color
//           font: {
//             size: 16,
//           },
//         },
//         max: 100,
//         grid: {
//           display: showGridline,
//           color: "rgba(195, 195, 195, 0.2)", // Faint gridlines matching y-axis text color
//           lineWidth: 1,
//         },
//         ticks: {
//           stepSize: 10,
//           color: "#c3c3c3", // Y-axis labels color
//           font: {
//             size: 12,
//           },
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Subjects",
//           color: "#c3c3c3", // X-axis title color
//           font: {
//             size: 16,
//           },
//         },
//         ticks: {
//           color: "#c3c3c3", // X-axis labels color
//           font: {
//             size: 12,
//           },
//         },
//         grid: {
//           display: false, // Hide vertical gridlines
//         },
//       },
//     },
//   };

//   return (
//     <Container fluid className="total-average-container p-3">
//       {/* Back Button at the Top */}
//       <Row className="mb-3 justify-content-center">
//         <Col xs="auto">
//           <Button variant="secondary" onClick={() => navigate(-1)}>
//             &#9664; Back
//           </Button>
//         </Col>
//       </Row>

//       {/* Title and Selected Term */}
//       <Row className="mb-4 justify-content-center">
//         <Col xs="auto" className="text-center">
//           <h2 className="total-average-title">Total Average Graph</h2>
//           {selectedTerm && (
//             <h5 className="text-muted">Term: {selectedTerm}</h5>
//           )}
//         </Col>
//       </Row>

//       {/* Chart Container */}
//       <Row>
//         <Col xs={12}>
//           <div className="chart-container" style={{ height: "400px" }}>
//             <Bar data={prepareTotalAverageChartData()} options={chartOptions} />
//           </div>
//         </Col>
//       </Row>

//       {/* Custom Legend and Controls Underneath the Graph */}
//       <Row className="mt-4 justify-content-center">
//         <Col xs={12} md={8}>
//           <div className="custom-legend">
//             {/* Gridline Toggle */}
//             <Form.Check
//               type="checkbox"
//               id="gridline-toggle"
//               label="Show Gridlines"
//               checked={showGridline}
//               onChange={handleGridlineToggle}
//               className="legend-item"
//             />

//             {/* Class Average Toggle */}
//             <Form.Check
//               type="checkbox"
//               id="class-average-toggle"
//               label="Show Class Average"
//               checked={showClassAverage}
//               onChange={handleClassAverageToggle}
//               className="legend-item"
//             />

//             {/* Subjects Toggles */}
//             <div className="subjects-legend">
//               <h5 className="legend-title">Subjects</h5>
//               {grades.map((grade) => (
//                 <Form.Check
//                   key={grade.subject}
//                   type="checkbox"
//                   id={`subject-toggle-${grade.subject}`}
//                   label={grade.subject}
//                   checked={selectedSubjects.includes(grade.subject)}
//                   onChange={() => handleSubjectToggle(grade.subject)}
//                   className="legend-item"
//                 />
//               ))}
//               {/* Deselect All Subjects Button */}
//               <Button
//                 variant="link"
//                 className="mt-2 p-0 text-decoration-none"
//                 onClick={handleDeselectAll}
//               >
//                 Deselect All Subjects
//               </Button>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TotalAverage;
