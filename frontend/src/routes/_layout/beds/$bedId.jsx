import { createFileRoute } from '@tanstack/react-router'
import BookBed from '../../../pages/BookBed'

export const Route = createFileRoute('/_layout/beds/$bedId')({
  component: BookBed,
})
