
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Container, Button, Form, Spinner, Alert, Row, Col, Modal } from "react-bootstrap";
import "./TotalAverage.css"; // Reuse TotalAverage's CSS for consistency

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// Interfaces
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

interface Subject {
  subjectName: string;
  sheetName: string;
}

const ProgressGraph: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  // State Hooks
  const [school, setSchool] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("First Term");
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Subject Selection and Class Average Toggle
  const [selectedProgressSubjects, setSelectedProgressSubjects] = useState<string[]>([]);
  const [showProgressClassAverage, setShowProgressClassAverage] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const terms = ["First Term", "Second Term", "Retakes"];

  // Helper Functions
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
          const sub = classData[`sub${i}` as keyof typeof classData];
          if (sub && sub.trim() !== "") {
            fetchedSubjects.push(sub.trim());
          }
        }

        console.log("Fetched subjects:", fetchedSubjects);
        setSubjects(fetchedSubjects);
        setSelectedProgressSubjects(fetchedSubjects.slice(0, 1)); // Initialize with first subject

        console.log("Fetching exam types...");
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
            .eq("studentID", userPassword)
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

          // Since examTypes are global, no need to filter by subjectName
          const subjectExams = examTypeList.filter(
            (exam) => exam.term === selectedTerm
          ); // Use global examTypes filtered by term

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
            .neq("studentID", userPassword);

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

  // Handler Functions for Toggles and Alerts
  const handleProgressSubjectToggle = (subject: string) => {
    if (selectedProgressSubjects.includes(subject)) {
      // Remove the subject
      setSelectedProgressSubjects(selectedProgressSubjects.filter(s => s !== subject));
    } else {
      if (showProgressClassAverage) {
        // Allow only one subject when class average is on
        setSelectedProgressSubjects([subject]);
      } else {
        // Allow up to two subjects when class average is off
        if (selectedProgressSubjects.length < 2) {
          setSelectedProgressSubjects([...selectedProgressSubjects, subject]);
        }
      }
    }
  };

  const handleClassAverageToggle = () => {
    if (!showProgressClassAverage && selectedProgressSubjects.length > 1) {
      // Show alert if trying to enable class average with two subjects selected
      setShowAlert(true);
    } else {
      setShowProgressClassAverage(prev => {
        if (!prev && selectedProgressSubjects.length === 2) {
          // Reduce to one subject when enabling class average
          setSelectedProgressSubjects(selectedProgressSubjects.slice(0, 1));
        }
        return !prev;
      });
    }
  };

  const handleAlertClose = () => setShowAlert(false);

  // Prepare Chart Data
  const prepareProgressChartData = () => {
    // Filter grades based on selected subjects
    const selectedGrades = grades.filter(g => selectedProgressSubjects.includes(g.subject));

    // Collect all exam types from global examTypes
    const allExamTypesSet = new Set<string>();
    selectedGrades.forEach(grade => {
      examTypes.forEach(exam => {
        if (exam.term === selectedTerm && grade.examMarks[exam.examType] !== undefined) {
          allExamTypesSet.add(exam.examType);
        }
      });
    });
    const allExamTypes = Array.from(allExamTypesSet);

    // Sort exam types based on columnNumber
    allExamTypes.sort((a, b) => {
      const examA = examTypes.find(exam => exam.examType === a && exam.term === selectedTerm);
      const examB = examTypes.find(exam => exam.examType === b && exam.term === selectedTerm);
      if (examA && examB) {
        return examA.columnNumber - examB.columnNumber;
      }
      return 0;
    });

    // Prepare datasets for each subject
    const datasets = selectedGrades.map((grade, index) => {
      const data = allExamTypes.map(examType => {
        const mark = grade.examMarks[examType];
        return typeof mark === "number" ? mark : null;
      });

      return {
        label: grade.subject,
        data: data,
        borderColor: getSubjectColor(index),
        backgroundColor: getSubjectColor(index),
        fill: false,
        tension: 0.2, // Slight curve
        borderWidth: 2, // Thinner lines
        pointRadius: 4,
      };
    });

    // Add Class Average dataset if toggled
    if (showProgressClassAverage) {
      const classAverageData = allExamTypes.map(examType => {
        const marks: number[] = selectedGrades
          .map(grade => grade.classExamMarks ? grade.classExamMarks[examType] : NaN)
          .filter((mark): mark is number => !isNaN(mark));

        if (marks.length === 0) return null;
        const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
        return parseFloat(avg.toFixed(1));
      });

      datasets.push({
        label: "Class Average",
        data: classAverageData,
        borderColor: getClassAverageColor(),
        backgroundColor: getClassAverageColor(),
        fill: false,
        tension: 0.2,
        borderWidth: 2, // Thinner lines
        pointRadius: 4,
      });
    }

    return {
      labels: allExamTypes,
      datasets: datasets,
    };
  };

  // Color Assignments
  const getSubjectColor = (index: number): string => {
    if (index === 0) return "#1E90FF"; // DodgerBlue
    if (index === 1) return "#4B0082"; // Indigo (very darkish blue-purple)
    return "#000000"; // Default to black if more than two
  };

  const getClassAverageColor = (): string => {
    return "#FF4500"; // OrangeRed for class average
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // To control the height manually
    plugins: {
      legend: {
        display: true, // Show legend
        position: "bottom" as const, // Position legend at the bottom
        labels: {
          color: "#c3c3c3", // Match y-axis text color
          font: {
            size: 14,
          },
          usePointStyle: true,
          pointStyle: "line", // Indicate line in legend
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Exam Type",
          color: "#c3c3c3", // X-axis title color
          font: {
            size: 16,
          },
        },
        ticks: {
          color: "#c3c3c3", // X-axis labels color
          font: {
            size: 12,
          },
          maxRotation: 90, // Rotate labels to vertical
          minRotation: 90,
        },
        grid: {
          display: false, // Hide vertical gridlines
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Marks (%)",
          color: "#c3c3c3", // Y-axis title color
          font: {
            size: 16,
          },
        },
        min: 0,
        max: 100,
        grid: {
          display: true,
          color: "rgba(195, 195, 195, 0.2)", // Faint gridlines matching y-axis text color
          lineWidth: 1,
        },
        ticks: {
          stepSize: 10,
          color: "#c3c3c3", // Y-axis labels color
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Chart Data
  const chartData = prepareProgressChartData();

  // Handle Term Change
  const handleTermChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTerm = e.target.value;
    setSelectedTerm(newTerm);
  };

  return (
    <Container fluid className="total-average-container p-3">
      {/* Back Button at the Top */}
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
          <h2 className="total-average-title">Progress Graph</h2>
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

      {/* Chart Container with Horizontal Scroll */}
      <Row>
        <Col xs={12}>
          <div className="chart-scroll-container" style={{ overflowX: "auto", height: "500px",  display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: "10px" }}>
            <div style={{ minWidth: "300px", height: "100%" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Custom Legend and Controls Underneath the Graph */}
      <Row className="mt-4 justify-content-center">
        <Col xs={12} md={8}>
          <div className="custom-legend">
            {/* Class Average Toggle */}
            <Form.Check
              type="checkbox"
              id="class-average-toggle"
              label="Show Class Average"
              checked={showProgressClassAverage}
              onChange={handleClassAverageToggle}
              className="legend-item"
            />

            {/* Subjects Toggles */}
            <div className="subjects-legend">
              <h5 className="legend-title">
                Select Subjects {showProgressClassAverage ? "(Max 1)" : "(Max 2)"}
              </h5>
              {grades.map((grade) => (
                <Form.Check
                  key={grade.subject}
                  type="checkbox"
                  id={`subject-toggle-${grade.subject}`}
                  label={grade.subject}
                  checked={selectedProgressSubjects.includes(grade.subject)}
                  onChange={() => handleProgressSubjectToggle(grade.subject)}
                  className="legend-item"
                  disabled={
                    !selectedProgressSubjects.includes(grade.subject) &&
                    (showProgressClassAverage
                      ? selectedProgressSubjects.length >= 1
                      : selectedProgressSubjects.length >= 2)
                  } // Disable based on class average toggle
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Alert Modal */}
      <Modal show={showAlert} onHide={handleAlertClose}>
        <Modal.Header closeButton>
          <Modal.Title>Selection Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please deselect one subject before turning on the Class Average.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAlertClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loading and Error States */}
      {loading && (
        <div className="loading-container d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="error-container d-flex flex-column align-items-center justify-content-center">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
    </Container>
  );
};

export default ProgressGraph;

// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Container, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
// import "./ProgressGraph.css"; // Ensure this file contains necessary custom styles

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// // Interfaces (reuse or import from a separate types file)
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

// interface LocationState {
//   selectedTerm: string;
//   selectedSubjects: string[];
//   showClassAverage: boolean;
//   grades: GradeData[];
//   examTypes: string[]; // Assuming displayExamTypes is an array of strings
// }

// const ProgressGraph: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const state = location.state as LocationState;

//   // Destructure the state
//   const {
//     selectedTerm,
//     selectedSubjects,
//     showClassAverage,
//     grades,
//     examTypes,
//   } = state || {};

//   // Handle cases where state might be undefined
//   if (!state) {
//     return (
//       <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
//         <Alert variant="warning">No data available for the Progress Graph.</Alert>
//         <Button variant="primary" onClick={() => navigate("/student")}>
//           Go Back
//         </Button>
//       </Container>
//     );
//   }

//   // Helper Function for Color Coding
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

//   // Toggle Selected Subjects
//   const handleProgressSubjectToggle = (subject: string) => {
//     const updatedSubjects = selectedSubjects.includes(subject)
//       ? selectedSubjects.filter((s) => s !== subject)
//       : [...selectedSubjects, subject];
//     // You might need to update the parent component or use a state management solution
//     // For simplicity, we'll assume subjects are managed externally
//     // Consider navigating back with updated state or using context
//   };

//   // Prepare Data for the Line Chart
//   const prepareProgressChartData = () => {
//     const datasets = grades
//       .filter((grade) => selectedSubjects.includes(grade.subject))
//       .map((grade) => {
//         const data = examTypes.map((examType) =>
//           typeof grade.examMarks[examType] === "number" ? grade.examMarks[examType] : null
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

//     if (showClassAverage) {
//       const classAverageData = examTypes.map((examType) => {
//         const values: number[] = [];
//         grades.forEach((grade) => {
//           if (
//             selectedSubjects.includes(grade.subject) &&
//             grade.classExamMarks &&
//             !isNaN(grade.classExamMarks[examType])
//           ) {
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
//       labels: examTypes,
//       datasets: datasets,
//     };
//   };

//   // Chart Options
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom" as const,
//       },
//       tooltip: {
//         mode: "index" as const,
//         intersect: false,
//       },
//     },
//     interaction: {
//       mode: "nearest" as const,
//       axis: "x" as const,
//       intersect: false,
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Exam Type",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Average Marks",
//         },
//         min: 0,
//         max: 100,
//       },
//     },
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="mb-3">
//         <Col>
//           <Button variant="secondary" onClick={() => navigate(-1)}>
//             &#9664; Back
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col>
//           <h2>Progress Graph - {selectedTerm}</h2>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={4}>
//           <Form.Group controlId="term-select">
//             <Form.Label>Select Term:</Form.Label>
//             <Form.Select value={selectedTerm} disabled>
//               {/* Since term is already passed, disabling to prevent changes */}
//               <option value={selectedTerm}>{selectedTerm}</option>
//             </Form.Select>
//           </Form.Group>
//         </Col>
//       </Row>

//       {/* Legend and Toggle Buttons */}
//       <Row className="mb-4">
//         <Col>
//           <div className="d-flex flex-wrap">
//             {selectedSubjects.map((subject) => (
//               <Button
//                 key={subject}
//                 variant="light"
//                 className="me-2 mb-2 d-flex align-items-center"
//                 onClick={() => handleProgressSubjectToggle(subject)}
//                 style={{
//                   backgroundColor: getColor(subject),
//                   color: "white",
//                   borderColor: getColor(subject),
//                 }}
//               >
//                 <span
//                   className="me-2"
//                   style={{
//                     display: "inline-block",
//                     width: "12px",
//                     height: "12px",
//                     backgroundColor: "white",
//                     marginRight: "8px",
//                     borderRadius: "2px",
//                   }}
//                 ></span>
//                 {subject}
//               </Button>
//             ))}

//             <Button
//               variant={showClassAverage ? "secondary" : "light"}
//               className="me-2 mb-2 d-flex align-items-center"
//               onClick={() => {
//                 // Toggle class average
//                 // Assuming you have a way to update the state in the parent component
//                 // For this example, we'll navigate back with updated state
//                 navigate("/progress-graph", {
//                   state: {
//                     ...state,
//                     showClassAverage: !showClassAverage,
//                   },
//                 });
//               }}
//               style={{
//                 backgroundColor: showClassAverage ? "#6c757d" : "#e9ecef",
//                 color: showClassAverage ? "white" : "black",
//                 borderColor: showClassAverage ? "#6c757d" : "#ced4da",
//               }}
//             >
//               <span
//                 className="me-2"
//                 style={{
//                   display: "inline-block",
//                   width: "12px",
//                   height: "12px",
//                   backgroundColor: "#6c757d",
//                   marginRight: "8px",
//                   borderRadius: "2px",
//                 }}
//               ></span>
//               Class Average
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {/* Progress Line Chart */}
//       <Row>
//         <Col>
//           <Line data={prepareProgressChartData()} options={chartOptions} />
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ProgressGraph;
