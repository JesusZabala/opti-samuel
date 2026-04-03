import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  
  data: {
    id: string | null;
    cliente: string;
    optometrista: string;
    fecha: string;
    hora: string;
    motivo: string;
  };
  setData: (data: any) => void;

  
  onSubmit: () => void;

  
  error?: string;
  isEdit?: boolean;

  
  horasPermitidas: string[];
  citas: Array<{ id: string | null; fecha: string; hora: string }>;
  optometristas: string[];

  
  onCancel?: () => void;
}


// export default function CitaForm({
//   data,
//   setData,
//   onSubmit,
//   error,
//   isEdit = false,
//   horasPermitidas,
//   citas,
//   optometristas,
//   onCancel
// }: Props) {
//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
    
//     <div className="mt-6 space-y-6">

//       {/* CLIENTE (bloqueado en editar) */}
//       <Input
//         value={data.cliente}
//         disabled={isEdit}
//       />

//       <div className="grid grid-cols-2 gap-6">

//         {/* OPTOMETRISTA */}
//         <select
//           value={data.optometrista}
//           onChange={(e) =>
//             setData({ ...data, optometrista: e.target.value })
//           }
//           className="p-4 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
//         >
//           <option value="">Seleccionar optometrista</option>
//           {optometristas && optometristas.map((o: any, i: number) => (
//           <option key={o.id || i} value={o.id}>
//             {/* Mostramos nombre y apellido, o el username si no hay nombre */}
//               {o.first_name || o.username} {o.last_name || ""}
//           </option>
//           ))}
//         </select>

//         {/* FECHA */}
//         <Input
//           type="date"
//           value={data.fecha}
//           min={new Date().toISOString().split("T")[0]}
//           onChange={(e) =>
//             setData({ ...data, fecha: e.target.value })
//           }
//         />

//         {/* HORA */}
//         <select
//           value={data.hora}
//           onChange={(e) =>
//             setData({ ...data, hora: e.target.value })
//           }
//           className="p-4 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
//         >
//           <option value="">Seleccionar hora</option>

//           {horasPermitidas.map((h, i) => {
//             // Lógica de disponibilidad de horas: se puede quitar para backend
//             // si el backend devuelve solo horas libres. En este modo local,
//             // se aplica filtros con citas cargadas.
//             const ocupada = citas.some(
//               (c) =>
//                 c.id !== data.id &&
//                 c.fecha === data.fecha &&
//                 c.hora === h
//             );

//             return (
//               <option key={i} value={h} disabled={ocupada}>
//                 {h} {ocupada ? "(Ocupada)" : ""}
//               </option>
//             );
//           })}
//         </select>

//       </div>

//       {/* MOTIVO */}
//       <textarea
//         value={data.motivo}
//         onChange={(e) =>
//           setData({ ...data, motivo: e.target.value })
//         }
//         className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
//         placeholder="Motivo de consulta"
//       />

//       {/* ERROR */}
//       {error && (
//         <p className="text-red-500 font-semibold">
//           {error}
//         </p>
//       )}

//       {/* BOTÓN */}
//       <div className="flex gap-4">
//         <Button
//           onClick={onSubmit}
//           className="bg-green-600"
//         >
//           {isEdit ? "Actualizar" : "Registrar"}
//         </Button>
//         {isEdit && (
//           <Button
//             variant="outline"
//             onClick={handleCancel}
//           >
//             Cancelar
//           </Button>
//         )}

//       </div>

//     </div>
//   );
// }

export default function CitaForm({
  data,
  setData,
  onSubmit,
  error,
  isEdit = false,
  horasPermitidas,
  citas,
  optometristas,
  onCancel
}: Props) {
  
  // Función para limitar el motivo a 250 caracteres
  const handleMotivoChange = (val: string) => {
    if (val.length <= 250) {
      setData({ ...data, motivo: val });
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* QUITAMOS EL INPUT DE CLIENTE QUE ESTABA AQUÍ */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* OPTOMETRISTA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Optometrista Asignado</label>
          <select
            value={data.optometrista}
            onChange={(e) => setData({ ...data, optometrista: e.target.value })}
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="">Seleccionar especialista...</option>
            {optometristas && optometristas.map((o: any, i: number) => (
              <option key={o.id || i} value={o.id}>
                {o.first_name || o.username} {o.last_name || ""}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Fecha de Cita</label>
          <Input
            type="date"
            value={data.fecha}
            min={new Date().toISOString().split("T")[0]} // No permite fechas pasadas
            onChange={(e) => setData({ ...data, fecha: e.target.value })}
            className="h-14 rounded-xl border-gray-200"
          />
        </div>

        {/* HORA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Horario Disponible</label>
          <select
            value={data.hora}
            onChange={(e) => setData({ ...data, hora: e.target.value })}
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="">Seleccionar hora...</option>
            {horasPermitidas.map((h, i) => {
              const ocupada = citas.some(
                (c) =>
                  c.id !== data.id &&
                  c.fecha === data.fecha &&
                  c.hora === h
              );

              return (
                <option key={i} value={h} disabled={ocupada}>
                  {h} {ocupada ? " (Ocupada)" : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* MOTIVO */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Motivo de Consulta</label>
            <span className="text-[10px] text-gray-300 font-bold">{data.motivo.length}/250</span>
          </div>
          <textarea
            value={data.motivo}
            onChange={(e) => handleMotivoChange(e.target.value)}
            rows={3}
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
            placeholder="Ej: Control anual, cambio de montura, irritación..."
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">
            Atención: {error}
          </p>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onSubmit}
          className="bg-[#1a4731] hover:bg-[#123122] h-14 flex-1 text-lg font-bold rounded-2xl shadow-lg"
        >
          {isEdit ? "Actualizar Cita" : "Confirmar Agenda"}
        </Button>
        {isEdit && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-14 flex-1 text-lg font-bold rounded-2xl border-gray-300"
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}