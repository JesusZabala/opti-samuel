import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Role } from '../types/roles';

import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Package,
  BarChart3,
  UserCog,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  UserCircle,
  Eye,
  ChevronDown,
} from 'lucide-react';

import { Badge } from '../components/ui/badge';

interface SidebarProps {
  role: Role;
  onLogout: () => void;
}

const menuClass = (isActive: boolean) => {
  return isActive
    ? 'flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold bg-white/20 text-white border-l-4 border-green-400 shadow-lg'
    : 'flex items-center gap-3 w-full p-4 rounded-xl transition-all font-bold text-white/70 hover:text-white hover:bg-white/10 border-l-4 border-transparent';
};

const itemClass = (isActive: boolean) => {
  return isActive
    ? 'text-left text-sm text-green-400 font-bold'
    : 'text-left text-sm text-white/60 hover:text-white';
};

const RecepcionMenu = ({ openMenu, setOpenMenu }: { openMenu: string | null; setOpenMenu: (menu: string | null) => void }) => {
  const location = useLocation();
  const path = location.pathname;
  const openClientes = path.startsWith('/clientes');
  const openCitas = path.startsWith('/citas');

  useEffect(() => {
    if (openClientes) setOpenMenu('clientes');
    else if (openCitas) setOpenMenu('citas');
  }, [location.pathname]);

  return (
    <nav className='flex-1 px-4 py-8 space-y-2 overflow-y-auto'>
      <NavLink to='/' end className={({ isActive }) => menuClass(isActive)}>
        <LayoutDashboard size={18} /> Inicio
      </NavLink>

      <div className='pt-4 space-y-1'>
        <p className='px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-2'>Recepción</p>

        <button
          onClick={() => setOpenMenu(openMenu === 'clientes' ? null : 'clientes')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openClientes ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Users size={18} /> Clientes
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'clientes' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'clientes' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/clientes/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Cliente
          </NavLink>
          <NavLink to='/clientes/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Cliente
          </NavLink>
          <NavLink to='/clientes/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Cliente
          </NavLink>
        </div>

        <button
          onClick={() => setOpenMenu(openMenu === 'citas' ? null : 'citas')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openCitas ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Calendar size={18} /> Citas
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'citas' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'citas' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/citas/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Cita
          </NavLink>
          <NavLink to='/citas/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Cita
          </NavLink>
          <NavLink to='/citas/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Cita
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const OptometristaMenu = ({ openMenu, setOpenMenu }: { openMenu: string | null; setOpenMenu: (menu: string | null) => void }) => {
  const location = useLocation();
  const path = location.pathname;

  const openCitas = path.startsWith('/citas');
  const openRecetas = path.startsWith('/recetas');
  const openPedidos = path.startsWith('/pedidos');

  useEffect(() => {
    if (openCitas) setOpenMenu('citas-opt');
    else if (openRecetas) setOpenMenu('recetas');
    else if (openPedidos) setOpenMenu('pedidos');
  }, [location.pathname]);

  return (
    <nav className='flex-1 px-4 py-8 space-y-2 overflow-y-auto'>
      <NavLink to='/' end className={({ isActive }) => menuClass(isActive)}>
        <LayoutDashboard size={18} /> Inicio
      </NavLink>

      <div className='pt-4 space-y-1'>
        <p className='px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-2'>Área Médica</p>

        <button
          onClick={() => setOpenMenu(openMenu === 'citas-opt' ? null : 'citas-opt')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openCitas ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Calendar size={18} /> Citas
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'citas-opt' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'citas-opt' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/citas/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Cita
          </NavLink>
          <NavLink to='/citas/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Cita
          </NavLink>
        </div>

        <button
          onClick={() => setOpenMenu(openMenu === 'recetas' ? null : 'recetas')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openRecetas ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <ClipboardList size={18} /> Recetas
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'recetas' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'recetas' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/recetas/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Receta
          </NavLink>
          <NavLink to='/recetas/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Receta
          </NavLink>
          <NavLink to='/recetas/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Receta
          </NavLink>
        </div>

        <button
          onClick={() => setOpenMenu(openMenu === 'pedidos' ? null : 'pedidos')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openPedidos ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Package size={18} /> Pedidos
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'pedidos' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'pedidos' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/pedidos/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Pedido
          </NavLink>
          <NavLink to='/pedidos/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Pedido
          </NavLink>
          <NavLink to='/pedidos/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Pedido
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const AdministradorMenu = ({ openMenu, setOpenMenu }: { openMenu: string | null; setOpenMenu: (menu: string | null) => void }) => {
  const location = useLocation();
  const path = location.pathname;

  const openClientes = path.startsWith('/clientes');
  const openCitas = path.startsWith('/citas');
  const openRecetas = path.startsWith('/recetas');
  const openPedidos = path.startsWith('/pedidos');
  const openEmpleados = path.startsWith('/empleados');

  useEffect(() => {
    if (openClientes) setOpenMenu('clientes');
    else if (openCitas) setOpenMenu('citas');
    else if (openRecetas) setOpenMenu('recetas');
    else if (openPedidos) setOpenMenu('pedidos');
    else if (openEmpleados) setOpenMenu('empleados');
  }, [location.pathname]);

  return (
    <nav className='flex-1 px-4 py-8 space-y-2 overflow-y-auto'>
      <NavLink to='/' end className={({ isActive }) => menuClass(isActive)}>
        <LayoutDashboard size={18} /> Inicio
      </NavLink>

      <div className='pt-4 space-y-1'>
        <p className='px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-2'>Recepción</p>

        <button
          onClick={() => setOpenMenu(openMenu === 'clientes' ? null : 'clientes')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openClientes ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Users size={18} /> Clientes
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'clientes' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'clientes' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/clientes/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Cliente
          </NavLink>
          <NavLink to='/clientes/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Cliente
          </NavLink>
          <NavLink to='/clientes/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Cliente
          </NavLink>
        </div>

        <button
          onClick={() => setOpenMenu(openMenu === 'citas' ? null : 'citas')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openCitas ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Calendar size={18} /> Citas
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'citas' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'citas' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/citas/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Cita
          </NavLink>
          <NavLink to='/citas/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Cita
          </NavLink>
          <NavLink to='/citas/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Cita
          </NavLink>
        </div>
      </div>

      <div className='pt-4 space-y-1'>
        <p className='px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-2'>Área Médica</p>

        <button
          onClick={() => setOpenMenu(openMenu === 'recetas' ? null : 'recetas')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openRecetas ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <ClipboardList size={18} /> Recetas
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'recetas' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'recetas' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/recetas/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Receta
          </NavLink>
          <NavLink to='/recetas/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Receta
          </NavLink>
          <NavLink to='/recetas/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Receta
          </NavLink>
        </div>

        <button
          onClick={() => setOpenMenu(openMenu === 'pedidos' ? null : 'pedidos')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openPedidos ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <Package size={18} /> Pedidos
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'pedidos' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'pedidos' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/pedidos/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Pedido
          </NavLink>
          <NavLink to='/pedidos/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Pedido
          </NavLink>
          <NavLink to='/pedidos/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Pedido
          </NavLink>
        </div>
      </div>

      <div className='pt-4 border-t border-white/5 mt-4 space-y-1'>
        <p className='px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-2'>Gerencia</p>

        <NavLink to='/reportes' className={({ isActive }) => menuClass(isActive)}>
          <BarChart3 size={18} /> Reportes
        </NavLink>

        <NavLink to='/auditoria' className={({ isActive }) => menuClass(isActive)}>
          <ShieldAlert size={18} /> Auditoría
        </NavLink>

        <button
          onClick={() => setOpenMenu(openMenu === 'empleados' ? null : 'empleados')}
          className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${
            openEmpleados ? 'bg-white/20 text-white border-l-4 border-green-400' : 'text-white/70 hover:bg-white/10'
          }`}>
          <div className='flex items-center gap-3'>
            <UserCog size={18} /> Empleados
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${openMenu === 'empleados' ? 'rotate-180' : ''}`} />
        </button>

        <div className={`ml-10 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'empleados' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <NavLink to='/empleados/registrar' className={({ isActive }) => itemClass(isActive)}>
            Registrar Empleado
          </NavLink>
          <NavLink to='/empleados/consultar' className={({ isActive }) => itemClass(isActive)}>
            Consultar Empleado
          </NavLink>
          <NavLink to='/empleados/editar' className={({ isActive }) => itemClass(isActive)}>
            Editar Empleado
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = ({ role, onLogout }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <aside className='w-80 bg-[#1a4731] h-screen flex flex-col sticky top-0 shadow-2xl z-20 border-r border-white/5'>
      <div className='p-10 flex flex-col items-center border-b border-white/10 bg-[#163d2a]'>
        <img src={logo} alt='Opti Samuel' className='w-44 mb-6' />
        <Badge className='flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider'>
          {role === Role.ADMINISTRADOR ? <ShieldCheck size={14} /> : role === Role.OPTOMETRISTA ? <Eye size={14} /> : <UserCircle size={14} />}
          {role}
        </Badge>
      </div>

      {role === Role.RECEPCIONISTA && <RecepcionMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />}
      {role === Role.OPTOMETRISTA && <OptometristaMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />}
      {role === Role.ADMINISTRADOR && <AdministradorMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />}

      <div className='p-6 border-t border-white/10'>
        <button onClick={onLogout} className='flex items-center justify-center gap-3 w-full p-4 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-2xl transition-all font-bold uppercase text-xs tracking-widest border border-red-500/20'>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
