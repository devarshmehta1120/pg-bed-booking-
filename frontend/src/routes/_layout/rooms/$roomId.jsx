import { createFileRoute } from '@tanstack/react-router'
import Beds from '../../../pages/Beds'
// import Beds from '../../pages/Beds'

export const Route = createFileRoute('/_layout/rooms/$roomId')({
  component: Beds,
})

