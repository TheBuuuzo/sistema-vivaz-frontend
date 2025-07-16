import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Verifica se há um token armazenado

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
