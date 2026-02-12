import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "HubFit Dashboard",
  description: "Interactive dashboard for monitoring HubFit client adherence and engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      HubFit
                    </h1>
                  </div>
                  <nav className="ml-4 sm:ml-10 flex space-x-1 sm:space-x-4">
                    <Link 
                      href="/" 
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <span className="sm:hidden">🏠</span>
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link 
                      href="/analytics" 
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <span className="sm:hidden">📊</span>
                      <span className="hidden sm:inline">Analytics</span>
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                    <span className="sm:hidden">🔄</span>
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-4 sm:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
