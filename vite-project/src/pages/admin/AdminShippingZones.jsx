import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

export default function AdminShippingCosts() {
  // Estados para cada zona
  const [capitalPrice, setCapitalPrice] = useState("");
  const [gbaRanges, setGbaRanges] = useState("");
  const [gbaFranja1, setGbaFranja1] = useState("");
  const [gbaFranja2, setGbaFranja2] = useState("");
  const [gbaFranja3, setGbaFranja3] = useState("");
  const [interiorPrice, setInteriorPrice] = useState("");

  // Cargar datos desde Firestore al montar
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(fireDB, "shippingZones", "zones");
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      // Capital
      if (data.CABA) {
        setCapitalPrice(data.CABA.franja1 ?? data.CABA.price ?? "");
      }
      // GBA
      if (data.GBA) {
        setGbaRanges(
          Array.isArray(data.GBA.rangos) ? data.GBA.rangos.join(", ") : ""
        );
        setGbaFranja1(data.GBA.franja1 ?? "");
        setGbaFranja2(data.GBA.franja2 ?? "");
        setGbaFranja3(data.GBA.franja3 ?? "");
      }
      // Interior
      if (data.Interior) {
        setInteriorPrice(data.Interior.franja1 ?? data.Interior.price ?? "");
      }
    };
    fetchData();
  }, []);

  // Guardar cambios
  const saveChanges = async () => {
    const docRef = doc(fireDB, "shippingZones", "zones");
    const parsedRanges = gbaRanges
      ? gbaRanges.split(",").map((n) => Number(n.trim()))
      : [];
    const updateData = {
      "CABA.franja1": Number(capitalPrice),
      "GBA.franja1": Number(gbaFranja1),
      "GBA.franja2": Number(gbaFranja2),
      "GBA.franja3": Number(gbaFranja3),
      "GBA.rangos": parsedRanges,
      "Interior.franja1": Number(interiorPrice),
    };
    await updateDoc(docRef, updateData);
    toast.success("Costos de envío actualizados");
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Configurar costos de envío
      </h1>

      {/* Capital Federal */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Capital Federal
        </h2>
        <label className="block text-sm text-gray-600 mb-1">
          Precio único de envío
        </label>
        <input
          type="number"
          value={capitalPrice}
          onChange={(e) => setCapitalPrice(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="Ej.: 2500"
        />
      </div>

      {/* Gran Buenos Aires */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Gran Buenos Aires (3 cordones)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Límites de los cordones (Ej.: 0,2000,3000)
            </label>
            <input
              type="text"
              value={gbaRanges}
              onChange={(e) => setGbaRanges(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="0,2000,3000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Precio primer cordón
            </label>
            <input
              type="number"
              value={gbaFranja1}
              onChange={(e) => setGbaFranja1(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Ej.: 3000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Precio segundo cordón
            </label>
            <input
              type="number"
              value={gbaFranja2}
              onChange={(e) => setGbaFranja2(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Ej.: 5000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Precio tercer cordón
            </label>
            <input
              type="number"
              value={gbaFranja3}
              onChange={(e) => setGbaFranja3(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Ej.: 8000"
            />
          </div>
        </div>
      </div>

      {/* Interior */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Interior del país
        </h2>
        <label className="block text-sm text-gray-600 mb-1">
          Precio único de envío
        </label>
        <input
          type="number"
          value={interiorPrice}
          onChange={(e) => setInteriorPrice(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="Ej.: 6500"
        />
      </div>

      {/* Botón para guardar */}
      <button
        onClick={saveChanges}
        className="px-5 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
      >
        Guardar cambios
      </button>
    </div>
  );
}
