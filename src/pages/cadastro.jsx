import { useState, useEffect } from "react";
import { getUsuarioLogado } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CadastrarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const navigate = useNavigate();

  const usuario = getUsuarioLogado();

  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://192.168.15.13:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("Usuarios:", data);
      setUsuarios(data);
    };

    useEffect(() => {
        fetchUsuarios();
  }, []);

  const handleCadastrar = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://192.168.15.13:5000/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome, email, senha, cargo, periodo_gestao: periodo
      })
    });
    const data = await response.json();
    alert(data.message);

    fetchUsuarios();
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
    setPeriodo("");

  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://192.168.15.13:5000/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        const data = await response.json();
        if (response.ok) {
        alert(data.message || "Usuário excluído com sucesso!");
        
        // Atualiza a lista de usuários (opcionalmente recarrega a página)
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } else {
        alert(data.message || "Erro ao excluir usuário.");
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir usuário.");
    }
    };

  const handleRedefinirSenha = async (id) => {
    const novaSenha = prompt("Digite a nova senha para este usuário:");
    if (!novaSenha) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://192.168.15.13:5000/users/${id}/reset_senha`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nova_senha: novaSenha })
        });
        const data = await response.json();
        if (response.ok) {
        alert(data.message || "Senha redefinida com sucesso!");
        } else {
        alert(data.message || "Erro ao redefinir senha.");
        }
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        alert("Erro ao redefinir senha.");
    }
    };

  if (usuario?.cargo !== "Admin") {
    return <p className="text-red-500">Apenas Administrador pode cadastrar usuários.</p>;
  }

 return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    {/* Barra superior */}
    <header className="bg-black text-white p-4 flex items-center shadow-md">
      <button onClick={() => navigate("/dashboard")} className="text-white hover:text-gray-400">
        <FaArrowLeft size={20} />
      </button>
    </header>

    {/* Container do conteúdo */}
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-bold">Cadastrar Novo Usuário</h2>

      <div className="flex flex-col space-y-4">
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 rounded"/>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded"/>
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="border p-2 rounded"/>
        
        <select value={cargo} onChange={(e) => setCargo(e.target.value)} className="border p-2 rounded">
          <option value="">Selecione Cargo</option>
          <option value="Síndico">Síndico</option>
          <option value="Conselho">Conselho</option>
          <option value="Administrador">Administrador</option>
        </select>

        <input placeholder="Período de Gestão" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="border p-2 rounded"/>

        <button onClick={handleCadastrar} className="bg-green-600 text-white px-4 py-2 rounded">
          Cadastrar Usuário
        </button>
      </div>
    </div>

    <div className="p-6">
        <h2 className="text-2xl mb-4 font-bold">Usuários do Sistema</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Período</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
            <tbody>
                {usuarios.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-4 py-2">{u.nome}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.cargo}</td>
                <td className="px-4 py-2">{u.periodo_gestao}</td>
                <td className="px-4 py-2 flex justify-center items-center space-x-2">
                  <button onClick={() => handleExcluir(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                  <button onClick={() => handleRedefinirSenha(u.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Redefinir</button>
                </td>
              </tr>
            ))}
            </tbody>
        </table>
    </div>
    

    
  </div>
);

};

export default CadastrarUsuario;
