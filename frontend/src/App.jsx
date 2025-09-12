import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import ExpensesPage from "./features/expenses/ExpensesPage";
import NewExpensePage from "./features/expenses/NewExpensePage";
import EditExpensePage from "./features/expenses/EditExpensePage";
import IncomesPage from "./features/incomes/IncomesPage";
import NewIncomePage from "./features/incomes/NewIncomePage";
import EditIncomePage from "./features/incomes/EditIncomePage";
import DashboardPage from "./features/dashboard/DashboardPage";
import CategoriesPage from "./features/categories/CategoriesPage";
import NewCategoryPage from "./features/categories/NewCategoryPage";
import EditCategoryPage from "./features/categories/EditCategoryPage";
import UserProfilePage from "./features/profile/UserProfilePage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="">
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

        
          {token ? (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/new" element={<NewExpensePage />} />
              <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
              <Route path="/incomes" element={<IncomesPage />} />
              <Route path="/incomes/new" element={<NewIncomePage />} />
              <Route path="/incomes/:id/edit" element={<EditIncomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/new" element={<NewCategoryPage />} />
              <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
