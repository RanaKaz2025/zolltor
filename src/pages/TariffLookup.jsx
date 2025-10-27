import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
  X,
  ArrowUpDown,
} from "lucide-react";
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
        return <TrendingUp className="w-4 h-4 text-red-800" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-emerald-800" />;
      case "not-sure":
        return <ArrowUpDown className="w-4 h-4 text-amber-800" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (change) => {
    switch (change) {
      case "increase":
        return "bg-red-100 text-red-700";
      case "decrease":
        return "bg-green-100 text-emerald-700";
      case "not-sure":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCardColor = (change) => {
    switch (change) {
      case "increase":
        return "bg-red-50 text-red-800";
      case "decrease":
        return "bg-green-50 text-emerald-800";
      case "not-sure":
        return "bg-amber-50 text-amber-800";
      default:
        return "bg-gray-50 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "increase":
        return "text-red-800";
      case "decrease":
        return "text-emerald-800";
      case "not-sure":
        return "text-amber-800";
      default:
        return "text-gray-800";
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
    <div className="w-full">
      {/* Search Form */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200 p-6 mb-8 w-full">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* First Row: HS Code and Product Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-16-medium text-gray-700 mb-2">
                  HS Code
                </label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setHsCode(value);
                  }}
                  placeholder="e.g., 8517.12.00"
                  className="w-full px-3 py-2 rounded-3px text-16-semibold placeholder:text-16-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-16-medium text-gray-700 mb-2">
                  Origin Country
                </label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3 py-2 "
                  required
                >
                  <option value="" className="text-16-regular text-gray-500">
                    Select country
                  </option>
                  {dummyData.countries.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="text-16-regular text-gray-800"
                    >
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row: Origin Country and Destination Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-16-medium text-gray-700 mb-2">
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
                <label className="block text-16-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-3 py-2 "
                  required
                >
                  <option value="" className="text-16-regular text-gray-500">
                    Select country
                  </option>
                  {dummyData.countries.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="text-16-regular text-gray-800"
                    >
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
                className={`w-full h-[44px] justify-center btn-primary ${
                  isLoading ? "loading" : ""
                }`}
              >
                <span>{isLoading ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="max-w-6xl mx-auto space-y-4 pb-8">
          {/* Current Tariff Information */}
          <div className="flex flex-row justify-between items-start">
            <div>
              <h2 className="text-20-bold text-gray-700">HS Code {hsCode}</h2>
              <p className="text-16-regular text-gray-500">
                {hsCode && getProductDescription(hsCode)}
              </p>
            </div>
            <div className="flex space-x-4">
              <button onClick={handleAddToWatchlist} className="btn-tertiary">
                <Bookmark size={20} />
                <span>Add to My Watchlist</span>
              </button>
              <Link
                to="/hscode/7604.21"
                state={{ activeTab: "news" }}
                className="btn-tertiary"
              >
                <span>Search Recent News</span>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-3px p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Side - Applicable Duty */}

              <div>
                <h2 className="text-18-bold text-gray-700 mb-2">
                  Applicable Duty
                </h2>

                <div className="space-y-2">
                  <div>
                    <p className="text-30-semibold font-bold text-gray-700">
                      {searchResults.currentRate || 10}%
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-16-regular text-gray-500">
                        MFN Rate:
                      </span>
                      <span className="text-16-regular text-gray-700">
                        {searchResults.mfnRate ||
                          searchResults.currentRate ||
                          10}
                        %
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-16-regular text-gray-500">
                        Preferential Rate:
                      </span>
                      <button
                        onClick={() => setShowRulesDialog(true)}
                        className="text-16-regular underline font-medium text-primary-600 hover:text-primary-700 flex items-center space-x-1 transition-colors"
                      >
                        {searchResults.preferentialRate && (
                          <span>{searchResults.preferentialRate}%</span>
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-16-regular text-gray-500">
                        VAT:
                      </span>
                      <span className="text-16-regular text-gray-700">
                        {searchResults.vat === "N/A (recoverable)"
                          ? searchResults.vat
                          : searchResults.vat !== null
                          ? `${searchResults.vat}%`
                          : ""}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-16-regular text-gray-500">
                        Effective:
                      </span>
                      <span className="text-16-regular text-gray-700">
                        {searchResults.effectiveDate || "01.01.2024"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-16-regular text-gray-500">
                        Status:
                      </span>
                      <span className="text-16-regular text-gray-700">
                        {searchResults.status ||
                          "Subject to October 2025 anti-dumping investigation"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-14-regular text-gray-700">
                        Source:{" "}
                        <span className="btn-link">
                          {searchResults.source ||
                            "TARIC Entry – Regulation 2023/1191"}
                        </span>{" "}
                        <span className="text-14-regular text-gray-700">
                          (retrieved 2025-10-01)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Side - Additional Info */}

              <div>
                <h2 className="text-18-bold text-gray-800 mb-6">
                  Additional Info
                </h2>

                <div className="prose prose-sm text-gray-700 text-16-regular">
                  <p>
                    {searchResults.additionalInfo.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Future Projections */}
          <div className="bg-white rounded-3px p-6">
            <h2 className="text-18-bold text-gray-800 mb-4">
              Future Tariff Projections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {searchResults.projections.map((projection, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-3px ${getChangeColor(
                    projection.change
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-16-regular ${getStatusColor(
                        projection.change
                      )}>`}
                    >
                      {projection.quarter}
                    </span>
                    {getChangeIcon(projection.change)}
                  </div>
                  <div
                    className={`p-[6px] h-fit rounded-3px ${
                      projection?.changeExplanation
                        ? getCardColor(projection.change)
                        : "p-0"
                    } `}
                  >
                    <p className="text-24-semibold">{projection.rate}%</p>
                    <p className="text-14-regular">
                      {projection?.changeExplanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="py-4">
              <hr />
            </div>

            <div>
              <h3 className="text-16-bold text-gray-800">
                Sanctions / Export Controls
              </h3>
              <div className="py-2 rounded-lg">
                <p className="text-16-regular text-gray-700">
                  Effective January 1, 2024, exports and re-exports of certain
                  precision mechanical components are restricted under EU and
                  German export control regulations. These products can be used
                  in industrial, military, or dual-use applications.
                </p>
              </div>
            </div>
          </div>
          {/* Market Intelligence */}
          <div className="bg-white rounded-3px p-6">
            <h2 className="text-18-bold text-gray-700 mb-4">
              Annual Imports of {searchResults.hsCode} to{" "}
              {dummyData.countries.find(
                (c) => c.code === searchResults.destination
              )?.name || searchResults.destination}{" "}
              (2024)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-100">
                    <th className="px-2 text-left py-3 text-16-medium text-gray-800">
                      Origin Country
                    </th>
                    <th className="px-2 text-left py-3 text-16-medium text-gray-800">
                      Value (€M)
                    </th>
                    <th className="px-2 text-left py-3 text-16-medium text-gray-800">
                      % of Total
                    </th>
                    <th className="px-2 text-left py-3 text-16-medium text-gray-800">
                      Volume
                    </th>
                    <th className="px-2 text-left py-3 text-16-medium text-gray-800">
                      Current Duty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.marketIntelligence.map((intel, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-2 py-3 text-16-medium text-gray-700">
                        {intel.country}
                      </td>
                      <td className="px-2 py-3 text-16-regular text-gray-700">
                        {intel.total}
                      </td>
                      <td className="px-2 py-3 text-16-regular text-gray-700">
                        {intel.marketShare}%
                      </td>
                      <td className="px-2 py-3 text-16-regular text-gray-700">
                        {intel.volume} t
                      </td>
                      <td
                        className={`px-2 py-3 text-16-regular  ${getStatusColor(
                          intel.status
                        )}`}
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
