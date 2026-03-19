import { createFileRoute } from '@tanstack/react-router'
import ContactUs from '../../pages/Contactus'

export const Route = createFileRoute('/_layout/contact')({
  component: ContactUs,
})

