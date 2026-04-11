import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UITest {

    private static final String FRONTEND_URL = "http://localhost:5173/";
    private static final Duration WAIT_TIMEOUT = Duration.ofSeconds(10);

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, WAIT_TIMEOUT);
        driver.get(FRONTEND_URL);
        goToStudentList();
    }

    @AfterEach
    void tearDown() {
        if (driver != null) driver.quit();
    }

    private void goToStudentList() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("nav-student-list-link"))).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.id("new-student-name")));
    }

    private void addStudent(String name, String major, String gpa) {
        driver.findElement(By.id("new-student-name")).sendKeys(name);
        driver.findElement(By.id("new-student-major")).sendKeys(major);
        driver.findElement(By.id("new-student-gpa")).sendKeys(gpa);
        driver.findElement(By.id("add-student-button")).click();
    }

    private void addCourse(String name, String instructor, String size, String room)
    {
        driver.findElement(By.id("new-course-name")).sendKeys(name);
        driver.findElement(By.id("new-course-instructor")).sendKeys(instructor);
        driver.findElement(By.id("new-course-max-size")).sendKeys(size);
        driver.findElement(By.id("new-course-room")).sendKeys(room);
    }


    private int waitForRowCount(int expected) {
        By rowSelector = By.cssSelector("#student-list-table tbody tr");
        try {
            wait.until(d -> d.findElements(rowSelector).size() == expected);
        } catch (TimeoutException ignored) {
        }
        return driver.findElements(rowSelector).size();
    }

    private int waitForCourseCount(int expected) {
        By rowSelector = By.cssSelector("#course-list-table tbody tr");
        try {
            wait.until(d -> d.findElements(rowSelector).size() == expected);
        } catch (TimeoutException ignored) {
        }
        return driver.findElements(rowSelector).size();
    }

    // ---------- tests ----------

    @Test
    @Order(1)
    @DisplayName("NullStudentTest")
    void testNullStudent() {
        addStudent("", "Comp Sci", "3.5");
        assertEquals(0, waitForRowCount(0), "Empty name should be rejected");
    }

    @Test
    @Order(2)
    @DisplayName("LongStudentTest")
    void testLongNameStudent() {
        addStudent("A".repeat(256), "Comp Sci", "3.5");
        assertEquals(0, waitForRowCount(0), "Name longer than 255 should be rejected");
    }

    @Test
    @Order(3)
    @DisplayName("SuccessStudentTest")
    void testSuccessStudent() {
        addStudent("Steve", "Comp Sci", "3.5");
        assertEquals(1, waitForRowCount(1), "Valid student should be added");
    }

    @Test
    @Order(4)
    @DisplayName("MinNameStudentTest")
    void testMinNameStudent() {
        addStudent("A", "Comp Sci", "3.5");
        assertEquals(2, waitForRowCount(2), "Single-character name should be accepted");
    }

    @Test
    @Order(5)
    @DisplayName("MaxNameStudentTest")
    void testMaxNameStudent() {
        addStudent("A".repeat(255), "Comp Sci", "3.5");
        assertEquals(3, waitForRowCount(3), "255-character name should be accepted");
    }

    @Test
    @Order(6)
    @DisplayName("NullMajorStudentTest")
    void testNullMajorStudent() {
        addStudent("Steve", "", "3.5");
        assertEquals(3, waitForRowCount(3), "Empty major should be rejected");
    }

    @Test
    @Order(7)
    @DisplayName("NegGPAStudentTest")
    void testNegGPAStudent() {
        addStudent("Steve", "Comp Sci", "-8");
        assertEquals(3, waitForRowCount(3), "Negative GPA should be rejected");
    }

    @Test
    @Order(8)
    @DisplayName("MinGPAStudentTest")
    void testMinGPAStudent() {
        addStudent("Steve", "Comp Sci", "0");
        assertEquals(4, waitForRowCount(4), "GPA of 0 should be accepted");
    }

    @Test
    @Order(9)
    @DisplayName("TooHighGPAStudentTest")
    void testTooHighGPAStudent() {
        addStudent("Steve", "Comp Sci", "4.1");
        assertEquals(4, waitForRowCount(4), "GPA above 4.0 should be rejected");
    }

    @Test
    @Order(10)
    @DisplayName("NullGPATest")
    void testNullGPA() {
        addStudent("Steve", "Comp Sci", "");
        assertEquals(4, waitForRowCount(4), "Null GPA should be rejected");
    }

    @Test
    @Order(11)
    @DisplayName("MajorTooLongTest")
    void testMajorTooLong() {
        addStudent("Steve", "A".repeat(256), "4.0");
        assertEquals(4, waitForRowCount(4), "Major longer than 255 characters should be rejected");
    }

    @Test
    @Order(12)
    @DisplayName("MinimumMajorNameTest")
    void testMinimumMajorName()
    {
        addStudent("Steve", "A", "4.0");
        assertEquals(5, waitForRowCount(5), "Major with 1 character should be accepted");
    }

    @Test
    @Order(13)
    @DisplayName("MaximumMajorNameTest")
    void testMaximumMajorName()
    {
        addStudent("Steve", "A".repeat(255), "4.0");
        assertEquals(6, waitForRowCount(6), "Major with 255 characters should be accepted");
    }

    @Test
    @Order(14)
    @DisplayName("ValidUpdateStudentTest")
    void testValidUpdateStudent() {
        By rowSelector = By.cssSelector("#student-list-table tbody tr");
        int rowsBefore = driver.findElements(rowSelector).size();

        driver.findElement(By.id("edit-student-button")).click();

        WebElement nameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-student-name")));
        WebElement majorField = driver.findElement(By.id("edit-student-major"));
        WebElement gpaField = driver.findElement(By.id("edit-student-gpa"));

        nameField.clear();
        nameField.sendKeys("UpdatedName");
        majorField.clear();
        majorField.sendKeys("UpdatedMajor");
        gpaField.clear();
        gpaField.sendKeys("3.75");

        driver.findElement(By.id("edit-student-save-button")).click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("edit-student-save-button")));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector("#student-list-table tbody"), "UpdatedName"));

        int rowsAfter = driver.findElements(rowSelector).size();
        assertEquals(rowsBefore, rowsAfter, "Update should not change the row count");

        String tableText = driver.findElement(By.cssSelector("#student-list-table tbody")).getText();
        assertTrue(tableText.contains("UpdatedName"), "Updated name should be visible in the table");
        assertTrue(tableText.contains("UpdatedMajor"), "Updated major should be visible in the table");
        assertTrue(tableText.contains("3.75"), "Updated GPA should be visible in the table");
    }

    @Test
    @Order(15)
    @DisplayName("InvalidUpdateStudentTest")
    void testInvalidUpdateStudent() {
        By rowSelector = By.cssSelector("#student-list-table tbody tr");
        By tableBody = By.cssSelector("#student-list-table tbody");

        int rowsBefore = driver.findElements(rowSelector).size();
        String tableTextBefore = driver.findElement(tableBody).getText();

        driver.findElement(By.id("edit-student-button")).click();

        WebElement nameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-student-name")));
        WebElement gpaField = driver.findElement(By.id("edit-student-gpa"));

        nameField.clear();
        nameField.sendKeys("ShouldNotPersist");
        gpaField.clear();
        gpaField.sendKeys("5.5");

        driver.findElement(By.id("edit-student-save-button")).click();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        int rowsAfter = driver.findElements(rowSelector).size();
        assertEquals(rowsBefore, rowsAfter, "Failed update should not change the row count");

        String tableTextAfter = driver.findElement(tableBody).getText();
        assertFalse(tableTextAfter.contains("ShouldNotPersist"), "Invalid name should not appear in the table");
        assertFalse(tableTextAfter.contains("5.5"), "Invalid GPA should not appear in the table");
        assertEquals(tableTextBefore, tableTextAfter, "Table contents should be unchanged after a rejected update");
    }

    @Test
    @Order(16)
    @DisplayName("ValidDeleteStudentTest")
    void testValidDeleteStudent() {
        By rowSelector = By.cssSelector("#student-list-table tbody tr");
        int rowsBefore = driver.findElements(rowSelector).size();
        assertTrue(rowsBefore > 0, "Test prerequisite: there must be at least one student to delete");

        driver.findElement(By.id("delete-student-button")).click();

        int rowsAfter = waitForRowCount(rowsBefore - 1);
        assertEquals(rowsBefore - 1, rowsAfter, "Successful delete should remove exactly one row");
    }

    @Test
    @Order(17)
    @DisplayName("CourseAddSuccessTest")
    void testCourseAddSuccess()
    {
        addCourse("Comp Sci", "Steve", "1", "1");
        assertEquals(1, waitForCourseCount(1), "Valid course should be accepted");

    }

    @Test
    @Order(18)
    @DisplayName("CourseRoomNullTest")
    void testCourseRoomNull()
    {
        addCourse("", "Steve", "1", "1");
        assertEquals(1, waitForCourseCount(1), "Null Room should be rejected");
    }

    @Test
    @Order(19)
    @DisplayName("CourseSizeNullTest")
    void testCourseSizeNull()
    {
        addCourse("Comp Sci", "Steve", "", "1");
        assertEquals(1, waitForCourseCount(1), "Null Size should be rejected");

    }

    @Test
    @Order(20)
    @DisplayName("CourseInstructorNullTest")
    void testCourseInstructorNull()
    {
        addCourse("Comp Sci", "", "1", "1");
        assertEquals(1, waitForCourseCount(1), "Null Instructor should be rejected");

    }

    @Test
    @Order(21)
    @DisplayName("CourseInstructorMinimumTest")
    void testCourseInstructorMinimum()
    {
        addCourse("Comp Sci", "A", "1", "1");
        assertEquals(2, waitForCourseCount(2), "Minimum character Instructor should be accepted");

    }

    @Test
    @Order(22)
    @DisplayName("CourseInstructorTooLongTest")
    void testCourseInstructorTooLong()
    {
        addCourse("Comp Sci", "A".repeat(256), "1", "1");
        assertEquals(2, waitForCourseCount(2), "Instructor with 256 characters should be rejected");

    }

    @Test
    @Order(23)
    @DisplayName("CourseInstructorMaximumTest")
    void testCourseInstructorMaximum()
    {
        addCourse("Comp Sci", "A".repeat(255), "1", "1");
        assertEquals(3, waitForCourseCount(3), "Instructor with 255 characters should be accepted");

    }

    @Test
    @Order(24)
    @DisplayName("CourseNameNullTest")
    void testCourseNameNull()
    {
        addCourse("", "Steve", "1", "1");
        assertEquals(3, waitForCourseCount(3), "Course will null name should be rejected");

    }

    @Test
    @Order(25)
    @DisplayName("CourseNameMinimumTest")
    void testCourseNameMinimum()
    {
        addCourse("A", "Steve", "1", "1");
        assertEquals(4, waitForCourseCount(4), "Course with one character name should be accepted");

    }

    @Test
    @Order(26)
    @DisplayName("CourseNameMaximumTest")
    void testCourseNameMaximum()
    {
        addCourse("A".repeat(255), "Steve", "1", "1");
        assertEquals(5, waitForCourseCount(5), "Course with 255 character name should be accepted");

    }

    @Test
    @Order(27)
    @DisplayName("CourseNameTooLongTest")
    void testCourseNameTooLong()
    {
        addCourse("A".repeat(256), "Steve", "1", "1");
        assertEquals(5, waitForCourseCount(5), "Course with 256 character name should be rejected");

    }

    @Test
    @Order(28)
    @DisplayName("ValidUpdateCourseTest")
    void testValidUpdateCourse() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("nav-course-list-link"))).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-course-button")));

        By rowSelector = By.cssSelector("#course-list-table tbody tr");
        int rowsBefore = driver.findElements(rowSelector).size();

        driver.findElement(By.id("edit-course-button")).click();

        WebElement nameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-course-name")));
        WebElement instructorField = driver.findElement(By.id("edit-course-instructor"));
        WebElement maxSizeField = driver.findElement(By.id("edit-course-max-size"));
        WebElement roomField = driver.findElement(By.id("edit-course-room"));

        nameField.clear();
        nameField.sendKeys("UpdatedCourse");
        instructorField.clear();
        instructorField.sendKeys("2");
        maxSizeField.clear();
        maxSizeField.sendKeys("25");
        roomField.clear();
        roomField.sendKeys("UpdatedRoom");

        driver.findElement(By.id("edit-course-save-button")).click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("edit-course-save-button")));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.cssSelector("#course-list-table tbody"), "UpdatedCourse"));

        int rowsAfter = driver.findElements(rowSelector).size();
        assertEquals(rowsBefore, rowsAfter, "Update should not change the row count");

        String tableText = driver.findElement(By.cssSelector("#course-list-table tbody")).getText();
        assertTrue(tableText.contains("UpdatedCourse"), "Updated course name should be visible in the table");
        assertTrue(tableText.contains("UpdatedRoom"), "Updated room should be visible in the table");
        assertTrue(tableText.contains("25"), "Updated max size should be visible in the table");
    }

    @Test
    @Order(29)
    @DisplayName("InvalidUpdateCourseTest")
    void testInvalidUpdateCourse() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("nav-course-list-link"))).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-course-button")));

        By rowSelector = By.cssSelector("#course-list-table tbody tr");
        By tableBody = By.cssSelector("#course-list-table tbody");

        int rowsBefore = driver.findElements(rowSelector).size();
        String tableTextBefore = driver.findElement(tableBody).getText();

        driver.findElement(By.id("edit-course-button")).click();

        WebElement nameField = wait.until(ExpectedConditions.elementToBeClickable(By.id("edit-course-name")));
        WebElement maxSizeField = driver.findElement(By.id("edit-course-max-size"));

        nameField.clear();
        nameField.sendKeys("ShouldNotPersist");
        maxSizeField.clear();
        maxSizeField.sendKeys("0");

        driver.findElement(By.id("edit-course-save-button")).click();

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        int rowsAfter = driver.findElements(rowSelector).size();
        assertEquals(rowsBefore, rowsAfter, "Failed update should not change the row count");

        String tableTextAfter = driver.findElement(tableBody).getText();
        assertFalse(tableTextAfter.contains("ShouldNotPersist"), "Invalid course name should not appear in the table");
        assertEquals(tableTextBefore, tableTextAfter, "Table contents should be unchanged after a rejected update");
    }

    @Test
    @Order(30)
    @DisplayName("ValidDeleteCourseTest")
    void testValidDeleteCourse() {
        wait.until(ExpectedConditions.elementToBeClickable(By.id("nav-course-list-link"))).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.id("delete-course-button")));

        By rowSelector = By.cssSelector("#course-list-table tbody tr");
        int rowsBefore = driver.findElements(rowSelector).size();
        assertTrue(rowsBefore > 0, "Test prerequisite: there must be at least one course to delete");

        driver.findElement(By.id("delete-course-button")).click();

        int rowsAfter = waitForCourseCount(rowsBefore - 1);
        assertEquals(rowsBefore - 1, rowsAfter, "Successful delete should remove exactly one row");
    }

    @Test
    @Order(31)
    @DisplayName("CourseSizeTooSmallTest")
    void testCourseSizeTooSmall()
    {
        addCourse("Comp Sci", "Steve", "0", "1");
        assertEquals(4, waitForCourseCount(4), "Course with no space should be rejected");

    }

    @Test
    @Order(32)
    @DisplayName("CourseRoomTooSmallTest")
    void testCourseRoomTooSmall()
    {
        addCourse("Comp Sci", "Steve", "1", "0");
        assertEquals(4, waitForCourseCount(4), "Course with bad room number should be rejected");

    }
}
