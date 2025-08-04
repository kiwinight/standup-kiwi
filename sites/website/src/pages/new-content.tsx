import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
  Theme,
} from "@radix-ui/themes";

import { NavBar } from "../components/nav-bar";
import { ChevronDownIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  BoxesIcon,
  ClockFadingIcon,
  GithubIcon,
  KeyboardIcon,
  LayoutGridIcon,
} from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

function Hero() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-white via-blue-50/50 to-blue-50/60"
    >
      <Container
        size={{
          initial: "4",
          sm: "3",
          // sm: "4",
        }}
        maxWidth="992px"
        px={{
          initial: "4",
        }}
      >
        <Flex
          direction="column"
          gap={{
            initial: "4",
            sm: "5",
          }}
          align={{
            initial: "center",
            sm: "center",
          }}
        >
          <Heading
            as="h1"
            size={{
              initial: "8",
              sm: "9",
            }}
            // weight="medium"
            align={{
              initial: "center",
              sm: "center",
            }}
          >
            The standup tool that
            <br className="hidden sm:block" />
            <Text
              // className="italic bg-linear-to-r from-[var(--violet-9)]/80 via-[var(--violet-9)]/90 to-[var(--violet-9)] bg-clip-text text-transparent"
              className="italic"
              weight="bold"
            >
              actually works
            </Text>
          </Heading>
          <Flex gap="2">
            <Badge size="2" color="gray">
              <LayoutGridIcon size={15} strokeWidth={1.5} />
              Organized Board
            </Badge>
            <Badge size="2" color="gray">
              <ClockFadingIcon size={15} strokeWidth={1.5} />
              Shorter Meetings
            </Badge>
            <Badge size="2" color="gray">
              <GithubIcon size={15} strokeWidth={1.5} />
              Open Source
            </Badge>
          </Flex>
          <Text
            size={{
              initial: "4",
              // initial: "3",
              // sm: "4",
            }}
            color="gray"
            align={{
              initial: "center",
              sm: "center",
            }}
          >
            Skip the endless meetings and scattered chat threads.
            <br className="hidden sm:block" />
            Standup Kiwi gives you a simple, organized board to share and record
            daily updates
            <br className="hidden sm:block" />— whether you work solo or with a
            team.
          </Text>

          <Button
            // className="self-start!"
            asChild
            // className="w-full! sm:w-auto! bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            size={{
              initial: "3",
              sm: "4",
            }}
            // color="violet"
            highContrast
          >
            <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
          </Button>

          <Box mt="4" />

          <Box>
            <img
              src="/image.png"
              style={{
                filter: "grayscale(100%) blur(2px)",
              }}
            />
          </Box>
        </Flex>
      </Container>
    </Section>
  );
}

function Problem() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-blue-50/60 via-blue-50/70 to-violet-50/60"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "1248px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex
          direction="column"
          gap={{
            initial: "4",
            sm: "5",
          }}
          align={{
            initial: "center",
            sm: "center",
          }}
        >
          <Heading
            as="h3"
            // size="7"
            size="8"
            // className="italic! font-semibold!"
          >
            Are you tired of...?
          </Heading>

          <Box mt="1" />

          <Grid
            columns={{
              initial: "1",
              sm: "4",
            }}
            gap="4"
          >
            <Card size="5" className="" variant="ghost">
              {/* <Badge color="red" size="1" mb="3">
              30+ min wasted
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                Endless meetings...
              </Heading>
              <Text color="gray">
                Daily standup meetings that drag on for 30 minutes when everyone
                just needs to share quick updates.
              </Text>
            </Card>

            <Card size="5" className="" variant="ghost">
              {/* <Badge color="orange" size="1" mb="3">
              Never found
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                Lost in Slack...
              </Heading>
              <Text color="gray">
                Scattered updates buried in threads that you can never find
                later when you need them.
              </Text>
            </Card>

            <Card size="5" className="" variant="ghost">
              <Flex
                // className="h-full items-center"
                direction="column"
                gap="2"
                // justify="center"
                // align="center"
              >
                {/* <Badge size="2">Too complex</Badge> */}
                {/* ICON? */}
                {/* <ToolCaseIcon /> */}
                <Heading as="h3" size="5" className="italic!">
                  Tool overload...
                </Heading>
                <Text
                  color="gray"
                  // align="center"
                >
                  Over-engineered tools like Jira, Notion templates, or Linear
                  that feel like overkill for simple daily check-ins.
                </Text>
              </Flex>
            </Card>

            <Card size="5" className="" variant="ghost">
              {/* <Badge color="gray" size="1" mb="3">
              Always scrambling
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                No record keeping...
              </Heading>
              <Text color="gray">
                When your boss asks "what's your team been working on?" you
                scramble to remember what happened last week.
              </Text>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function MeetStandupKiwi() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/60 via-blue-50/65 to-violet-50/50"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth="992px"
        px={{
          initial: "4",
        }}
      >
        <Flex
          direction="column"
          gap={{
            initial: "4",
            sm: "5",
          }}
          align="center"
        >
          <Heading as="h2" size="8" align="center">
            Meet Standup Kiwi,
            <br />
            The lightweight standup tool that actually works.
          </Heading>
          <Text color="gray" align="center">
            Standup Kiwi is designed for one thing: making daily standups
            effortless and meaningful.
            <br />
            No complex features you don't need. No meetings that drag on.
            <br />
            Just clean, organized updates that help you and your team stay in
            sync.
          </Text>

          <Box mt="4" />
          {/* 
          <img
            src="/image.png"
            className="w-full"
            style={{
              filter: "grayscale(100%) blur(2px)",
            }}
          /> */}

          <Box mt="4" />
        </Flex>
      </Container>
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "1248px",
          // sm: "1608px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex
          direction="column"
          gap={{
            initial: "4",
            sm: "5",
          }}
          align="center"
        >
          {/* <Box mt="4" /> */}
          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <Card
              variant="classic"
              size="5"
              // className=" ring-1 ring-gray-200/50"
            >
              <Flex direction="column" gap="3">
                {/* <ScanTextIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Replace 30-minute meetings
                  <br className="hidden sm:block" />
                  with 5-minute updates
                </Heading>
                <Text size="1" color="red">
                  (TODO: either replace or focus on meetings)
                </Text>
                <Text color="gray">
                  Skip the scheduling conflicts and time zone nightmares. Write
                  your update when it's convenient, read everyone else's when
                  you need to. No more sitting through meetings where you're
                  only interested in 5 minutes of content.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>
            <Card
              variant="classic"
              size="5"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/50"
            >
              <Flex direction="column" gap="3">
                {/* <MapPinCheckInsideIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Everything organized in one place
                </Heading>
                <Text color="gray">
                  No more digging through endless Slack threads or trying to
                  remember "what channel was that update in?" All your team's
                  progress lives in clean, organized cards with a clear
                  browsable history.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>
            <Card
              variant="classic"
              size="5"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring-gray-200/50"
            >
              <Flex direction="column" gap="3">
                {/* <FocusIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Simple and focused - built just for standups
                </Heading>
                <Text color="gray">
                  Unlike Jira, Notion templates, or Linear, Standup Kiwi does
                  one thing really well: daily standups. No complex project
                  management features you don't need, no overwhelming setup
                  process, just clean daily updates.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>
            <Card
              variant="classic"
              size="5"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/50"
            >
              <Flex direction="column" gap="3">
                {/* <SquareDashedIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Never lose track of what your team accomplished
                </Heading>
                <Text color="gray">
                  When your boss asks "what's your team been working on this
                  week?" you'll have a clear, browsable history instead of
                  scrambling to remember. Perfect for performance reviews,
                  progress reports, and onboarding new team members.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>
            {/* <Card size="5">
              <Flex direction="column" gap="3">
                <SquareDashedIcon size="32" strokeWidth={1.5} />
                <Heading as="h3" size="4">
                  Your data, your control - open source and self-hostable
                </Heading>
                <Text color="gray">
                  Built transparently in the open with no vendor lock-in. Keep
                  everything on your own servers if you want, or use our hosted
                  version. Either way, your standup data belongs to you, not
                  buried in some proprietary system.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card> */}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/50 via-blue-50/55 to-violet-50/65"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "1248px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="4">
          <Heading as="h2" size="8" align="center">
            How it works
          </Heading>
          <Text color="gray" align="center">
            Simple as 1-2-3
          </Text>
          <Box mt="4" />
          <Grid columns="2" gap="4">
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                <Avatar
                  // highContrast
                  fallback="1"
                  variant="soft"
                  size="2"
                  radius="full"
                />
                <Heading as="h3" size="5">
                  Create your board
                </Heading>
                <Text color="gray">
                  Set up a personal board or team workspace in seconds. Name it
                  whatever makes sense—"Daily Progress," "Team Alpha," or just
                  your name. No complex setup, no admin approval needed.
                </Text>
                <Box mt="4" />

                <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                <Avatar
                  // highContrast
                  fallback="2"
                  variant="soft"
                  size="2"
                  radius="full"
                />
                <Heading as="h3" size="5">
                  Write Your Update
                </Heading>
                <Text color="gray">
                  Answer the classic questions: What did you do yesterday?
                  What's planned for today? Any blockers? Use our clean markdown
                  editor to format lists, add links, and make your updates
                  scannable.
                </Text>
                <Box mt="4" />
                <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                />
              </Flex>
            </Card>

            <Card variant="classic" size="5" className="col-span-2">
              <Grid columns="2" gap="4">
                <Flex
                  direction="column"
                  gap="3"
                  // align="center"
                  justify="center"
                >
                  <Avatar
                    // highContrast
                    fallback="3"
                    variant="soft"
                    size="2"
                    radius="full"
                  />
                  <Heading as="h3" size="5">
                    Stay Organized
                  </Heading>
                  <Text color="gray">
                    Your updates become organized cards on a clean board. Browse
                    today's updates, review past work, and never lose track of
                    progress again. Everything is right where you need it, when
                    you need it.
                  </Text>
                </Flex>
                <Flex>
                  <img
                    src="/image.png"
                    style={{
                      filter: "grayscale(100%) blur(2px)",
                    }}
                  />
                </Flex>
              </Grid>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function WhoItsPerfectFor() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/65 via-blue-50/45 to-violet-50/70"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "1248px",
          // sm: "1608px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="8">
          <Heading as="h2" size="8" align="center">
            Who it's perfect for
          </Heading>
          <Grid columns="3" gap="4">
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                <BoxesIcon size="32" strokeWidth={1.25} />
                <Heading as="h3" size="5">
                  Small teams, startups, distributed companies
                </Heading>
                <ul className="list-disc">
                  <li>
                    <Text color="gray">
                      Replace time-zone nightmare meetings with async updates
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Keep everyone informed without interrupting deep work
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Create a browsable history of team progress
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Onboard new members with context from day one
                    </Text>
                  </li>
                </ul>
                {/* 
                <Box mt="4" />
                <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                /> */}
              </Flex>
            </Card>
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                <KeyboardIcon size="32" strokeWidth={1.25} />
                <Heading as="h3" size="5">
                  Developers, designers, writers, consultants
                </Heading>
                <ul className="list-disc">
                  <li>
                    <Text color="gray">
                      Start each day with clarity and purpose
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">Track your progress over time</Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Never lose track of what you were working on
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Build a portfolio of your daily achievements
                    </Text>
                  </li>
                </ul>
                <Text color="gray" align="center"></Text>
                {/* <Box mt="4" />
                <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                /> */}
              </Flex>
            </Card>

            <Card variant="classic" size="5">
              <Grid columns="1" gap="4">
                <Flex direction="column" gap="3">
                  {/* <div
                    dangerouslySetInnerHTML={{ __html: siGithub.svg }}
                    className="w-8 h-8"
                  /> */}
                  <GitHubLogoIcon width="32" height="32" strokeWidth={1.25} />
                  <Heading as="h3" size="5">
                    Maintainers, contributors, volunteer teams
                  </Heading>
                  <ul className="list-disc">
                    <li>
                      <Text color="gray">
                        Coordinate across continents without scheduling
                        conflicts
                      </Text>
                    </li>
                    <li>
                      <Text color="gray">
                        Document contributions and progress transparently
                      </Text>
                    </li>
                    <li>
                      <Text color="gray">
                        Keep volunteers engaged with visible momentum
                      </Text>
                    </li>
                    <li>
                      <Text color="gray">
                        Self-host with complete control over your data
                      </Text>
                    </li>
                  </ul>
                </Flex>
                {/* <Flex>
                  <img
                    src="/image.png"
                    style={{
                      filter: "grayscale(100%) blur(2px)",
                    }}
                  />
                </Flex> */}
              </Grid>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function OpenSource() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/70 via-blue-50/50 to-white"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "992px",
          // sm: "1248px",
          // sm: "1608px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="8">
          <Heading as="h2" size="8" align="center">
            Open Source You Can Trust
          </Heading>

          <Grid columns="2" gap="4">
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                {/* <BoxesIcon size="32" strokeWidth={1.25} /> */}
                <Heading as="h3" size="5">
                  Your Data, Your Rules
                </Heading>
                <ul className="list-disc">
                  <li>
                    <Text color="gray">
                      Complete transparency - see exactly how your data is
                      handled
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Self-hosting option - keep everything on your own servers
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      No vendor lock-in - export your data anytime
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Community-driven - shaped by real users like you
                    </Text>
                  </li>
                </ul>
              </Flex>
            </Card>
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Built in the Open
                </Heading>
                <ul className="list-disc">
                  <li>
                    <Text color="gray">
                      Open source on GitHub - help us build something great
                      together
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Active development with regular updates
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Community support for issues and feature requests
                    </Text>
                  </li>
                  <li>
                    <Text color="gray">
                      Getting started guide with setup instructions
                    </Text>
                  </li>
                </ul>
                <Text color="gray" align="center"></Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function Pricing() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-white via-blue-50/40 to-blue-50/50"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "992px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="8">
          <Heading as="h2" size="8" align="center">
            Pricing
          </Heading>
          <Grid columns="2" gap="4">
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3" height="100%">
                <Heading as="h3" size="5">
                  Self-Hosting
                </Heading>
                <Text color="gray">
                  Deploy on your servers. Complete data control, always free
                  forever.
                </Text>
                <Text size="8" weight="bold">
                  Free
                </Text>

                <ul className="flex flex-col gap-1">
                  <li>
                    <Text color="gray">Always free forever</Text>
                  </li>
                  <li>
                    <Text color="gray">Deploy on your own servers</Text>
                  </li>
                  <li>
                    <Text color="gray">Complete control of your data</Text>
                  </li>
                  <li>
                    <Text color="gray">Full feature access</Text>
                  </li>
                </ul>
                <Box mt="1" />

                <Button
                  asChild
                  className="w-full! sm:w-auto! bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  size={{
                    initial: "3",
                    // sm: "4",
                  }}
                  highContrast
                  variant="outline"
                  mt="auto"
                >
                  <a href={import.meta.env.PUBLIC_APP_URL}>
                    {/* Get started free */}
                    View documentation
                  </a>
                </Button>
              </Flex>
            </Card>

            <Card variant="classic" size="5">
              <Flex direction="column" gap="3" height="100%">
                <Heading as="h3" size="5">
                  Managed Service
                </Heading>
                <Text color="gray">
                  Fully hosted with zero setup. All features included, automatic
                  updates.
                </Text>
                <Text size="8" weight="bold">
                  Free
                </Text>

                <Text color="gray" size="2" className="italic">
                  (After early beta period (12+ months), it would be
                  $1/user/month per board.)
                </Text>

                <ul className="flex flex-col gap-1">
                  <li>
                    <Text color="gray">Hosted at standupkiwi.com</Text>
                  </li>
                  <li>
                    <Text color="gray">Zero setup required</Text>
                  </li>
                  <li>
                    <Text color="gray">All features included</Text>
                  </li>
                </ul>
                <Box mt="1" />
                <Button
                  asChild
                  className="w-full! sm:w-auto! bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-200"
                  size={{
                    initial: "3",
                    // sm: "4",
                  }}
                  highContrast
                  mt="auto"
                >
                  <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
                </Button>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

const FAQ_ITEMS = [
  {
    question: "Is it really free?",
    answer:
      "Yes! Everything is free right now. Self-hosting will always stay free, and our managed service will introduce pricing much later with advance notice and data migration support.",
  },
  {
    question: "Can my team use it now?",
    answer:
      "[TODO: we already have a shared board feature.]Team collaboration features are in beta. Individual team members can create personal boards immediately, and we're rolling out shared team boards soon.",
  },
  {
    question: "How is this different from just using Slack?",
    answer:
      "[TODO: this is too much] Slack is great for quick conversations, but ~terrible~ for organized daily updates. Standup Kiwi creates a clean, searchable history of your work that you can actually use.",
  },
  {
    question: "Do I need to know how to code to self-host?",
    answer:
      "[TODO: no one click..] Basic server knowledge helps, but we're working on one-click deployment options. Most users are happy with our hosted version.",
  },
  {
    question: "What if I don't like it?",
    answer:
      "No problem! Your data is yours—export it anytime. No contracts, no hassle.",
  },
];

function FAQ() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-blue-50/50 via-blue-50/60 to-violet-50/60"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "992px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="8">
          <Heading as="h2" size="8" align="center">
            Questions? Answers
          </Heading>
          {/* <Box className="bg-gradient-to-br from-white to-gray-50/40 rounded-lg shadow-sm ring-1 ring-gray-200/50 p-2"> */}
          <Card variant="classic" size="3" className="py-3!">
            <AccordionPrimitive.Root type="multiple">
              {FAQ_ITEMS.map((item, index) => {
                return (
                  <AccordionPrimitive.Item value={`item-${index + 1}`} asChild>
                    <Box className="border-b last:border-b-0 border-[var(--gray-6)]">
                      <AccordionPrimitive.Trigger className="group p-[var(--space-5)] w-full cursor-pointer">
                        <Flex align="center" justify="between">
                          <Text size="5" weight="bold">
                            {item.question}
                          </Text>
                          <ChevronDownIcon className="group-data-[state=open]:rotate-180" />
                        </Flex>
                      </AccordionPrimitive.Trigger>
                      <AccordionPrimitive.Content className="p-[var(--space-5)] pt-0 w-full">
                        <Text as="p" size="3" color="gray">
                          {item.answer}
                        </Text>
                      </AccordionPrimitive.Content>
                    </Box>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>
          </Card>
          {/* </Box> */}
        </Flex>
      </Container>
    </Section>
  );
}

function Roadmap() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/60 via-blue-50/65 to-violet-50/70"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          // sm: "768px",
          // sm: "992px",
          sm: "1248px",
        }}
        px={{
          initial: "4",
        }}
      >
        <Flex direction="column" gap="4">
          <Heading as="h2" size="8" align="center">
            What's coming next
          </Heading>
          <Text color="gray" align="center">
            We're just getting started. Here's what we're working on based on
            real user feedback:
          </Text>
          <Box mt="4" />
          <Grid columns="3" gap="4" gapY="4">
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Yesterday context recall
                </Heading>
                <Text color="gray">
                  "What did I do yesterday again?" Auto-fill from your previous
                  updates
                </Text>
              </Flex>
            </Card>
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Today suggestion engine
                </Heading>
                <Text color="gray">
                  Get smart suggestions for today's update based on your work
                  patterns
                </Text>
              </Flex>
            </Card>
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Daily team digest
                </Heading>
                <Text color="gray">
                  See what everyone's working on today (not just for managers!)
                </Text>
              </Flex>
            </Card>
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  AI weekly digest
                </Heading>
                <Text color="gray">
                  Auto-generated personal and team summaries with insights and
                  trends
                </Text>
              </Flex>
            </Card>
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring/-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Desktop and mobile apps
                </Heading>
                <Text color="gray">
                  Native desktop and mobile apps for a seamless experience.
                </Text>
              </Flex>
            </Card>
            <Card
              size="5"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  And more...!
                </Heading>
                <Text color="gray">
                  We're just getting started. Your feedback shapes our
                  priorities. What would help you most?
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="bg-gradient-to-b from-violet-50/70 via-violet-50/80 to-blue-50/70"
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          sm: "992px",
        }}
      >
        <Flex direction="column" gap="4">
          <Heading as="h2" size="8" align="center">
            Ready to transform your standups?
          </Heading>
          <Text color="gray" align="center">
            Set up your standup board in seconds
          </Text>
          <Box mt="4" />
          <Flex justify="center">
            <Button
              asChild
              highContrast
              size="4"
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
            </Button>
          </Flex>
        </Flex>
      </Container>
      <Box mt="80px" />
    </Section>
  );
}

function NewContent() {
  return (
    <Theme className="relative" accentColor="gray">
      <NavBar />
      <Hero />
      <Problem />
      <MeetStandupKiwi />
      <HowItWorks />
      <WhoItsPerfectFor />
      <OpenSource />
      <Pricing />
      <FAQ />
      <Roadmap />
      <FinalCTA />
    </Theme>
  );
}

export default NewContent;
