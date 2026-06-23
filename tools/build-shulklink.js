/*
 * build-shulklink.js — adds the ShulkLink0624 walkthrough SPINE to checklist.json.
 *
 * Source of truth: ShulkLink0624's GameFAQs guide (faqs/76615), structure + factual
 * data only (quest/UM/HTH numbering, points of no return, mutually-exclusive + timed
 * quests, Colony 6 development, High Entia doors). NO prose copied.
 *
 * This loads the existing checklist.json (which already holds the Collectopaedia +
 * landmark data) and ADDS:
 *   - data.pointsOfNoReturn : the 5 authoritative lockout points
 *   - data.walkthrough      : the 40 chronological sections (4.1–4.40), each with its
 *                             quests / unique monsters / heart-to-hearts / Colony 6 /
 *                             key notes, in the order the guide plays them.
 *
 * Run: node tools/build-shulklink.js
 */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "..", "public", "data", "checklist.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const slug = (s) => String(s).toLowerCase().replace(/['’.!?,…()/]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---- 5 points of no return (authoritative) ---------------------------------
const PONR = [
  { id: "ponr-colony6", order: 1, after: "§4.11",
    label: "Before you start Colony 6 reconstruction (immigrate the Bionis' Leg residents)",
    locks: "All Refugee Camp / Bionis' Leg TIMED quests. Finish every ⏱ camp quest before completing 'To Colony 6!' / 'The Road Home'." },
  { id: "ponr-mechonis-field", order: 2, after: "§4.26",
    label: "Before the Mechonis Field boss",
    locks: "Sword Valley & Galahad Fortress become permanently inaccessible (quests, unique monsters, collectables, maps)." },
  { id: "ponr-agniratha", order: 3, after: "§4.28",
    label: "Before the Agniratha boss",
    locks: "Mechonis Field & Agniratha become permanently inaccessible. (Also re-confirms Sword Valley/Galahad already gone.)" },
  { id: "ponr-mechonis-core", order: 4, after: "§4.31",
    label: "Before the Mechonis Core",
    locks: "Central Factory permanent (last chance is the §4.30 approach). Prison Island temporarily locked (returns post-core). Alcamoth quick-travel disabled & full High Entia gone. All un-done Eryth Sea / Alcamoth TIMED quests are forfeit." },
  { id: "ponr-memory-space", order: 5, after: "§4.40",
    label: "Before using the Memory Space transporter (endgame)",
    locks: "Final point of no return — once used you cannot return; only the final bosses remain." }
];

// ---- helpers ----------------------------------------------------------------
// q(code, name, opts)  opts: {a:area, t:timed, x:"partner name" (mutex), story, note}
const sections = [];
function sec(id, title, region, opts = {}) {
  const s = { id, code: id, title, region, locksAt: opts.locksAt || null, ponrTrigger: opts.ponrTrigger || null, quests: [], ums: [], hths: [], colony6: [], notes: opts.notes || [] };
  sections.push(s);
  return s;
}
function q(s, code, name, o = {}) {
  s.quests.push({ id: "wq-" + slug(s.id + "-" + code + "-" + name), code, label: name, area: o.a || s.region, timed: !!o.t, missable: !!(o.t || o.x || o.miss), mutexWith: o.x || null, story: !!o.story, note: o.note || null, confidence: o.c || "high" });
}
function um(s, code, name, lvl, o = {}) {
  s.ums.push({ id: "wum-" + slug(s.id + "-" + code), code, label: name + (lvl ? ` (Lv. ${lvl})` : ""), area: o.a || s.region, missable: !!o.miss, note: o.note || null, confidence: "high" });
}
function hth(s, code, name, chars, o = {}) {
  s.hths.push({ id: "whth-" + slug(s.id + "-" + code), code, label: `${name} (${chars})`, area: o.a || s.region, affinity: o.aff || null, missable: false, note: o.note || null, confidence: "high" });
}
function c6(s, label, note) { s.colony6.push({ id: "wc6-" + slug(s.id + "-" + label), label, note: note || null, missable: false, confidence: "high" }); }

let S;
// 4.1 ----------------------------------------------------------------
S = sec("4.1", "Prologue", "Tutorial");
// 4.2 ----------------------------------------------------------------
S = sec("4.2", "Colony 9 (First Visit)", "Colony 9");
q(S, "Q1", "Delivering Food", { story: true });
hth(S, "HTH1", "Sunrise In The Park", "Shulk/Fiora", { aff: "Yellow" });
// 4.3 ----------------------------------------------------------------
S = sec("4.3", "Tephra Cave", "Tephra Cave");
// 4.4 ----------------------------------------------------------------
S = sec("4.4", "The Mechon Raid", "Colony 9");
// 4.5 ----------------------------------------------------------------
S = sec("4.5", "Refugee Camp Approach", "Tephra Cave / Bionis' Leg");
// 4.6 ----------------------------------------------------------------
S = sec("4.6", "Lower Bionis' Leg & Colony 9 Errata", "Colony 9 / Tephra Cave / Bionis' Leg",
  { notes: ["Refugee Camp ⏱ TIMED quests in this section lock once Colony 6 reconstruction begins (§4.11)."] });
q(S, "Q1", "Monster Quest 4: Part 1", { a: "Colony 9" });
q(S, "Q3", "Monster Quest 4: Part 2", { a: "Colony 9" });
q(S, "Q4", "Monster Quest 4: Part 3", { a: "Colony 9" });
hth(S, "HTH2", "Enduring Friendship", "Shulk/Reyn", { aff: "Green" });
q(S, "Q5", "Collection Quest 1", { a: "Colony 9" });
q(S, "Q6", "Challenge 2", { a: "Colony 9" });
um(S, "UM1", "Verdant Bluchal", 5, { a: "Colony 9" });
q(S, "Q7", "Collection Quest 4", { a: "Colony 9" });
q(S, "Q8", "Collection Quest 3", { a: "Colony 9" });
q(S, "Q9", "Material Quest 3", { a: "Colony 9" });
q(S, "Q10", "Monster Quest 3: Part 1", { a: "Colony 9" });
q(S, "Q11", "Monster Quest 3: Part 2", { a: "Colony 9" });
q(S, "Q12", "Monster Quest 3: Part 3", { a: "Colony 9" });
q(S, "Q13", "Monster Quest 3: Part 4", { a: "Colony 9" });
q(S, "Q14", "Material Quest 4", { a: "Colony 9" });
q(S, "Q15", "Monster Quest 2: Part 1", { a: "Colony 9" });
q(S, "Q16", "Monster Quest 2: Part 2", { a: "Colony 9" });
q(S, "Q17", "Monster Quest 2: Part 3", { a: "Colony 9" });
q(S, "Q18", "Challenge 1", { a: "Colony 9" });
um(S, "UM2", "Evil Rhangarot", 6, { a: "Colony 9" });
q(S, "Q19", "Challenge 3", { a: "Colony 9" });
um(S, "UM3", "Lake Magdalena", 6, { a: "Colony 9" });
q(S, "Q20", "Monster Quest 1: Part 1", { a: "Colony 9" });
q(S, "Q21", "Monster Quest 1: Part 2", { a: "Colony 9" });
q(S, "Q22", "Monster Quest 1: Part 3", { a: "Colony 9" });
um(S, "UM4", "Speedy Ramshyde", 10, { a: "Colony 9" });
um(S, "UM5", "Itinerant Dorothea", 6, { a: "Colony 9" });
um(S, "UM6", "Enchanting Grune", 13, { a: "Colony 9" });
q(S, "Q23", "Material Quest 2", { a: "Colony 9" });
q(S, "Q24", "Material Quest 1", { a: "Colony 9" });
q(S, "Q25", "Collection Quest 2", { a: "Colony 9" });
q(S, "Q26", "Search Quest 1", { a: "Colony 9" });
q(S, "Q27", "Search Quest 4", { a: "Colony 9" });
q(S, "Q28", "Search Quest 3", { a: "Colony 9" });
q(S, "Q29", "Search Quest 2", { a: "Colony 9" });
q(S, "Q30", "Challenge 4", { a: "Colony 9" });
um(S, "UM7", "Wallslide Gwynry", 9, { a: "Tephra Cave" });
q(S, "Q31", "Collection Quest 1", { a: "Tephra Cave" });
q(S, "Q32", "Collection Quest 2", { a: "Tephra Cave" });
q(S, "Q33", "Material Quest 1", { a: "Tephra Cave" });
q(S, "Q34", "Material Quest 2", { a: "Tephra Cave" });
q(S, "Q35", "Missing In Action", { a: "Tephra Cave" });
q(S, "Q36", "The Lost Pendant", { a: "Colony 9" });
q(S, "Q37", "Arachno Silk Fundraising", { a: "Tephra Cave" });
q(S, "Q38", "A Thank You", { a: "Tephra Cave" });
q(S, "Q39", "Clearing Obstructions", { a: "Tephra Cave" });
q(S, "Q40", "Biscuits For A Grandson", { a: "Colony 9" });
q(S, "Q41", "The Key To A Long Life", { a: "Colony 9" });
q(S, "Q42", "Lonely Niranira", { a: "Colony 9" });
q(S, "Q43", "The Broken Watch", { a: "Colony 9" });
q(S, "Q44", "Education-Minded Suzana", { a: "Colony 9" });
q(S, "Q45", "A Young Captain's Request", { a: "Colony 9" });
q(S, "Q46", "Flattened Flowers", { a: "Colony 9" });
q(S, "Q47", "Pride and Courage", { a: "Colony 9" });
q(S, "Q48", "A Curry Conundrum", { a: "Colony 9" });
q(S, "Q49", "Rocco's Heartful Request", { a: "Colony 9" });
q(S, "Q50", "Dean's Shady Request", { a: "Colony 9" });
q(S, "Q51", "Education-Crazy Suzanna", { a: "Colony 9" });
q(S, "Q52a", "Romantic Notions Of A Girl", { a: "Colony 9", t: true, x: "Romantic Notions Of A Boy" });
q(S, "Q52b", "Romantic Notions Of A Boy", { a: "Colony 9", t: true, x: "Romantic Notions Of A Girl", note: "Guide pick: Andreas (better affinity)." });
q(S, "Q53", "An Impoverished Critic", { a: "Colony 9" });
q(S, "Q54a", "Financial Planning (Leopold route)", { a: "Colony 9", x: "Financial Planning (Sylvaine route)" });
q(S, "Q54b", "Financial Planning (Sylvaine route)", { a: "Colony 9", x: "Financial Planning (Leopold route)", note: "Guide pick: Sylvaine." });
um(S, "UM8", "Cellar Bugworm", 10, { a: "Tephra Cave" });
q(S, "Q55", "Overworked And Underpaid", { a: "Colony 9" });
q(S, "Q56a", "Pestering Paola", { a: "Colony 9", x: "Out-Of-Luck Giorgio" });
q(S, "Q56b", "Out-Of-Luck Giorgio", { a: "Colony 9", x: "Pestering Paola", note: "Guide pick: Paola route." });
q(S, "Q57", "The Plan: Preparation", { a: "Colony 9" });
q(S, "Q58", "The Plan: The Night Before", { a: "Colony 9" });
q(S, "Q59", "The Plan: Execution", { a: "Colony 9" });
um(S, "UM9", "Dark Murakmor", 18, { a: "Colony 9" });
q(S, "Q60", "Monster Quest 1: Part 1", { a: "Bionis' Leg" });
q(S, "Q61", "Monster Quest 1: Part 2", { a: "Bionis' Leg" });
q(S, "Q62", "Monster Quest 1: Part 3", { a: "Bionis' Leg" });
q(S, "Q63", "Monster Quest 1: Part 4", { a: "Bionis' Leg" });
q(S, "Q64", "Search Quest 1", { a: "Bionis' Leg" });
q(S, "Q65", "Search Quest 2", { a: "Bionis' Leg" });
q(S, "Q66", "Collection Quest 1", { a: "Bionis' Leg" });
q(S, "Q67", "Collection Quest 2", { a: "Bionis' Leg" });
q(S, "Q68", "Challenge 1: Part 2", { a: "Bionis' Leg" });
um(S, "UM10", "Violent Andante", 16, { a: "Bionis' Leg" });
q(S, "Q69", "Challenge 2: Part 2", { a: "Bionis' Leg" });
um(S, "UM11", "Vagrant Alfead", 16, { a: "Bionis' Leg" });
q(S, "Q70", "Monster Quest 2", { a: "Bionis' Leg" });
q(S, "Q71", "Monster Quest 3: Part 1", { a: "Bionis' Leg" });
q(S, "Q72", "Monster Quest 3: Part 2", { a: "Bionis' Leg" });
q(S, "Q73", "Material Quest 1", { a: "Bionis' Leg" });
q(S, "Q74", "Material Quest 2", { a: "Bionis' Leg" });
q(S, "Q75", "Material Quest 3", { a: "Bionis' Leg" });
q(S, "Q76", "Material Quest 4", { a: "Bionis' Leg" });
q(S, "Q77", "Thieving Monsters", { a: "Bionis' Leg", t: true });
q(S, "Q78", "Emergency Treatment", { a: "Bionis' Leg", t: true });
q(S, "Q79", "A Thoughtful Idea", { a: "Bionis' Leg", t: true });
q(S, "Q80", "A Dash of Colour", { a: "Bionis' Leg", t: true });
q(S, "Q81", "Being A Good Grandfather", { a: "Bionis' Leg", t: true });
q(S, "Q82", "Earnest's Fibs", { a: "Bionis' Leg" });
q(S, "Q83", "Save the Girl!", { a: "Bionis' Leg", t: true });
um(S, "UM12", "White Eduardo", 17, { a: "Bionis' Leg" });
um(S, "UM13", "Napping Volfen", 17, { a: "Bionis' Leg" });
um(S, "UM14", "Sniper Paramaceia", 15, { a: "Bionis' Leg" });
q(S, "Q84", "Challenge 1: Part 1", { a: "Bionis' Leg" });
q(S, "Q85", "The Greedy Monster", { a: "Bionis' Leg", t: true });
q(S, "Q86", "Earnest's Mischief", { a: "Bionis' Leg" });
q(S, "Q87a", "Imaginations Tempered", { a: "Bionis' Leg", t: true, x: "Spirits Raised", note: "Guide pick: Imaginations Tempered (get the Lake Drop)." });
q(S, "Q87b", "Spirits Raised", { a: "Bionis' Leg", t: true, x: "Imaginations Tempered" });
hth(S, "HTH3", "What's on Reyn's Mind", "Reyn/Sharla", { aff: "Green" });
// 4.7 ----------------------------------------------------------------
S = sec("4.7", "Upper Bionis' Leg & Early Loose Ends", "Bionis' Leg / Tephra Cave",
  { notes: ["Refugee Camp ⏱ TIMED quests still lock at Colony 6 reconstruction (§4.11)."] });
um(S, "UM15", "Mining Patrichev", 8, { a: "Tephra Cave" });
um(S, "UM16", "Solid Konev", 10, { a: "Tephra Cave" });
um(S, "UM17", "Gluttonous Eugene", 11, { a: "Tephra Cave" });
q(S, "Q88", "Challenge 2: Part 1", { a: "Bionis' Leg" });
um(S, "UM18", "Trainer Harmeleon", 15, { a: "Bionis' Leg" });
q(S, "Q89", "Earnest's Solitude", { a: "Bionis' Leg" });
q(S, "Q90", "The Lost Nopon", { a: "Bionis' Leg" });
q(S, "Q91", "With Much Gratitude", { a: "Bionis' Leg" });
q(S, "Q92", "With Even More Gratitude", { a: "Bionis' Leg" });
um(S, "UM19", "Night Cadamaron", 18, { a: "Bionis' Leg" });
q(S, "Q93", "Jackson's Awakening", { a: "Colony 9", note: "Guide pick: Kenny Rohan (poet)." });
q(S, "Q94a", "Jackson The Poet", { a: "Colony 9", x: "Jackson The Cook" });
q(S, "Q94b", "Jackson The Cook", { a: "Colony 9", x: "Jackson The Poet" });
q(S, "Q95", "A Mysterious Light", { a: "Colony 9" });
q(S, "Q96", "Out Like A Light?", { a: "Colony 9", note: "Guide pick: throw the lamp away (faster)." });
q(S, "Q97", "A Young Captain's Suffering", { a: "Colony 9" });
q(S, "Q98", "A Young Captain's Rise", { a: "Colony 9" });
// 4.8 ----------------------------------------------------------------
S = sec("4.8", "Colony 6 (First Visit)", "Colony 6");
q(S, "Q99", "Proof of Status", { a: "Colony 6" });
q(S, "Q100", "Safety First", { a: "Colony 6" });
um(S, "UM20", "Graceful Holland", 19, { a: "Colony 6" });
q(S, "Q101", "Secret Mission", { a: "Colony 6" });
// 4.9 ----------------------------------------------------------------
S = sec("4.9", "Dungeon I: Ether Mine & Central Pit", "Ether Mine");
um(S, "UM21", "Elegant Marin", 29, { a: "Ether Mine" });
um(S, "UM22", "Vengeful Daulton", 22, { a: "Ether Mine" });
um(S, "UM23", "Dark Kisling", 20, { a: "Ether Mine" });
hth(S, "HTH4", "What Visions May Bring", "Shulk/Sharla", { aff: "Green", a: "Bionis' Leg" });
// 4.10 ----------------------------------------------------------------
S = sec("4.10", "Satorl Marsh", "Satorl Marsh");
q(S, "Q101b", "Mementos Of A Lost Son", { a: "Colony 9", note: "Cheryl — collect 3 uniform pieces across regions." });
q(S, "Q102", "Monster Quest 1", { a: "Satorl Marsh" });
q(S, "Q103", "Monster Quest 2", { a: "Satorl Marsh" });
q(S, "Q104", "Monster Quest 3", { a: "Satorl Marsh" });
q(S, "Q105", "Monster Quest 4", { a: "Satorl Marsh" });
q(S, "Q106", "Kacha's Kidnapping", { a: "Satorl Marsh" });
um(S, "UM25", "Stormy Widardun", 25, { a: "Satorl Marsh" });
um(S, "UM26", "Cautious Balteid", 23, { a: "Satorl Marsh" });
um(S, "UM27", "Tumultuous Felix", 27, { a: "Satorl Marsh" });
q(S, "Q107", "Preventing Starvation", { a: "Satorl Marsh" });
q(S, "Q108", "Zazadan In Danger", { a: "Satorl Marsh" });
q(S, "Q109", "Zazadan Still In Danger", { a: "Satorl Marsh" });
um(S, "UM29", "Sunlight Schvaik", 30, { a: "Satorl Marsh" });
q(S, "Q110", "It's All In The Mind", { a: "Satorl Marsh" });
q(S, "Q111", "A Mysterious Delicacy", { a: "Satorl Marsh" });
q(S, "Q112", "A Gift?!", { a: "Satorl Marsh", note: "Deliver to Dedeba in Frontier Village later." });
q(S, "Q113", "Making Camp", { a: "Satorl Marsh" });
q(S, "Q114", "The Giant's Key", { a: "Satorl Marsh" });
q(S, "Q115", "The Giant's Treasure", { a: "Satorl Marsh" });
hth(S, "HTH7", "A Broken Watch", "Sharla/Shulk", { aff: "Purple", a: "Ether Mine" });
hth(S, "HTH8", "The Shimmering Marsh", "Shulk/Dunban", { aff: "Green" });
q(S, "Q116", "The Ancient Ceremony", { a: "Satorl Marsh", story: true });
q(S, "Q117", "Ancient Ceremony Offerings", { a: "Satorl Marsh", story: true });
um(S, "UM30", "Amber Fischer", 27, { a: "Satorl Marsh" });
um(S, "UM31", "Aggressive Cornelius", 28, { a: "Satorl Marsh" });
um(S, "UM32", "Clifftop Bayern", 32, { a: "Bionis' Leg" });
// 4.11 ----------------------------------------------------------------
S = sec("4.11", "Opening Colony 6", "Colony 6", { ponrTrigger: "ponr-colony6",
  notes: ["⚠ POINT OF NO RETURN: completing 'To Colony 6!' / 'The Road Home' immigrates the Bionis' Leg residents and LOCKS every ⏱ Refugee Camp timed quest. Finish them first."] });
q(S, "Q118a", "To Colony 6!", { a: "Colony 6", x: "The Road Home", note: "Reconstruction trigger — do this LAST (it locks the Refugee Camp ⏱ quests). An alternative version is offered much later; just complete THIS one now." });
q(S, "Q118b", "The Road Home", { a: "Colony 6", x: "To Colony 6!", note: "Alternative reconstruction trigger offered much later — ignore it and do 'To Colony 6!' now." });
q(S, "Q119", "The Old Soldier's Test", { a: "Colony 9", miss: true, note: "⚠ Only if you tell Dionysus 'he's too old for the girl.' Guide warns: for PERFECT affinity, SKIP this and answer 'love keeps the old ticker going' instead." });
q(S, "Q120", "A Selfish Girl's Mistake", { a: "Colony 6" });
q(S, "Q121", "Satata's Younger Brother", { a: "Colony 6" });
q(S, "Q122", "Rest In Peace", { a: "Colony 6", note: "Finish at Divine Sanctuary, Makna Forest." });
q(S, "Q123", "Chemist's Reopening", { a: "Colony 6" });
q(S, "Q124", "For the Restoration", { a: "Colony 6" });
q(S, "Q125", "Making A New Path", { a: "Colony 6" });
q(S, "Q126", "What Is Love?!", { a: "Colony 6", note: "Requires the 'Spirits Raised' path." });
q(S, "Q127", "What Is Courage?!", { a: "Colony 6" });
q(S, "Q128", "Matryona's Answer", { a: "Colony 6", note: "Guide pick: lake drop." });
q(S, "Q129", "The Gem Man's Invention", { a: "Colony 9" });
q(S, "Q130", "Desirée's Future", { a: "Colony 9", note: "Career choice — guide leans soldier (friendship value)." });
c6(S, "Colony 6 — Housing Lv. 1", "Spotted Volff Hide x2, Steel Silk x2");
c6(S, "Colony 6 — Commerce Lv. 1", "Igna Hide Jacket x2, Amblygon Turtle x2");
c6(S, "Colony 6 — Nature Lv. 1", "Sharp Hox Spur x2, Dark Grape x2");
c6(S, "Colony 6 — Special Lv. 1 (Meeting House)", "Light Rain Element x1, Kneecap Rock x1");
// 4.12 ----------------------------------------------------------------
S = sec("4.12", "Bionis' Interior (First Visit)", "Bionis' Interior", { notes: ["No collectables or monsters obtainable on this visit — straight run-through."] });
// 4.13 ----------------------------------------------------------------
S = sec("4.13", "Makna Forest", "Makna Forest");
q(S, "Q131", "Monster Quest 1", { a: "Makna Forest" });
q(S, "Q132", "Monster Quest 2", { a: "Makna Forest" });
q(S, "Q133", "Monster Quest 3", { a: "Makna Forest" });
q(S, "Q134", "Monster Quest 4", { a: "Makna Forest" });
q(S, "Q135", "Mystery Girl Rescue", { a: "Makna Forest", story: true });
um(S, "UM33", "Elder Gragus", 34, { a: "Makna Forest" });
// 4.14 ----------------------------------------------------------------
S = sec("4.14", "Frontier Village", "Frontier Village");
q(S, "Q136", "An Errand For The Heropon", { a: "Frontier Village", story: true });
q(S, "Q137", "Challenge", { a: "Makna Forest" });
um(S, "UM34", "Shimmering Forte", 33, { a: "Makna Forest" });
q(S, "Q138", "Monster Quest 1: Part 1", { a: "Frontier Village" });
q(S, "Q139", "Monster Quest 1: Part 2", { a: "Frontier Village" });
q(S, "Q140", "Monster Quest 1: Part 3", { a: "Frontier Village" });
q(S, "Q141", "Monster Quest 2: Part 1", { a: "Frontier Village" });
q(S, "Q142", "Monster Quest 2: Part 2", { a: "Frontier Village" });
q(S, "Q143", "Monster Quest 2: Part 3", { a: "Frontier Village" });
q(S, "Q144", "Challenge 1", { a: "Frontier Village" });
um(S, "UM35", "Agile Albarto", 33, { a: "Makna Forest" });
q(S, "Q145", "Challenge 3", { a: "Frontier Village" });
um(S, "UM36", "Lazy Bluco", 34, { a: "Makna Forest" });
q(S, "Q146", "Collection Quest 1", { a: "Frontier Village" });
q(S, "Q147", "Collection Quest 2", { a: "Frontier Village" });
q(S, "Q148", "Collection Quest 3", { a: "Frontier Village" });
q(S, "Q149", "Collection Quest 4", { a: "Frontier Village" });
q(S, "Q150", "Material Quest 1", { a: "Frontier Village" });
q(S, "Q151", "Material Quest 2", { a: "Frontier Village" });
q(S, "Q152", "Material Quest 4", { a: "Frontier Village" });
q(S, "Q153", "Search Quest 1", { a: "Frontier Village" });
q(S, "Q154", "Search Quest 2", { a: "Frontier Village" });
q(S, "Q155", "Search Quest 3", { a: "Frontier Village" });
q(S, "Q156", "Leku's Food Crisis", { a: "Frontier Village" });
q(S, "Q157", "Hunt for a Patron", { a: "Frontier Village" });
q(S, "Q158", "Heropon's Spirit", { a: "Frontier Village" });
q(S, "Q158b", "Beat Kilaki To It!", { a: "Frontier Village" });
um(S, "UM37", "Obsessive Galgaron", 35, { a: "Makna Forest" });
q(S, "Q159", "Popularity Premonition", { a: "Frontier Village", note: "Guide pick: Pepa." });
q(S, "Q160", "Lousy Lizards", { a: "Frontier Village" });
q(S, "Q161", "Making A Mixer", { a: "Frontier Village" });
q(S, "Q162", "Materials For A Mixer", { a: "Frontier Village" });
q(S, "Q163", "Decoration Makeover", { a: "Frontier Village" });
q(S, "Q164", "Hunt For A Bug Loving Friend", { a: "Frontier Village" });
q(S, "Q165", "Mushy Mushrooms", { a: "Frontier Village" });
q(S, "Q166", "Fixing Time Mushrooms", { a: "Frontier Village" });
q(S, "Q167", "Sweet Seduction", { a: "Frontier Village", note: "Guide warning: SELL all Walnut Grapes first (glitch). Bitter Kiwi route is best." });
q(S, "Q168", "Ingredients for A Brew", { a: "Frontier Village" });
q(S, "Q169", "Strange Noises From Below", { a: "Frontier Village" });
q(S, "Q170", "Pollen Orb Ingredients", { a: "Frontier Village" });
q(S, "Q171", "A Worried Bug Lover", { a: "Frontier Village" });
q(S, "Q172", "A Musical Genius", { a: "Frontier Village" });
q(S, "Q173", "Things That Hum", { a: "Frontier Village" });
q(S, "Q174", "Things That Rumble", { a: "Frontier Village" });
q(S, "Q175", "Secret Innovation", { a: "Frontier Village" });
q(S, "Q176", "Disinsectization", { a: "Frontier Village" });
q(S, "Q177", "Kind Lupa's Grampypon", { a: "Frontier Village" });
q(S, "Q178", "Secret Elixir Ingredients", { a: "Frontier Village" });
q(S, "Q179", "Challenge 2", { a: "Frontier Village" });
um(S, "UM38", "Breezy Zolos", 37, { a: "Makna Forest" });
q(S, "Q180", "Defend Colony 6 – Mechon", { a: "Colony 6" });
q(S, "Q181", "A Gutsy Trader", { a: "Colony 6" });
q(S, "Q182", "Paola and Narine", { a: "Colony 9" });
q(S, "Q183", "Liliana's Sincere Request", { a: "Colony 9" });
um(S, "UM39", "Gentle Rodriguez", 40, { a: "Colony 9" });
um(S, "UM40a", "Gentle Mother Armu", 37, { a: "Colony 9" });
um(S, "UM40b", "Impenetrable Redrob", 38, { a: "Colony 9" });
um(S, "UM41", "Roguish Frengel", 39, { a: "Colony 9" });
um(S, "UM42", "Shadeless Matrix", 44, { a: "Colony 9" });
um(S, "UM43", "Reckless Godwin", 31, { a: "Satorl Marsh" });
q(S, "Q184a", "A Big Brother's Fight", { a: "Colony 9", x: "A Little Brother's Fight" });
q(S, "Q184b", "A Little Brother's Fight", { a: "Colony 9", x: "A Big Brother's Fight", note: "Guide pick: Zukazu (Q184a)." });
q(S, "Q185a", "A Place To Come Home To", { a: "Colony 9" });
q(S, "Q185b", "Thawing Relations", { a: "Colony 9" });
q(S, "Q186", "A Young Captain's Challenge", { a: "Colony 9", note: "Guide leans Nopon Claymore (slightly better area affinity)." });
hth(S, "HTH7b", "No Boys Allowed", "Melia/Sharla", { a: "Makna Forest" });
c6(S, "Colony 6 — Housing Lv. 2", "Bunnia Scent Wood x4, Fossil Monkey x1");
c6(S, "Colony 6 — Commerce Lv. 2", "Hode Plank x3, Ready Coil x2");
c6(S, "Colony 6 — Nature Lv. 2", "Quadwing Bag x2, Empress Beetle x3");
// 4.15 ----------------------------------------------------------------
S = sec("4.15", "Eryth Sea", "Eryth Sea");
um(S, "UM44", "Turbulent Belmo", 36, { a: "Eryth Sea" });
hth(S, "HTH8b", "Flowers Of Eryth Sea", "Sharla/Riki", { aff: "Green", a: "Eryth Sea" });
// 4.16 ----------------------------------------------------------------
S = sec("4.16", "Alcamoth", "Alcamoth");
q(S, "Q187", "Save the Worker", { a: "Alcamoth", story: true });
// 4.17 ----------------------------------------------------------------
S = sec("4.17", "Dungeon II: High Entia Tomb", "High Entia Tomb");
um(S, "UM45", "Calm Anzabi", 38, { a: "High Entia Tomb" });
// 4.18 ----------------------------------------------------------------
S = sec("4.18", "Dungeon III: Prison Island & Approach", "Prison Island / Eryth Sea", { notes: ["No collectables/unique monsters on this first visit."] });
q(S, "Q188", "Path to Prison Island", { a: "Eryth Sea", story: true });
q(S, "Q189", "Sister Seals", { a: "Eryth Sea", story: true });
um(S, "UM46", "Subterranean Zomar", 40, { a: "Eryth Sea" });
um(S, "UM47", "Cumulus Danaemos", 41, { a: "Eryth Sea" });
// 4.19 ----------------------------------------------------------------
S = sec("4.19", "Mid-Game Loose Ends", "Colony 6 / Alcamoth / Makna",
  { notes: ["⚠ Get Melia's Imperial Staff from Kallian at Ascension Hall (her best non-endgame weapon)."] });
q(S, "Q190", "Bridge Repair", { a: "Makna Forest" });
c6(S, "Colony 6 — Housing Lv. 3", "Eks Iron Heart x1, Sturdy Armour x4, Oil Branch x2");
c6(S, "Colony 6 — Commerce Lv. 3", "Shiny Kromar Hide x3, Slick Kromar Stone x3, Blue Ladybird x2");
c6(S, "Colony 6 — Special Lv. 2", "Dust Element x2, Sea Berry x3");
// 4.20 ----------------------------------------------------------------
S = sec("4.20", "Alcamoth & Eryth Sea Errata", "Alcamoth / Eryth Sea", { locksAt: "ponr-mechonis-core",
  notes: ["⚠ Almost everything here is ⏱ TIMED — these quests are permanently FORFEIT at a later-game point of no return. Clear them all now."] });
q(S, "Q191a", "Monster Quest 1 (Eryth Sea)", { a: "Eryth Sea", t: true });
q(S, "Q192", "Monster Quest 2 (Eryth Sea)", { a: "Eryth Sea", t: true });
q(S, "Q193", "Challenge (Eryth Sea)", { a: "Eryth Sea", t: true });
um(S, "UM48", "Flabbergasted Gerome", 38, { a: "Eryth Sea" });
q(S, "Q194", "Collect Quest 1 (Eryth Sea)", { a: "Eryth Sea", t: true });
q(S, "Q195", "Collect Quest 2 (Eryth Sea)", { a: "Eryth Sea", t: true });
q(S, "Q196", "Trouble At The Plant", { a: "Eryth Sea", t: true });
q(S, "Q197", "Punish the Hodes", { a: "Eryth Sea", t: true });
um(S, "UM49", "Funeral Gorza", 42, { a: "Eryth Sea" });
q(S, "Q198", "Mend the Plant", { a: "Eryth Sea", t: true });
q(S, "Q199", "Hode Attack", { a: "Eryth Sea", t: true });
q(S, "Q200", "Trouble At The Lighthouse", { a: "Eryth Sea", t: true });
q(S, "Q201", "Material Quest 4 (Alcamoth)", { a: "Alcamoth", t: true });
q(S, "Q202", "Monster Quest 1: Part 1 (Alcamoth)", { a: "Alcamoth", t: true });
q(S, "Q203", "Monster Quest 1: Part 2", { a: "Alcamoth", t: true });
q(S, "Q204", "Monster Quest 1: Part 3", { a: "Alcamoth", t: true });
q(S, "Q205", "Monster Quest 2: Part 1", { a: "Alcamoth", t: true });
q(S, "Q206", "Monster Quest 2: Part 2", { a: "Alcamoth", t: true });
q(S, "Q207", "Monster Quest 2: Part 3", { a: "Alcamoth", t: true });
q(S, "Q208", "Monster Quest 3: Part 1", { a: "Alcamoth", t: true });
q(S, "Q209", "Monster Quest 3: Part 2", { a: "Alcamoth", t: true });
q(S, "Q210", "Monster Quest 3: Part 3", { a: "Alcamoth", t: true });
q(S, "Q211", "Monster Quest 4: Part 1", { a: "Alcamoth", t: true });
q(S, "Q212", "Monster Quest 4: Part 2", { a: "Alcamoth", t: true });
q(S, "Q213", "Monster Quest 4: Part 3", { a: "Alcamoth", t: true });
q(S, "Q214", "Challenge 1 (Alcamoth)", { a: "Alcamoth", t: true });
um(S, "UM50", "Proper Bandaz", 39, { a: "Eryth Sea" });
q(S, "Q215", "Challenge 2", { a: "Alcamoth", t: true });
um(S, "UM51", "Tempestuous Edegia", 39, { a: "Eryth Sea" });
q(S, "Q216", "Challenge 3", { a: "Alcamoth", t: true });
um(S, "UM52", "Peeling Kircheis", 38, { a: "Eryth Sea" });
q(S, "Q217", "Challenge 4", { a: "Alcamoth", t: true });
um(S, "UM53", "Lightspeed Sonid", 44, { a: "Eryth Sea" });
q(S, "Q218", "Search Quest 3", { a: "Alcamoth", t: true });
q(S, "Q219", "Search Quest 1", { a: "Alcamoth", t: true });
q(S, "Q220", "Search Quest 2", { a: "Alcamoth", t: true });
q(S, "Q221", "Search Quest 4", { a: "Alcamoth", t: true });
q(S, "Q222", "Collection Quest 1", { a: "Alcamoth", t: true });
q(S, "Q223", "Collection Quest 2", { a: "Alcamoth", t: true });
q(S, "Q224", "Collection Quest 3", { a: "Alcamoth", t: true });
q(S, "Q225", "Collection Quest 4", { a: "Alcamoth", t: true });
q(S, "Q226", "Material Quest 1", { a: "Alcamoth", t: true });
q(S, "Q227", "Material Quest 2", { a: "Alcamoth", t: true });
q(S, "Q228", "Material Quest 3", { a: "Alcamoth", t: true });
q(S, "Q229", "Looking For A Lost Son", { a: "Alcamoth", t: true });
q(S, "Q230", "Looking For A Lost Daughter", { a: "Alcamoth", t: true });
q(S, "Q231", "Looking For Gold Bugs", { a: "Alcamoth", t: true });
q(S, "Q232", "Back Pain", { a: "Alcamoth", t: true });
q(S, "Q233", "Bring Back My Son!", { a: "Alcamoth", t: true });
q(S, "Q234", "The Deciphering Machine", { a: "Alcamoth", t: true });
q(S, "Q235", "How Do They Feel?", { a: "Alcamoth", t: true });
q(S, "Q236", "How Do I Feel?", { a: "Alcamoth", t: true, note: "Guide pick: speak to Rozael first." });
q(S, "Q237a", "Together Forever", { a: "Alcamoth", t: true, x: "I Love You No Matter What" });
q(S, "Q237b", "I Love You No Matter What", { a: "Alcamoth", t: true, x: "Together Forever" });
q(S, "Q238", "A Friend In Need", { a: "Alcamoth", t: true });
q(S, "Q239", "Preparing For Adventure", { a: "Alcamoth", t: true });
q(S, "Q240", "Preparing For Adventure 2", { a: "Alcamoth", t: true });
q(S, "Q241", "Preparing For Adventure 3", { a: "Alcamoth", t: true });
um(S, "UM54", "Lakebed Orthlus", 40, { a: "Colony 9", note: "Does NOT respawn." });
q(S, "Q242", "Losing The Taste For Alcohol", { a: "Alcamoth", t: true });
q(S, "Q243", "Going Out To Play", { a: "Alcamoth", t: true });
q(S, "Q244", "A Necessary Upgrade", { a: "Alcamoth", t: true });
q(S, "Q245", "Talia's Research", { a: "Alcamoth", t: true, x: "Investigating Satorl", note: "Guide pick: Talia's Research (only this one benefits the affinity chart)." });
q(S, "Q246", "Teaching Materials", { a: "Alcamoth", t: true });
q(S, "Q247", "Brave Actions", { a: "Alcamoth", t: true });
q(S, "Q248", "Protect the Capital!", { a: "Alcamoth", t: true });
q(S, "Q249", "Starlight Seeker", { a: "Alcamoth", t: true });
q(S, "Q250", "Starlight Gazer", { a: "Alcamoth", t: true });
hth(S, "HTH9", "True Natures", "Melia/Dunban", { aff: "Green", a: "Alcamoth" });
hth(S, "HTH10", "Mysterious Sanctuary", "Riki/Melia", { aff: "Green", a: "Frontier Village" });
hth(S, "HTH11", "Echoes Of Ancient Times", "Reyn/Melia", { aff: "Green", a: "High Entia Tomb" });
hth(S, "HTH12", "Ancient Astrology", "(pair)", { aff: "Purple", a: "Alcamoth" });
// 4.21 ----------------------------------------------------------------
S = sec("4.21", "Valak Mountain", "Valak Mountain");
q(S, "Q251", "Monster Quest 1", { a: "Valak Mountain" });
q(S, "Q252", "Monster Quest 2", { a: "Valak Mountain" });
q(S, "Q253", "Monster Quest 3", { a: "Valak Mountain" });
q(S, "Q254", "Monster Quest 4", { a: "Valak Mountain" });
um(S, "UM55", "Vague Barabas", 46, { a: "Valak Mountain" });
q(S, "Q255", "Chilkins and Antols", { a: "Valak Mountain" });
q(S, "Q256", "Valak Mountain Research", { a: "Valak Mountain" });
q(S, "Q257", "The Magma Rock", { a: "Valak Mountain", story: true });
um(S, "UM56", "Conflagrant Roxael", 45, { a: "Valak Mountain", note: "Story-quest only; no respawn." });
q(S, "Q258", "Bad Timing", { a: "Valak Mountain" });
q(S, "Q259", "The Freezing Nopon", { a: "Valak Mountain" });
q(S, "Q260", "Chilkin Changes", { a: "Valak Mountain" });
q(S, "Q261", "The Balance Of Power", { a: "Valak Mountain" });
um(S, "UM57", "Barbaric Sitiri", 47, { a: "Valak Mountain" });
um(S, "UM58", "Banquet Vassago", 48, { a: "Valak Mountain", note: "No respawn." });
um(S, "UM59a", "Glorious Buer", 45, { a: "Valak Mountain" });
um(S, "UM59b", "North Star Guison", 50, { a: "Valak Mountain" });
um(S, "UM60", "Agile Albartos", 47, { a: "Valak Mountain" });
um(S, "UM61", "Hidden Gagamin", 49, { a: "Valak Mountain" });
um(S, "UM62", "Moonlight Paimon", 46, { a: "Valak Mountain" });
// 4.22 ----------------------------------------------------------------
S = sec("4.22", "Mid-Game Errata", "Colony 6 / Frontier Village / Makna / Alcamoth");
c6(S, "Colony 6 — Nature Lv. 3", "Jagged Tail x3, Despair Clover x2, Ice Cabbage x3");
q(S, "Q262", "The Missing Lodger", { a: "Colony 6" });
q(S, "Q263a", "Weak Berryjammy", { a: "Colony 6" });
q(S, "Q263b", "Cursed Berryjammy", { a: "Colony 6" });
q(S, "Q264", "Obstinate Berryjammy", { a: "Colony 6" });
q(S, "Q265", "Looking For Freedom", { a: "Colony 6", note: "Guide pick: Pure Perfume (route A)." });
q(S, "Q266", "Cook-Off Counter Attack!", { a: "Colony 6" });
q(S, "Q267", "Cook-Off Comeback?", { a: "Colony 6" });
q(S, "Q268", "A Delectable Delicacy", { a: "Colony 6" });
q(S, "Q269", "Cook-Off Final Blow?!", { a: "Colony 6" });
q(S, "Q270", "Cook-Off Showdown", { a: "Colony 6", note: "Guide pick: route A ('Make food your customers like')." });
q(S, "Q271", "A Tantalizing Treat", { a: "Colony 6" });
q(S, "Q272", "Unstoppable Berryjammy", { a: "Colony 6", note: "Guide pick: Norara (route A)." });
q(S, "Q273", "Material Quest 3 (Frontier Village)", { a: "Frontier Village" });
q(S, "Q274", "Dadapon In Trouble", { a: "Frontier Village" });
q(S, "Q275", "Honoring The Nopon Sage", { a: "Frontier Village" });
q(S, "Q276", "Meeting The Nopon Sage", { a: "Frontier Village" });
q(S, "Q277", "Legend Of The Sage", { a: "Makna Forest" });
q(S, "Q278", "Challenge Of The Sage", { a: "Makna Forest" });
q(S, "Q279", "A Tormented Bug Lover", { a: "Frontier Village" });
q(S, "Q280a", "Medical Advancements", { a: "Frontier Village", x: "Let's Make Fillings!" });
q(S, "Q280b", "Let's Make Fillings!", { a: "Frontier Village", x: "Medical Advancements", note: "Affinity identical; guide picks Yusa (better drop rates)." });
q(S, "Q281a", "Reversed Tastes", { a: "Frontier Village" });
q(S, "Q281b", "World's Strongest Flavor", { a: "Frontier Village" });
q(S, "Q282", "Healing The Healer", { a: "Frontier Village" });
q(S, "Q283", "Legendary Nopon Charm", { a: "Frontier Village" });
q(S, "Q284", "Mislabelling Problem", { a: "Frontier Village" });
q(S, "Q285", "Getting Bigger", { a: "Frontier Village" });
q(S, "Q286", "Who Is Bigger?", { a: "Frontier Village", note: "Guide pick: Adidi (route A)." });
q(S, "Q287", "Avenge A Mamapon's Death", { a: "Frontier Village" });
q(S, "Q288", "It Definitely Exists!", { a: "Frontier Village" });
q(S, "Q289", "Giant Attack", { a: "Frontier Village" });
q(S, "Q290", "Mystery Of Makna Ruins 1", { a: "Frontier Village" });
q(S, "Q291", "Mystery Of Makna Ruins 2", { a: "Frontier Village" });
um(S, "UM63", "Brutal Gravar", 46, { a: "Makna Forest" });
q(S, "Q292", "Mystery Of Makna Ruins 3", { a: "Frontier Village" });
q(S, "Q293", "Mystery Of Makna Ruins 4", { a: "Frontier Village" });
q(S, "Q294", "Adventurers In Peril", { a: "Alcamoth", x: "The Missing Partner", note: "Mutually exclusive with 'The Missing Partner' (post-core). Only this version benefits the affinity chart." });
q(S, "Q295", "Building Bridges", { a: "Alcamoth" });
q(S, "Q296", "Believing Again", { a: "Alcamoth" });
q(S, "Q297", "Secret Ingredient Hunt", { a: "Frontier Village" });
q(S, "Q298", "The Master's Successor", { a: "Frontier Village", note: "Guide pick: Cherri." });
q(S, "Q299", "Dangerous Ambition", { a: "Frontier Village" });
q(S, "Q300", "Find The Kingpin", { a: "Frontier Village" });
q(S, "Q301", "Adviser Hunt", { a: "Frontier Village" });
q(S, "Q302", "Gather Information", { a: "Satorl Marsh" });
q(S, "Q303", "Evidence Collection", { a: "Frontier Village" });
q(S, "Q304", "Destroying The City Trade", { a: "Frontier Village" });
q(S, "Q305", "Getting A Member's Card", { a: "Alcamoth" });
q(S, "Q306a", "Desirée's Apology", { a: "Colony 9" });
q(S, "Q306b", "Betty's Gift", { a: "Colony 9" });
q(S, "Q307", "Miss Sweetness Showdown!", { a: "Colony 6", x: "Miss Sweetness Showdown (other)", note: "Berryjammy vs Ma'crish — fully inconsequential, pick either." });
q(S, "Q308", "The Most Transparent Thing", { a: "Colony 6" });
q(S, "Q309", "Legend Of Mythical Empress", { a: "Bionis' Leg" });
hth(S, "HTH13", "Geography Lesson", "Shulk/Dunban", { aff: "Purple", a: "Bionis' Leg" });
hth(S, "HTH14", "Fallen Brethren", "Melia/Shulk", { aff: "Green", a: "Makna Forest" });
// 4.23 ----------------------------------------------------------------
S = sec("4.23", "Sword Valley", "Sword Valley", { locksAt: "ponr-mechonis-field",
  notes: ["⚠ Everything here LOCKS after the Mechonis Field boss (§4.26). Also grab 3 Red Frontier for Colony 6.", "Mischievous Nabreus (UM74) is deliberately deferred to §4.25 when you're strong enough — but still before the lockout."] });
q(S, "Q310", "Secure Dolgan Outpost", { a: "Sword Valley", t: true });
um(S, "UM64", "Prudent Purson", 49, { a: "Sword Valley" });
um(S, "UM65", "Benevolent Aim", 51, { a: "Sword Valley" });
um(S, "UM66", "Defective Ipos", 50, { a: "Sword Valley" });
q(S, "Q311", "Secure Enalda Control Base", { a: "Sword Valley", t: true });
um(S, "UM67", "Tranquil Morax", 50, { a: "Sword Valley" });
q(S, "Q312", "3rd Gate Front Line", { a: "Sword Valley", t: true });
um(S, "UM68", "Fate Labolas", 51, { a: "Sword Valley" });
q(S, "Q313", "Secure The Radio Tower", { a: "Sword Valley", t: true });
um(S, "UM69", "Lightning Ronove", 55, { a: "Sword Valley" });
um(S, "UM70", "Kamikaze Bune", 53, { a: "Sword Valley" });
// 4.24 ----------------------------------------------------------------
S = sec("4.24", "Dungeon IV: Galahad Fortress", "Galahad Fortress", { locksAt: "ponr-mechonis-field",
  notes: ["⚠ Locks with Sword Valley after the Mechonis Field boss. Grab 2 extra Art Core Coils for Colony 6."] });
q(S, "Q314", "Lift Battle", { a: "Galahad Fortress", story: true });
um(S, "UM71", "Precious Retrato", 53, { a: "Galahad Fortress" });
q(S, "Q315", "Supply Station Battle", { a: "Galahad Fortress", story: true });
q(S, "Q316", "Turbine Battle", { a: "Galahad Fortress", story: true });
um(S, "UM72", "Glacier Acon", 52, { a: "Galahad Fortress" });
um(S, "UM73", "Glorious Jurom", 55, { a: "Galahad Fortress" });
q(S, "Q317", "Fiora's Conviction", { a: "Galahad Fortress", story: true });
// 4.25 ----------------------------------------------------------------
S = sec("4.25", "The Fallen Arm", "Fallen Arm");
q(S, "Q318", "Reunion With Fiora", { a: "Fallen Arm", story: true });
q(S, "Q319", "We Made It", { a: "Fallen Arm", story: true });
um(S, "UM74", "Mischievous Nabreus", 57, { a: "Sword Valley", miss: true, note: "⚠ Last Sword Valley unique monster — kill before §4.26 boss locks Sword Valley." });
q(S, "Q320", "Fiora's Treatment", { a: "Fallen Arm", story: true });
q(S, "Q321", "Mysterious Noises", { a: "Fallen Arm" });
q(S, "Q322", "Save The Machina!", { a: "Fallen Arm" });
q(S, "Q323", "Protect The Village", { a: "Fallen Arm" });
q(S, "Q324", "Stop The Mechon Rampage!", { a: "Fallen Arm" });
q(S, "Q325", "Fixing A Broken Door", { a: "Fallen Arm" });
q(S, "Q326", "The Wilted Flower", { a: "Fallen Arm" });
um(S, "UM75", "Affluent Beleth", 57, { a: "Fallen Arm" });
q(S, "Q327", "Eliminate the Threat", { a: "Fallen Arm" });
q(S, "Q328", "Food Delivery", { a: "Fallen Arm" });
q(S, "Q329", "The Oath Sword", { a: "Fallen Arm" });
q(S, "Q330", "I Want To Be A Homs!", { a: "Fallen Arm" });
q(S, "Q331", "Powerless", { a: "Fallen Arm" });
q(S, "Q332", "Power Up!", { a: "Fallen Arm" });
q(S, "Q333", "Scheduled Inspection", { a: "Fallen Arm" });
um(S, "UM76", "Evil Bathin", 54, { a: "Fallen Arm", note: "Quest-only." });
q(S, "Q334", "Therapy", { a: "Fallen Arm" });
q(S, "Q335", "For My Loved One…", { a: "Fallen Arm" });
q(S, "Q336", "To My Loved One…", { a: "Fallen Arm", note: "Deliver to Bozatrox on Mechonis Field (§4.26)." });
q(S, "Q337", "The History Of Mechonis", { a: "Fallen Arm", note: "Collect 4 Memory 925 Pieces on Mechonis Field (§4.26) before the Agniratha boss." });
q(S, "Q338", "Mending Memories", { a: "Fallen Arm" });
q(S, "Q339", "Resolution: Father", { a: "Fallen Arm" });
q(S, "Q340", "Resolution: Mother", { a: "Fallen Arm", note: "Needs Bronze Wood from Mechonis Field." });
q(S, "Q341", "Even In The Chief's Absence", { a: "Frontier Village" });
q(S, "Q342", "Bored Pelupelu", { a: "Frontier Village" });
q(S, "Q343", "A Gift For Miko", { a: "Frontier Village" });
q(S, "Q344", "A Tough Battle", { a: "Fallen Arm" });
um(S, "UM77b", "Prosperous Zepar", 56, { a: "Fallen Arm" });
um(S, "UM78b", "Aged Leraje", 45, { a: "Fallen Arm" });
um(S, "UM79b", "Splendid Botis", 58, { a: "Fallen Arm" });
hth(S, "HTH15", "At the Pollen Works", "Shulk/Riki", { aff: "Green", a: "Frontier Village" });
hth(S, "HTH16", "A Gift For A Loved One", "Dunban/Sharla", { aff: "Green", a: "Eryth Sea" });
hth(S, "HTH17", "Brother And Sister", "Dunban/Fiora", { aff: "Green", a: "Alcamoth" });
hth(S, "HTH18", "Just Like Old Times", "Shulk/Fiora", { aff: "Purple", a: "Fallen Arm" });
hth(S, "HTH19", "A Night-Time Chat", "Fiora/Sharla", { aff: "Purple", a: "Fallen Arm" });
// 4.26 ----------------------------------------------------------------
S = sec("4.26", "Dungeon V: Mechonis Field", "Mechonis Field", { locksAt: "ponr-agniratha",
  ponrTrigger: "ponr-mechonis-field",
  notes: ["⚠ The boss here is the PONR that permanently locks Sword Valley & Galahad Fortress.", "⚠ Mechonis Field itself locks after the Agniratha boss (§4.28). Grab extras: 3 Energy Aubergine, 2 Retro Diode, 2 Mossy Panel, 2 Azure Hollyhock for Colony 6."] });
um(S, "UM77", "Destroyer Salvacion", 59, { a: "Mechonis Field" });
um(S, "UM78", "Amorous Arca", 57, { a: "Mechonis Field" });
q(S, "Q345", "Aiming For The Top", { a: "Mechonis Field", story: true });
q(S, "Q346", "Get the 3rd Lift Moving", { a: "Mechonis Field", story: true });
q(S, "Q347", "Opening The Bulkhead", { a: "Mechonis Field", story: true });
q(S, "Q348", "Best Boots", { a: "Mechonis Field" });
q(S, "Q349", "Monster Quest", { a: "Mechonis Field" });
q(S, "Q350", "Challenge Quest 1", { a: "Mechonis Field" });
um(S, "UM79", "Infernal Crocell", 58, { a: "Mechonis Field" });
q(S, "Q351", "Challenge Quest 2", { a: "Mechonis Field" });
um(S, "UM80", "Revolutionary Bifrons", 60, { a: "Mechonis Field" });
q(S, "Q352", "The High-Velocity Lift", { a: "Mechonis Field", story: true });
q(S, "Q353", "Need Power!", { a: "Mechonis Field", story: true });
um(S, "UM81", "Commander Oracion", 61, { a: "Mechonis Field" });
q(S, "Q357", "A Weapon Just For Me", { a: "Fallen Arm", note: "Needs Advanced Frames from Central Factory (§4.27)." });
c6(S, "Colony 6 — Housing Lv. 4", "Ponio Hoof Seal x5, Royal Volff Hide x3, Warning Lamp x3, Retro Diode x2");
c6(S, "Colony 6 — Commerce Lv. 4", "Piranhax Fishmeal x5, Silver Antol Fibre x8, Sour Turnip x3, Mossy Panel x2");
c6(S, "Colony 6 — Special Lv. 3", "Squall Element x2, Snow Element x2, Lemonade Sky x3");
q(S, "Q354", "Defend Colony 6: Elite", { a: "Colony 6" });
q(S, "Q355b", "Odd Smoke: Investigation", { a: "Colony 6" });
q(S, "Q356", "Odd Smoke: Resolution", { a: "Colony 6" });
// 4.27 ----------------------------------------------------------------
S = sec("4.27", "Dungeon VI: Central Factory", "Central Factory", { locksAt: "ponr-mechonis-core",
  notes: ["⚠ Central Factory becomes permanent-lock after the Mechonis Core (last chance is the §4.30 approach). Grab 2 extra Black Styrene + 2 extra Angel Engine X for Colony 6."] });
q(S, "Q355", "To The Central Tower", { a: "Central Factory", story: true });
um(S, "UM82", "Mild Florence", 58, { a: "Central Factory" });
um(S, "UM83", "Faithful Lancelot", 59, { a: "Central Factory" });
q(S, "Q356b", "Maintenance Wing Escape", { a: "Central Factory", story: true });
q(S, "Q357b", "Eliminate the Backup!", { a: "Central Factory" });
um(S, "UM84", "Beautiful Vagul", 60, { a: "Central Factory" });
um(S, "UM85", "Temporal Gawain", 65, { a: "Central Factory" });
q(S, "Q358", "Find A Path To The Top", { a: "Central Factory", story: true });
q(S, "Q359", "Materials For A Bomb", { a: "Central Factory", story: true });
q(S, "Q360", "Roof Battle", { a: "Central Factory" });
um(S, "UM86", "Venerable Focalor", 64, { a: "Central Factory" });
um(S, "UM87", "Synchronized Gaheris", 61, { a: "Central Factory", note: "Try for Fiora's Ether Drain art book." });
q(S, "Q361", "Daring Assault", { a: "Central Factory" });
q(S, "Q362", "The Central Tower Barrier", { a: "Central Factory", story: true });
um(S, "UM88", "Sinful Lamorak", 63, { a: "Central Factory" });
um(S, "UM89", "Balanced Palamedes", 62, { a: "Central Factory" });
um(S, "UM90", "Majestic Mordred", 70, { a: "Central Factory" });
// 4.28 ----------------------------------------------------------------
S = sec("4.28", "Dungeon VII: Agniratha", "Agniratha", { locksAt: "ponr-agniratha",
  ponrTrigger: "ponr-agniratha",
  notes: ["⚠ The boss here is the PONR that locks Mechonis Field AND Agniratha forever.", "⚠ DO NOT activate the four Pillar verification devices until everything is done. Grab 1 Fortune Feather, 2 Lewisia Silver, 3 Blue Light Amp for Colony 6."] });
q(S, "Q363", "Shrine Transporter", { a: "Agniratha", story: true });
q(S, "Q364", "Pillar Verification Devices", { a: "Agniratha", story: true });
q(S, "Q365", "Civil Protection 2-1", { a: "Agniratha" });
q(S, "Q366", "Civil Protection 2-2", { a: "Agniratha" });
q(S, "Q367", "Civil Protection 2-3", { a: "Agniratha" });
q(S, "Q368", "Civil Protection 1-1", { a: "Agniratha" });
q(S, "Q369", "Civil Protection 1-2", { a: "Agniratha" });
q(S, "Q370", "Civil Protection 1-3", { a: "Agniratha" });
q(S, "Q371", "Military Status 2-1", { a: "Agniratha" });
q(S, "Q372", "Military Status 2-2", { a: "Agniratha" });
q(S, "Q373", "Military Status 1-1", { a: "Agniratha" });
q(S, "Q374", "Military Status 1-2", { a: "Agniratha" });
q(S, "Q375", "Strategic Investigation 1", { a: "Agniratha" });
q(S, "Q376", "Agniratha Beautification 1", { a: "Agniratha" });
q(S, "Q377", "Agniratha Beautification 2", { a: "Agniratha" });
q(S, "Q378", "The History Of The Capital", { a: "Fallen Arm" });
q(S, "Q379", "Telethia Investigation 2", { a: "Agniratha" });
um(S, "UM91", "Experienced Tristan", 64, { a: "Agniratha" });
um(S, "UM92", "Meditative Varla", 65, { a: "Agniratha" });
um(S, "UM93", "Wise Gremory", 68, { a: "Agniratha" });
um(S, "UM94", "Soothed Aglovale", 65, { a: "Agniratha" });
um(S, "UM95", "Sentimental Flamral", 66, { a: "Agniratha" });
um(S, "UM96", "Wrathful Orobas", 67, { a: "Agniratha" });
um(S, "UM97", "Vagabond Allocer", 63, { a: "Agniratha" });
um(S, "UM98", "Destructive Bors", 64, { a: "Agniratha" });
// 4.29 ----------------------------------------------------------------
S = sec("4.29", "Pre-Core Preparation", "Colony 6 / Colony 9 / Frontier Village", { locksAt: "ponr-mechonis-core",
  notes: ["⚠ Complete everything not requiring the Core. After §4.31: Central Factory permanent-locked, Prison Island temp, Alcamoth quick-travel off + full High Entia gone, Eryth/Alcamoth timed quests forfeit."] });
c6(S, "Colony 6 — Housing Lv. 5", "Vang Star Wing x2, Gogol Horn x3, Red Frontier x2, Black Styrene x2, Rainbow Zirconia x3");
c6(S, "Colony 6 — Nature Lv. 4", "Caterpile Silk x3, Hox Daylight Spur x3, Oil Oyster x3, White Plum x3");
q(S, "Q380", "In Pursuit Of Love", { a: "Colony 6" });
q(S, "Q381a", "Melody Of Happiness", { a: "Colony 6", x: "Dream Of A Poet" });
q(S, "Q381b", "Dream Of A Poet", { a: "Colony 6", x: "Melody Of Happiness", note: "Purely personal — same final affinity." });
q(S, "Q382", "Family Secrets", { a: "Colony 6" });
q(S, "Q383", "Betrothal Tests", { a: "Colony 6" });
q(S, "Q384", "Miss Sweetness' Gratitude", { a: "Colony 6" });
q(S, "Q385", "A Final Sweet Favor", { a: "Colony 6" });
hth(S, "HTH21", "Strength Of Heart", "Shulk/Dunban", { aff: "Pink", a: "Colony 6" });
hth(S, "HTH22", "Recovery And Reflection", "Dunban/Fiora", { aff: "Purple", a: "Colony 6" });
hth(S, "HTH23", "A Snowy Hot Spring", "Shulk/Riki", { aff: "Purple", a: "Colony 6" });
// 4.30 ----------------------------------------------------------------
S = sec("4.30", "Mechonis Core Approach", "Central Factory", { locksAt: "ponr-mechonis-core",
  notes: ["⚠ LAST chance for Central Factory. Quick-travel disabled throughout the approach."] });
q(S, "Q386", "New Weapon For Fiora", { a: "Central Factory", story: true, note: "⚠ One-time only — do it now or never." });
// 4.31 ----------------------------------------------------------------
S = sec("4.31", "Dungeon VIII: Mechonis Core", "Mechonis Core", { ponrTrigger: "ponr-mechonis-core",
  notes: ["⚠ MAJOR POINT OF NO RETURN — see the locks listed on this point of no return."] });
q(S, "Q387", "Save Bionis", { a: "Mechonis Core", story: true });
// 4.32 ----------------------------------------------------------------
S = sec("4.32", "Post-Core Non-Regional Errata", "Various");
c6(S, "Colony 6 — Commerce Lv. 5", "Ocean Elixir Of Life x1, Ancient Sardi Meat x4, Art Core Coil x2, Fortune Feather x1, Hill Firefly x4");
q(S, "Q388", "Defend Colony 6: Ancient", { a: "Colony 6" });
q(S, "Q389", "Nic's Training", { a: "Colony 6" });
um(S, "UM99", "Canyon Valencia", 78, { a: "Bionis' Leg" });
q(S, "Q390", "Stopping The Elopement", { a: "Colony 6" });
q(S, "Q391", "Stunted Growth", { a: "Fallen Arm" });
q(S, "Q392", "Transmission Bypass", { a: "Fallen Arm" });
q(S, "Q393", "The Exhaust Pump", { a: "Fallen Arm" });
q(S, "Q394", "The Mini-Reactor", { a: "Fallen Arm" });
q(S, "Q395", "A Dauntless Trader", { a: "Colony 6" });
q(S, "Q396", "Melancholy Tyrea", { a: "Colony 6" });
q(S, "Q397", "For A Friend", { a: "Satorl Marsh" });
q(S, "Q398", "Bana The Betrayer", { a: "Frontier Village" });
um(S, "UM100", "Frenzied Bana", 78, { a: "Frontier Village", note: "Quest-only." });
q(S, "Q399a", "A Young Captain's Revival", { a: "Colony 9" });
q(S, "Q399b", "A Young Captain's Trust", { a: "Colony 9" });
q(S, "Q400", "Birthday Shoes", { a: "Colony 9" });
q(S, "Q401", "The Elite Captain's Anguish", { a: "Colony 9", note: "Guide pick: Minnie." });
q(S, "Q402", "Getting To Know Dorothy", { a: "Colony 9" });
q(S, "Q403", "Getting To Know Minnie", { a: "Colony 9" });
q(S, "Q404", "A Token Of Friendship", { a: "Colony 9" });
q(S, "Q405", "The Missing Partner", { a: "Valak Mountain", x: "Adventurers In Peril", note: "Only available if you did NOT do 'Adventurers in Peril'. No affinity benefit — guide says do Adventurers instead." });
q(S, "Q406a", "Homs Determination", { a: "Colony 6" });
q(S, "Q406b", "Nopon Determination", { a: "Colony 6" });
um(S, "UM101", "Territorial Rotbart", 81, { a: "Bionis' Leg" });
q(S, "Q407", "The Missing Boy", { a: "Eryth Sea" });
q(S, "Q408a", "Distilling Active Ingredients", { a: "Frontier Village" });
q(S, "Q408b", "Safer Energy", { a: "Frontier Village" });
q(S, "Q409", "Presents For Priceless Pupils", { a: "Frontier Village" });
um(S, "UM102", "Flailing Bracken", 73, { a: "Colony 9" });
um(S, "UM103", "Armored Rockwell", 82, { a: "Bionis' Leg" });
um(S, "UM104", "Mysterious Barnaby", 85, { a: "Bionis' Leg" });
um(S, "UM105a", "Field Altrich", 76, { a: "Bionis' Leg" });
um(S, "UM105b", "Powerful Eligos", 80, { a: "Fallen Arm" });
q(S, "Q410", "Nic's Final Test", { a: "Colony 6" });
um(S, "UM106", "Indomitable Daulton", 85, { a: "Satorl Marsh" });
q(S, "Q411", "The Imperial Ceremony Offerings", { a: "Satorl Marsh" });
q(S, "Q412", "The Imperial Ceremony", { a: "Satorl Marsh" });
// 4.33 ----------------------------------------------------------------
S = sec("4.33", "Post-Core Tephra Cave", "Tephra Cave", { notes: ["Opens a new Tephra Cave area; high-level — quests/UMs deferred to §4.36."] });
// 4.34 ----------------------------------------------------------------
S = sec("4.34", "Dungeon IX: Bionis' Interior (Post-Core)", "Bionis' Interior");
um(S, "UM107", "Victorious Gross", 73, { a: "Bionis' Interior" });
um(S, "UM108", "Dark King Barbarus", 77, { a: "Bionis' Interior" });
um(S, "UM109", "Active Impulso", 72, { a: "Bionis' Interior" });
um(S, "UM110", "Clandestine Apety", 74, { a: "Bionis' Interior" });
um(S, "UM111", "Ghostly Mahatos", 76, { a: "Bionis' Interior" });
um(S, "UM112", "Mystical Klesedia", 72, { a: "Bionis' Interior" });
um(S, "UM113", "Vivid Anstan", 75, { a: "Bionis' Interior" });
um(S, "UM114", "Officer Robusto", 75, { a: "Bionis' Interior" });
// 4.35 ----------------------------------------------------------------
S = sec("4.35", "Dungeon X: Prison Island (Post-Core)", "Prison Island");
um(S, "UM115", "Ageless Moabit", 75, { a: "Prison Island" });
um(S, "UM116", "Serene Imlay", 76, { a: "Prison Island" });
q(S, "Q413", "Chase Dickson", { a: "Prison Island", story: true });
um(S, "UM117", "Cold Ageshu", 77, { a: "Prison Island" });
um(S, "UM118", "Inferno Heinrich", 76, { a: "Prison Island" });
um(S, "UM119", "Abnormal Clone Barg", 77, { a: "Prison Island" });
um(S, "UM120", "Majestic Clone Barg", 77, { a: "Prison Island" });
um(S, "UM121", "Fiendish Auburn", 78, { a: "Prison Island" });
q(S, "Q414", "Path To The Top", { a: "Prison Island", story: true, note: "Final-area story quest — leave undone until everything else is finished." });
// 4.36 ----------------------------------------------------------------
S = sec("4.36", "Post-Core Errata", "Various");
c6(S, "Colony 6 — Nature Lv. 5", "Ardun Elder Beard x3, Tokilos King Egg x1, Lewisia Silver x2, Black Liver Bean x2, Black Beetle x2");
c6(S, "Colony 6 — Special Lv. 4", "Flexible Selua Cell x3, Steel Selua Cell x3, Rainbow Slug x2, Azure Hollyhock x2");
c6(S, "Colony 6 — Special Lv. 5 (final)", "Inferno Element x2, Bolt Element x2, Blue Light Amp x3, Angel Engine X x2, Rabbit Diode x3");
q(S, "Q415", "Defend Colony 6: Demon", { a: "Colony 6", note: "Final Colony 6 surprise quest — completes the colony." });
q(S, "Q416", "A Maid's Concerns", { a: "Colony 6", x: "A Butler's Concerns" });
q(S, "Q417", "A Butler's Concerns", { a: "Colony 6", x: "A Maid's Concerns" });
q(S, "Q418", "Delivering The Undeliverable", { a: "Colony 6" });
q(S, "Q419", "Finding The Unfindable", { a: "Colony 6" });
q(S, "Q420", "Lifespan Of A Machina", { a: "Colony 6" });
q(S, "Q421", "A Poet's Concerns", { a: "Colony 6" });
q(S, "Q422", "Replica Monado 1", { a: "Bionis' Interior" });
q(S, "Q423", "Replica Monado 2", { a: "Bionis' Interior" });
q(S, "Q424", "Replica Monado 3", { a: "Bionis' Interior" });
q(S, "Q425", "Replica Monado 4", { a: "Bionis' Interior" });
q(S, "Q426", "Replica Monado 5", { a: "Bionis' Interior" });
q(S, "Q427", "Restoring The Capital", { a: "Frontier Village" });
q(S, "Q428", "Vidian Rescue Mission", { a: "Alcamoth" });
q(S, "Q429", "Restoring The Capital 2", { a: "Frontier Village" });
q(S, "Q430", "Broken Ether Furnace", { a: "Frontier Village" });
q(S, "Q431", "Broken Ether Furnace 2", { a: "Frontier Village" });
q(S, "Q432", "Friendship Tokens", { a: "Colony 9" });
q(S, "Q433", "A Merciful End", { a: "Satorl Marsh" });
q(S, "Q434", "A Memento Of Daddy", { a: "Frontier Village" });
q(S, "Q435", "Investigating Satorl", { a: "Eryth Sea", x: "Talia's Research", note: "Mutex with Talia's Research (already done) — no affinity benefit; record only." });
q(S, "Q436", "Ancient High Entia Mystery", { a: "Eryth Sea" });
q(S, "Q437", "A Release From Duty", { a: "Satorl Marsh" });
q(S, "Q438", "The Book Of Bafalgar", { a: "Tephra Cave" });
q(S, "Q439", "The Blood Of Bafalgar", { a: "Tephra Cave" });
um(S, "UM122", "Dazzling Tolsonia", 97, { a: "Tephra Cave", note: "Quest-only; no respawn. Grab Melia's Hypnotize art book." });
q(S, "Q440", "The Path Of Bafalgar", { a: "Tephra Cave" });
q(S, "Q441", "The Coffin Of Bafalgar", { a: "Tephra Cave" });
q(S, "Q442", "The Gratitude Of Bafalgar", { a: "Tephra Cave" });
q(S, "Q443", "Securing Provisions", { a: "Colony 6" });
um(S, "UM123", "Erratic Goliate", 97, { a: "Tephra Cave" });
q(S, "Q444", "Challenge (Satorl)", { a: "Satorl Marsh" });
um(S, "UM124", "Veteran Yotzel", 83, { a: "Satorl Marsh" });
q(S, "Q445", "Final Challenge Of The Sage", { a: "Makna Forest" });
um(S, "UM125", "Unreliable Rezno", 96, { a: "Makna Forest", note: "Quest-only." });
q(S, "Q446", "Supplies For Satorl", { a: "Bionis' Leg" });
q(S, "Q447", "Secret Research", { a: "Eryth Sea" });
um(S, "UM126", "Furious Jozan", 96, { a: "High Entia Tomb" });
q(S, "Q448a", "I Will Never Forget You", { a: "Eryth Sea" });
q(S, "Q448b", "The Only Thing I Can Do", { a: "Eryth Sea" });
q(S, "Q449", "The Final Giant's Ruins", { a: "Valak Mountain" });
q(S, "Q450", "The Giant's Treasures", { a: "Valak Mountain" });
q(S, "Q451", "A Flower For A Rose", { a: "Bionis' Leg" });
q(S, "Q452", "Battling Brutes", { a: "Bionis' Leg" });
um(S, "UM127", "Reckless Zanden", 98, { a: "Tephra Cave", note: "Quest-only; no respawn. Grab Dunban's Thunder art book." });
um(S, "UM128", "Firework Geldesia", 98, { a: "Tephra Cave", note: "Quest-only; no respawn. Grab Melia's Mind Blast art book." });
// 4.37 ----------------------------------------------------------------
S = sec("4.37", "Post-Core Loose Ends", "Various", { notes: ["Finish the affinity chart, mop up unique monsters, open the 6 High Entia Doors, finish the Collectopaedia (trades)."] });
um(S, "UM129", "Immovable Gonzalez", 90, { a: "Bionis' Leg" });
um(S, "UM130", "Eternal Palsedia", 91, { a: "Satorl Marsh" });
um(S, "UM131", "Clamorous Dablon", 92, { a: "Eryth Sea" });
um(S, "UM132", "Bizarre Ragouel", 88, { a: "Eryth Sea" });
um(S, "UM133", "Sacred Zagamei", 89, { a: "Eryth Sea" });
um(S, "UM134", "Stormy Belganon", 87, { a: "Eryth Sea" });
um(S, "UM135", "Wandering Amon", 98, { a: "Valak Mountain" });
um(S, "UM136", "Exposure Wolfol", 97, { a: "Valak Mountain" });
um(S, "UM137", "Wicked Sallos", 95, { a: "Fallen Arm" });
um(S, "UM138", "Protective Torquidon", 96, { a: "Tephra Cave" });
um(S, "UM139", "Musical Vanflare", 93, { a: "Tephra Cave" });
um(S, "UM140", "Plump Sprahda", 92, { a: "Tephra Cave" });
um(S, "UM141", "Judicious Bunnitzol", 94, { a: "Tephra Cave" });
um(S, "UM142", "Reckless Galdon", 95, { a: "Tephra Cave" });
um(S, "UM143", "Deadly Medorlo", 93, { a: "Eryth Sea" });
um(S, "UM144", "Masterful Gigapur", 77, { a: "Prison Island" });
um(S, "UM145", "Illustrious Golteus", 98, { a: "Makna Forest", note: "Only source of Riki's 'Behave' art book — use a save state." });
um(S, "UM146", "Magnificent Diaglus", 99, { a: "Makna Forest" });
S.notes.push("High Entia Doors (6): Valak Mountain (La Luz Church), Eryth Sea x2 (Hode Refuge / Kromar Coast), High Entia Tomb x2 (Ceremony Hall / Imperial Treasury), Satorl Marsh (Sororal Statues lift).");
S.notes.push("Collectopaedia final trades: Minute Mantis (Sonia), Love Beetle (Lupa), Golden Cog (Oleksiy), Angel Engine Y (Rakzet), Thunder Compass (Jarak), Coin Of Fortune (Ma'crish), Love Source (Jer'ell — needs a Veritas Glyph from a superboss).");
// 4.38 ----------------------------------------------------------------
S = sec("4.38", "The Superbosses", "Various", { notes: ["Optional. All fought at night. Lv. 100–120."] });
um(S, "UM147", "Final Marcus", 100, { a: "Valak Mountain" });
um(S, "UM148", "Despotic Arsene", 108, { a: "Satorl Marsh" });
um(S, "UM149", "Blizzard Belgezas", 114, { a: "Valak Mountain" });
um(S, "UM150", "Ancient Daedala", 115, { a: "Fallen Arm" });
um(S, "UM151", "Avalanche Abaasy", 120, { a: "Valak Mountain", note: "Use the debuff-resist gem setup; drops the Veritas Glyph for Love Source." });
// 4.39 ----------------------------------------------------------------
S = sec("4.39", "The Remaining Heart-To-Hearts", "Various", { notes: ["These depend on party affinity, so the guide lists them together. 41 conversations (HTH24–64)."] });
[["HTH24","Fiora's Cooking","Reyn/Fiora","Colony 9"],["HTH25","Watching Over Them","Reyn/Dunban","Colony 9"],["HTH26","Overlooking The Colony","Reyn/Sharla","Colony 9"],["HTH27","Ancient Wreckage","Melia/Reyn","Colony 9"],["HTH28","A Heropon's Perspective","Sharla/Riki","Colony 9"],["HTH29","Heir To The Monado","Dunban/Reyn","Bionis' Leg"],["HTH30","Revisiting The Past","Dunban/Sharla","Bionis' Leg"],["HTH31","A Wistful Glow","Reyn/Sharla","Ether Mine"],["HTH32","High Entia History","Melia/Dunban","Satorl Marsh"],["HTH33","Atop The Crown Tree","Sharla/Riki","Satorl Marsh"],["HTH34","Riki's Crazy Plan","Riki/Reyn","Makna Forest"],["HTH35","The Legend Of The Spider","Shulk/Reyn","Tephra Cave"],["HTH36","A Scene Revisited","Fiora/Reyn","Tephra Cave"],["HTH37","Renewed Determination","Shulk/Reyn","Colony 6"],["HTH38","The Colony Reborn","Shulk/Sharla","Colony 6"],["HTH39","Quiet Time","Riki/Fiora","Colony 6"],["HTH40","Dunban's Right Arm","Dunban/Sharla","Colony 6"],["HTH41","Reawakened Memories","Sharla/Fiora","Frontier Village"],["HTH42","A Day Like Any Other","Melia/Fiora","Frontier Village"],["HTH43","Life's Hard For A Heropon","Riki/Dunban","Frontier Village"],["HTH44","Hopes And Plans","Shulk/Melia","High Entia Tomb"],["HTH45","Riki Have Question","Riki/Fiora","Eryth Sea"],["HTH46","Overcoming The Pain","Fiora/Melia","Fallen Arm"],["HTH47","Fiora's Body","Fiora/Sharla","Bionis' Interior"],["HTH48","Kind Words","Melia/Riki","Bionis' Interior"],["HTH49","Journey's End","Riki/Reyn","Prison Island"],["HTH50","Untold Feelings","Melia/Sharla","Prison Island"],["HTH51","The Final Battle","Shulk/Fiora","Prison Island"],["HTH52","Glowing In The Night","Riki/Dunban","Tephra Cave"],["HTH53","One Year On","Dunban/Reyn","Colony 6"],["HTH54","Fish fly! Fish fly!","Riki/Reyn","Eryth Sea"],["HTH55","So Close Yet So Far","Shulk/Melia","Alcamoth"],["HTH56","A Breathtaking Sight","Melia/Reyn","Alcamoth"],["HTH57","The Forefathers","Riki/Fiora","Alcamoth"],["HTH58","The Imperial Villa","Melia/Fiora","Alcamoth"],["HTH59","First Sight Of Snow","Fiora/Reyn","Valak Mountain"],["HTH60","In Ose Tower","Reyn/Riki","Valak Mountain"],["HTH61","Those Waiting For You","Shulk/Riki","Fallen Arm"],["HTH62","A Family Of Two","Fiora/Dunban","Fallen Arm"],["HTH63","Eternal Scars","Dunban/Melia","Fallen Arm"],["HTH64","Camping Spots","Melia/Riki","Fallen Arm"]].forEach(([c, n, ch, a]) => hth(S, c, n, ch, { a }));
S.notes.push("HTH35 'The Legend Of The Spider' — use the BAD choices once here to unlock the 'Heartbreaking' achievement.");
// 4.40 ----------------------------------------------------------------
S = sec("4.40", "The Endgame: Memory Space", "Prison Island / Memory Space", { ponrTrigger: "ponr-memory-space",
  notes: ["⚠ FINAL POINT OF NO RETURN — the Memory Space transporter. Finish everything first.", "⚠ Keep Shulk's Miqol replica Monado equipped during the final boss (it cannot be re-made, even in NG+). The True Monado you earn also cannot be duplicated."] });

// ---- merge per-item + per-section detail fields ----------------------------
let DETAILS = { items: {}, sections: {} };
try { DETAILS = require("./shulklink-details.js"); } catch (e) { console.warn("(no shulklink-details.js — base data only)"); }

// region reference for landmarks/locations (from the Game8-sourced areas dataset).
// A place name can exist in multiple regions, so we keep all candidates and pick
// section-aware (prefer the region(s) the current section is actually about).
const rnorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const REGION_OF = {};
(data.areas || []).forEach((a) => (a.sections.landmarks || []).forEach((i) => {
  if (!i.kind) return;
  const k = rnorm(i.label.replace(/^Galahad:\s*/, ""));
  (REGION_OF[k] = REGION_OF[k] || []); if (REGION_OF[k].indexOf(a.name) < 0) REGION_OF[k].push(a.name);
}));
const REGION_OVERRIDE = {
  "kelsher wetlands": "Satorl Marsh", "zaldandia falls": "Satorl Marsh", "place of judgement": "Satorl Marsh",
  "viliera hill": "Bionis' Leg", "sparkling pool": "Makna Forest", "hallow bone": "Valak Mountain",
  "archaeology center": "Frontier Village", "melifica road": "Alcamoth", "jacob s rock rest area": "Bionis' Leg"
};
const REGION_ORDER = ["Colony 9", "Tephra Cave", "Bionis' Leg", "Colony 6", "Ether Mine", "Satorl Marsh",
  "Bionis' Interior", "Makna Forest", "Frontier Village", "Eryth Sea", "Alcamoth", "High Entia Tomb",
  "Prison Island", "Valak Mountain"];
const regIdx = (r) => { const i = REGION_ORDER.indexOf(r); return i < 0 ? 998 : i; };
function regionOf(name, ctx) {
  const ov = REGION_OVERRIDE[rnorm(name)]; if (ov) return ov;
  const cands = REGION_OF[rnorm(name)] || [];
  if (cands.length <= 1) return cands[0] || null;
  const inCtx = cands.filter((c) => ctx.has(c));
  return (inCtx.length ? inCtx : cands).slice().sort((a, b) => regIdx(a) - regIdx(b))[0];
}

let enriched = 0;
sections.forEach((s) => {
  const sd = DETAILS.sections[s.id];
  if (sd) ["guide", "landmarks", "locations", "affinitySteps", "records", "trials", "notaBene"].forEach((k) => { if (sd[k]) s[k] = sd[k]; });
  [...s.quests, ...s.ums, ...s.hths].forEach((it) => {
    const d = DETAILS.items[s.id + ":" + it.code];
    if (d) { Object.assign(it, d); it.detailed = true; enriched++; }
    const key = s.id + ":" + it.code;
    if (DETAILS.defeats && DETAILS.defeats[key]) it.defeatsUM = DETAILS.defeats[key];
    if (DETAILS.affinity && DETAILS.affinity[key]) it.affinityChanges = DETAILS.affinity[key];
  });
  // make landmarks / locations / records / affinity steps checkable items (stable ids by index)
  // section context = the section's stated region(s) + the regions of its quests/UMs/HtH
  const ctx = new Set();
  String(s.region || "").split("/").forEach((x) => { const t = x.trim(); if (t) ctx.add(t); });
  [...s.quests, ...s.ums, ...s.hths].forEach((it) => { if (it.area) ctx.add(it.area); });
  s.landmarks = (s.landmarks || []).map((x, i) => ({ id: `wlm-${s.id}-${i}`, label: x, area: regionOf(x, ctx), missable: false, confidence: "high" }));
  s.locations = (s.locations || []).map((x, i) => ({ id: `wloc-${s.id}-${i}`, label: x, area: regionOf(x, ctx), missable: false, confidence: "high" }));
  s.records = (s.records || []).map((x, i) => ({ id: `wrec-${s.id}-${i}`, label: x, missable: false, confidence: "high" }));
  s.trials = (s.trials || []).map((x, i) => ({ id: `wtrial-${s.id}-${i}`, label: x, missable: false, confidence: "high" }));
  s.affinitySteps = (s.affinitySteps || []).map((x, i) => ({ id: `waff-${s.id}-${i}`, label: x, missable: false, confidence: "high" }));
  // route steps + their Nota-Bene sub-notes are checkable (ids by index)
  s.guide = (s.guide || []).map((g, i) => ({
    id: `wgs-${s.id}-${i}`,
    step: g.step,
    notes: (g.notes || []).map((n, j) => ({ id: `wgn-${s.id}-${i}-${j}`, text: n }))
  }));
});

// ---- story Parts (spoiler gates) -------------------------------------------
// Sections are pushed in chronological order, so we gate by their index range.
const ARCS = [
  { id: "arc1", part: 1, from: "4.1", to: "4.21",
    title: "Part 1 — Colony 9 → Valak Mountain",
    blurb: "The first ~third of the story: the opening through Prison Island (1st visit), reaching Valak Mountain." },
  { id: "arc2", part: 2, from: "4.22", to: "4.31",
    title: "Part 2", blurb: "The middle third — sealed to avoid spoilers. Reveal only when you're ready to continue past Valak Mountain." },
  { id: "arc3", part: 3, from: "4.32", to: "4.40",
    title: "Part 3", blurb: "The final third — sealed to avoid spoilers." }
];
const idxOf = (code) => sections.findIndex((s) => s.id === code);
ARCS.forEach((a) => { a._from = idxOf(a.from); a._to = idxOf(a.to); });
sections.forEach((s, i) => { s.arc = (ARCS.find((a) => i >= a._from && i <= a._to) || ARCS[ARCS.length - 1]).id; });
ARCS.forEach((a) => { delete a._from; delete a._to; });
data.arcs = ARCS;

// ---- attach + write ---------------------------------------------------------
data.pointsOfNoReturn = PONR;
data.walkthrough = sections;
data.meta.version = "0.5.1";
data.meta.sourceOfTruth = "ShulkLink0624 GameFAQs walkthrough (faqs/76615) — structure + factual data only, no prose. 40 chronological sections (4.1–4.40) with quest/UM/HTH numbering and 5 points of no return.";

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
const tot = sections.reduce((a, s) => a + s.quests.length + s.ums.length + s.hths.length + s.colony6.length, 0);
console.log(`Wrote ${FILE}\nSections: ${sections.length} | Quests: ${sections.reduce((a,s)=>a+s.quests.length,0)} | UMs: ${sections.reduce((a,s)=>a+s.ums.length,0)} | HTHs: ${sections.reduce((a,s)=>a+s.hths.length,0)} | Colony6: ${sections.reduce((a,s)=>a+s.colony6.length,0)} | total walkthrough items: ${tot}`);
console.log(`Detail-enriched items: ${enriched}`);
