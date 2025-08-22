export const Segments = {
  Decisions: "decisions",
} as const;

const decisionsCollection = {
  path: Segments.Decisions,
  doc: <T extends string>(id: T) =>
    ({
      path: `${Segments.Decisions}/${id}`,
    }) as const,
} as const;

export const fsPaths = {
  decisions: decisionsCollection,
} as const;
