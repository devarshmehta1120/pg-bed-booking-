import AdminLayout from "../../components/admin/AdminLayout"

export const Layout=()=>{
    return (
        <div>
           <AdminLayout>
            <Outlet />
           </AdminLayout>
        </div>
    )
}