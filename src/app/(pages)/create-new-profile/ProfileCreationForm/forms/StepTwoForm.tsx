"use client";

import { ProjectsForm } from "./ProjectForm";
import { WorkExperienceForm } from "./WorkExperienceForm";

export function StepTwoForm({ readOnly }: { readOnly?: boolean }) {


    return (
        <div className="space-y-4 mt-14 px-6">
            <WorkExperienceForm readOnly={readOnly} />
            <ProjectsForm readOnly={readOnly} />
        </div>
    );
}
