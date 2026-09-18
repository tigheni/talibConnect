import { X, FileUp, FileText, UploadCloud } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export function FileUploadSection({
  getErrorClass,
  fileInputRef,
  handleFileChange,
  file,
  setFile,
  getErrorMessage,
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="sm:grid sm:grid-cols-[minmax(10rem,0.35fr)_minmax(0,1fr)] sm:items-start sm:gap-6">
        <div className="sm:pt-1">
          <SectionHeader icon={FileUp} title="Exam file" subtitle="PDF only, up to 10 MB" />
        </div>

        <div>
          <label
            htmlFor="examFile"
            className={`relative flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-all duration-200 ${
              file
                ? "border-[#5ae4a8] bg-[#5ae4a8]/5"
                : "border-gray-300 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60"
            } ${getErrorClass("file")}`}
          >
            <input
              id="examFile"
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
            {file ? (
              <>
                <div className="w-10 h-10 rounded-full bg-[#5ae4a8]/15 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#2f9e6d]" />
                </div>
                <p className="text-sm font-medium text-gray-800 max-w-xs truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB — click to replace
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-200/70 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Click to choose a PDF
                </p>
                <p className="text-xs text-gray-400">or drag and drop it here</p>
              </>
            )}
          </label>
          {getErrorMessage("file") && (
            <div className="text-red-500 text-xs mt-1.5">
              {getErrorMessage("file")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
