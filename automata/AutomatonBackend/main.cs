// using System;
// namespace AutomatonBackend.Controllers;

// class main {
//     static void Main(string[] args) {

//         // our states
//         State q0 = new State("Q0", false);
//         State q1 = new State("Q1", false);
//         State q2 = new State("Q2", true);
//         State q3 = new State("Q3", false);

//         // transitions
//         q0.AddTransition('a', q1);
//         q1.AddTransition('b', q2);
//         q2.AddTransition('a', q3);
//         q3.AddTransition('b', q2);

//         DFA dfa = new DFA(q0);

//         // List of test strings
//         String[] testStrings = { "ab", "abab", "ababab", "", "a", "b", "aba", "ba",
//         "bb", "ababb" };

//         // Test each string
//         // long begin = System.currentTimeMillis();
//         foreach (String testString in testStrings) {
//             bool result = dfa.Simulate(testString);
//             Console.WriteLine("Test with \"" + testString + "\": " + (result ?
//             "Accepted" : "Rejected"));
//         }
        


//         // PDAState q0 = new PDAState("Q0", false);
//         // PDAState q1 = new PDAState("Q1", false);
//         // PDAState q2 = new PDAState("Q2", false);
//         // PDAState q3 = new PDAState("Q3", false);
//         // PDAState q4 = new PDAState("Q4", false);
//         // PDAState q5 = new PDAState("Q5", false);

//         // q1.AddTransition('A', ' ', q2, "A");
//         // q1.AddTransition('B', ' ', q3, "B");

//         // q2.AddTransition('A', ' ', q2, "");
//         // q2.AddTransition('B', 'A', q4, "");

//         // q4.AddTransition('A', ' ', q2, "A");
//         // q4.AddTransition(' ', '#', q1, "#");
//         // q4.AddTransition('B', 'A', q4, "");

//         // q3.AddTransition('B', ' ', q3, "B");
//         // q3.AddTransition('A', 'B', q5, "");

//         // q5.AddTransition('B', ' ', q3, "B");
//         // q5.AddTransition('A', 'B', q5, "");
//         // q5.AddTransition(' ', '#', q1, "#");

//         // PDA pda = new PDA(q1, '#');

//         // pda.Simulate("ABAB");
//     }
// }