import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = "https://sistema-vivaz-backend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpa mensagens de erro anteriores

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/dashboard");
      } else {
        setError(data.message || "Erro ao realizar login!");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor!");
    }
  };

  const handleEsqueciSenha = async () => {
  if (!email) {
    alert("Digite o e-mail para receber o link de redefinição.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/redefinir-senha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    
    const data = await response.json();

    if (response.ok) {
      alert(data.message || "E-mail enviado com sucesso!");
    } else {
      alert(data.message || "Erro ao enviar o e-mail.");
    }

  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    alert("Erro de conexão com o servidor.");
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-[#36B6BC]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#98055A]">
        {/* Logo do condomínio */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo do Condomínio" className="h-56" />
        </div>

        <h2 className="text-2x font-semibold text-center text-[#98055A] mb-4">
          Acesso ao Sistema
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#98055A]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#98055A]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#98055A] text-white p-2 rounded hover:bg-[#7a0448] transition-all"
          >
            Entrar
          </button>
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline mt-2"
            onClick={handleEsqueciSenha}
          >
            Esqueci minha senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
