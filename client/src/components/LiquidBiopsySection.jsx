import React from "react";

const LiquidBiopsySection = () => {
  return (
    <section className="py-20 px-8 bg-gray-50">

      {/* Title */}
      <h2 className="text-3xl font-bold text-center">
        Liquid Biopsy Monitoring
      </h2>

      {/* Description */}
      <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">
        Detect cancer changes early using a simple blood test and advanced analysis.
      </p>

      {/* Workflow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
        <div className="p-6 bg-white shadow rounded text-center">🧪 Sample</div>
        <div className="p-6 bg-white shadow rounded text-center">🧬 Biomarker</div>
        <div className="p-6 bg-white shadow rounded text-center">🤖 Analysis</div>
        <div className="p-6 bg-white shadow rounded text-center">📊 Result</div>
      </div>

    </section>
  );
};

export default LiquidBiopsySection;