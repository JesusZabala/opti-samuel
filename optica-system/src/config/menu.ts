import type { Role } from "../types/roles";

export interface MenuItem {
  name: string;
  path: string;
  roles: Role[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Clientes",
    path: "/clientes",
    roles: ["recepcionista", "administrador"],
  },
  {
    name: "Citas",
    path: "/citas",
    roles: ["recepcionista", "optometrista", "administrador"],
  },
  {
    name: "Recetas",
    path: "/recetas",
    roles: ["optometrista", "administrador"],
  },
  {
    name: "Pedidos",
    path: "/pedidos",
    roles: ["optometrista", "administrador"],
  },
  {
    name: "Reportes",
    path: "/reportes",
    roles: ["administrador"],
  },
  {
    name: "Empleados",
    path: "/empleados",
    roles: ["administrador"],
  },
];