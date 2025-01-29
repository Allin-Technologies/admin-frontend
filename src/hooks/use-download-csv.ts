import { saveAs } from "file-saver";

type CsvOptions<T extends object> = {
  data: T[]; // Array of data objects to export
  filename?: string; // Optional filename for the CSV file
  headers?: (keyof T)[]; // Optional array of headers/column names
  onSuccess?: () => void; // Callback function on successful download
  onError?: (error: Error) => void; // Callback on download error
};

export function csvDownload<T extends object>({
  data,
  filename = "data.csv",
  headers,
  onSuccess,
  onError,
}: CsvOptions<T>) {
  // Convert data array to CSV string
  const convertToCsv = (): string => {
    if (!data.length) {
      console.log("no data");
      return "";
    } // Check if data array is empty

    // Use headers if provided, otherwise infer from first data object
    const csvHeaders = headers || (Object.keys(data[0] as T) as (keyof T)[]);
    const headerRow = csvHeaders.join(",");

    // Map data rows
    const rows = data.map((row) =>
      csvHeaders
        .map(
          (header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"` // Handle commas/quotes in values
        )
        .join(",")
    );

    return [headerRow, ...rows].join("\n");
  };

  // Function to trigger CSV download
  const downloadCsv = () => {
    if (!data.length) {
      console.log("no data");
      return;
    }

    try {
      const csvContent = convertToCsv();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Check for iOS Safari fallback
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

      if (isIOS) {
        // Use FileSaver for iOS
        saveAs(blob, filename);
      } else {
        // Standard download method for other browsers
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Download failed", error);
      if (onError)
        onError(error instanceof Error ? error : new Error("Download failed"));
    }
  };

  return { downloadCsv };
}
