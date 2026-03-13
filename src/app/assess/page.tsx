"use client";

import { Suspense } from "react";
import AssessPageContent from "./AssessPageContent";

export default function AssessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading assessment...</div>
        </div>
      </div>
    }>
      <AssessPageContent />
    </Suspense>
  );
}
