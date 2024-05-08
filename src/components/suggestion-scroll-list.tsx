// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import { suggestions as suggestionList } from "@/utils/exam-suggestions";
import { Button } from "./ui/button";

export function SuggestionsList() {
  const [suggestions, setSuggestions] = useState([...suggestionList]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 = scrolling right, -1 = scrolling left
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!suggestionsContainerRef.current) return;
      const containerWidth = suggestionsContainerRef.current.offsetWidth;
      const elementWidth = suggestions[0].offsetWidth;
      const visibleElements = Math.ceil(containerWidth / elementWidth);

      // Calculate the scroll position
      setScrollPosition(
        (prevScrollPosition) =>
          prevScrollPosition + scrollDirection * elementWidth,
      );

      // Reposition the elements
      suggestions.forEach((suggestion, index) => {
        suggestion.style.transform = `translateX(${scrollPosition + index * elementWidth}px)`;
      });

      // Check if we need to reset the scroll position
      if (scrollPosition > containerWidth || scrollPosition < -containerWidth) {
        setScrollPosition(0);
        setScrollDirection(-scrollDirection);
      }
    };

    suggestionsContainerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      suggestionsContainerRef.current.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [suggestions, scrollDirection, scrollPosition]);

  return (
    <section className="relative w-full p-16">
      <div className="relative inline-flex w-full flex-nowrap overflow-x-hidden">
        <div className="absolute left-0 z-20 h-full  w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 z-20 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={suggestionsContainerRef}
          className="animate-marquee-infinite flex items-center justify-center gap-4 md:justify-start"
        >
          {suggestions.map((suggestion, key) => (
            <Button key={key} variant="outline">
              {suggestion}
            </Button>
          ))}
          {suggestions.map((suggestion, key) => (
            <Button key={key} variant="outline">
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
