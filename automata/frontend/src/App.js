import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Automaton from "./Automaton";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Automaton />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);