import { Calendar, Pencil, Save, Link } from "lucide-react";
import { useState } from "react";
import DatePickerWithYearSelection from "@/components/ui/DatePickerWithYearSelection";

interface PublicationSectionProps {
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  publisherUrl: string;
  description: string[];
  editable?: boolean;
  onEdit?: (updatedData: {
    title: string;
    author: string;
    publishedDate: string;
    publisher: string;
    publisherUrl: string;
    description: string[];
  }) => void;
}

const PublicationSection = ({
  title,
  author,
  publishedDate,
  publisher,
  publisherUrl,
  description,
  editable = false,
  onEdit,
}: PublicationSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title,
    author,
    publishedDate: publishedDate ? new Date(publishedDate) : undefined,
    publisher,
    publisherUrl,
    description,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, publishedDate: date }));
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...formData,
        publishedDate: formData.publishedDate?.toISOString() || "",
        publisher: formData.publisher,
        publisherUrl: formData.publisherUrl,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="border border-sky-700 rounded-lg mb-4 py-2 relative">
      <div className="absolute left-2 top-[5%] bottom-[5%] w-2 bg-sky-700 rounded-[2px]" />
      <div className="pl-8 pr-4 py-1">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              className="text-xl font-semibold text-sky-700 border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          ) : (
            <h4 className="text-xl font-semibold text-sky-700">{title}</h4>
          )}
          {editable && (
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="ml-1 text-sky-700 hover:text-sky-800"
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-gray-800 font-semibold">Author:</span>
          {isEditing ? (
            <input
              type="text"
              name="author"
              value={formData.author || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-2 py-1"
              placeholder="Author name"
            />
          ) : (
            <span className="text-gray-800 font-semibold">{author}</span>
          )}

          <span className="text-gray-800 font-semibold mx-1">|</span>
          <Calendar className="h-4 w-4 text-gray-800 font-semibold" />
          {isEditing ? (
            <DatePickerWithYearSelection
              value={formData.publishedDate}
              onChange={handleDateChange}
              maxDate={new Date()}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <span className="text-gray-800 font-semibold">
              {publishedDate ? new Date(publishedDate).toLocaleDateString() : "No date"}
            </span>
          )}
        </div>

        {(publisher || isEditing) && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-800 font-semibold">Publisher:</span>
            {isEditing ? (
              <input
                type="text"
                name="publisher"
                value={formData.publisher || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1"
                placeholder="Publisher name"
              />
            ) : (
              <span className="text-gray-800 font-semibold">{publisher}</span>
            )}
          </div>
        )}

        {(publisherUrl || isEditing) && (
          <div className="mt-2">
            {isEditing ? (
              <input
                type="string"
                name="publisherUrl"
                value={formData.publisherUrl || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Publication URL"
              />
            ) : (
              <a
                href={publisherUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sky-700 hover:underline gap-2"
              >
                <Link className="h-4 w-4 text-black" />
                <span>View Publication</span>
              </a>
            )}
          </div>
        )}

        {(description.length > 0 || isEditing) && (
          <div className="mt-2">
            <h4 className="font-semibold text-sm mb-1 text-gray-700">Description</h4>
            {isEditing ? (
              <textarea
                name="description"
                value={(formData.description || []).join("\n")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value.split("\n"),
                  }))
                }
                className="border border-gray-300 rounded-md px-2 py-1 w-full h-24"
              />
            ) : (
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
  );
};

export default PublicationSection;
