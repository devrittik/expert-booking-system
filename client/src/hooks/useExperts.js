import { useQuery } from "@tanstack/react-query";

import { getExpertById, getExperts } from "../services/expertService";

export function useExperts(params) {
  return useQuery({
    queryKey: ["experts", params],
    queryFn: () => getExperts(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useExpert(id) {
  return useQuery({
    queryKey: ["expert", id],
    queryFn: () => getExpertById(id),
    enabled: Boolean(id),
  });
}
