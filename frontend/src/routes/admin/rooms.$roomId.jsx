import { createFileRoute } from "@tanstack/react-router"
import Beds from "../../pages/admin/beds"
// import Beds from "../../pages/admin/Beds"

export const Route = createFileRoute("/admin/rooms/$roomId")({
  component: Beds,
})