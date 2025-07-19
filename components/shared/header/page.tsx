import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <Link href="/" className="flex-start">
          <Image
            src="/images/LogoDark.png"
            alt={APP_NAME}
            height={43}
            width={43}
            priority={true}
            className="rounded-sm"
          />
        </Link>

        <div className="flex-row">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
