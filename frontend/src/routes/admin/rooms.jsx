  import { createFileRoute } from '@tanstack/react-router'
// import RoomsBeds from '../../pages/RoomsBeds'
import Rooms from '../../pages/admin/Rooms'
  export const Route = createFileRoute('/admin/rooms')({
    component: Rooms,
  })

