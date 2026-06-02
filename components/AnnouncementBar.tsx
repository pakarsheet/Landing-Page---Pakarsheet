"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AnnouncementBar({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isClosed = sessionStorage.getItem("announcement_closed");
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  function close() {
    setIsVisible(false);
    sessionStorage.setItem("announcement_closed", "true");
  }

  return (
    <div className="relative z-[40] w-full bg-sky px-4 py-2 text-center text-sm font-medium text-cobalt sm:px-6 lg:px-8 mt-[80px] sm:mt-[100px] lg:mt-[140px]">
      <div className="mx-auto flex max-w-[1068px] lg:max-w-[860px] items-center justify-between gap-x-6">
        <p className="flex-1 text-center font-semibold leading-6">
          {text}
        </p>
        <button
          type="button"
          onClick={close}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Tutup</span>
          <X className="h-4 w-4 text-cobalt/70 hover:text-cobalt" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
