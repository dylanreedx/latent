import { suggestions } from "@/utils/exam-suggestions";
import { Button } from "./button";
import { EXAM_INPUT_PATTERN } from "@/utils/exam-pattern-match";

type Props = {
  setPromptState: React.Dispatch<
    React.SetStateAction<{
      topic: string;
      timeline: string;
    }>
  >;
};
export default function SuggestionsList({ setPromptState }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, idx) => (
        <Button
          variant="outline"
          className="text-xs md:text-base"
          key={idx}
          onClick={() => {
            const match = EXAM_INPUT_PATTERN.exec(suggestion);
            if (match) {
              setPromptState({
                topic: match.groups!.topic,
                timeline: match.groups!.timeline,
              });
              // handleGetQuiz();
            } else {
              console.log("No match");
            }
          }}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
