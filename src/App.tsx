import { useState } from "react";
import "./App.css";
import { NavIcon } from "./components/icons";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import Sidebar from "./components/sidebar";
import { NotificationContainer } from "./components/notification";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="w-screen h-full mx-auto flex flex-col">
      <NotificationContainer />
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
