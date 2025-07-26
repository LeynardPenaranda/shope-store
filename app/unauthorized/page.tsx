import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Unauthorized Access",
};
const Unauthorized = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
      <h1 className="h1-bold text-4xl">Unauthorized Access</h1>
      <p className="text-muted-foreground">
        You do not have the permission to access this page
      </p>
      <Link href="/">
        <Button className="cursor-pointer">Return Home</Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
