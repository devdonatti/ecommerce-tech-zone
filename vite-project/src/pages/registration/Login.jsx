import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  const userLoginFunction = async () => {
    // Validación
    if (userLogin.email === "" || userLogin.password === "") {
      toast.error("Todos los campos son requeridos");
      return;
    }

    setLoading(true);

    try {
      const users = await signInWithEmailAndPassword(
        auth,
        userLogin.email,
        userLogin.password
      );

      const q = query(
        collection(fireDB, "user"),
        where("uid", "==", users.user.uid)
      );

      const querySnapshot = await getDocs(q);
      let user;

      querySnapshot.forEach((doc) => {
        user = doc.data();
      });

      if (user) {
        localStorage.setItem("users", JSON.stringify(user));
        setUserLogin({ email: "", password: "" });
        toast.success("Bienvenido/a");
        setLoading(false);
        navigate(user.role === "user" ? "/" : "/admin-dashboard");
      } else {
        toast.error("Usuario no encontrado");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111] px-4">
      {loading && <Loader />}

      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md w-full sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#ccc]">Iniciar sesión</h2>
          <p className="text-sm text-[#888] mt-1">Accedé a tu cuenta</p>
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={userLogin.email}
            onChange={(e) =>
              setUserLogin({ ...userLogin, email: e.target.value })
            }
            className="bg-[#1a1a1a] text-[#ccc] border border-[#333] px-4 py-2 w-full rounded-md outline-none placeholder-[#666] focus:ring-2 focus:ring-[#444]"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Contraseña"
            value={userLogin.password}
            onChange={(e) =>
              setUserLogin({ ...userLogin, password: e.target.value })
            }
            className="bg-[#1a1a1a] text-[#ccc] border border-[#333] px-4 py-2 w-full rounded-md outline-none placeholder-[#666] focus:ring-2 focus:ring-[#444]"
          />
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={userLoginFunction}
            className="w-full bg-[#333] text-[#eee] py-3 font-semibold rounded-md hover:bg-[#444] transition-colors"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="text-center text-sm">
          <p className="text-[#999]">
            ¿No tienes cuenta?{" "}
            <Link
              className="text-[#ccc] font-medium hover:underline"
              to={"/signup"}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
