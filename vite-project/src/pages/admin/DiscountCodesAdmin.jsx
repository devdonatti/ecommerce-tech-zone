import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const DiscountCodesAdmin = () => {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    active: true,
    expiresAt: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar códigos al montar
  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const colRef = collection(fireDB, "discountCodes");
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCodes(list);
    } catch (error) {
      toast.error("Error al cargar códigos");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount || !form.expiresAt) {
      return toast.error("Completa todos los campos");
    }

    try {
      if (editingId) {
        // Actualizar código existente
        const docRef = doc(fireDB, "discountCodes", editingId);
        await updateDoc(docRef, {
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          active: form.active,
          expiresAt: form.expiresAt,
        });
        toast.success("Código actualizado");
      } else {
        // Agregar nuevo código
        await addDoc(collection(fireDB, "discountCodes"), {
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          active: form.active,
          expiresAt: form.expiresAt,
        });
        toast.success("Código agregado");
      }
      setForm({ code: "", discount: "", active: true, expiresAt: "" });
      setEditingId(null);
      fetchCodes();
    } catch (error) {
      toast.error("Error al guardar código");
    }
  };

  const handleEdit = (code) => {
    setEditingId(code.id);
    setForm({
      code: code.code,
      discount: code.discount,
      active: code.active,
      expiresAt: code.expiresAt,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este código?")) return;
    try {
      await deleteDoc(doc(fireDB, "discountCodes", id));
      toast.success("Código eliminado");
      fetchCodes();
    } catch {
      toast.error("Error al eliminar código");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Códigos de descuento</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          name="code"
          placeholder="Código (ej: BLACKFRIDAY)"
          value={form.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Descuento (%)"
          value={form.discount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min={1}
          max={100}
          required
        />
        <input
          type="date"
          name="expiresAt"
          value={form.expiresAt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          Activo
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Actualizar código" : "Agregar código"}
        </button>
      </form>

      <ul className="space-y-2">
        {codes.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <strong>{c.code}</strong> - {c.discount}% - Vence: {c.expiresAt} -{" "}
              {c.active ? "Activo" : "Inactivo"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="text-yellow-600 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscountCodesAdmin;
