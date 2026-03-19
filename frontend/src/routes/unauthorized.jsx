import { createFileRoute } from "@tanstack/react-router";

function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-3xl font-bold text-red-600">403</h1>
        <p className="text-lg">Access Denied. Admin only.</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/unauthorized")({
  component: Unauthorized,
});