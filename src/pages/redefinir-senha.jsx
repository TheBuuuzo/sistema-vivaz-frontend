import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchWithAuth from "../services/api";

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const t = query.get("token");
    setToken(t || "");
  }, [location.search]);

  const handleSubmit = async () => {
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmacaoSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
  
    if (!token) {
      setErro("Token inválido ou expirado.");
      return;
    }

    try {
      const response = await fetch(`https://sistema-vivaz-backend.onrender.com/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nova_senha: novaSenha })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(data.message || "Senha redefinida com sucesso!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErro(data.message || "Erro ao redefinir senha.");
      }

    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor.");
    }
  };

   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>

        {mensagem && <p className="text-green-600 text-center mb-4">{mensagem}</p>}
        {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}

        <input
          type="password"
          placeholder="Nova Senha"
          className="border p-2 rounded w-full mb-3"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar Senha"
          className="border p-2 rounded w-full mb-4"
          value={confirmacaoSenha}
          onChange={(e) => setConfirmacaoSenha(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Redefinir Senha
        </button>
      </div>
    </div>
  );
};

export default RedefinirSenha;