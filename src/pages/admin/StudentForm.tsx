// Import necessary modules and components
import React, { useState, useEffect } from "react";
import supabase from "../../supabase";
import AlertModal from "./../AlertModal";
import { useNavigate } from "react-router-dom";

// Define the Student interface for proper typing
interface Student {
  id: number;
  studentName: string;
  studentID: string;
  className: string;
  section: string;
  studentNumber: string;
  guardianNumber: string;
  school: string;
  checked: boolean;
}

interface MappingGroup {
  className: string;
  section: string;
}

function StudentForm() {
  // State variables
  const [userSchool, setUserSchool] = useState<string>("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<{
    studentName: string;
    studentID: string;
    studentNumber: string;
    guardianNumber: string;
    className: string;
    section: string;
  }>({
    studentName: "",
    studentID: "",
    studentNumber: "",
    guardianNumber: "",
    className: "",
    section: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [studentIDAvailability, setStudentIDAvailability] = useState<{
    add: boolean | null;
    edit: boolean | null;
  }>({ add: null, edit: null });

  // Define the missing state variables
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  // States for Class Mapping Modal
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [currentMappingGroup, setCurrentMappingGroup] = useState<MappingGroup | null>(null);
  const [classBeforeMappings, setClassBeforeMappings] = useState<string[]>([]);
  const [classAfterMappings, setClassAfterMappings] = useState<string[]>([]);
    
  // States to track focus and typed status for each input
    const [isStudentNameFocused, setIsStudentNameFocused] = useState(false);
    const [isStudentNameTyped, setIsStudentNameTyped] = useState(false);
  
    const [isStudentNumberFocused, setIsStudentNumberFocused] = useState(false);
    const [isStudentNumberTyped, setIsStudentNumberTyped] = useState(false);
  
    const [isGuardianNumberFocused, setIsGuardianNumberFocused] = useState(false);
    const [isGuardianNumberTyped, setIsGuardianNumberTyped] = useState(false);
  
    const navigate = useNavigate();

    // Handlers for each input
  const handleStudentNameChange = (e) => {
    const value = e.target.value;
    setNewStudent((prev) => ({
      ...prev,
      studentName: value,
    }));
    setIsStudentNameTyped(value.trim().length > 0);
  };

  const handleStudentNumberChange = (e) => {
    const value = e.target.value;
    setNewStudent((prev) => ({
      ...prev,
      studentNumber: value,
    }));
    setIsStudentNumberTyped(value.trim().length > 0);
  };

  const handleGuardianNumberChange = (e) => {
    const value = e.target.value;
    setNewStudent((prev) => ({
      ...prev,
      guardianNumber: value,
    }));
    setIsGuardianNumberTyped(value.trim().length > 0);
  };

  // Fetch user school on component mount
  useEffect(() => {
    fetchUserSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch class names and students when userSchool changes
  useEffect(() => {
    if (userSchool) {
      fetchClassNames(userSchool);
      fetchAllStudents(userSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSchool]);

  // Fetch all students without filters for grouping
  const fetchAllStudents = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select(
          "id, studentName, studentID, className, section, studentNumber, guardianNumber, school"
        )
        .eq("school", school)
        .order("className", { ascending: true })
        .order("section", { ascending: true })
        .order("id", { ascending: true });

      if (error) throw error;

      const mappedStudents: Student[] = (data as any[]).map((item) => ({
        id: item.id,
        studentName: item.studentName,
        studentID: item.studentID || "",
        className: item.className,
        section: item.section,
        studentNumber: item.studentNumber || "",
        guardianNumber: item.guardianNumber || "",
        school: item.school || "",
        checked: false,
      }));
      setStudents(mappedStudents);
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      setAlertMessage("Error fetching students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the user's school from the profiles table
  const fetchUserSchool = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("school")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserSchool(profile.school);
      } else {
        setAlertMessage("No user found. Please log in.");
      }
    } catch (error: any) {
      console.error("Error fetching user school:", error.message);
      setAlertMessage("Error fetching user school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unique class names for the user's school
  const fetchClassNames = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school)
        .neq("className", null);

      if (error) throw error;

      const uniqueClassNames = [
        ...new Set((data as any[]).map((item) => item.className)),
      ];
      setClassNames(uniqueClassNames);
    } catch (error: any) {
      console.error("Error fetching class names:", error.message);
      setAlertMessage("Error fetching class names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setStudents((prev) =>
      prev.map((student) => ({ ...student, checked: newSelectAll }))
    );
  };

  // Save changes for selected students
  const saveChanges = async () => {
    try {
      setIsLoading(true);
      const updates = students
        .filter((student) => student.checked && student.className)
        .map((student) => ({
          id: student.id,
          className: student.className,
        }));

      if (updates.length === 0) {
        setAlertMessage("No students selected for update.");
        return;
      }

      const { error } = await supabase
        .from("student")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      setAlertMessage("Changes saved successfully!");
      fetchAllStudents(userSchool);
    } catch (error: any) {
      console.error("Error saving changes:", error.message);
      setAlertMessage("Error saving changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete selected students by removing their school association
  const deleteSelectedStudents = async () => {
    const selectedIds = students
      .filter((student) => student.checked)
      .map((student) => student.id);

    if (selectedIds.length === 0) {
      setAlertMessage("No students selected for update.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to remove the school for ${selectedIds.length} selected student(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("student")
        .update({ school: null })
        .in("id", selectedIds);

      if (error) throw error;

      setAlertMessage(
        "School field removed for selected students successfully!"
      );
      fetchAllStudents(userSchool);
    } catch (error: any) {
      console.error("Error removing school from students:", error.message);
      setAlertMessage("Error removing school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // // Open the edit modal for a specific student
  // const openEditModal = (student: Student) => {
  //   setEditStudent(student);
  //   setStudentIDAvailability((prev) => ({ ...prev, edit: null }));
  // };
// new code
const openEditModal = async (student: Student) => {
  try {
    setIsLoading(true);

    // Set the student to be edited
    setEditStudent(student);
    setStudentIDAvailability((prev) => ({ ...prev, edit: null }));

    // Fetch unique sections for the current school
    const { data: sectionData, error } = await supabase
      .from("student")
      .select("section")
      .eq("school", userSchool)
      .neq("section", null);

    if (error) throw error;

    const uniqueSections = [
      ...new Set((sectionData as any[]).map((item) => item.section)),
    ];
    setSections(uniqueSections);

  } catch (error: any) {
    console.error("Error opening edit modal:", error.message);
    setAlertMessage("Error opening edit modal. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  // Update student details
  const updateStudent = async () => {
    try {
      setIsLoading(true);
      if (!editStudent) return;

      const {
        id,
        studentName,
        studentID,
        studentNumber,
        guardianNumber,
        className,
        section,
      } = editStudent;

      // Check if the new studentID is available (if it has been changed)
      const originalStudent = students.find((s) => s.id === id);
      if (originalStudent && studentID !== originalStudent.studentID) {
        const { data, error } = await supabase
          .from("student")
          .select("id")
          .eq("studentID", studentID)
          .eq("school", userSchool);

        if (error) throw error;

        if (data && data.length > 0) {
          setAlertMessage("Student ID is already taken.");
          return;
        }
      }

      const { error } = await supabase
        .from("student")
        .update({
          studentName,
          studentID,
          studentNumber,
          guardianNumber,
          className,
          section,
        })
        .eq("id", id);

      if (error) throw error;

      setAlertMessage("Student updated successfully!");
      setEditStudent(null);
      fetchAllStudents(userSchool);
    } catch (error: any) {
      console.error("Error updating student:", error.message);
      setAlertMessage("Error updating student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new student
  const handleAddStudent = async () => {
    const {
      studentName,
      studentID,
      studentNumber,
      guardianNumber,
      className,
      section,
    } = newStudent;

    // Validate all fields are filled
    if (
      !studentName ||
      !studentID ||
      !studentNumber ||
      !guardianNumber ||
      !className ||
      !section
    ) {
      setAlertMessage("Please fill in all fields to add a new student.");
      return;
    }

    // Check if the studentID is available
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("id")
        .eq("studentID", studentID)
        .eq("school", userSchool);

      if (error) throw error;

      if (data && data.length > 0) {
        setAlertMessage("Student ID is already taken.");
        return;
      }

      // Insert the new student
      const { error: insertError } = await supabase.from("student").insert([
        {
          studentName,
          studentID,
          studentNumber,
          guardianNumber,
          className,
          section,
          school: userSchool,
        },
      ]);

      if (insertError) throw insertError;

      setAlertMessage("New student added successfully!");
      setNewStudent({
        studentName: "",
        studentID: "",
        studentNumber: "",
        guardianNumber: "",
        className: "",
        section: "",
      });

      // Refresh the students list
      fetchAllStudents(userSchool);
    } catch (error: any) {
      console.error("Error adding student:", error.message);
      setAlertMessage("Error adding student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check Student ID availability for Add form
  useEffect(() => {
    const checkAvailability = async () => {
      if (newStudent.studentID.trim() === "") {
        setStudentIDAvailability((prev) => ({ ...prev, add: null }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from("student")
          .select("id")
          .eq("studentID", newStudent.studentID)
          .eq("school", userSchool);

        if (error) throw error;

        if (data && data.length > 0) {
          setStudentIDAvailability((prev) => ({ ...prev, add: false }));
        } else {
          setStudentIDAvailability((prev) => ({ ...prev, add: true }));
        }
      } catch (error: any) {
        console.error("Error checking Student ID availability:", error.message);
        setStudentIDAvailability((prev) => ({ ...prev, add: null }));
      }
    };

    // Debounce the check to avoid excessive calls
    const timeout = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timeout);
  }, [newStudent.studentID, userSchool]);

  // Check Student ID availability for Edit form
  useEffect(() => {
    const checkAvailability = async () => {
      if (!editStudent || editStudent.studentID.trim() === "") {
        setStudentIDAvailability((prev) => ({ ...prev, edit: null }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from("student")
          .select("id")
          .eq("studentID", editStudent.studentID)
          .eq("school", userSchool);

        if (error) throw error;

        // If the ID belongs to the current student being edited, it's available
        if (
          data &&
          data.length > 0 &&
          data.some((student: any) => student.id === editStudent.id)
        ) {
          setStudentIDAvailability((prev) => ({ ...prev, edit: true }));
        } else if (data && data.length > 0) {
          setStudentIDAvailability((prev) => ({ ...prev, edit: false }));
        } else {
          setStudentIDAvailability((prev) => ({ ...prev, edit: true }));
        }
      } catch (error: any) {
        console.error("Error checking Student ID availability:", error.message);
        setStudentIDAvailability((prev) => ({ ...prev, edit: null }));
      }
    };

    // Debounce the check to avoid excessive calls
    const timeout = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timeout);
  }, [editStudent?.studentID, editStudent?.id, userSchool]);

  // Open Class Mapping Modal
  const openClassMappingModal = (group: MappingGroup) => {
    setCurrentMappingGroup(group);
    setClassBeforeMappings([group.className]); // Pre-fill with current class
    setClassAfterMappings([classNames[0] || ""]); // Default to first class or empty
    setIsMappingModalOpen(true);
  };

  // Handle class before change
  const handleClassBeforeChange = (index: number, value: string) => {
    const updatedBefore = [...classBeforeMappings];
    updatedBefore[index] = value;
    setClassBeforeMappings(updatedBefore);
  };

  // Handle class after change
  const handleClassAfterChange = (index: number, value: string) => {
    const updatedAfter = [...classAfterMappings];
    updatedAfter[index] = value;
    setClassAfterMappings(updatedAfter);
  };

  // Add another mapping pair
  const addMappingPair = () => {
    setClassBeforeMappings([...classBeforeMappings, ""]);
    setClassAfterMappings([...classAfterMappings, classNames[0] || ""]);
  };

  // Remove a mapping pair based on type ('before' or 'after')
  const removeMappingPair = (index: number, type: "before" | "after") => {
    if (type === "before") {
      const updatedBefore = [...classBeforeMappings];
      updatedBefore.splice(index, 1);
      setClassBeforeMappings(updatedBefore);
    } else {
      const updatedAfter = [...classAfterMappings];
      updatedAfter.splice(index, 1);
      setClassAfterMappings(updatedAfter);
    }
  };

  // Handle Bulk Update from Modal
  const handleBulkUpdate = async () => {
    if (!currentMappingGroup) return;

    try {
      setIsLoading(true);
      const mappings = classBeforeMappings
        .map((before, index) => ({
          before,
          after: classAfterMappings[index],
        }))
        .filter((mapping) => mapping.before && mapping.after); // Only valid mappings

      if (mappings.length === 0) {
        setAlertMessage("No valid class mappings provided.");
        return;
      }

      // Fetch students in the current group
      const { data, error } = await supabase
        .from("student")
        .select("id, className")
        .eq("className", currentMappingGroup.className)
        .eq("section", currentMappingGroup.section)
        .eq("school", userSchool);

      if (error) throw error;

      if (!data || data.length === 0) {
        setAlertMessage("No students found in the selected group.");
        return;
      }

      // Prepare update operations based on mappings
      const updateOperations = (data as any[]).map((student: any) => {
        // Find the mapping where 'before' matches the student's current class
        const mapping = mappings.find((m) => m.before === student.className);
        return {
          id: student.id,
          className: mapping ? mapping.after : student.className,
        };
      });

      // Perform the updates
      const { error: updateError } = await supabase
        .from("student")
        .upsert(updateOperations, { onConflict: "id" });

      if (updateError) throw updateError;

      setAlertMessage("Class mappings updated successfully!");
      setIsMappingModalOpen(false);
      setCurrentMappingGroup(null);
      setClassBeforeMappings([]);
      setClassAfterMappings([]);
      fetchAllStudents(userSchool);
    } catch (error: any) {
      console.error("Error updating class mappings:", error.message);
      setAlertMessage("Error updating class mappings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Group students by class and section
  const groupedStudents = students.reduce(
    (groups: { [key: string]: Student[] }, student) => {
      const key = `${student.className} - Section ${student.section}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(student);
      return groups;
    },
    {}
  );

  // Update the filteredGroupedStudents to include class and section filters
  const filteredGroupedStudents = Object.entries(groupedStudents).reduce(
    (filtered: { [key: string]: Student[] }, [group, groupStudents]) => {
      // Extract className and section from the group key
      const [groupClassName, sectionPart] = group.split(" - Section ");
      const groupSection = sectionPart || "";

      // Apply class and section filters
      if (
        (selectedClassName === "" || groupClassName === selectedClassName) &&
        (selectedSection === "" || groupSection === selectedSection)
      ) {
        const filteredStudents = groupStudents.filter(
          (student) =>
            student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentID.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredStudents.length > 0) {
          filtered[group] = filteredStudents;
        }
      }

      return filtered;
    },
    {}
  );

  return (
    <div
  style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto",
  }}
>
  <div
    style={{
      position: "fixed",
      top: "35px",
      left: "15px",
      width: "85px",
      height: "auto",
      backgroundColor: "#212121",
      borderRadius: "20px",
      boxShadow: "0 2px 12px 1px #007BA7",
      padding: "5px 10px",
      flexShrink: 0,
      border: "1px solid #000",
      zIndex: "1000"
    }}
  >
    <button
      style={{
        width: "60px",
        height: "60px",
        margin: "12px 0",
        fontSize: "34px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "1px solid #Dfff",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={() => navigate("/dashboard")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
      }}
    >
      📅
    </button>
    {/* <button
      style={{
        width: "60px",
        height: "60px",
        margin: "12px 0",
        fontSize: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#666",
        color: "#fff",
        border: "1px solid #Dfff",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={() => navigate("/dashboard2")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
      }}
    >
      🎓 
    </button> */}
    <button
      style={{
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
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}
      onClick={() => navigate("/")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
      }}
    >
      🏠
    </button>
      <button
        style={{
          width: "60px",
          height: "60px",
          margin: "12px 0",
          fontSize: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#dbe346",
          color: "#fff",
          border: "1px solid #Dfff",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        onClick={() => navigate("/dash5")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.2)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        }}
      >
        ⏰ 
      </button>
  </div>
    <div
      style={{
        width: "95%",
        maxWidth: "1400px",
        margin: "20px",
        marginLeft: "60px",
        padding: "20px",
        backgroundColor: "#333",
       
        borderRadius: "10px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0px 1px 15px 4px #007BA7",
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "10px",
          textAlign: "center",
          color: "#6c757d",
        }}
      >
        Student Management
      </h1>
      <p
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "30px",
          textAlign: "center",
          color: "#555",
        }}
      >
        School: {userSchool}
      </p>

      {/* Filters and Add New Student Containers */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "0px",
          flexWrap: "wrap",
        }}
      >
        {/* Filters Container */}
        <div
          style={{
            flex: "1 1 45%",
            backgroundColor: "#212121",
            height: "290px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            minWidth: "280px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Filters
          </h2>
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{ marginBottom: "5px", fontWeight: "500", color: "#ccc" }}
            >
              Class:
            </label>
            <select
              style={{
                padding: "10px",
                fontSize: "24px",
                border: "1px solid #212121",
                borderRadius: "5px",
                outline: "none",
                transition: "border-color 0.3s ease",
                backgroundColor: "#212121",
                color: "#ccc",
              }}
              value={selectedClassName}
              onChange={(e) => {
                setSelectedClassName(e.target.value);
                if (e.target.value) {
                  const filteredSections = [
                    ...new Set(
                      students
                        .filter((s) => s.className === e.target.value)
                        .map((s) => s.section)
                    ),
                  ];
                  setSections(filteredSections);
                } else {
                  setSections([]);
                  setSelectedSection("");
                }
              }}
            >
              <option value="">Select Class</option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {selectedClassName && (
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
                
              }}
            >
              <label
                style={{
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "#ccc",
                }}
              >
                Section:
              </label>
              <select
                style={{
                  padding: "10px",
                  fontSize: "24px",
                  border: "1px solid #212121",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: "#212121",
                  color: "#ccc",
                }}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Bar */}
      {students.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #212121",
              borderRadius: "5px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "0px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>
      )}
        </div>

        {/* Add New Student Container */}
        <div
  style={{
    flex: "1 1 45%",
    backgroundColor: "#212121", // Background color of the container
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    minWidth: "280px",
    position: "relative", // Make the container position relative
    overflow: "hidden", // To ensure the green line stays within bounds
  }}
>
  {/* Green Line */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "8px", // Adjust the height of the green line
      backgroundColor: "#007bff", // Green color
      borderTopLeftRadius: "10px", // Match the border radius of the container
      borderTopRightRadius: "10px", // Match the border radius of the container
    }}
  ></div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#ECECEC",
              textAlign: "center",
            }}
          >
            Add New Student
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
             
            }}
          >
            {/* Student Name */}
           <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "0px",
        }}
      >
        <label
          style={{
            marginBottom: "0px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {/* Label for Full Name (optional) */}
        </label>
        <input
          type="text"
          placeholder="Full Name"
          value={newStudent.studentName}
          onChange={handleStudentNameChange} // Handle input change
          onFocus={() => setIsStudentNameFocused(true)} // Handle focus
          onBlur={() => setIsStudentNameFocused(false)} // Handle blur
          style={{
            padding: "10px",
            fontSize: "16px",
            border: `1px solid ${
              isStudentNameFocused || isStudentNameTyped ? "#007bff" : "#212121"
            }`, // Green border if focused or typed
            borderRadius: "5px",
            outline: "none",
            transition: "border-color 0.3s ease",
            width: "100%",
            color: "#ccc",
          }}
        />
      </div>
            {/* Student ID */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "25px",
                position: "relative",
              }}
            >
              <label
                style={{
                  marginBottom: "0px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
              </label>
              <input
                type="text"
                placeholder="Student ID"
                value={newStudent.studentID}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    studentID: e.target.value.trim(),
                  }))
                }
                style={{
                  padding: "10px",
                  width: "100%",
                  fontSize: "16px",
                  border: `1px solid ${
                    studentIDAvailability.add === null
                      ? "#212121"
                      : studentIDAvailability.add
                      ? "#007bff"
                      : "#dc3545"
                  }`,
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
              />
              {studentIDAvailability.add !== null && (
                <span
                  style={{
                    color: studentIDAvailability.add ? "#007bff" : "#dc3545",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {studentIDAvailability.add
                    ? "Student ID is available."
                    : "Student ID is already taken."}
                </span>
              )}
            </div>

      


            {/* Class Selection */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "0px",
               
              }}
            >
              <label
                style={{
                  marginBottom: "0px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
            
              </label>
              <select
                value={newStudent.className}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                style={{
                  padding: "20px",
                  fontSize: "24px",
                  color: "#ccc",
                  border: "1px solid #222",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: "#222"
                }}
              >
                <option value="">Select Class</option>
                {classNames.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "15px",
              }}
            >
              <label
                style={{
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >

              </label>
              <select
                value={newStudent.section}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    section: e.target.value,
                  }))
                }
                style={{
                  padding: "10px",
                  fontSize: "24px",
                  color: "#ccc",
                  border: "1px solid #222",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: "#222"
                }}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
                {/* Student Number */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "0px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "0px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    {/* Label for Student Number */}
                  </label>
                  <input
                    type="text"
                    placeholder="Student Number"
                    value={newStudent.studentNumber}
                    onChange={handleStudentNumberChange}
                    onFocus={() => setIsStudentNumberFocused(true)}
                    onBlur={() => setIsStudentNumberFocused(false)}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      border: `1px solid ${
                        isStudentNumberFocused || isStudentNumberTyped ? "#007bff" : "#212121"
                      }`,
                      borderRadius: "5px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                      width: "100%",
                    }}
                  />
                </div>
          
                {/* Guardian Number */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "15px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    {/* Label for Guardian Number */}
                  </label>
                  <input
                    type="text"
                    placeholder="Guardian Number"
                    value={newStudent.guardianNumber}
                    onChange={handleGuardianNumberChange}
                    onFocus={() => setIsGuardianNumberFocused(true)}
                    onBlur={() => setIsGuardianNumberFocused(false)}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      border: `1px solid ${
                        isGuardianNumberFocused || isGuardianNumberTyped ? "#007bff" : "#212121"
                      }`,
                      borderRadius: "5px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                      width: "100%",
                    }}
                  />
                </div>

            {/* Add Student Button */}
            <button
              onClick={handleAddStudent}
              disabled={!studentIDAvailability.add}
              style={{
                padding: "12px 20px",
                backgroundColor: studentIDAvailability.add
                  ? "#007bff"
                  : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: studentIDAvailability.add ? "pointer" : "not-allowed",
                alignSelf: "flex-end",
                transition: "background-color 0.3s ease",
                width: "100%",
              }}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>

      

      {/* Loading Indicator */}
      {isLoading ? (
        <p
          style={{
            textAlign: "center",
            color: "#555",
            fontSize: "18px",
          }}
        >
          Loading...
        </p>
      ) : (
        <div>
          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "15px",
              marginBottom: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleSelectAll}
              style={{
                padding: "10px 15px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {selectAll ? "Deselect All" : "Select All"}
            </button>
            
            <button
              onClick={deleteSelectedStudents}
              style={{
                padding: "10px 15px",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              Delete Selected
            </button>
          </div>

          {/* Students Table with Group Headers */}
          <div
            style={{
              overflowX: "auto",
              borderRadius: "5px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  {/* Select All Checkbox */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "100px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      style={{
                        width: "20px", // Increase checkbox size
                        height: "20px", // Increase checkbox size
                      }}
                    />
                  </th>
                  {/* ID Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "90px",
                    }}
                  >
                    ID
                  </th>
                  {/* Student ID Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "150px",
                    }}
                  >
                    Student ID
                  </th>
                  {/* Name Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "280px",
                    }}
                  >
                    Name
                  </th>
                  {/* Student Number Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "250px",
                    }}
                  >
                    Student Number
                  </th>
                  {/* Guardian Number Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      width: "250px",
                    }}
                  >
                    Guardian Number
                  </th>
                  {/* Actions Column */}
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      backgroundColor: "#007bff",
                      textAlign: "left",
                      color: "#1E1E1E",
                      
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredGroupedStudents).map(([group, groupStudents]) => (
                  <React.Fragment key={group}>
                    {/* Group Header */}
                    <tr
  style={{
    backgroundColor: "#f1f1f1",
  }}
>
  <td
    colSpan={7}
    style={{
      padding: "10px",
      color: "#333",
      fontWeight: "600",
      width: "50px"
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center", // Align items vertically centered
        justifyContent: "space-between", // Space out the text and button if needed
        gap: "10px", // Optional gap between items
      }}
    >
      <span>{group}</span>
      <button
        onClick={() => {
          const [className, sectionPart] = group.split(" - Section ");
          const section = sectionPart.replace("Section ", "");
          openClassMappingModal({ className, section });
        }}
        style={{
          backgroundColor: "#ccc",
          width: "215px",
          marginRight: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          padding: "5px", // Optional for button spacing
          borderRadius: "5px", // Optional for rounded button
        }}
        title="Edit Class Mapping"
      >
        ✏️
      </button>
    </div>
  </td>
</tr>

                    {/* Group Students */}
                    {groupStudents.map((student) => (
                      <tr key={student.id} style={{ borderBottom: "1px solid #ddd" }}>
                        {/* Checkbox */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                            
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={student.checked}
                            onChange={() =>
                              setStudents((prev) =>
                                prev.map((s) =>
                                  s.id === student.id
                                    ? { ...s, checked: !s.checked }
                                    : s
                                )
                              )
                            }
                            style={{
                              width: "30px", // Increase checkbox size
                              height: "30px", // Increase checkbox size
                            }}
                          />
                        </td>
                        {/* ID */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                          }}
                        >
                          {student.id}
                        </td>
                        {/* Student ID */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                          }}
                        >
                          {student.studentID}
                        </td>
                        {/* Name */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 16px",
                            color: "#555",
                            fontSize: "20px",
                            textAlign: "right",
                          }}
                        >
                          {student.studentName}
                        </td>
                        {/* Student Number */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                          }}
                        >
                          {student.studentNumber}
                        </td>
                        {/* Guardian Number */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                          }}
                        >
                          {student.guardianNumber}
                        </td>
                        {/* Actions */}
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                          }}
                        >
                          <button
                            onClick={() => openEditModal(student)}
                            style={{
                              backgroundColor: "#007bff",
                              width: "215px",
                              border: "none",
                              borderRadius: "5px",
                              padding: "8px 8px",
                              cursor: "pointer",
                              color: "#fff",
                              fontSize: "18px",
                              transition: "background-color 0.3s ease",
                            }}
                            title="Edit Student"
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
{editStudent && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker backdrop for focus
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "#0f0f0f", // Clean, white background
        border: "2px solid #212121",
        padding: "30px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", // Stronger shadow for depth
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          borderBottom: "1px solid #2C2C2C",
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            margin: 0,
            color: "#2c3e50", // Dark gray-blue for header text
          }}
        >
          Edit Student
        </h2>
      </div>

      {/* Input Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Name */}
        <div style={{ gridColumn: "span 2" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e", // Medium gray-blue for labels
            }}
          >
            Name:
          </label>
          <input
            type="text"
            value={editStudent.studentName}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, studentName: e.target.value } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "20px",
              border: "1px solid #212121", // Light gray border
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
              textAlign: "right",
            }}
          />
        </div>

        {/* Student ID */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Student ID:
          </label>
          <input
            type="text"
            placeholder="Student ID"
            value={editStudent.studentID}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, studentID: e.target.value.trim() } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: `1px solid ${
                studentIDAvailability.edit === null
                  ? "#212121"
                  : studentIDAvailability.edit
                  ? "#007bff" // Green for available
                  : "#e74c3c" // Red for taken
              }`,
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
          />
          {studentIDAvailability.edit !== null && (
            <span
              style={{
                display: "block",
                marginTop: "5px",
                fontSize: "12px",
                color: studentIDAvailability.edit ? "#007bff" : "#e74c3c",
              }}
            >
              {studentIDAvailability.edit
                ? "Student ID is available."
                : "Student ID is already taken."}
            </span>
          )}
        </div>

        {/* Student Number */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Student Number:
          </label>
          <input
            type="text"
            value={editStudent.studentNumber}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, studentNumber: e.target.value } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #212121",
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>

        {/* Guardian Number */}
        <div style={{ gridColumn: "span 2" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Guardian Number:
          </label>
          <input
            type="text"
            value={editStudent.guardianNumber}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, guardianNumber: e.target.value } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #212121",
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
             
            }}
          />
        </div>

        {/* Class */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Class:
          </label>
          <select
            value={editStudent.className}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, className: e.target.value } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #212121",
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
              backgroundColor: "#212121", 
              color: "#dfe6e9"// Slightly off-white
            }}
          >
            <option value="">Select Class</option>
            {classNames.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Section:
          </label>
          <select
            value={editStudent.section}
            onChange={(e) =>
              setEditStudent((prev) =>
                prev ? { ...prev, section: e.target.value } : prev
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #212121",
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.3s ease",
              backgroundColor: "#212121",
              color: "#f9f9f9"
            }}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
          gap: "15px",
        }}
      >
        <button
          onClick={() => setEditStudent(null)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c", // Bright red for cancel
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Close
        </button>
        <button
          onClick={updateStudent}
          disabled={!studentIDAvailability.edit}
          style={{
            padding: "10px 20px",
            backgroundColor: studentIDAvailability.edit
              ? "#27ae60" // Bright green for enabled
              : "#bdc3c7", // Disabled gray
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: studentIDAvailability.edit ? "pointer" : "not-allowed",
            transition: "background-color 0.3s ease",
          }}
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}


      {/* Class Mapping Modal */}
      {isMappingModalOpen && currentMappingGroup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#212121",
              padding: "30px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "800px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#ccc"
              }}
            >
              <h2>Edit Class Mapping</h2>
              <button
                onClick={() => {
                  setIsMappingModalOpen(false);
                  setCurrentMappingGroup(null);
                  setClassBeforeMappings([]);
                  setClassAfterMappings([]);
                }}
                style={{
                  backgroundColor: "#212121",
                  position: "relative",
                  top: "-50px",
                  left: "29px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "30px",
                  border: "none",
                  fontSize: "23px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                title="Close"
              >
                &times;
              </button>
            </div>
            <p>
              Group: {currentMappingGroup.className} - Section {currentMappingGroup.section}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              {/* Before and After Sections */}
              <div style={{ flex: "1 1 42%", minWidth: "200px" }}>
                <h3 style={{marginBottom: "5px",}}>Before</h3>
                {classBeforeMappings.map((before, index) => (
                  <div key={index} style={{ marginBottom: "10px", position: "relative" }}>
                    <select
                      value={before}
                      onChange={(e) => handleClassBeforeChange(index, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "20px",
                        border: "1px solid #212121",
                        backgroundColor: "#212121",
                        color: "#f2f2f2",
                        borderRadius: "5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                    >
                      <option value="">Select Class</option>
                      {classNames.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                    {classBeforeMappings.length > 1 && (
                      <button
                        onClick={() => removeMappingPair(index, "before")}
                        style={{
                          position: "absolute",
                          top: "0%",
                          right: "-30px",
                          transform: "translateY(-50%)",
                          backgroundColor: "#dc3545",
                          color: "#000",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                        title="Remove"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "2px",
                  backgroundColor: "#000",
                  height: "10%",
                  alignSelf: "stretch",
                  margin: "0 0px",
                }}
              ></div>

              <div style={{ flex: "1 1 45%", minWidth: "200px" }}>
                <h3 style={{marginBottom: "5px"}}>After</h3>
                {classAfterMappings.map((after, index) => (
                  <div key={index} style={{ marginBottom: "10px", position: "relative" }}>
                    <select
                      value={after}
                      onChange={(e) => handleClassAfterChange(index, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "20px",
                        color: "#f2f2f2",
                        border: "1px solid #212121",
                        backgroundColor: "#212121",
                        borderRadius: "5px",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                    >
                      <option value="">Select Class</option>
                      {classNames.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                    {classAfterMappings.length > 1 && (
                      <button
                        onClick={() => removeMappingPair(index, "after")}
                        style={{
                          position: "absolute",
                          top: "0%",
                          right: "-30px",
                          transform: "translateY(-50%)",
                          backgroundColor: "#dc3545",
                          color: "#000",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                        title="Remove"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

           

            {/* Update and Cancel Buttons */}
            <div
              style={{
                marginTop: "0px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
               {/* Add More Button */}
            <button
              onClick={addMappingPair}
              style={{
                width: '100%',
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                marginTop: "40px",
              }}
            >
              Add More
            </button>
              <button
                onClick={() => {
                  handleBulkUpdate();
                }}
                style={{
                  width: '100%',
                  padding: "8px 12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  marginTop: "40px",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
    </div>
  );
}

export default StudentForm;
