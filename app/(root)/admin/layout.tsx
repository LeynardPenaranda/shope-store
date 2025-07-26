import AdminNavbar from "./adminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 grid-rows-[5rem_1fr] mb-15">
      <div className="border border-gray-200 flex flex-col md:flex-row items-center justify-around">
        <AdminNavbar />
      </div>
      <main className="">{children}</main>
    </div>
  );
}
