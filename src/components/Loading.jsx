export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-stone-800" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-stone-400 animate-spin"
          style={{ animationDuration: "0.9s" }}
        />
        <div className="absolute inset-3 rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
