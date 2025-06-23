/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const Signup = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // navigate
  const navigate = useNavigate();

  // User Signup State
  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  /**========================================================================
   *                          User Signup Function
   *========================================================================**/

  const userSignupFunction = async () => {
    // validation
    if (
      userSignup.name === "" ||
      userSignup.email === "" ||
      userSignup.password === ""
    ) {
      toast.error("Todos los campos son requeridos");
    }

    setLoading(true);
    try {
      const users = await createUserWithEmailAndPassword(
        auth,
        userSignup.email,
        userSignup.password
      );

      // create user object
      const user = {
        name: userSignup.name,
        email: users.user.email,
        uid: users.user.uid,
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      // create user Reference
      const userRefrence = collection(fireDB, "user");

      // Add User Detail
      addDoc(userRefrence, user);

      setUserSignup({
        name: "",
        email: "",
        password: "",
      });

      toast.success("Registro exitoso");

      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111] px-4">
      {loading && <Loader />}

      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md w-full sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#ccc]">Registro</h2>
          <p className="text-sm text-[#888] mt-1">Crea tu cuenta</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={userSignup.name}
            onChange={(e) =>
              setUserSignup({ ...userSignup, name: e.target.value })
            }
            className="bg-[#1a1a1a] text-[#ccc] border border-[#333] px-4 py-2 w-full rounded-md outline-none placeholder-[#666] focus:ring-2 focus:ring-[#444]"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={userSignup.email}
            onChange={(e) =>
              setUserSignup({ ...userSignup, email: e.target.value })
            }
            className="bg-[#1a1a1a] text-[#ccc] border border-[#333] px-4 py-2 w-full rounded-md outline-none placeholder-[#666] focus:ring-2 focus:ring-[#444]"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Contraseña"
            value={userSignup.password}
            onChange={(e) =>
              setUserSignup({ ...userSignup, password: e.target.value })
            }
            className="bg-[#1a1a1a] text-[#ccc] border border-[#333] px-4 py-2 w-full rounded-md outline-none placeholder-[#666] focus:ring-2 focus:ring-[#444]"
          />
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={userSignupFunction}
            className="w-full bg-[#333] text-[#eee] py-3 font-semibold rounded-md hover:bg-[#444] transition-colors"
          >
            Registrarme
          </button>
        </div>

        <div className="text-center text-sm">
          <p className="text-[#999]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              className="text-[#ccc] font-medium hover:underline"
              to="/login"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
