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
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12">
      {loading && <Loader />}

      <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-lg w-full sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4">
        <div className="mb-5 text-center">
          <h2 className="text-3xl font-semibold text-black">Iniciar sesión</h2>
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={userLogin.email}
            onChange={(e) =>
              setUserLogin({ ...userLogin, email: e.target.value })
            }
            className="bg-gray-100 border border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-black"
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
            className="bg-gray-100 border border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={userLoginFunction}
            className="w-full bg-black text-white py-3 font-semibold rounded-md hover:bg-gray-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-700">
            ¿No tienes cuenta?{" "}
            <Link className="text-black font-semibold" to={"/signup"}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
