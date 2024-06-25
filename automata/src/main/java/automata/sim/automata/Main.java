package automata.sim.automata;

import java.util.List;
import java.util.Stack;

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

        // // List of test strings
        // String[] testStrings = { "ab", "abab", "ababab", "", "a", "b", "aba", "ba",
        // "bb", "ababb" };

        // // Test each string
        // // long begin = System.currentTimeMillis();
        // for (String testString : testStrings) {
        // boolean result = nfa.simulate(testString);
        // System.out.println("Test with \"" + testString + "\": " + (result ?
        // "Accepted" : "Rejected"));
        // }
        // long end = System.currentTimeMillis();
        // long executeTime = end - begin;
        // System.out.println("System took: " + executeTime + " ms to execute.");

        // q0.addTransition('s', t2);
        // q0.addTransition('s', t3);
        // q0.addTransition('s', t4);

        Stack<Character> stack = new Stack<Character>();
        stack.push('s');

        PDAState q0 = new PDAState("Q0", false);
        PDAState q1 = new PDAState("Q1", false);
        PDAState q2 = new PDAState("Q2", false);
        PDAState q3 = new PDAState("Q3", false);
        PDAState q4 = new PDAState("Q4", false);
        PDAState q5 = new PDAState("Q5", false);

        q0.addTransition('f', ' ', q1, "Z");
        q1.addTransition('c', ' ', q2, "A");
        q2.addTransition('b', ' ', q3, "");
        q3.addTransition('b', ' ', q5, "");
        q4.addTransition('b', ' ', q2, "");

        PDA pda = new PDA(q0, 'c');

        pda.simulate("fcbbb", stack);

    }

}
