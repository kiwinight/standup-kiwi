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

import howItWorksDemo3By4 from "../assets/overview/how-it-works-1080p-60fps-web-3x4.mp4";
import howItWorksDemo16By9 from "../assets/overview/how-it-works-1080p-30fps-web-16x9.mp4";

import { NavBar } from "../components/nav-bar";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { ClockFadingIcon, GithubIcon, LayoutGridIcon } from "lucide-react";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Accordion as AccordionPrimitive } from "radix-ui";

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
          <Box className="w-full h-full [&>astro-slot]:w-full [&>astro-slot]:h-full [&>astro-slot>img]:w-full [&>astro-slot>img]:h-full [&>astro-slot>img]:object-cover [&>astro-slot>img]:object-center">
            {goodVibesGradientImgSlot}
          </Box>
          <Box className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] to-[rgba(255,255,255,0.75)]" />
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
                <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
              </Button>

              <Box mt="4" />

              <Box className="[&>astro-slot>img]:max-h-[520px] [&>astro-slot>img]:max-w-none sm:[&>astro-slot>img]:w-full sm:[&>astro-slot>img]:max-h-[906px] sm:[&>astro-slot>img]:max-w-full sm:[&>astro-slot>img]:h-auto">
                {standupKiwiResponsiveMockupImgSlot}
              </Box>
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
            initial: "4",
            sm: "5",
          }}
          align={{
            initial: "center",
            sm: "center",
          }}
        >
          <Heading
            as="h2"
            size={{
              initial: "7",
              sm: "8",
            }}
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
            {problems.map((problem, index) => {
              const isLast = index === problems.length - 1;

              return (
                <Card
                  key={problem.title}
                  size={{
                    initial: "2",
                    sm: "3",
                  }}
                  variant="classic"
                  className={isLast ? "hidden! sm:block!" : ""}
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
          <Text align="center">
            Get your time back, keep your team aligned, and always know what's
            happening.
            <br />
            No more scrambling for answers when your boss asks for updates.
          </Text>

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
        }}
        px={{
          initial: "4",
        }}
      >
        <Grid
          columns={{
            initial: "1",
            sm: "2",
          }}
          gap="4"
        >
          <Card
            className="sm:col-span-2 pb-0! overflow-hidden relative"
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
          {benefits.map((benefit, index) => {
            const isLast = index === benefits.length - 1;

            return (
              <Card
                key={benefit.description}
                variant="classic"
                size={{ initial: "2", sm: "5" }}
                className={isLast ? "hidden! sm:block!" : ""}
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
            );
          })}
        </Grid>
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
        <Flex direction="column" gap="4">
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
          <Text align="center">Simple as 1-2-3</Text>
          <Box mt="4" />
          <Card variant="classic">
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
          <Grid
            columns={{
              initial: "1",
              sm: "3",
            }}
            gap="4"
          >
            {steps.map((step, index) => {
              return (
                <Card
                  key={step.title}
                  variant="classic"
                  size={{
                    initial: "2",
                    sm: "5",
                  }}
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
        <Flex direction="column" gap="8">
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
                <Card
                  key={target.title}
                  variant="classic"
                  size={{ initial: "2", sm: "5" }}
                  className={isLast ? "hidden! sm:block!" : ""}
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
        <Flex direction="column" gap="8">
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

          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <Card variant="classic" size={{ initial: "2", sm: "5" }}>
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
            <Card variant="classic" size={{ initial: "2", sm: "5" }}>
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
        <Flex direction="column" gap="8">
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
          <Grid
            columns={{
              initial: "1",
              sm: "2",
            }}
            gap="4"
          >
            <Card variant="classic" size={{ initial: "2", sm: "5" }}>
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

            <Card variant="classic" size={{ initial: "2", sm: "5" }}>
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
                  Fully hosted with zero setup. All features included, automatic
                  updates.
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
          <Card variant="classic" size="3" className="py-3!">
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
        <Flex direction="column" gap="4">
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
          <Text align="center">
            We're just getting started. Here's what we're working on based on
            real user feedback:
          </Text>
          <Box mt="4" />
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
                <Card
                  key={item.title}
                  size={{
                    initial: "2",
                    sm: "3",
                  }}
                  variant="classic"
                  className={isHiddenOnMobile ? "hidden! sm:block!" : ""}
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
            <Flex direction="column" gap="4">
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
              <Text align="center">Set up your standup board in seconds</Text>
              <Box mt="4" />
              <Flex justify="center">
                <Button asChild highContrast size="4">
                  <a href={import.meta.env.PUBLIC_APP_URL}>Get started free</a>
                </Button>
              </Flex>
            </Flex>
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
    </Theme>
  );
}

export default IndexContent;
