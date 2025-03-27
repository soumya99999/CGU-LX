const CommunityGuidelines = () => {
    return (
      <div className="max-w-6xl min-h-screen mx-auto p-6 pt-5 space-y-12">
  
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-black tracking-wide">
            Community Guidelines
          </h1>
        </div>
  
        {/* Guidelines List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-black text-center">
            Our Code of Conduct
          </h2>
          <ul className="space-y-4 text-gray-700 text-lg px-4 leading-relaxed">
            <li><strong className="text-black">Be Respectful:</strong> Treat all members with kindness and professionalism.</li>
            <li><strong className="text-black">No Scams or Fraud:</strong> All listings should be honest and accurately described.</li>
            <li><strong className="text-black">Meet Safely:</strong> Choose public locations for transactions and verify items before payment.</li>
            <li><strong className="text-black">No Prohibited Items:</strong> Follow university and legal policies when selling items.</li>
            <li><strong className="text-black">Report Misuse:</strong> Help keep the marketplace safe by reporting suspicious activities.</li>
          </ul>
        </div>
  
        {/* Call to Action */}
        <div className="mt-12 bg-white from-blue-600 to-blue-800 text-black text-center py-10 rounded-3xl border-2 border-black relative">
          <h3 className="text-3xl font-semibold">Together, We Build a Safe Marketplace</h3>
          <p className="mt-2 text-gray-600">Follow these guidelines to ensure a smooth experience for everyone.</p>
        </div>
      </div>
    );
  };
  
  export default CommunityGuidelines;
  