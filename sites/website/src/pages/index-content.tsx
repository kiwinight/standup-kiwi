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
  Separator,
  Link,
} from "@radix-ui/themes";
import { useEffect, useRef } from "react";

// Hook for staggered delays - 시차를 둔 (staggered) animations
function useStaggeredDelay(gap: number = 0.25, startDelay: number = 0) {
  const indexRef = useRef(0);

  const getNextDelay = () => {
    const delay = startDelay + indexRef.current * gap;
    indexRef.current++;
    return delay;
  };

  const reset = () => {
    indexRef.current = 0;
  };

  return { getNextDelay, reset };
}

import howItWorksDemo3By4 from "../assets/overview/how-it-works-1080p-60fps-web-3x4.mp4";
import howItWorksDemo16By9 from "../assets/overview/how-it-works-1080p-30fps-web-16x9.mp4";

import { NavBar } from "../components/nav-bar";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { ClockFadingIcon, GithubIcon, LayoutGridIcon } from "lucide-react";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { BlurFade } from "../components/blur-fade";
import { ScrollFade } from "../components/scroll-fade";
import { TextAnimate } from "../components/text-animate";
import { cn } from "../lib/utils";
import { LineShadowText } from "../components/line-shadow-text";

const DELAY = 0.125;

function Hero({
  goodVibesGradientImgSlot,
  standupKiwiResponsiveMockupImgSlot,
}: {
  goodVibesGradientImgSlot: never;
  standupKiwiResponsiveMockupImgSlot: never;
}) {
  return (
    <>
      <Section
        size={{
          initial: "3",
          sm: "4",
        }}
        className="overflow-hidden relative"
      >
        <Box className="absolute inset-0">
          <Box
            className={`
            w-full h-full
            [&>astro-slot]:w-full [&>astro-slot]:h-full [&>astro-slot>img]:w-full [&>astro-slot>img]:h-full [&>astro-slot>img]:object-cover [&>astro-slot>img]:object-center
            `}
          >
            {goodVibesGradientImgSlot}
          </Box>
          <Box
            className={`
            absolute inset-0
            bg-[linear-gradient(to_bottom,var(--color-background)_20%,rgba(255,255,255,0.75))]
            sm:bg-[linear-gradient(to_bottom,var(--color-background)_25%,rgba(255,255,255,0.8))]
            `}
          />
        </Box>

        <div className="relative">
          <Container
            size={{
              initial: "4",
              sm: "3",
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
              <BlurFade delay={DELAY * 0} direction="down">
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
                    align={{
                      initial: "center",
                      sm: "center",
                    }}
                  >
                    The standup tool that
                    <br className="hidden sm:block" />
                    <Text className="italic" weight="bold">
                      {" "}
                      actually works
                    </Text>
                  </Heading>

                  <Flex gap="2" wrap="wrap" justify="center">
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
                    as="div"
                    size={{
                      initial: "3",
                    }}
                    align={{
                      initial: "center",
                      sm: "center",
                    }}
                  >
                    Skip the endless meetings and scattered chat threads.
                    <br className="hidden sm:block" /> Standup Kiwi gives you a
                    simple, organized board to share and record daily updates
                    <br className="hidden sm:block" />— whether you work solo or
                    with a team.
                  </Text>

                  <Button
                    asChild
                    size={{
                      initial: "3",
                      sm: "4",
                    }}
                    highContrast
                  >
                    <a href={import.meta.env.PUBLIC_APP_URL}>
                      Get started free
                    </a>
                  </Button>
                </Flex>
              </BlurFade>

              <Box mt="4" />

              <BlurFade direction="down" className="w-full" delay={DELAY * 1}>
                <Box
                  width="100%"
                  style={{
                    direction: "rtl",
                  }}
                  className={`
                  [&>astro-slot>img]:w-auto [&>astro-slot>img]:max-h-[520px] [&>astro-slot>img]:max-w-none
                  sm:[&>astro-slot>img]:w-full sm:[&>astro-slot>img]:max-h-[906px] sm:[&>astro-slot>img]:max-w-full sm:[&>astro-slot>img]:h-auto
                  `}
                >
                  {standupKiwiResponsiveMockupImgSlot}
                </Box>
              </BlurFade>
            </Flex>
          </Container>
        </div>
      </Section>
    </>
  );
}

function Problem() {
  const problems = [
    {
      title: "Endless meetings...",
      description:
        "Daily standup meetings that drag on for 30 minutes when everyone just needs to share quick updates.",
    },
    {
      title: "Lost in Slack...",
      description:
        "Scattered updates buried in threads that you can never find later when you need them.",
    },
    {
      title: "Tool overload...",
      description:
        "Over-engineered tools like Jira, Notion templates, or Linear that feel like overkill for simple daily check-ins.",
    },
    {
      title: "No record keeping...",
      description:
        "When your boss asks 'what's your team been working on?' you scramble to remember what happened last week.",
    },
  ];

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
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
            initial: "7",
            sm: "8",
          }}
          align={{
            initial: "center",
            sm: "center",
          }}
        >
          <BlurFade direction="down" inView>
            <Heading
              as="h2"
              size={{
                initial: "7",
                sm: "8",
              }}
            >
              Are you tired of...?
            </Heading>
          </BlurFade>

          <Grid
            columns={{
              initial: "1",
              sm: "4",
            }}
            gap="4"
          >
            {problems.map((problem, index) => {
              const isLast = index === problems.length - 1;

              return (
                <BlurFade
                  key={problem.title}
                  inView
                  direction="down"
                  className={isLast ? "hidden! sm:block!" : ""}
                >
                  <Card
                    size={{
                      initial: "2",
                      sm: "3",
                    }}
                    className="h-full"
                    variant="surface"
                  >
                    <Heading
                      as="h3"
                      size={{
                        initial: "4",
                        sm: "5",
                      }}
                      mb="2"
                      className="italic!"
                    >
                      {problem.title}
                    </Heading>
                    <Text>{problem.description}</Text>
                  </Card>
                </BlurFade>
              );
            })}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function MeetStandupKiwi({
  autumnalPeachGradientImgSlot,
  standupKiwiBoardDemoImgSlot,
}: {
  autumnalPeachGradientImgSlot: never;
  standupKiwiBoardDemoImgSlot: never;
}) {
  const benefits = [
    {
      title: (
        <>
          Turn 30-minute meetings
          <br className="hidden sm:block" /> into focused 5-minute standups
        </>
      ),
      description:
        "Prepare your updates beforehand, then share the board during your standup. Everyone comes prepared, making meetings shorter and more focused. Or skip the meeting entirely. It's your choice.",
    },
    {
      title: (
        <>
          Everything organized in one place
          <br className="hidden sm:block" />
        </>
      ),
      description:
        "No more scrolling through weeks of Slack messages to find that one update you need. All your team's progress lives in clean, organized cards with a clear browsable history.",
    },
    {
      title: (
        <>
          Simple and focused - built just for standups
          <br className="hidden sm:block" />
        </>
      ),
      description:
        "Unlike Jira, Notion templates, or Linear, Standup Kiwi does one thing really well: daily standups. No complex project management features you don't need, no overwhelming setup process, just clean daily updates.",
    },
    {
      title: (
        <>
          Never lose track of what your team accomplished
          <br className="hidden sm:block" />
        </>
      ),
      description:
        "When your boss asks 'what's your team been working on?' you'll have a clear, browsable history instead of scrambling to remember. Perfect for performance reviews, progress reports, and onboarding new team members.",
    },
  ];

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
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
            initial: "7",
            sm: "8",
          }}
          align={{
            initial: "center",
            sm: "center",
          }}
        >
          <BlurFade direction="down" inView>
            <Flex
              direction="column"
              gap={{
                initial: "4",
                sm: "5",
              }}
              align="center"
            >
              <Heading
                as="h2"
                size={{
                  initial: "7",
                  sm: "8",
                }}
                align="center"
              >
                Meet Standup Kiwi —
                <br />
                Turn dragging meetings into quick sync
              </Heading>
              <Text align="center" as="div">
                Get your time back, keep your team aligned, and always know
                what's happening.
                <br />
                No more scrambling for answers when your boss asks for updates.
              </Text>
            </Flex>
          </BlurFade>
          {/* <Box mt="4" /> */}

          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <BlurFade direction="down" inView className="sm:col-span-2">
              <Card
                className="pb-0! overflow-hidden relative"
                size={{
                  initial: "2",
                  sm: "5",
                }}
              >
                <Box className="absolute inset-0">
                  <Box className="w-full h-full [&>astro-slot]:w-full [&>astro-slot]:h-full [&>astro-slot>img]:w-full [&>astro-slot>img]:h-full [&>astro-slot>img]:object-cover [&>astro-slot>img]:object-center">
                    {autumnalPeachGradientImgSlot}
                  </Box>
                  <Box className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.85))]" />
                </Box>

                <div className="relative">
                  <Inset side="top">
                    <Box
                      pl={{
                        initial: "40%",
                        sm: "9",
                      }}
                      pt={{
                        initial: "52%",
                        sm: "9",
                      }}
                      pr={{
                        sm: "9",
                      }}
                      pb="0"
                    >
                      <Box className="[&>astro-slot>img]:aspect-[3/4] [&>astro-slot>img]:scale-200 [&>astro-slot>img]:object-cover [&>astro-slot>img]:object-left sm:[&>astro-slot>img]:aspect-[2/1] sm:[&>astro-slot>img]:scale-100 sm:[&>astro-slot>img]:object-top">
                        {standupKiwiBoardDemoImgSlot}
                      </Box>
                    </Box>
                  </Inset>
                </div>
              </Card>
            </BlurFade>
            {benefits.map((benefit, index) => {
              const isLast = index === benefits.length - 1;

              return (
                <BlurFade direction="down" inView>
                  <Card
                    key={benefit.description}
                    variant="surface"
                    size={{ initial: "2", sm: "5" }}
                    // className={isLast ? "hidden! sm:block!" : ""}
                    className={cn("h-full", isLast ? "hidden! sm:block!" : "")}
                  >
                    <Flex direction="column" gap="3">
                      <Heading
                        as="h3"
                        size={{
                          initial: "4",
                          sm: "5",
                        }}
                      >
                        {benefit.title}
                      </Heading>
                      <Text>{benefit.description}</Text>
                    </Flex>
                  </Card>
                </BlurFade>
              );
            })}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function HowItWorks() {
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Apply playback rate to both videos
    if (mobileVideoRef.current) {
      mobileVideoRef.current.playbackRate = 0.75;
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.playbackRate = 0.75;
    }
  }, []);

  // Mobile video viewport observer
  useEffect(() => {
    const video = mobileVideoRef.current;
    if (!video) return;

    const isVideoVisible = () => window.innerWidth <= 767;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log("Mobile video autoplay prevented:", error);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    // Setup observer and media query listener
    if (isVideoVisible()) {
      observer.observe(video);
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaChange = () => {
      if (isVideoVisible()) {
        observer.observe(video);
      } else {
        observer.unobserve(video);
        video.pause();
      }
    };

    mediaQuery.addListener(handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeListener(handleMediaChange);
    };
  }, []);

  // Desktop video viewport observer
  useEffect(() => {
    const video = desktopVideoRef.current;
    if (!video) return;

    const isVideoVisible = () => window.innerWidth > 767;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log("Desktop video autoplay prevented:", error);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    // Setup observer and media query listener
    if (isVideoVisible()) {
      observer.observe(video);
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = () => {
      if (isVideoVisible()) {
        observer.observe(video);
      } else {
        observer.unobserve(video);
        video.pause();
      }
    };

    mediaQuery.addListener(handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeListener(handleMediaChange);
    };
  }, []);

  const steps = [
    {
      title: "Create your board",
      description:
        "Set up a team or personal board in seconds. Name it whatever makes sense — 'Daily Progress,' 'Team Alpha,' or just your name. No complex setup.",
    },
    {
      title: "Write your update",
      description:
        "Answer the classic questions: What did you do yesterday? What's planned for today? Any blockers? Use our clean markdown editor to format lists, add links, and make your updates scannable.",
    },
    {
      title: "Stay organized",
      description:
        "Your updates become organized cards on a clean board. Browse today's updates, review past work, and never lose track of progress again. Everything is right where you need it, when you need it.",
    },
  ];

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
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
            initial: "7",
            sm: "8",
          }}
        >
          <BlurFade direction="down" inView>
            <Flex
              direction="column"
              gap={{
                initial: "4",
                sm: "5",
              }}
            >
              <Heading
                as="h2"
                size={{
                  initial: "7",
                  sm: "8",
                }}
                align="center"
              >
                How it works
              </Heading>

              <Text align="center" as="div">
                Simple as 1-2-3
              </Text>
            </Flex>
          </BlurFade>

          <Grid
            columns={{
              initial: "1",
              sm: "3",
            }}
            gap="4"
          >
            <BlurFade
              // delay={0.15}
              direction="down"
              inView
              className="sm:col-span-3"
            >
              <Card variant="surface">
                <Inset>
                  {/* Mobile video */}
                  <video
                    ref={mobileVideoRef}
                    className="w-full aspect-[3/4] object-cover object-top sm:hidden"
                    src={howItWorksDemo3By4}
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                  {/* Desktop video */}
                  <video
                    ref={desktopVideoRef}
                    className="w-full aspect-[2/1] object-cover object-top hidden sm:block"
                    src={howItWorksDemo16By9}
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </Inset>
              </Card>
            </BlurFade>
            {steps.map((step, index) => {
              return (
                <BlurFade
                  // delay={0.3 + index * 0.15}
                  direction="down"
                  inView
                  key={step.title}
                >
                  <Card
                    variant="surface"
                    size={{
                      initial: "2",
                      sm: "5",
                    }}
                    className="h-full"
                  >
                    <Flex
                      direction={{
                        initial: "row",
                        sm: "column",
                      }}
                      gap="3"
                    >
                      <Avatar
                        fallback={index + 1}
                        variant="soft"
                        size={{
                          initial: "1",
                          sm: "2",
                        }}
                        radius="large"
                      />
                      <Flex direction="column" gap="3">
                        <Heading
                          as="h3"
                          size={{
                            initial: "4",
                            sm: "5",
                          }}
                        >
                          {step.title}
                        </Heading>
                        <Text>{step.description}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </BlurFade>
              );
            })}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function WhoItsPerfectFor() {
  const targets = [
    {
      title: "Small teams, startups, distributed companies",
      description: (
        <>
          <ul className="flex flex-col gap-1">
            <li>
              <Text>Keep everyone informed without interrupting deep work</Text>
            </li>

            <li>
              <Text>Create a browsable history of team progress</Text>
            </li>

            <li>
              <Text>Onboard new members with context from day one</Text>
            </li>

            <li>
              <Text>
                Make time-zone distributed meetings work with prepared updates
              </Text>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Developers, designers, writers, consultants",
      description: (
        <>
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
        </>
      ),
    },
    {
      title: "Maintainers, contributors, volunteer teams",
      description: (
        <>
          <ul className="flex flex-col gap-1">
            {" "}
            <li>
              <Text>Self-host with complete control over your data</Text>
            </li>
            <li>
              <Text>
                Coordinate across continents without scheduling conflicts
              </Text>
            </li>
            <li>
              <Text>Document contributions and progress transparently</Text>
            </li>
            <li>
              <Text>Keep contributors engaged with visible momentum</Text>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
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
            initial: "7",
            sm: "8",
          }}
        >
          <BlurFade direction="down" inView>
            <Heading
              as="h2"
              size={{
                initial: "7",
                sm: "8",
              }}
              align="center"
            >
              Who it's perfect for
            </Heading>
          </BlurFade>
          <Grid
            columns={{
              initial: "1",
              sm: "3",
            }}
            gap="4"
          >
            {targets.map((target, index) => {
              const isLast = index === targets.length - 1;
              return (
                <BlurFade
                  key={target.title}
                  // delay={0.3 + index * 0.15}
                  direction="down"
                  inView
                >
                  <Card
                    variant="surface"
                    size={{ initial: "2", sm: "5" }}
                    className={cn("h-full", isLast ? "hidden! sm:block!" : "")}
                  >
                    <Flex direction="column" gap="3">
                      <Heading
                        as="h3"
                        size={{
                          initial: "4",
                          sm: "5",
                        }}
                      >
                        {target.title}
                      </Heading>
                      <Box>{target.description}</Box>
                    </Flex>
                  </Card>
                </BlurFade>
              );
            })}
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
        <Flex
          direction="column"
          gap={{
            initial: "7",
            sm: "8",
          }}
        >
          <BlurFade direction="down" inView>
            <Heading
              as="h2"
              size={{
                initial: "7",
                sm: "8",
              }}
              align="center"
            >
              Open source you can trust
            </Heading>
          </BlurFade>

          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <BlurFade
              // delay={0}
              direction="down"
              inView
            >
              <Card
                variant="surface"
                size={{ initial: "2", sm: "5" }}
                className="h-full"
              >
                <Flex direction="column" gap="3">
                  <Heading
                    as="h3"
                    size={{
                      initial: "4",
                      sm: "5",
                    }}
                  >
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
                        Self-hosting option - keep everything on your own
                        servers
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
            </BlurFade>
            <BlurFade
              // delay={0.15}
              direction="down"
              inView
            >
              <Card
                variant="surface"
                size={{ initial: "2", sm: "5" }}
                className="h-full"
              >
                <Flex direction="column" gap="3">
                  <Heading
                    as="h3"
                    size={{
                      initial: "4",
                      sm: "5",
                    }}
                  >
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
            </BlurFade>
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
        <Flex
          direction="column"
          gap={{
            initial: "7",
            sm: "8",
          }}
        >
          <BlurFade direction="down" inView>
            <Heading
              as="h2"
              size={{
                initial: "7",
                sm: "8",
              }}
              align="center"
            >
              Pricing
            </Heading>
          </BlurFade>
          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <BlurFade direction="down" inView>
              <Card
                variant="surface"
                size={{ initial: "2", sm: "5" }}
                className="h-full"
              >
                <Flex direction="column" gap="3" height="100%">
                  <Heading
                    as="h3"
                    size={{
                      initial: "4",
                      sm: "5",
                    }}
                  >
                    Self-hosting
                  </Heading>
                  <Text>
                    Deploy on your servers. Complete data control, always free
                    forever.
                  </Text>
                  <Text
                    size={{
                      initial: "6",
                      sm: "8",
                    }}
                    weight="bold"
                  >
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
                    }}
                    highContrast
                    variant="outline"
                    mt="auto"
                  >
                    {/* TODO: Make this link an env variable */}
                    <a
                      href="https://github.com/kiwinight/standup-kiwi"
                      target="_blank"
                    >
                      View documentation
                      <ExternalLinkIcon width={18} height={18} />
                    </a>
                  </Button>
                </Flex>
              </Card>
            </BlurFade>

            <BlurFade direction="down" inView>
              <Card variant="surface" size={{ initial: "2", sm: "5" }}>
                <Flex direction="column" gap="3" height="100%">
                  <Heading
                    as="h3"
                    size={{
                      initial: "4",
                      sm: "5",
                    }}
                  >
                    Managed service
                  </Heading>
                  <Text>
                    Fully hosted with zero setup. All features included,
                    automatic updates.
                  </Text>

                  <Flex direction="column" gap="" align="baseline">
                    <Text
                      size={{
                        initial: "6",
                        sm: "8",
                      }}
                      color="gray"
                      weight="bold"
                      className="line-through"
                    >
                      $2
                    </Text>
                    <Text color="gray" size="2" className="italic line-through">
                      per user on each board, when paying monthly
                    </Text>
                  </Flex>

                  <Flex direction="column" gap="">
                    <Text
                      size={{
                        initial: "6",
                        sm: "8",
                      }}
                      weight="bold"
                    >
                      Free
                    </Text>

                    <Text size="2" className="italic">
                      Limited-time launch offer for early adopters
                    </Text>
                  </Flex>

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
                    }}
                    highContrast
                    mt="auto"
                  >
                    <a href={import.meta.env.PUBLIC_APP_URL}>
                      Get started free
                    </a>
                  </Button>
                </Flex>
              </Card>
            </BlurFade>
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
          <Card variant="surface" size="3" className="py-3!">
            <AccordionPrimitive.Root type="multiple">
              {FAQ_ITEMS.map((item, index) => {
                return (
                  <AccordionPrimitive.Item
                    key={item.question}
                    value={`item-${index + 1}`}
                    asChild
                  >
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
        </Flex>
      </Container>
    </Section>
  );
}

function Roadmap() {
  const itmes = [
    {
      title: "Yesterday context recall",
      description:
        "What did I do yesterday again? Auto-fill from your previous updates",
    },
    {
      title: "Today suggestion engine",
      description:
        "Get smart suggestions for today's update based on your work patterns",
    },
    {
      title: "Daily team digest",
      description:
        "See what everyone's working on today (not just for managers!)",
    },
    {
      title: "AI weekly digest",
      description:
        "Auto-generated personal and team summaries with insights and trends",
    },
    {
      title: "Desktop and mobile apps",
      description: "Native desktop and mobile apps for a seamless experience.",
    },
    {
      title: "And more...!",
      description:
        "Your feedback shapes our priorities. What would help you most?",
    },
  ];

  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
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
        style={{ position: "relative", zIndex: 1 }}
      >
        <Flex
          direction="column"
          gap={{
            initial: "7",
            sm: "8",
          }}
        >
          <BlurFade direction="down" inView>
            <Flex
              direction="column"
              gap={{
                initial: "4",
                sm: "5",
              }}
            >
              <Heading
                as="h2"
                size={{
                  initial: "7",
                  sm: "8",
                }}
                align="center"
              >
                What's coming next
              </Heading>
              <Text align="center" as="div">
                We're just getting started. Here's what we're working on based
                on real user feedback:
              </Text>
            </Flex>
          </BlurFade>

          <Grid
            columns={{
              initial: "1",
              sm: "3",
            }}
            gap="4"
            gapY="4"
          >
            {itmes.map((item, index) => {
              const isHiddenOnMobile = index < 2;

              return (
                <BlurFade
                  direction="down"
                  inView
                  key={item.title}
                  className={isHiddenOnMobile ? "hidden! sm:block!" : ""}
                >
                  <Card
                    size={{
                      initial: "2",
                      sm: "3",
                    }}
                    variant="surface"
                    className={cn("h-full")}
                  >
                    <Flex direction="column" gap="3">
                      <Heading
                        as="h3"
                        size={{
                          initial: "4",
                          sm: "5",
                        }}
                      >
                        {item.title}
                      </Heading>
                      <Text>{item.description}</Text>
                    </Flex>
                  </Card>
                </BlurFade>
              );
            })}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

function FinalCTA({
  goodVibesGradientImgSlot,
}: {
  goodVibesGradientImgSlot: never;
}) {
  return (
    <Section
      size={{
        initial: "3",
        sm: "4",
      }}
      className="overflow-hidden relative"
    >
      <Box className="absolute inset-0">
        <Box className="w-full h-full [&>astro-slot]:w-full [&>astro-slot]:h-full [&>astro-slot>img]:w-full [&>astro-slot>img]:h-full [&>astro-slot>img]:object-cover [&>astro-slot>img]:object-center">
          {goodVibesGradientImgSlot}
        </Box>
        <Box className="absolute inset-0 bg-[linear-gradient(var(--color-background),rgba(255,255,255,0.85)_0%)]" />
      </Box>

      <div className="relative">
        <Container
          size={{
            initial: "4",
            sm: "4",
          }}
          maxWidth={{
            sm: "1248px",
          }}
        >
          <Box
            p={{
              initial: "6",
              sm: "9",
            }}
            px={{
              initial: "0",
              sm: "9",
            }}
          >
            <BlurFade direction="down" inView>
              <Flex
                direction="column"
                gap={{
                  initial: "7",
                  sm: "8",
                }}
              >
                <Flex
                  direction="column"
                  gap={{
                    initial: "4",
                    sm: "5",
                  }}
                >
                  <Heading
                    as="h2"
                    size={{
                      initial: "7",
                      sm: "8",
                    }}
                    align="center"
                  >
                    Ready to transform your standups?
                  </Heading>
                  <Text align="center" as="div">
                    Set up your standup board in seconds
                  </Text>
                </Flex>

                <Flex justify="center">
                  <Button asChild highContrast size="4">
                    <a href={import.meta.env.PUBLIC_APP_URL}>
                      Get started free
                    </a>
                  </Button>
                </Flex>
              </Flex>
            </BlurFade>
          </Box>
        </Container>
      </div>
    </Section>
  );
}

function IndexContent(props: any) {
  const {
    goodVibesGradientImg,
    autumnalPeachGradientImg,
    standupKiwiResponsiveMockupImg,
    standupKiwiBoardDemoImg,
  } = props as Record<string, never>;

  return (
    <Theme
      className="relative"
      accentColor="gray"
      grayColor="mauve"
      hasBackground
    >
      <NavBar />
      <Hero
        goodVibesGradientImgSlot={goodVibesGradientImg}
        standupKiwiResponsiveMockupImgSlot={standupKiwiResponsiveMockupImg}
      />
      <Problem />
      <MeetStandupKiwi
        autumnalPeachGradientImgSlot={autumnalPeachGradientImg}
        standupKiwiBoardDemoImgSlot={standupKiwiBoardDemoImg}
      />
      <HowItWorks />
      <WhoItsPerfectFor />
      <OpenSource />
      <Pricing />
      {/* TODO: Restore FAQ when the contents are ready */}
      {/* <FAQ /> */}
      <FinalCTA goodVibesGradientImgSlot={goodVibesGradientImg} />
      <Roadmap />
      {/* TODO: add footer */}
      <Footer />
    </Theme>
  );
}

export default IndexContent;

function Footer() {
  return (
    <footer>
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
        <Separator my="2" size="1" />
      </Container>
      <Section
        size={{
          initial: "3",
          sm: "4",
        }}
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
              initial: "7",
              sm: "8",
            }}
          >
            <Flex direction="column" gap="6">
              <Flex>
                <a href="/">
                  <Flex align="center" gap="1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={28}
                      height={28}
                      viewBox="0 0 90 90"
                      fill="none"
                    >
                      <path
                        fill="var(--gray-12)"
                        d="M83.7 9.7s-16 5.4-21.5 7L79.7.9s.1-1-1-.6-18.8 14.3-18.8 14.3-9.2-1.4-12.5 2c0 0-.2.3-.2.5s.7.2.7.2-2.7 1.2-3.8 3.9c-.7 1.5-1 2.1-1 2.1s-.4.4-.1.6c.3.1.7-.2.7-.2s-.7 1.2-2 2.3c0 0-.5.2-.4.5.1.2.4 0 .4 0S38.5 36 25.6 38.1c-11.5 2-17.2 12.5-18.2 14.3-.1.2-.2.4-.4.6-.3.5-.8 1.3-.3 1.1L7 54s-4.8 11.3 3.7 17.8c0 0 .7.7.8 1.1 0 0 .4-.1.5-.5 0 0 1.2 1.5 1.4 2.2 0 0 .2.5.5.3.3-.1.7-.9.7-.9s.5.7.3 1.1c-.2.5 1.8.3 1.8.3s.7 1 1.7.9c0 0 .4.5-.1 1 0 0 1.3.5 3.2-.4 0 0 .7-.1 1.2-.1l.9.1c-.2.9.3 2.5.5 3.1 1.1 2.1 4.1 7.4 4.1 7.4s.3.7-.2 1c-.7.6-1.3.3-1.3.3s-1.2-.4-1.7.1c-.5.6-.3 1-.3 1H45s0-1.9-1.9-1.9c-1.4 0-1.9.7-4.5.6-3-.1-7.4-.8-9.8-7.4C27.3 78.4 30 77 30 77s.5-.7 1.2-.3c0 0 .2.6.7.6.9.1 2.9-1.5 2.9-1.5s1-.2 1.4-.6c0 0-.1.5.3.7.7.4 2-.4 2-.4s5.2-3.4 7.2-6.9c0 0 .5 0 .8-.6.3-.6 1.8-3.4 4.3-10.1 0 0 .2.7.4.5.2-.2.3-1 .3-1s.7-4.4 1-6c.4-2 3-18.2 10.1-29.3 0 0 1.6-2.8 5.7-4.8 0 0 12.5-5.9 15.1-6.4 0 0 1-.4.9-1.1-.1-.1-.1-.3-.6-.1ZM57 20c-.6.6-1.2.7-1.6.5-.4-.4-.2-1.1.3-1.7.5-.6 1.2-.7 1.6-.5.5.4.3 1.2-.3 1.7Z"
                      ></path>
                      <path
                        fill="var(--gray-12)"
                        d="M41.1 75.2s1.4 1.9 1.6 2.3c.1.4 1.2 1.3 2.1.9C45.7 78 47 77 48 76c.8-.8 7.2-5.6 7.1-5.6 0 0 1.2-.9 3.4-.7 0 0 2 .3 3.3.7 1.3.5 1.6-.3 1.6-.3s.3-.7-.9-1.2c-1.2-.6-3.6-1.1-5.9-1.2 0 0 3.7-.8 7.7.1 1.7.5 2.3.2 2.3-.5s-.7-1-2.5-1.2c-1.6-.2-6.2-.5-8.5.2-.7.2-1.6.7-2.1 1.2-.6.5-1.3 1.1-2.1 2-2 2.1-3.4 3.1-4.6 3.5-1.1.5-1.7 0-1.7 0l-.7-.7-3.3 2.9Z"
                      ></path>
                    </svg>
                    <Text
                      size="3"
                      weight="bold"
                      className="!tracking-tight"
                      color="gray"
                      highContrast
                    >
                      Standup Kiwi
                    </Text>
                  </Flex>
                </a>
              </Flex>

              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  A project by{" "}
                  <Link href="https://github.com/kiwinight" target="_blank">
                    kiwinight
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://x.com/hyokualexkwon"
                    target="_blank"
                    highContrast
                  >
                    H.Alex Kwon
                  </Link>
                </Text>
                <ul className="flex flex-row gap-4 list-none p-0 m-0">
                  <li>
                    <Text size="2" color="gray">
                      <a
                        className="inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://x.com/standupkiwi"
                      >
                        X
                        <ExternalLinkIcon />
                      </a>
                    </Text>
                  </li>
                  <li>
                    <Text size="2" color="gray">
                      <a
                        className="inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.threads.com/@standupkiwi"
                      >
                        Threads
                        <ExternalLinkIcon />
                      </a>
                    </Text>
                  </li>
                  <li>
                    <Text size="2" color="gray">
                      <a
                        className="inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/kiwinight/standup-kiwi"
                      >
                        GitHub
                        <ExternalLinkIcon />
                      </a>
                    </Text>
                  </li>
                </ul>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Section>
    </footer>
  );
}
