import { useRef } from "react";
import { useVirtual } from "@tanstack/react-virtual";
import { LoremIpsum } from "lorem-ipsum";

import "./App.css";

interface CodeLine {
  lineNumber: number;
  text: string;
}

const lorem = new LoremIpsum({
  wordsPerSentence: { min: 3, max: 4 },
});

const allItems: CodeLine[] = new Array(1000).fill(null).map((_, i) => ({
  lineNumber: i + 1,
  text: lorem.generateSentences(1),
}));

const lineHeight = () => 24;

export default function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const v = useVirtual({
    size: 1000,
    parentRef,
    estimateSize: lineHeight,
    measureSize: lineHeight,
  });

  return (
    <div className="demo-container">
      <div className="demo-window" ref={parentRef}>
        <div className="demo-plain">
          {allItems.map((line) => (
            <FakeCodeLine key={line.lineNumber} line={line} />
          ))}
        </div>

        <div className="demo-virtual" style={{ height: `${v.totalSize}px` }}>
          {v.virtualItems.map((virtualItem) => (
            <FakeCodeLine
              key={virtualItem.key}
              line={allItems[virtualItem.index]}
              offset={virtualItem.start}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FakeCodeLine({ line, offset }: { line: CodeLine; offset?: number }) {
  return (
    <div
      className="code-line"
      style={
        offset === undefined
          ? undefined
          : {
              transform: `translateY(${offset}px)`,
              position: "absolute",
              top: 0,
            }
      }
    >
      <div className="line-number">{line.lineNumber}</div>
      <div className="line-text">{line.text}</div>
    </div>
  );
}
