"use client";

import { CertificationForm } from "./CertificationsForm";
import { PublicationForm } from "./PublicationsForm";
import { EducationForm } from "./EducationForm";

export function StepThreeForm({ readOnly = false }: { readOnly?: boolean }) {

    return (
        <div className="space-y-4 mt-16 px-6">
            <EducationForm readOnly={readOnly} />
            <CertificationForm readOnly={readOnly} />
            <PublicationForm readOnly={readOnly} />
        </div>
    );
}
