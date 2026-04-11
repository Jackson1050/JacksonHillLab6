package exception;

public class NullStudentException extends Exception {
    public NullStudentException() {
        super("No such student exists.");
    }
}