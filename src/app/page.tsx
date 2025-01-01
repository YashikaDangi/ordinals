
import AdminDashboard from "./admin/dashboard/page";

export default async function Home() {

  return (
    <main className="h-full">
     <div className="fixed top-0 w-full z-10 bg-black">
     <AdminDashboard/>
     </div>

    </main>
  );
}
