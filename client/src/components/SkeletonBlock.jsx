export default function SkeletonBlock({ 
  variant = "card", 
  count = 1,
  className = "" 
}) {
  const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const variants = {
    card: `${shimmerClass} rounded-xl p-8 w-full h-48`,
    text: `${shimmerClass} rounded h-4 w-full`,
    title: `${shimmerClass} rounded h-8 w-3/4`,
    circle: `${shimmerClass} rounded-full w-12 h-12`,
    stat: `${shimmerClass} rounded-xl p-6 h-32`,
    button: `${shimmerClass} rounded-xl h-12 w-full`,
    line: `${shimmerClass} rounded h-4 w-full mb-3`,
  };

  const skeletonClass = variants[variant] || variants.card;

  if (variant === "dashboard") {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md mx-auto max-w-2xl space-y-6 animate-pulse">
        <div className={`${shimmerClass} h-8 w-48 rounded mx-auto mb-6`} />
        <div className="flex gap-4 justify-center mb-6">
          <div className={`${shimmerClass} rounded-xl p-6 h-32 flex-1`} />
          <div className={`${shimmerClass} rounded-xl p-6 h-32 flex-1`} />
          <div className={`${shimmerClass} rounded-xl p-6 h-32 flex-1`} />
        </div>
        <div className={`${shimmerClass} rounded-xl h-12 w-full mb-4`} />
        <div className="grid grid-cols-2 gap-4">
          <div className={`${shimmerClass} rounded-xl h-12`} />
          <div className={`${shimmerClass} rounded-xl h-12`} />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${shimmerClass} rounded-lg h-16 w-full`} />
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${skeletonClass} ${className}`} />
      ))}
    </>
  );
}
