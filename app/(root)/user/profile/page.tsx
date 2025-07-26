import { auth } from "@/auth";
import { getUserAddress } from "@/lib/actions/user.action";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import Image from "next/image";

export const metadata = {
  title: "Customer Profile",
};

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/signIn");
  }
  const userId = session?.user?.id;

  if (!userId) throw new Error("No user found");

  const userAddress = await getUserAddress(userId);
  const firstInitial =
    session.user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <SessionProvider session={session}>
      <div className="grid md:grid-cols-[200px_1fr]">
        <div>
          <div className="w-full min-h-[13rem] flex items-center justify-center">
            {session?.user?.image ? (
              <Image
                src={session?.user?.image || "/images/userProfile.jpg"}
                alt={session?.user?.name || "user Profile"}
                height={120}
                width={120}
                quality={100}
                className="rounded-full border border-gray-300"
              />
            ) : (
              <div className="w-[140px] h-[140px] flex items-center justify-center rounded-full bg-gray-300">
                <h1 className="text-[5rem]">{firstInitial}</h1>
              </div>
            )}
          </div>
        </div>
        <div>
          <ProfileForm userAddress={userAddress} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
