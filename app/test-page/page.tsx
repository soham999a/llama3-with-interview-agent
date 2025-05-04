"use client";

export default function TestPage() {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-black mb-4">Test Page</h1>
      <p className="text-gray-700 mb-4">This is a test page to check if the CSS is working properly.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFF8E1] p-6 rounded-[2rem] shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Yellow Card</h2>
          <p className="text-gray-600 mt-2">This is a yellow card with rounded corners.</p>
        </div>
        
        <div className="bg-[#E1F5FE] p-6 rounded-[2rem] shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Blue Card</h2>
          <p className="text-gray-600 mt-2">This is a blue card with rounded corners.</p>
        </div>
        
        <div className="bg-[#E8F5E9] p-6 rounded-[2rem] shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Green Card</h2>
          <p className="text-gray-600 mt-2">This is a green card with rounded corners.</p>
        </div>
        
        <div className="bg-[#FFEBEE] p-6 rounded-[2rem] shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Pink Card</h2>
          <p className="text-gray-600 mt-2">This is a pink card with rounded corners.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <button className="bg-teal-500 text-white px-4 py-2 rounded-[1.25rem] font-medium">
          Test Button
        </button>
      </div>
    </div>
  );
}
