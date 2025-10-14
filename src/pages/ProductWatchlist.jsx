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
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Past Week");
  const [showSeeMoreModal, setShowSeeMoreModal] = useState(false);
  const [seeMoreTimePeriod, setSeeMoreTimePeriod] = useState("Past Week");
  const [showUpcomingSeeMoreModal, setShowUpcomingSeeMoreModal] =
    useState(false);
  const toast = useToast();

  // Function to get changes text based on selected time period
  const getChangesText = (timePeriod) => {
    const changes =
      activeTab === "import"
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

  // Function to get export changes text based on selected time period
  const getExportChangesText = (timePeriod) => {
    const changes = dummyData.exportChangesData[timePeriod];
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

  // Function to get detailed changes text for See More modal
  const getDetailedChangesText = (timePeriod) => {
    const changes =
      activeTab === "import"
        ? dummyData.changesData[timePeriod]
        : dummyData.exportChangesData[timePeriod];
    if (!changes || changes.length === 0) {
      return "No detailed changes found for the selected time period.";
    }

    let timeHeader = "";
    switch (timePeriod) {
      case "Past Week":
        timeHeader = "Past Week (Oct 1 – Oct 8, 2025)";
        break;
      case "Past Month":
        timeHeader = "Past Month (Sept 8 – Oct 8, 2025)";
        break;
      case "Past 3 Months":
        timeHeader = "Past 3 Months (July 8 – Oct 8, 2025)";
        break;
      case "Past Year":
        timeHeader = "Past Year (Oct 2024 – Oct 2025)";
        break;
    }

    let content = `**${timeHeader}**\n\n`;

    changes.forEach((change, index) => {
      content += `**${index + 1}. ${change.title}**\n`;
      content += `${change.description}\n\n`;
    });

    // Add strategic recommendations for longer periods
    if (timePeriod === "Past 3 Months" || timePeriod === "Past Year") {
      content += `**STRATEGIC RECOMMENDATIONS:**\n`;
      if (activeTab === "export") {
        content += `- Review export documentation requirements\n`;
        content += `- Update supplier origin declarations\n`;
        content += `- Monitor U.S. and UK trade policy developments\n`;
        content += `- Prepare for digital certificate transitions\n`;
        content += `- Strengthen compliance with FTA requirements`;
      } else {
        content += `- Monitor ongoing trade policy developments\n`;
        content += `- Review supplier diversification strategies\n`;
        content += `- Prepare for upcoming regulatory changes\n`;
        content += `- Consider forward contracting for price stability\n`;
        content += `- Strengthen compliance documentation procedures`;
      }
    }

    return content;
  };

  // Handle opening See More modal
  const handleSeeMore = () => {
    setSeeMoreTimePeriod(selectedTimePeriod);
    setShowSeeMoreModal(true);
  };

  // Handle opening Upcoming See More modal
  const handleUpcomingSeeMore = () => {
    setShowUpcomingSeeMoreModal(true);
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
    // return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getRowColor = (description) => {
    // if (
    //   description.toLowerCase().includes("reduction") ||
    //   description.toLowerCase().includes("decrease")
    // ) {
    //   return "bg-green-50";
    // } else if (description.toLowerCase().includes("increase")) {
    //   return "bg-red-50";
    // }
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
    if (newImportRow.hsCode && newImportRow.origin) {
      const currentDate = new Date();
      const newItem = {
        ...newImportRow,
        id: Date.now(), // Generate unique ID
        type: "import",
        productName:
          newImportRow.productName || `Product ${newImportRow.hsCode}`,
        currentRate: 0, // Default to 0
        tax: 0, // Default to 0
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
      toast.error("Please fill in HS Code and Origin");
    }
  };

  const handleSaveNewExportItem = () => {
    if (newExportRow.hsCode && newExportRow.destination) {
      const currentDate = new Date();
      const newItem = {
        ...newExportRow,
        id: Date.now(), // Generate unique ID
        type: "export",
        productName:
          newExportRow.productName || `Product ${newExportRow.hsCode}`,
        currentRate: 0, // Default to 0
        tax: 0, // Default to 0
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
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Watchlist
            </h1>
          </div>

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

      {/* Changes Overview Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* What Has Changed Section */}
          <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-6 h-[220px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                What Has Changed
              </h2>
              <select
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Past Week">Past Week</option>
                <option value="Past Month">Past Month</option>
                <option value="Past 3 Months">Past 3 Months</option>
                <option value="Past Year">Past Year</option>
              </select>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="space-y-4">
                {getChangesText(selectedTimePeriod).map((change, index) => (
                  <div key={index} className="pt-2">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {change.title}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {change.description}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={handleSeeMore}
                className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                See More
              </button>
            </div>
          </div>

          {/* Upcoming Changes Section */}
          <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-6 h-[220px] overflow-hidden flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upcoming Changes
            </h2>

            <div className="flex-1 overflow-hidden">
              <div className="space-y-3">
                {(activeTab === "import"
                  ? dummyData.upcomingChangesData
                  : dummyData.exportUpcomingChangesData
                )
                  .slice(0, 2)
                  .map((change, index) => (
                    <div key={index} className="pt-1">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {change.type}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {change.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {change.description}...
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={handleUpcomingSeeMore}
                className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                See More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Watchlist */}
      {activeTab === "import" && (
        <div className="px-3 bg-white rounded-3px shadow-sm border border-gray-200 mb-8">
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

          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-200">
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
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
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    HS Code
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Origin
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Current Rate
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Tax
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Last Change
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Next Change
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedImportItems.includes(item.id)}
                        onChange={() => handleSelectImportItem(item.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900 font-medium">
                      {item.productName}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <Link
                        to={`/hscode/${item.hsCode}`}
                        className="text-primary-600 hover:text-primary-800 font-mono"
                      >
                        {item.hsCode}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {
                        dummyData.countries.find((c) => c.code === item.origin)
                          ?.name
                      }{" "}
                      ({item.origin})
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <div className="font-semibold">{item.currentRate}%</div>
                      {item.currentRateOrigin && (
                        <div>{item.currentRateOrigin}</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-600">
                      <button
                        onClick={() => handleChangeClick(item, "last")}
                        className="text-left  transition-colors focus:outline-none"
                      >
                        <div>
                          <div className="underline text-primary-600 hover:text-primary-700">
                            {item.lastChange.date}:
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.lastChange.description}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-3 text-[16px]">
                      <button
                        onClick={() => handleChangeClick(item, "next")}
                        className="text-left  transition-colors focus:outline-none"
                      >
                        <div className="flex items-center space-x-1">
                          {item.nextChange.date !== "TBD" &&
                            getChangeIcon(item.nextChange.description)}
                          <div>
                            {item.nextChange.date !== "TBD" && (
                              <>
                                <div className="underline text-primary-600 hover:text-primary-700">
                                  {item.nextChange.date}:
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.nextChange.description}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-3 text-[16px]">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <input
                        type="checkbox"
                        disabled
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {/* Product column - blank */}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {/* Current Rate column - blank */}
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
        <div className="px-3 bg-white rounded-3px shadow-sm border border-gray-200">
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

          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-200">
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
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
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    HS Code
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Destination
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Current Rate
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Tax
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Last Change
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
                    Next Change
                  </th>
                  <th className="px-6 text-left py-3 text-[16px] font-semibold text-gray-700">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedExportItems.includes(item.id)}
                        onChange={() => handleSelectExportItem(item.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900 font-medium">
                      {item.productName}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <Link
                        to={`/hscode/${item.hsCode}`}
                        className="text-primary-600 hover:text-primary-800 font-mono"
                      >
                        {item.hsCode}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {
                        dummyData.countries.find(
                          (c) => c.code === item.destination
                        )?.name
                      }{" "}
                      ({item.destination})
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <div className="font-semibold">{item.currentRate}%</div>
                      {item.currentRateOrigin && (
                        <div>{item.currentRateOrigin}</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-700">
                      <div className="font-medium">{item.tax}%</div>
                      <div className="text-xs text-gray-500">
                        (VAT+Other Tax)
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-600">
                      <button
                        onClick={() => handleChangeClick(item, "last")}
                        className="text-left transition-colors focus:outline-none"
                      >
                        <div>
                          <div className="underline text-primary-600 hover:text-primary-700">
                            {item.lastChange.date}:
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.lastChange.description}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-3 text-[16px]">
                      <button
                        onClick={() => handleChangeClick(item, "next")}
                        className="text-left transition-colors focus:outline-none"
                      >
                        <div className="flex items-center space-x-1">
                          {item.nextChange.date !== "TBD" &&
                            getChangeIcon(item.nextChange.description)}
                          <div>
                            {item.nextChange.date !== "TBD" && (
                              <>
                                <div className="underline text-primary-600 hover:text-primary-700">
                                  {item.nextChange.date}:
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.nextChange.description}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-3 text-[16px]">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      <input
                        type="checkbox"
                        disabled
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {/* Product column - blank */}
                    </td>
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
                      {/* Current Rate column - blank */}
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
                    <td className="px-6 py-3 text-[16px] text-gray-900">
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
                      {selectedChangeInfo.date}
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

      {/* See More Modal */}
      {showSeeMoreModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4 pt-[10%] pr-[50%]"
          onClick={(e) => {
            // Close modal on backdrop click
            if (e.target === e.currentTarget) {
              setShowSeeMoreModal(false);
            }
          }}
        >
          <div className="bg-white rounded-3px max-w-2xl w-full max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-4 ">
              <h2 className="text-xl font-semibold text-gray-900">
                What has Changed
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={seeMoreTimePeriod}
                    onChange={(e) => setSeeMoreTimePeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm min-w-[200px] appearance-none bg-white pr-8"
                  >
                    <option value="Past Week">Past Week</option>
                    <option value="Past Month">Past Month</option>
                    <option value="Past 3 Months">Past 3 Months</option>
                    <option value="Past Year">Past Year</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Time Period Tag */}
            <div className="px-4 py-2 border-b border-gray-100">
              <span className="inline-flex items-center rounded-full text-sm font-medium">
                {seeMoreTimePeriod === "Past Week" &&
                  "Past Week (Oct 1 – Oct 8, 2025)"}
                {seeMoreTimePeriod === "Past Month" &&
                  "Past Month (Sept 8 – Oct 8, 2025)"}
                {seeMoreTimePeriod === "Past 3 Months" &&
                  "Past 3 Months (July 8 – Oct 8, 2025)"}
                {seeMoreTimePeriod === "Past Year" &&
                  "Past Year (Oct 2024 – Oct 2025)"}
              </span>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="space-y-4">
                {(activeTab === "import"
                  ? dummyData.changesData[seeMoreTimePeriod]
                  : dummyData.exportChangesData[seeMoreTimePeriod]
                )?.map((change, index) => (
                  <div key={index} className="py-2">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      {change.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {change.description}
                    </p>
                  </div>
                )) || (
                  <div className="text-gray-500 text-center py-8">
                    No changes found for the selected time period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Changes Modal */}
      {showUpcomingSeeMoreModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50 p-4 pt-[10%] pl-[50%]"
          onClick={(e) => {
            // Close modal on backdrop click
            if (e.target === e.currentTarget) {
              setShowUpcomingSeeMoreModal(false);
            }
          }}
        >
          <div className="bg-white rounded-3px max-w-2xl w-full max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Changes
              </h2>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="space-y-4">
                {(() => {
                  const changes =
                    activeTab === "import"
                      ? dummyData.upcomingChangesData
                      : dummyData.exportUpcomingChangesData;
                  const groupedChanges = groupUpcomingChangesByType(changes);
                  const groups = Object.keys(groupedChanges);

                  return groups.map((type, groupIndex) => (
                    <div key={type}>
                      {/* Type header */}
                      <div className="py-2 ">
                        <h3 className="text-[13px] font-semibold text-gray-800 px-3 capitalize">
                          {type}
                        </h3>
                      </div>

                      {/* Changes in this type */}
                      <div className="space-y-4 mb-4">
                        {groupedChanges[type].map((change, index) => (
                          <div key={index} className="py-2 pl-4">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                              {change.title}
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-sm mb-3">
                              {change.description}
                            </p>
                            <div className="space-y-2">
                              <div className="bg-gray-50 px-3 py-0 rounded-3px">
                                <p className="text-xs text-gray-700 mt-1">
                                  <span className="text-xs font-medium text-gray-600 italic pr-2">
                                    Impact:
                                  </span>
                                  {change.impact}
                                </p>

                                <p className="text-xs text-gray-700 mt-1">
                                  <span className="text-xs font-medium text-gray-600 italic pr-2">
                                    Timing:
                                  </span>
                                  {change.timing}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Horizontal line between groups (except for the last group) */}
                      {groupIndex < groups.length - 1 && (
                        <div className="my-6">
                          <hr className="border-gray-300" />
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductWatchlist;
