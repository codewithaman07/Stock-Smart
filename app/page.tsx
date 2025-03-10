import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Stock Smart</h1>
        <p className="text-gray-600 mt-2">
          Your intelligent companion for stock market analysis and insights
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Market Overview</h2>
          <p className="text-gray-600">
            Get real-time insights into market trends and performance
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Stock News</h2>
          <p className="text-gray-600">
            Stay updated with the latest news and developments
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Hot Stocks</h2>
          <p className="text-gray-600">
            Discover trending stocks and market opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
