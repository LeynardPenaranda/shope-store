import UserSideBar from "./userSideBar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 grid-rows-[40px_1fr] md:grid-rows-1 md:grid-cols-[200px_1fr]  w-full  h-screen">
      <div className="border border-gray-200">
        <UserSideBar />
      </div>
      <main className="">{children}</main>
    </div>
  );
}
