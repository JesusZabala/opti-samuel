import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auditoria() {

  /* ---------------- ESTADOS ---------------- */

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuario, setUsuario] = useState("");
  const [accion, setAccion] = useState("");
  const [modulo, setModulo] = useState("");

  /* ---------------- BUSCAR ---------------- */

  const handleBuscar = () => {

    const filtros = {
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      usuario,
      accion,
      modulo
    };

    console.log("FILTROS AUDITORÍA:", filtros);

    // AQUÍ TU COMPAÑERO CONECTA EL BACKEND
  };

  /* ---------------- LIMPIAR ---------------- */

  const handleLimpiar = () => {
    setFechaDesde("");
    setFechaHasta("");
    setUsuario("");
    setAccion("");
    setModulo("");
  };

  return (

    <div className="p-10 bg-[#f5f7fb] min-h-screen">

      {/* CONTENEDOR PRINCIPAL */}

      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>
            <h1 className="text-4xl font-black text-[#1a4731]">
              Auditoría del Sistema
            </h1>

            <p className="text-gray-500 mt-2">
              Consulta movimientos, acciones y cambios realizados por usuarios.
            </p>
          </div>

        </div>

        {/* FILTROS */}

        <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-[#1a4731] mb-8">
            Filtros de Búsqueda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* FECHA DESDE */}

            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-600">
                Fecha Desde
              </label>

              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="h-12 rounded-xl"
              />

            </div>

            {/* FECHA HASTA */}

            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-600">
                Fecha Hasta
              </label>

              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="h-12 rounded-xl"
              />

            </div>

            {/* USUARIO */}

            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-600">
                Usuario
              </label>

              <select
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar usuario</option>
              </select>

            </div>

            {/* ACCIÓN */}

            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-600">
                Acción
              </label>

              <select
                value={accion}
                onChange={(e) => setAccion(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas</option>
                <option value="C">Create</option>
                <option value="U">Update</option>
                <option value="D">Delete</option>
              </select>

            </div>

            {/* MÓDULO */}

            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-600">
                Módulo
              </label>

              <Input
                placeholder="Ej: Cliente, Cita, Pedido..."
                value={modulo}
                onChange={(e) => setModulo(e.target.value)}
                className="h-12 rounded-xl"
              />

            </div>

          </div>

          {/* BOTONES */}

          <div className="flex flex-wrap gap-4 mt-8">

            <Button
              onClick={handleBuscar}
              className="bg-[#1a4731] hover:bg-[#256046] text-white px-8 h-12 rounded-xl"
            >
              Buscar Auditoría
            </Button>

            <Button
              variant="outline"
              onClick={handleLimpiar}
              className="h-12 rounded-xl"
            >
              Limpiar Filtros
            </Button>

          </div>

        </div>

        {/* TABLA */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-[#1a4731]">
              Resultados de Auditoría
            </h2>

          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">

            <table className="w-full">

              <thead className="bg-[#1a4731] text-white">

                <tr>

                  <th className="text-left px-6 py-4 font-semibold">
                    Usuario
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Acción
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Módulo
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Fecha
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Objeto Anterior
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Objeto Nuevo
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* 
                  AQUÍ EL BACKEND HARÁ EL MAP DE LOS DATOS
                */}

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-16 text-gray-400"
                  >
                    No hay datos cargados actualmente
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}