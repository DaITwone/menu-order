import { Routes, Route } from "react-router-dom";

import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;