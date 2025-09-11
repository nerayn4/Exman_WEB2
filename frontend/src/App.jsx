import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Auth
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";

// Expenses
import ExpensesPage from "./features/expenses/ExpensesPage";
import NewExpensePage from "./features/expenses/NewExpensePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Expenses */}
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/new" element={<NewExpensePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
