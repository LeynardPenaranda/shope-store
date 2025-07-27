import { getUserById } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

export const metadata = {
  title: "Admin User",
};

const AdminUserUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const user = await getUserById(id);
  if (!user) {
    notFound();
  }
  return (
    <div className="space-y-8 mt-10">
      <h1 className="h2-bold text-center">Update User</h1>
      <div className="max-w-2xl mx-auto">
        <UpdateUserForm user={user} />
      </div>
    </div>
  );
};

export default AdminUserUpdatePage;
