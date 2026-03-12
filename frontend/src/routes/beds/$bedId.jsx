import { createFileRoute } from '@tanstack/react-router'
import BookBed from '../../pages/BookBed'

export const Route = createFileRoute('/beds/$bedId')({
  component: BookBed,
})
