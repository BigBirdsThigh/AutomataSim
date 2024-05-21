package automata.sim.automata;

public class Main {

    public static void main(String[] args) {
        // our states
        State q0 = new State("Q0", false);
        State q1 = new State("Q1", true);

        // transitions
        q0.addTransition('a', q1);
        q0.addTransition('b', q0);

        q1.addTransition('a', q0);
        q1.addTransition('b', q0);
        q1.addTransition('b', q1);

        NFA nfa = new NFA(q0);

        // List of test strings
        String[] testStrings = { "a", "aa", "ab", "abb", "aaa", "aba", "aabaa", "abbbb", "aabbbba", "b", "ba", "" };

        // Test each string
        for (String testString : testStrings) {
            boolean result = nfa.simulate(testString);
            System.out.println("Test with \"" + testString + "\": " + (result ? "Accepted" : "Rejected"));
        }
    }

}
