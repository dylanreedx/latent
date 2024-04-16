"use client";

import { cn } from "@/lib/utils";
import React from "react";

export default function QuestionOptions(question: { options: string[] }) {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(
    null,
  );

  const selectOption = (index: number) => {
    setSelectedOption(index);
  };
  return (
    <ul className="flex flex-col gap-2">
      {question.options.map((option, index) => (
        <li key={index} className="align flex items-center gap-2">
          <span
            onClick={() => selectOption(index)}
            className={cn(
              "cursor-pointer rounded-md p-2 duration-200 hover:bg-muted-foreground/15",
              {
                "bg-muted-foreground/15 text-primary": selectedOption === index,
              },
            )}
          >
            {option}
          </span>
        </li>
      ))}
    </ul>
  );
}
