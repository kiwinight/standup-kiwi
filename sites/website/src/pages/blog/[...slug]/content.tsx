import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  Section,
  Theme,
  Card,
  Inset,
  Button,
} from "@radix-ui/themes";
import { NavBar } from "../../../components/nav-bar";
import type { RenderedContent } from "astro:content";
import type { InferEntrySchema } from "astro:content";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

type Props = {
  post: {
    id: string;
    body?: string;
    collection: "blog";
    data: InferEntrySchema<"blog">;
    rendered?: RenderedContent;
    filePath?: string;
  };
  children: ReactNode;
};

function Content({ post, children }: Props) {
  return (
    <Theme className="relative" accentColor="gray">
      <NavBar />
      <Box>
        <Section
          size={{
            initial: "3",
            sm: "4",
          }}
          className="relative"
        >
          <Container
            size={{
              sm: "2",
            }}
            px={{
              initial: "4",
            }}
          >
            <Flex direction="column" gap="6">
              <Flex direction="column" gap="4">
                <Flex>
                  <Button asChild variant="ghost" highContrast>
                    <a href={`/blog`}>
                      <ArrowLeftIcon />
                      Back to blog
                    </a>
                  </Button>
                </Flex>
                <Heading
                  as="h1"
                  size={{
                    initial: "8",
                  }}
                >
                  {post.data.title}
                </Heading>
                <Text size="2" color="gray">
                  Posted on{" "}
                  {post.data.pubDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  • Edited on{" "}
                  {post.data.updatedDate?.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </Flex>
            </Flex>
          </Container>
        </Section>

        <Section
          size={{
            initial: "3",
            sm: "4",
          }}
          pt="0"
          className="relative"
        >
          <Container
            size={{
              sm: "2",
            }}
            px={{
              initial: "4",
            }}
          >
            <Flex
              direction="column"
              gap={{
                initial: "7",
                sm: "8",
              }}
            >
              <Card
                size={{
                  initial: "2",
                  sm: "4",
                }}
              >
                <Inset clip="padding-box" side="all">
                  <img
                    src={post.data.heroImage}
                    className="object-cover w-full aspect-2/1"
                    alt={post.data.title}
                  />
                </Inset>
              </Card>
              <Box className="prose max-w-none">{children}</Box>
            </Flex>
          </Container>
        </Section>
      </Box>
    </Theme>
  );
}

export default Content;
