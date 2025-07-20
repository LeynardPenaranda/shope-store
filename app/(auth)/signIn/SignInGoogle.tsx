import { signInWithGoogle } from "@/lib/actions/user.action";
import Image from "next/image";

const GoogleSignIn = () => {
  return (
    <form action={signInWithGoogle}>
      <button className="flex border border-gray-200 w-full min-h-[5rem] items-center justify-center gap-2 cursor-pointer">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="google-logo"
          width={40}
          height={100}
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
};

export default GoogleSignIn;
