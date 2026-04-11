const BASE_URL = import.meta.env.VITE_API_BASE_URL + '/students' || 'http://localhost:8080/api/students';
export const StudentService = {
    // GET /api/students
    async getAllStudents() {
        const response = await fetch(`${BASE_URL}`);
        return response.json();
    },
    // POST /api/students
    async createStudent(student) {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });
        return response.json();
    },
    async addStudent(student) {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });
        return response.text();
    },
    async updateStudent(id, student) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });
        return response.text();
    },
    async deleteStudent(id) {
        await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    }
};
