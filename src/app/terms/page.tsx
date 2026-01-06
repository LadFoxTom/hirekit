import SEOHead from '@/components/SEOHead';

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service - LadderFox CV Builder"
        description="Read our Terms of Service for LadderFox CV Builder. Learn about usage rights, limitations, and user agreements for our AI-powered resume builder."
        keywords={[
          'terms of service',
          'LadderFox terms',
          'CV builder terms',
          'user agreement',
          'service terms',
          'usage rights',
          'legal terms',
          'CV builder agreement',
          'resume builder terms',
          'terms and conditions'
        ]}
        ogTitle="Terms of Service - LadderFox CV Builder"
        ogDescription="Read our Terms of Service for LadderFox CV Builder. Learn about usage rights, limitations, and user agreements."
        canonical="/terms"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms of Service",
          "description": "Terms of Service for LadderFox CV Builder",
          "url": "https://ladder-fox-dev.vercel.app/terms",
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
          <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
          <div className="mt-6 prose prose-blue">
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Acceptance of Terms</h2>
            <p className="mt-4 text-gray-600">
              By accessing and using LadderFox CV Builder, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Use License</h2>
            <p className="mt-4 text-gray-600">
              Permission is granted to temporarily use LadderFox CV Builder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Disclaimer</h2>
            <p className="mt-4 text-gray-600">
              The materials on LadderFox CV Builder are provided on an 'as is' basis. LadderFox makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Limitations</h2>
            <p className="mt-4 text-gray-600">
              In no event shall LadderFox or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LadderFox CV Builder.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Revisions and Errata</h2>
            <p className="mt-4 text-gray-600">
              The materials appearing on LadderFox CV Builder could include technical, typographical, or photographic errors. LadderFox does not warrant that any of the materials on its website are accurate, complete or current.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Links</h2>
            <p className="mt-4 text-gray-600">
              LadderFox has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LadderFox of the site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Site Terms of Use Modifications</h2>
            <p className="mt-4 text-gray-600">
              LadderFox may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Contact Information</h2>
            <p className="mt-4 text-gray-600">
              If you have any questions about these Terms of Service, please contact us at:
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