interface HeaderProps {
  role: string;
}

const Header = ({ role }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between">
      <h2 className="text-xl font-semibold capitalize">
        Panel {role}
      </h2>

      <button className="text-sm bg-primary text-white px-4 py-2 rounded-lg">
        Cerrar Sesión
      </button>
    </header>
  );
};

export default Header;