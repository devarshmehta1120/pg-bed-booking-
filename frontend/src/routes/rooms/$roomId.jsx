import { createFileRoute } from '@tanstack/react-router'
import Beds from '../../pages/Beds'

export const Route = createFileRoute('/rooms/$roomId')({
  component: Beds,
})

