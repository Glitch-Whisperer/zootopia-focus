import { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Home,
  Timer,
  CheckCircle,
  Plus
} from "lucide-react";

export const BiomeTimer = () => {
  // ---------------- TIMER / STOPWATCH MODE ----------------
  const [mode, setMode] = useState("timer"); // timer | stopwatch
  const [time, setTime] = useState(1500); // 25 min
  const [running, setRunning] = useState(false);

  // ---------------- STOPWATCH ----------------
  const [swTime, setSwTime] = useState(0);

  // ---------------- TODO ----------------
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // ---------------- EFFECT ----------------
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      if (mode === "timer") {
        setTime(t => (t > 0 ? t - 1 : 0));
      } else {
        setSwTime(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode]);

  // ---------------- FORMAT ----------------
  const format = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // ---------------- TODO HANDLERS ----------------
  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  };

  const toggleTodo = i => {
    setTodos(
      todos.map((t, idx) =>
        idx === i ? { ...t, done: !t.done } : t
      )
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">

      {/* MODE SWITCH */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("timer")}
          className={`px-4 py-2 rounded-full ${
            mode === "timer" ? "bg-cyan-500" : "bg-white/10"
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => setMode("stopwatch")}
          className={`px-4 py-2 rounded-full ${
            mode === "stopwatch" ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          Stopwatch
        </button>
      </div>

      {/* TIMER CIRCLE */}
      <div className="relative w-64 h-64 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
        <div className="absolute top-6">
          <Timer className="w-8 h-8 text-cyan-400" />
        </div>
        <span className="text-5xl font-bold">
          {mode === "timer" ? format(time) : format(swTime)}
        </span>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-6">
        <button
          onClick={() => setRunning(!running)}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center"
        >
          {running ? <Pause /> : <Play />}
        </button>

        <button
          onClick={() => {
            setTime(1500);
            setSwTime(0);
            setRunning(false);
          }}
          className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
        >
          <RotateCcw />
        </button>
      </div>

      {/* TODO PANEL */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-4 mt-6">
        <h3 className="text-lg font-semibold mb-3">🦊 Zootopia Tasks</h3>

        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="New mission..."
            className="flex-1 rounded-lg bg-black/40 px-3 py-2 outline-none"
          />
          <button
            onClick={addTodo}
            className="bg-cyan-500 rounded-lg px-3"
          >
            <Plus />
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((t, i) => (
            <li
              key={i}
              onClick={() => toggleTodo(i)}
              className={`flex items-center gap-2 cursor-pointer ${
                t.done ? "opacity-50 line-through" : ""
              }`}
            >
              <CheckCircle
                className={`w-4 h-4 ${
                  t.done ? "text-green-400" : "text-white/40"
                }`}
              />
              {t.text}
            </li>
          ))}
        </ul>
      </div>

      {/* HOME */}
      <button className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
        <Home />
      </button>
    </div>
  );
}
