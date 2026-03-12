import { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/Home'
// import Home from '../components/Home'

export const Route = createFileRoute('/')({
  component: Home,
})


