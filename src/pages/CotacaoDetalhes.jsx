import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropostas, adicionarProposta, registrarVoto, getVotacoes, excluirProposta, excluirCotacao } from "../services/dashboardService";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { getUsuarioLogado } from "../services/authService";
import { excluirVoto } from "../services/dashboardService";
import { reabrirCotacao } from "../services/dashboardService";

const CotacaoDetalhes = () => {
  const { cotacaoId } = useParams();
  const [propostas, setPropostas] = useState([]);
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoFornecedor, setNovoFornecedor] = useState("");
  const [novoItem, setNovoItem] = useState(""); // Novo campo
  const [novoValor, setNovoValor] = useState("");
  const [novoPrazoEntrega, setNovoPrazoEntrega] = useState(""); // Novo campo
  const [novoLink, setNovoLink] = useState(""); // Novo campo
  const [novasObservacoes, setNovasObservacoes] = useState(""); // Novo campo
  const [votacoes, setVotacoes] = useState([]);
  const [votos, setVotos] = useState({});
  const [justificativas, setJustificativas] = useState({}); 
  const [jaVotou, setJaVotou] = useState(false);
  const [cotacao, setCotacao] = useState({});
  const [prazoVotacao, setPrazoVotacao] = useState("")
  const navigate = useNavigate();
  const menorValor = Math.min(...propostas.map(proposta => proposta.valor));
  const [usuario, setUsuario] = useState(null);

  //useEffect 01
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUsuarioLogado();
        console.log("Usuário carregado:", user);
        if (!user) {
          console.error("Usuário não carregado corretamente");
          return;
        }
        setUsuario(user);
  
        // 🔹 Buscar propostas
        const data = await getPropostas(cotacaoId);
        setPropostas(data.propostas || []);
  
        // 🔹 Buscar votações
        const votacoesData = await getVotacoes(cotacaoId);
        setVotacoes(votacoesData.votacoes || []);
  
        // 🔹 Verificar se o usuário já votou
        const usuarioJaVotou = votacoesData.votacoes.some(
          voto => String(voto.usuario_id) === String(user.id)
        );
        setJaVotou(usuarioJaVotou);
  
        // 🔹 Buscar detalhes da cotação, incluindo o prazo
        const response = await fetch(`http://192.168.15.13:5000/cotacao/${cotacaoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
  
        const cotacaoData = await response.json();
        console.log("🔹 Dados da cotação recebidos:", cotacaoData);
        setCotacao(cotacaoData);

        if (cotacaoData.prazo_votacao) {
          setPrazoVotacao(cotacaoData.prazo_votacao);
        } else {
          console.warn("⚠️ Nenhum prazo de cotação encontrado.");
        }
  
      } catch (error) {
        console.error("Erro ao buscar propostas, votações e cotação:", error);
        setError("Erro ao carregar os dados.");
      }
    }
    fetchData();
  }, [cotacaoId]);
  
  
  
  // Novo useEffect para verificar se o usuário já votou
  useEffect(() => {
    if (usuario && votacoes.length > 0) {
      const usuarioJaVotou = votacoes.some(voto => String(voto.usuario_id) === String(usuario.id));
      setJaVotou(usuarioJaVotou);
    }
  }, [usuario, votacoes]);
  
   

  // Função para atualizar os estados do voto separadamente
      const handleVotoChange = (propostaId, valor) => {
        setVotos((prev) => ({
          ...prev,
          [propostaId]: valor, // Define o voto específico da proposta
        }));
      };
      
      const handleJustificativaChange = (propostaId, valor) => {
        setJustificativas((prev) => ({
          ...prev,
          [propostaId]: valor, // Define a justificativa específica da proposta
        }));
      };
  

  // Função para adicionar uma nova proposta
  const handleAdicionarProposta = async () => {
    if (!novoFornecedor || !novoItem || !novoValor || isNaN(parseFloat(novoValor))) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const novaProposta = {
      cotacao_id: parseInt(cotacaoId),
      fornecedor_id: novoFornecedor,
      item: novoItem, // Novo campo
      valor: parseFloat(novoValor),
      prazo_entrega: novoPrazoEntrega, // Novo campo
      link: novoLink, // Novo campo
      observacoes: novasObservacoes // Novo campo
    };

    try {
      await adicionarProposta(novaProposta);
      alert("Proposta adicionada com sucesso!");
      setModalAberto(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar proposta:", error);
      alert("Erro ao adicionar proposta.");
    }
  };

  // Função para excluir cotação (somente síndico pode excluir)
  const handleExcluirCotacao = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta cotação?")) {
      try {
        await excluirCotacao(parseInt(cotacaoId));
        alert("Cotação excluída com sucesso!");
        navigate("/cotacoes");
      } catch (error) {
        console.error("Erro ao excluir cotação:", error);
        alert("Erro ao excluir cotação.");
      }
    }
  };

  // Função para excluir proposta individual (somente síndico)
  const handleExcluirProposta = async (propostaId) => {
    if (window.confirm("Tem certeza que deseja excluir esta proposta?")) {
        try {
            await excluirProposta(propostaId);
            alert("Proposta excluída com sucesso!");
            setPropostas((prevPropostas) => prevPropostas.filter((p) => p.id !== propostaId)); // Atualiza localmente
        } catch (error) {
            console.error("Erro ao excluir proposta:", error);
            alert("Erro ao excluir proposta.");
        }
    }
};

//Função para votar (apenas conselho)
const handleVotar = async (propostaId) => {
  if (!votos[propostaId]) {
    alert("Escolha uma opção para votar.");
    return;
  }

  const votoData = {
    cotacao_id: parseInt(cotacaoId),
    proposta_id: propostaId,
    voto: votos[propostaId], 
    justificativa: justificativas[propostaId] || "",
  };

  try {
    await registrarVoto(votoData);
    alert("Voto registrado com sucesso!");

    // Atualizar lista de votos antes de verificar se o usuário já votou
    const votacoesAtualizadas = await getVotacoes(cotacaoId);
    setVotacoes(votacoesAtualizadas.votacoes || []);

    console.log("Votos atualizados:", votacoesAtualizadas.votacoes);

    // Verificar se o usuário já votou
    const usuarioJaVotou = votacoesAtualizadas.votacoes.some(voto => String(voto.usuario_id) === String(usuario.id));
    setJaVotou(usuarioJaVotou);

  } catch (error) {
    console.error("Erro ao registrar voto:", error);
    alert("Erro ao registrar voto.");
  }
};

  // Função para deletar próprio voto
  const handleExcluirVoto = async (votoId) => {
    if (window.confirm("Tem certeza que deseja excluir seu voto?")) {
        try {
            await excluirVoto(votoId);
            alert("Voto excluído com sucesso!");

            // Atualiza a lista de votos localmente
            setVotacoes((prevVotacoes) => prevVotacoes.filter((voto) => voto.id !== votoId));

            // Verifica se ainda existe algum voto do usuário
            const votosRestantes = votacoes.filter((voto) => voto.usuario_id === usuario.id);
            setJaVotou(votosRestantes.length > 0); // Atualiza o estado corretamente

        } catch (error) {
            console.error("Erro ao excluir voto:", error);
            alert("Erro ao excluir voto.");
        }
    }
  };

  // Função para reabrir cotação
const handleReabrirCotacao = async () => {
  if (window.confirm("Tem certeza que deseja reabrir esta cotação?")) {
    try {
      await reabrirCotacao(cotacao.id);
      alert("Cotação reaberta com sucesso!");
      window.location.reload();
    } catch (error) {
      alert("Erro ao reabrir cotação.");
    }
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra superior com fundo preto e botão de voltar */}
      <header className="bg-black text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate("/cotacoes")} className="text-white hover:text-gray-400">
          <FaArrowLeft size={20} />
        </button>
        {/* <h2 className="text-xl font-bold ml-4">Detalhes da Cotação</h2> */}
      </header>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-[#98055A] mb-4">{cotacao.descricao}</h2>

      {/* Exibir prazo de votação */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
      {prazoVotacao ? (
        <p className="text-sm font-semibold text-gray-700">
          Prazo para votação: <span className="text-red-600">{prazoVotacao}</span>
        </p>
      ) : (
        <p className="text-sm font-semibold text-gray-700">Prazo não definido</p>
      )}
    </div>


 
        {/* Mensagem de erro se houver */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Lista de Propostas */}
        <div className="bg-white p-6 rounded-lg shadow">
          {propostas.length > 0 ? (
            <ul className="space-y-2">
              {propostas.map((proposta) => (
                <li key={proposta.id} className={`p-2 border-b flex justify-between items-center$`}>
                  <div>
                    <p className="font-medium">Fornecedor: {proposta.fornecedor_id}</p>
                    <p>Item: {proposta.item}</p>
                    <p>Valor: R$ {proposta.valor.toFixed(2)} 
                              {/* ENCONTRAR O MENOR VALOR */}
                              {proposta.valor === menorValor && (
                                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                                  Menor Preço
                                </span>
                              )}
                      </p>
                    <p>Prazo de Entrega: {proposta.prazo_entrega}</p>
                    <p>
                      Link:{" "}
                      {proposta.link ? (
                        <a href={proposta.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {proposta.link}
                        </a>
                      ) : (
                        "Nenhum link informado"
                      )}
                    </p>
                    <p>Observações: {proposta.observacoes || "Nenhuma observação informada."}</p>
                  </div>

                    {/* Interface de Votação - Apenas para Conselheiros que ainda não votaram */}
                    {usuario?.cargo === "Conselho" && !jaVotou && (
                      <div className="mt-4 bg-gray-50 p-4 rounded">
                        <p className="font-semibold">Votar nesta proposta:</p>
                        <select
                          value={votos[proposta.id] || ""}
                          onChange={(e) => handleVotoChange(proposta.id, e.target.value)}
                          className="border p-2 rounded w-full mt-2"
                        >
                          <option value="">Selecione um voto</option>
                          <option value="Aprovar">Aprovar</option>
                          <option value="Rejeitar">Rejeitar</option>
                        </select>
                        <textarea
                          placeholder="Justificativa (Opcional)"
                          className="border p-2 rounded w-full mt-2"
                          value={justificativas[proposta.id] || ""}
                          onChange={(e) => handleJustificativaChange(proposta.id, e.target.value)}
                        />
                        <button
                          onClick={() => handleVotar(proposta.id)}
                          className="bg-[#36B6BC] text-white px-4 py-2 rounded hover:bg-[#2a9094] transition mt-2"
                        >
                          Registrar Voto
                        </button>
                      </div>
                    )}

                    {/* Caso o usuário já tenha votado, exibir mensagem */}
                    {usuario?.cargo === "Conselho" && jaVotou && (
                      <p className="text-gray-600 mt-2">Você já votou nesta cotação.</p>
                    )}

                  {/* Exibir botão de excluir proposta para o síndico */}
                  {usuario?.cargo === "Síndico" && (
                  <button
                    onClick={() => handleExcluirProposta(proposta.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 flex items-center mt-2"
                  >
                  <FaTrash className="mr-2" /> Excluir
                  </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma proposta encontrada.</p>
          )}
        </div>

        {/* Lista de votos */}
        <h3 className="text-xl font-semibold text-[#98055A] mt-6">Votos Registrados</h3>
        <ul className="bg-white p-4 rounded-lg shadow mt-4">
          {usuario && votacoes.length > 0 && votacoes.map((voto) => {
            console.log("Usuário logado:", usuario?.id, "ID do voto:", voto.usuario_id);

            return (
              <li key={voto.id} className="p-2 border-b flex justify-between items-center">
                <div>
                  <p><strong>Usuário:</strong> {voto.nome_usuario}</p>
                  <p><strong>Fornecedor:</strong> {voto.fornecedor}</p>
                  <p><strong>Item:</strong> {voto.item}</p>
                  <p><strong>Voto:</strong> {voto.voto}</p>
                  <p><strong>Justificativa:</strong> {voto.justificativa || "Sem justificativa"}</p>
                </div>

                {/* Exibir botão de excluir apenas se `usuario` não for undefined */}
                {usuario?.id && String(usuario.id) === String(voto.usuario_id) && (
                  <button
                    onClick={() => handleExcluirVoto(voto.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 flex items-center mt-2"
                  >
                    <FaTrash className="mr-2" /> Excluir Voto
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* Botão de reabrir cotação (aparece apenas para o síndico e se a cotação estiver finalizada) */}
        {usuario?.cargo === "Síndico" && cotacao?.status === "Finalizada" && (
          <div className="mt-6">
            <button
              onClick={handleReabrirCotacao}
              className="btn-padrao btn-reabrir"
            >
            Reabrir Cotação
            </button>
          </div>
        )}        

        {/* Botão de adicionar nova proposta (aparece apenas para o síndico) */}
        {usuario?.cargo === "Síndico" && (
          <div className="mt-2">
            <button
              onClick={() => setModalAberto(true)}
              className="btn-padrao btn-primario"
            >
              Adicionar Proposta
            </button>
          </div>
        )}

        {/* Botão de excluir cotação (aparece apenas para o síndico) */}
        {usuario?.cargo === "Síndico" && (
          <div className="mt-2">
            <button
              onClick={handleExcluirCotacao}
              className="btn-padrao btn-secundario"
            >
              <FaTrash className="mr-2"/> Excluir Cotação
            </button>
          </div>
        )},
        </div>

      {/* Modal para adicionar proposta */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-[#98055A]">Nova Proposta</h3>
            <input
              type="text"
              placeholder="Nome do Fornecedor"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novoFornecedor}
              onChange={(e) => setNovoFornecedor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Item"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
            />
            <input
              type="number"
              placeholder="Valor (R$)"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Prazo de Entrega"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novoPrazoEntrega}
              onChange={(e) => setNovoPrazoEntrega(e.target.value)}
            />
            <input
              type="url"
              placeholder="Link do Produto (Opcional)"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novoLink}
              onChange={(e) => setNovoLink(e.target.value)}
            />
            <textarea
              placeholder="Observações (Opcional)"
              className="border px-3 py-2 rounded mt-2 w-full"
              value={novasObservacoes}
              onChange={(e) => setNovasObservacoes(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setModalAberto(false)} className="mr-2 text-gray-600">
                Cancelar
              </button>
              <button onClick={handleAdicionarProposta} className="bg-[#36B6BC] text-white px-4 py-2 rounded hover:bg-[#2a9094]">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotacaoDetalhes;
