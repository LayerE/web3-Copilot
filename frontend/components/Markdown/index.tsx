import { Code } from "react-feather";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CodeBlock from "./CodeBlock";
import style from "./markdown-styles.module.css";
import rehypeRaw from "rehype-raw";
import { useEffect, useState } from "react";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function MarkdownContent({
  content,
  isDone,
}: {
  content: any;
  isDone?: boolean;
}) {
  let smallCursor = "&#8285;";
  let bigCursor = "&#8286;";

  let cursors = [bigCursor, smallCursor];
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);
  
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentCursorIndex((prevIndex) =>
        prevIndex === cursors.length - 1 ? 0 : prevIndex + 1
      );
    }, 150);

    if (!isDone) {
      window.clearInterval(intervalId);
    }

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cursors, isDone]);
  return (
    <Markdown
      linkTarget={"_blank"}
      // rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      className={style.reactMarkDown}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeBlock
              language={match[1]}
              value={String(children)
                .replace(/\n$/, "")
                .replace("&#8285;", "|")
                .replace("&#8286;", "|")}
               isDone={!isDone}
            />
          ) : (
            <code>{children}</code>
          );
        },
      }}
    >
      {isDone ? `${content} ${cursors[currentCursorIndex]} ` : content}
    </Markdown>
  );
}
