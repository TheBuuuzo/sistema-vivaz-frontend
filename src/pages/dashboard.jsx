import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificações, getUsuarioLogado } from "../services/dashboardService";

const Dashboard = () => {
  const [notificações, setNotificações] = useState([]);
  const usuario = getUsuarioLogado();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const notificacoesData = await getNotificações();
        setNotificações(notificacoesData.notificacoes || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* Barra Superior com Fundo Preto e Logo */}
      <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <img src="/logo2.png" alt="Logo do Condomínio" className="h-12" />
        <button onClick={handleLogout} className="bg-[#98055A] px-4 py-2 rounded hover:bg-[#7a0448] transition">
          Sair
        </button>
      </header>

      {/* Informações do Usuário (Alinhado à esquerda) */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-[#98055A]">
          Bem-vindo, {usuario?.nome} ({usuario?.cargo})
        </h2>
      </div>

      {/* Seções da Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Seção das Cotações (Sem listagem, apenas botão de acesso) */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#36B6BC] flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#98055A]">Cotações</h3>
          <button
            onClick={() => navigate("/cotacoes")}
            className="bg-[#36B6BC] text-white px-4 py-2 rounded hover:bg-[#2a9094] transition"
          >
            Ver Todas
          </button>
        </div>

        {/* Notificações */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#98055A]">
          <h3 className="text-xl font-bold text-[#98055A] mb-4">Notificações</h3>
          <ul className="space-y-2">
            {notificações.length > 0 ? (
              notificações.slice(0, 3).map((notificacao) => (
                <li key={notificacao.id} className="p-2 border-b text-gray-700" dangerouslySetInnerHTML={{ __html: notificacao.mensagem }}/>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma notificação.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Mostrar botão de cadastro se for Administrador */}
        {usuario?.cargo === "Admin" && (
          <button
            onClick={() => navigate("/cadastro")}
            className="bg-[#98055A] text-white px-4 py-2 rounded mt-4 hover:bg-[#7a0448] transition"
          >
            Gerenciar Usuários
          </button>
        )}

    </div>
  );
};

export default Dashboard;
