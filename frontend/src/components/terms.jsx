const Terms = () => {
    return (
      <div className="max-w-4xl min-h-screen mx-auto p-6 pt-[40px]">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Terms & Conditions</h1>
  
        <p className="text-gray-600 mb-4">
          Welcome to <span className="font-semibold">CGU Marketplace</span>. By using our platform, you agree to these terms.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">1. User Responsibilities</h2>
        <p className="text-gray-600">
          - You must be a registered member of the CGU community to use this platform. <br />
          - Provide accurate details when listing or purchasing an item. <br />
          - Misuse of the platform, including spamming or fraudulent activities, will result in account suspension.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">2. Buying & Selling Rules</h2>
        <p className="text-gray-600">
          - Only <span className="font-semibold">legal and permitted</span> items can be listed. <br />
          - Items must be accurately described with real images. <br />
          - Sellers are responsible for ensuring the product’s quality and condition. <br />
          - Buyers must inspect items before making payments.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">3. Prohibited Items</h2>
        <ul className="text-gray-600 list-disc pl-5">
          <li>❌ Illegal substances (drugs, alcohol, tobacco)</li>
          <li>❌ Weapons, explosives, or hazardous materials</li>
          <li>❌ Plagiarized materials (fake degrees, IDs, assignments)</li>
          <li>❌ Restricted software, hacking tools, or malware</li>
          <li>❌ Any item violating university policies</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6">4. Payment & Transactions</h2>
        <p className="text-gray-600">
          - Payments should be made directly between buyer and seller. <br />
          - <span className="font-semibold">CGU Marketplace is not responsible</span> for lost payments, fraud, or scams. <br />
          - Users are advised to meet in <span className="font-semibold">safe locations</span> for transactions.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">5. Dispute Resolution</h2>
        <p className="text-gray-600">
          - Any disputes between buyers and sellers should be resolved <span className="font-semibold">among themselves</span> cgumarketplace is not responsible for any dispute. <br />
          - CGU Marketplace does <span className="font-semibold">not</span> offer refunds or guarantees on transactions. <br />
          - If you suspect fraud, report it to <a href="mailto:cgumarketplace@gmail.com" 
            className="font-semibold text-blue-500 hover:underline">
            cgumarketplace@gmail.com
            </a>.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">6. Privacy & Data Protection</h2>
        <p className="text-gray-600">
          - User data (name, email, contact) is collected <span className="font-semibold">only</span> for marketplace purposes. <br />
          - We do <span className="font-semibold">not</span> sell or share data with third parties. <br />
          - Users can request data deletion by contacting support.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">7. Platform Rights</h2>
        <p className="text-gray-600">
          - CGU Marketplace reserves the right to <span className="font-semibold">remove</span> any listing that violates these terms. <br />
          - We may update these terms from time to time. Continued use means you accept the new terms.
        </p>
  
        <h2 className="text-xl font-semibold mt-6">8. Contact & Support</h2>
        <p className="text-gray-600">
        If you have any concerns, contact us at{" "}
        <a href="mailto:cgumarketplace@gmail.com" className="font-semibold text-blue-500 hover:underline">
            cgumarketplace@gmail.com
        </a>{" "}
        </p>
  
        <p className="mt-6 text-gray-600">
          By using CGU Marketplace, you agree to follow these terms. <span className="font-semibold">Happy buying & selling! </span>
        </p>
      </div>
    );
  };
  
  export default Terms;
  