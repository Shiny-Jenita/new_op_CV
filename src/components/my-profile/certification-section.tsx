import { Pencil, Save, Award, Calendar, Link, Building2 } from "lucide-react"; 
import { useState, useCallback, useMemo } from "react";

interface CertificationSectionProps {
  name: string;
  completionId: string;
  url: string;
  issuer:string;
  startDate: string;
  endDate: string;
  editable?: boolean;
  onEdit?: (updatedData: CertificationData) => void;
}

interface CertificationData {
  name: string;
  completionId: string;
  url: string;
  startDate: string;
  endDate: string;
  issuer:string;
}

const CertificationSection = ({
  name,
  completionId,
  url,
  issuer,
  startDate,
  endDate,
  editable = false,
  onEdit,
}: CertificationSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CertificationData>({
    name: "",
    completionId: "",
    startDate: "",
    endDate: "",
    url: "",
    issuer:""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onEdit) onEdit({ ...formData });
    setIsEditing(false);
  };

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }, []);

  const getISODate = (date: string) =>
    date ? new Date(date).toISOString().split('T')[0] : '';

  const displayPeriod = useMemo(() => {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    return formattedEnd ? `${formattedStart}  -  ${formattedEnd}` : formattedStart;
  }, [startDate, endDate, formatDate]);

  return (
    <div className="border border-sky-700 rounded-lg mb-4 relative">
    <div className="absolute left-2 top-[5%] bottom-[5%] w-2 bg-sky-700 rounded-[2px]" />
    <div className="pl-8 pr-4 py-2">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name ?? ""}
            onChange={handleInputChange}
            className="text-xl font-semibold text-sky-700 border border-gray-300 rounded-md px-2 py-1 w-full"
          />
        ) : (
          <h4 className="text-xl font-semibold text-sky-700">{name}</h4>
        )}
        {editable && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="ml-2 text-sky-700 hover:text-sky-800"
          >
            {isEditing ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
          </button>
        )}
      </div>
{/* Issuer */}
{(issuer || isEditing) && (
  <div className="mb-2 flex items-center gap-1">
    <Building2 className="h-4 w-4 text-gray-800" />
    {isEditing ? (
      <input
        type="text"
        name="issuer"
        value={formData.issuer ?? ""}
        onChange={handleInputChange}
        className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-full"
        placeholder="Issuer"
      />
    ) : (
      issuer && <span className="text-gray-800 font-medium">{issuer}</span>
    )}
  </div>
)}

      {/* Certificate ID and Dates */}
      {(completionId || startDate || endDate || isEditing) && (
        <div className="flex items-center gap-2 mt-1 mb-2">
          {/** Completion ID */}
          {(completionId || isEditing) && (
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-gray-800" />
              {isEditing ? (
                <input
                  type="text"
                  name="completionId"
                  value={formData.completionId ?? ""}
                  onChange={handleInputChange}
                  className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-full"
                  placeholder="Completion ID"
                />
              ) : (
                <span className="text-gray-800 font-semibold">ID: {completionId}</span>
              )}
            </div>
          )}

          {/** Separator */}
          {!isEditing && completionId && (startDate || endDate) && (
            <span className="text-gray-800 font-semibold">|</span>
          )}

          {/** Dates */}
          {(startDate || endDate || isEditing) && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-800" />
              {isEditing ? (
                <>
                  <input
                    type="date"
                    name="startDate"
                    value={getISODate(formData.startDate) ?? ""}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                    className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-32"
                  />
                  <span className="mx-1 text-gray-800">to</span>
                  <input
                    type="date"
                    name="endDate"
                    value={getISODate(formData.endDate) ?? ""}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                    className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-32"
                  />
                </>
              ) : (
                <span className="text-gray-800 font-semibold">{displayPeriod}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Certificate URL */}
      {(url || isEditing) && (
        <div className="mb-2">
          <div className="flex items-center gap-1">
            <Link className="h-4 w-4 text-gray-800" />
            {isEditing ? (
              <input
                type="text"
                name="url"
                value={formData.url ?? ""}
                onChange={handleInputChange}
                className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Certificate URL"
              />
            ) : (
              url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 hover:underline font-medium"
                >
                  View Certificate
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default CertificationSection;
