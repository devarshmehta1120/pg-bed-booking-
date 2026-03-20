import { createFileRoute } from '@tanstack/react-router'
import Beds from '../../../pages/admin/Beds'

export const Route = createFileRoute('/admin/Beds/$roomId')({
  component: Beds,
})

