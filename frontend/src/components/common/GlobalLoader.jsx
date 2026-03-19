import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const GlobalLoader = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center p-2 z-50">
      Loading...
    </div>
  );
};

export default GlobalLoader;