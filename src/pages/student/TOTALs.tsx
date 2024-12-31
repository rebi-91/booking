// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from "chart.js";
// import {
//   Container,
//   Button,
//   Alert,
//   Row,
//   Col,
//   Form,
// } from "react-bootstrap";
// import "./TotalAverage.css"; // Ensure this file includes necessary styles

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

//   // Destructure passed state
//   const {
//     selectedSubjects: initialSelectedSubjects,
//     showClassAverage: initialShowClassAverage,
//     grades,
//     selectedTerm, // Optional
//   } = state || {};

//   // State Hooks for toggles
//   const [showGridline, setShowGridline] = useState<boolean>(true);
//   const [showStudentAverage, setShowStudentAverage] = useState<boolean>(true);
//   const [showClassAverage, setShowClassAverage] = useState<boolean>(
//     initialShowClassAverage
//   );
//   const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
//     initialSelectedSubjects || []
//   );

//   // Handle cases where state might be undefined
//   if (!state) {
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

//     const datasets = [];

//     if (showStudentAverage) {
//       datasets.push({
//         label: "Student Average",
//         data: studentAverages,
//         backgroundColor: "#36A2EB",
//         barThickness: calculateBarThickness(),
//       });
//     }

//     if (showClassAverage) {
//       datasets.push({
//         label: "Class Average",
//         data: classAverages,
//         backgroundColor: "#FF6384",
//         barThickness: calculateBarThickness(),
//       });
//     }

//     return {
//       labels: labels,
//       datasets: datasets,
//     };
//   };

//   // Function to calculate bar thickness based on number of subjects
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

//   // Chart Options
//   const chartOptions: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false, // We are creating a custom legend
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
//           color: "#c3c3c3",
//         },
//         max: 100,
//         grid: {
//           display: showGridline,
//           color: (context) => {
//             if (context.tick.value % 10 === 0) {
//               return "rgba(255, 255, 255, 0.3)";
//             }
//             return "rgba(255, 255, 255, 0.1)";
//           },
//           lineWidth: (context) => {
//             if (context.tick.value % 10 === 0) {
//               return 1.5;
//             }
//             return 0.5;
//           },
//         },
//         ticks: {
//           stepSize: 10,
//           color: "#c3c3c3",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Subjects",
//           color: "#c3c3c3",
//         },
//         ticks: {
//           color: "#c3c3c3",
//         },
//         grid: {
//           display: false,
//         },
//       },
//     },
//   };

//   // Adjust chart container width based on number of subjects
//   const chartContainerStyle: React.CSSProperties = {
//     minWidth: `${selectedSubjects.length * 100}px`, // Adjust as needed
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

//       {/* Chart Container with Horizontal Scroll */}
//       <Row>
//         <Col xs={12}>
//           <div className="chart-scroll-container">
//             <div className="chart-wrapper" style={chartContainerStyle}>
//               <Bar data={prepareTotalAverageChartData()} options={chartOptions} />
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* Custom Legend */}
//       <Row className="mt-4 justify-content-center">
//         <Col xs={12} md={8}>
//           <div className="custom-legend">
//             {/* Gridline Toggle */}
//             <Form.Check
//               type="checkbox"
//               id="gridline-toggle"
//               label="Gridline"
//               checked={showGridline}
//               onChange={handleGridlineToggle}
//               className="legend-item"
//             />

//             {/* Student Average Toggle */}
//             <Form.Check
//               type="checkbox"
//               id="student-average-toggle"
//               label="Student Average"
//               checked={showStudentAverage}
//               onChange={handleStudentAverageToggle}
//               className="legend-item"
//             />

//             {/* Class Average Toggle */}
//             <Form.Check
//               type="checkbox"
//               id="class-average-toggle"
//               label="Class Average"
//               checked={showClassAverage}
//               onChange={handleClassAverageToggle}
//               className="legend-item"
//             />

//             {/* Subjects Toggles */}
//             <div className="subjects-legend mt-2">
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
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TotalAverage;














// /* TotalAverage.css */

// /* Container Styling */
// .total-average-container {
//     position: relative;
//     min-height: 100vh; /* Ensure it takes at least the full viewport height */
//     width: 100%;
//     overflow: hidden;
//     background-color: #000; /* Black background for contrast */
//     padding: 20px;
//     box-sizing: border-box;
//   }
  
//   /* Back Button Styling */
//   .total-average-container .back-button {
//     margin-bottom: 20px;
//   }
  
//   /* Title Styling */
//   .total-average-title {
//     font-size: 2rem;
//     text-align: center;
//     color: #c3c3c3; /* Light gray color */
//     padding: 10px;
//     border-radius: 8px;
//     background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
//     display: inline-block;
//   }
  
//   /* Subtitle Styling */
//   .total-average-container .term-subtitle {
//     font-size: 1.2rem;
//     color: #a3a3a3; /* Slightly darker gray */
//     margin-top: 10px;
//   }
  
//   /* Chart Scroll Container */
//   .chart-scroll-container {
//     overflow-x: auto;
//     overflow-y: hidden;
//     height: 400px; /* Fixed height for the chart area */
//     width: 100%;
//     position: relative;
//     background-color: #fff; /* White background for the chart */
//     border-radius: 8px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//   }
  
//   /* Chart Wrapper Styling */
//   .chart-wrapper {
//     padding: 20px;
//     background-color: #fff; /* White background */
//     min-width: 600px; /* Minimum width to enable horizontal scrolling */
//   }
  
//   /* Custom Legend Styling */
//   .custom-legend {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     background: #1e1e1e; /* Dark gray background */
//     padding: 20px;
//     border-radius: 8px;
//     color: #ffffff; /* White text for contrast */
//   }
  
//   /* Legend Items Styling */
//   .legend-item {
//     margin-bottom: 10px;
//   }
  
//   /* Legend Title Styling */
//   .legend-title {
//     font-weight: bold;
//     margin-bottom: 10px;
//     font-size: 1.1rem;
//   }
  
//   /* Subjects Legend Styling */
//   .subjects-legend {
//     display: flex;
//     flex-direction: column;
//     margin-top: 10px;
//   }
  
//   /* Checkbox Styling */
//   .custom-legend .form-check {
//     margin-bottom: 5px;
//   }
  
//   /* Responsive Adjustments */
  
//   /* For tablets and small desktops */
//   @media (max-width: 992px) {
//     .chart-scroll-container {
//       height: 350px;
//     }
  
//     .total-average-title {
//       font-size: 1.8rem;
//     }
  
//     .term-subtitle {
//       font-size: 1rem;
//     }
  
//     .legend-title {
//       font-size: 1rem;
//     }
//   }
  
//   /* For mobile devices */
//   @media (max-width: 768px) {
//     .chart-scroll-container {
//       height: 300px;
//     }
  
//     .total-average-title {
//       font-size: 1.5rem;
//     }
  
//     .term-subtitle {
//       font-size: 0.9rem;
//     }
  
//     .legend-title {
//       font-size: 0.95rem;
//     }
//   }
  
//   @media (max-width: 576px) {
//     .chart-scroll-container {
//       height: 250px;
//     }
  
//     .total-average-title {
//       font-size: 1.2rem;
//     }
  
//     .term-subtitle {
//       font-size: 0.85rem;
//     }
  
//     .legend-title {
//       font-size: 0.9rem;
//     }
  
//     .custom-legend {
//       padding: 15px;
//     }
//   }
  
//   /* Grades Table Styling (If applicable) */
//   .table-custom {
//     background-color: #1e1e1e; /* Dark background */
//     color: #ffffff; /* White text */
//     border-radius: 8px;
//     overflow: hidden;
//   }
  
//   .table-custom th,
//   .table-custom td {
//     text-align: center;
//     vertical-align: middle;
//     padding: 10px;
//     position: relative;
//   }
  
//   /* Add faint lines every 10 units */
//   .table-custom tbody tr td::after {
//     content: "";
//     position: absolute;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     height: 1px;
//     background-color: rgba(255, 255, 255, 0.1); /* Light faint line */
//   }
  
//   .table-custom tbody tr:nth-child(10n) td::after {
//     background-color: rgba(255, 255, 255, 0.3); /* Slightly darker for every 10th row */
//   }
  
//   /* Tooltip Styling (Optional Enhancements) */
//   .subject-button:hover {
//     opacity: 0.8;
//     transition: opacity 0.3s;
//   }
  
//   /* Ensure buttons are above the chart */
//   .subject-buttons,
//   .total-average-title {
//     background: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
//     padding: 10px;
//     border-radius: 8px;
//     margin-bottom: 20px;
//   }
  
//   /* Subject Buttons Styling */
//   .subject-buttons {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: center;
//     width: 100%;
//     z-index: 2;
//     position: relative;
//     background: #1e1e1e; /* Dark gray background */
//     padding: 20px;
//     border-radius: 8px;
//   }
  
//   .subject-button {
//     position: relative;
//     z-index: 3; /* Higher than the chart */
//     margin: 5px;
//   }
  
//   /* Color Boxes for Legends (If used) */
//   .subject-color-box,
//   .class-average-color-box {
//     display: inline-block;
//     width: 12px;
//     height: 12px;
//     margin-right: 8px;
//     border-radius: 2px;
//   }
  
//   /* Rotated Chart Styling (If applicable) */
//   .chart-wrapper.rotated canvas {
//     margin-top: 70px !important;
//     width: 100% !important;
//     height: 100% !important;
//   }
  
//   /* Chevron Button Styling (If applicable) */
//   .chevron-button-container {
//     position: absolute;
//     top: 610px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 2;
//   }
  
//   .chevron-button {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 0;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//     cursor: pointer;
//     background-color: #ffffff;
//     transition: background-color 0.3s;
//   }
  
//   .chevron-button:hover {
//     background-color: #f8f9fa;
//   }
  
//   /* Ensure the y-axis remains visible during horizontal scroll */
//   .chart-scroll-container .chart-wrapper {
//     display: flex;
//     align-items: flex-start;
//   }
  
//   /* Optional: Hide scrollbar for a cleaner look (Browser Support May Vary) */
//   .chart-scroll-container::-webkit-scrollbar {
//     height: 8px;
//   }
  
//   .chart-scroll-container::-webkit-scrollbar-track {
//     background: #f1f1f1;
//     border-radius: 4px;
//   }
  
//   .chart-scroll-container::-webkit-scrollbar-thumb {
//     background: #888;
//     border-radius: 4px;
//   }
  
//   .chart-scroll-container::-webkit-scrollbar-thumb:hover {
//     background: #555;
//   }
  
