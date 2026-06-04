import type { Peer } from "./mockData";

const availabilityWeight: Record<Peer["availabilityStatus"], number> = {
  Available: 3,
  Busy: 1,
  Away: 0,
};

/**
 * Extracts likely experience tags from a free-text problem statement by
 * matching against the tags that exist in the peer pool. Purely frontend,
 * keyword-based — this is the "scalable matching" stand-in for the demo.
 */
export function extractTagsFromQuery(query: string, peers: Peer[]): string[] {
  const haystack = query.toLowerCase();
  const allTags = Array.from(new Set(peers.flatMap((p) => p.experienceTags)));
  const direct = allTags.filter((tag) => haystack.includes(tag.toLowerCase()));

  // Loose keyword hints so the demo still matches if exact tags aren't typed.
  const hints: Array<[string, string]> = [
    ["finflow", "FinFlow"],
    ["loan", "Loan Approval"],
    ["dashboard", "Dashboards"],
    ["report", "Reporting"],
    ["compliance", "Compliance Reporting"],
    ["legacy", "Legacy Core Banking"],
    ["core banking", "Core Banking"],
  ];
  for (const [keyword, tag] of hints) {
    if (haystack.includes(keyword) && allTags.includes(tag)) direct.push(tag);
  }

  return Array.from(new Set(direct));
}

export interface ScoredPeer {
  peer: Peer;
  score: number;
  matchedTags: string[];
  /** Time slot ids shared by the user and this peer. */
  matchedSlots: string[];
}

export interface MatchOptions {
  /** Time slot ids the user said they're free in. */
  selectedSlots?: string[];
  /** If true, also include Busy/Away experts the user is willing to wait for. */
  okayToWait?: boolean;
}

/**
 * Sorts peers by how well their experience tags overlap with the query tags,
 * boosted by shared availability time slots, then tie-broken by status and
 * gamification points. Returns the Top N so the right people aren't all pinged
 * at once. When `okayToWait` is false, Busy/Away experts are filtered out.
 */
export function matchPeers(
  queryTags: string[],
  peers: Peer[],
  options: MatchOptions = {},
  topN = 5
): ScoredPeer[] {
  const tagSet = new Set(queryTags.map((t) => t.toLowerCase()));
  const slotSet = new Set(options.selectedSlots ?? []);
  const okayToWait = options.okayToWait ?? false;

  return peers
    .filter((peer) => okayToWait || peer.availabilityStatus === "Available")
    .map((peer) => {
      const matchedTags = peer.experienceTags.filter((t) =>
        tagSet.has(t.toLowerCase())
      );
      const matchedSlots = peer.availableSlots.filter((s) => slotSet.has(s));
      const overlapScore = matchedTags.length * 10;
      const slotScore = matchedSlots.length * 6;
      const availScore = availabilityWeight[peer.availabilityStatus];
      const reputationScore = peer.gamificationPoints / 100;
      return {
        peer,
        score: overlapScore + slotScore + availScore + reputationScore,
        matchedTags,
        matchedSlots,
      };
    })
    .filter((s) => s.matchedTags.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
