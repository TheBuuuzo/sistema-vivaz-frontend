import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  console.log("Usuario logado:", usuarioLogado);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://192.168.15.13:5000/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      console.log("Usuarios:", data);
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  if (usuarioLogado?.cargo.toLowerCase() !== "admin") {
    console.log("Bloqueado! Cargo:", usuarioLogado?.cargo);
    return <p className="text-red-500">Apenas Administrador pode ver esta página.</p>;
  }

  console.log("Renderizou!");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate("/dashboard")} className="text-white hover:text-gray-400">
          <FaArrowLeft size={20} />
        </button>
      </header>

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
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleExcluir(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                  <button onClick={() => handleRedefinirSenha(u.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Redefinir Senha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
