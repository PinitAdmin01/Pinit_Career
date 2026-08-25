
import java.io.*;

public class TestDay2Broken {
    public static void main(String[] args) {
        String input = "22\nVinay Kumar\n";
        System.setIn(new ByteArrayInputStream(input.getBytes()));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        
        SolutionDay2Broken.main(new String[]{});
        
        String res = out.toString().trim();
        if (!res.contains("Name: Vinay Kumar | Age: 22")) {
            throw new AssertionError("Assertion caught bug: nextLine() was skipped because buffer was not cleared! Got: " + res);
        }
    }
}
