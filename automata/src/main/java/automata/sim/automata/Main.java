package automata.sim.automata;

public class Main {

    public static void main(String[] args) {
        // our states
        State q0 = new State("Q0", false);
        State q1 = new State("Q1", false);
        State q2 = new State("Q2", true);

        // transitions
        q0.addTransition('a', q1);
        q1.addTransition('b', q2);
        q2.addTransition('ϵ', q1);

        NFA nfa = new NFA(q0);

        // List of test strings
        String[] testStrings = { "ab", "abab", "ababab", "", "a", "b", "aba", "ba", "bb", "ababb" };

        // Test each string
        for (String testString : testStrings) {
            boolean result = nfa.simulate(testString);
            System.out.println("Test with \"" + testString + "\": " + (result ? "Accepted" : "Rejected"));
        }
    }

}
