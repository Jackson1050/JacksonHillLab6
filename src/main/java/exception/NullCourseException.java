package exception;

public class NullCourseException extends Exception {
    public NullCourseException() {
        super("No such course exists");
    }
}