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
  ExternalLink,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import Select from "../components/Select";
import dummyData from "../data/dummyData.json";

const ProductWatchlist = ({ user }) => {
  const [baseCountry, setBaseCountry] = useState(user?.country || "US");
  const [selectedImportItems, setSelectedImportItems] = useState([]);
  const [selectedExportItems, setSelectedExportItems] = useState([]);
  const [watchlistData, setWatchlistData] = useState(dummyData.watchlist);
  const [activeTab, setActiveTab] = useState("watchlist");
  const [watchlistType, setWatchlistType] = useState("import");
  const [newImportRow, setNewImportRow] = useState(null);
  const [newExportRow, setNewExportRow] = useState(null);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [selectedChangeInfo, setSelectedChangeInfo] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Past Week");
  const toast = useToast();

  // Function to get changes text based on selected time period
  const getChangesText = (timePeriod) => {
    const changes =
      watchlistType === "import"
        ? dummyData.changesData[timePeriod]
        : dummyData.exportChangesData[timePeriod];
    if (!changes || changes.length === 0) {
      return [
        {
          title: "No changes found",
          description: "No changes found for the selected time period.",
        },
      ];
    }

    return changes;
  };

  // Function to group upcoming changes by type
  const groupUpcomingChangesByType = (changes) => {
    const grouped = {};
    changes.forEach((change) => {
      if (!grouped[change.type]) {
        grouped[change.type] = [];
      }
      grouped[change.type].push(change);
    });
    return grouped;
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
  };

  const getRowColor = (description, index, isSelected) => {
    if (isSelected) {
      return "bg-teal-50";
    }
    return index % 2 === 1 ? "bg-gray-50" : "bg-white";
  };

  const importItems = watchlistData.filter((item) => item.type === "import");
  const exportItems = watchlistData.filter((item) => item.type === "export");

  const tabs = [
    { id: "watchlist", label: "Watchlist" },
    { id: "whatHasChanged", label: "What Has Changed" },
    { id: "upcomingChanges", label: "Upcoming Changes" },
  ];

  const handleCSVUpload = () => {
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
    if (newImportRow.hsCode && newImportRow.origin) {
      const currentDate = new Date();
      const newItem = {
        ...newImportRow,
        id: Date.now(),
        type: "import",
        productName:
          newImportRow.productName || `Product ${newImportRow.hsCode}`,
        currentRate: 0,
        tax: 0,
        lastChange: {
          date: currentDate.toISOString().split("T")[0],
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
      toast.error("Please fill in HS Code and Origin");
    }
  };

  const handleSaveNewExportItem = () => {
    if (newExportRow.hsCode && newExportRow.destination) {
      const currentDate = new Date();
      const newItem = {
        ...newExportRow,
        id: Date.now(),
        type: "export",
        productName:
          newExportRow.productName || `Product ${newExportRow.hsCode}`,
        currentRate: 0,
        tax: 0,
        lastChange: {
          date: currentDate.toISOString().split("T")[0],
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
      toast.error("Please fill in HS Code and Destination");
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
      <div className="mb-4">
        <div className="flex justify-between items-start">
          {/* <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Watchlist
            </h1>
          </div> */}

          {/* Import/Export Selector */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 flex border border-gray-200 w-[700px]">
              <button
                onClick={() => setWatchlistType("import")}
                className={`page-navigation ${
                  watchlistType === "import" ? "active" : "inactive"
                }`}
              >
                Import Watchlist
              </button>
              <button
                onClick={() => setWatchlistType("export")}
                className={`page-navigation ${
                  watchlistType === "export" ? "active" : "inactive"
                }`}
              >
                Export Watchlist
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="whitespace-nowrap text-16-medium text-gray-700">
              Base Country (Your Location)
            </label>
            <Select
              value={baseCountry}
              onChange={setBaseCountry}
              options={dummyData.countries.map((country) => ({
                value: country.code,
                label: `${country.flag} ${country.name}`,
              }))}
              placeholder="Select country"
              className="w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3px shadow-sm">
        <div>
          <nav className="flex">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`section-navigation ${
                    activeTab === tab.id ? "active" : "inactive"
                  } flex items-center space-x-2 
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Watchlist Tab */}
          {activeTab === "watchlist" && (
            <div>
              {/* Import Watchlist */}
              {watchlistType === "import" && (
                <div className="px-3 bg-white rounded-3px shadow-sm">
                  <div className="p-[16px] flex justify-between items-center min-h-[40px]">
                    <h2 className="text-18-bold text-gray-700">
                      Import Watchlist (Products coming into{" "}
                      {
                        dummyData.countries.find((c) => c.code === baseCountry)
                          ?.name
                      }
                      )
                    </h2>
                    <div className="flex items-center gap-2 h-10">
                      {selectedImportItems.length > 0 ? (
                        <button
                          onClick={handleRemoveSelectedImport}
                          className="bg-red-700 text-white px-4 py-2 rounded-3px hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <Trash2 size={16} />
                          <span>
                            Remove Selected ({selectedImportItems.length})
                          </span>
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
                                className="btn-tertiary btn-md cursor-pointer flex items-center space-x-2"
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

                  <div className="overflow-auto max-h-[600px]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  selectedImportItems.length ===
                                    importItems.length && importItems.length > 0
                                }
                                onChange={handleSelectAllImport}
                                className=""
                              />
                            </div>
                          </th>
                          <th className="text-left py-3 text-16-medium text-gray-800">
                            Product
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            HS Code
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Origin
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Current Rate
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Tax
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Last Change
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Next Change
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {importItems.map((item, index) => (
                          <tr
                            key={item.id}
                            className={getRowColor(
                              item.nextChange.description,
                              index,
                              selectedImportItems.includes(item.id)
                            )}
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedImportItems.includes(
                                    item.id
                                  )}
                                  onChange={() =>
                                    handleSelectImportItem(item.id)
                                  }
                                  className=""
                                />
                              </div>
                            </td>
                            <td className="py-3 text-16-medium text-gray-700">
                              {item.productName}
                            </td>
                            <td className="px-6 py-3">
                              <Link
                                to={`/hscode/${item.hsCode}`}
                                className="btn-link flex items-center"
                              >
                                {item.hsCode}
                                <ExternalLink
                                  size={16}
                                  className="ml-1 text-primary-600 hover:text-primary-800"
                                />
                              </Link>
                            </td>
                            <td className="px-6 py-3 text-16-regular text-gray-700">
                              {
                                dummyData.countries.find(
                                  (c) => c.code === item.origin
                                )?.name
                              }{" "}
                              ({item.origin})
                            </td>
                            <td className="px-6 py-3">
                              <div className="text-16-medium text-gray-700">
                                {item.currentRate}%
                              </div>
                              <span className="text-16-regular text-gray-500">
                                {item.currentRateOrigin}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="text-16-medium text-gray-700">
                                {item.tax}%
                              </div>
                              <div className="text-16-regular text-gray-500">
                                (VAT+Other Tax)
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div
                                className="text-left btn-link"
                                onClick={() => handleChangeClick(item, "last")}
                              >
                                {item.lastChange.date}
                              </div>
                              <div className="text-16-regular text-gray-500">
                                {item.lastChange.description}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex items-center space-x-1">
                                {item.nextChange.date !== "TBD" &&
                                  getChangeIcon(item.nextChange.description)}
                                <div>
                                  {item.nextChange.date !== "TBD" && (
                                    <>
                                      <div
                                        className="text-left btn-link"
                                        onClick={() =>
                                          handleChangeClick(item, "next")
                                        }
                                      >
                                        {item.nextChange.date}
                                      </div>
                                      <div className="text-16-regular text-gray-500">
                                        {item.nextChange.description}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-16-regular">
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
                          <tr className="bg-gray-50">
                            <td className="px-6 py-3 text-16-medium text-gray-700"></td>
                            <td className="px-6 py-3 text-16-medium text-gray-700"></td>
                            <td className="px-4 py-3 text-16-medium text-gray-700 ">
                              <input
                                type="text"
                                value={newImportRow.hsCode}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  handleNewRowChange("import", "hsCode", value);
                                }}
                                placeholder="HS Code"
                                className="w-[150px] px-2 py-2 border border-gray-300 rounded-3px font-mono text-16-semibold placeholder:text-16-medium"
                              />
                            </td>
                            <td className="py-3 text-16-medium text-gray-700">
                              <Select
                                value={newImportRow.origin}
                                onChange={(value) =>
                                  handleNewRowChange("import", "origin", value)
                                }
                                options={dummyData.countries.map((country) => ({
                                  value: country.code,
                                  label: `${country.flag} ${country.name}`,
                                }))}
                                placeholder="Select origin"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-3 text-16-medium text-gray-700">
                              <div className="flex space-x-1">
                                <button
                                  onClick={handleSaveNewImportItem}
                                  className="btn-primary btn-md mx-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleCancelNewRow("import")}
                                  className="btn-tertiary btn-md mx-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-16-medium text-gray-700"></td>
                            <td className="px-6 py-3 text-xs text-gray-500"></td>
                            <td className="px-6 py-3 text-xs text-gray-500"></td>
                            <td className="px-6 py-3 text-16-medium text-gray-700"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {importItems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No import items in your watchlist yet. Start by
                        searching for tariffs and adding them to your watchlist.
                      </div>
                    )}
                  </div>

                  {/* Add Import Item Button */}
                  <div className="p-3">
                    <button
                      onClick={handleAddImportItem}
                      disabled={newImportRow !== null}
                      className={`btn-tertiary  ${
                        newImportRow ? "disabled" : ""
                      }`}
                    >
                      <Plus size={20} />
                      <span>Add New</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Export Watchlist */}
              {watchlistType === "export" && (
                <div className="px-3 bg-white rounded-3px shadow-sm">
                  <div className="p-[16px] flex justify-between items-center min-h-[40px]">
                    <h2 className="text-18-bold text-gray-700">
                      Export Watchlist (Products going from{" "}
                      {
                        dummyData.countries.find((c) => c.code === baseCountry)
                          ?.name
                      }
                      )
                    </h2>
                    <div className="flex items-center gap-2 h-10">
                      {selectedExportItems.length > 0 ? (
                        <button
                          onClick={handleRemoveSelectedExport}
                          className="bg-red-700 text-white px-4 py-2 rounded-3px hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <Trash2 size={16} />
                          <span>
                            Remove Selected ({selectedExportItems.length})
                          </span>
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
                                className="btn-tertiary btn-md cursor-pointer flex items-center space-x-2"
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

                  <div className="overflow-auto max-h-[600px]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  selectedExportItems.length ===
                                    exportItems.length && exportItems.length > 0
                                }
                                onChange={handleSelectAllExport}
                                className=""
                              />
                            </div>
                          </th>
                          <th className="text-left py-3 text-16-medium text-gray-800">
                            Product
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            HS Code
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Origin
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Current Rate
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Tax
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Last Change
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Next Change
                          </th>
                          <th className="px-6 text-left py-3 text-16-medium text-gray-800">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {exportItems.map((item, index) => (
                          <tr
                            key={item.id}
                            className={getRowColor(
                              item.nextChange.description,
                              index,
                              selectedExportItems.includes(item.id)
                            )}
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedExportItems.includes(
                                    item.id
                                  )}
                                  onChange={() =>
                                    handleSelectExportItem(item.id)
                                  }
                                  className=""
                                />
                              </div>
                            </td>
                            <td className="py-3 text-16-medium text-gray-700">
                              {item.productName}
                            </td>
                            <td className="px-6 py-3">
                              <Link
                                to={`/hscode/${item.hsCode}`}
                                className="btn-link flex items-center"
                              >
                                {item.hsCode}
                                <ExternalLink
                                  size={16}
                                  className="ml-1 text-primary-600 hover:text-primary-800"
                                />
                              </Link>
                            </td>
                            <td className="px-6 py-3 text-16-regular text-gray-700">
                              {
                                dummyData.countries.find(
                                  (c) => c.code === item.destination
                                )?.name
                              }{" "}
                              ({item.destination})
                            </td>
                            <td className="px-6 py-3 ">
                              <div className="text-16-medium text-gray-700">
                                {item.currentRate}%
                              </div>
                              <span className="text-16-regular text-gray-500">
                                {item.currentRateOrigin}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="text-16-medium text-gray-700">
                                {item.tax}%
                              </div>
                              <div className="text-16-regular text-gray-500">
                                (VAT+Other Tax)
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div
                                className="text-left btn-link"
                                onClick={() => handleChangeClick(item, "last")}
                              >
                                {item.lastChange.date}
                              </div>
                              <div className="text-16-regular text-gray-500">
                                {item.lastChange.description}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex items-center space-x-1">
                                {item.nextChange.date !== "TBD" &&
                                  getChangeIcon(item.nextChange.description)}
                                <div>
                                  {item.nextChange.date !== "TBD" && (
                                    <>
                                      <div
                                        className="text-left btn-link"
                                        onClick={() =>
                                          handleChangeClick(item, "next")
                                        }
                                      >
                                        {item.nextChange.date}
                                      </div>
                                      <div className="text-16-regular text-gray-500">
                                        {item.nextChange.description}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-16-regular">
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
                          <tr className="bg-gray-50">
                            <td className="py-3 text-[16px] text-gray-900"></td>
                            <td className="py-3 text-[16px] text-gray-900">
                              {/* Product column - blank */}
                            </td>
                            <td className="px-4 py-3 text-[16px] text-gray-900">
                              <input
                                type="text"
                                value={newExportRow.hsCode}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  handleNewRowChange("export", "hsCode", value);
                                }}
                                placeholder="HS Code"
                                className="w-[150px] px-2 py-2 border border-gray-300 rounded-3px font-mono text-16-semibold placeholder:text-16-medium"
                              />
                            </td>
                            <td className="py-3 text-[16px] text-gray-900">
                              <Select
                                value={newExportRow.destination}
                                onChange={(value) =>
                                  handleNewRowChange(
                                    "export",
                                    "destination",
                                    value
                                  )
                                }
                                options={dummyData.countries.map((country) => ({
                                  value: country.code,
                                  label: `${country.flag} ${country.name}`,
                                }))}
                                placeholder="Select destination"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-3 text-[16px] text-gray-900">
                              <div className="flex space-x-1">
                                <button
                                  onClick={handleSaveNewExportItem}
                                  className="btn-primary btn-md mx-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleCancelNewRow("export")}
                                  className="btn-tertiary btn-md mx-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-[16px] text-gray-900">
                              {/* Tax column - blank */}
                            </td>
                            <td className="px-6 py-3 text-xs text-gray-500">
                              {/* Last Change column - blank */}
                            </td>
                            <td className="px-6 py-3 text-xs text-gray-500">
                              {/* Next Change column - blank */}
                            </td>
                            <td className="px-6 py-3 text-[16px] text-gray-900"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {exportItems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No export items in your watchlist yet. Start by
                        searching for tariffs and adding them to your watchlist.
                      </div>
                    )}
                  </div>

                  {/* Add Export Item Button */}
                  <div className="p-3">
                    <button
                      onClick={handleAddExportItem}
                      disabled={newExportRow !== null}
                      className={`btn-tertiary  ${
                        newImportRow ? "disabled" : ""
                      }`}
                    >
                      <Plus size={20} />
                      <span>Add New</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What Has Changed Tab */}
          {activeTab === "whatHasChanged" && (
            <div className="bg-white rounded-3px p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-20-bold text-gray-800">What Has Changed</h2>
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedTimePeriod}
                    onChange={setSelectedTimePeriod}
                    options={[
                      { value: "Past Week", label: "Past Week" },
                      { value: "Past Month", label: "Past Month" },
                      { value: "Past 3 Months", label: "Past 3 Months" },
                      { value: "Past Year", label: "Past Year" },
                    ]}
                    placeholder="Select time period"
                    className=""
                  />
                </div>
              </div>

              {/* Time Period Header */}
              <div className="pb-1">
                <span className="inline-flex items-center rounded-full text-14-medium text-gray-700">
                  {selectedTimePeriod === "Past Week" &&
                    "Past Week (Oct 1 – Oct 8, 2025)"}
                  {selectedTimePeriod === "Past Month" &&
                    "Past Month (Sept 8 – Oct 8, 2025)"}
                  {selectedTimePeriod === "Past 3 Months" &&
                    "Past 3 Months (July 8 – Oct 8, 2025)"}
                  {selectedTimePeriod === "Past Year" &&
                    "Past Year (Oct 2024 – Oct 2025)"}
                </span>
              </div>

              {/* Changes Content */}
              <div>
                {getChangesText(selectedTimePeriod).map((change, index) => (
                  <div
                    key={index}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="text-18-bold text-gray-700 mb-2">
                      {change.title}
                    </h4>
                    <p className="text-16-regular text-gray-700">
                      {change.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Changes Tab */}
          {activeTab === "upcomingChanges" && (
            <div className="bg-white rounded-3px p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-20-bold text-gray-800">Upcoming Changes</h2>
              </div>

              {/* Upcoming Changes Content */}
              <div className="space-y-6">
                {(() => {
                  const changes =
                    watchlistType === "import"
                      ? dummyData.upcomingChangesData
                      : dummyData.exportUpcomingChangesData;
                  const groupedChanges = groupUpcomingChangesByType(changes);
                  const groups = Object.keys(groupedChanges);

                  return groups.map((type, groupIndex) => (
                    <div key={type}>
                      {/* Type header */}
                      <div className="pb-4">
                        <h3 className="text-14-medium text-gray-700 rounded-3px">
                          {type}
                        </h3>
                      </div>

                      {/* Changes in this type */}
                      <div className="space-y-6 mb-6">
                        {groupedChanges[type].map((change, index) => (
                          <div key={index}>
                            <h4 className="text-18-bold text-gray-700 mb-3">
                              {change.title}
                            </h4>
                            <p className="text-gray-700 text-16-regular mb-4">
                              {change.description}
                            </p>
                            <div className="">
                              {change.impact && (
                                <div className="px-3 py-2 rounded-[3px] border-l-2 bg-sky-50 border-sky-300">
                                  <p>
                                    <span className="text-16-medium text-gray-700 mb-1">
                                      Impact:
                                    </span>
                                    <p className="text-16-regular text-gray-700">
                                      {change.impact}
                                    </p>
                                  </p>
                                </div>
                              )}

                              {change.timing && (
                                <div className="px-3 py-2 rounded-[3px] border-l-2 bg-sky-50 border-sky-300 mt-2">
                                  <p>
                                    <span className="text-16-medium text-gray-700 block mb-1">
                                      Timing:
                                    </span>
                                    <p className="text-16-regular text-gray-700">
                                      {change.timing}
                                    </p>
                                  </p>
                                </div>
                              )}

                              {change.action && (
                                <div className="px-3 py-2 rounded-[3px] border-l-2 bg-sky-50 border-sky-300 mt-2">
                                  <p>
                                    <span className="text-16-medium text-gray-700 block mb-1">
                                      Action:
                                    </span>
                                    <p className="text-16-regular text-gray-700">
                                      {change.action}
                                    </p>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Horizontal line between groups (except for the last group) */}
                      {groupIndex < groups.length - 1 && (
                        <div className="my-8">
                          <hr className="border-gray-300" />
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Detail Dialog */}
      {showChangeDialog && selectedChangeInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-20-bold text-gray-900">
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
                      {selectedChangeInfo.date}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-14-regular text-gray-700">
                    Anti-dumping duties of 10% will be applied to Chinese
                    imports starting 1 December 2026
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowChangeDialog(false)}
                  className="btn-secondary btn-md"
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
