// Layout component - renamed from Card to serve as the main layout wrapper
export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow h-14 flex items-center px-6">
        <h1 className="text-xl font-semibold text-blue-600">WaitLess</h1>
      </nav>
      <main className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] px-4">
        {children}
      </main>
    </div>
  );
}
