'use client'
import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";

const RootPage = ({ params }: { params: { forTest?: boolean } }) => {
  return (
    <>
        <Link
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
            })}
            href={'./'}
        >
            Documentation
        </Link>
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
    </>

  )
};

export default RootPage;