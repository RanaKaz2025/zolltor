import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Calendar,
  Globe,
  FileText,
} from "lucide-react";
import dummyData from "../data/dummyData.json";

const HSCodeDetails = () => {
  const { code } = useParams();
  const [hsCodeData, setHsCodeData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const mockHsCodeData = {
      code: code,
      description:
        dummyData.hsCodes.find((hs) => hs.code === code)?.description ||
        "Product description not found",
      category:
        dummyData.hsCodes.find((hs) => hs.code === code)?.category || "General",
      regulatoryText: `Harmonized System Code ${code} covers products that fall under the category of ${
        dummyData.hsCodes.find((hs) => hs.code === code)?.category || "General"
      }. These products are subject to various trade regulations, documentation requirements, and tariff classifications depending on the country of origin and destination.`,
      plainLanguageExplanation: `This product category includes items that are commonly traded internationally. Import/export of these products requires proper documentation and may be subject to specific trade agreements, quotas, or special duty rates depending on the trading partners involved.`,
      historicalTrends: [
        { year: 2021, volume: 1250000, value: 2500000000, growth: 5.2 },
        { year: 2022, volume: 1340000, value: 2750000000, growth: 7.2 },
        { year: 2023, volume: 1425000, value: 3100000000, growth: 6.3 },
        { year: 2024, volume: 1520000, value: 3450000000, growth: 6.7 },
      ],
      topCountries: [
        { country: "CN", volume: 456000, value: 1035000000, share: 30.0 },
        { country: "US", volume: 304000, value: 690000000, share: 20.0 },
        { country: "DE", volume: 228000, value: 517500000, share: 15.0 },
        { country: "JP", volume: 152000, value: 345000000, share: 10.0 },
        { country: "UK", volume: 152000, value: 345000000, share: 10.0 },
      ],
      recentNews: [
        {
          date: "2024-03-15",
          title: "New Trade Agreement May Affect Tariff Rates",
          source: "Trade Policy News",
          summary:
            "Recent bilateral trade negotiations may result in preferential rates for this product category.",
        },
        {
          date: "2024-02-28",
          title: "Market Analysis: Growing Demand in Asian Markets",
          source: "Market Research Report",
          summary:
            "Analysis shows increasing demand for these products in key Asian markets.",
        },
        {
          date: "2024-02-10",
          title: "Regulatory Update: New Documentation Requirements",
          source: "Customs Authority",
          summary: "Updated documentation requirements effective from Q2 2024.",
        },
      ],
    };

    setHsCodeData(mockHsCodeData);
  }, [code]);

  if (!hsCodeData) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HS Code details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "trends", label: "Historical Trends", icon: TrendingUp },
    { id: "news", label: "Recent News", icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/watchlist"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Watchlist</span>
        </Link>

        <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                HS Code: {hsCodeData.code}
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                {hsCodeData.description}
              </p>
              <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {hsCodeData.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3px shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Regulatory Text
                </h3>
                <div className="bg-gray-50 p-4 rounded-3px">
                  <p className="text-gray-700 leading-relaxed">
                    {hsCodeData.regulatoryText}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Plain Language Explanation
                </h3>
                <div className="bg-blue-50 p-4 rounded-3px border border-blue-200">
                  <p className="text-blue-800 leading-relaxed">
                    {hsCodeData.plainLanguageExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Historical Trends Tab */}
          {activeTab === "trends" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Import Trend Analysis
              </h3>

              {/* Data Table */}
              <div className="bg-white rounded-3px border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-md font-medium text-gray-800">
                    Detailed Data
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Year
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Volume (Units)
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Value (USD)
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Growth Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hsCodeData.historicalTrends.map((trend, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                            {trend.year}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {trend.volume.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            ${trend.value.toLocaleString()}
                          </td>
                          <td
                            className={`py-3 px-4 text-sm font-medium ${
                              trend.growth > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {trend.growth > 0 ? "+" : ""}
                            {trend.growth}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
                {/* Volume Trend Chart */}
                <div className="bg-gray-50 p-4 rounded-3px">
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    Volume Trend (Units)
                  </h4>
                  <svg
                    width="100%"
                    height="200"
                    viewBox="0 0 400 200"
                    className="border rounded"
                  >
                    <defs>
                      <linearGradient
                        id="volumeGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#0d9488", stopOpacity: 0.3 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#0d9488", stopOpacity: 0.1 }}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="50"
                        y1={40 + i * 32}
                        x2="380"
                        y2={40 + i * 32}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Volume line and area */}
                    <path
                      d="M 50 140 L 160 120 L 270 100 L 380 80"
                      stroke="#0d9488"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M 50 140 L 160 120 L 270 100 L 380 80 L 380 168 L 50 168 Z"
                      fill="url(#volumeGradient)"
                    />

                    {/* Data points */}
                    {hsCodeData.historicalTrends.map((trend, index) => (
                      <circle
                        key={index}
                        cx={50 + index * 110}
                        cy={168 - (trend.volume - 1200000) / 10000}
                        r="4"
                        fill="#0d9488"
                      />
                    ))}

                    {/* Y-axis labels */}
                    <text
                      x="40"
                      y="45"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      1.6M
                    </text>
                    <text
                      x="40"
                      y="77"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      1.5M
                    </text>
                    <text
                      x="40"
                      y="109"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      1.4M
                    </text>
                    <text
                      x="40"
                      y="141"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      1.3M
                    </text>
                    <text
                      x="40"
                      y="173"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      1.2M
                    </text>

                    {/* X-axis labels */}
                    {hsCodeData.historicalTrends.map((trend, index) => (
                      <text
                        key={index}
                        x={50 + index * 110}
                        y="185"
                        fontSize="10"
                        fill="#6b7280"
                        textAnchor="middle"
                      >
                        {trend.year}
                      </text>
                    ))}
                  </svg>
                </div>

                {/* Value Trend Chart */}
                <div className="bg-gray-50 p-4 rounded-3px">
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    Value Trend (USD)
                  </h4>
                  <svg
                    width="100%"
                    height="200"
                    viewBox="0 0 400 200"
                    className="border rounded"
                  >
                    <defs>
                      <linearGradient
                        id="valueGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#14b8a6", stopOpacity: 0.3 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#14b8a6", stopOpacity: 0.1 }}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="50"
                        y1={40 + i * 32}
                        x2="380"
                        y2={40 + i * 32}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Value line and area */}
                    <path
                      d="M 50 140 L 160 115 L 270 85 L 380 60"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M 50 140 L 160 115 L 270 85 L 380 60 L 380 168 L 50 168 Z"
                      fill="url(#valueGradient)"
                    />

                    {/* Data points */}
                    {hsCodeData.historicalTrends.map((trend, index) => (
                      <circle
                        key={index}
                        cx={50 + index * 110}
                        cy={168 - (trend.value - 2400000000) / 10000000}
                        r="4"
                        fill="#14b8a6"
                      />
                    ))}

                    {/* Y-axis labels */}
                    <text
                      x="40"
                      y="45"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      $3.5B
                    </text>
                    <text
                      x="40"
                      y="77"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      $3.2B
                    </text>
                    <text
                      x="40"
                      y="109"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      $2.9B
                    </text>
                    <text
                      x="40"
                      y="141"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      $2.6B
                    </text>
                    <text
                      x="40"
                      y="173"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      $2.3B
                    </text>

                    {/* X-axis labels */}
                    {hsCodeData.historicalTrends.map((trend, index) => (
                      <text
                        key={index}
                        x={50 + index * 110}
                        y="185"
                        fontSize="10"
                        fill="#6b7280"
                        textAnchor="middle"
                      >
                        {trend.year}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 p-4 rounded-3px border border-yellow-200">
                <p className="text-yellow-800">
                  <strong>Market Insight:</strong> This product category shows
                  consistent growth over the past 4 years, indicating strong
                  market demand and stable trade conditions.
                </p>
              </div>
            </div>
          )}

          {/* Recent News Tab */}
          {activeTab === "news" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent News & Updates
              </h3>
              <div className="space-y-4">
                {hsCodeData.recentNews.map((news, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-3px border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {news.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{news.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                    <p className="text-xs text-gray-500">
                      Source: {news.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HSCodeDetails;
