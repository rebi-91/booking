import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase'; 
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Card,
  Dropdown,
} from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './TeacherDashboard.css';

Chart.register(...registerables);

interface ExamType {
  examType: string;
  columnNumber: string; // Changed to string as per your clarification
}

interface StudentRow {
  id: number; // Represents the unique identifier from sheetName
  studentID: number;
  studentName: string;
  [key: string]: any; // To accommodate dynamic columns
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- State Declarations ---
  const [subjects, setSubjects] = useState<string[]>([]);
  const [userSchool, setUserSchool] = useState('');

  // Dropdown Selections
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  // Exam Type Selection
  const [selectedExamType, setSelectedExamType] = useState('');

  // Dropdown Options
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  // Mark-Related
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentMarks, setStudentMarks] = useState<{ [key: number]: string }>({});

  // Validation
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});

  // Sheet Info
  const [sheetName, setSheetName] = useState('');

  // Loading & Error
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);
  const [error, setError] = useState('');

  // Container Toggle
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleContainerSize = () => setIsMinimized((prev) => !prev);

  // Save Button
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  // Helper Function to Get Numeric Column Number
  const getNumericColumn = (columnKey: string): string => {
    return columnKey.replace(/^col/, '');
  };

  // Helper Function to Get Column Key
  const getSelectedColumnKey = (): string | null => {
    const examType = examTypes.find((type) => type.examType === selectedExamType);
    if (!examType) return null;

    // Since columnNumber is already the column name, return it directly
    return examType.columnNumber;
  };

  // =============================
  // 1. Fetch user’s subjects & school
  // =============================
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingSubjects(true);
      setError('');
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles') // Corrected table name to 'profiles'
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
          ].filter((s) => s) as string[];

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

  // =============================
  // 2. Fetch the 'sheetName' from 'subjects'
  //    matching subjectName + school
  // =============================
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
            .eq('subjectName', selectedSubject);

          if (subjectError) throw subjectError;
          if (!subjectData || subjectData.length === 0) {
            // No row => no sheet
            return;
          }

          setSheetName(subjectData[0].sheetName);
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

  // =============================
  // 3. Fetch Classes from the 'sheetName' table
  //    We get distinct className where school = userSchool
  // =============================
  useEffect(() => {
    const fetchClasses = async () => {
      if (sheetName && userSchool) {
        setLoadingClasses(true);
        setError('');
        setClasses([]);
        setSelectedClass('');
        setSections([]);
        setSelectedSection('');
        setStudents([]);
        try {
          const { data: classData, error: classError } = await supabase
            .from(sheetName)
            .select('className')
            .eq('school', userSchool)
            .neq('className', null);

          if (classError || !classData) {
            throw classError || new Error('No class data found');
          }

          const uniqueClasses = [
            ...new Set(classData.map((row: any) => row.className)),
          ];
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
      }
    };

    fetchClasses();
  }, [sheetName, userSchool]);

  // =============================
  // 4. Fetch Sections from 'sheetName' based on className
  // =============================
  useEffect(() => {
    const fetchSections = async () => {
      if (selectedClass && sheetName && userSchool) {
        setLoadingSections(true);
        setError('');
        setSections([]);
        setSelectedSection('');
        setStudents([]);
        try {
          const { data: sectionData, error: sectionError } = await supabase
            .from(sheetName)
            .select('section')
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .neq('section', null);

          if (sectionError || !sectionData) {
            throw sectionError || new Error('No section data found');
          }

          const uniqueSections = [
            ...new Set(sectionData.map((row: any) => row.section)),
          ];
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
  }, [selectedClass, sheetName, userSchool]);

  // =============================
  // 5. Fetch Students from 'sheetName'
  //    matching school, className, and section
  //    Sorted by 'id' in increasing order
  // =============================
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass && selectedSection && sheetName && userSchool) {
        setLoadingStudents(true);
        setError('');
        setStudents([]);
        try {
          const { data: studentData, error: studentError } = await supabase
            .from(sheetName)
            .select('id, studentID, studentName') // Included 'id' in select
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .eq('section', selectedSection)
            .order('id', { ascending: true }); // Ordered by 'id' ascending

          if (studentError || !studentData) {
            throw studentError || new Error('No students found');
          }

          setStudents(studentData as StudentRow[]);
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
  }, [selectedClass, selectedSection, sheetName, userSchool]);

  // =============================
  // 6. Fetch Exam Types
  // =============================
  useEffect(() => {
    const fetchExamTypes = async () => {
      if (userSchool) {
        setLoadingExamTypes(true);
        setError('');
        setExamTypes([]);
        setSelectedExamType('');
        try {
          const { data, error } = await supabase
            .from('exam')
            .select('examType, columnNumber')
            .eq('school', userSchool);

          if (error || !data) {
            throw error || new Error('No exam types found');
          }

          let mappedExamTypes: ExamType[] = data.map((item: any) => ({
            examType: item.examType as string,
            columnNumber: item.columnNumber as string, // Ensure it's string
          }));

          // Optional: Sort exam types based on columnNumber or any other logic
          mappedExamTypes.sort((a, b) => {
            // If columnNumber starts with 'col' followed by a number, sort numerically
            const getNumber = (col: string) => {
              const match = col.match(/col(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            };
            return getNumber(a.columnNumber) - getNumber(b.columnNumber);
          });

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
      }
    };

    fetchExamTypes();
  }, [userSchool]);

  // =============================
  // 7. Fetch Marks Dynamically Based on Selected Exam Type
  // =============================
  useEffect(() => {
    const fetchMarks = async () => {
      if (
        students.length > 0 &&
        sheetName &&
        userSchool &&
        selectedExamType
      ) {
        const columnKey = getSelectedColumnKey();
        if (!columnKey) {
          setError('Invalid exam type selected.');
          return;
        }

        setError('');
        try {
          const selectString = `studentID, studentName, ${columnKey}`;

          console.log('Fetching marks with:', {
            sheetName,
            selectString,
            school: userSchool,
            className: selectedClass,
            section: selectedSection,
            studentIDs: students.map((s) => s.studentID),
          });

          const { data: marksData, error: marksError } = await supabase
            .from(sheetName)
            .select(selectString)
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .eq('section', selectedSection)
            .in('studentID', students.map((s) => s.studentID));

          if (marksError || !marksData) {
            throw marksError || new Error('No marks data found');
          }

          // Build initial marks
          const initialMarks: { [key: number]: string } = {};
          marksData.forEach((row: any) => {
            const val = row[columnKey];
            initialMarks[row.studentID] = val !== null && val !== undefined ? val.toString() : '';
          });

          // For any student not returned in marksData, set empty
          students.forEach((stu) => {
            if (!initialMarks.hasOwnProperty(stu.studentID)) {
              initialMarks[stu.studentID] = '';
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
  }, [
    students,
    sheetName,
    userSchool,
    selectedClass,
    selectedSection,
    selectedExamType,
    examTypes,
  ]);

  // =============================
  // handleInputChange
  // =============================
  const handleInputChange = (studentID: number, value: string) => {
    // 0-100 or "-" logic
    if (
      value === '-' ||
      value === '' ||
      (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
    ) {
      setStudentMarks((prev) => ({
        ...prev,
        [studentID]: value,
      }));
      setValidationErrors((prevErrors) => {
        const { [studentID]: _, ...rest } = prevErrors;
        return rest;
      });
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [studentID]: 'Enter a number between 0 and 100 or "-"',
      }));
    }
  };

  // =============================
  // handleSave
  // =============================
  const handleSave = async () => {
    if (!sheetName) {
      setError('Sheet name not defined.');
      return;
    }

    if (!selectedExamType) {
      setError('Please select an exam type.');
      return;
    }

    const columnKey = getSelectedColumnKey();
    if (!columnKey) {
      setError('Invalid exam type selected.');
      return;
    }

    try {
      // For each student, update the mark in the sheetName table
      const updates = students.map(async (stu) => {
        const mark = studentMarks[stu.studentID];
        if (mark !== undefined && mark !== '') {
          let markValue: string | number | null = null;
          if (mark === '-') markValue = '-';
          else markValue = Number(mark);

          const updateData: any = { [columnKey]: markValue };
          const { error } = await supabase
            .from(sheetName)
            .update(updateData)
            .eq('studentID', stu.studentID)
            .eq('school', userSchool)
            .eq('className', selectedClass)
            .eq('section', selectedSection);

          if (error) throw error;
        }
      });

      await Promise.all(updates);
      alert(`Marks (${getNumericColumn(columnKey)}: ${selectedExamType}) saved successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save marks.');
    }
  };

  // Optional: Delay Save
  const handleSaveWithDelay = async () => {
    if (isSaveDisabled) return;
    setIsSaveDisabled(true);
    await handleSave();
    setTimeout(() => setIsSaveDisabled(false), 5000);
  };

  // Clear All Marks
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all marks?')) {
      setStudentMarks({});
      alert('All marks cleared successfully.');
    }
  };

  // =============================
  // Render
  // =============================
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

      <Container fluid className="main-content position-relative">
        {/* Show Errors */}
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}

        {/* Dropdowns */}
        <div
          className={`card p-4 mb-4 dropdown-container ${
            isMinimized ? 'dropdown-container-minimized' : 'dropdown-container-expanded'
          }`}
          style={{
            width: '100%',
            margin: '0',
            transition: 'all 0.3s ease',
          }}
        >
          {!isMinimized && (
            <Row>
              {/* Subject */}
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Form.Group controlId="subjectDropdown">
                  <Form.Label>Select Subject</Form.Label>
                  <Dropdown onSelect={(val) => setSelectedSubject(val || '')}>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-subject"
                      className="w-100"
                      disabled={loadingSubjects || subjects.length === 0}
                    >
                      {selectedSubject ||
                        (loadingSubjects ? 'Loading subjects...' : 'Select a subject')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {subjects.map((subj, idx) => (
                        <Dropdown.Item key={idx} eventKey={subj}>
                          {subj}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              {/* Class */}
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Form.Group controlId="classDropdown">
                  <Form.Label>Select Class</Form.Label>
                  <Dropdown onSelect={(val) => setSelectedClass(val || '')}>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-class"
                      className="w-100"
                      disabled={!sheetName || loadingClasses || classes.length === 0}
                    >
                      {selectedClass ||
                        (loadingClasses ? 'Loading classes...' : 'Select a class')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {classes.map((cls, idx) => (
                        <Dropdown.Item key={idx} eventKey={cls}>
                          {cls}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              {/* Section */}
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Form.Group controlId="sectionDropdown">
                  <Form.Label>Select Section</Form.Label>
                  <Dropdown onSelect={(val) => setSelectedSection(val || '')}>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-section"
                      className="w-100"
                      disabled={!selectedClass || loadingSections || sections.length === 0}
                      style={{ minWidth: '250px' }} // Increased width
                    >
                      {selectedSection ||
                        (loadingSections ? 'Loading sections...' : 'Select a section')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {sections.map((sec, idx) => (
                        <Dropdown.Item key={idx} eventKey={sec}>
                          {sec}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              {/* Exam Type */}
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Form.Group controlId="examTypeDropdown">
                  <Form.Label>Exam Type</Form.Label>
                  <Dropdown onSelect={(val) => setSelectedExamType(val || '')}>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-examType"
                      className="w-100"
                      disabled={loadingExamTypes || examTypes.length === 0}
                      style={{ minWidth: '700px' }} // Increased width
                    >
                      {selectedExamType ||
                        (loadingExamTypes ? 'Loading exam types...' : 'Select an exam type')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {examTypes.map((type, idx) => (
                        <Dropdown.Item key={idx} eventKey={type.examType}>
                          {`${getNumericColumn(type.columnNumber)}: ${type.examType}`}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>
            </Row>
          )}

          <button
            onClick={toggleContainerSize}
            className="chevron-btn2"
            aria-label={isMinimized ? 'Expand Dropdowns' : 'Minimize Dropdowns'}
          >
            {isMinimized ? '\u25BC' : '\u25B2'}
          </button>
        </div>

        {/* Students Table */}
        <Row>
          <Col>
            <Card
              className={`students-card ${isMinimized ? 'students-card-expanded' : 'students-card-collapsed'}`}
              style={{
                maxHeight: isMinimized ? '600px' : '300px',
                transition: 'max-height 0.3s ease',
                overflowY: 'auto',
              }}
            >
              <Card.Body>
                {loadingStudents ? (
                  <div className="d-flex justify-content-center align-items-center spinner-container">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : students.length > 0 ? (
                  <>
                    <Table bordered hover responsive className="students-table">
                      <thead className="table-primary">
                        <tr>
                          <th>Student Name</th>
                          <th>
                            {selectedExamType
                              ? `Marks in ${getNumericColumn(getSelectedColumnKey() || '')}: (${selectedExamType})`
                              : 'Mark'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((stu) => (
                          <tr key={stu.id}> {/* Changed key to 'stu.id' */}
                            <td>{stu.studentName}</td>
                            <td>
                              <Form.Control
                                type="text"
                                placeholder="Enter mark"
                                value={studentMarks[stu.studentID] || ''}
                                onChange={(e) => handleInputChange(stu.studentID, e.target.value)}
                                isInvalid={!!validationErrors[stu.studentID]}
                                aria-label={`Enter mark for ${stu.studentName}`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {validationErrors[stu.studentID]}
                              </Form.Control.Feedback>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <Alert variant="info">
                    No students found or not yet loaded.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bottom Buttons */}
        <Row className="fixed-bottom mt-4">
          <Col className="d-flex flex-column align-items-center">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Button
                variant="primary"
                onClick={handleSaveWithDelay}
                disabled={
                  isSaveDisabled || students.length === 0 || !selectedExamType
                }
                aria-label="Save Marks"
                className="save-marks-button"
                style={{ minWidth: '250px' }} // Increased width
              >
                Save Marks ({getNumericColumn(getSelectedColumnKey() || 'N/A')})
              </Button>
              {/*
              <Button
                variant="danger"
                onClick={handleClearAll}
                style={{ width: '100%' }}
              >
                Clear All
              </Button>
              */}
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

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import supabase from '../../supabase'; 
// import { Chart, registerables } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Form,
//   Table,
//   Spinner,
//   Alert,
//   Card,
//   Dropdown,
// } from 'react-bootstrap';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import './TeacherDashboard.css';

// Chart.register(...registerables);

// interface ExamType {
//   examType: string;
//   columnNumber: string; // Changed to string as per your clarification
// }

// interface StudentRow {
//   id: number; // Added to represent the unique identifier from sheetName
//   studentID: number;
//   studentName: string;
//   [key: string]: any; // to accommodate dynamic columns
// }

// const TeacherDashboard: React.FC = () => {
//   const navigate = useNavigate();

//   // --- State Declarations ---
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [userSchool, setUserSchool] = useState('');

//   // Dropdown Selections
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
  
//   // Exam Type Selection
//   const [selectedExamType, setSelectedExamType] = useState('');

//   // Dropdown Options
//   const [classes, setClasses] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [examTypes, setExamTypes] = useState<ExamType[]>([]);

//   // Mark-Related
//   const [students, setStudents] = useState<StudentRow[]>([]);
//   const [studentMarks, setStudentMarks] = useState<{ [key: number]: string }>({});

//   // Validation
//   const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});

//   // Sheet Info
//   const [sheetName, setSheetName] = useState('');

//   // Loading & Error
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [loadingSections, setLoadingSections] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [loadingExamTypes, setLoadingExamTypes] = useState(false);
//   const [error, setError] = useState('');

//   // Container Toggle
//   const [isMinimized, setIsMinimized] = useState(false);
//   const toggleContainerSize = () => setIsMinimized((prev) => !prev);

//   // Save Button
//   const [isSaveDisabled, setIsSaveDisabled] = useState(false);

//   // Helper Function to Get Column Key
//   const getSelectedColumnKey = (): string | null => {
//     const examType = examTypes.find((type) => type.examType === selectedExamType);
//     if (!examType) return null;

//     // Since columnNumber is already the column name, return it directly
//     return examType.columnNumber;
//   };

//   // =============================
//   // 1. Fetch user’s subjects & school
//   // =============================
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setLoadingSubjects(true);
//       setError('');
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         if (session?.user) {
//           const { data: profile, error } = await supabase
//             .from('profiles') // Corrected table name to 'profiles'
//             .select('subject1, subject2, subject3, subject4, subject5, school')
//             .eq('id', session.user.id)
//             .single();

//           if (error || !profile) {
//             throw error || new Error('No profile found');
//           }

//           const userSubjects = [
//             profile.subject1,
//             profile.subject2,
//             profile.subject3,
//             profile.subject4,
//             profile.subject5,
//           ].filter((s) => s) as string[];

//           setSubjects(userSubjects);
//           setUserSchool(profile.school);
//         } else {
//           setError('User not authenticated.');
//         }
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch user profile.');
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // =============================
//   // 2. Fetch the 'sheetName' from 'subjects'
//   //    matching subjectName + school
//   // =============================
//   useEffect(() => {
//     const fetchSheetName = async () => {
//       if (selectedSubject && userSchool) {
//         setError('');
//         setSheetName('');
//         try {
//           const { data: subjectData, error: subjectError } = await supabase
//             .from('subjects')
//             .select('sheetName')
//             .eq('school', userSchool)
//             .eq('subjectName', selectedSubject);

//           if (subjectError) throw subjectError;
//           if (!subjectData || subjectData.length === 0) {
//             // No row => no sheet
//             return;
//           }

//           setSheetName(subjectData[0].sheetName);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch sheet name.');
//         }
//       } else {
//         setSheetName('');
//       }
//     };

//     fetchSheetName();
//   }, [selectedSubject, userSchool]);

//   // =============================
//   // 3. Fetch Classes from the 'sheetName' table
//   //    We get distinct className where school = userSchool
//   // =============================
//   useEffect(() => {
//     const fetchClasses = async () => {
//       if (sheetName && userSchool) {
//         setLoadingClasses(true);
//         setError('');
//         setClasses([]);
//         setSelectedClass('');
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//         try {
//           const { data: classData, error: classError } = await supabase
//             .from(sheetName)
//             .select('className')
//             .eq('school', userSchool)
//             .neq('className', null);

//           if (classError || !classData) {
//             throw classError || new Error('No class data found');
//           }

//           const uniqueClasses = [
//             ...new Set(classData.map((row: any) => row.className)),
//           ];
//           setClasses(uniqueClasses);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch classes.');
//         } finally {
//           setLoadingClasses(false);
//         }
//       } else {
//         setClasses([]);
//         setSelectedClass('');
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//       }
//     };

//     fetchClasses();
//   }, [sheetName, userSchool]);

//   // =============================
//   // 4. Fetch Sections from 'sheetName' based on className
//   // =============================
//   useEffect(() => {
//     const fetchSections = async () => {
//       if (selectedClass && sheetName && userSchool) {
//         setLoadingSections(true);
//         setError('');
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//         try {
//           const { data: sectionData, error: sectionError } = await supabase
//             .from(sheetName)
//             .select('section')
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .neq('section', null);

//           if (sectionError || !sectionData) {
//             throw sectionError || new Error('No section data found');
//           }

//           const uniqueSections = [
//             ...new Set(sectionData.map((row: any) => row.section)),
//           ];
//           setSections(uniqueSections);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch sections.');
//         } finally {
//           setLoadingSections(false);
//         }
//       } else {
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//       }
//     };

//     fetchSections();
//   }, [selectedClass, sheetName, userSchool]);

//   // =============================
//   // 5. Fetch Students from 'sheetName'
//   //    matching school, className, and section
//   //    Sorted by 'id' in increasing order
//   // =============================
//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (selectedClass && selectedSection && sheetName && userSchool) {
//         setLoadingStudents(true);
//         setError('');
//         setStudents([]);
//         try {
//           const { data: studentData, error: studentError } = await supabase
//             .from(sheetName)
//             .select('id, studentID, studentName') // Included 'id' in select
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .eq('section', selectedSection)
//             .order('id', { ascending: true }); // Ordered by 'id' ascending

//           if (studentError || !studentData) {
//             throw studentError || new Error('No students found');
//           }

//           setStudents(studentData as StudentRow[]);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch students.');
//         } finally {
//           setLoadingStudents(false);
//         }
//       } else {
//         setStudents([]);
//       }
//     };

//     fetchStudents();
//   }, [selectedClass, selectedSection, sheetName, userSchool]);

//   // =============================
//   // 6. Fetch Exam Types
//   // =============================
//   useEffect(() => {
//     const fetchExamTypes = async () => {
//       if (userSchool) {
//         setLoadingExamTypes(true);
//         setError('');
//         setExamTypes([]);
//         setSelectedExamType('');
//         try {
//           const { data, error } = await supabase
//             .from('exam')
//             .select('examType, columnNumber')
//             .eq('school', userSchool);

//           if (error || !data) {
//             throw error || new Error('No exam types found');
//           }

//           let mappedExamTypes: ExamType[] = data.map((item: any) => ({
//             examType: item.examType as string,
//             columnNumber: item.columnNumber as string, // Ensure it's string
//           }));

//           // Optional: Sort exam types based on columnNumber or any other logic
//           mappedExamTypes.sort((a, b) => {
//             // If columnNumber starts with 'col' followed by a number, sort numerically
//             const getNumber = (col: string) => {
//               const match = col.match(/col(\d+)/);
//               return match ? parseInt(match[1], 10) : 0;
//             };
//             return getNumber(a.columnNumber) - getNumber(b.columnNumber);
//           });

//           setExamTypes(mappedExamTypes);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch exam types.');
//         } finally {
//           setLoadingExamTypes(false);
//         }
//       } else {
//         setExamTypes([]);
//         setSelectedExamType('');
//       }
//     };

//     fetchExamTypes();
//   }, [userSchool]);

//   // =============================
//   // 7. Fetch Marks Dynamically Based on Selected Exam Type
//   // =============================
//   useEffect(() => {
//     const fetchMarks = async () => {
//       if (
//         students.length > 0 &&
//         sheetName &&
//         userSchool &&
//         selectedExamType
//       ) {
//         const columnKey = getSelectedColumnKey();
//         if (!columnKey) {
//           setError('Invalid exam type selected.');
//           return;
//         }

//         setError('');
//         try {
//           const selectString = `studentID, studentName, ${columnKey}`;

//           console.log('Fetching marks with:', {
//             sheetName,
//             selectString,
//             school: userSchool,
//             className: selectedClass,
//             section: selectedSection,
//             studentIDs: students.map((s) => s.studentID),
//           });

//           const { data: marksData, error: marksError } = await supabase
//             .from(sheetName)
//             .select(selectString)
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .eq('section', selectedSection)
//             .in('studentID', students.map((s) => s.studentID));

//           if (marksError || !marksData) {
//             throw marksError || new Error('No marks data found');
//           }

//           // Build initial marks
//           const initialMarks: { [key: number]: string } = {};
//           marksData.forEach((row: any) => {
//             const val = row[columnKey];
//             initialMarks[row.studentID] = val !== null && val !== undefined ? val.toString() : '';
//           });

//           // For any student not returned in marksData, set empty
//           students.forEach((stu) => {
//             if (!initialMarks.hasOwnProperty(stu.studentID)) {
//               initialMarks[stu.studentID] = '';
//             }
//           });

//           setStudentMarks(initialMarks);
//         } catch (err: any) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch marks.');
//         }
//       } else {
//         setStudentMarks({});
//       }
//     };

//     fetchMarks();
//   }, [
//     students,
//     sheetName,
//     userSchool,
//     selectedClass,
//     selectedSection,
//     selectedExamType,
//     examTypes,
//   ]);

//   // =============================
//   // handleInputChange
//   // =============================
//   const handleInputChange = (studentID: number, value: string) => {
//     // 0-100 or "-" logic
//     if (
//       value === '-' ||
//       value === '' ||
//       (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 100)
//     ) {
//       setStudentMarks((prev) => ({
//         ...prev,
//         [studentID]: value,
//       }));
//       setValidationErrors((prevErrors) => {
//         const { [studentID]: _, ...rest } = prevErrors;
//         return rest;
//       });
//     } else {
//       setValidationErrors((prevErrors) => ({
//         ...prevErrors,
//         [studentID]: 'Enter a number between 0 and 100 or "-"',
//       }));
//     }
//   };

//   // =============================
//   // handleSave
//   // =============================
//   const handleSave = async () => {
//     if (!sheetName) {
//       setError('Sheet name not defined.');
//       return;
//     }

//     if (!selectedExamType) {
//       setError('Please select an exam type.');
//       return;
//     }

//     const columnKey = getSelectedColumnKey();
//     if (!columnKey) {
//       setError('Invalid exam type selected.');
//       return;
//     }

//     try {
//       // For each student, update the mark in the sheetName table
//       const updates = students.map(async (stu) => {
//         const mark = studentMarks[stu.studentID];
//         if (mark !== undefined && mark !== '') {
//           let markValue: string | number | null = null;
//           if (mark === '-') markValue = '-';
//           else markValue = Number(mark);

//           const updateData: any = { [columnKey]: markValue };
//           const { error } = await supabase
//             .from(sheetName)
//             .update(updateData)
//             .eq('studentID', stu.studentID)
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .eq('section', selectedSection);

//           if (error) throw error;
//         }
//       });

//       await Promise.all(updates);
//       alert(`Marks (${columnKey}) saved successfully!`);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || 'Failed to save marks.');
//     }
//   };

//   // Optional: Delay Save
//   const handleSaveWithDelay = async () => {
//     if (isSaveDisabled) return;
//     setIsSaveDisabled(true);
//     await handleSave();
//     setTimeout(() => setIsSaveDisabled(false), 5000);
//   };

//   // Clear All Marks
//   const handleClearAll = () => {
//     if (window.confirm('Are you sure you want to clear all marks?')) {
//       setStudentMarks({});
//       alert('All marks cleared successfully.');
//     }
//   };

//   // =============================
//   // Render
//   // =============================
//   return (
//     <>
//       {/* Header */}
//       <header className="header">
//         <Container>
//           <Row className="align-items-center">
//             <Col>
//               <h1 className="header-title">Teacher Dashboard</h1>
//             </Col>
//             <Col className="text-end">
//               <Link
//                 to="/attendance"
//                 className="attendance-icon btn btn-light rounded-circle p-2 shadow"
//                 aria-label="Attendance Link"
//                 title="Attendance"
//               >
//                 📅
//               </Link>
//             </Col>
//           </Row>
//         </Container>
//       </header>

//       <Container fluid className="main-content position-relative">
//         {/* Show Errors */}
//         {error && <Alert variant="danger" className="error-message">{error}</Alert>}

//         {/* Dropdowns */}
//         <div
//           className={`card p-4 mb-4 dropdown-container ${
//             isMinimized ? 'dropdown-container-minimized' : 'dropdown-container-expanded'
//           }`}
//           style={{
//             width: '100%',
//             margin: '0',
//             transition: 'all 0.3s ease',
//           }}
//         >
//           {!isMinimized && (
//             <Row>
//               {/* Subject */}
//               <Col md={3} sm={6} xs={12} className="mb-3">
//                 <Form.Group controlId="subjectDropdown">
//                   <Form.Label>Select Subject</Form.Label>
//                   <Dropdown onSelect={(val) => setSelectedSubject(val || '')}>
//                     <Dropdown.Toggle
//                       variant="light"
//                       id="dropdown-subject"
//                       className="w-100"
//                       disabled={loadingSubjects || subjects.length === 0}
//                     >
//                       {selectedSubject ||
//                         (loadingSubjects ? 'Loading subjects...' : 'Select a subject')}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       {subjects.map((subj, idx) => (
//                         <Dropdown.Item key={idx} eventKey={subj}>
//                           {subj}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>

//               {/* Class */}
//               <Col md={3} sm={6} xs={12} className="mb-3">
//                 <Form.Group controlId="classDropdown">
//                   <Form.Label>Select Class</Form.Label>
//                   <Dropdown onSelect={(val) => setSelectedClass(val || '')}>
//                     <Dropdown.Toggle
//                       variant="light"
//                       id="dropdown-class"
//                       className="w-100"
//                       disabled={!sheetName || loadingClasses || classes.length === 0}
//                     >
//                       {selectedClass ||
//                         (loadingClasses ? 'Loading classes...' : 'Select a class')}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       {classes.map((cls, idx) => (
//                         <Dropdown.Item key={idx} eventKey={cls}>
//                           {cls}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>

//               {/* Section */}
//               <Col md={3} sm={6} xs={12} className="mb-3">
//                 <Form.Group controlId="sectionDropdown">
//                   <Form.Label>Select Section</Form.Label>
//                   <Dropdown onSelect={(val) => setSelectedSection(val || '')}>
//                     <Dropdown.Toggle
//                       variant="light"
//                       id="dropdown-section"
//                       className="w-100"
//                       disabled={!selectedClass || loadingSections || sections.length === 0}
//                     >
//                       {selectedSection ||
//                         (loadingSections ? 'Loading sections...' : 'Select a section')}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       {sections.map((sec, idx) => (
//                         <Dropdown.Item key={idx} eventKey={sec}>
//                           {sec}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>

//               {/* Exam Type */}
//               <Col md={3} sm={6} xs={12} className="mb-3">
//                 <Form.Group controlId="examTypeDropdown">
//                   <Form.Label>Exam Type</Form.Label>
//                   <Dropdown onSelect={(val) => setSelectedExamType(val || '')}>
//                     <Dropdown.Toggle
//                       variant="light"
//                       id="dropdown-examType"
//                       className="w-100"
//                       disabled={loadingExamTypes || examTypes.length === 0}
//                     >
//                       {selectedExamType ||
//                         (loadingExamTypes ? 'Loading exam types...' : 'Select an exam type')}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       {examTypes.map((type, idx) => (
//                         <Dropdown.Item key={idx} eventKey={type.examType}>
//                           {`${type.columnNumber}: ${type.examType}`}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}

//           <button
//             onClick={toggleContainerSize}
//             className="chevron-btn2"
//             aria-label={isMinimized ? 'Expand Dropdowns' : 'Minimize Dropdowns'}
//           >
//             {isMinimized ? '\u25BC' : '\u25B2'}
//           </button>
//         </div>

//         {/* Students Table */}
//         <Row>
//           <Col>
//             <Card
//               className={`students-card ${isMinimized ? 'students-card-expanded' : 'students-card-collapsed'}`}
//               style={{
//                 maxHeight: isMinimized ? '600px' : '300px',
//                 transition: 'max-height 0.3s ease',
//                 overflowY: 'auto',
//               }}
//             >
//               <Card.Body>
//                 {loadingStudents ? (
//                   <div className="d-flex justify-content-center align-items-center spinner-container">
//                     <Spinner animation="border" variant="primary" />
//                   </div>
//                 ) : students.length > 0 ? (
//                   <>
//                     <Table bordered hover responsive className="students-table">
//                       <thead className="table-primary">
//                         <tr>
//                           <th>Student Name</th>
//                           <th>
//                             {selectedExamType
//                               ? `Mark in ${getSelectedColumnKey()} (${selectedExamType})`
//                               : 'Mark'}
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {students.map((stu) => (
//                           <tr key={stu.id}> {/* Changed key to 'stu.id' */}
//                             <td>{stu.studentName}</td>
//                             <td>
//                               <Form.Control
//                                 type="text"
//                                 placeholder="Enter mark"
//                                 value={studentMarks[stu.studentID] || ''}
//                                 onChange={(e) => handleInputChange(stu.studentID, e.target.value)}
//                                 isInvalid={!!validationErrors[stu.studentID]}
//                                 aria-label={`Enter mark for ${stu.studentName}`}
//                               />
//                               <Form.Control.Feedback type="invalid">
//                                 {validationErrors[stu.studentID]}
//                               </Form.Control.Feedback>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </>
//                 ) : (
//                   <Alert variant="info">
//                     No students found or not yet loaded.
//                   </Alert>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Bottom Buttons */}
//         <Row className="fixed-bottom mt-4">
//           <Col className="d-flex flex-column align-items-center">
//             <div
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '0px',
//                 width: '100%',
//                 alignItems: 'center',
//               }}
//             >
//               <Button
//                 variant="primary"
//                 onClick={handleSaveWithDelay}
//                 disabled={
//                   isSaveDisabled || students.length === 0 || !selectedExamType
//                 }
//                 aria-label="Save Marks"
//                 className="save-marks-button"
//               >
//                 Save Marks ({getSelectedColumnKey() || 'N/A'})
//               </Button>
//               {/*
//               <Button
//                 variant="danger"
//                 onClick={handleClearAll}
//                 style={{ width: '100%' }}
//               >
//                 Clear All
//               </Button>
//               */}
//             </div>
//           </Col>
//         </Row>

//         {/* Footer */}
//         <footer className="footer">
//           <Container>
//             <Row>
//               <Col className="text-center">
//                 &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
//               </Col>
//             </Row>
//           </Container>
//         </footer>
//       </Container>
//     </>
//   );
// };

// export default TeacherDashboard;
