import { Pencil, Save, Link } from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectSectionProps {
  projectName: string;
  projectUrl: string;
  projectDescription: string[];
  editable?: boolean;
  onEdit?: (updatedData: ProjectData) => void;
}

interface ProjectData {
  projectName: string;
  projectUrl: string;
  projectDescription: string[];
}

const ProjectSection = ({
  projectName,
  projectUrl,
  projectDescription,
  editable = false,
  onEdit,
}: ProjectSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectData>({
    projectName,
    projectUrl,
    projectDescription,
  });

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        projectName,
        projectUrl,
        projectDescription,
      });
    }
  }, [projectName, projectUrl, projectDescription, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "projectDescription") {
      setFormData((prev) => ({
        ...prev,
        projectDescription: value.split("\n"),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        projectName: formData.projectName,
        projectUrl: formData.projectUrl,
        projectDescription: formData.projectDescription,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="border border-sky-700 rounded-lg mb-4 relative">
      <div className="absolute left-2 top-[5%] bottom-[5%] w-2 bg-sky-700 rounded-[2px]" />
      <div className="pl-8 pr-4 py-4">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="text-xl font-semibold text-sky-700 border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          ) : (
            <h4 className="text-xl font-semibold text-sky-700">
              {projectName}
            </h4>
          )}

          {editable && (
            <button
              onClick={() =>
                isEditing ? handleSave() : setIsEditing(true)
              }
              className="ml-2 text-sky-700 hover:text-sky-800"
            >
              {isEditing ? (
                <Save className="h-5 w-5" />
              ) : (
                <Pencil className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {(isEditing ||
          (formData.projectDescription &&
            formData.projectDescription.length > 0)) && (
          <div>
            <h4 className="font-semibold text-sm mb-1 text-gray-700">
              Description
            </h4>
            {isEditing ? (
              <textarea
                name="projectDescription"
                value={formData.projectDescription.join("\n")}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full h-24"
              />
            ) : (
              <div className="text-gray-600 text-sm">
                <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                  {formData.projectDescription.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {(isEditing || formData.projectUrl) && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Link className="h-4 w-4 text-black" />
              {isEditing ? (
                <input
                  type="text"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleInputChange}
                  className="text-black border border-gray-300 rounded-md px-2 py-1 w-full"
                />
              ) : (
                <a
                  href={formData.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 hover:underline font-medium"
                >
                  View Project
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSection;
