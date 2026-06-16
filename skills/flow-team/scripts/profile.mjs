// Profile — compute the user's "signals" from their own Flow (via FLOW_API_KEY).
// These numbers drive personalized recipe recommendations (see recommend.mjs).
//
//   node scripts/profile.mjs            # print today's signals as JSON
//
// Read-only.

import { gatherBrief, ymd } from "./brief.mjs";

export async function profile(today = ymd(new Date())) {
  const d = await gatherBrief(today, { deep: false });
  return {
    openTasks: d.open.length,
    overdue: d.overdue.length,
    dueToday: d.dueToday.length,
    soon: d.soon.length,
    noDeadline: d.noDue.length,
    unreadAlarms: d.unread.length,
    unreadMentions: d.mentions.length,
    asWorker: d.asWorker.length,
    ownerless: d.ownerless.length,
    projects: d.projectCount,
    weekMeetings: d.weekEvents.length,
  };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const arg = process.argv[2];
  const today = arg && /^\d{8}$/.test(arg) ? arg : ymd(new Date());
  console.log(JSON.stringify(await profile(today), null, 2));
}
