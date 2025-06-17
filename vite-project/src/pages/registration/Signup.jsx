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
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-12">
      {loading && <Loader />}
      {/* Signup Form  */}
      <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-lg w-full sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4">
        {/* Top Heading  */}
        <div className="mb-5 text-center">
          <h2 className="text-3xl font-semibold text-black">Registro</h2>
        </div>

        {/* Input One (Name) */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={userSignup.name}
            onChange={(e) => {
              setUserSignup({
                ...userSignup,
                name: e.target.value,
              });
            }}
            className="bg-gray-100 border border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Input Two (Email) */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={userSignup.email}
            onChange={(e) => {
              setUserSignup({
                ...userSignup,
                email: e.target.value,
              });
            }}
            className="bg-gray-100 border border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Input Three (Password) */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Contraseña"
            value={userSignup.password}
            onChange={(e) => {
              setUserSignup({
                ...userSignup,
                password: e.target.value,
              });
            }}
            className="bg-gray-100 border border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Signup Button  */}
        <div className="mb-6">
          <button
            type="button"
            onClick={userSignupFunction}
            className="w-full bg-black text-white py-3 font-semibold rounded-md hover:bg-gray-700 transition-colors"
          >
            Registrarme
          </button>
        </div>

        {/* Already have an account */}
        <div className="text-center">
          <p className="text-gray-700">
            ¿Ya tienes una cuenta?{" "}
            <Link className="text-black font-semibold" to="/login">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
