package automata.sim.automata;

public class Main {

    public static void main(String[] args) {
        // our states
        // State q0 = new State("Q0", false);
        // State q1 = new State("Q1", false);
        // State q2 = new State("Q2", true);
        // State q3 = new State("Q3", false);

        // // transitions
        // q0.addTransition('a', q1);
        // q1.addTransition('b', q2);
        // q2.addTransition('a', q3);
        // q3.addTransition('b', q2);

        // NFA nfa = new NFA(q0);

        // // // List of test strings
        // String[] testStrings = { "ab", "abab", "ababab", "", "a", "b", "aba", "ba",
        // "bb", "ababb" };

        // // // Test each string
        // for (String testString : testStrings) {
        // boolean result = nfa.simulate(testString);
        // System.out.println("Test with \"" + testString + "\": " + (result ?
        // "Accepted" : "Rejected"));
        // }

        PDAState q0 = new PDAState("Q0", false);
        PDAState q1 = new PDAState("Q1", false);

        String[] t1 = { "q1", "f", "x" };
        String[] t2 = { "q3", "c", "x" };
        String[] t3 = { "q3", "g", "x" };
        String[] t4 = { "q4", "c", "q" };

        q0.addTransition('s', t1);
        q0.addTransition('s', t2);
        q0.addTransition('s', t3);
        q0.addTransition('s', t4);

        String[] output = q0.getPopsAndStates('s');
        System.out.println("The transition data for q0 is: ");
        if (output.length != 0) {
            for (String str : output) {
                System.out.println(str);
            }
        }

        // System.out.println(output[1]);

        // System.out.println("Next state for transition is: " + t1[0]);
        // System.out.println("Stack pop command for transition is: " + t1[1]);
        // System.out.println("Stack push command for transition is: " + t1[2]);

    }

}
