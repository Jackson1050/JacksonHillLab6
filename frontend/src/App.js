import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CourseList from './components/CourseList';
import StudentList from "./components/StudentList";
import './App.css';
function App() {
    console.log("App is rendering!");
    return (_jsx(BrowserRouter, { children: _jsxs("div", { className: "App", children: [_jsxs("nav", { className: "navbar", children: [_jsx("h2", { style: { margin: 0 }, children: "My School App" }), _jsxs("div", { className: "nav-links", children: [_jsx(Link, { id: "nav-course-list-link", to: "/", className: "nav-link", children: "Courses" }), _jsx(Link, { id: "nav-student-list-link", to: "/students", className: "nav-link", children: "Students" })] })] }), _jsx("div", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(CourseList, {}) }), _jsx(Route, { path: "/students", element: _jsx(StudentList, {}) })] }) })] }) }));
}
export default App;
