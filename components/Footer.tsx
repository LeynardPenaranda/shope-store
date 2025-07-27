import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t fixed bottom-0 left-0 w-full z-50 bg-background shadow">
      <div className="p-5 flex-center text-center">
        {currentYear} {APP_NAME}. All rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
