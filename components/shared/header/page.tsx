import Menu from "./Menu";
import MenuLogo from "./MenuLogo";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <MenuLogo />
        <div className="flex-row">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
