import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Bookmark, X } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import dummyData from "../data/dummyData.json";

const TariffLookup = () => {
  const [hsCode, setHsCode] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const toast = useToast();

  // Function to get product description based on HS Code
  const getProductDescription = (code) => {
    const hsCodeData = dummyData.hsCodes.find((item) => item.code === code);
    return hsCodeData ? hsCodeData.description : "";
  };

  // Function to get rules of origin text based on origin and destination
  const getRulesOfOrigin = () => {
    // Mock rules of origin data - in real app this would come from API
    const rulesMap =
      "To get the preferential rate, the good must count as 'Japanese-made' under the EU-Japan free trade agreement, which requires:\n\n1. The goods were mainly produced in Japan, not just assembled from foreign parts; and\n\n2. Your supplier can provide a short origin statement on their invoice confirming that.";
    return rulesMap;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = dummyData.tariffRates.find(
        (rate) =>
          rate.hsCode === hsCode &&
          rate.origin === originCountry &&
          rate.destination === destinationCountry
      );

      if (result) {
        setSearchResults(result);
      } else {
        // Create a mock result for demo purposes
        setSearchResults({
          hsCode,
          status: "Sanctioned goods",
          origin: originCountry,
          destination: destinationCountry,
          currentRate: 12.5,
          vat: 3.0,
          rateType: "MFN",
          effectiveDate: "2024-01-01",
          source: "Trade Policy Database",
          projections: [
            { quarter: "Q1 2025", rate: 12.5, change: "stable" },
            {
              quarter: "Q2 2025",
              rate: 10.0,
              change: "decrease",
              changeExplanation:
                "Tariffs for this good in the EU-Japan FTA decline to 0% on 1 February 2026",
            },
            { quarter: "Q3 2025", rate: 10.0, change: "stable" },
            {
              quarter: "Q4 2025",
              rate: 13.5,
              change: "increase",
              changeExplanation:
                "Anti-dumping duties of 10% will be applied to Chinese imports starting 1 December 2026",
            },
          ],
          marketIntelligence: [
            {
              country: originCountry,
              total: 123000,
              marketShare: 35.2,
              volume: 95000,
              avgDuty: 12.5,
            },
            {
              country: "Other",
              total: 89000,
              marketShare: 25.8,
              volume: 69500,
              avgDuty: 15.2,
            },
            {
              country: "Alternative",
              total: 64000,
              marketShare: 18.4,
              volume: 49600,
              avgDuty: 8.8,
            },
          ],
          additionalInfo:
            "Standard trade conditions apply. Consider monitoring for potential policy changes.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getChangeIcon = (change) => {
    switch (change) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (change) => {
    switch (change) {
      case "increase":
        return "bg-red-50 text-red-700";
      case "decrease":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const handleAddToWatchlist = () => {
    // In a real app, this would make an API call
    toast.success(
      "Product added to watchlist! (Login required for full functionality)",
      4000
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tariff Lookup</h1>
        <p className="text-gray-600">
          Search for current tariff rates and future projections for your
          products
        </p>
      </div> */}

      {/* Search Form */}
      <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* First Row: HS Code and Product Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HS Code
              </label>
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                placeholder="e.g., 8517.12.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-3px"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin Country
              </label>
              <select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-3px"
                required
              >
                <option value="">Select country</option>
                {dummyData.countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row: Origin Country and Destination Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-3px bg-gray-100 min-h-[42px] flex items-center">
                <p className="text-gray-600 text-sm">
                  {hsCode
                    ? getProductDescription(hsCode) ||
                      "Product description not available for this HS Code"
                    : "Enter valid HS Code to see product description"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Country
              </label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-3px"
                required
              >
                <option value="">Select country</option>
                {dummyData.countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px] justify-center bg-primary-600 text-white mt-4 px-8 py-3 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Current Tariff Information */}
          <div className="bg-white rounded-3px  p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Side - Applicable Duty */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Applicable Duty
                </h2>

                <div className="space-y-2">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {searchResults.currentRate || 10}%
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[16px] text-gray-600">
                        MFN Rate:
                      </span>
                      <span className="text-[16px] font-medium text-gray-900">
                        {searchResults.mfnRate ||
                          searchResults.currentRate ||
                          10}
                        %
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[16px] text-gray-600">
                        Preferential Rate:
                      </span>
                      <button
                        onClick={() => setShowRulesDialog(true)}
                        className="text-[16px] underline font-medium text-primary-600 hover:text-primary-700 flex items-center space-x-1 transition-colors"
                      >
                        <span>{searchResults.preferentialRate || 5}%</span>
                      </button>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[16px] text-gray-600">VAT:</span>
                      <span className="text-[16px] font-medium text-gray-900">
                        {searchResults.vat || 4}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[16px] text-gray-600">
                        Effective:
                      </span>
                      <span className="text-[16px] font-medium text-gray-900">
                        {searchResults.effectiveDate || "01.01.2024"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[16px] text-gray-600">Status:</span>
                      <span className="text-[16px] font-medium text-gray-900">
                        {searchResults.status ||
                          "Subject to October 2025 anti-dumping investigation"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Source:{" "}
                        <span className="text-primary-600 hover:text-primary-700 cursor-pointer">
                          {searchResults.detailedSource ||
                            "TARIC Entry – Regulation 2023/1191"}
                        </span>{" "}
                        retrieved 01.06.2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Additional Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Additional Info
                </h2>

                <div className="prose prose-sm text-gray-700 leading-relaxed">
                  <p>
                    {searchResults.detailedInfo ||
                      "Woven cotton fabrics (HS 5208.52) imported from India into Germany are eligible for a reduced 3.2% tariff under the EU's GSP. To use this benefit, the goods must meet origin rules and include valid documentation. Importers should also ensure that fabrics comply with EU chemical safety standards and product labeling rules. While no quota is currently active, high import volumes are monitored and could trigger safeguards in future."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Projections */}
          <div className="bg-white rounded-3px p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Future Tariff Projections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {searchResults.projections.map((projection, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-3px border-2 ${getChangeColor(
                    projection.change
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{projection.quarter}</span>
                    {getChangeIcon(projection.change)}
                  </div>
                  <p className="text-2xl font-bold">{projection.rate}%</p>
                  <p className="text-sm capitalize">
                    {projection?.changeExplanation}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Sanctions / Export Controls
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Effective January 1, 2024, exports and re-exports of certain
                  precision mechanical components are restricted under EU and
                  German export control regulations. These products can be used
                  in industrial, military, or dual-use applications.
                </p>
              </div>
            </div>
          </div>

          {/* Market Intelligence */}
          <div className="bg-white rounded-3px  p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Annual Imports of {searchResults.hsCode} to{" "}
              {searchResults.destination} (2024)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-[16px] font-semibold text-gray-700">
                      Origin Country
                    </th>
                    <th className="text-left py-3 text-[16px] font-semibold text-gray-700">
                      Total (€B)
                    </th>
                    <th className="text-left py-3 text-[16px] font-semibold text-gray-700">
                      % of Total
                    </th>
                    <th className="text-left py-3 text-[16px] font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left py-3 text-[16px] font-semibold text-gray-700">
                      Avg Duty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.marketIntelligence.map((intel, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-[16px] text-gray-900">
                        {intel.country}
                      </td>
                      <td className="py-3 text-[16px] text-gray-900">
                        {intel.total}
                      </td>
                      <td className="py-3 text-[16px] text-gray-900">
                        {intel.marketShare}%
                      </td>
                      <td className="py-3 text-[16px] text-gray-900">
                        {intel.volume.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 text-[16px] font-medium ${
                          intel.avgDuty > searchResults.currentRate
                            ? "text-red-600"
                            : intel.avgDuty < searchResults.currentRate
                            ? "text-green-600"
                            : "text-gray-900"
                        }`}
                      >
                        {intel.avgDuty}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAddToWatchlist}
              className="bg-primary-600 text-white px-6 py-3 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Bookmark size={20} />
              <span>Add to My Watchlist</span>
            </button>
            <Link
              to="/hscode/7604.21"
              state={{ activeTab: "news" }}
              className="bg-transparent text-teal-700 px-6 py-3 rounded-3px hover:bg-teal-50 transition-colors inline-flex items-center"
            >
              Search Recent News
            </Link>
          </div>
        </div>
      )}

      {/* Rules of Origin Dialog */}
      {showRulesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Rules of Origin - Preferential Rate
                </h3>
                <button
                  onClick={() => setShowRulesDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded">
                  <div className="flex">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Preferential Rate:{" "}
                        {searchResults?.preferentialRate || 5}%
                      </h4>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {getRulesOfOrigin()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Additional Requirements:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Valid commercial invoice with origin declaration</li>
                    <li>
                      Goods must be shipped directly without processing in third
                      countries
                    </li>
                    <li>
                      Compliance with product-specific rules where applicable
                    </li>
                    <li>Proper customs declaration at time of import</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-500">
                    <strong>Note:</strong> Rules of origin requirements may vary
                    based on specific product categories and trade agreements.
                    Consult with your customs broker or trade compliance
                    specialist for detailed guidance.
                  </p>
                </div> */}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowRulesDialog(false)}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TariffLookup;
