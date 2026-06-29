// The shared page container (layout.md section 8): one centred column capped at
// 1160px on Paper that bleeds to the window. The container is centred, the
// content inside it stays left-aligned to the reading edge. Replaces the
// repeated mx-auto w-full max-w-6xl px-6 py-8 scattered across the pages.

export function AppMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`mx-auto w-full max-w-[1160px] px-6 py-8${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </main>
  );
}
