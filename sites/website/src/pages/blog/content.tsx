import {
  Box,
  Card,
  Container,
  Flex,
  Heading,
  Inset,
  Section,
  Text,
  Theme,
} from "@radix-ui/themes";
import { NavBar } from "../../components/nav-bar";
import type { InferEntrySchema, RenderedContent } from "astro:content";
import { PAGE_DESCRIPTION } from "./constants";

type Props = {
  posts: {
    id: string;
    body?: string;
    collection: "blog";
    data: InferEntrySchema<"blog">;
    rendered?: RenderedContent;
    filePath?: string;
  }[];
};

function Content({ posts }: Props) {
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
            <Flex direction="column" gap="7">
              <Flex
                direction="column"
                gap={{
                  initial: "4",
                }}
                align="start"
              >
                <Heading
                  as="h1"
                  size={{
                    initial: "8",
                  }}
                >
                  Blog
                </Heading>
                <Text size="4" color="gray">
                  {PAGE_DESCRIPTION}
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
            <Flex direction="column" gap="6">
              {posts.map((post) => {
                return (
                  <Card
                    asChild
                    key={post.id}
                    size={{
                      initial: "2",
                      sm: "4",
                    }}
                  >
                    <a href={`/blog/${post.id}`}>
                      <Inset clip="padding-box" side="top" pb="current">
                        {post.data.heroImage && (
                          <img
                            src={post.data.heroImage}
                            className="object-cover w-full aspect-2/1"
                            alt={post.data.title}
                          />
                        )}
                      </Inset>
                      <Flex direction="column" gap="2">
                        <Text size="6" weight="bold">
                          {post.data.title}
                        </Text>

                        <Text size="3">{post.data.description}</Text>

                        <Text size="2" color="gray">
                          {post.data.pubDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                      </Flex>
                    </a>
                  </Card>
                );
              })}
            </Flex>
          </Container>
        </Section>
      </Box>
    </Theme>
  );
}

export default Content;
