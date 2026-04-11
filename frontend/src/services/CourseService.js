const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/courses" || 'http://localhost:8080/api/courses';
export const CourseService = {
    // Matches @GetMapping in CourseController
    async getAllCourses() {
        const response = await fetch(BASE_URL);
        if (!response.ok)
            throw new Error('Failed to load courses');
        return response.json();
    },
    // Matches @PutMapping("/addStudent/{courseId}")
    async addStudentToCourse(courseId, studentId) {
        const response = await fetch(`${BASE_URL}/addStudent/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // Matches @RequestBody long studentId
            body: JSON.stringify(studentId)
        });
        const message = await response.text();
        if (!response.ok)
            throw new Error(message); // Catches NullCourseException or "Course is full"
        return message;
    },
    async removeStudentFromCourse(courseId, studentId) {
        const response = await fetch(`${BASE_URL}/removeStudent/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentId)
        });
        const message = await response.text();
        if (!response.ok)
            throw new Error(message);
        return message;
    },
    // GET /api/courses/getEnrollment/{courseId}
    async getEnrollmentCount(courseId) {
        const response = await fetch(`${BASE_URL}/getEnrollment/${courseId}`);
        if (!response.ok)
            return -1;
        return response.json();
    },
    async addCourse(course) {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
        });
        return response.text();
    },
    async updateCourse(id, course) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
        });
        return response.text();
    },
    async deleteCourse(id) {
        await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    }
};
