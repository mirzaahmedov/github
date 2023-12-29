import { useRef, useState, useLayoutEffect } from "react";

type Equation = {
  problem: string;
  result: string;
};
type Variable = {
  name: string;
  value: string;
};

function evalEquation(equation: string): string {
  if (equation === "") {
    return "?";
  }
  try {
    return String(eval(equation));
  } catch (e) {
    console.log(e);
    return "?";
  }
}

function App() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeEquation, setActiveEquation] = useState<number>(0);
  const [equations, setEquations] = useState<Equation[]>([
    { problem: "", result: "" },
  ]);
  const [variables, setVariables] = useState<Variable[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEquations((state) => [...state, { problem: "", result: "" }]);
      setActiveEquation((state) => state + 1);
    }
  };
  const handleChangeEquation = (i: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setEquations((state) =>
        state.map((v, j) =>
          j === i
            ? { problem: e.target.value, result: evalEquation(e.target.value) }
            : v,
        ),
      );
    };
  };

  useLayoutEffect(() => {
    inputRefs.current[activeEquation]?.focus();
  });

  return (
    <div>
      <div>
        {equations.map(({ problem, result }, i) => (
          <div key={i} className="border-b border-slate-200 text-slate-900 ">
            <input
              ref={(ref) => {
                if (i >= inputRefs.current.length) {
                  inputRefs.current.push(ref);
                } else {
                  inputRefs.current[i] = ref;
                }
              }}
              autoFocus={i === activeEquation}
              onFocus={() => setActiveEquation(i)}
              type="text"
              value={problem}
              onKeyDown={handleKeyDown}
              onChange={handleChangeEquation(i)}
              className="appearance-none border-none bg-none outline-none p-4 text-2xl tracking-widest"
            />
            <span className="text-slate-500">= {result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
