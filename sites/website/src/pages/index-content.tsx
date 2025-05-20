import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Section,
  SegmentedControl,
  Text,
  Theme,
} from "@radix-ui/themes";
import { BoxModelIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

function PreviewA() {
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
  const dayBeforeYesterday = new Date(
    Date.now() - 86400000 * 2
  ).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div
      className="rt-Container rt-r-size-4 rt-r-px-4 rt-r-my-7"
      style={{
        transform: "scale(0.95)",
        transformOrigin: "top",
      }}
    >
      <div
        className="rt-ContainerInner rt-r-max-w"
        style={{
          maxWidth: "672px",
        }}
      >
        <div className="rt-Flex rt-r-fd-column rt-r-gap-7">
          <div className="rt-Flex rt-r-fd-column sm:rt-r-fd-row rt-r-ai-start sm:rt-r-ai-center rt-r-jc-space-between">
            <span className="rt-Text rt-r-size-6 rt-r-weight-bold">
              Daily Touchbase
            </span>
            <div className="rt-Flex rt-r-gap-5 rt-r-mt-4 sm:rt-r-mt-0">
              <a
                data-accent-color=""
                className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-high-contrast rt-Button"
                href="/boards/27/settings/sharing"
                data-discover="true"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Share
              </a>
              <a
                data-accent-color=""
                className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-high-contrast rt-Button"
                href="/boards/27/settings"
                data-discover="true"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Settings
              </a>
            </div>
          </div>
          <div
            tabIndex={0}
            className="rt-reset rt-BaseCard rt-Card rt-r-size-2 sm:rt-r-size-4 rt-variant-surface"
          >
            <div className="rt-Flex rt-r-fd-column rt-r-gap-5">
              <span className="rt-Text rt-r-size-4 rt-r-weight-bold">
                Today's Standup
              </span>
              <div className="rt-Flex rt-r-fd-column rt-r-gap-5">
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 font-[var(--font-weight-semibold)]">
                    What did you do yesterday?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>
                        Connected the notification settings UI to live data
                      </li>
                      <li>
                        Completed edge case testing with QA—
                        <strong>no major issues found</strong>
                      </li>
                      <li>
                        Drafted the first version of the v1.3.0{" "}
                        <a href="https://standupkiwi.com/">release notes</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 font-[var(--font-weight-semibold)]">
                    What will you do today?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>Final UI tweaks based on design feedback</li>
                      <li>Prep the release branch for v1.3.0</li>
                      <li>
                        <del>
                          Circle back with content team on onboarding modal copy
                        </del>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rt-Flex rt-r-jc-end rt-r-gap-2">
                <button
                  data-accent-color=""
                  className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-surface rt-high-contrast rt-Button"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="rt-Flex rt-r-fd-column rt-r-gap-5">
            <span className="rt-Text rt-r-size-3 rt-r-weight-bold">
              Past Standups
            </span>
            <div className="rt-reset rt-BaseCard rt-Card rt-r-size-2 sm:rt-r-size-4 rt-variant-surface">
              <div className="rt-Flex rt-r-fd-column rt-r-ai-start rt-r-gap-5">
                <span
                  data-state="closed"
                  className="rt-Text rt-r-size-4 rt-r-weight-bold"
                >
                  {yesterday}
                </span>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    What did you do yesterday?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>
                        <strong>Built the first draft</strong> of the
                        notification settings UI
                      </li>
                      <li>Synced with backend team on alert API versioning</li>
                      <li>
                        Wrote and shared the sprint review draft for feedback
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    What will you do today?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>
                        Polish notification UI and hook it up to real data
                      </li>
                      <li>Test alert edge cases with QA</li>
                      <li>
                        Start drafting release notes for{" "}
                        <a href="https://standupkiwi.com">v1.3.0</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    Do you have any blockers?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>Still waiting on onboarding modal copy</li>
                      <li>
                        Need confirmation from product on fallback behavior for
                        alert failures
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="rt-reset rt-BaseCard rt-Card rt-r-size-2 sm:rt-r-size-4 rt-variant-surface">
              <div className="rt-Flex rt-r-fd-column rt-r-ai-start rt-r-gap-5">
                <span
                  data-state="closed"
                  className="rt-Text rt-r-size-4 rt-r-weight-bold"
                >
                  {dayBeforeYesterday}
                </span>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    What did you do yesterday?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>Wrapped up the auth flow redesign for mobile</li>
                      <li>
                        Fixed a <del>production</del> bug causing time zone
                        issues in scheduled reports
                      </li>
                      <li>
                        Reviewed PRs for the dashboard loading improvements
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    What will you do today?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>
                        Start implementing the new notification settings UI
                      </li>
                      <li>
                        Coordinate with backend on API versioning for alerts
                      </li>
                      <li>Draft a summary for next week's sprint review</li>
                    </ul>
                  </div>
                </div>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                  <span className="rt-Text rt-r-size-2 rt-r-weight-medium">
                    Do you have any blockers?
                  </span>
                  <div className="rt-Box prose prose-sm prose-custom">
                    <ul>
                      <li>
                        Waiting on final copy from content team for the
                        onboarding modal
                      </li>
                      <li>
                        <strong>Still need clarity</strong> on edge case
                        behavior for time-based triggers
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewB() {
  return (
    <div
      className="rt-Container rt-r-size-4 rt-r-px-4 rt-r-my-7"
      style={{
        transform: "scale(0.95)",
        transformOrigin: "top",
      }}
    >
      <div
        className="rt-ContainerInner rt-r-max-w"
        style={{
          maxWidth: "672px",
        }}
      >
        <div className="rt-Flex rt-r-fd-column rt-r-gap-7">
          <div className="rt-Flex rt-r-fd-column sm:rt-r-fd-row rt-r-ai-start sm:rt-r-ai-center rt-r-jc-space-between">
            <span className="rt-Text rt-r-size-6 rt-r-weight-bold">
              Team Kiwi and the Night – Daily Sync
            </span>
            <div className="rt-Flex rt-r-gap-5 rt-r-mt-4 sm:rt-r-mt-0">
              <a
                data-accent-color=""
                className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-high-contrast rt-Button"
                href="/boards/28/settings/sharing"
                data-discover="true"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Share
              </a>
              <a
                data-accent-color=""
                className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-high-contrast rt-Button"
                href="/boards/28/settings"
                data-discover="true"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Settings
              </a>
            </div>
          </div>
          <div
            tabIndex={0}
            className="rt-reset rt-BaseCard rt-Card rt-r-size-2 sm:rt-r-size-4 rt-variant-surface"
          >
            <form method="post">
              <div className="rt-Flex rt-r-fd-column">
                <span className="rt-Text rt-r-size-4 rt-r-weight-bold">
                  Today's Standup
                </span>
                <div className="rt-Flex rt-r-fd-column rt-r-gap-5 rt-r-mt-5">
                  <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                    <label>
                      <div className="rt-Flex rt-r-ai-center rt-r-gap-2">
                        <span className="rt-Text rt-r-size-2 font-[var(--font-weight-semibold)]">
                          What did you do yesterday?
                        </span>
                        <span
                          data-accent-color="gray"
                          className="rt-Text rt-r-size-1"
                        >
                          Required
                        </span>
                      </div>
                    </label>
                    <div
                      className="rt-TextAreaRoot rt-r-size-2 rt-variant-soft rt-r-resize-vertical w-full !min-h-[80px]"
                      style={{
                        height: "160px",
                      }}
                    >
                      <textarea
                        className="rt-reset rt-TextAreaInput"
                        placeholder="Write your reply here..."
                        style={{
                          height: "auto",
                        }}
                        defaultValue={`- Refactored the user profile component
- Fixed a bug with **timezone conversion** on the dashboard 
- Reviewed [PR #142](https://github.com/kiwinight/standup-kiwi/issues/142) from Joseph`}
                      />
                    </div>
                  </div>
                  <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                    <label>
                      <div className="rt-Flex rt-r-ai-center rt-r-gap-2">
                        <span className="rt-Text rt-r-size-2 font-[var(--font-weight-semibold)]">
                          What will you do today?
                        </span>
                        <span
                          data-accent-color="gray"
                          className="rt-Text rt-r-size-1"
                        >
                          Required
                        </span>
                      </div>
                    </label>
                    <div
                      className="rt-TextAreaRoot rt-r-size-2 rt-variant-soft rt-r-resize-vertical w-full !min-h-[80px]"
                      style={{
                        height: "120px",
                      }}
                    >
                      <textarea
                        className="rt-reset rt-TextAreaInput"
                        placeholder="Write your reply here..."
                        defaultValue={`- Start implementing the onboarding flow for new users
- ~~Set up a feature flag for beta testing~~`}
                      />
                    </div>
                  </div>
                  <div className="rt-Flex rt-r-fd-column rt-r-gap-2">
                    <label>
                      <div className="rt-Flex rt-r-ai-center rt-r-gap-2">
                        <span className="rt-Text rt-r-size-2 font-[var(--font-weight-semibold)]">
                          Do you have any blockers?
                        </span>
                      </div>
                    </label>
                    <div className="rt-TextAreaRoot rt-r-size-2 rt-variant-soft rt-r-resize-vertical w-full !min-h-[80px]">
                      <textarea
                        className="rt-reset rt-TextAreaInput"
                        placeholder="Write your reply here..."
                        defaultValue="None at the moment, but I might need API clarification from Joseph later today"
                      />
                    </div>
                    <span
                      data-accent-color="gray"
                      className="rt-Text rt-r-size-2"
                    >
                      Share any challenges or obstacles that might slow down
                      your progress
                    </span>
                  </div>
                </div>
                <div className="rt-Flex rt-r-jc-end rt-r-gap-2 rt-r-mt-5">
                  <button
                    data-accent-color=""
                    type="button"
                    className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-surface rt-high-contrast rt-Button"
                  >
                    Cancel
                  </button>
                  <button
                    data-accent-color=""
                    type="submit"
                    className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-solid rt-high-contrast rt-Button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function GridBackground() {
  const GRID_SIZE = 32;
  const OPACITY = 0.05;
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,${OPACITY}) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,${OPACITY}) 1px, transparent 1px)`,
        pointerEvents: "none",
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: `${GRID_SIZE - 1}px ${GRID_SIZE - 9}px`,
      }}
    />
  );
}

function NavBar() {
  return (
    <Flex
      position="sticky"
      height="56px"
      className="px-4 z-10 shadow-[inset_0_-1px_0_0_var(--accent-a4)] bg-white"
      justify="start"
      align="center"
      top="0"
    >
      <Flex gap="3" align="center">
        <Button variant="ghost" size="1">
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
        </Button>
        <Badge highContrast>Beta</Badge>
      </Flex>
    </Flex>
  );
}

type Props = {};

function IndexContent({}: Props) {
  const [selectedPreview, setSelectedPreview] = useState("a");
  return (
    <Theme className="relative" accentColor="gray">
      <NavBar />
      <Box
        pt={{
          initial: "0",
          sm: "6",
        }}
        pb={{
          sm: "6",
        }}
        className="bg-linear-to-b from-white via-[var(--gray-1)] to-white"
        style={{}}
      >
        <GridBackground />

        <Section
          size={{
            initial: "3",
            sm: "4",
          }}
          className="relative"
        >
          <Container
            size={{
              initial: "4",
              sm: "3",
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
                The standup board <br className="hidden sm:block" />
                for teams and solo experts
              </Heading>

              <Text
                size={{
                  initial: "3",
                  sm: "4",
                }}
                align={{
                  initial: "center",
                  sm: "center",
                }}
              >
                Standup Kiwi is an open-source tool for async check-ins, daily
                reflections, and progress sharing – calm, clear, and effortless.
              </Text>

              <Button
                // className="self-start!"
                asChild
                className="w-full! sm:w-auto!"
                size={{
                  initial: "3",
                  sm: "4",
                }}
                highContrast
              >
                <a href={import.meta.env.PUBLIC_APP_URL}>Start Now</a>
              </Button>

              <Text size="2" color="gray">
                Currently in beta. We welcome your feedback!
              </Text>
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
              initial: "4",
              sm: "4",
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
              <SegmentedControl.Root
                className="w-full sm:max-w-[296px]"
                defaultValue={selectedPreview}
                onValueChange={setSelectedPreview}
                size={{
                  initial: "2",
                  sm: "3",
                }}
                radius="full"
              >
                <SegmentedControl.Item value="a">
                  <Flex align="center" gap="2">
                    <BoxModelIcon className="w-[15px] sm:w-[18px] h-[15px] sm:h-[18px]" />
                    Board
                  </Flex>
                </SegmentedControl.Item>
                <SegmentedControl.Item value="b">
                  <Flex align="center" gap="2">
                    <Pencil2Icon className="w-[15px] sm:w-[18px] h-[15px] sm:h-[18px]" />
                    Editor
                  </Flex>
                </SegmentedControl.Item>
              </SegmentedControl.Root>

              <Text
                size={{
                  initial: "2",
                  sm: "3",
                }}
                align="center"
              >
                {selectedPreview === "a" && (
                  <>
                    Catch up on today's and past standups with calm, clear cards
                    on a board. <br className="hidden sm:block" /> Organize them
                    by team, project, or personal boards.
                  </>
                )}
                {selectedPreview === "b" && (
                  <>
                    Write and edit your standups in a clean, markdown-supported
                    format. <br className="hidden sm:block" /> Use lists, bold,
                    and italics to keep your updates clear and easy to scan.
                  </>
                )}
              </Text>

              <Card
                className="pointer-events-none select-none w-full"
                inert
                size={{
                  initial: "1",
                  sm: "5",
                }}
              >
                {selectedPreview === "a" && <PreviewA />}
                {selectedPreview === "b" && <PreviewB />}
              </Card>
            </Flex>
          </Container>
        </Section>
      </Box>
    </Theme>
  );
}

export default IndexContent;
