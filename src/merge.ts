export function mergeMappings(
  newMappings: {
    in_url: string;
    out_url: string;
  }[],
  existingMappings: {
    in_url: string;
    out_url: string;
  }[]
) {
  return newMappings.concat(
    existingMappings.filter(
      (item2) =>
        !newMappings.some(
          (item1) =>
            item1.in_url === item2.in_url && item1.out_url === item2.out_url
        )
    )
  );
}
