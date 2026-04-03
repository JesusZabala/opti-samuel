import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Citas() {
  return (
    <div className="p-10">

      <div className="bg-white rounded-[30px] shadow-xl p-10 border border-gray-100 max-w-3xl">

        <h2 className="text-3xl font-black text-[#1a4731] mb-8">
          Registrar Cita
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <Label>Cliente</Label>
            <Input placeholder="Nombre del cliente" />
          </div>

          <div>
            <Label>Fecha</Label>
            <Input type="date" />
          </div>

          <div>
            <Label>Hora</Label>
            <Input type="time" />
          </div>

          <div>
            <Label>Motivo</Label>
            <Input placeholder="Consulta visual" />
          </div>

        </div>

        <Button className="mt-8 bg-green-700 hover:bg-green-800">
          Guardar Cita
        </Button>

      </div>
    </div>
  );
}

export default Citas;