const API_URL = "http://192.168.15.13:5000"; // Backend rodando localmente
import fetchWithAuth from "./api"; 

// Puxar detalhes da cotação
export const getCotações = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/cotacoes`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

// Puxar notificações
export const getNotificações = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/notificacoes`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

// Puxar informações do usuário logado
export const getUsuarioLogado = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("⚠️ Token não encontrado!");
      return null;
    }

    console.log("🔹 Token obtido:", token); // Verifica se o token está sendo recuperado corretamente

    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodifica o token manualmente
    console.log("🔹 Token decodificado:", decoded);

    return { nome: decoded.nome, cargo: decoded.cargo };

  } catch (error) {
    console.error("❌ Erro ao obter usuário logado:", error);
    return null;
  }
};

// Puxar informações das propostas
export async function getPropostas(cotacaoId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://192.168.15.13:5000/propostas/${cotacaoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar propostas");
  }

  return await response.json();
}

// Cadastrar nova cotação
  export async function cadastrarCotacao(data) {
    const token = localStorage.getItem("token");
  
    const response = await fetch("http://192.168.15.13:5000/cotacao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao cadastrar cotação");
    }
  
    return response.json();
  }
  
// Excluir cotação
  export const excluirCotacao = async (cotacaoId) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`http://192.168.15.13:5000/cotacao/${cotacaoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao excluir cotação");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Erro ao excluir cotação:", error);
      throw error;
    }
  };
  
// Adicionar nova proposta
  export const adicionarProposta = async (proposta) => {
    const token = localStorage.getItem("token"); // Pegando o token salvo no login

    if (!token) {
        console.error("Token JWT não encontrado! Usuário precisa fazer login.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/propostas`, {  // Verifique se está chamando "/propostas"
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,  // Aqui o token precisa ser enviado!
            },
            body: JSON.stringify(proposta),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na requisição:", errorData);
            throw new Error(errorData.message || "Erro ao adicionar proposta");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
        throw error;
    }
};

// Excluir proposta
export const excluirProposta = async (propostaId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://192.168.15.13:5000/propostas/${propostaId}`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });
  if (!response.ok) {
      throw new Error("Erro ao excluir proposta");
  }
};

// Registrar um voto
export const registrarVoto = async (votoData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://192.168.15.13:5000/votacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(votoData),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar voto");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar voto:", error);
    throw error;
  }
};


// Listar votos de uma cotação
export const getVotacoes = async (cotacaoId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/votacoes/${cotacaoId}`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error("Erro ao buscar votações");
  }

  return await response.json();
};

//Excluir próprio voto
export const excluirVoto = async (votoId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://192.168.15.13:5000/votacao/${votoId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir voto");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao excluir voto:", error);
    throw error;
  }
};

// Finalizar cotas vencidas
export const finalizarCotasVencidas = async () => {
  try {
    const response = await fetchWithAuth("http://192.168.15.13:5000/finalizar_cotacoes", {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API:", errorData);
      throw new Error(errorData.error || "Erro ao finalizar cotações vencidas.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao finalizar cotações:", error);
    throw error;
  }
};

// Reabrir cotações
export const reabrirCotacao = async (cotacaoId) => {
  try {
    const response = await fetchWithAuth(`http://192.168.15.13:5000/reabrir_cotacao/${cotacaoId}`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API:", errorData);
      throw new Error(errorData.error || "Erro ao reabrir cotação.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao reabrir cotação:", error);
    throw error;
  }
};
