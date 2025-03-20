import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 pt-[40px]">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        Updated on <strong>20 Mar 2025</strong>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p className="text-gray-600">
        Welcome to <strong>CGU Marketplace</strong>, a platform designed to facilitate seamless buying and selling within the college community. Your privacy is important to us, and we are committed to protecting your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
      <ul className="list-disc pl-6 text-gray-600">
        <li><strong>Personal Information:</strong> Name, email, Phone No. and college details when you register.</li>
        <li><strong>Transaction Data:</strong> Items listed, purchases made, and communication between users.</li>
        <li><strong>Device & Usage Data:</strong> IP address, browser type, and interaction logs to enhance user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Provide and improve our marketplace services.</li>
        <li>Ensure secure transactions and prevent fraud.</li>
        <li>Send updates, promotional content, and customer support communications.</li>
        <li>Enforce our Terms & Conditions.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing & Security</h2>
      <ul className="list-disc pl-6 text-gray-600">
        <li>We do <strong>not</strong> sell or rent your personal data to third parties.</li>
        <li>Your data is stored securely and encrypted where necessary.</li>
        <li>Third-party services (e.g., payment providers) may be used, but they adhere to strict security measures.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies & Tracking Technologies</h2>
      <p className="text-gray-600">
        We use cookies to enhance user experience, track website activity, and personalize content. You can manage cookie settings in your browser.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights & Choices</h2>
      <ul className="list-disc pl-6 text-gray-600">
        <li>Access, modify, or delete your personal information.</li>
        <li>Opt-out of promotional communications.</li>
        <li>Request data deletion if you stop using our services.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Reporting Issues</h2>
      <p className="text-gray-600">
        If you have privacy concerns, contact us at <a href="mailto:cgumarketplace@gmail.com" className="text-blue-500 font-semibold hover:underline">cgumarketplace@gmail.com</a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
      <p className="text-gray-600">
        We may update this Privacy Policy from time to time. Any significant changes will be communicated via email or platform notifications.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
