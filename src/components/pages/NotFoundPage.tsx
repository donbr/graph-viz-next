'use client'

import Link from 'next/link';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
