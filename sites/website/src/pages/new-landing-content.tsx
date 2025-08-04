import { Theme } from "@radix-ui/themes";
import { NavBar } from "../components/nav-bar";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Section,
  Text,
  Badge,
  Grid,
  Separator,
  Callout,
  Table,
  Avatar,
  Quote,
  Strong,
  Em,
  Link,
} from "@radix-ui/themes";
import {
  PlayIcon,
  CheckIcon,
  CrossCircledIcon,
  RocketIcon,
  PersonIcon,
  GearIcon,
  LockClosedIcon,
  QuestionMarkCircledIcon,
  GitHubLogoIcon,
  StarIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

// Hero Section Component
function HeroSection() {
  return (
    <Section
      size="4"
      className="bg-gradient-to-b from-white via-[var(--gray-1)] to-white"
    >
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Badge color="green" variant="soft" size="2">
            <Flex align="center" gap="1">
              <StarIcon />
              Open source • Currently in beta • Join the community
            </Flex>
          </Badge>

          <Heading as="h1" size="9" align="center" className="max-w-4xl">
            The standup tool that actually works
          </Heading>

          <Text size="5" color="gray" align="center" className="max-w-2xl">
            Skip the endless meetings and scattered chat threads. Standup Kiwi
            gives you a simple, organized way to share daily updates — whether
            you work solo or with a team.
          </Text>

          <Button size="4" className="w-auto px-8">
            Get Started Free
          </Button>

          {/* Demo Video Placeholder */}
          <Card
            size="4"
            className="w-full max-w-4xl bg-[var(--gray-2)] border-2 border-dashed border-[var(--gray-6)]"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              className="h-64 sm:h-80"
            >
              <PlayIcon className="w-16 h-16 text-[var(--gray-9)]" />
              <Text size="3" color="gray" className="mt-4">
                Auto-playing Demo Video
              </Text>
              <Text size="2" color="gray" className="mt-1 text-center">
                Embedded video showing: board view, writing an update, browsing
                history
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}

// Problem Section Component
function ProblemSection() {
  const problems = [
    "Daily standup meetings that drag on for 30 minutes when everyone just needs to share quick updates?",
    "Scattered updates buried in Slack threads that you can never find later?",
    "Over-engineered tools like Jira, Notion templates, or Linear that feel like overkill for simple daily check-ins?",
    'No record so when your boss asks "what\'s your team been working on?" you scramble to remember?',
  ];

  return (
    <Section size="4">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            The Problem We All Face
          </Heading>

          <Heading as="h3" size="6" align="center" color="red">
            Are you tired of...?
          </Heading>

          <Grid
            columns={{ initial: "1", sm: "2" }}
            gap="4"
            className="w-full max-w-4xl"
          >
            {problems.map((problem, index) => (
              <Card key={index} size="3">
                <Flex align="start" gap="3">
                  <CrossCircledIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <Text size="3">{problem}</Text>
                </Flex>
              </Card>
            ))}
          </Grid>

          <Text
            size="4"
            align="center"
            className="max-w-2xl"
            style={{ fontStyle: "italic" }}
          >
            You're not alone. Thousands of developers, designers, and remote
            workers waste hours every week on broken standup processes.
          </Text>
        </Flex>
      </Container>
    </Section>
  );
}

// Solution Section Component
function SolutionSection() {
  const benefits = [
    {
      icon: "👀",
      title: "Scan everyone's updates in 2 minutes",
      desc: "instead of sitting through 30-minute meetings",
    },
    {
      icon: "📋",
      title: "Everything in one place",
      desc: "no more digging through Slack threads",
    },
    {
      icon: "🎯",
      title: "Simple and focused",
      desc: "built just for standups, not project management",
    },
    {
      icon: "📋",
      title: "Team progress at your fingertips",
      desc: 'never scramble when asked "what\'s your team working on?"',
    },
    {
      icon: "📊",
      title: "Clean visual layout",
      desc: "see the whole team's progress at a glance",
    },
    {
      icon: "🔓",
      title: "Your data, your control",
      desc: "open source and self-hostable",
    },
  ];

  return (
    <Section size="4" className="bg-[var(--gray-1)]">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            Meet Standup Kiwi
          </Heading>

          <Text size="5" align="center" weight="bold" className="max-w-2xl">
            The lightweight standup tool that actually works.
          </Text>

          <Text size="4" align="center" className="max-w-3xl">
            Standup Kiwi is designed for one thing: making daily standups
            effortless and meaningful. No complex features you don't need. No
            meetings that drag on. Just clean, organized updates that help you
            and your team stay in sync.
          </Text>

          <Grid
            columns={{ initial: "1", sm: "2", md: "3" }}
            gap="4"
            className="w-full max-w-6xl"
          >
            {benefits.map((benefit, index) => (
              <Card key={index} size="3">
                <Flex direction="column" gap="3">
                  <Text size="6">{benefit.icon}</Text>
                  <Text size="3" weight="bold">
                    {benefit.title}
                  </Text>
                  <Text size="2" color="gray">
                    {benefit.desc}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Create Your Board",
      description:
        'Set up a personal board or team workspace in seconds. Name it whatever makes sense—"Daily Progress," "Team Alpha," or just your name. No complex setup, no admin approval needed.',
      icon: <GearIcon className="w-8 h-8" />,
    },
    {
      number: "2",
      title: "Write Your Update",
      description:
        "Answer the classic questions: What did you do yesterday? What's planned for today? Any blockers? Use our clean markdown editor to format lists, add links, and make your updates scannable.",
      icon: <PersonIcon className="w-8 h-8" />,
    },
    {
      number: "3",
      title: "Stay Organized",
      description:
        "Your updates become organized cards on a clean board. Browse today's updates, review past work, and never lose track of progress again. Everything is right where you need it, when you need it.",
      icon: <RocketIcon className="w-8 h-8" />,
    },
  ];

  return (
    <Section size="4">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            How It Works
          </Heading>

          <Text size="5" align="center" weight="bold">
            Simple as 1-2-3
          </Text>

          <Grid
            columns={{ initial: "1", md: "3" }}
            gap="6"
            className="w-full max-w-6xl"
          >
            {steps.map((step, index) => (
              <Card key={index} size="4" className="text-center">
                <Flex direction="column" gap="4" align="center">
                  <Flex
                    align="center"
                    justify="center"
                    className="w-16 h-16 rounded-full bg-[var(--accent-9)] text-white"
                  >
                    <Text size="6" weight="bold">
                      {step.number}
                    </Text>
                  </Flex>
                  {step.icon}
                  <Heading as="h3" size="5">
                    {step.title}
                  </Heading>
                  <Text size="3" align="center">
                    {step.description}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>

          <Card
            size="4"
            className="max-w-3xl bg-[var(--accent-2)] border-[var(--accent-6)]"
          >
            <Flex direction="column" gap="3">
              <Text size="4" weight="bold">
                Real Example
              </Text>
              <Quote>
                Every morning, I grab my coffee and spend 5 minutes updating my
                personal board. It's become my favorite way to start the day—I
                feel more organized and way less stressed about forgetting
                important tasks.
              </Quote>
              <Text size="2" color="gray">
                —Alex, Product Engineer
              </Text>
              <Text size="3" style={{ fontStyle: "italic" }}>
                Try it once, and you'll never go back to chaotic standup
                meetings.
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}

// Target Audiences Section
function TargetAudiencesSection() {
  const audiences = [
    {
      title: "Remote Teams",
      subtitle: "Small teams, startups, distributed companies",
      benefits: [
        "Replace time-zone nightmare meetings with async updates",
        "Keep everyone informed without interrupting deep work",
        "Create a browsable history of team progress",
        "Onboard new members with context from day one",
      ],
      icon: "👥",
    },
    {
      title: "Solo Professionals",
      subtitle: "Developers, designers, writers, consultants",
      benefits: [
        "Start each day with clarity and purpose",
        "Track your progress over time",
        "Never lose track of what you were working on",
        "Build a portfolio of your daily achievements",
      ],
      icon: "👤",
    },
    {
      title: "Open Source Communities",
      subtitle: "Maintainers, contributors, volunteer teams",
      benefits: [
        "Coordinate across continents without scheduling conflicts",
        "Document contributions and progress transparently",
        "Keep volunteers engaged with visible momentum",
        "Self-host with complete control over your data",
      ],
      icon: "🌍",
    },
  ];

  return (
    <Section size="4" className="bg-[var(--gray-1)]">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            Who It's Perfect For
          </Heading>

          <Grid columns={{ initial: "1", md: "3" }} gap="6" className="w-full">
            {audiences.map((audience, index) => (
              <Card key={index} size="4">
                <Flex direction="column" gap="4">
                  <Flex align="center" gap="3">
                    <Text size="7">{audience.icon}</Text>
                    <Flex direction="column">
                      <Heading as="h3" size="5">
                        {audience.title}
                      </Heading>
                      <Text size="3" weight="bold" color="gray">
                        {audience.subtitle}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction="column" gap="2">
                    {audience.benefits.map((benefit, benefitIndex) => (
                      <Flex key={benefitIndex} align="start" gap="2">
                        <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <Text size="3">{benefit}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>

          <Card size="3" className="max-w-2xl bg-[var(--accent-2)]">
            <Quote>
              I use Standup Kiwi every morning with my coffee. It's become my
              favorite way to organize my day.
            </Quote>
            <Text size="2" color="gray" className="mt-2">
              —Alex, Product Engineer
            </Text>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}

// Comparison Section
function ComparisonSection() {
  const comparisons = [
    {
      category: "vs. Traditional Standup Meetings",
      problems: "Scheduled conflicts, time zone issues, interrupts deep work",
      solution: "Write when convenient, read when you need to",
    },
    {
      category: "vs. Slack/Chat Tools",
      problems: "Updates get buried, hard to search, notifications everywhere",
      solution: "Organized cards, easy to browse, distraction-free",
    },
    {
      category: "vs. Heavy PM Tools (Jira, Linear)",
      problems: "Complex setup, feature overload, expensive",
      solution: "Simple setup, focused on standups, affordable",
    },
    {
      category: "vs. Other Standup Tools",
      problems: "Vendor lock-in, limited customization, unclear pricing",
      solution: "Open source, self-hostable, transparent development",
    },
  ];

  return (
    <Section size="4">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            Why Choose Standup Kiwi?
          </Heading>

          <div className="w-full max-w-4xl">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Comparison</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Other Tools</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Standup Kiwi</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {comparisons.map((comp, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Text weight="bold">{comp.category}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <CrossCircledIcon className="w-4 h-4 text-red-500" />
                        <Text size="2">{comp.problems}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <Text size="2">{comp.solution}</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        </Flex>
      </Container>
    </Section>
  );
}

// Open Source Section
function OpenSourceSection() {
  return (
    <Section size="4" className="bg-[var(--gray-1)]">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Flex align="center" gap="3">
            <LockClosedIcon className="w-8 h-8" />
            <Heading as="h2" size="7">
              Open Source You Can Trust
            </Heading>
          </Flex>

          <Grid
            columns={{ initial: "1", md: "2" }}
            gap="6"
            className="w-full max-w-4xl"
          >
            <Card size="4">
              <Flex direction="column" gap="4">
                <Heading as="h3" size="5">
                  Your Data, Your Rules
                </Heading>
                <Flex direction="column" gap="3">
                  {[
                    "Complete transparency - see exactly how your data is handled",
                    "Self-hosting option - keep everything on your own servers",
                    "No vendor lock-in - export your data anytime",
                    "Community-driven - shaped by real users like you",
                  ].map((item, index) => (
                    <Flex key={index} align="start" gap="2">
                      <CheckIcon className="w-4 h-4 text-green-500 mt-0.5" />
                      <Text size="3">{item}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Card>

            <Card size="4">
              <Flex direction="column" gap="4">
                <Heading as="h3" size="5">
                  Built in the Open
                </Heading>
                <Flex direction="column" gap="3">
                  {[
                    {
                      icon: <GitHubLogoIcon />,
                      text: "Open source on GitHub - help us build something great together",
                    },
                    {
                      icon: <GearIcon />,
                      text: "Active development with regular updates",
                    },
                    {
                      icon: <QuestionMarkCircledIcon />,
                      text: "Community support for issues and feature requests",
                    },
                    {
                      icon: <RocketIcon />,
                      text: "Getting started guide with setup instructions",
                    },
                  ].map((item, index) => (
                    <Flex key={index} align="start" gap="2">
                      <Box className="w-4 h-4 mt-0.5">{item.icon}</Box>
                      <Text size="3">{item.text}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Container>
    </Section>
  );
}

// Pricing Section
function PricingSection() {
  return (
    <Section size="4">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            Pricing
          </Heading>

          <Text size="5" align="center" weight="bold">
            Two Options, Both Free for Now
          </Text>

          <Grid
            columns={{ initial: "1", md: "2" }}
            gap="6"
            className="w-full max-w-4xl"
          >
            <Card size="4" className="border-2">
              <Flex direction="column" gap="4" align="center">
                <Text size="6">🌐</Text>
                <Heading as="h3" size="5">
                  Managed Service
                </Heading>
                <Flex direction="column" gap="2" align="center">
                  <Text size="3">• Hosted at standupkiwi.com</Text>
                  <Text size="3">• Zero setup required</Text>
                  <Text size="3">• All features included</Text>
                  <Text size="2" color="gray" style={{ fontStyle: "italic" }}>
                    Future: $1/user/month per board (much later)
                  </Text>
                </Flex>
                <Button size="3" className="w-full">
                  Get Started Free
                </Button>
              </Flex>
            </Card>

            <Card size="4" className="border-2 border-[var(--accent-6)]">
              <Flex direction="column" gap="4" align="center">
                <Text size="6">🏠</Text>
                <Heading as="h3" size="5">
                  Self-Hosting
                </Heading>
                <Flex direction="column" gap="2" align="center">
                  <Text size="3">• Deploy on your own servers</Text>
                  <Text size="3">• Complete control of your data</Text>
                  <Text size="3">• Full feature access</Text>
                  <Text size="2" color="green" style={{ fontStyle: "italic" }}>
                    Always free forever
                  </Text>
                </Flex>
                <Button size="3" variant="outline" className="w-full">
                  View Docs
                </Button>
              </Flex>
            </Card>
          </Grid>

          <Card size="3" className="max-w-2xl">
            <Flex direction="column" gap="3">
              <Heading as="h4" size="4">
                When Pricing Changes
              </Heading>
              <Text size="3">
                We'll introduce managed service pricing much later (12+ months)
                with:
              </Text>
              <Flex direction="column" gap="2">
                <Text size="3">📢 Plenty of advance notice</Text>
                <Text size="3">🔄 Free data migration help</Text>
                <Text size="3">🎁 30-day free trial for new users</Text>
              </Flex>
              <Text size="3" style={{ fontStyle: "italic" }}>
                Focus on building great standup habits today. Worry about
                pricing much later.
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}

// FAQ Section
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is it really free?",
      answer:
        "Yes! Everything is free right now. Self-hosting will always stay free, and our managed service will introduce pricing much later with advance notice and data migration support.",
    },
    {
      question: "Can my team use it now?",
      answer:
        "Team collaboration features are in beta. Individual team members can create personal boards immediately, and we're rolling out shared team boards soon.",
    },
    {
      question: "How is this different from just using Slack?",
      answer:
        "Slack is great for quick conversations, but terrible for organized daily updates. Standup Kiwi creates a clean, searchable history of your work that you can actually use.",
    },
    {
      question: "Do I need to know how to code to self-host?",
      answer:
        "Basic server knowledge helps, but we're working on one-click deployment options. Most users are happy with our hosted version.",
    },
    {
      question: "What if I don't like it?",
      answer:
        "No problem! Your data is yours—export it anytime. No contracts, no hassle.",
    },
  ];

  return (
    <Section size="4" className="bg-[var(--gray-1)]">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Flex align="center" gap="3">
            <QuestionMarkCircledIcon className="w-8 h-8" />
            <Heading as="h2" size="7">
              Frequently Asked Questions
            </Heading>
          </Flex>

          <div className="w-full max-w-3xl">
            {faqs.map((faq, index) => (
              <Card key={index} size="3" className="mb-4">
                <Flex
                  align="center"
                  justify="between"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="cursor-pointer"
                >
                  <Text size="4" weight="bold">
                    {faq.question}
                  </Text>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </Flex>
                {openFAQ === index && (
                  <Box className="mt-3 pt-3 border-t border-[var(--gray-6)]">
                    <Text size="3">{faq.answer}</Text>
                  </Box>
                )}
              </Card>
            ))}
          </div>
        </Flex>
      </Container>
    </Section>
  );
}

// Roadmap Section
function RoadmapSection() {
  const currentFeatures = [
    'Yesterday Context Recall - "What did I do yesterday again?" Auto-fill from your previous updates',
    "Today Suggestion Engine - Get smart suggestions for today's update based on your work patterns",
    "Daily Team Digest - See what everyone's working on today (not just for managers!)",
    "AI Weekly Digest - Auto-generated personal and team summaries with insights and trends",
  ];

  const futureFeatures = [
    "Blocker tracking & resolution",
    "Collaboration analysis",
    "Smart search & timeline",
    "Voice recording",
    "Advanced team insights",
  ];

  return (
    <Section size="4">
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <Heading as="h2" size="7" align="center">
            What's Coming Next
          </Heading>

          <Text size="4" align="center" className="max-w-2xl">
            We're just getting started. Here's what we're working on based on
            real user feedback:
          </Text>

          <Grid
            columns={{ initial: "1", md: "2" }}
            gap="6"
            className="w-full max-w-4xl"
          >
            <Card size="4">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <RocketIcon className="w-5 h-5" />
                  <Heading as="h3" size="4">
                    In Development
                  </Heading>
                </Flex>
                <Flex direction="column" gap="3">
                  {currentFeatures.map((feature, index) => (
                    <Flex key={index} align="start" gap="2">
                      <GearIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <Text size="3">{feature}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Card>

            <Card size="4">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <StarIcon className="w-5 h-5" />
                  <Heading as="h3" size="4">
                    Coming Later
                  </Heading>
                </Flex>
                <Flex direction="column" gap="3">
                  {futureFeatures.map((feature, index) => (
                    <Flex key={index} align="start" gap="2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-gray-500" />
                      <Text size="3">{feature}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Card>
          </Grid>

          <Text size="4" align="center" style={{ fontStyle: "italic" }}>
            Your feedback shapes our priorities. What would help you most?
          </Text>
        </Flex>
      </Container>
    </Section>
  );
}

// Final CTA Section
function FinalCTASection() {
  return (
    <Section
      size="4"
      className="bg-gradient-to-b from-[var(--gray-1)] to-white"
    >
      <Container size="3" px="4">
        <Flex direction="column" gap="6" align="center">
          <RocketIcon className="w-12 h-12" />

          <Heading as="h2" size="8" align="center">
            Ready to Transform Your Standups?
          </Heading>

          <Text size="5" align="center" weight="bold">
            Join the beta and help shape the future of standups
          </Text>

          <Text size="4" align="center" weight="bold">
            Set up your standup board in seconds
          </Text>

          <Button size="4" className="px-8">
            Get Started Free →
          </Button>

          <Text size="2" color="gray" align="center">
            No credit card required • No setup needed • Start immediately
          </Text>

          <Separator size="4" className="max-w-md" />

          <Flex direction="column" gap="3" align="center">
            <Text size="4" weight="bold">
              Still have questions?
            </Text>
            <Flex gap="6" wrap="wrap" justify="center">
              <Link size="3">📖 View the documentation</Link>
              <Link size="3">💬 Join our community</Link>
              <Link size="3">📧 Contact support</Link>
            </Flex>
          </Flex>

          <Text size="2" color="gray" align="center" className="mt-8">
            Built with ❤️ by developers, for developers. Open source forever.
          </Text>
        </Flex>
      </Container>
    </Section>
  );
}

function NewLandingContent() {
  return (
    <Theme className="relative" accentColor="gray">
      <NavBar />

      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <TargetAudiencesSection />
      <ComparisonSection />
      <OpenSourceSection />
      <PricingSection />
      <FAQSection />
      <RoadmapSection />
      <FinalCTASection />
    </Theme>
  );
}

export default NewLandingContent;
