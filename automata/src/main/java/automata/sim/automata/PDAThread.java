package automata.sim.automata;

import java.util.ArrayDeque;
import java.util.Deque;

public class PDAThread extends Thread {

    private PDAState currState;
    private Deque<Character> stack;

    public PDAThread(PDAState startState) {
        this.currState = currState;
        this.stack = new ArrayDeque<>();
        stack.push('#');
    }

    @Override
    public void run() {
        simulate();
    }

    public void simulate() {
        // PDA sim logic
    }

}
