
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase'; // Ensure this path is correct
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Modal,
  Card,
  Dropdown, // Import Dropdown
} from 'react-bootstrap';
import './TeacherDashboard.css'; // Import the custom CSS

Chart.register(...registerables);

interface ExamType {
  examType: string;
  columnNumber: number;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  // User Data
  const [subjects, setSubjects] = useState<string[]>([]);
  const [userSchool, setUserSchool] = useState('');

  // Dropdown Selections
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');

  // Dropdown Options
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  // Selected Exam Column (can be number or string)
  const [selectedExamColumn, setSelectedExamColumn] = useState<string>('');

  // Loading and Error States
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);
  const [error, setError] = useState('');

  // Students List
  const [students, setStudents] = useState<{ id: number; studentName: string }[]>([]);

  // Student Marks
  const [studentMarks, setStudentMarks] = useState<{ [key: number]: string }>({});

  // Validation Errors
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});


  // Sheet Names
  const [sheetName, setSheetName] = useState('');
  const studentSheetName = 'student';

 // Add State
const [isMinimized, setIsMinimized] = useState(false);

// Toggle Minimized State for Containers
const toggleContainerSize = () => {
  setIsMinimized((prev) => !prev);
};

// Clear All Marks Handler
const handleClearAll = () => {
  if (window.confirm("Are you sure you want to clear all marks?")) {
    setStudentMarks({});
    alert("All marks cleared successfully.");
  }
};
const [isSaveDisabled, setIsSaveDisabled] = useState(false); // State to manage button disable

const handleSaveWithDelay = async () => {
  if (isSaveDisabled) return;

  setIsSaveDisabled(true); // Disable the button
  await handleSave(); // Call the actual save function
  setTimeout(() => setIsSaveDisabled(false), 5000); // Re-enable after 5 seconds
};


  // Fetch User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingSubjects(true);
      setError('');
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && session.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('subject1, subject2, subject3, subject4, subject5, school')
            .eq('id', session.user.id)
            .single();

          if (error || !profile) {
            throw error || new Error('No profile found');
          }

          const userSubjects = [
            profile.subject1,
            profile.subject2,
            profile.subject3,
            profile.subject4,
            profile.subject5,
          ].filter((subject: string | null) => subject) as string[];

          setSubjects(userSubjects);
          setUserSchool(profile.school);
        } else {
          setError('User not authenticated.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch user profile.');
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch Sheet Name based on selectedSubject and userSchool
  useEffect(() => {
    const fetchSheetName = async () => {
      if (selectedSubject && userSchool) {
        setError('');
        setSheetName('');
        try {
          const { data: subjectData, error: subjectError } = await supabase
            .from('subjects')
            .select('sheetName')
            .eq('school', userSchool)
            .eq('subjectName', selectedSubject)
            .single();

          if (subjectError || !subjectData) {
            throw subjectError || new Error('No subject data found');
          }

          const fetchedSheetName = subjectData.sheetName as string;
          setSheetName(fetchedSheetName);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch sheet name.');
        }
      } else {
        setSheetName('');
      }
    };

    fetchSheetName();
  }, [selectedSubject, userSchool]);

  // Fetch Classes based on userSchool
  useEffect(() => {
    const fetchClasses = async () => {
      if (studentSheetName && userSchool) {
        setLoadingClasses(true);
        setError('');
        setClasses([]);
        setSelectedClass('');
        setSections([]);
        setSelectedSection('');
        setStudents([]);
        try {
          const { data: classData, error: classError } = await supabase
            .from(studentSheetName)
            .select('className')
            .eq('school', userSchool)
            .neq('className', null);

          if (classError || !classData) {
            throw classError || new Error('No class data found');
          }

          const uniqueClasses = [...new Set((classData as any[]).map((item) => item.className))];
          setClasses(uniqueClasses);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch classes.');
        } finally {
          setLoadingClasses(false);
        }
      } else {
        setClasses([]);
        setSelectedClass('');
        setSections([]);
        setSelectedSection('');
        setStudents([]);
        setSheetName('');
      }
    };

    fetchClasses();
  }, [studentSheetName, userSchool]);

  // Fetch Sections based on selectedClass
  useEffect(() => {
    const fetchSections = async () => {
      if (selectedClass && studentSheetName && userSchool) {
        setLoadingSections(true);
        setError('');
        setSections([]);
        setSelectedSection('');
        setStudents([]);
        try {
          const { data: sectionData, error: sectionError } = await supabase
            .from(studentSheetName)
            .select('section')
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .neq('section', null);

          if (sectionError || !sectionData) {
            throw sectionError || new Error('No section data found');
          }

          const uniqueSections = [...new Set((sectionData as any[]).map((item) => item.section))];
          setSections(uniqueSections);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch sections.');
        } finally {
          setLoadingSections(false);
        }
      } else {
        setSections([]);
        setSelectedSection('');
        setStudents([]);
      }
    };

    fetchSections();
  }, [selectedClass, studentSheetName, userSchool]);

  // Fetch Students based on selectedClass and selectedSection
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass && selectedSection && studentSheetName && userSchool) {
        setLoadingStudents(true);
        setError('');
        setStudents([]);
        try {
          const { data: studentData, error: studentError } = await supabase
            .from(studentSheetName)
            .select('id, studentName')
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .eq('section', selectedSection)
            .order('id', { ascending: true });

          if (studentError || !studentData) {
            throw studentError || new Error('No students found');
          }

          setStudents(studentData as any[]);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch students.');
        } finally {
          setLoadingStudents(false);
        }
      } else {
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection, studentSheetName, userSchool]);

  // Fetch Exam Types based on selectedSubject and userSchool
// Fetch Exam Types based on userSchool (Removed subjectName condition)
useEffect(() => {
  const fetchExamTypes = async () => {
    if (userSchool) {
      setLoadingExamTypes(true);
      setError('');
      setExamTypes([]);
      setSelectedExamType('');
      setSelectedExamColumn('');
      try {
        // Removed .eq('subjectName', selectedSubject)
        const { data, error } = await supabase
          .from('exam')
          .select('examType, columnNumber')
          .eq('school', userSchool);

        if (error || !data) {
          throw error || new Error('No exam types found');
        }

        // Map the data to the ExamType interface
        let mappedExamTypes = (data as any[]).map((item) => ({
          examType: item.examType as string,
          columnNumber: item.columnNumber as number,
        }));

        // Sort exam types by columnNumber ascending
        mappedExamTypes.sort((a, b) => a.columnNumber - b.columnNumber);

        setExamTypes(mappedExamTypes);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch exam types.');
      } finally {
        setLoadingExamTypes(false);
      }
    } else {
      setExamTypes([]);
      setSelectedExamType('');
      setSelectedExamColumn('');
    }
  };

  fetchExamTypes();
}, [userSchool]); // Notice we only watch userSchool here, not selectedSubject

  // Update selectedExamColumn based on selectedExamType
  useEffect(() => {
    if (selectedExamType && examTypes.length > 0) {
      const selectedExam = examTypes.find((et) => et.examType === selectedExamType);
      if (selectedExam) {
        // Convert columnNumber to string since we use it as a key
        setSelectedExamColumn(selectedExam.columnNumber.toString());
      } else {
        setSelectedExamColumn('');
      }
    } else {
      setSelectedExamColumn('');
    }
  }, [selectedExamType, examTypes]);

  // Fetch Marks based on selectedExamColumn and students
  useEffect(() => {
    const fetchMarks = async () => {
      if (selectedExamColumn && students.length > 0 && sheetName && userSchool) {
        setError('');
        try {
          const columnKey = selectedExamColumn; // It's already a string
          const selectColumns = `id, ${columnKey}`;

          const { data: marksData, error: marksError } = await supabase
            .from(sheetName)
            .select(selectColumns)
            .in('id', students.map((s) => s.id));

          if (marksError || !marksData) {
            throw marksError || new Error('No marks data found');
          }

          const initialMarks: { [key: number]: string } = {};
          (marksData as any[]).forEach((markRecord: any) => {
            const val = markRecord[columnKey];
            initialMarks[markRecord.id] =
              val !== null && val !== undefined ? val.toString() : '';
          });

          students.forEach((student) => {
            if (!initialMarks.hasOwnProperty(student.id)) {
              initialMarks[student.id] = '';
            }
          });

          setStudentMarks(initialMarks);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch marks.');
        }
      } else {
        setStudentMarks({});
      }
    };

    fetchMarks();
  }, [selectedExamColumn, students, sheetName, userSchool]);

  // Handle Input Change for Marks
  const handleInputChange = (studentId: number, value: string) => {
    if (
      value === '-' ||
      value === '' ||
      (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
    ) {
      setStudentMarks((prevMarks) => ({
        ...prevMarks,
        [studentId]: value,
      }));
      setValidationErrors((prevErrors) => {
        const { [studentId]: removed, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  // Handle Save Marks
  // const handleSave = async () => {
  //   if (!selectedExamType || !selectedExamColumn || !sheetName) {
  //     setError('Exam type, column, or sheet name is not defined.');
  //     return;
  //   }

  //   setValidationErrors({});
  //   let hasError = false;
  //   const newValidationErrors: { [key: number]: string } = {};

  //   try {
  //     for (const student of students) {
  //       const mark = studentMarks[student.id];
  //       if (mark === '') {
  //         hasError = true;
  //         newValidationErrors[student.id] = 'Mark cannot be empty.';
  //       } else if (
  //         mark !== '-' &&
  //         (isNaN(Number(mark)) || Number(mark) < 0 || Number(mark) > 100)
  //       ) {
  //         hasError = true;
  //         newValidationErrors[student.id] =
  //           'Mark must be between 0 and 100 or "-".';
  //       }
  //     }

  //     if (hasError) {
  //       setValidationErrors(newValidationErrors);
  //       alert('Please fill in all marks correctly before saving.');
  //       return;
  //     }

  //     const columnKey = selectedExamColumn; // already a string
  //     const updates = students.map(async (student) => {
  //       const mark = studentMarks[student.id];
  //       let markValue: string | number | null = null;
  //       if (mark === '-') {
  //         markValue = '-';
  //       } else if (mark === '') {
  //         markValue = null;
  //       } else {
  //         markValue = Number(mark);
  //       }

  //       const updateData = { [columnKey]: markValue };
  //       const { error } = await supabase
  //         .from(sheetName)
  //         .update(updateData)
  //         .eq('id', student.id);

  //       if (error) {
  //         throw error;
  //       }
  //     });

  //     await Promise.all(updates);
  //     alert('Marks saved successfully!');
  //   } catch (err: any) {
  //     console.error(err);
  //     setError(err.message || 'Failed to save marks.');
  //   }
  // };
  const handleSave = async () => {
    if (!selectedExamType || !selectedExamColumn || !sheetName) {
      setError('Exam type, column, or sheet name is not defined.');
      return;
    }
  
    try {
      const columnKey = selectedExamColumn; // already a string
      const updates = students.map(async (student) => {
        const mark = studentMarks[student.id];
        let markValue: string | number | null = null;
  
        if (mark !== undefined && mark !== '') {
          if (mark === '-') {
            markValue = '-';
          } else {
            markValue = Number(mark);
          }
  
          const updateData = { [columnKey]: markValue };
          const { error } = await supabase
            .from(sheetName)
            .update(updateData)
            .eq('id', student.id);
  
          if (error) {
            throw error;
          }
        }
      });
  
      await Promise.all(updates);
      alert('Marks saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save marks.');
    }
  };
  

  // ----------------------------
  // Render Component
  // ----------------------------

  return (
    <>
      {/* Header */}
      <header className="header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="header-title">Teacher Dashboard</h1>
            </Col>
            <Col className="text-end">
              {/* Attendance Icon */}
              <Link
                to="/attendance"
                className="attendance-icon btn btn-light rounded-circle p-2 shadow"
                aria-label="Attendance Link"
                title="Attendance"
              >
                📅
              </Link>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Main Content */}
      <Container fluid className="main-content position-relative">
        {/* Error Message */}
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}

       {/* Dropdowns Container */}
       <div
          className={`card p-4 mb-4 dropdown-container ${
            isMinimized ? "dropdown-container-minimized" : "dropdown-container-expanded"
          }`}
          style={{
            width: "100%", // Ensures the container spans the full width
            margin: "0",
            transition: "all 0.3s ease",
          }}
        >
          {!isMinimized && (
            <Row>
              <Col md={3} sm={6} xs={12} className="mb-3">
             {/* Select Subject Dropdown */}
            <Form.Group controlId="subjectDropdown">
              <Form.Label>Select Subject</Form.Label>
              <Dropdown onSelect={(eventKey) => setSelectedSubject(eventKey || '')}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-subject"
                  className="w-100"
                  aria-label="Select Subject"
                  disabled={loadingSubjects || subjects.length === 0}
                >
                  {selectedSubject || (loadingSubjects ? 'Loading subjects...' : 'Select a subject')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {subjects.map((subject, index) => (
                    <Dropdown.Item key={index} eventKey={subject}>
                      {subject}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>

          {/* Select Class Dropdown */}
          <Col md={3} sm={6} xs={12} className="mb-3">
            <Form.Group controlId="classDropdown">
              <Form.Label>Select Class</Form.Label>
              <Dropdown onSelect={(eventKey) => setSelectedClass(eventKey || '')}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-class"
                  className="w-100"
                  aria-label="Select Class"
                  disabled={!selectedSubject || loadingClasses || classes.length === 0}
                >
                  {selectedClass || (loadingClasses ? 'Loading classes...' : 'Select a class')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {classes.map((cls, index) => (
                    <Dropdown.Item key={index} eventKey={cls}>
                      {cls}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>

          {/* Select Section Dropdown */}
          <Col md={3} sm={6} xs={12} className="mb-3">
            <Form.Group controlId="sectionDropdown">
              <Form.Label>Select Section</Form.Label>
              <Dropdown onSelect={(eventKey) => setSelectedSection(eventKey || '')}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-section"
                  className="w-100"
                  aria-label="Select Section"
                  disabled={!selectedClass || loadingSections || sections.length === 0}
                >
                  {selectedSection || (loadingSections ? 'Loading sections...' : 'Select a section')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {sections.map((section, index) => (
                    <Dropdown.Item key={index} eventKey={section}>
                      {section}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>

          {/* Select Exam Type Dropdown */}
          <Col md={3} sm={6} xs={12} className="mb-3">
            <Form.Group controlId="examTypeDropdown">
              <Form.Label>Exam Type</Form.Label>
              <Dropdown onSelect={(eventKey) => setSelectedExamType(eventKey || '')}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-examType"
                  className="w-100"
                  aria-label="Select Exam Type"
                  disabled={!selectedSubject || loadingExamTypes || examTypes.length === 0}
                >
                  {selectedExamType || (loadingExamTypes ? 'Loading exam types...' : 'Select an exam type')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {examTypes.map((type, index) => (
                    <Dropdown.Item key={index} eventKey={type.examType}>
                      {`${type.columnNumber}: ${type.examType}`}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>)}
      
       {/* Chevron Button */}
       <button
            onClick={toggleContainerSize}
            className="chevron-btn2"
            aria-label={isMinimized ? "Expand Dropdowns" : "Minimize Dropdowns"}
          >
            {isMinimized ? "\u25BC" : "\u25B2"}
          </button>
        </div>
          
        {/* Students List */}
        <Row>
  <Col>
    <Card
      className={`students-card ${
        isMinimized ? "students-card-expanded" : "students-card-collapsed"
      }`}
      style={{
        maxHeight: isMinimized ? "600px" : "300px", // Dynamic height based on state
        transition: "max-height 0.3s ease",
        overflowY: "auto",
      }}
    >
      <Card.Body>
        {loadingStudents ? (
          <div className="d-flex justify-content-center align-items-center spinner-container">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : students.length > 0 ? (
          <>
            {/* Students Table */}
            <Table bordered hover responsive className="students-table">
              <thead className="table-primary">
                <tr>
                  <th>Student Name</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.studentName}</td>
                    <td>
                      <Form.Control
                        type="text"
                        placeholder="Enter mark"
                        value={studentMarks[student.id] || ""}
                        onChange={(e) => handleInputChange(student.id, e.target.value)}
                        isInvalid={!!validationErrors[student.id]}
                        aria-label={`Enter mark for ${student.studentName}`}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors[student.id]}
                      </Form.Control.Feedback>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          <Alert variant="info"></Alert>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>

        {/* Save Marks Button */}
        <Row className="fixed-bottom mt-4">
          <Col className="d-flex flex-column align-items-center">
       {/* Fixed Buttons at the Bottom */}
{/* <div
  style={{
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    display: "flex",
    gap: "20px", // Adds space between buttons
  }}
> */}
 <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px", // Space between buttons
        width: "100%", // Ensures responsiveness
        alignItems: "center", // Centers buttons horizontally
      }}
    >
  {/* Save Marks Button */}
  <Button
     variant="primary"
     onClick={handleSaveWithDelay}
     disabled={isSaveDisabled || students.length === 0}
    aria-label="Save Marks"
    className="save-marks-button"
  >
    Save Marks
  </Button>

  {/* Clear All Button */}
  {/* <button
    onClick={handleClearAll}
    className="btn btn-danger clear-all-btn"
    style={{
      padding: "10px 20px",
      borderRadius: "20px",
      fontSize: "16px",
      width: "100%", //
    }}
  >
    Clear All
  </button> */}
</div>

          </Col>
        </Row>
      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row>
            <Col className="text-center">
              &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
      </Container>
    </>
  );

};

export default TeacherDashboard;
