import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "" || dueDate === "") return;
    setTasks([...tasks, {
      id: uuidv4(),
      title: input,
      completed: false,
      category,
      priority,
      dueDate,
    }]);
    setInput("");
    setDueDate("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newTitle) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    ));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.category.toLowerCase().includes(search.toLowerCase())
  );

  // Chart Data
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const pieData = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  const categoryData = Object.values(tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = { category: task.category, count: 0 };
    acc[task.category].count++;
    return acc;
  }, {}));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl"
      >
        {/* Header */}
        <h1 className="container">
          ✨ Smart Task Manager ✨
        </h1>

        {/* Input Section */}
        <div className="bg-indigo-50 shadow-sm rounded-2xl p-6 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="📝 Add a new task..."
            className="border p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-3 rounded-xl w-full">
              <option>General</option>
              <option>Work</option>
              <option>Personal</option>
              <option>School</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-3 rounded-xl w-full">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-3 rounded-xl w-full"
            />
          </div>
          <button
            onClick={addTask}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl w-full hover:bg-indigo-700 transition font-semibold"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search tasks..."
          className="border p-3 rounded-xl w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Task List */}
        <ul className="space-y-3 mb-10">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <span
                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    className={`font-semibold text-lg ${task.completed ? 'text-gray-400' : 'text-gray-800'}`}
                  >
                    {task.title}
                  </span>
                  <div className="text-sm text-gray-500">
                    {task.category} • {task.priority} • {task.dueDate && new Date(task.dueDate).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toggleComplete(task.id)} className="text-green-600 hover:scale-110">✔</button>
                  <button onClick={() => {
                    const newTitle = prompt("Edit task:", task.title);
                    if (newTitle) editTask(task.id, newTitle);
                  }} className="text-yellow-600 hover:scale-110">✎</button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:scale-110">✘</button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-indigo-50 shadow-lg rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">📊 Task Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center mt-2 text-gray-600">Completed vs Pending</p>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center mt-2 text-gray-600">Tasks by Category</p>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
