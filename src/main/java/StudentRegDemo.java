import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"controller", "config", "validation", "exception", "model", "repository"})
@EntityScan(basePackages = {"model"})
@EnableJpaRepositories(basePackages = {"repository"})
public class StudentRegDemo {
    public static void main(String[] args) {
        // This single line starts the entire Spring framework,
        // boots up the H2 database, and launches the web server.
        SpringApplication.run(StudentRegDemo.class, args);

        System.out.println("Arkansas Student API is live at http://localhost:8080");
    }

}