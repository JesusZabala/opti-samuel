import { Role } from "../types/roles";

export interface MenuItem {
  name: string;
  path: string;
  roles: Role[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Clientes",
    path: "/clientes",
    roles: [Role.RECEPCIONISTA, Role.ADMINISTRADOR],
  },
  {
    name: "Citas",
    path: "/citas",
    roles: [Role.RECEPCIONISTA, Role.OPTOMETRISTA, Role.ADMINISTRADOR],
  },
  {
    name: "Recetas",
    path: "/recetas",
    roles: [Role.OPTOMETRISTA, Role.ADMINISTRADOR],
  },
  {
    name: "Pedidos",
    path: "/pedidos",
    roles: [Role.OPTOMETRISTA, Role.ADMINISTRADOR],
  },
  {
    name: "Reportes",
    path: "/reportes",
    roles: [Role.ADMINISTRADOR],
  },
  {
    name: "Empleados",
    path: "/empleados",
    roles: [Role.ADMINISTRADOR],
  },
];