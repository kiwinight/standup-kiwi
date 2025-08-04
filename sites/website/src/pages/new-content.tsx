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
  Inset,
  Section,
  Text,
  Theme,
} from "@radix-ui/themes";
import { useEffect, useRef } from "react";

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
      pt="calc(80px * var(--scaling) * 1.5)"
      style={{
        // backgroundImage:
        //   "radial-gradient(circle 800px at 700px 200px, var(--purple-2), transparent),radial-gradient(circle 600px at calc(100% - 300px) 300px, var(--blue-3), transparent),radial-gradient(circle 800px at right center, var(--sky-3), transparent),radial-gradient(circle 800px at right bottom, var(--sky-1), transparent),radial-gradient(circle 800px at calc(50% - 600px) calc(100% - 100px), var(--pink-3), var(--pink-1), transparent)",
        // backgroundImage: `radial-gradient(circle 1000px at center 66.66%, var(--pink-2), transparent),
        // 			radial-gradient(circle 1000px at 10% 80%, var(--violet-2), var(--purple-2), transparent),
        // 			radial-gradient(circle 600px at right 40%, var(--blue-2), transparent),
        // 			radial-gradient(circle 800px at right 60%, var(--sky-2), transparent),
        // 			radial-gradient(circle 800px at right bottom, var(--iris-3), transparent)`,

        backgroundImage:
          "linear-gradient(var(--color-background), rgba(255, 255, 255, 0.85) 50%), url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fblossom-2-preview.png&w=3840&q=75')",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      // className="bg-white"f
    >
      <Container
        size={{
          initial: "4",
          sm: "3",
          // sm: "4",
        }}
        maxWidth={{
          // sm: '992px',
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
            <Badge size="2">
              <LayoutGridIcon size={15} strokeWidth={1.5} />
              Organized Board
            </Badge>
            <Badge size="2">
              <ClockFadingIcon size={15} strokeWidth={1.5} />
              Shorter Meetings
            </Badge>
            <Badge size="2">
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
              // src="https://obsidian.md/images/screenshot-1.0-hero-combo.png"
              src="/hero-light-devices.png"
              style={
                {
                  // filter: "grayscale(100%) blur(2px)",
                }
              }
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
      // className="bg-white"
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
            <Card size="3" variant="classic" className="">
              {/* <Badge color="red" size="1" mb="3">
              30+ min wasted
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                Endless meetings...
              </Heading>
              <Text>
                Daily standup meetings that drag on for 30 minutes when everyone
                just needs to share quick updates.
              </Text>
            </Card>

            <Card size="3" variant="classic" className="">
              {/* <Badge color="orange" size="1" mb="3">
              Never found
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                Lost in Slack...
              </Heading>
              <Text>
                Scattered updates buried in threads that you can never find
                later when you need them.
              </Text>
            </Card>

            <Card size="3" variant="classic" className="">
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

                // align="center"
                >
                  Over-engineered tools like Jira, Notion templates, or Linear
                  that feel like overkill for simple daily check-ins.
                </Text>
              </Flex>
            </Card>

            <Card size="3" variant="classic" className="">
              {/* <Badge  size="1" mb="3">
              Always scrambling
            </Badge> */}
              <Heading as="h3" size="5" mb="2" className="italic!">
                No record keeping...
              </Heading>
              <Text>
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
      // className="bg-white"
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
            Meet Standup Kiwi—
            <br />
            Turn dragging meetings into quick sync
          </Heading>
          <Text align="center">
            Get your time back, keep your team aligned, and always know what's
            happening.
            <br />
            No more scrambling for answers when your boss asks for updates.
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
            // gapY="0"
          >
            {/* <Box className="col-span-4">
              <img
                src="https://obsidian.md/images/sync-share.png"
                alt="Example of Obsidian Help site powered by Obsidian Publish"
                className="mb-[-12%]  rounded-xl shadow-2xl ring-1 ring-black/20"
              ></img>
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-primary pt-[7%]"></div>
              </div>
            </Box> */}
            {/* <div className="col-span-2 relative">
              <img
                // src="https://obsidian.md/images/sync-share.png"
                src="/as-solution.png"
                // alt="Example of Obsidian Help site powered by Obsidian Publish"
                className=" w-full h-auto object-cover object-top aspect-[2/1]"
                // className="rounded-xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white via-5% to-transparent to-20% pointer-events-none"></div>
            </div> */}
            <Card
              // className="col-span-2 pb-0!"
              className="col-span-2 pb-0!"
              size={{
                sm: "5",
              }}
              // style={{
              //   backgroundImage:
              //     "url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fgood-vibes-preview.png&w=3840&q=75')",
              //   backgroundSize: "cover",
              //   backgroundPosition: "center",
              //   backgroundRepeat: "no-repeat",
              //   // backdropFilter: "none",
              //   // backgroundColor: "transparent",
              //   // "::before": {
              //   //   backdropFilter: "none",
              //   //   backgroundColor: "transparent",
              //   // },
              // }}
            >
              <Inset
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fautumnal-peach-preview.png&w=3840&q=75')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                side="top"
              >
                <Box p="9" pb="0">
                  <img
                    // src="https://obsidian.md/images/sync-share.png"
                    src="/as-solution-v2.png"
                    // alt="Example of Obsidian Help site powered by Obsidian Publish"
                    className=" w-full h-auto object-cover object-top aspect-[2/1]"
                    // className="rounded-xl w-full h-auto"
                  />
                </Box>
              </Inset>
              {/* <img
                // src="https://obsidian.md/images/sync-share.png"
                src="/as-solution.png"
                // alt="Example of Obsidian Help site powered by Obsidian Publish"
                className=" w-full h-auto object-cover object-top aspect-[2/1]"
                // className="rounded-xl w-full h-auto"
              /> */}
            </Card>
            <Card
              variant="classic"
              size="5"
              // className=" ring-1 ring-gray-200/50"
            >
              <Flex direction="column" gap="3">
                {/* <ScanTextIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Turn 30-minute meetings
                  <br className="hidden sm:block" />
                  into focused 5-minute standups
                </Heading>
                <Text>
                  Prepare your updates beforehand, then share the board during
                  your standup. Everyone comes prepared, making meetings shorter
                  and more focused. Or skip the meeting entirely. It's your
                  choice.
                </Text>
                {/* <Box mt="4" /> */}
                {/* <img
                  src="https://obsidian.md/images/sync-settings.png"
                  className="w-full"
                  style={
                    {
                      // filter: "grayscale(100%) blur(2px)",
                    }
                  }
                /> */}
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
                <Text>
                  No more scrolling through weeks of Slack messages to find that
                  one update you need. All your team's progress lives in clean,
                  organized cards with a clear browsable history.
                </Text>
                {/* <Box mt="4" /> */}
                {/* <img
                  src="https://obsidian.md/images/sync-diff.png"
                  className="w-full"
                  style={
                    {
                      // filter: "grayscale(100%) blur(2px)",
                    }
                  }
                /> */}
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
                <Text>
                  Unlike Jira, Notion templates, or Linear, Standup Kiwi does
                  one thing really well: daily standups. No complex project
                  management features you don't need, no overwhelming setup
                  process, just clean daily updates.
                </Text>
                {/* <Box mt="4" /> */}
                {/* <img
                  src="https://obsidian.md/images/sync-share.png"
                  className="w-full"
                  style={
                    {
                      // filter: "grayscale(100%) blur(2px)",
                    }
                  }
                /> */}
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
                <Text>
                  When your boss asks "what's your team been working on this
                  week?" you'll have a clear, browsable history instead of
                  scrambling to remember. Perfect for performance reviews,
                  progress reports, and onboarding new team members.
                </Text>
                {/* <Box mt="4" /> */}
                {/* <img
                  src="/image.png"
                  className="w-full"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                /> */}
              </Flex>
            </Card>

            {/* <Card size="5">
              <Flex direction="column" gap="3">
                <SquareDashedIcon size="32" strokeWidth={1.5} />
                <Heading as="h3" size="4">
                  Your data, your control - open source and self-hostable
                </Heading>
                <Text >
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      // className="bg-white"
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
          <Text align="center">Simple as 1-2-3</Text>
          <Box mt="4" />
          <Card variant="classic">
            <Inset>
              <video
                ref={videoRef}
                // src="/video.mp4"
                className="w-full aspect-[2/1] object-cover object-top"
                autoPlay
                loop
                muted
                // style={{
                //   filter: "grayscale(100%)",
                // }}
              >
                <source
                  // src="https://a.slack-edge.com/0cedc3b/marketing/img/homepage/true-prospects/hero-revamp/animation/hero@2x.ko-KR.webm"
                  // type="video/webm"
                  // src="/how-it-works.mp4"
                  // src="/how-it-works-v2.mp4"
                  // src="/how-it-works-v3.mp4"
                  // src="/how-it-works-v4.mp4"
                  // src="/how-it-works-v5.mp4"
                  src="/how-it-works-1080p-30fps-web.mp4"
                  // src="/how-it-works-v7.mp4"
                  type="video/mp4"
                />
              </video>
            </Inset>
          </Card>
          <Grid
            // columns="2"
            columns="3"
            gap="4"
          >
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
                <Text>
                  Set up a team or personal board in seconds. Name it whatever
                  makes sense — "Daily Progress," "Team Alpha," or just your
                  name. No complex setup.
                </Text>
                {/* <Box mt="4" /> */}

                {/* <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                /> */}
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
                <Text>
                  Answer the classic questions: What did you do yesterday?
                  What's planned for today? Any blockers? Use our clean markdown
                  editor to format lists, add links, and make your updates
                  scannable.
                </Text>
                {/* <Box mt="4" /> */}
                {/* <img
                  src="/image.png"
                  style={{
                    filter: "grayscale(100%) blur(2px)",
                  }}
                /> */}
              </Flex>
            </Card>

            <Card
              variant="classic"
              size="5"
              // className="col-span-2"
            >
              <Grid
                // columns="2"
                columns="1"
                gap="4"
              >
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
                  <Text>
                    Your updates become organized cards on a clean board. Browse
                    today's updates, review past work, and never lose track of
                    progress again. Everything is right where you need it, when
                    you need it.
                  </Text>
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

function WhoItsPerfectFor() {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      // className="bg-white"
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
                {/* <BoxesIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Small teams, startups, distributed companies
                </Heading>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>
                      Keep everyone informed without interrupting deep work
                    </Text>
                  </li>

                  <li>
                    <Text>Create a browsable history of team progress</Text>
                  </li>

                  <li>
                    <Text>Onboard new members with context from day one</Text>
                  </li>

                  <li>
                    <Text>
                      Make time-zone distributed meetings work with prepared
                      updates
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
                {/* <KeyboardIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Developers, designers, writers, consultants
                </Heading>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>Start each day with clarity and purpose</Text>
                  </li>
                  <li>
                    <Text>Track your progress over time</Text>
                  </li>
                  <li>
                    <Text>Never lose track of what you were working on</Text>
                  </li>
                  <li>
                    <Text>Build a portfolio of your daily achievements</Text>
                  </li>
                </ul>
                <Text align="center"></Text>
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
                  {/* <GitHubLogoIcon width="32" height="32" strokeWidth={1.5} /> */}
                  <Heading as="h3" size="5">
                    Maintainers, contributors, volunteer teams
                  </Heading>
                  <ul className="flex flex-col gap-1">
                    {" "}
                    <li>
                      <Text>
                        Self-host with complete control over your data
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Coordinate across continents without scheduling
                        conflicts
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Document contributions and progress transparently
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Keep contributors engaged with visible momentum
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
      // className="bg-white"
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
            {/* Open Source You Can Trust */}
            Open source you can trust
          </Heading>

          <Grid columns="2" gap="4">
            <Card variant="classic" size="5">
              <Flex direction="column" gap="3">
                {/* <BoxesIcon size="32" strokeWidth={1.5} /> */}
                <Heading as="h3" size="5">
                  Your Data, Your Rules
                </Heading>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>
                      Complete transparency - see exactly how your data is
                      handled
                    </Text>
                  </li>
                  <li>
                    <Text>
                      Self-hosting option - keep everything on your own servers
                    </Text>
                  </li>
                  <li>
                    <Text>No vendor lock-in - export your data anytime</Text>
                  </li>
                  <li>
                    <Text>
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
                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>
                      Open source on GitHub - help us build something great
                      together
                    </Text>
                  </li>
                  <li>
                    <Text>Active development with regular updates</Text>
                  </li>
                  <li>
                    <Text>
                      Community support for issues and feature requests
                    </Text>
                  </li>
                  <li>
                    <Text>Getting started guide with setup instructions</Text>
                  </li>
                </ul>
                <Text align="center"></Text>
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
      // className="bg-white"
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
                <Text>
                  Deploy on your servers. Complete data control, always free
                  forever.
                </Text>
                <Text size="8" weight="bold">
                  Free
                </Text>

                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>Always free forever</Text>
                  </li>
                  <li>
                    <Text>Deploy on your own servers</Text>
                  </li>
                  <li>
                    <Text>Complete control of your data</Text>
                  </li>
                  <li>
                    <Text>Full feature access</Text>
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
                <Text>
                  Fully hosted with zero setup. All features included, automatic
                  updates.
                </Text>
                <Text size="8" weight="bold">
                  Free
                </Text>

                <Text size="2" className="italic">
                  (After early beta period (12+ months), it would be
                  $1/user/month per board.)
                </Text>

                <ul className="flex flex-col gap-1">
                  <li>
                    <Text>Hosted at standupkiwi.com</Text>
                  </li>
                  <li>
                    <Text>Zero setup required</Text>
                  </li>
                  <li>
                    <Text>All features included</Text>
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
      // className="bg-white"
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
                        <Text as="p" size="3">
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
      // className="bg-white"
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
        style={{ position: "relative", zIndex: 1 }}
      >
        <Flex direction="column" gap="4">
          <Heading as="h2" size="8" align="center">
            What's coming next
          </Heading>
          <Text align="center">
            We're just getting started. Here's what we're working on based on
            real user feedback:
          </Text>
          <Box mt="4" />
          <Grid columns="3" gap="4" gapY="4">
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Yesterday context recall
                </Heading>
                <Text>
                  "What did I do yesterday again?" Auto-fill from your previous
                  updates
                </Text>
              </Flex>
            </Card>
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Today suggestion engine
                </Heading>
                <Text>
                  Get smart suggestions for today's update based on your work
                  patterns
                </Text>
              </Flex>
            </Card>
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Daily team digest
                </Heading>
                <Text>
                  See what everyone's working on today (not just for managers!)
                </Text>
              </Flex>
            </Card>
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  AI weekly digest
                </Heading>
                <Text>
                  Auto-generated personal and team summaries with insights and
                  trends
                </Text>
              </Flex>
            </Card>
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-blue-50/30 shadow-sm ring-1 ring/-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  Desktop and mobile apps
                </Heading>
                <Text>
                  Native desktop and mobile apps for a seamless experience.
                </Text>
              </Flex>
            </Card>
            <Card
              size="3"
              variant="classic"
              // className="bg-gradient-to-br from-white to-violet-50/30 shadow-sm ring-1 ring-gray-200/30"
            >
              <Flex direction="column" gap="3">
                <Heading as="h3" size="5">
                  And more...!
                </Heading>
                <Text>
                  Your feedback shapes our priorities. What would help you most?
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
      // pb="calc(80px * var(--scaling) * 2)"
      // className="bg-white"
      style={{
        // backgroundImage:
        //   "radial-gradient(circle 800px at 700px 200px, var(--purple-2), transparent),radial-gradient(circle 600px at calc(100% - 300px) 300px, var(--blue-3), transparent),radial-gradient(circle 800px at right center, var(--sky-3), transparent),radial-gradient(circle 800px at right bottom, var(--sky-1), transparent),radial-gradient(circle 800px at calc(50% - 600px) calc(100% - 100px), var(--pink-3), var(--pink-1), transparent)",
        // backgroundImage:
        //   "radial-gradient(circle 800px at 700px 200px, var(--purple-5), transparent),radial-gradient(circle 600px at calc(100% - 300px) 800px, var(--plum-4), transparent),radial-gradient(circle 800px at right 60%, var(--iris-4), transparent),radial-gradient(circle 800px at right bottom, var(--iris-2), transparent),radial-gradient(circle 800px at calc(50% - 600px) calc(100% - 50px), var(--pink-4), var(--pink-2), transparent)",
        // backgroundImage:
        //   "linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.9)), url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fgood-vibes-preview.png&w=3840&q=75')",
        backgroundImage:
          "linear-gradient(var(--color-background), rgba(255, 255, 255, 0.9) 25%), url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fgood-vibes-preview.png&w=3840&q=75')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        size={{
          initial: "4",
          sm: "4",
        }}
        maxWidth={{
          // sm: "992px",
          sm: "1248px",
        }}
      >
        {/* <Card size="5" className="pb-0!"> */}
        {/* <Inset
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('https://www.raycast.com/_next/image?url=https%3A%2F%2Fmisc-assets.raycast.com%2Fwallpapers%2Fgood-vibes-preview.png&w=3840&q=75')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            side="top"
          > */}
        <Box p="9">
          <Flex direction="column" gap="4" p="9">
            {/* <Box mt="8" /> */}
            <Heading as="h2" size="8" align="center">
              Ready to transform your standups?
            </Heading>
            <Text align="center">Set up your standup board in seconds</Text>
            <Box mt="4" />
            <Flex justify="center">
              <Button
                asChild
                highContrast
                size="4"
                // className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
              </Button>
            </Flex>
            {/* <Box mt="8" /> */}
          </Flex>
        </Box>
        {/* </Inset> */}
        {/* </Card> */}
      </Container>
    </Section>
  );
}

function NewContent() {
  return (
    <Theme
      className="relative"
      accentColor="gray"
      grayColor="mauve"
      hasBackground
    >
      <NavBar />
      <Hero />
      <Problem />
      <MeetStandupKiwi />
      <HowItWorks />
      <WhoItsPerfectFor />
      <OpenSource />
      <Pricing />
      {/* <FAQ /> */}
      <Roadmap />
      <FinalCTA />
    </Theme>
  );
}

export default NewContent;
