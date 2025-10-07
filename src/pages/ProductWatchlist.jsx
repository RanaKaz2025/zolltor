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
  X,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import dummyData from "../data/dummyData.json";

const ProductWatchlist = ({ user }) => {
  const [baseCountry, setBaseCountry] = useState(user?.country || "US");
  const [selectedImportItems, setSelectedImportItems] = useState([]);
  const [selectedExportItems, setSelectedExportItems] = useState([]);
  const [watchlistData, setWatchlistData] = useState(dummyData.watchlist);
  const [activeTab, setActiveTab] = useState("import");
  const [newImportRow, setNewImportRow] = useState(null);
  const [newExportRow, setNewExportRow] = useState(null);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [selectedChangeInfo, setSelectedChangeInfo] = useState(null);
  const toast = useToast();

  // Function to format date to MMM YYYY format
  const formatDate = (dateString) => {
    if (!dateString || dateString === "TBD") return dateString;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid date

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  const handleSelectAllImport = (e) => {
    if (e.target.checked) {
      setSelectedImportItems(importItems.map((item) => item.id));
    } else {
      setSelectedImportItems([]);
    }
  };

  // Function to get detailed reason for tariff changes
  const getChangeReason = (changeType, description, origin, destination) => {
    const reasons = {
      "FTA rate reduction": `Tariffs for this good in the EU-${
        origin === "JP" ? "Japan" : origin
      } FTA decline to 0% on 1 February 2026`,
      "Anti-dumping duties": `Anti-dumping duties of 10% will be applied to ${
        origin === "CN" ? "Chinese" : origin
      } imports starting 1 December 2026`,
      "Safeguard measures": `Temporary safeguard measures of 15% will be imposed on imports from ${origin} effective 15 March 2026`,
      "GSP suspension": `Generalized System of Preferences benefits will be suspended for ${origin} starting 1 June 2026`,
      "Trade agreement": `New bilateral trade agreement with ${origin} reduces tariffs to 2.5% from 1 September 2026`,
      "WTO ruling": `Following WTO dispute settlement, tariffs on this product will be adjusted to 5% from 1 November 2026`,
      default:
        description.includes("reduction") || description.includes("decrease")
          ? `Tariffs for this good in the EU-${origin} trade agreement decline to 0% on the specified date`
          : `Anti-dumping duties will be applied to imports from ${origin} starting on the specified date`,
    };

    // Try to match the description with known patterns
    for (const [key, reason] of Object.entries(reasons)) {
      if (
        description.toLowerCase().includes(key.toLowerCase()) ||
        description.toLowerCase().includes(key.split(" ")[0].toLowerCase())
      ) {
        return reason;
      }
    }

    return reasons.default;
  };

  // Handle clicking on change information
  const handleChangeClick = (item, changeType) => {
    const change = changeType === "last" ? item.lastChange : item.nextChange;
    const detailedReason = getChangeReason(
      changeType,
      change.description,
      item.origin || item.destination,
      item.destination || item.origin
    );

    setSelectedChangeInfo({
      type: changeType,
      date: change.date,
      description: change.description,
      detailedReason: detailedReason,
      productName: item.productName,
      hsCode: item.hsCode,
    });
    setShowChangeDialog(true);
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
    setNewImportRow({
      id: "new-import",
      productName: "",
      hsCode: "",
      origin: "",
      currentRate: "",
      tax: "",
      lastChange: { date: "", description: "" },
      nextChange: { date: "", description: "" },
    });
  };

  const handleAddExportItem = () => {
    setNewExportRow({
      id: "new-export",
      productName: "",
      hsCode: "",
      destination: "",
      currentRate: "",
      tax: "",
      lastChange: { date: "", description: "" },
      nextChange: { date: "", description: "" },
    });
  };

  const handleSaveNewImportItem = () => {
    if (
      newImportRow.productName &&
      newImportRow.hsCode &&
      newImportRow.origin
    ) {
      const currentDate = new Date();
      const newItem = {
        ...newImportRow,
        id: Date.now(), // Generate unique ID
        type: "import",
        currentRate: parseFloat(newImportRow.currentRate) || 0,
        tax: parseFloat(newImportRow.tax) || 0,
        lastChange: {
          date: currentDate.toISOString().split("T")[0], // Use YYYY-MM-DD format for consistency
          description: "Added to watchlist",
        },
        nextChange: {
          date: "TBD",
          description: "No changes scheduled",
        },
      };
      setWatchlistData([...watchlistData, newItem]);
      setNewImportRow(null);
      toast.success("Import item added to watchlist!");
    } else {
      toast.error(
        "Please fill in all required fields (Product, HS Code, Origin)"
      );
    }
  };

  const handleSaveNewExportItem = () => {
    if (
      newExportRow.productName &&
      newExportRow.hsCode &&
      newExportRow.destination
    ) {
      const currentDate = new Date();
      const newItem = {
        ...newExportRow,
        id: Date.now(), // Generate unique ID
        type: "export",
        currentRate: parseFloat(newExportRow.currentRate) || 0,
        tax: parseFloat(newExportRow.tax) || 0,
        lastChange: {
          date: currentDate.toISOString().split("T")[0], // Use YYYY-MM-DD format for consistency
          description: "Added to watchlist",
        },
        nextChange: {
          date: "TBD",
          description: "No changes scheduled",
        },
      };
      setWatchlistData([...watchlistData, newItem]);
      setNewExportRow(null);
      toast.success("Export item added to watchlist!");
    } else {
      toast.error(
        "Please fill in all required fields (Product, HS Code, Destination)"
      );
    }
  };

  const handleCancelNewRow = (type) => {
    if (type === "import") {
      setNewImportRow(null);
    } else {
      setNewExportRow(null);
    }
  };

  const handleNewRowChange = (type, field, value) => {
    if (type === "import") {
      setNewImportRow((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewExportRow((prev) => ({ ...prev, [field]: value }));
    }
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
                    Product Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    HS Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Origin
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Duty Rate
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
                          ?.name
                      }{" "}
                      ({item.origin})
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {item.currentRate}% (MFN + AD)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleChangeClick(item, "last")}
                        className="text-left  transition-colors focus:outline-none"
                      >
                        <div>
                          <div className="underline text-primary-600 hover:text-primary-700">
                            {formatDate(item.lastChange.date)}:
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.lastChange.description}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleChangeClick(item, "next")}
                        className="text-left  transition-colors focus:outline-none"
                      >
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(item.nextChange.description)}
                          <div>
                            <div className="underline text-primary-600 hover:text-primary-700">
                              {formatDate(item.nextChange.date)}:
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.nextChange.description}
                            </div>
                          </div>
                        </div>
                      </button>
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

                {/* New Import Row */}
                {newImportRow && (
                  <tr className="bg-blue-50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        disabled
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={newImportRow.productName}
                        onChange={(e) =>
                          handleNewRowChange(
                            "import",
                            "productName",
                            e.target.value
                          )
                        }
                        placeholder="Product name"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={newImportRow.hsCode}
                        onChange={(e) =>
                          handleNewRowChange("import", "hsCode", e.target.value)
                        }
                        placeholder="HS Code"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px font-mono"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={newImportRow.origin}
                        onChange={(e) =>
                          handleNewRowChange("import", "origin", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                      >
                        <option value="">Select origin</option>
                        {dummyData.countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={newImportRow.currentRate}
                        onChange={(e) =>
                          handleNewRowChange(
                            "import",
                            "currentRate",
                            e.target.value
                          )
                        }
                        placeholder="Rate"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={newImportRow.tax}
                        onChange={(e) =>
                          handleNewRowChange("import", "tax", e.target.value)
                        }
                        placeholder="Tax"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      Will be set automatically
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      Will be set automatically
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSaveNewImportItem}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded-3px hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelNewRow("import")}
                          className="px-2 py-1 bg-gray-600 text-white text-xs rounded-3px hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
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
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleAddImportItem}
              disabled={newImportRow !== null}
              className={`w-[150px] py-3 px-2 rounded-3px transition-colors flex items-center justify-center space-x-2 border-2 border-dashed ${
                newImportRow
                  ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
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
                    Product Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    HS Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Duty Rate
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
                        )?.name
                      }{" "}
                      ({item.destination})
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {item.currentRate}% (CU)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleChangeClick(item, "last")}
                        className="text-left transition-colors focus:outline-none"
                      >
                        <div>
                          <div className="underline text-primary-600 hover:text-primary-700">
                            {formatDate(item.lastChange.date)}:
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.lastChange.description}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleChangeClick(item, "next")}
                        className="text-left transition-colors focus:outline-none"
                      >
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(item.nextChange.description)}
                          <div>
                            <div className="underline text-primary-600 hover:text-primary-700">
                              {formatDate(item.nextChange.date)}:
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.nextChange.description}
                            </div>
                          </div>
                        </div>
                      </button>
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

                {/* New Export Row */}
                {newExportRow && (
                  <tr className="bg-blue-50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        disabled
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={newExportRow.productName}
                        onChange={(e) =>
                          handleNewRowChange(
                            "export",
                            "productName",
                            e.target.value
                          )
                        }
                        placeholder="Product name"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={newExportRow.hsCode}
                        onChange={(e) =>
                          handleNewRowChange("export", "hsCode", e.target.value)
                        }
                        placeholder="HS Code"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px font-mono"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={newExportRow.destination}
                        onChange={(e) =>
                          handleNewRowChange(
                            "export",
                            "destination",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                      >
                        <option value="">Select destination</option>
                        {dummyData.countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={newExportRow.currentRate}
                        onChange={(e) =>
                          handleNewRowChange(
                            "export",
                            "currentRate",
                            e.target.value
                          )
                        }
                        placeholder="Rate"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={newExportRow.tax}
                        onChange={(e) =>
                          handleNewRowChange("export", "tax", e.target.value)
                        }
                        placeholder="Tax"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-3px"
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      Will be set automatically
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      Will be set automatically
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSaveNewExportItem}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded-3px hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelNewRow("export")}
                          className="px-2 py-1 bg-gray-600 text-white text-xs rounded-3px hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
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
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleAddExportItem}
              disabled={newExportRow !== null}
              className={`w-[150px] py-3 px-2 rounded-3px transition-colors flex items-center justify-center space-x-2 border-2 border-dashed ${
                newExportRow
                  ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <Plus size={20} />
              <span>Add New</span>
            </button>
          </div>
        </div>
      )}
      {/* Change Detail Dialog */}
      {showChangeDialog && selectedChangeInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedChangeInfo.type === "last"
                    ? "Last Change Details"
                    : "Next Change Details"}
                </h3>
                <button
                  onClick={() => setShowChangeDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-600">HS Code:</span>
                    <span className="ml-2 font-mono font-medium">
                      {selectedChangeInfo.hsCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Change Date:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(selectedChangeInfo.date)}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-sm text-gray-700">
                    Anti-dumping duties of 10% will be applied to Chinese
                    imports starting 1 December 2026
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowChangeDialog(false)}
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

export default ProductWatchlist;
