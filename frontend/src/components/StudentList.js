import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { StudentService } from '../services/StudentService';
const StudentList = () => {
    // State to store our courses
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentMajor, setNewStudentMajor] = useState("");
    const [newStudentGPA, setNewStudentGPA] = useState("");
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editForm, setEditorForm] = useState({
        name: "",
        major: "",
        gpa: ""
    });
    const loadStudents = async () => {
        try {
            const data = await StudentService.getAllStudents();
            setStudents(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAdd = async () => {
        // inputs always want to handle strings, so convert the max size to a number
        const numericGPA = parseFloat(newStudentGPA.trim());
        // try to save the course.
        const savedCourse = await StudentService.addStudent({ name: newStudentName,
            major: newStudentMajor,
            gpa: numericGPA,
        });
        console.log("I saved the students--now, to update the fields.");
        // refresh the list of courses
        await loadStudents();
        //reset all the fields to clear the data
        setNewStudentName(""); // Clear the input
        setNewStudentMajor("");
        setNewStudentGPA("");
    };
    const handleEditClick = (student) => {
        setEditingStudentId(student.id);
        setEditorForm({
            name: student.name || "",
            major: student.major || "",
            gpa: student.gpa ? student.gpa.toString() : ""
        });
    };
    const handleSaveEdit = async (id) => {
        try {
            const updatedData = {
                name: editForm.name,
                major: editForm.major,
                gpa: parseFloat(editForm.gpa)
            };
            // Send PUT request to your Spring Boot controller
            await StudentService.updateStudent(id, updatedData);
            // Close the edit row and refresh the list
            setEditingStudentId(null);
            await loadStudents();
        }
        catch (err) {
            console.error("Failed to update course: ", err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await StudentService.deleteStudent(id);
            // This triggers a re-render without a page refresh!
            setStudents(students.filter(s => s.id !== id));
        }
        catch (err) {
            alert("Delete failed!");
        }
    };
    // Fetch data on component load
    useEffect(() => {
        loadStudents();
    }, []);
    if (loading)
        return _jsx("div", { children: "Loading courses from Spring Boot..." });
    if (error)
        return _jsxs("div", { style: { color: 'red' }, children: ["Error: ", error] });
    return _jsxs("div", { children: [_jsxs("div", { id: "add-student-fields", className: "student-container", children: [_jsx("input", { id: "new-student-name", value: newStudentName, onChange: (e) => setNewStudentName(e.target.value), placeholder: "New Student Name" }), _jsx("input", { id: "new-student-major", value: newStudentMajor, onChange: (e) => setNewStudentMajor(e.target.value), placeholder: "New Student Major" }), _jsx("input", { id: "new-student-gpa", value: newStudentGPA, onChange: (e) => setNewStudentGPA(e.target.value), placeholder: "New Student GPA" }), _jsx("button", { id: "add-student-button", onClick: handleAdd, children: "Add Student" })] }), _jsx("h1", { children: "Students" }), _jsxs("table", { id: "student-list-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Student Name" }), _jsx("th", { children: "Major" }), _jsx("th", { children: "GPA" }), _jsx("th", { children: "Delete" }), _jsx("th", { children: "Edit" })] }) }), _jsx("tbody", { children: students.map(student => (_jsxs(React.Fragment, { children: [_jsxs("tr", { id: `student-row-${student.id}`, children: [_jsx("td", { id: `student-name-${student.id}`, children: student.name }), _jsx("td", { id: `student-major-${student.id}`, children: student.major }), _jsx("td", { id: `student-gpa-${student.id}`, children: student.gpa }), _jsx("td", { children: _jsx("button", { id: "delete-student-button", onClick: () => handleDelete(student.id), style: { color: 'red' }, children: "Delete" }) }), _jsx("td", { children: _jsx("button", { id: "edit-student-button", onClick: () => handleEditClick(student), style: { color: 'blue' }, children: "Edit" }) })] }, student.id), editingStudentId === student.id && (_jsx("tr", { style: { backgroundColor: '#f0f8ff' }, children: _jsxs("td", { colSpan: 7, children: [" ", _jsxs("div", { style: { display: 'flex', gap: '10px', padding: '10px' }, children: [_jsx("input", { id: "edit-student-name", value: editForm.name, onChange: (e) => setEditorForm({ ...editForm, name: e.target.value }), placeholder: "Student Name" }), _jsx("input", { id: "edit-student-major", value: editForm.major, onChange: (e) => setEditorForm({ ...editForm, major: e.target.value }), placeholder: "Student Major" }), _jsx("input", { id: "edit-student-gpa", value: editForm.gpa, onChange: (e) => setEditorForm({ ...editForm, gpa: e.target.value }), placeholder: "GPA" }), _jsx("button", { id: "edit-student-save-button", onClick: () => handleSaveEdit(student.id), style: { color: 'green' }, children: "Save" }), _jsx("button", { id: "edit-student-cancel-button", onClick: () => setEditingStudentId(null), children: "Cancel" })] })] }) }))] }, student.id))) })] })] });
};
export default StudentList;
