
import java.util.Scanner;

public class SolutionDay2Broken {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        // Missing sc.nextLine()
        String name = sc.nextLine();
        System.out.println("Name: " + name + " | Age: " + age);
    }
}
