import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Plus, Equals, X } from "@phosphor-icons/react";

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
function evalVariables(equation: string, variables: Variable[]): string {
  variables.forEach((v) => {
    equation = equation.replace(`$${v.name}`, v.value);
  });
  return equation;
}

function App() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeEquation, setActiveEquation] = useState<number>(0);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [equations, setEquations] = useState<Equation[]>([
    { problem: "", result: "" },
  ]);

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
            ? {
                problem: e.target.value,
                result: evalEquation(evalVariables(e.target.value, variables)),
              }
            : v,
        ),
      );
    };
  };
  const handleChangeVariable = (i: number, key: keyof Variable) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setVariables((state) =>
        state.map((v, j) => (j === i ? { ...v, [key]: e.target.value } : v)),
      );
    };
  };

  useEffect(() => {
    setEquations((state) =>
      state.map((e) => ({
        ...e,
        result: evalEquation(evalVariables(e.problem, variables)),
      })),
    );
  }, [variables]);
  useLayoutEffect(() => {
    inputRefs.current[activeEquation]?.focus();
  }, [activeEquation]);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        {equations.map(({ problem, result }, i) => (
          <div
            key={i}
            className="flex items-center border-b border-slate-200 text-slate-900 "
          >
            <span className="px-4 text-slate-500">{i + 1}.</span>
            <input
              type="text"
              ref={(ref) => {
                if (i >= inputRefs.current.length) {
                  inputRefs.current.push(ref);
                } else {
                  inputRefs.current[i] = ref;
                }
              }}
              autoFocus={i === activeEquation}
              onFocus={() => setActiveEquation(i)}
              value={problem}
              onKeyDown={handleKeyDown}
              onChange={handleChangeEquation(i)}
              className="appearance-none border-none bg-none outline-none italic p-4 text-md tracking-widest"
            />
            <span className="flex items-center gap-2 text-slate-500 italic">
              <Equals /> {result}
            </span>
          </div>
        ))}
      </div>
      <div className="height-full w-full max-w-lg p-4 border-l border-slate-200">
        {variables.map((v, i) => (
          <div className="flex items-center gap-2 py-2">
            <input
              type="text"
              value={v.name}
              onChange={handleChangeVariable(i, "name")}
              className="min-w-0 flex-1 p-2 bg-slate-100 text-slate-600 italic outline-none rounded"
            />
            <span className="text-slate-500">
              <Equals />
            </span>
            <input
              type="text"
              value={v.value}
              onChange={handleChangeVariable(i, "value")}
              className="min-w-0 flex-1 p-2 bg-slate-100 text-slate-600 italic outline-none rounded"
            />
            <button
              className="p-1 text-slate-500 rounded-full border border-slate-500"
              onClick={() =>
                setVariables((state) => state.filter((_, j) => j !== i))
              }
            >
              <X />
            </button>
          </div>
        ))}
        <button
          className="flex items-center gap-2 py-3 px-5 mt-4 bg-blue-500 text-white rounded font-medium"
          onClick={() =>
            setVariables((state) => [...state, { name: "", value: "" }])
          }
        >
          <Plus /> New Variable
        </button>
      </div>
    </div>
  );
}

export default App;
