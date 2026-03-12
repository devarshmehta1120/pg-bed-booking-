import { createFileRoute } from '@tanstack/react-router'
import Bookings from '../../pages/admin/Bookings'

export const Route = createFileRoute('/admin/bookings')({
  component: Bookings,
})


