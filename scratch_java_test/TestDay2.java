
import java.io.*;

public class TestDay2 {
    public static void main(String[] args) {
        String input = "22\nVinay Kumar\n";
        System.setIn(new ByteArrayInputStream(input.getBytes()));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        
        SolutionDay2.main(new String[]{});
        
        String res = out.toString().trim();
        System.err.println("CAPTURED OUTPUT: " + res);
        if (!res.contains("Name: Vinay Kumar | Age: 22")) {
            throw new AssertionError("Failed to capture correct name and age");
        }
        System.err.println("✅ DAY 2 SCANNER ASSERTION PASSED!");
    }
}
