import React from "react";

export const Footer = () => {
  return (
    <footer id="about" className="bg-gray-50 dark:bg-gray-900/50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">About Universal Resource Hub</h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Universal Resource Hub is dedicated to making quality learning resources accessible to everyone. 
              We believe that knowledge should be free and easily available, which is why we've created this 
              platform to aggregate and organize the best free resources across various categories.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>✓ Curated collection of free educational resources</li>
              <li>✓ Easy-to-use search and filtering system</li>
              <li>✓ Resources across multiple categories</li>
              <li>✓ Regular updates with new content</li>
              <li>✓ Community-driven recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};