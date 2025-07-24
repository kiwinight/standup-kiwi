import {
  Await,
  useLoaderData,
  useRouteLoaderData,
  useParams,
} from "react-router";
import type { loader } from "./board-route";
import { Suspense } from "react";
import type { Board, Standup, StandupForm, Collaborator, User } from "types";
import type { loader as rootLoader } from "~/root";
import { useBoardViewSettings } from "~/hooks/use-board-view-settings";
import FeedView from "./feed-view";
import GridView from "./grid-view";

export function ViewDataResolver({
  fallback,
  children,
}: {
  children: (data: {
    currentUser: User | null;
    boardTimezone: Board["timezone"];
    standups: Standup[];
    standupForms: StandupForm[];
    collaborators: Collaborator[];
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");

  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);
  const {
    standupsPromise,
    standupFormsPromise,
    collaboratorsPromise,
    boardTimezonePromise,
  } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={currentUserPromise}>
        {(currentUser) => (
          <Await resolve={boardTimezonePromise}>
            {(boardTimezone) => (
              <Await resolve={standupsPromise}>
                {(standups) => (
                  <Await resolve={standupFormsPromise}>
                    {(standupForms) => (
                      <Await resolve={collaboratorsPromise}>
                        {(collaborators) => {
                          if (
                            !currentUser ||
                            !boardTimezone ||
                            !standups ||
                            !standupForms ||
                            !collaborators
                          ) {
                            return fallback;
                          }

                          return children({
                            currentUser,
                            boardTimezone,
                            standups,
                            standupForms,
                            collaborators,
                          });
                        }}
                      </Await>
                    )}
                  </Await>
                )}
              </Await>
            )}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

function View() {
  const { boardId } = useParams();
  const { viewType } = useBoardViewSettings(parseInt(boardId!, 10));

  if (viewType === "grid") {
    return <GridView />;
  }

  if (viewType === "feed") {
    return <FeedView />;
  }

  return null;
}

export default View;
