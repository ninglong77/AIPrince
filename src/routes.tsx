import { Route, Routes } from "react-router";
import NewAiScript from "./pages/ai_scripts/NewAiScript";
import Index from "./pages/Index";
import UI from "./pages/UI";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<Index />} />
      <Route path="/ai_scripts/new" element={<NewAiScript />} />
      <Route path="/ai_scripts/edit/:editId" element={<NewAiScript />} />
      <Route path="/ui" element={<UI />} />
    </Routes>
  );
}
