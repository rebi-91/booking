import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabase'; // Ensure this path is correct
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

Chart.register(...registerables);

interface ExamType {
  examType: string;
  columnNumber: number;
}

const TeacherDashboard: React.FC = () => {
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

  // Modal States
  const [isAdjustRatiosModalOpen, setIsAdjustRatiosModalOpen] = useState(false);

  // Ratios and Chart Data
  const [ratios, setRatios] = useState<{ [key: string]: number }>({});
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[],
  });

  // Sheet Names
  const [sheetName, setSheetName] = useState('');
  const studentSheetName = 'student';

  // Toggle State for Dropdown Container
  const [isDropdownsMinimized, setIsDropdownsMinimized] = useState(false);

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

  useEffect(() => {
    const fetchExamTypes = async () => {
      if (selectedSubject && userSchool) {
        setLoadingExamTypes(true);
        setError('');
        setExamTypes([]);
        setSelectedExamType('');
        setSelectedExamColumn('');
        try {
          const { data, error } = await supabase
            .from('exam')
            .select('examType, columnNumber')
            .eq('subjectName', selectedSubject)
            .eq('school', userSchool);

          if (error || !data) {
            throw error || new Error('No exam types found');
          }

          let mappedExamTypes = (data as any[]).map((item) => ({
            examType: item.examType as string,
            columnNumber: item.columnNumber as number,
          }));

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
  }, [selectedSubject, userSchool]);

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

  const handleSave = async () => {
    if (!selectedExamType || !selectedExamColumn || !sheetName) {
      setError('Exam type, column, or sheet name is not defined.');
      return;
    }

    setValidationErrors({});
    let hasError = false;
    const newValidationErrors: { [key: number]: string } = {};

    try {
      for (const student of students) {
        const mark = studentMarks[student.id];
        if (mark === '') {
          hasError = true;
          newValidationErrors[student.id] = 'Mark cannot be empty.';
        } else if (
          mark !== '-' &&
          (isNaN(Number(mark)) || Number(mark) < 0 || Number(mark) > 100)
        ) {
          hasError = true;
          newValidationErrors[student.id] =
            'Mark must be between 0 and 100 or "-".';
        }
      }

      if (hasError) {
        setValidationErrors(newValidationErrors);
        alert('Please fill in all marks correctly before saving.');
        return;
      }

      const columnKey = selectedExamColumn; // already a string
      const updates = students.map(async (student) => {
        const mark = studentMarks[student.id];
        let markValue: string | number | null = null;
        if (mark === '-') {
          markValue = '-';
        } else if (mark === '') {
          markValue = null;
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
      });

      await Promise.all(updates);
      alert('Marks saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save marks.');
    }
  };

  const openAdjustRatiosModal = () => {
    if (!selectedExamType) {
      setError('Please select an exam type before adjusting ratios.');
      return;
    }
    setIsAdjustRatiosModalOpen(true);
  };

  const closeAdjustRatiosModal = () => {
    setIsAdjustRatiosModalOpen(false);
  };

  const handleRatioChange = (examType: string, value: string) => {
    const numVal = Number(value);
    setRatios((prevRatios) => ({
      ...prevRatios,
      [examType]: isNaN(numVal) ? 0 : numVal,
    }));
  };

  const handleSaveRatios = async () => {
    try {
      const updates = Object.keys(ratios).map(async (examType) => {
        const ratio = ratios[examType];
        if (isNaN(ratio) || ratio < 0 || ratio > 100) {
          throw new Error(`Invalid ratio for exam type ${examType}.`);
        }

        const { error } = await supabase
          .from('exam_ratios')
          .upsert([
            {
              examType,
              subjectName: selectedSubject,
              ratio: ratio,
            },
          ]);

        if (error) {
          throw error;
        }
      });

      await Promise.all(updates);
      alert('Ratios saved successfully!');
      setIsAdjustRatiosModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save ratios.');
    }
  };

  useEffect(() => {
    if (isAdjustRatiosModalOpen && selectedSubject) {
      const fetchRatios = async () => {
        try {
          const { data, error } = await supabase
            .from('exam_ratios')
            .select('examType, ratio')
            .eq('subjectName', selectedSubject);

          if (error) {
            throw error;
          }

          const fetchedRatios: { [key: string]: number } = {};
          (data as any[]).forEach((item) => {
            fetchedRatios[item.examType] = item.ratio;
          });
          setRatios(fetchedRatios);

          const labels = Object.keys(fetchedRatios);
          const values = Object.values(fetchedRatios);
          setChartData({
            labels,
            datasets: [
              {
                label: 'Exam Ratios (%)',
                data: values,
                backgroundColor: 'rgba(13, 47, 122, 0.6)',
                borderColor: 'rgba(13, 47, 122, 1)',
                borderWidth: 1,
              },
            ],
          });
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to fetch ratios.');
        }
      };

      fetchRatios();
    }
  }, [isAdjustRatiosModalOpen, selectedSubject]);

  // ----------------------------
  // Render Component
  // ----------------------------

  return (
    <>
      <style>{`
        /* General Styles */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f9;
          margin: 0;
          padding: 0;
          color: #333;
        }

        header {
          background-color: #0D2F7A;
          color: white;
          padding: 20px 40px;
          text-align: center;
          font-size: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Styles for the Attendance Icon */
        .icon-button {
          position: absolute;
          bottom: 14px; /* Positioned at the bottom center */
          left: 65%;
          transform: translateX(-10%);
          width: 50px;
          height: 50px;
          background-color: #16a085;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: background-color 0.3s, transform 0.3s, border 0.3s;
          text-decoration: none;
          color: white;
          font-size: 1.5rem;
          user-select: none;
          border: 2px solid transparent; /* Initial border */
        }

        .icon-button:hover {
          background-color: #1abc9c;
          transform: scale(1.1);
          
        }

        .container {
          padding: 120px 60px 60px 60px; /* Adjusted padding to account for fixed header and chevron */
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          min-height: calc(100vh - 180px); /* Adjust based on header and footer height */
        }

        /* Dropdowns Container Styles */
        .dropdown-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          margin-top: -15px;
          background-color: #ffffff;
          padding: 30px; /* Increased padding */
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          max-height: ${isDropdownsMinimized ? '40px' : '500px'}; /* Adjust heights */
          overflow: hidden; /* Hide dropdowns when minimized */
          transition: max-height 0.3s ease;
        }

        /* Chevron Toggle Styles */
        .toggle-chevron {
          position: absolute;
          bottom: -10px; /* Positioned partially outside */
          left: 50%;
          overflow: visible; /* Ensure chevron can overflow */
          transform: translateX(-50%);
          cursor: pointer;
          font-size: 1.5rem;
          color: #0D2F7A;
          transition: transform 0.3s;
          border: 2px solid transparent; /* Initial border */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff; /* Optional: background to enhance visibility */
          z-index: 1000;
        }

        /* Hover Effect for Chevron Toggle */
        .toggle-chevron:hover {
          border: 2px solid #0D2F7A; /* Blue border on hover */
          transform: translateX(-50%) scale(1.1); /* Slightly enlarge on hover */
        }

        /* Dropdown Label Styles */
        .dropdown-container .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        /* Dropdown Select Styles */
        .dropdown-container .form-group select {
          width: 100%;
          padding: 0px 0px; /* Increased padding for taller dropdown */
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          font-size: 1rem; /* Adjust font size as needed */
          height: 40px; /* Increased height */
          box-sizing: border-box;
          transition: border-color 0.3s, box-shadow 0.3s;
          background-color: #ecf0f1;
        }

        .dropdown-container .form-group select:focus {
          border-color: #3498db;
          box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
          outline: none;
        }

                /* Student List Styles */
        .student-list {
          max-height: 700px;
          overflow-y: auto;
          background-color: white;
          padding: 18px;
          padding-right: 40px; /* Increased padding on the right */
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 90px;
          transition: max-height 0.3s ease;
          
          /* New Properties for Alignment */
          width: 100%; /* Adjust as needed */
          max-width: 790px; /* Ensure it doesn't exceed container's max-width */
          margin-left: auto; /* Aligns the student-list to the right */
        }

        /* Responsive Adjustments for Smaller Screens */
        @media (max-width: 768px) {
          .student-list {
            width: 100%; /* Full width on small screens */
            max-width: 100%; /* Remove max-width restriction */
            padding-right: 30px; /* Adjusted padding for smaller screens */
          }
        }


           .student-container {
  display: flex;
  justify-content: flex-end; /* Aligns all content to the right */
  align-items: center; /* Centers items vertically */
  padding: 8px 0px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
  width: 100%; /* Ensures the container spans the full width of its parent */
  box-sizing: border-box; /* Ensures padding is included in the width */
}


        .student-container:last-child {
        
          margin-bottom: 30px; 
        }

        /* Student Name Styling */
        .student-name {
          flex: 0 0 80%;
          font-size: 1.5rem;
          color: #2c3e50;
          text-align: right;
          padding-right: 20px;
        }

        /* Mark Input Field Styling */
        .mark-field {
          flex: 0 0 30%;
          padding: 8px 40px;
          marginRight: 20px; /* Adjusted padding for smaller height */
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          text-align: center;
          font-size: 1rem;
          color: grey; /* Changed font color to grey */
          box-sizing: border-box;
          transition: border-color 0.3s, box-shadow 0.3s;
          background-color: #ecf0f1;
          height: 40px; /* Reduced height */
        }

        .mark-field:focus {
          border-color: #3498db;
          box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
          outline: none;
        }

        /* Highlight invalid fields */
        .mark-field.invalid {
          border-color: #e74c3c;
          box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
        }

        /* Validation Error Message */
        .validation-error {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 5px;
          text-align: left;
        }

        /* General Button Styles */
        button {
          width: 100%;
          padding: 15px;
          background-color: #0D2F7A;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        button:hover {
          background-color: #0A245D;
          /* Removed transform to prevent positional shift */
        }

        /* Save Marks Button Specific Styles */
        #saveMarksButton {
          position: fixed;
          bottom: 70px; /* Positioned above the footer */
          left: 50%;
          transform: translateX(-50%);
          padding: 25px 25px;
          margin-top: 10px;
          background-color: #0D2F7A;
          border: 2px solid #0C2A6E;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s, border-color 0.3s; /* Removed transform */
          z-index: 100;
          width: 90%; /* Match the width of the student list */
          max-width: 790px; /* Ensure it doesn't exceed container's max-width */
        }

        /* Hover Effect for Save Marks Button */
        #saveMarksButton:hover:not(:disabled) {
          background-color: #0A245D;
          border-color: #0A245D;
          /* Removed transform to prevent positional shift */
        }

        #saveMarksButton:disabled {
          background-color: #a6c8ff;
          border-color: #92b7ff;
          cursor: not-allowed;
        }

        /* Footer */
        footer {
          text-align: center;
          padding: 20px;
          background-color: #ecf0f1;
          color: #7f8c8d;
          position: fixed;
          bottom: 0;
          width: 100%;
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Modal Styles */
        .modal {
          display: ${isAdjustRatiosModalOpen ? 'block' : 'none'};
          position: fixed;
          z-index: 1001;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.5);
        }

        .modal-content {
          background-color: #fefefe;
          margin: 5% auto;
          padding: 30px;
          border: 1px solid #ddd;
          width: 80%;
          border-radius: 10px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .close-modal {
          color: #aaa;
          position: absolute;
          top: 15px;
          right: 25px;
          font-size: 30px;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s;
        }

        .close-modal:hover,
        .close-modal:focus {
          color: #000;
          text-decoration: none;
          cursor: pointer;
        }

        /* Styles for weights inputs */
        .weights-inputs-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          width: 100%;
        }

        .weights-input-item {
          display: flex;
          align-items: center;
          margin: 15px 0;
          width: 100%;
          max-width: 700px;
        }

        .weights-input-item label {
          flex: 1;
          text-align: left;
          font-weight: bold;
          margin-right: 15px;
          font-size: 1.1rem;
        }

        /* Styles for percentage bar meters */
        .percentage-bar {
          position: relative;
          flex: 3;
          height: 45px;
          background-color: #ecf0f1;
          border-radius: 22.5px;
          cursor: pointer;
          margin-right: 15px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }

        .percentage-fill {
          height: 100%;
          background-color: #0D2F7A;
          border-radius: 22.5px 0 0 22.5px;
          width: 0%;
          transition: width 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          position: relative;
        }

        .percentage-handle {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 35px;
          height: 35px;
          background-color: #fff;
          border: 3px solid #0D2F7A;
          border-radius: 50%;
          cursor: pointer;
          left: 0%;
          transition: left 0.2s, background-color 0.3s, border-color 0.3s;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .percentage-handle:hover {
          background-color: #0D2F7A;
          color: white;
        }

        /* Adjust Ratios Button */
        .adjust-button {
          margin-left: 10px;
          border: none;
          background: #8e44ad;
          cursor: pointer;
          font-size: 1.2rem;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s, transform 0.3s;
        }

        .adjust-button:hover {
          background-color: #71368a;
          transform: scale(1.1);
        }

        /* Styles for Adjust Ratios Button */
        .adjust-ratios-button {
          margin-left: 10px;
          border: none;
          background: #16a085;
          cursor: pointer;
          font-size: 1.2rem;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s, transform 0.3s;
        }

        .adjust-ratios-button:hover {
          background-color: #1abc9c;
          transform: scale(1.1);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .container {
            padding: 80px 40px 60px 40px;
          }

          .modal-content {
            width: 90%;
          }

          #weightsChartContainer {
            flex-direction: column;
            align-items: center;
          }

          #weightsChartWrapper {
            width: 80%;
          }

          #weightsLegendContainer {
            margin-left: 0;
            margin-top: 20px;
          }
        }

        @media (max-width: 768px) {
          .dropdown-container .form-group select {
            font-size: 1rem;
            padding: 10px 18px; /* Adjusted padding for smaller height */
            height: 45px; /* Adjusted height */
          }

          .dropdown-container .form-group label {
            font-size: 1rem;
          }

          .form-group {
            margin-bottom: 25px;
          }

          .student-list {
            max-height: 60vh;
          }

          .student-name {
            font-size: 1.4rem;
          }

          .mark-field {
            font-size: 1.1rem;
          }

          /* Adjust icon position on smaller screens */
          .icon-button {
            right: 20px;
          }

          /* Specific Button Styles for Small Screens */
          #saveMarksButton, #saveRatiosButton {
            width: 100%; /* Full width on small screens */
            padding: 12px 20px; /* Adjust padding */
            font-size: 1rem; /* Adjust font size */
          }
        }

        /* Focus States for Accessibility */
        button:focus,
        select:focus,
        input[type="text"]:focus,
        input[type="password"]:focus {
          outline: 3px solid #2980b9;
          outline-offset: 2px;
        }

        /* Error Message Styling */
        .error-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="header-content">
          Teacher Dashboard
          {/* Attendance Icon (Always Visible) */}
          <Link
            to="/attendance"
            id="holidaysIcon"
            className="icon-button"
            aria-label="Attendance Link"
            title="Attendance"
          >
            📅
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="container">
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Dropdowns Container */}
        <div className="dropdown-container">
          {/* Select Subject Dropdown */}
          {!isDropdownsMinimized && (
            <>
              <div className="form-group">
                <label htmlFor="subjectDropdown">Select Subject:</label>
                <select
                  id="subjectDropdown"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={loadingSubjects || subjects.length === 0}
                  aria-label="Select Subject"
                >
                  <option value="" disabled>
                    {loadingSubjects ? 'Loading subjects...' : 'Select a subject'}
                  </option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Class Dropdown */}
              <div className="form-group">
                <label htmlFor="classDropdown">Select Class:</label>
                <select
                  id="classDropdown"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!selectedSubject || loadingClasses || classes.length === 0}
                  aria-label="Select Class"
                >
                  <option value="" disabled>
                    {loadingClasses ? 'Loading classes...' : 'Select a class'}
                  </option>
                  {classes.map((cls, index) => (
                    <option key={index} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Class Section Dropdown */}
              <div className="form-group">
                <label htmlFor="classSectionDropdown">Select Class Section:</label>
                <select
                  id="classSectionDropdown"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedClass || loadingSections || sections.length === 0}
                  aria-label="Select Class Section"
                >
                  <option value="" disabled>
                    {loadingSections ? 'Loading sections...' : 'Select a class section'}
                  </option>
                  {sections.map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type Dropdown */}
              <div className="form-group">
                <label htmlFor="examTypeDropdown">Exam Type:</label>
                <select
                  id="examTypeDropdown"
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  disabled={!selectedSubject || loadingExamTypes || examTypes.length === 0}
                  aria-label="Select Exam Type"
                >
                  <option value="" disabled>
                    {loadingExamTypes ? 'Loading exam types...' : 'Select an exam type'}
                  </option>
                  {examTypes.map((type, index) => (
                    <option key={index} value={type.examType}>
                      {`${type.columnNumber}: ${type.examType}`}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Chevron Toggle */}
          <div
            className="toggle-chevron"
            onClick={() => setIsDropdownsMinimized(!isDropdownsMinimized)}
            aria-label={isDropdownsMinimized ? 'Expand Filters' : 'Minimize Filters'}
            title={isDropdownsMinimized ? 'Expand Filters' : 'Minimize Filters'}
          >
            {isDropdownsMinimized ? <FaChevronDown /> : <FaChevronUp />}
          </div>
        </div>

        {/* Students List */}
        <div className="form-group">
          <label></label>
          <div
            id="studentList"
            className="student-list"
            style={{
              maxHeight: isDropdownsMinimized ? '600px' : '500px', // Adjust maxHeight based on toggle
              transition: 'max-height 0.3s ease',
            }}
          >
            {loadingStudents ? (
              <p>Loading students...</p>
            ) : students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className="student-container">
                  <span className="student-name">{student.studentName}</span>
                  <div style={{ width: '100%' }}>
                    <input
                      type="text"
                      className={`mark-field ${
                        validationErrors[student.id] ? 'invalid' : ''
                      }`}
                      placeholder="Enter mark"
                      value={studentMarks[student.id] || ''}
                      onChange={(e) => handleInputChange(student.id, e.target.value)}
                      aria-label={`Enter mark for ${student.studentName}`}
                    />
                    {validationErrors[student.id] && (
                      <div className="validation-error">
                        {validationErrors[student.id]}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      {/* Save Marks Button */}
      <button
        id="saveMarksButton"
        disabled={students.length === 0}
        onClick={handleSave}
        aria-label="Save Marks"
        title="Save Marks"
      >
        Save Marks
      </button>

      {/* Modal for Adjusting Ratios */}
      {isAdjustRatiosModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeAdjustRatiosModal}>
              &times;
            </span>
            <h2>Adjust Exam Type Ratios for "{selectedSubject}"</h2>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: true,
                      text: 'Exam Type Ratios',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Ratio (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Exam Type',
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="weights-inputs-container">
              {Object.keys(ratios).map((examType) => (
                <div key={examType} className="weights-input-item">
                  <label htmlFor={`ratio-${examType}`}>{examType} Ratio:</label>
                  <input
                    type="number"
                    id={`ratio-${examType}`}
                    value={ratios[examType] || ''}
                    onChange={(e) => handleRatioChange(examType, e.target.value)}
                    min="0"
                    max="100"
                    aria-label={`Adjust ratio for ${examType}`}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSaveRatios} id="saveRatiosButton">
              Save Ratios
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
      </footer>
    </>
  );
};

export default TeacherDashboard;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import supabase from '../../supabase'; // Ensure this path is correct
// import { Chart, registerables } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import chevron icons

// Chart.register(...registerables);

// const TeacherDashboard = () => {
//   // ----------------------------
//   // State Variables
//   // ----------------------------

//   // User Data
//   const [subjects, setSubjects] = useState([]);
//   const [userSchool, setUserSchool] = useState('');

//   // Dropdown Selections
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [selectedExamType, setSelectedExamType] = useState('');

//   // Dropdown Options
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [examTypes, setExamTypes] = useState([]); // Dynamic exam types

//   // Selected Exam Column
//   const [selectedExamColumn, setSelectedExamColumn] = useState('');

//   // Loading and Error States
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [loadingSections, setLoadingSections] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [loadingExamTypes, setLoadingExamTypes] = useState(false);
//   const [error, setError] = useState('');

//   // Students List
//   const [students, setStudents] = useState([]);

//   // Student Marks
//   const [studentMarks, setStudentMarks] = useState({});

//   // Validation Errors
//   const [validationErrors, setValidationErrors] = useState({});

//   // Modal States
//   const [isAdjustRatiosModalOpen, setIsAdjustRatiosModalOpen] = useState(false);

//   // Chart Data for Ratios
//   const [ratios, setRatios] = useState({});
//   const [chartData, setChartData] = useState({});

//   // Sheet Names
//   const [sheetName, setSheetName] = useState(''); // For marks
//   const studentSheetName = 'student'; // Replace with your actual student sheet/table name

//   // Toggle State for Dropdown Container
//   const [isDropdownsMinimized, setIsDropdownsMinimized] = useState(false);

//   // ----------------------------
//   // Fetch User Profile and Subjects
//   // ----------------------------

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setLoadingSubjects(true);
//       setError('');
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         if (session && session.user) {
//           const { data: profile, error } = await supabase
//             .from('profiles')
//             .select('subject1, subject2, subject3, subject4, subject5, school')
//             .eq('id', session.user.id)
//             .single();

//           if (error) {
//             throw error;
//           }

//           const userSubjects = [
//             profile.subject1,
//             profile.subject2,
//             profile.subject3,
//             profile.subject4,
//             profile.subject5,
//           ].filter((subject) => subject); // Remove null or undefined subjects

//           setSubjects(userSubjects);
//           setUserSchool(profile.school);
//           console.log('User Subjects:', userSubjects);
//           console.log('User School:', profile.school);
//         } else {
//           setError('User not authenticated.');
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch user profile.');
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // ----------------------------
//   // Fetch Sheet Name based on Selected Subject and School
//   // ----------------------------

//   useEffect(() => {
//     const fetchSheetName = async () => {
//       if (selectedSubject && userSchool) {
//         setError('');
//         setSheetName('');
//         try {
//           // Fetch sheetName from subjects table
//           const { data: subjectData, error: subjectError } = await supabase
//             .from('subjects')
//             .select('sheetName')
//             .eq('school', userSchool)
//             .eq('subjectName', selectedSubject)
//             .single();

//           if (subjectError) {
//             throw subjectError;
//           }

//           const fetchedSheetName = subjectData.sheetName;
//           console.log('Fetched sheetName:', fetchedSheetName);
//           setSheetName(fetchedSheetName);
//         } catch (err) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch sheet name.');
//         }
//       } else {
//         setSheetName('');
//       }
//     };

//     fetchSheetName();
//   }, [selectedSubject, userSchool]);

//   // ----------------------------
//   // Fetch Classes from Student Sheet
//   // ----------------------------

//   useEffect(() => {
//     const fetchClasses = async () => {
//       if (studentSheetName && userSchool) {
//         setLoadingClasses(true);
//         setError('');
//         setClasses([]);
//         setSelectedClass('');
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//         try {
//           // Fetch unique className from the student sheet where school matches
//           const { data: classData, error: classError } = await supabase
//             .from(studentSheetName) // Fetching from student sheet
//             .select('className')
//             .eq('school', userSchool)
//             .neq('className', null);

//           if (classError) {
//             throw classError;
//           }

//           const uniqueClasses = [...new Set(classData.map((item) => item.className))];
//           setClasses(uniqueClasses);
//           console.log('Unique Classes:', uniqueClasses);
//         } catch (err) {
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
//         setSheetName('');
//       }
//     };

//     fetchClasses();
//   }, [studentSheetName, userSchool]);

//   // ----------------------------
//   // Fetch Sections from Student Sheet based on Selected Class
//   // ----------------------------

//   useEffect(() => {
//     const fetchSections = async () => {
//       if (selectedClass && studentSheetName && userSchool) {
//         setLoadingSections(true);
//         setError('');
//         setSections([]);
//         setSelectedSection('');
//         setStudents([]);
//         try {
//           // Fetch unique sections from the student sheet where className and school match
//           const { data: sectionData, error: sectionError } = await supabase
//             .from(studentSheetName) // Fetching from student sheet
//             .select('section')
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .neq('section', null);

//           if (sectionError) {
//             throw sectionError;
//           }

//           const uniqueSections = [...new Set(sectionData.map((item) => item.section))];
//           setSections(uniqueSections);
//           console.log('Unique Sections:', uniqueSections);
//         } catch (err) {
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
//   }, [selectedClass, studentSheetName, userSchool]);

//   // ----------------------------
//   // Fetch Students based on Selected Class and Section from Student Sheet
//   // ----------------------------

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (selectedClass && selectedSection && studentSheetName && userSchool) {
//         setLoadingStudents(true);
//         setError('');
//         setStudents([]);
//         try {
//           // Fetch all students from the student sheet where className, section, and school match
//           const { data: studentData, error: studentError } = await supabase
//             .from(studentSheetName) // Fetching from student sheet
//             .select('id, studentName')
//             .eq('school', userSchool)
//             .eq('className', selectedClass)
//             .eq('section', selectedSection)
//             .order('id', { ascending: true }); // Sort by id ascending

//           if (studentError) {
//             throw studentError;
//           }

//           setStudents(studentData);
//           console.log('Fetched Students:', studentData);
//         } catch (err) {
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
//   }, [selectedClass, selectedSection, studentSheetName, userSchool]);

//   // ----------------------------
//   // Fetch Exam Types based on Selected Subject and School
//   // ----------------------------

//   useEffect(() => {
//     const fetchExamTypes = async () => {
//       if (selectedSubject && userSchool) {
//         setLoadingExamTypes(true);
//         setError('');
//         setExamTypes([]);
//         setSelectedExamType('');
//         setSelectedExamColumn('');
//         try {
//           const { data, error } = await supabase
//             .from('exam')
//             .select('examType, columnNumber')
//             .eq('subjectName', selectedSubject)
//             .eq('school', userSchool); // Ensure exam types are fetched based on user's school

//           if (error) {
//             throw error;
//           }

//           // Map examTypes to include columnNumber
//           let mappedExamTypes = data.map((item) => ({
//             examType: item.examType,
//             columnNumber: item.columnNumber,
//           }));

//           // Sort examTypes based on columnNumber ascending
//           mappedExamTypes.sort((a, b) => a.columnNumber - b.columnNumber);

//           setExamTypes(mappedExamTypes);
//           console.log('Unique Exam Types:', mappedExamTypes);
//         } catch (err) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch exam types.');
//         } finally {
//           setLoadingExamTypes(false);
//         }
//       } else {
//         setExamTypes([]);
//         setSelectedExamType('');
//         setSelectedExamColumn('');
//       }
//     };

//     fetchExamTypes();
//   }, [selectedSubject, userSchool]);

//   // ----------------------------
//   // Set Selected Exam Column based on Exam Type
//   // ----------------------------

//   useEffect(() => {
//     if (selectedExamType && examTypes.length > 0) {
//       const selectedExam = examTypes.find((et) => et.examType === selectedExamType);
//       if (selectedExam) {
//         setSelectedExamColumn(selectedExam.columnNumber);
//         console.log('Selected Exam Column:', selectedExam.columnNumber);
//       } else {
//         setSelectedExamColumn('');
//       }
//     } else {
//       setSelectedExamColumn('');
//     }
//   }, [selectedExamType, examTypes]);

//   // ----------------------------
//   // Fetch Marks based on Selected Exam Column from Subject Marks Sheet
//   // ----------------------------

//   useEffect(() => {
//     const fetchMarks = async () => {
//       if (
//         selectedExamColumn &&
//         students.length > 0 &&
//         sheetName &&
//         userSchool
//       ) {
//         setError('');
//         try {
//           // Dynamically construct the select string
//           const selectColumns = `id, ${selectedExamColumn}`;

//           // Fetch marks from the subject marks sheet based on student IDs
//           const { data: marksData, error: marksError } = await supabase
//             .from(sheetName) // subject marks sheet
//             .select(selectColumns)
//             .in('id', students.map((student) => student.id));

//           if (marksError) {
//             throw marksError;
//           }

//           // Initialize studentMarks with fetched marks
//           const initialMarks = {};
//           marksData.forEach((markRecord) => {
//             initialMarks[markRecord.id] =
//               markRecord[selectedExamColumn] !== null
//                 ? markRecord[selectedExamColumn].toString()
//                 : '';
//           });

//           // For students without marks, initialize as empty string
//           students.forEach((student) => {
//             if (!initialMarks.hasOwnProperty(student.id)) {
//               initialMarks[student.id] = '';
//             }
//           });

//           setStudentMarks(initialMarks);
//           console.log('Fetched Marks:', marksData);
//         } catch (err) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch marks.');
//         }
//       } else {
//         setStudentMarks({});
//       }
//     };

//     fetchMarks();
//   }, [selectedExamColumn, students, sheetName, userSchool]);

//   // ----------------------------
//   // Handle Marks Input Changes
//   // ----------------------------

//   const handleInputChange = (studentId, value) => {
//     // Allow '-', empty string, or numbers between 0 and 100
//     if (
//       value === '-' ||
//       value === '' ||
//       (value !== '' &&
//         /^\d+$/.test(value) &&
//         Number(value) >= 0 &&
//         Number(value) <= 100)
//     ) {
//       setStudentMarks((prevMarks) => ({
//         ...prevMarks,
//         [studentId]: value,
//       }));

//       // Remove validation error for this student if any
//       setValidationErrors((prevErrors) => {
//         const { [studentId]: removed, ...rest } = prevErrors;
//         return rest;
//       });
//     }
//     // Optionally, you can provide feedback for invalid inputs here
//   };

//   // ----------------------------
//   // Handle Save Marks Functionality
//   // ----------------------------

//   const handleSave = async () => {
//     if (!selectedExamType || !selectedExamColumn || !sheetName) {
//       setError('Exam type, column, or sheet name is not defined.');
//       return;
//     }

//     // Reset previous validation errors
//     setValidationErrors({});
//     let hasError = false;
//     const newValidationErrors = {};

//     try {
//       // Validate all inputs before saving
//       for (const [studentId, mark] of Object.entries(studentMarks)) {
//         if (mark === '') {
//           hasError = true;
//           newValidationErrors[studentId] = 'Mark cannot be empty.';
//         } else if (
//           mark !== '-' &&
//           (isNaN(mark) || Number(mark) < 0 || Number(mark) > 100)
//         ) {
//           hasError = true;
//           newValidationErrors[studentId] =
//             'Mark must be between 0 and 100 or "-".';
//         }
//       }

//       if (hasError) {
//         setValidationErrors(newValidationErrors);
//         alert('Please fill in all marks correctly before saving.');
//         return;
//       }

//       // Update each student's mark in the subject marks sheet
//       const updates = students.map(async (student) => {
//         const mark = studentMarks[student.id];
//         let markValue = null;
//         if (mark === '-') {
//           markValue = '-'; // Record '-' as string
//         } else if (mark === '') {
//           markValue = null;
//         } else {
//           markValue = Number(mark);
//         }

//         const updateData = {
//           [selectedExamColumn]: markValue,
//         };

//         const { error } = await supabase
//           .from(sheetName) // Replace with actual subject marks sheet/table name
//           .update(updateData)
//           .eq('id', student.id);

//         if (error) {
//           throw error;
//         }
//       });

//       await Promise.all(updates);
//       alert('Marks saved successfully!');
//     } catch (err) {
//       console.error(err);
//       setError(err.message || 'Failed to save marks.');
//     }
//   };

//   // ----------------------------
//   // Handle Adjust Ratios Modal
//   // ----------------------------

//   const openAdjustRatiosModal = () => {
//     if (!selectedExamType) {
//       setError('Please select an exam type before adjusting ratios.');
//       return;
//     }
//     setIsAdjustRatiosModalOpen(true);
//     // Initialize ratios state based on current data
//     // Fetch ratios from the database if necessary
//   };

//   const closeAdjustRatiosModal = () => {
//     setIsAdjustRatiosModalOpen(false);
//   };

//   const handleRatioChange = (examType, value) => {
//     setRatios((prevRatios) => ({
//       ...prevRatios,
//       [examType]: value,
//     }));
//   };

//   const handleSaveRatios = async () => {
//     // Save the updated ratios to the database
//     // Implement according to your database schema
//     try {
//       // Example: Update ratios in the 'exam_ratios' table
//       // You might need to adjust this based on your actual schema
//       const updates = Object.keys(ratios).map(async (examType) => {
//         const ratio = ratios[examType];
//         if (
//           ratio === '' ||
//           isNaN(ratio) ||
//           Number(ratio) < 0 ||
//           Number(ratio) > 100
//         ) {
//           throw new Error(`Invalid ratio for exam type ${examType}.`);
//         }

//         const { error } = await supabase
//           .from('exam_ratios')
//           .upsert([
//             {
//               examType,
//               subjectName: selectedSubject,
//               ratio: Number(ratio),
//             },
//           ]);

//         if (error) {
//           throw error;
//         }
//       });

//       await Promise.all(updates);
//       alert('Ratios saved successfully!');
//       setIsAdjustRatiosModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || 'Failed to save ratios.');
//     }
//   };

//   // ----------------------------
//   // Chart Data for Adjust Ratios Modal
//   // ----------------------------

//   useEffect(() => {
//     if (isAdjustRatiosModalOpen && selectedSubject) {
//       // Fetch existing ratios from the database
//       const fetchRatios = async () => {
//         try {
//           const { data, error } = await supabase
//             .from('exam_ratios')
//             .select('examType, ratio')
//             .eq('subjectName', selectedSubject);

//           if (error) {
//             throw error;
//           }

//           const fetchedRatios = {};
//           data.forEach((item) => {
//             fetchedRatios[item.examType] = item.ratio;
//           });
//           setRatios(fetchedRatios);
//           console.log('Fetched Ratios:', fetchedRatios);

//           // Prepare chart data
//           const labels = Object.keys(fetchedRatios);
//           const values = Object.values(fetchedRatios);
//           setChartData({
//             labels,
//             datasets: [
//               {
//                 label: 'Exam Ratios (%)',
//                 data: values,
//                 backgroundColor: 'rgba(13, 47, 122, 0.6)',
//                 borderColor: 'rgba(13, 47, 122, 1)',
//                 borderWidth: 1,
//               },
//             ],
//           });
//         } catch (err) {
//           console.error(err);
//           setError(err.message || 'Failed to fetch ratios.');
//         }
//       };

//       fetchRatios();
//     }
//   }, [isAdjustRatiosModalOpen, selectedSubject]);

//   // ----------------------------
//   // Render Component
//   // ----------------------------

//   return (
//     <>
//       <style>{`
//         /* General Styles */
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f4f6f9;
//           margin: 0;
//           padding: 0;
//           color: #333;
//         }

//         header {
//           background-color: #0D2F7A;
//           color: white;
//           padding: 20px 40px;
//           text-align: center;
//           font-size: 2rem;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           position: fixed;
//           top: 0;
//           width: 100%;
//           z-index: 1000;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         /* Styles for the Attendance Icon */
//         .icon-button {
//           position: absolute;
//           bottom: 14px; /* Positioned at the bottom center */
//           left: 65%;
//           transform: translateX(-10%);
//           width: 50px;
//           height: 50px;
//           background-color: #16a085;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//           transition: background-color 0.3s, transform 0.3s, border 0.3s;
//           text-decoration: none;
//           color: white;
//           font-size: 1.5rem;
//           user-select: none;
//           border: 2px solid transparent; /* Initial border */
//         }

//         .icon-button:hover {
//           background-color: #1abc9c;
//           transform: scale(1.1);
          
//         }

//         .container {
//           padding: 120px 60px 60px 60px; /* Adjusted padding to account for fixed header and chevron */
//           max-width: 900px;
//           margin: 0 auto;
//           position: relative;
//           min-height: calc(100vh - 180px); /* Adjust based on header and footer height */
//         }

//         /* Dropdowns Container Styles */
//         .dropdown-container {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//           margin-bottom: 20px;
//           margin-top: -15px;
//           background-color: #ffffff;
//           padding: 30px; /* Increased padding */
//           border: 1px solid #bdc3c7;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           position: relative;
//           max-height: ${isDropdownsMinimized ? '40px' : '500px'}; /* Adjust heights */
//           overflow: hidden; /* Hide dropdowns when minimized */
//           transition: max-height 0.3s ease;
//         }

//         /* Chevron Toggle Styles */
//         .toggle-chevron {
//           position: absolute;
//           bottom: -10px; /* Positioned partially outside */
//           left: 50%;
//           overflow: visible; /* Ensure chevron can overflow */
//           transform: translateX(-50%);
//           cursor: pointer;
//           font-size: 1.5rem;
//           color: #0D2F7A;
//           transition: transform 0.3s;
//           border: 2px solid transparent; /* Initial border */
//           border-radius: 50%;
//           width: 40px;
//           height: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: #ffffff; /* Optional: background to enhance visibility */
//           z-index: 1000;
//         }

//         /* Hover Effect for Chevron Toggle */
//         .toggle-chevron:hover {
//           border: 2px solid #0D2F7A; /* Blue border on hover */
//           transform: translateX(-50%) scale(1.1); /* Slightly enlarge on hover */
//         }

//         /* Dropdown Label Styles */
//         .dropdown-container .form-group label {
//           display: block;
//           font-weight: bold;
//           margin-bottom: 8px;
//           font-size: 1.1rem;
//         }

//         /* Dropdown Select Styles */
//         .dropdown-container .form-group select {
//           width: 100%;
//           padding: 0px 0px; /* Increased padding for taller dropdown */
//           border: 1px solid #bdc3c7;
//           border-radius: 8px;
//           font-size: 1rem; /* Adjust font size as needed */
//           height: 40px; /* Increased height */
//           box-sizing: border-box;
//           transition: border-color 0.3s, box-shadow 0.3s;
//           background-color: #ecf0f1;
//         }

//         .dropdown-container .form-group select:focus {
//           border-color: #3498db;
//           box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
//           outline: none;
//         }

//                 /* Student List Styles */
//         .student-list {
//           max-height: 700px;
//           overflow-y: auto;
//           background-color: white;
//           padding: 18px;
//           padding-right: 40px; /* Increased padding on the right */
//           border: 1px solid #bdc3c7;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           margin-bottom: 90px;
//           transition: max-height 0.3s ease;
          
//           /* New Properties for Alignment */
//           width: 100%; /* Adjust as needed */
//           max-width: 790px; /* Ensure it doesn't exceed container's max-width */
//           margin-left: auto; /* Aligns the student-list to the right */
//         }

//         /* Responsive Adjustments for Smaller Screens */
//         @media (max-width: 768px) {
//           .student-list {
//             width: 100%; /* Full width on small screens */
//             max-width: 100%; /* Remove max-width restriction */
//             padding-right: 30px; /* Adjusted padding for smaller screens */
//           }
//         }


//            .student-container {
//   display: flex;
//   justify-content: flex-end; /* Aligns all content to the right */
//   align-items: center; /* Centers items vertically */
//   padding: 8px 0px;
//   margin-bottom: 10px;
//   border-bottom: 1px solid #ecf0f1;
//   width: 100%; /* Ensures the container spans the full width of its parent */
//   box-sizing: border-box; /* Ensures padding is included in the width */
// }


//         .student-container:last-child {
        
//           margin-bottom: 30px; 
//         }

//         /* Student Name Styling */
//         .student-name {
//           flex: 0 0 80%;
//           font-size: 1.5rem;
//           color: #2c3e50;
//           text-align: right;
//           padding-right: 20px;
//         }

//         /* Mark Input Field Styling */
//         .mark-field {
//           flex: 0 0 30%;
//           padding: 8px 40px;
//           marginRight: 20px; /* Adjusted padding for smaller height */
//           border: 1px solid #bdc3c7;
//           border-radius: 8px;
//           text-align: center;
//           font-size: 1rem;
//           color: grey; /* Changed font color to grey */
//           box-sizing: border-box;
//           transition: border-color 0.3s, box-shadow 0.3s;
//           background-color: #ecf0f1;
//           height: 40px; /* Reduced height */
//         }

//         .mark-field:focus {
//           border-color: #3498db;
//           box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
//           outline: none;
//         }

//         /* Highlight invalid fields */
//         .mark-field.invalid {
//           border-color: #e74c3c;
//           box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
//         }

//         /* Validation Error Message */
//         .validation-error {
//           color: #e74c3c;
//           font-size: 0.9rem;
//           margin-top: 5px;
//           text-align: left;
//         }

//         /* General Button Styles */
//         button {
//           width: 100%;
//           padding: 15px;
//           background-color: #0D2F7A;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 1.2rem;
//           cursor: pointer;
//           transition: background-color 0.3s, transform 0.3s;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           position: relative;
//         }

//         button:hover {
//           background-color: #0A245D;
//           /* Removed transform to prevent positional shift */
//         }

//         /* Save Marks Button Specific Styles */
//         #saveMarksButton {
//           position: fixed;
//           bottom: 70px; /* Positioned above the footer */
//           left: 50%;
//           transform: translateX(-50%);
//           padding: 25px 25px;
//           margin-top: 10px;
//           background-color: #0D2F7A;
//           border: 2px solid #0C2A6E;
//           border-radius: 8px;
//           font-size: 1.1rem;
//           cursor: pointer;
//           transition: background-color 0.3s, border-color 0.3s; /* Removed transform */
//           z-index: 100;
//           width: 90%; /* Match the width of the student list */
//           max-width: 790px; /* Ensure it doesn't exceed container's max-width */
//         }

//         /* Hover Effect for Save Marks Button */
//         #saveMarksButton:hover:not(:disabled) {
//           background-color: #0A245D;
//           border-color: #0A245D;
//           /* Removed transform to prevent positional shift */
//         }

//         #saveMarksButton:disabled {
//           background-color: #a6c8ff;
//           border-color: #92b7ff;
//           cursor: not-allowed;
//         }

//         /* Footer */
//         footer {
//           text-align: center;
//           padding: 20px;
//           background-color: #ecf0f1;
//           color: #7f8c8d;
//           position: fixed;
//           bottom: 0;
//           width: 100%;
//           box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
//         }

//         /* Modal Styles */
//         .modal {
//           display: ${isAdjustRatiosModalOpen ? 'block' : 'none'};
//           position: fixed;
//           z-index: 1001;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           overflow: auto;
//           background-color: rgba(0,0,0,0.5);
//         }

//         .modal-content {
//           background-color: #fefefe;
//           margin: 5% auto;
//           padding: 30px;
//           border: 1px solid #ddd;
//           width: 80%;
//           border-radius: 10px;
//           position: relative;
//           box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .close-modal {
//           color: #aaa;
//           position: absolute;
//           top: 15px;
//           right: 25px;
//           font-size: 30px;
//           font-weight: bold;
//           cursor: pointer;
//           transition: color 0.3s;
//         }

//         .close-modal:hover,
//         .close-modal:focus {
//           color: #000;
//           text-decoration: none;
//           cursor: pointer;
//         }

//         /* Styles for weights inputs */
//         .weights-inputs-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-top: 20px;
//           width: 100%;
//         }

//         .weights-input-item {
//           display: flex;
//           align-items: center;
//           margin: 15px 0;
//           width: 100%;
//           max-width: 700px;
//         }

//         .weights-input-item label {
//           flex: 1;
//           text-align: left;
//           font-weight: bold;
//           margin-right: 15px;
//           font-size: 1.1rem;
//         }

//         /* Styles for percentage bar meters */
//         .percentage-bar {
//           position: relative;
//           flex: 3;
//           height: 45px;
//           background-color: #ecf0f1;
//           border-radius: 22.5px;
//           cursor: pointer;
//           margin-right: 15px;
//           box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
//         }

//         .percentage-fill {
//           height: 100%;
//           background-color: #0D2F7A;
//           border-radius: 22.5px 0 0 22.5px;
//           width: 0%;
//           transition: width 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: bold;
//           position: relative;
//         }

//         .percentage-handle {
//           position: absolute;
//           top: 50%;
//           transform: translate(-50%, -50%);
//           width: 35px;
//           height: 35px;
//           background-color: #fff;
//           border: 3px solid #0D2F7A;
//           border-radius: 50%;
//           cursor: pointer;
//           left: 0%;
//           transition: left 0.2s, background-color 0.3s, border-color 0.3s;
//           z-index: 2;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//         }

//         .percentage-handle:hover {
//           background-color: #0D2F7A;
//           color: white;
//         }

//         /* Adjust Ratios Button */
//         .adjust-button {
//           margin-left: 10px;
//           border: none;
//           background: #8e44ad;
//           cursor: pointer;
//           font-size: 1.2rem;
//           color: white;
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background-color 0.3s, transform 0.3s;
//         }

//         .adjust-button:hover {
//           background-color: #71368a;
//           transform: scale(1.1);
//         }

//         /* Styles for Adjust Ratios Button */
//         .adjust-ratios-button {
//           margin-left: 10px;
//           border: none;
//           background: #16a085;
//           cursor: pointer;
//           font-size: 1.2rem;
//           color: white;
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background-color 0.3s, transform 0.3s;
//         }

//         .adjust-ratios-button:hover {
//           background-color: #1abc9c;
//           transform: scale(1.1);
//         }

//         /* Responsive Design */
//         @media (max-width: 1024px) {
//           .container {
//             padding: 80px 40px 60px 40px;
//           }

//           .modal-content {
//             width: 90%;
//           }

//           #weightsChartContainer {
//             flex-direction: column;
//             align-items: center;
//           }

//           #weightsChartWrapper {
//             width: 80%;
//           }

//           #weightsLegendContainer {
//             margin-left: 0;
//             margin-top: 20px;
//           }
//         }

//         @media (max-width: 768px) {
//           .dropdown-container .form-group select {
//             font-size: 1rem;
//             padding: 10px 18px; /* Adjusted padding for smaller height */
//             height: 45px; /* Adjusted height */
//           }

//           .dropdown-container .form-group label {
//             font-size: 1rem;
//           }

//           .form-group {
//             margin-bottom: 25px;
//           }

//           .student-list {
//             max-height: 60vh;
//           }

//           .student-name {
//             font-size: 1.4rem;
//           }

//           .mark-field {
//             font-size: 1.1rem;
//           }

//           /* Adjust icon position on smaller screens */
//           .icon-button {
//             right: 20px;
//           }

//           /* Specific Button Styles for Small Screens */
//           #saveMarksButton, #saveRatiosButton {
//             width: 100%; /* Full width on small screens */
//             padding: 12px 20px; /* Adjust padding */
//             font-size: 1rem; /* Adjust font size */
//           }
//         }

//         /* Focus States for Accessibility */
//         button:focus,
//         select:focus,
//         input[type="text"]:focus,
//         input[type="password"]:focus {
//           outline: 3px solid #2980b9;
//           outline-offset: 2px;
//         }

//         /* Error Message Styling */
//         .error-message {
//           color: #e74c3c;
//           text-align: center;
//           margin-bottom: 20px;
//         }
//       `}</style>

//       {/* Header */}
//       <header>
//         <div className="header-content">
//           Teacher Dashboard
//           {/* Attendance Icon (Always Visible) */}
//           <Link
//             to="/attendance"
//             id="holidaysIcon"
//             className="icon-button"
//             aria-label="Attendance Link"
//             title="Attendance"
//           >
//             📅
//           </Link>
//         </div>
//       </header>

//       {/* Main Container */}
//       <div className="container">
//         {/* Error Message */}
//         {error && <div className="error-message">{error}</div>}

//         {/* Dropdowns Container */}
//         <div className="dropdown-container">
//           {/* Select Subject Dropdown */}
//           {!isDropdownsMinimized && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="subjectDropdown">Select Subject:</label>
//                 <select
//                   id="subjectDropdown"
//                   value={selectedSubject}
//                   onChange={(e) => setSelectedSubject(e.target.value)}
//                   disabled={loadingSubjects || subjects.length === 0}
//                   aria-label="Select Subject"
//                 >
//                   <option value="" disabled>
//                     {loadingSubjects ? 'Loading subjects...' : 'Select a subject'}
//                   </option>
//                   {subjects.map((subject, index) => (
//                     <option key={index} value={subject}>
//                       {subject}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Select Class Dropdown */}
//               <div className="form-group">
//                 <label htmlFor="classDropdown">Select Class:</label>
//                 <select
//                   id="classDropdown"
//                   value={selectedClass}
//                   onChange={(e) => setSelectedClass(e.target.value)}
//                   disabled={!selectedSubject || loadingClasses || classes.length === 0}
//                   aria-label="Select Class"
//                 >
//                   <option value="" disabled>
//                     {loadingClasses ? 'Loading classes...' : 'Select a class'}
//                   </option>
//                   {classes.map((cls, index) => (
//                     <option key={index} value={cls}>
//                       {cls}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Select Class Section Dropdown */}
//               <div className="form-group">
//                 <label htmlFor="classSectionDropdown">Select Class Section:</label>
//                 <select
//                   id="classSectionDropdown"
//                   value={selectedSection}
//                   onChange={(e) => setSelectedSection(e.target.value)}
//                   disabled={!selectedClass || loadingSections || sections.length === 0}
//                   aria-label="Select Class Section"
//                 >
//                   <option value="" disabled>
//                     {loadingSections ? 'Loading sections...' : 'Select a class section'}
//                   </option>
//                   {sections.map((section, index) => (
//                     <option key={index} value={section}>
//                       {section}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Exam Type Dropdown */}
//               <div className="form-group">
//                 <label htmlFor="examTypeDropdown">Exam Type:</label>
//                 <select
//                   id="examTypeDropdown"
//                   value={selectedExamType}
//                   onChange={(e) => setSelectedExamType(e.target.value)}
//                   disabled={!selectedSubject || loadingExamTypes || examTypes.length === 0}
//                   aria-label="Select Exam Type"
//                 >
//                   <option value="" disabled>
//                     {loadingExamTypes ? 'Loading exam types...' : 'Select an exam type'}
//                   </option>
//                   {examTypes.map((type, index) => (
//                     <option key={index} value={type.examType}>
//                       {`${type.columnNumber}: ${type.examType}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           )}

//           {/* Chevron Toggle */}
//           <div
//             className="toggle-chevron"
//             onClick={() => setIsDropdownsMinimized(!isDropdownsMinimized)}
//             aria-label={isDropdownsMinimized ? 'Expand Filters' : 'Minimize Filters'}
//             title={isDropdownsMinimized ? 'Expand Filters' : 'Minimize Filters'}
//           >
//             {isDropdownsMinimized ? <FaChevronDown /> : <FaChevronUp />}
//           </div>
//         </div>

//         {/* Students List */}
//         <div className="form-group">
//           <label></label>
//           <div
//             id="studentList"
//             className="student-list"
//             style={{
//               maxHeight: isDropdownsMinimized ? '600px' : '500px', // Adjust maxHeight based on toggle
//               transition: 'max-height 0.3s ease',
//             }}
//           >
//             {loadingStudents ? (
//               <p>Loading students...</p>
//             ) : students.length > 0 ? (
//               students.map((student) => (
//                 <div key={student.id} className="student-container">
//                   <span className="student-name">{student.studentName}</span>
//                   <div style={{ width: '100%' }}>
//                     <input
//                       type="text"
//                       className={`mark-field ${
//                         validationErrors[student.id] ? 'invalid' : ''
//                       }`}
//                       placeholder="Enter mark"
//                       value={studentMarks[student.id] || ''}
//                       onChange={(e) => handleInputChange(student.id, e.target.value)}
//                       aria-label={`Enter mark for ${student.studentName}`}
//                     />
//                     {validationErrors[student.id] && (
//                       <div className="validation-error">
//                         {validationErrors[student.id]}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p></p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Save Marks Button */}
//       <button
//         id="saveMarksButton"
//         disabled={students.length === 0}
//         onClick={handleSave}
//         aria-label="Save Marks"
//         title="Save Marks"
//       >
//         Save Marks
//       </button>

//       {/* Modal for Adjusting Ratios */}
//       {isAdjustRatiosModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close-modal" onClick={closeAdjustRatiosModal}>
//               &times;
//             </span>
//             <h2>Adjust Exam Type Ratios for "{selectedSubject}"</h2>
//             <div style={{ width: '100%', maxWidth: '600px' }}>
//               <Bar
//                 data={chartData}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: {
//                       display: false,
//                     },
//                     title: {
//                       display: true,
//                       text: 'Exam Type Ratios',
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       max: 100,
//                       title: {
//                         display: true,
//                         text: 'Ratio (%)',
//                       },
//                     },
//                     x: {
//                       title: {
//                         display: true,
//                         text: 'Exam Type',
//                       },
//                     },
//                   },
//                 }}
//               />
//             </div>
//             <div className="weights-inputs-container">
//               {Object.keys(ratios).map((examType) => (
//                 <div key={examType} className="weights-input-item">
//                   <label htmlFor={`ratio-${examType}`}>{examType} Ratio:</label>
//                   <input
//                     type="number"
//                     id={`ratio-${examType}`}
//                     value={ratios[examType] || ''}
//                     onChange={(e) => handleRatioChange(examType, e.target.value)}
//                     min="0"
//                     max="100"
//                     aria-label={`Adjust ratio for ${examType}`}
//                   />
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleSaveRatios} id="saveRatiosButton">
//               Save Ratios
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer>
//         &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
//       </footer>
//     </>
//   );
// };

// export default TeacherDashboard;
