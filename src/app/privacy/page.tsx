import SEOHead from '@/components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - LadderFox CV Builder"
        description="Read our Privacy Policy to understand how LadderFox CV Builder collects, uses, and protects your personal information and CV data."
        keywords={[
          'privacy policy',
          'LadderFox privacy',
          'CV builder privacy',
          'data protection',
          'personal information',
          'CV data security',
          'privacy rights',
          'data collection',
          'information security',
          'user privacy'
        ]}
        ogTitle="Privacy Policy - LadderFox CV Builder"
        ogDescription="Read our Privacy Policy to understand how LadderFox CV Builder collects, uses, and protects your personal information."
        canonical="/privacy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "description": "Privacy Policy for LadderFox CV Builder",
          "url": "https://ladder-fox-dev.vercel.app/privacy",
          "mainEntity": {
            "@type": "Organization",
            "name": "LadderFox",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "info@ladderfox.com"
            }
          }
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          <div className="mt-6 prose prose-blue">
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Introduction</h2>
            <p className="mt-4 text-gray-600">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CV Builder service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Information We Collect</h2>
            <p className="mt-4 text-gray-600">
              We collect information that you voluntarily provide when using our service, including:
            </p>
            <ul className="mt-4 list-disc pl-5 text-gray-600">
              <li>Personal information (name, email, phone number)</li>
              <li>Professional experience and education details</li>
              <li>Skills and qualifications</li>
              <li>Any other information you choose to include in your CV</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">How We Use Your Information</h2>
            <p className="mt-4 text-gray-600">
              We use the information we collect to:
            </p>
            <ul className="mt-4 list-disc pl-5 text-gray-600">
              <li>Generate your CV based on your provided information</li>
              <li>Improve our CV templates and builder functionality</li>
              <li>Communicate with you about our services</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Data Security</h2>
            <p className="mt-4 text-gray-600">
              We implement appropriate technical and organizational security measures to protect your information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Your Rights</h2>
            <p className="mt-4 text-gray-600">
              You have the right to:
            </p>
            <ul className="mt-4 list-disc pl-5 text-gray-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Contact Us</h2>
            <p className="mt-4 text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-gray-600">
              Email: info@ladderfox.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 