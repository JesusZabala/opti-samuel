import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Pedidos() {
  return (
    <div className="p-10">

      <div className="bg-white rounded-[30px] shadow-xl p-10 border border-gray-100 max-w-3xl">

        <h2 className="text-3xl font-black text-[#1a4731] mb-8">
          Registrar Pedido
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <Label>Cliente</Label>
            <Input placeholder="Nombre del cliente" />
          </div>

          <div>
            <Label>Tipo de lente</Label>
            <Input placeholder="Lentes de contacto / Gafas" />
          </div>

          <div>
            <Label>Fecha pedido</Label>
            <Input type="date" />
          </div>

          <div>
            <Label>Estado</Label>
            <Input placeholder="Pendiente / En proceso / Entregado" />
          </div>

        </div>

        <Button className="mt-8 bg-green-700 hover:bg-green-800">
          Guardar Pedido
        </Button>

      </div>
    </div>
  );
}

export default Pedidos;