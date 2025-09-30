import React, { useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import dummyData from "../data/dummyData.json";

const TariffLookup = () => {
  const [hsCode, setHsCode] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Function to get product description based on HS Code
  const getProductDescription = (code) => {
    const hsCodeData = dummyData.hsCodes.find((item) => item.code === code);
    return hsCodeData ? hsCodeData.description : "";
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
          origin: originCountry,
          destination: destinationCountry,
          currentRate: 12.5,
          rateType: "MFN",
          effectiveDate: "2024-01-01",
          source: "Trade Policy Database",
          projections: [
            { quarter: "Q1 2025", rate: 12.5, change: "stable" },
            { quarter: "Q2 2025", rate: 10.0, change: "decrease" },
            { quarter: "Q3 2025", rate: 10.0, change: "stable" },
            { quarter: "Q4 2025", rate: 8.5, change: "decrease" },
          ],
          marketIntelligence: [
            {
              country: originCountry,
              marketShare: 35.2,
              volume: 95000,
              avgDuty: 12.5,
            },
            {
              country: "Other",
              marketShare: 25.8,
              volume: 69500,
              avgDuty: 15.2,
            },
            {
              country: "Alternative",
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tariff Lookup</h1>
        <p className="text-gray-600">
          Search for current tariff rates and future projections for your
          products
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 min-h-[42px] flex items-center">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              className="bg-primary-600 text-white mt-4 px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Search size={20} />
              <span>{isLoading ? "Searching..." : "Search Tariff Rates"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Current Tariff Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Tariff Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Current Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {searchResults.currentRate}%
                </p>
                <p className="text-sm text-gray-500">
                  {searchResults.rateType}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Effective Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {searchResults.effectiveDate}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Source</p>
                <p className="text-lg font-semibold text-gray-900">
                  {searchResults.source}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">HS Code</p>
                <p className="text-lg font-semibold text-gray-900">
                  {searchResults.hsCode}
                </p>
              </div>
            </div>
          </div>

          {/* Future Projections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Future Tariff Projections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {searchResults.projections.map((projection, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getChangeColor(
                    projection.change
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{projection.quarter}</span>
                    {getChangeIcon(projection.change)}
                  </div>
                  <p className="text-2xl font-bold">{projection.rate}%</p>
                  <p className="text-sm capitalize">{projection.change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Intelligence */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Market Intelligence
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Country
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Market Share
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Volume
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Avg Duty Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.marketIntelligence.map((intel, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">
                        {intel.country}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {intel.marketShare}%
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {intel.volume.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 text-sm font-medium ${
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

          {/* Additional Information */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  AI Analysis & Recommendations
                </h3>
                <p className="text-blue-800">{searchResults.additionalInfo}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAddToWatchlist}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add to My Watchlist</span>
            </button>
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              Search Recent News
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TariffLookup;
