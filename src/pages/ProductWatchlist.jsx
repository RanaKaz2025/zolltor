import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Upload,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
} from "lucide-react";
import dummyData from "../data/dummyData.json";

const ProductWatchlist = ({ user }) => {
  const [baseCountry, setBaseCountry] = useState(user?.country || "US");
  const [selectedItems, setSelectedItems] = useState([]);
  const [watchlistData, setWatchlistData] = useState(dummyData.watchlist);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(watchlistData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRemoveSelected = () => {
    setWatchlistData(
      watchlistData.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  const getChangeIcon = (description) => {
    if (
      description.toLowerCase().includes("reduction") ||
      description.toLowerCase().includes("decrease")
    ) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    } else if (description.toLowerCase().includes("increase")) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getRowColor = (description) => {
    if (
      description.toLowerCase().includes("reduction") ||
      description.toLowerCase().includes("decrease")
    ) {
      return "bg-green-50";
    } else if (description.toLowerCase().includes("increase")) {
      return "bg-red-50";
    }
    return "bg-white";
  };

  const importItems = watchlistData.filter((item) => item.type === "import");
  const exportItems = watchlistData.filter((item) => item.type === "export");

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would parse the CSV file here
      alert("CSV upload functionality would be implemented here");
    }
  };

  const handleCSVDownload = () => {
    // In a real app, you would generate and download a CSV file
    alert("CSV download functionality would be implemented here");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Watchlist
            </h1>
            <p className="text-gray-600">
              Monitor tariff changes for your critical trade routes
            </p>
          </div>

          {/* Country Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Country (Your Location)
            </label>
            <select
              value={baseCountry}
              onChange={(e) => setBaseCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {dummyData.countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Upload CSV</span>
              </label>
            </label>

            <button
              onClick={handleCSVDownload}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={handleRemoveSelected}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Remove Selected ({selectedItems.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Import Watchlist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Import Watchlist (Products coming into{" "}
            {dummyData.countries.find((c) => c.code === baseCountry)?.name})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === importItems.length &&
                      importItems.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  HS Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Current Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Last Change
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Next Change
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {importItems.map((item) => (
                <tr
                  key={item.id}
                  className={`${getRowColor(
                    item.nextChange.description
                  )} border-b border-gray-100`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      to={`/hscode/${item.hsCode}`}
                      className="text-primary-600 hover:text-primary-800 font-mono"
                    >
                      {item.hsCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {
                      dummyData.countries.find((c) => c.code === item.origin)
                        ?.flag
                    }{" "}
                    {item.origin}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {item.currentRate}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{item.lastChange.date}</div>
                    <div className="text-xs text-gray-500">
                      {item.lastChange.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(item.nextChange.description)}
                      <div>
                        <div className="text-gray-900">
                          {item.nextChange.date}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.nextChange.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/hscode/${item.hsCode}`}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                    >
                      <Eye size={16} />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {importItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No import items in your watchlist yet. Start by searching for
              tariffs and adding them to your watchlist.
            </div>
          )}
        </div>
      </div>

      {/* Export Watchlist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Export Watchlist (Products going from{" "}
            {dummyData.countries.find((c) => c.code === baseCountry)?.name})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  HS Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Current Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Last Change
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Next Change
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {exportItems.map((item) => (
                <tr
                  key={item.id}
                  className={`${getRowColor(
                    item.nextChange.description
                  )} border-b border-gray-100`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      to={`/hscode/${item.hsCode}`}
                      className="text-primary-600 hover:text-primary-800 font-mono"
                    >
                      {item.hsCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {
                      dummyData.countries.find(
                        (c) => c.code === item.destination
                      )?.flag
                    }{" "}
                    {item.destination}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {item.currentRate}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{item.lastChange.date}</div>
                    <div className="text-xs text-gray-500">
                      {item.lastChange.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(item.nextChange.description)}
                      <div>
                        <div className="text-gray-900">
                          {item.nextChange.date}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.nextChange.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/hscode/${item.hsCode}`}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                    >
                      <Eye size={16} />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {exportItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No export items in your watchlist yet. Start by searching for
              tariffs and adding them to your watchlist.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductWatchlist;
