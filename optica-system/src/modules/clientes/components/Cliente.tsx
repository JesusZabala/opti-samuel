import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";





function Cliente() {
  return (
    <div className="p-10">

      <div className="bg-white rounded-[30px] shadow-xl p-10 border border-gray-100 max-w-3xl">

        <h2 className="text-3xl font-black text-[#1a4731] mb-8">
          Registrar Cliente
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <Label>Nombre</Label>
            <Input placeholder="Nombre del cliente" />
          </div>

          <div>
            <Label>Apellido</Label>
            <Input placeholder="Apellido del cliente" />
          </div>

          <div>
            <Label>Cédula</Label>
            <Input placeholder="Ej: 12345678" />
          </div>

          <div>
            <Label>Teléfono</Label>
            <Input placeholder="0414xxxxxxx" />
          </div>

          <div>
            <Label>Correo</Label>
            <Input placeholder="correo@email.com" />
          </div>

          <div>
            <Label>Dirección</Label>
            <Input placeholder="Dirección del cliente" />
          </div>

        </div>

        <Button className="mt-8 bg-green-700 hover:bg-green-800 text-white font-bold">
          Guardar Cliente
        </Button>

      </div>

    </div>
  );
}

export default Cliente;