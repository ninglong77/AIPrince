import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { NavIcon } from "./components/icons";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import Sidebar from "./components/sidebar";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="w-screen h-full mx-auto flex flex-col">
      <div className="p-2">
        <div className="cursor-pointer w-6" onClick={() => setIsSidebarOpen(true)}>
          <NavIcon />
        </div>
      </div>
      <div>
        <BrowserRouter>
          <Sidebar isModalOpen={isSidebarOpen} closeDeleteModal={() => setIsSidebarOpen(false)} />
          <AppRoutes />
        </BrowserRouter>
      </div>
    </main>
  );
}

export default App;
