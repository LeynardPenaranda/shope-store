import CategoryDrawer from "./category-draw";
import Menu from "./Menu";
import MenuLogo from "./MenuLogo";
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex items-center gap-2">
          <CategoryDrawer />
          <MenuLogo />
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <div className="flex-row">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
