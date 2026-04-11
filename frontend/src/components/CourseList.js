import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { CourseService } from '../services/CourseService';
import { StudentService } from '../services/StudentService';
const CourseList = () => {
    // State to store our courses
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseInstructor, setNewCourseInstructor] = useState("");
    const [newCourseMaxSize, setNewCourseMaxSize] = useState("");
    const [newCourseRoom, setNewCourseRoom] = useState("");
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editForm, setEditorForm] = useState({
        name: "",
        instructor: "",
        maxSize: "",
        room: ""
    });
    const [studentsToRemove, setStudentsToRemove] = useState({});
    const [allStudents, setAllStudents] = useState([]);
    // Keeps track of the selected student for each row.
    // Example: { 1: "105", 2: "108" } -> Course 1 selected Student 105
    const [selectedStudents, setSelectedStudents] = useState({});
    // The fetch data function.
    const loadCourses = async () => {
        try {
            const data = await CourseService.getAllCourses();
            setCourses(data);
            const studentData = await StudentService.getAllStudents();
            setAllStudents(studentData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddStudent = async (courseId) => {
        // Look up the selected student ID for this specific course row
        const studentIdString = selectedStudents[courseId];
        if (!studentIdString) {
            alert("Please select a student first.");
            return;
        }
        try {
            const studentId = parseInt(studentIdString);
            // Call your Service
            await CourseService.addStudentToCourse(courseId, studentId);
            // Refresh the table to show the new roster
            await loadCourses();
            // Optional: Reset the dropdown for this row back to default
            setSelectedStudents({ ...selectedStudents, [courseId]: "" });
        }
        catch (err) {
            console.error("Failed to add student to course:", err);
        }
    };
    const handleRemoveStudent = async (courseId) => {
        const studentIdString = studentsToRemove[courseId];
        if (!studentIdString) {
            alert("Please select a student to remove.");
            return;
        }
        try {
            const studentId = parseInt(studentIdString);
            // Assuming you make a matching method in your CourseService
            await CourseService.removeStudentFromCourse(courseId, studentId);
            await loadCourses();
            // Reset the dropdown for this row
            setStudentsToRemove({ ...studentsToRemove, [courseId]: "" });
        }
        catch (err) {
            console.error("Failed to remove student:", err);
        }
    };
    const handleEditClick = (course) => {
        setEditingCourseId(course.id);
        setEditorForm({
            name: course.name || "",
            instructor: course.instructor ? course.instructor.toString() : "",
            maxSize: course.maxSize ? course.maxSize.toString() : "",
            room: course.room || ""
        });
    };
    const handleSaveEdit = async (id) => {
        try {
            const updatedData = {
                name: editForm.name,
                instructor: parseInt(editForm.instructor),
                maxSize: parseInt(editForm.maxSize),
                room: editForm.room
            };
            // Send PUT request to your Spring Boot controller
            await CourseService.updateCourse(id, updatedData);
            // Close the edit row and refresh the list
            setEditingCourseId(null);
            await loadCourses();
        }
        catch (err) {
            console.error("Failed to update course: ", err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await CourseService.deleteCourse(id);
            // This triggers a re-render without a page refresh!
            setCourses(courses.filter(c => c.id !== id));
        }
        catch (err) {
            alert("Delete failed!");
        }
    };
    const handleAdd = async () => {
        // inputs always want to handle strings, so convert the max size to a number
        const numericSize = parseInt(newCourseMaxSize.trim());
        const numericInstructor = parseInt(newCourseInstructor.trim());
        // try to save the course.
        const savedCourse = await CourseService.addCourse({ name: newCourseName,
            instructor: numericInstructor,
            maxSize: numericSize,
            room: newCourseRoom,
            roster: undefined
        });
        console.log("I saved the courses--now, to update the fields.");
        // refresh the list of courses
        await loadCourses();
        //reset all the fields to clear the data
        setNewCourseName(""); // Clear the input
        setNewCourseInstructor("");
        setNewCourseMaxSize("");
        setNewCourseRoom("");
    };
    // Fetch data on component load
    useEffect(() => {
        loadCourses();
    }, []);
    if (loading)
        return _jsx("div", { children: "Loading courses from Spring Boot..." });
    if (error)
        return _jsxs("div", { style: { color: 'red' }, children: ["Error: ", error] });
    return (_jsxs("div", { children: [_jsxs("div", { id: "new-course-fields", className: "course-container", children: [_jsx("input", { id: "new-course-name", value: newCourseName, onChange: (e) => setNewCourseName(e.target.value), placeholder: "New Course Name" }), _jsx("input", { id: "new-course-instructor", value: newCourseInstructor, onChange: (e) => setNewCourseInstructor(e.target.value), placeholder: "Instructor ID Number" }), _jsx("input", { id: "new-course-max-size", value: newCourseMaxSize, onChange: (e) => setNewCourseMaxSize(e.target.value), placeholder: "MaxSize" }), _jsx("input", { id: "new-course-room", value: newCourseRoom, onChange: (e) => setNewCourseRoom(e.target.value), placeholder: "Room" }), _jsx("button", { onClick: handleAdd, children: "Add Course" })] }), _jsx("h1", { children: "Available Courses" }), _jsxs("table", { id: "course-list-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Course Name" }), _jsx("th", { children: "Instructor" }), _jsx("th", { children: "Max Size" }), _jsx("th", { children: "Room" }), _jsx("th", { children: "Enrolled Count" }), _jsx("th", { children: "Roster" }), _jsx("th", { children: "Delete" }), _jsx("th", { children: "Edit" }), _jsx("th", { children: "Add Student" })] }) }), _jsx("tbody", { children: courses.map(course => (_jsxs(React.Fragment, { children: [_jsxs("tr", { id: `course-row-${course.id}`, children: [_jsx("td", { id: `course-name-${course.id}`, children: course.name }), _jsx("td", { id: `course-instructor-${course.id}`, children: course.instructor }), _jsx("td", { id: `course-max-size-${course.id}`, children: course.maxSize }), _jsx("td", { id: `course-room-${course.id}`, children: course.room }), _jsx("td", { id: `course-roster-${course.id}`, children: course.roster ? course.roster.length : 0 }), _jsx("td", { children: course.roster ? course.roster.join(', ') : 'Empty' }), _jsx("td", { children: _jsx("button", { id: "delete-course-button", onClick: () => handleDelete(course.id), style: { color: 'red' }, children: "Delete" }) }), _jsx("td", { children: _jsx("button", { id: "edit-course-button", onClick: () => handleEditClick(course), style: { color: 'blue' }, children: "Edit" }) }), _jsx("td", { children: _jsxs("div", { style: { display: 'flex', gap: '5px' }, children: [_jsxs("select", { id: "select-student", value: selectedStudents[course.id] || "", onChange: (e) => setSelectedStudents({
                                                            ...selectedStudents,
                                                            [course.id]: e.target.value
                                                        }), children: [_jsx("option", { value: "", disabled: true, children: "Select a Student" }), allStudents.map(student => (_jsxs("option", { value: student.id, children: [student.name, " "] }, student.id)))] }), _jsx("button", { id: "add-student-button", onClick: () => handleAddStudent(course.id), style: { color: 'green' }, children: "Add Student" })] }) })] }, course.id), editingCourseId === course.id && (_jsx("tr", { style: { backgroundColor: '#f0f8ff' }, children: _jsxs("td", { colSpan: 7, children: [" ", _jsxs("div", { style: { display: 'flex', gap: '10px', padding: '10px' }, children: [_jsx("input", { id: "edit-course-name", value: editForm.name, onChange: (e) => setEditorForm({ ...editForm, name: e.target.value }), placeholder: "Course Name" }), _jsx("input", { id: "edit-course-instructor", value: editForm.instructor, onChange: (e) => setEditorForm({ ...editForm, instructor: e.target.value }), placeholder: "Instructor ID" }), _jsx("input", { id: "edit-course-max-size", value: editForm.maxSize, onChange: (e) => setEditorForm({ ...editForm, maxSize: e.target.value }), placeholder: "Max Size" }), _jsx("input", { id: "edit-course-room", value: editForm.room, onChange: (e) => setEditorForm({ ...editForm, room: e.target.value }), placeholder: "Room" }), _jsxs("div", { style: { display: 'flex', gap: '5px', marginTop: '10px' }, children: [_jsxs("select", { id: "remove-student-select" // Selenium ID!
                                                                , value: studentsToRemove[course.id] || "", onChange: (e) => setStudentsToRemove({
                                                                    ...studentsToRemove,
                                                                    [course.id]: e.target.value
                                                                }), children: [_jsx("option", { value: "", disabled: true, children: "Remove a Student" }), allStudents
                                                                        .filter(student => course.roster && course.roster.includes(student.name))
                                                                        .map(enrolledStudent => (_jsx("option", { value: enrolledStudent.id, children: enrolledStudent.name }, enrolledStudent.id)))] }), _jsx("button", { id: "remove-student-button" // Selenium ID!
                                                                , onClick: () => handleRemoveStudent(course.id), style: { color: 'red' }, children: "Remove Student" })] }), _jsx("button", { id: "edit-course-save-button", onClick: () => handleSaveEdit(course.id), style: { color: 'green' }, children: "Save" }), _jsx("button", { id: "edit-course-cancel-button", onClick: () => setEditingCourseId(null), children: "Cancel" })] })] }) }))] }, course.id))) })] })] }));
};
export default CourseList;
