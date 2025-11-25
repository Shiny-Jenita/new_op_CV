import CheckIcon from "../ui/checkIcon";

interface LanguageSectionProps {
  languages: {
    name: string;
    proficiency: string;
    skills: string[];
  }[];
}

const LanguageSection = ({ languages }: LanguageSectionProps) => {
  return (
    <div className="overflow-x-auto border border-sky-700 rounded-lg p-4">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium text-[#828C92] w-1/5">Language</th>
            <th className="text-left py-2 font-medium text-[#828C92] w-1/5">Proficiency</th>
            <th className="text-center py-2 font-medium text-[#828C92] w-1/5">Read</th>
            <th className="text-center py-2 font-medium text-[#828C92] w-1/5">Write</th>
            <th className="text-center py-2 font-medium text-[#828C92] w-1/5">Speak</th>
          </tr>
        </thead>
        <tbody>
          {languages.map(({ name, proficiency, skills }, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-3 capitalize">{name}</td>
              <td className="py-3 capitalize">{proficiency}</td>
              <td className="py-3 text-center">
                {skills.includes("read") && <CheckIcon className="mx-auto" />}
              </td>
              <td className="py-3 text-center">
                {skills.includes("write") && <CheckIcon className="mx-auto" />}
              </td>
              <td className="py-3 text-center">
                {skills.includes("speak") && <CheckIcon className="mx-auto" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LanguageSection;
