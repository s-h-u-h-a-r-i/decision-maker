export const Segments = {
  Decision: "decision",
  Decisions: "decisions",
} as const;

const decisionCollection = {
  path: Segments.Decision,
  doc: <T extends string>(userId: T) =>
    ({
      path: `${Segments.Decision}/${userId}`,
      decisions: {
        path: `${Segments.Decision}/${userId}/${Segments.Decisions}`,
        doc: <T extends string>(id: T) =>
          ({
            path: `${Segments.Decision}/${userId}/${Segments.Decisions}/${id}`,
          }) as const,
      },
    }) as const,
} as const;

export const fsPaths = {
  decision: decisionCollection,
} as const;
