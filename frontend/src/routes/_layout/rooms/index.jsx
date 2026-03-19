import { createFileRoute } from '@tanstack/react-router'
import Rooms from '../../../pages/Rooms'

export const Route = createFileRoute('/_layout/rooms/')({
  component: Rooms,
})