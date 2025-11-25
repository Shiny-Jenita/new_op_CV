import React from "react";

interface ResumeResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    htmlContent: string;
  };
}

export default async function ResumePage({
  params,
}: {
  params: { resumeId: string };
}) {
  const { resumeId } = params;

  const res = await fetch(
    `https://dev-api.optimizedcv.ai/api/v1/resume/${resumeId}`,
    {
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading resume</h1>
        <p>Status: {res.status}</p>
      </div>
    );
  }

  const json: ResumeResponse = await res.json();
  if (!json.success) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error fetching resume</h1>
        <p>{json.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-auto">
      <div className="py-8 mx-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: json.data.htmlContent,
          }}
        />
      </div>
    </div>
  );
}
