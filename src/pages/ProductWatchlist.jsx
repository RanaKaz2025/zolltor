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
  Plus,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import dummyData from "../data/dummyData.json";

const ProductWatchlist = ({ user }) => {
  const [baseCountry, setBaseCountry] = useState(user?.country || "US");
  const [selectedImportItems, setSelectedImportItems] = useState([]);
  const [selectedExportItems, setSelectedExportItems] = useState([]);
  const [watchlistData, setWatchlistData] = useState(dummyData.watchlist);
  const [activeTab, setActiveTab] = useState("import");
  const toast = useToast();

  const handleSelectAllImport = (e) => {
    if (e.target.checked) {
      setSelectedImportItems(importItems.map((item) => item.id));
    } else {
      setSelectedImportItems([]);
    }
  };

  const handleSelectAllExport = (e) => {
    if (e.target.checked) {
      setSelectedExportItems(exportItems.map((item) => item.id));
    } else {
      setSelectedExportItems([]);
    }
  };

  const handleSelectImportItem = (id) => {
    if (selectedImportItems.includes(id)) {
      setSelectedImportItems(selectedImportItems.filter((item) => item !== id));
    } else {
      setSelectedImportItems([...selectedImportItems, id]);
    }
  };

  const handleSelectExportItem = (id) => {
    if (selectedExportItems.includes(id)) {
      setSelectedExportItems(selectedExportItems.filter((item) => item !== id));
    } else {
      setSelectedExportItems([...selectedExportItems, id]);
    }
  };

  const handleRemoveSelectedImport = () => {
    setWatchlistData(
      watchlistData.filter((item) => !selectedImportItems.includes(item.id))
    );
    setSelectedImportItems([]);
  };

  const handleRemoveSelectedExport = () => {
    setWatchlistData(
      watchlistData.filter((item) => !selectedExportItems.includes(item.id))
    );
    setSelectedExportItems([]);
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

  const handleCSVUpload = () => {
    // In a real app, you would parse the CSV file here
    toast.warning(
      "CSV upload functionality would be implemented in production",
      4000
    );
  };

  const handleAddImportItem = () => {
    // In a real app, this would open a form or modal to add new item
    toast.info(
      "Add new import item functionality would be implemented in production",
      4000
    );
  };

  const handleAddExportItem = () => {
    // In a real app, this would open a form or modal to add new item
    toast.info(
      "Add new export item functionality would be implemented in production",
      4000
    );
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

          <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Country (Your Location)
            </label>
            <select
              value={baseCountry}
              onChange={(e) => setBaseCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
      {/* Bulk Actions */} {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-1 flex">
          <button
            onClick={() => setActiveTab("import")}
            className={`px-6 py-3 rounded-3px transition-colors ${
              activeTab === "import"
                ? "bg-teal-700 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Import Watchlist
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-6 py-3 rounded-3px transition-colors ${
              activeTab === "export"
                ? "bg-teal-700 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Export Watchlist
          </button>
        </div>
      </div>
      {/* Import Watchlist */}
      {activeTab === "import" && (
        <div className="bg-white rounded-3px shadow-sm border border-gray-200 mb-8">
          <div className="p-[16px] border-b border-gray-200 flex justify-between items-center min-h-[40px]">
            <h2 className="text-xl font-semibold text-gray-900">
              Import Watchlist (Products coming into{" "}
              {dummyData.countries.find((c) => c.code === baseCountry)?.name})
            </h2>
            <div className="flex items-center gap-2 h-10">
              {selectedImportItems.length > 0 ? (
                <button
                  onClick={handleRemoveSelectedImport}
                  className="bg-red-600 text-white px-4 py-2 rounded-3px hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Remove Selected ({selectedImportItems.length})</span>
                </button>
              ) : (
                <div className="w-0 h-10"></div>
              )}
              <div className="rounded-3px">
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex items-center space-x-2"
                      onClick={handleCSVUpload}
                    >
                      <label
                        htmlFor="csv-upload"
                        className="bg-gray-600 text-white px-4 py-2 rounded-3px hover:bg-gray-700 transition-colors cursor-pointer flex items-center space-x-2"
                      >
                        <Upload size={16} />
                        <span>Upload CSV</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedImportItems.length === importItems.length &&
                        importItems.length > 0
                      }
                      onChange={handleSelectAllImport}
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
                    Tax
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
                        checked={selectedImportItems.includes(item.id)}
                        onChange={() => handleSelectImportItem(item.id)}
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
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

          {/* Add Import Item Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleAddImportItem}
              className="w-[15%] bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-3px transition-colors flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Plus size={20} />
              <span>Add New</span>
            </button>
          </div>
        </div>
      )}
      {/* Export Watchlist */}
      {activeTab === "export" && (
        <div className="bg-white rounded-3px shadow-sm border border-gray-200">
          <div className="p-[16px] border-b border-gray-200 flex justify-between items-center min-h-[40px]">
            <h2 className="text-xl font-semibold text-gray-900">
              Export Watchlist (Products going from{" "}
              {dummyData.countries.find((c) => c.code === baseCountry)?.name})
            </h2>
            <div className="flex items-center gap-2 h-10">
              {selectedExportItems.length > 0 ? (
                <button
                  onClick={handleRemoveSelectedExport}
                  className="bg-red-600 text-white px-4 py-2 rounded-3px hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Remove Selected ({selectedExportItems.length})</span>
                </button>
              ) : (
                <div className="w-0 h-10"></div>
              )}
              <div className="rounded-3px">
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex items-center space-x-2"
                      onClick={handleCSVUpload}
                    >
                      <label
                        htmlFor="csv-upload"
                        className="bg-gray-600 text-white px-4 py-2 rounded-3px hover:bg-gray-700 transition-colors cursor-pointer flex items-center space-x-2"
                      >
                        <Upload size={16} />
                        <span>Upload CSV</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedExportItems.length === exportItems.length &&
                        exportItems.length > 0
                      }
                      onChange={handleSelectAllExport}
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
                    Tax
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
                        checked={selectedExportItems.includes(item.id)}
                        onChange={() => handleSelectExportItem(item.id)}
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
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

          {/* Add Export Item Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleAddExportItem}
              className="w-[15%] bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-3px transition-colors flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Plus size={20} />
              <span>Add New</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductWatchlist;
