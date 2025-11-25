import { ProfileExperience } from "@/stores/profileData/interface";
import { Building, Calendar, Pencil, Save } from "lucide-react";
import { useState } from "react";

interface ExperienceSectionProps {
  title: string;
  company: string;
  period: string;
  location:string;
  skills: string[];
  description: string[];
  editable?: boolean;
  onEdit?: (updatedData: ProfileExperience) => void;
}

const ExperienceSection = ({
  title,
  company,
  period,
  skills,
  location,
  description,
  editable = false,
  onEdit,
}: ExperienceSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title,
    company,
    location,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    currentlyWorking: false,
    skills,
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
    if (onEdit) {
      onEdit({
        companyName: formData.company,
        jobTitle: formData.title,
        responsibilities: formData.description,
        location:formData.location,
        startDate: dateToInputValue(formData.startDate),
        endDate: dateToInputValue(formData.endDate),
        currentlyWorking: formData.currentlyWorking,
        skills: formData.skills,
      });
    }
    setIsEditing(false);
  };

  const dateToInputValue = (date: Date | undefined) =>
    date ? date.toISOString().split("T")[0] : "";

  return (

    <div className="border border-sky-700 rounded-lg mb-4 relative">
      <div className="absolute left-2 top-[5%] bottom-[5%] w-2 bg-sky-700 rounded-[2px]" />
      <div className="pl-8 pr-4 py-4">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="text-xl font-semibold text-sky-700 border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          ) : (
            <h4 className="text-xl font-semibold text-sky-700">{title}</h4>
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
        <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap">
  {/* Company */}
  <div className="flex items-center gap-1">
    <Building className="h-4 w-4 text-gray-800" />
    {isEditing ? (
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleInputChange}
        className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-full"
        placeholder="Company"
      />
    ) : (
      <span className="text-gray-800 font-semibold">{company}</span>
    )}
  </div>

  {/* Separator */}
  {!isEditing && ( location) && <span className="text-gray-800 font-semibold">|</span>}

  {/* Location */}
  {(isEditing || location) && (
  <div className="flex items-center gap-1">
    <span className="text-gray-800 font-semibold">📍</span>
    {isEditing ? (
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        className="text-gray-800 border border-gray-300 rounded-md px-2 py-1 w-full"
        placeholder="Location"
      />
    ) : (
      <span className="text-gray-800 font-semibold">{location}</span>
    )}
  </div>
)}

  {/* Separator */}
  {!isEditing && (location || company) && <span className="text-gray-800 font-semibold">|</span>}

  {/* Dates */}
  <div className="flex items-center gap-1">
    <Calendar className="h-4 w-4 text-gray-800" />
    {isEditing ? (
      <>
        <input
          type="date"
          name="startDate"
          value={dateToInputValue(formData.startDate)}
          onChange={e => handleDateChange("startDate", e.target.value)}
          className="text-gray-800 font-semibold border border-gray-300 rounded-md px-2 py-1 w-full"
        />
        <span className="mx-1 text-gray-800 font-semibold">to</span>
        <input
          type="date"
          name="endDate"
          value={dateToInputValue(formData.endDate)}
          onChange={e => handleDateChange("endDate", e.target.value)}
          className="text-gray-800 font-semibold border border-gray-300 rounded-md px-2 py-1 w-full"
        />
      </>
    ) : (
      <span className="text-gray-800 font-semibold">{period}</span>
    )}
  </div>
</div>

        {(isEditing || (skills && skills.length > 0)) && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 text-sm mb-1">Skills</h4>
            {isEditing ? (
              <textarea
                name="skills"
                value={formData.skills.join(", ")}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    skills: e.target.value.split(",").map(skill => skill.trim()),
                  }))
                }
                className="text-gray-600 border border-gray-300 rounded-md px-2 py-1 w-full"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-sky-700 text-white px-3 py-1 rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-1">Description</h4>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-2 py-1 w-full h-24"
            />
          ) : (
            <div>
              {description.length > 0 && (
                <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                  {description.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
