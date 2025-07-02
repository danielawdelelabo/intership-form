"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Download,
  AlertTriangle,
  FileText,
  Edit,
  Trash2,
  ClipboardList,
  File,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Add type declaration for autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { deleteApplicationById } from "./delete";
import { toast } from "react-toastify";

interface InternshipApplication {
  id: number;
  email: string;
  full_name: string;
  date_of_birth: string;
  residence_address: string;
  date_of_agreement: string;
  signature_image_url: string;
  id_document_url: string;
  terms_accepted: boolean;
  created_at: string;
}

// Utility function to check if URL is an image
const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.includes(ext));
};

// Utility function to check if URL is a PDF
const isPdfUrl = (url: string): boolean => {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf');
};

export const getAll = async () => {
  const response = await fetch(`/api/internship-services/getAllUsers`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  //   console.log("Fetched data:", data.data);
  return data.data.applications;
};

export const GetAllComponent = () => {
  const [data, setData] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAll();
        setData(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading applications...</p>
            <p className="text-sm text-gray-400 mt-1">
              Please wait while we fetch the data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            {" "}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteApplicationById(id.toString());
      setData((prev) => prev.filter((app) => app.id !== id));
      toast.success(`Application was removed.`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("There was a problem deleting the application.");
    }
  };
  const handleExportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a3"); 
    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Internship Applications Report", 14, 25);

    // Add generation date and stats
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Created on: ${new Date().toLocaleDateString()}`, 14, 35);
    doc.text(`Total Applications: ${data.length}`, 14, 42);
    doc.text(
      `Accepted Terms: ${data.filter((item) => item.terms_accepted).length}`,
      14,
      49
    );    // Prepare comprehensive table data with all fields
    const tableColumns = [
      "ID",
      "Full Name",
      "Email",
      "Date of Birth",
      "Residence Address",
      "Agreement Date",
      "Terms Accepted",
      "Created At",
      "Document",
      "Signature",
    ];
    const tableRows = data.map((item, index) => [
      (index + 1).toString(),
      item.full_name || "N/A",
      item.email || "N/A",
      item.date_of_birth
        ? new Date(item.date_of_birth).toLocaleDateString()
        : "N/A",
      item.residence_address || "N/A",
      item.date_of_agreement
        ? new Date(item.date_of_agreement).toLocaleDateString()
        : "N/A",      item.terms_accepted ? "Accepted" : "Declined",
      item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      item.id_document_url ? "View Document" : "Missing",
      item.signature_image_url ? "View Signature" : "Missing",
    ]);
    // Add table with improved styling for A3
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 60,
      styles: {
        fontSize: 8,
        cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
        valign: "middle",
        halign: "left",
        lineColor: [180, 180, 180],
        lineWidth: 0.2,
        textColor: [40, 40, 40],
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
        valign: "middle",
        cellPadding: { top: 4, right: 2, bottom: 4, left: 2 },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },      columnStyles: {
        0: { cellWidth: 20, halign: "center" }, // ID
        1: { cellWidth: 40, halign: "left" }, // Full Name
        2: { cellWidth: 50, halign: "left" }, // Email
        3: { cellWidth: 30, halign: "center" }, // Date of Birth
        4: { cellWidth: 60, halign: "left" }, // Address
        5: { cellWidth: 30, halign: "center" }, // Agreement Date
        6: { cellWidth: 30, halign: "center" }, // Terms Accepted
        7: { cellWidth: 30, halign: "center" }, // Created At
        8: { cellWidth: 30, halign: "center", textColor: [0, 100, 200] }, // Document (blue for links)
        9: { cellWidth: 30, halign: "center", textColor: [0, 100, 200] }, // Signature (blue for links)
      },
      margin: { top: 60, left: 10, right: 10, bottom: 20 },
      theme: "striped",
      tableWidth: "auto",
      didDrawPage: function (data) {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageSize.width - 40,
          pageSize.height - 15
        );

        // Add watermark
        doc.setFontSize(8);
        doc.text(
          "Confidential - Internship Applications",
          10,
          pageSize.height - 15
        );
      },      didDrawCell: function (hookData) {
        // Add borders to cells and handle links
        if (hookData.section === "body") {
          const rowIndex = hookData.row.index;
          const columnIndex = hookData.column.index;
          const currentItem = data[rowIndex];
          
          // Highlight Terms Accepted column
          if (columnIndex === 6) {
            if (hookData.cell.text[0].includes("Accepted")) {
              doc.setFillColor(220, 255, 220); // Light green background
            } else if (hookData.cell.text[0].includes("Declined")) {
              doc.setFillColor(255, 220, 220); // Light red background
            }
          }

          // Add clickable links for document column (index 8)
          if (columnIndex === 8 && currentItem.id_document_url && hookData.cell.text[0] === "View Document") {
            doc.setTextColor(0, 100, 200); // Blue color for links
            doc.link(
              hookData.cell.x,
              hookData.cell.y,
              hookData.cell.width,
              hookData.cell.height,
              { url: currentItem.id_document_url }
            );
          }

          // Add clickable links for signature column (index 9)
          if (columnIndex === 9 && currentItem.signature_image_url && hookData.cell.text[0] === "View Signature") {
            doc.setTextColor(0, 100, 200); // Blue color for links
            doc.link(
              hookData.cell.x,
              hookData.cell.y,
              hookData.cell.width,
              hookData.cell.height,
              { url: currentItem.signature_image_url }
            );
          }
        }
      },
    }); // Add summary statistics at the bottom
    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY || 60;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("Summary Statistics:", 14, finalY + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const acceptedCount = data.filter((item) => item.terms_accepted).length;
    const withDocuments = data.filter((item) => item.id_document_url).length;
    const withSignatures = data.filter(
      (item) => item.signature_image_url
    ).length;
    doc.text(
      `• Applications with accepted terms: ${acceptedCount} (${(
        (acceptedCount / data.length) *
        100
      ).toFixed(1)}%)`,
      14,
      finalY + 28
    );
    doc.text(
      `• Applications with documents: ${withDocuments} (${(
        (withDocuments / data.length) *
        100
      ).toFixed(1)}%)`,
      14,
      finalY + 35
    );
    doc.text(
      `• Applications with signatures: ${withSignatures} (${(
        (withSignatures / data.length) *
        100
      ).toFixed(1)}%)`,
      14,
      finalY + 42
    );
    doc.text(
      `• Complete applications (terms + document + signature): ${
        data.filter(
          (item) =>
            item.terms_accepted &&
            item.id_document_url &&
            item.signature_image_url
        ).length
      }`,
      14,
      finalY + 49
    );    // Add footer with additional info
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      "This report contains sensitive personal information. Handle according to data protection policies.",
      14,
      finalY + 65
    );    doc.text(
      "Note: Blue 'View Document' and 'View Signature' text in the table are clickable links.",
      14,
      finalY + 73
    );
    // Save the PDF
    const fileName = `internship-applications-detailed-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);    toast.success(
      `PDF exported successfully! (${data.length} applications with clickable links included)`
    );
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Internship Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and review all internship applications ({data.length}{" "}
              total)
            </p>
          </div>{" "}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportToPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          {data.map((item: InternshipApplication, index: number) => (
            <div
              key={`${item.id}-${index}`}
              className="border-b border-gray-100 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.terms_accepted ? " text-green-800" : " text-red-800"
                    }`}
                  >
                    {item.terms_accepted ? "✅" : "❌"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Birth Date:</span>
                  <p className="font-medium">
                    {new Date(item.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-gray-500 text-sm">Address:</span>
                <p className="text-sm">{item.residence_address}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">                  {item.id_document_url && (
                    <button
                      onClick={() =>
                        window.open(item.id_document_url, "_blank")
                      }
                      className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center space-x-1"
                    >
                      {isPdfUrl(item.id_document_url) ? (
                        <File className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      <span>{isPdfUrl(item.id_document_url) ? "PDF" : "Image"}</span>
                    </button>
                  )}
                  {item.signature_image_url && (
                    <button
                      onClick={() =>
                        window.open(item.signature_image_url, "_blank")
                      }
                      className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Signature</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="min-w-[60px] font-semibold text-gray-900 text-center">
                  ID
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Full Name
                </TableHead>
                <TableHead className="min-w-[180px] font-semibold text-gray-900 text-center">
                  Email
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Date of Birth
                </TableHead>
                <TableHead className="min-w-[150px] font-semibold text-gray-900 text-center">
                  Residence Address
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Agreement Date
                </TableHead>

                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Created At
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Document
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-gray-900 text-center">
                  Signature
                </TableHead>
                <TableHead className="min-w-[100px] font-semibold text-gray-900 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: InternshipApplication, index: number) => (
                <TableRow
                  key={`${item.id}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-sm font-semibold text-blue-700">
                        {index + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px] text-center">
                    <div className="font-medium text-gray-900">
                      {item.full_name}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[180px] break-all text-center">
                    <div className="text-gray-700">{item.email}</div>
                  </TableCell>
                  <TableCell className="min-w-[120px] whitespace-nowrap text-center">
                    <div className="text-gray-700">
                      {new Date(item.date_of_birth).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[150px] max-w-[200px] text-center">
                    <div
                      className="truncate text-gray-700"
                      title={item.residence_address}
                    >
                      {item.residence_address}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px] whitespace-nowrap text-center">
                    <div className="text-gray-700">
                      {new Date(item.date_of_agreement).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px] whitespace-nowrap text-center">
                    <div className="text-gray-700">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>                  <TableCell className="min-w-[120px] text-center">
                    {item.id_document_url ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className="w-16 h-16 relative border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden shadow-sm flex items-center justify-center"
                          onClick={() =>
                            window.open(item.id_document_url, "_blank")
                          }
                        >
                          {isImageUrl(item.id_document_url) ? (
                            <Image
                              src={item.id_document_url}
                              alt="ID Document"
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : isPdfUrl(item.id_document_url) ? (
                            <File className="w-8 h-8 text-red-600" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-600" />
                          )}
                        </div>
                        <a
                          href={item.id_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {isPdfUrl(item.id_document_url) ? "View PDF" : "View image"}
                        </a>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          No Document
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="min-w-[120px] text-center">
                    {item.signature_image_url ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className="w-16 h-16 relative border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden shadow-sm"
                          onClick={() =>
                            window.open(item.signature_image_url, "_blank")
                          }
                        >
                          <Image
                            src={item.signature_image_url}
                            alt="Signature"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <a
                          href={item.signature_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          View Signature
                        </a>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                          <Edit className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          No Signature
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="min-w-[100px] text-center">
                    <div className="flex space-x-2">
                      {" "}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500">
              There are no internship applications to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
