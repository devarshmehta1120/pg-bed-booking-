import { createFileRoute } from '@tanstack/react-router'
import MyBookings from '../../pages/MyBookings'

export const Route = createFileRoute('/_layout/mybooking')({
  component: MyBookings,
})
