import { Calendar, Edit3, Save, GraduationCap } from "lucide-react";
import { useState } from "react";

interface EducationSectionProps {
  major: string;
  level: string;
  university: string;
  specialization: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentlyEnrolled: boolean;
  gpa: string;
  location: string;
  description: string[];
  editable?: boolean;
  onEdit?: (updatedData: {
    major: string;
    level: string;
    university: string;
    specialization: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    currentlyEnrolled: boolean;
    gpa: string;
    location: string;
    description: string[];
  }) => void;
}

const EducationSection = ({
  major,
  level,
  university,
  specialization,
  startDate,
  endDate,
  currentlyEnrolled,
  gpa,
  location,
  description,
  editable = false,
  onEdit,
}: EducationSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    major,
    level,
    university,
    specialization,
    startDate,
    endDate,
    currentlyEnrolled,
    gpa,
    location,
    description,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };

  const handleSave = () => {
    if (onEdit) onEdit(formData);
    setIsEditing(false);
  };

  const dateToInputValue = (date: Date | undefined) =>
    date ? date.toISOString().split("T")[0] : "";

  const formatDisplayDate = (date: Date | undefined, fallback: string) =>
    date ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : fallback;

  return (
    <div className="border border-sky-700 rounded-lg mb-4 relative">
      <div className="absolute left-2 top-[5%] bottom-[5%] w-2 bg-sky-700 rounded-[2px]" />
      <div className="pl-8 pr-4 py-4">
        <div className="flex justify-between">
          {isEditing ? (
            <input
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="text-xl font-bold text-sky-700 border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          ) : (
            <h4 className="text-xl font-bold text-sky-700">{formData.level}</h4>
          )}
          {editable && (
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="ml-2 text-sky-700 hover:text-sky-900"
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            </button>
          )}
        </div>

        <div className="mt-1 mb-2 text-gray-800 font-semibold">
          {isEditing ? (
            <>
              <input
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                placeholder="Major"
              />
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1"
                placeholder="Specialization"
              />
            </>
          ) : (
            <>
              <span>
                {formData.major}
                {formData.specialization && ` | ${formData.specialization}`}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <GraduationCap className="h-4 w-4 text-gray-800" />
          {isEditing ? (
            <>
              <input
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-800 font-medium"
                placeholder="University"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-800 font-medium"
                placeholder="Location"
              />
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-800">{formData.university}</span>
              {formData.location && <span className="text-gray-800">|📍</span>}
              <span className="text-gray-800 font-semibold">{formData.location}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-800" />
          {isEditing ? (
            <>
              <input
                type="date"
                name="startDate"
                value={dateToInputValue(formData.startDate)}
                onChange={e => handleDateChange("startDate", e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-800 font-medium"
              />
              <span className="mx-1 text-gray-800 font-medium">-</span>
              {!formData.currentlyEnrolled && (
                <input
                  type="date"
                  name="endDate"
                  value={dateToInputValue(formData.endDate)}
                  onChange={e => handleDateChange("endDate", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-800 font-medium"
                />
              )}
              <label className="flex items-center gap-1 text-sm text-gray-700 ml-2">
                <input
                  type="checkbox"
                  checked={formData.currentlyEnrolled}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      currentlyEnrolled: e.target.checked,
                      endDate: e.target.checked ? undefined : prev.endDate,
                    }))
                  }
                />
                Currently Enrolled
              </label>
            </>
          ) : (
            <>
              <span className="text-gray-800 font-semibold">{formatDisplayDate(startDate, "Start")}</span>
              <span className="mx-1 text-gray-800 font-semibold">-</span>
              <span className="text-gray-800 font-semibold">
                {currentlyEnrolled ? "Present" : formatDisplayDate(endDate, "present")}
              </span>
            </>
          )}
        </div>

        {(isEditing || (formData.gpa && formData.gpa[0] !== null)) && (
          <div className="mb-2">
            {isEditing ? (
              <input
                name="gpa"
                value={formData.gpa}
                onChange={handleInputChange}
                className="bg-[#2a6baa] text-white px-3 py-1 rounded-md text-sm border border-gray-300"
              />
            ) : (
              <span className="inline-flex items-center rounded-md overflow-hidden">
                <span className="bg-sky-700 text-white text-sm font-medium px-3 py-1">GPA/CGPA</span>
                <span className="bg-white text-[#333] text-sm px-3 py-1 border-t border-b border-r border-gray-300 rounded-r-md min-w-[4ch] min-h-[3.5ch] text-center">
                  {formData.gpa || "N/A"}
                </span>
              </span>
            )}
          </div>
        )}

        {(isEditing || (description && description.length > 0)) && (
          <div className="mt-2">
            <h4 className="font-semibold text-sm mb-1 text-gray-700">Description</h4>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full text-gray-600 text-sm"
              />
            ) : (
              description.length > 0 && (
                <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                  {description.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationSection;
