import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCotações } from "../services/dashboardService";
import { getUsuarioLogado } from "../services/authService";
import { FaArrowLeft } from "react-icons/fa";

const Cotacoes = () => {
  const [cotações, setCotações] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const navigate = useNavigate();
  const usuario = getUsuarioLogado(); // Pegando usuário logado

  useEffect(() => {
    async function fetchData() {
      try {
        const cotacoesData = await getCotações();
        setCotações(cotacoesData.cotacoes || []);
      } catch (error) {
        console.error("Erro ao buscar cotações:", error);
      }
    }

    fetchData();
  }, []);

  const cotaçõesFiltradas = cotações.filter((c) => {
    const matchBusca = busca ? c.descricao.toLowerCase().includes(busca.toLowerCase()) : true;
    const matchStatus = mostrarFinalizadas ? c.status === "Finalizada" : c.status !== "Finalizada";
    return matchBusca && matchStatus;
  });

  const handleFinalizarCotacoes = async () => {
    try {
      const response = await fetch("http://192.168.15.13:5000/finalizar_cotacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Garante que o token está sendo enviado
        }
      });
  
      const data = await response.json(); // Tenta obter resposta JSON
  
      if (response.ok) {
        alert("Cotações finalizadas com sucesso!");
        window.location.reload(); // Atualiza a página
      } else {
        console.error("Erro na resposta do servidor:", data);
        alert("Erro ao finalizar cotações: " + (data.message || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao finalizar cotações. Verifique a conexão com o servidor.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra superior com fundo preto e ícone de voltar */}
      <header className="bg-black text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate("/dashboard")} className="text-white hover:text-gray-400">
          <FaArrowLeft size={20} />
        </button>
        {/* <h2 className="text-xl font-bold ml-4">Cotações</h2> */}
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-[#98055A]">Cotações</h2>

          {/* Botão "Nova Cotação" visível apenas para Síndico */}
          {usuario?.cargo === "Síndico" && (
            <button
              onClick={() => navigate("/nova-cotacao")}
              className="bg-[#36B6BC] text-white px-4 py-2 rounded hover:bg-[#2a9094] transition"
            >
              Nova Cotação
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="border px-3 py-1 rounded focus:ring-2 focus:ring-[#98055A]"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}
            className="bg-[#36B6BC] text-white px-4 py-2 rounded hover:bg-[#2a9094]"
          >
            {mostrarFinalizadas ? "Mostrar Abertas" : "Mostrar Finalizadas"}
          </button>

              {/* Botão para finalizar cotações vencidas - visível apenas para o síndico */}
              {usuario?.cargo === "Síndico" && (
                <button
                  onClick={handleFinalizarCotacoes}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                  Finalizar Vencidas
                </button>
              )}
        </div>

        {/* Lista de Cotações */}
        <div className="bg-white p-6 rounded-lg shadow">
          <ul className="space-y-2">
            {cotaçõesFiltradas.length > 0 ? (
              cotaçõesFiltradas.map((cotacao) => (
                <li key={cotacao.id} className="p-2 border-b flex justify-between items-center">
                  <span className="font-medium">{cotacao.descricao}
                    {/* VENCIMENTO */}
                    {(cotacao.status === "Pendente" || cotacao.status === "Reaberta") &&
                    new Date(cotacao.prazo_votacao) < new Date() && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        Vencida </span>
                    )}
                  </span>
                  <div className="flex items-center">
                    {/* Status da Cotação */}
                    <span
                      className={`px-3 py-1 text-sm rounded ${
                        cotacao.status === "Pendente"
                          ? "bg-yellow-300 text-gray-700"
                          : "bg-green-400 text-white"
                      }`}
                    >
                      {cotacao.status}
                    </span>
                    {/* Botão para visualizar detalhes */}
                    <button
                      onClick={() => navigate(`/cotacao/${cotacao.id}`)}
                      className="ml-4 bg-[#98055A] text-white px-3 py-1 rounded hover:bg-[#7a0448]"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma cotação encontrada.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cotacoes;
