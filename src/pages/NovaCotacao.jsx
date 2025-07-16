import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarCotacao } from "../services/dashboardService";
import { getUsuarioLogado } from "../services/authService";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

const NovaCotacao = () => {
  const usuario = getUsuarioLogado();
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  // Impedir acesso caso não seja Síndico
  if (usuario?.cargo.toLowerCase() !== "síndico") {
    return <p className="text-red-500 text-center mt-10">Apenas o Síndico pode criar cotações.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      await cadastrarCotacao({ descricao });
      navigate("/cotacoes"); // Redireciona para a página de cotações após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar cotação:", error);
      setErro("Falha ao cadastrar cotação. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate("/cotacoes")} className="text-white hover:text-gray-400">
                  <FaArrowLeft size={20} />
                </button>
      </header>

      <div className="p-6 max-w-lg mx-auto">
        <h3 className="text-2xl font-bold text-[#98055A] mb-4">Criar Nova Cotação</h3>

        {erro && <p className="text-red-500">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Descrição da Cotação"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#98055A]"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#98055A] text-white p-2 rounded hover:bg-[#7a0448] transition"
          >
            Criar Cotação
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovaCotacao;
