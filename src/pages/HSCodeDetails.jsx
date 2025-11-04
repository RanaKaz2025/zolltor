import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, FileText } from "lucide-react";
import dummyData from "../data/dummyData.json";
import NewsIcon from "../components/NewsIcon";

const HSCodeDetails = () => {
  const { code } = useParams();
  const location = useLocation();
  const [hsCodeData, setHsCodeData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate CAGR (Compound Annual Growth Rate)
  const calculateCAGR = (startValue, endValue, years) => {
    return ((endValue / startValue) ** (1 / years) - 1) * 100;
  };

  // Calculate total for each year
  const calculateYearTotal = (year) => {
    if (!hsCodeData) return 0;
    return hsCodeData.historicalTrends.reduce(
      (sum, country) => sum + country[year],
      0
    );
  };

  // Colors for different countries in the chart
  const countryColors = {
    China: "#ef4444",
    USA: "#3b82f6",
    Vietnam: "#10b981",
    Japan: "#f59e0b",
    Turkey: "#8b5cf6",
    Other: "#6b7280",
  };

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
        { origin: "China", 2021: 850, 2022: 920, 2023: 980, 2024: 1050 },
        { origin: "USA", 2021: 650, 2022: 680, 2023: 720, 2024: 750 },
        { origin: "Vietnam", 2021: 320, 2022: 380, 2023: 450, 2024: 520 },
        { origin: "Japan", 2021: 280, 2022: 290, 2023: 310, 2024: 330 },
        { origin: "Turkey", 2021: 180, 2022: 200, 2023: 220, 2024: 240 },
        { origin: "Other", 2021: 220, 2022: 230, 2023: 240, 2024: 250 },
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

  // Handle activeTab from navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
      <div className="">
        <Link
          to="/watchlist"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-30-bold text-gray-700 mb-[2px]">
              HS Code: {hsCodeData.code}
            </h1>
            <p className="text-16-regular text-gray-500">
              {hsCodeData.description}
            </p>
            {/* <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {hsCodeData.category}
            </span> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3px  mb-8 mt-4">
        <div className="py-1">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`section-navigation ${
                    activeTab === tab.id ? "active" : "inactive"
                  } flex items-center space-x-2`}
                >
                  {tab.id === "news" ? (
                    <NewsIcon isActive={activeTab === tab.id} />
                  ) : (
                    <Icon size={18} />
                  )}
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
                <h3 className="text-20-bold text-gray-800 mb-3">
                  Regulatory Text
                </h3>

                <p className="text-gray-700 text-16-regular">
                  {hsCodeData.regulatoryText}
                </p>
              </div>

              <div className="px-3 py-2 rounded-[3px] border-l-2 bg-sky-50 border-sky-300 mt-2">
                <h3 className="text-16-medium text-gray-700 mb-1">
                  Plain Language Explanation
                </h3>
                <p className="text-16-regular text-gray-700">
                  {hsCodeData.plainLanguageExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Historical Trends Tab */}
          {activeTab === "trends" && (
            <div>
              <h3 className="text-20-bold text-gray-800 mb-3">
                Annual Imports of {code} to the EU by country (€M):
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Table */}
                <div className="bg-white rounded-3px border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left text-16-medium py-3 px-4 text-gray-800">
                            Origin
                          </th>
                          <th className="text-center py-3 px-2 text-16-regular text-gray-700">
                            2021 (€)
                          </th>
                          <th className="text-center py-3 px-2 text-16-regular text-gray-700">
                            2022 (€)
                          </th>
                          <th className="text-center py-3 px-2 text-16-regular text-gray-700">
                            2023 (€)
                          </th>
                          <th className="text-center py-3 px-2 text-16-regular text-gray-700">
                            2024 (€)
                          </th>
                          <th className="text-center py-3 px-2 text-16-regular text-gray-700">
                            CAGR
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hsCodeData.historicalTrends.map((country, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-16-medium text-gray-700">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      countryColors[country.origin],
                                  }}
                                ></div>
                                <span>{country.origin}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-2 text-16-regular text-gray-700">
                              €{country[2021]}M
                            </td>
                            <td className="text-center py-3 px-2 text-16-regular text-gray-700">
                              €{country[2022]}M
                            </td>
                            <td className="text-center py-3 px-2 text-16-regular text-gray-700">
                              €{country[2023]}M
                            </td>
                            <td className="text-center py-3 px-2 text-16-regular text-gray-700">
                              €{country[2024]}M
                            </td>
                            <td className="text-center py-3 px-2 text-16-regular text-gray-700">
                              <span
                                className={`${
                                  calculateCAGR(
                                    country[2021],
                                    country[2024],
                                    3
                                  ) > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {calculateCAGR(
                                  country[2021],
                                  country[2024],
                                  3
                                ) > 0
                                  ? "+"
                                  : ""}
                                {calculateCAGR(
                                  country[2021],
                                  country[2024],
                                  3
                                ).toFixed(1)}
                                %
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                          <td className="py-3 px-4 text-16-medium text-gray-700">
                            Total
                          </td>
                          <td className="text-center py-3 px-2 text-16-medium text-gray-700">
                            €{calculateYearTotal(2021)}M
                          </td>
                          <td className="text-center py-3 px-2 text-16-medium text-gray-700">
                            €{calculateYearTotal(2022)}M
                          </td>
                          <td className="text-center py-3 px-2 text-16-medium text-gray-700">
                            €{calculateYearTotal(2023)}M
                          </td>
                          <td className="text-center py-3 px-2 text-16-medium text-gray-700">
                            €{calculateYearTotal(2024)}M
                          </td>
                          <td className="text-center py-3 px-2 text-sm">
                            <span
                              className={`${
                                calculateCAGR(
                                  calculateYearTotal(2021),
                                  calculateYearTotal(2024),
                                  3
                                ) > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {calculateCAGR(
                                calculateYearTotal(2021),
                                calculateYearTotal(2024),
                                3
                              ) > 0
                                ? "+"
                                : ""}
                              {calculateCAGR(
                                calculateYearTotal(2021),
                                calculateYearTotal(2024),
                                3
                              ).toFixed(1)}
                              %
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stacked Area Chart */}
                <div className="bg-white rounded-3px ">
                  <svg
                    width="100%"
                    height="400"
                    viewBox="0 0 500 400"
                    className="border rounded"
                  >
                    <defs>
                      {Object.entries(countryColors).map(([country, color]) => (
                        <linearGradient
                          key={country}
                          id={`gradient-${country}`}
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: color, stopOpacity: 0.8 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: color, stopOpacity: 0.3 }}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <line
                        key={i}
                        x1="80"
                        y1={50 + i * 50}
                        x2="450"
                        y2={50 + i * 50}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    {[3000, 2500, 2000, 1500, 1000, 500].map((value, i) => (
                      <text
                        key={i}
                        x="70"
                        y={55 + i * 50}
                        fontSize="12"
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        €{value}M
                      </text>
                    ))}

                    {/* Stacked areas */}
                    {hsCodeData.historicalTrends.map(
                      (country, countryIndex) => {
                        const years = [2021, 2022, 2023, 2024];
                        let cumulativeValues = [0, 0, 0, 0];

                        // Calculate cumulative values for stacking
                        for (let i = 0; i <= countryIndex; i++) {
                          years.forEach((year, yearIndex) => {
                            cumulativeValues[yearIndex] +=
                              hsCodeData.historicalTrends[i][year];
                          });
                        }

                        let previousCumulativeValues = [0, 0, 0, 0];
                        if (countryIndex > 0) {
                          for (let i = 0; i < countryIndex; i++) {
                            years.forEach((year, yearIndex) => {
                              previousCumulativeValues[yearIndex] +=
                                hsCodeData.historicalTrends[i][year];
                            });
                          }
                        }

                        const pathTop = years
                          .map((year, i) => {
                            const x = 80 + i * 123.33;
                            const y = 300 - (cumulativeValues[i] / 3000) * 250;
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                          })
                          .join(" ");

                        const pathBottom = years
                          .map((year, i) => {
                            const x = 80 + (3 - i) * 123.33;
                            const y =
                              300 -
                              (previousCumulativeValues[3 - i] / 3000) * 250;
                            return `L ${x} ${y}`;
                          })
                          .join(" ");

                        return (
                          <path
                            key={country.origin}
                            d={`${pathTop} ${pathBottom} Z`}
                            fill={`url(#gradient-${country.origin})`}
                            stroke={countryColors[country.origin]}
                            strokeWidth="2"
                          />
                        );
                      }
                    )}

                    {/* X-axis labels */}
                    {[2021, 2022, 2023, 2024].map((year, index) => (
                      <text
                        key={year}
                        x={80 + index * 123.33}
                        y="330"
                        fontSize="12"
                        fill="#6b7280"
                        textAnchor="middle"
                      >
                        {year}
                      </text>
                    ))}

                    {/* Legend */}
                    <g transform="translate(80, 350)">
                      {hsCodeData.historicalTrends.map((country, index) => (
                        <g
                          key={country.origin}
                          transform={`translate(${index * 60}, 0)`}
                        >
                          <rect
                            x="0"
                            y="0"
                            width="12"
                            height="12"
                            fill={countryColors[country.origin]}
                          />
                          <text x="16" y="9" fontSize="10" fill="#374151">
                            {country.origin}
                          </text>
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>
              </div>

              <div className="mt-6 p-4 px-3 py-2 rounded-[3px] border-l-2 bg-sky-50 border-sky-300">
                <h4 className="text-gray-700 text-16-medium mb-2">
                  Notes on Import Trends:
                </h4>
                <ul className="text-16-regular text-gray-700 space-y-1 list-disc pl-5">
                  <li>
                    Vietnam's rapid increase reflects preferential access under
                    EVFTA.
                  </li>
                  <li>
                    China remains the dominant supplier despite anti-dumping
                    risks.
                  </li>
                  <li>
                    Growth is steady across countries due to increased
                    automation and machinery demand in the EU.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Recent News Tab */}
          {activeTab === "news" && (
            <div>
              <h3 className="text-20-bold text-gray-800 mb-3">
                Recent News & Updates
              </h3>
              <div className="">
                {hsCodeData.recentNews.map((news, index) => (
                  <div key={index}>
                    <span className="text-14-regular text-gray-700">
                      {news.date}
                    </span>

                    <h4 className="text-18-bold text-gray-800 pt-3 pb-2">
                      {news.title}
                    </h4>

                    <p className="text-16-regular text-gray-700 mb-2">
                      {news.summary}
                    </p>
                    <p className="text-14-regular text-gray-700">
                      Source: {news.source}
                    </p>
                    {index < hsCodeData.recentNews.length - 1 && (
                      <hr className="my-8" />
                    )}
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
