import { Header, SubHeader } from "@/app/components/text/Headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/home");
  }

  const users = await prisma?.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {recipes: true}
      }
    }
  });

  return (
    <>
      <Header className="mt-12">Admin</Header>

      <section className="mt-6 rounded-3xl border border-white/50 bg-white p-6 sm:p-8 overflow-x-scroll">
        <h2 className="text-2xl font-extrabold text-orange-600">Users</h2>
        <p className="mt-2 font-semibold">{users.length} current users.</p>
        <table className="w-full mt-4 whitespace-nowrap">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-start">Email</th>
              <th className="px-4 py-2 text-start">Recipes</th>
              <th className="px-4 py-2 text-start">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user._count.recipes}</td>
                <td className="px-4 py-2">
                  {user.createdAt.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
