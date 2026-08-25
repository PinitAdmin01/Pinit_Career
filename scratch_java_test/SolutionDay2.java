
import java.util.Scanner;

public class SolutionDay2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        sc.nextLine(); // Buffer fix
        String name = sc.nextLine();
        System.out.println("Name: " + name + " | Age: " + age);
    }
}
