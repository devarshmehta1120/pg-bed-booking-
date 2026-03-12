import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import Navbar from '../components/common/navbar'


const RootLayout = () => (
  <>
  <Navbar/>
    <Outlet />
  
  </>
)

export const Route = createRootRoute({ component: RootLayout })