import { createFileRoute } from '@tanstack/react-router'
import AdminBookingCalendar from '../../components/admin/AdminBookingCalendar'

export const Route = createFileRoute('/admin/calender')({
  component: AdminBookingCalendar,
})

