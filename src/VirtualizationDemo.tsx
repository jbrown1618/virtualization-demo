import { useRef } from "react";
import { useVirtual } from "@tanstack/react-virtual";
import { LoremIpsum } from "lorem-ipsum";

import "./VirtualizationDemo.css";

const itemCount = 1000;
const demoHeight = 1000;
const fakeViewportHeight = 500;
const lineHeight = 24;
const spacerHeight = (demoHeight - fakeViewportHeight) / 2;
const linesInViewport = Math.ceil(fakeViewportHeight / lineHeight);
const heightOfAllLines = lineHeight * itemCount;

interface CodeLine {
  lineNumber: number;
  text: string;
}

const lorem = new LoremIpsum({
  wordsPerSentence: { min: 3, max: 4 },
});

const allItems: CodeLine[] = new Array(itemCount).fill(null).map((_, i) => ({
  lineNumber: i + 1,
  text: lorem.generateSentences(1),
}));

const getLineHeight = () => lineHeight;

export default function VirtualizationDemo() {
  const parentRef = useRef<HTMLDivElement>(null);

  const v = useVirtual({
    size: itemCount,
    parentRef,
    estimateSize: getLineHeight,
    measureSize: getLineHeight,
  });

  return (
    <div className="demo-container">
      <div className="demo-window" ref={parentRef}>
        <div className="demo-plain" style={{ height: heightOfAllLines }}>
          {/* Add a spacer so that the first line is at the top of the fake viewport */}
          <div style={{ height: spacerHeight }} />

          {allItems.map((line) => (
            <FakeCodeLine key={line.lineNumber} line={line} />
          ))}
        </div>

        <div className="demo-virtual" style={{ height: v.totalSize }}>
          {v.virtualItems.map((virtualItem) => {
            const firstIndex = v.virtualItems[0].index;

            // Artificially cut off the end for the purpose of the demo
            if (
              (firstIndex === 0 && virtualItem.index > linesInViewport) ||
              virtualItem.index > firstIndex + linesInViewport + 2
            ) {
              return null;
            }

            return (
              <FakeCodeLine
                key={virtualItem.key}
                line={allItems[virtualItem.index]}
                // Add spacerHeight to the offset so that the first line is at the top of the fake viewport
                offset={virtualItem.start + spacerHeight}
              />
            );
          })}
        </div>
      </div>

      <Overlay />
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

function Overlay() {
  return (
    <div className="overlay">
      <div className="overlay-top">
        <div className="case-label">Full list</div>
        <div className="case-label">Virtualized list</div>
      </div>
      <div className="overlay-center" />
      <div className="overlay-bottom">
        <div className="viewport-label">Viewport</div>
      </div>
    </div>
  );
}
