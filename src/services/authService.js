const API_URL = "http://192.168.15.13:5000"; // Backend Flask rodando localmente

export const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login");
    }

    // Salvar o token JWT no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUsuarioLogado = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("⚠️ Token não encontrado!");
      return null;
    }

    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do token JWT
    console.log("🔹 Token decodificado:", decoded);

    return { 
      id: decoded.sub, // 🔥 Pegando o ID do usuário no campo 'sub'
      nome: decoded.nome, 
      cargo: decoded.cargo 
    };

  } catch (error) {
    console.error("❌ Erro ao obter usuário logado:", error);
    return null;
  }
};


