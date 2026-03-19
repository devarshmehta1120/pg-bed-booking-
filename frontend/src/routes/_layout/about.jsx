import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '../../pages/Aboutus'

export const Route = createFileRoute('/_layout/about')({
  component: AboutUs,
})

