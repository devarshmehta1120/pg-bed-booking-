import { createFileRoute } from '@tanstack/react-router'
import Beds from '../../../pages/admin/Beds'
// import Beds from '@/pages/admin/Beds'
export const Route = createFileRoute('/admin/beds/$roomId')({
  component: Beds,
})

