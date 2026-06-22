/*
 * build-data.js — merges bulk full-completion data (Collectopaedia + landmarks
 * + Future Connected) into the curated missable spine in public/data/checklist.json.
 *
 * Idempotent: re-running replaces the bulk sections it manages (collectopaedia,
 * landmarks) and the FC areas, while leaving the hand-curated quests / unique
 * monsters / cutoffs / mutex pairs / achievements untouched.
 *
 * Source of bulk data: Game8 (Collectopaedia #290251; per-area map pages).
 * Run:  node tools/build-data.js
 */
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "public", "data", "checklist.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const slug = (s) => s.toLowerCase().replace(/['’.()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------- bulk data
const COLLECT = {
  "Colony 9": ["Sweet Wasabi","Cool Potato","Red Lettuce","Chewy Radish","Dance Apple","Black Kiwi","Strong Dandelion","Moon Flower","Dawn Hydrangea","Prairie Dragonfly","Giant Hornet","White Beetle","Sorrow Beetle","Blue Chain","Rabbit Diode","Plate Snow","Rainbow Zirconia"],
  "Tephra Cave": ["Clear Almond","Bright Fig","Dark Grape","Insanity Mint","Night Tulip","Shin Newt","Cave Rat","Shin Gecko","Happy Rabbit","Brown Butterfly","Gold Caterpillar","Rumble Stonefly","Kneecap Rock","Confusion Ivy","Clarity Moss","Leaf Mystery","Steel Silk"],
  "Bionis' Leg": ["Hot Taro","Juicy Broccoli","Spicy Cabbage","Hard Lotus","Sour Gouseberry","Red Durian","Walnut Grape","Humming Plum","White Ladybird","Hill Firefly","Moth Crawler","Queen Locust","Fire Tarantula","Mat Ice","Bluesky Bark","Pione Stone","Rusty Bolt","Winding Gear","Gold Dust Illusion","Devious Gravity","White Songbird","Death Bangle"],
  "Colony 6": ["Cute Orchid","Sirius Anemone","Spirit Clematis","Pyro Lizard","Amblygon Turtle","Dobercorgi","Verdant Eternity","White Night Rod"],
  "Ether Mine": ["Light Bat","Black Frog","Yellow Cat","Black Beetle","Rubber Mantis","Mystery Firefly","Charcoal Leg","Ether Pebble","Rumble Coal","Black Chip","Ready Coil","Love Crane","Fire Abron"],
  "Satorl Marsh": ["Blue Turnip","Cute Parsnip","Poisonous Gourd","Humming Cabbage","Sunflower Rogue","Merry Coronation","Ether Rose","Orb Daisy","Forget-You-Not","Chimera Rabbit","Venom Platypus","Humming Cat","Mist Tree","Lemon Stone","Feather Leaf","Water Log","Wool Rock","Blue Gear Shard","Rumble Part","Pauper's Cup","Happy Carnival","Dawn Dice"],
  "Bionis' Interior": ["Sarsaparilla","Black Liver Bean","Blood Worm","Azure Mouse","Happy Duck","Tap Tap Tap","High Entia Jewel"],
  "Makna Forest": ["Schorl Mushroom","Kelp Mushroom","Honey Rhubarb","Dark Mango","Pure Cherry","Bitter Kiwi","Juicy Grape","Enigma Lotus","Humming Nettle","Princess Daffodil","Black Iris","Ash Fox","Soft Sea Cucumber","Fossil Monkey","Venomous Lizard","Scarlet Ladybird","Shield Bug","Hades Beetle","Benign Cricket","Lemonade Sky","Forest of Gossip","Gravel Disk"],
  "Frontier Village": ["Spicy Nut","Crimson Citrus","Rainbow Bug","Empress Beetle","Rumble Box","Black Panel"],
  "Eryth Sea": ["Pink Asparagus","Tropical Radish","Dolphin Carrot","Gold Burdock","Sea Berry","Despair Clover","Doomsday Poppy","Night Lily","Razor Teasel","Sea Frog","Mane Cat","White Tail","Marine Marble","Oil Branch","Dilemma Rock","High Violet","Steel Hauyne"],
  "Alcamoth": ["Cool Lemon","Heart Peach","Mystic Dahlia","Stardrop","Ha Ha Ha","Thunder Atmos"],
  "High Entia Tomb": ["Green Earwig","Blue Ladybird","White Tube","Green Diode","Spiral Lamp","Tasty Sausage","Macro Passion"],
  "Valak Mountain": ["Sour Radish","Ice Cabbage","Girl Courgette","Amethyst Vanilla","Ether Plum","Fire Apple","Ruby Mangosteen","Sour Grape","Fortune Mallow","Black Peony","Fatal Belladonna","Wet Rat","Ice Monkey","Crystal Frog","Mud Squirrel","Gypsum Branch","Black Ash","Emerald Snow","Rabbit Stone","Broom Icicle","Frost Glass","Large Handcuffs"],
  "Sword Valley": ["Fire Pepper","Meaty Carrot","Bitter Broccoli","Bitter Melon","Citron Gooseberry","Juicy Melon","Amethyst Melon","Jujube Silver","Black Blossom","Abyss Heather","Delerium Foxglove","Gold Condenser","Purple Lamp","Crimson Gear","Red Frontier","Darkness Bottle","Bud of Eternity"],
  "Galahad Fortress": ["Wheel Lurker","Ultramarine Ant","Locust Spring","Art Core Coil","Tail Antenna","Hunger Crash","Splish Splash"],
  "Fallen Arm": ["Sour Turnip","Golden Beetroot","White Plum","Ice Kiwi Fruit","Spicy Papaya","Large Mango","Oil Oyster","Dark Fish","Ether Penguin","Rainbow Slug","Poisonous Coral","Poison Ivy","Amber Leaf","Warning Lamp","Digital Filament"],
  "Mechonis Field": ["Juicy Steakplant","Acerola Pea","Energy Aubergine","Sweet Pepper","Azure Hollyhock","Utopia Crocus","Scarlet Crawler","Shiny Scarab","Water Boatman","Ivy Nest","Mossy Panel","Bronze Wood","Retro Diode","Modern Blue Gear","Snow Transistor","Tweet Tweet","Flame Frame"],
  "Central Factory": ["Meaty Potato","Blue Root","Prism Centipede","Cable Mouse","Oil Fox","Dew Beetle","Glider Cockroach","White Styrene","Black Styrene","Blood Oil","Angel Engine X","Leaf Coil","Warrior Screw","Smoke Cylinder","Sacred Panther","Parts Noble"],
  "Agniratha": ["Juicy Blueberry","Sweet Lime","Spicy Banana","Lewisia Silver","Freesia Cyst","Bellflower Crystal","Electric Cricket","Scissor Bug","Missing Tree","Fortune Feather","Fancy Bolt","Blue Light Amp","Fairy Tale Diode","Grape Spring","Eryth Blue","Dramatic Night"],
  "Prison Island": ["Dry Lemon","Death Lychee","Hell Raspberry","Deadly Kiwi","Dancing Squirrel","Lightning Weasel","Angry Monkey","Señorita Scarab","Emperor Beetle","Absurd Branch","Insanity Moss","White Cover","Modern Resistor","Green Cam","Strong Screw","Blue Glow","Blue Blood"],
  "Bionis' Shoulder": ["Rainbow Carrot","High Leaf","Cream Wheat","Morrow Cob","Kilopumpkin","Angel Bream","Gentleclam","Sky Mole","Blade Bird","Palmtop Elephant","Half Part","Snare Wire","Subzero Steel","Blaze Chain","Congenial Cogs","Swirly Slash","Hero Nipper","Highlightning","Dubious Sculpture","Shimmertumble"],
  "Alcamoth (FC)": ["Cool Lemon","Heart Peach","Mystic Dahlia","Stardrop","Nanoceros","Mane Cat","Ha Ha Ha","Thunder Atmos"]
};

const LAND = {
  "Colony 9": { l: ["Gem Man's Stall","Mechon Wreckage Site","Main Entrance","Ether Light","Central Plaza","Fortress Entrance","Tranquil Square","Outlook Park","Tephra Cave Entrance","Cylinder Hangar"], loc: ["Commercial District","Military District","Weapon Dev Lab","Residential District","Anti-Air Battery 1","Anti-Air Battery 2","Anti-Air Battery 3","Tephra Hill","Cliff Lake","Agora Shore","Hazzai Cape","Dunban's House"] },
  "Tephra Cave": { l: ["Tephra Path","Mag Mell Ruins","Rear Entrance","Spring of Grief","Vilia Lake","Heavenly Window","Bafalgar Tomb","Leg Pass"], loc: ["Caterpile Nest","Warehouse 2","Escape Pod Bay","Tephra Cavern","Hidden Warehouse","Forgotten Cave","Emergency Warehouse","Soothsayer's Crypt","Prayer Room","Bone Corridor","Arachno Queen's Nest","Kneecap Hill","Trader's Stopover","Arachno Feeding Lair","Path of Absolution"] },
  "Bionis' Leg": { l: ["Raginar Canyon Path","Jabo Rock Rest Area","Kamos Guidepost","Refugee Camp","Raguel Bridge - South","Raguel Bridge - North","Spiral Valley","Zax Guidepost","Bask Cave Passage","Observation Platform","Believer's Paradise"], loc: ["Gaur Plain","Volff Lair","Rho Oasis","Tirkin Headquarters","Viliera Hilla","Sky Stage","Kisk Cave","Daksha Shrine","Raguel Lake","Tranquil Grotto","Maguel Road","Windy Cave","Crevasse Waterfall","Traveller's Rest","Kasharpa Falls"] },
  "Colony 6": { l: ["Reconstruction HQ","Supply Road","Watchpoint Junction","Drainage Outlet","Freight Road","Misty Path","Main Entrance"], loc: ["Splintered Path","Freight Elevator","Pod Depot","Hope Farm"] },
  "Ether Mine": { l: ["Drainage Tunnel","Drainage Control Room","Mining Base","Central Pit - Entrance","Personnel Lift 2","Freight Elevator","Glowmoss Lake","Regulation Piston","Personnel Lift 3","Central Pit - Base Level"], loc: ["Test Pit 1","Test Pit 2","Test Pit 3","Storage Depot","Central Terminal","Test Pit 4","Observation Point","Central Pit - Level 1","Central Pit - Level 2","Central Pit - Level 3"] },
  "Satorl Marsh": { l: ["Keshler Wetland","Nopon Merchant Camp","Crown Tree","Silent Obelisk","Glowing Obelisk","Sororal Statues","Statue Summit","Shining Pond"], loc: ["Lacus Swamp","Zaldania Waterfall","Poison Swamp","Altar of Fate","Barren Moor","Dark Swamp","Igna Territory","Exile Fortress","Nopon Refuge","Soter Ruins","Place of Judgment","Oath Sanctuary","Mauk Floodgate","Basin Cave"] },
  "Bionis' Interior": { l: ["Terminal Trachea","Interior Landing Site","Spinal Nerve Tower","Pars Sympathica Tower","Terminal Nerve Tower","Upper Trachea","Heart Entrance"], loc: ["Third Lung","First Lung","Vein Crossroad","Terminal Vein","Venous Plexus","Third Lung Bronchus","Second Lung","Aortic Pathway"] },
  "Makna Forest": { l: ["Makna Path","Agni Tablet","Waypoint Beacon","Lakeside","Nopon Arch","Twisted Tree Gate","Village Entrance","Windmill Pavilion","Glowmoss Trihenge","Pod Landing Site","Valak Pass","Divine Sanctuary","Seahorse Islet","King Agni's Tomb"], loc: ["Bridge One","Bridge Two","Bridge Three","Repaired Bridge Four","Great Makna Falls","Sap Cave","Contaminated Area","Eks Watering Hole","Clear Waterfall","Yellow Flower Grove","Decayed Forest","Abyss Basin","Precipice Bridge","Hode Lair"] },
  "Frontier Village": { l: ["Entry Bridge","Sacred Altar","Nopon Tower","Pollen Works","Riki's House","Chief's Residence","Prophecy Hut","Contemplation Terrace"], loc: ["Reservoir","Underground Store","Nopon Kitchen","Central Plaza","Kyn Shopping Street","Orb Storage Level","Pollen Orb Storehouse","Middle Housing level","Pollen Works Level","Archaeology Level","Archaeology Centre","Top Housing Level","Mysterious Sanctuary","Apex Lake"] },
  "Eryth Sea": { l: ["Latael Shore","Centre Gate","High Entia Tomb","Syrath Lighthouse","Central Seal Island","Soltnar Seal Island","Khatorl Seal Island","Ether Plant","Faras Cave"], loc: ["Hovering Reef 1","Showdown Cliff","Hovering Reef 2","Hovering Reef 3","Hovering Reef 4","Hovering Reef 5","Hovering Reef 6","Ether Crystal Deposit","Hovering Reef 7","Hovering Reef 8","Hovering Reef 9","Hovering Reef 10","Hode Refuge","Bionis' Occipital","Sleeping Dragon Isle","Kromar Coast","Secluded Island","Anu Shore"] },
  "Alcamoth": { l: ["Main Entrance","Fountain of Hope","Fountain of Eternity","Imperial Palace","Ascension Hall","Whitewing Palace","Imperial Villa"], loc: ["Melfica Road","Great Hall","Revelation Hall","Sky Terrace","Audience Chamber"] },
  "High Entia Tomb": { l: ["Tomb Approach","Sealed Chamber","Ceremony Hall","Tomb Robber Pool","Valley of Emperors","Tower of Trials - Bridge"], loc: ["Hall of Spirits","Hall of Trials","Telethia Laboratory","Imperial Treasury","Second Treasury"] },
  "Prison Island": { l: ["High Entia Transporter","Prison Gate","Prison Terrace"], loc: ["Central Hall","Great Canyon"] },
  "Valak Mountain": { l: ["Zokhed Pass","Mechonis Wound","Hollow Bone","Befalgar Pedestal","Three Sage Summit","Nopon Camp","Harict Chapel","Lava Cave","La Luz Church","Nofol Tower","Bionis' Wrist"], loc: ["Nagul Waterfall","Serik Waterfall","Apis Lair","Kana Peak","Agul Mountain Range","Bagnar Snowfield","Chilkin Lair","Url Crevasse","Bionis' Right Elbow","Valak Peak","Antol Den","Jakt Geyser","Sealed Tower","Ignia Hill","Great Glacier"] },
  "Sword Valley": { l: ["Bionis' Thumb","Supply Convoy","Ged Fortress","Dolgan Outpost","Enalda Control Base","Heavy Machine Depot","Control Tower","Radio Tower","Fortress Rear Entrance","Monado Wound"], loc: ["6th Gate","5th Gate","4th Gate","3rd Gate","Ether Storage Area","Port Access Pathway","Port Maintenance Bay"] },
  "Galahad Fortress": { l: ["Ether Influx Conduit","Main Control Room","Ether Blast Furnace","Preparation Bay","Fortress Depths"], loc: ["Main Maintenance Bay","1st Fuel Supply Room","2nd Fuel Supply Room","3rd Fuel Supply Room","1st Turbine Room","2nd Turbine Room","Blast Furnace Conduit","Piston Control Room","Ether Input Stream","Face Maintenance Bay"] },
  "Fallen Arm": { l: ["Wreckage Beach","Ulna Passage","Inlet Beach","Junks","Giant Mechon Debris","Black Wreckage","Connecting Bridge","Digit 2 Plain","Radiocarpea","Rotating Bulkhead","Distant Fingertip"], loc: ["Silver Wreckage","Zakt Spring","Jifum Beach","Transformer Area","5th Pulse Zone","Power Pipe Ruins","Radiocarpea Coast","Hidden Machina Village","Ether Light","Digit 1","Digit 1 Crevasse","Ether Exhaust System","Digit 5 Beach","Digit 5","Digit 4","Digit 3","Digit 2"] },
  "Mechonis Field": { l: ["Left Leg Cooling Outlet","GF Main Power Switch","1F Main Power Switch","3F Main Power Switch","Lower Bulkhead Bridge","Upper Bulkhead Bridge","4F Main Power Switch","Great Battle Scar","Machina Refuge","1st Zebrai Bulkhead","2nd Gamalt Bulkhead"], loc: ["1st Lift - GF","2nd Lift - GF","1st Lift - B1F","Spent Fuel Tank","2nd Lift - 1F","3rd Lift Engine Room","2F Observation Post","3rd Lift - 2F","Bulkhead Controls","3rd Lift - 3F","Ether Gear Store","Patella Exhaust","Power Supply Area 1","Power Supply Area 2","High-Velocity Lift"] },
  "Central Factory": { l: ["Port Terminal","Control Tower","Central Warehouse Lift","Factory Vent","Tower Boarding Gate","Regeneration Control","Agniratha Transporter","Ventilation Conduit","Bridge to Apocrypha"], loc: ["Central Gate","Landing Strip 1","Landing Strip 2","Maintenance Entrance 1","Maintenance Wing","Storage Depot","Central Lift","Training Ground Roof","Central Tower Lift","Large Mechon Store","Main Factory Gate","Mechon Factory","Central Tower Roof","Face Maintenance Bay","Apocrypha Generator"] },
  // Agniratha: locations came back corrupted (duplicate of Bionis' Leg) — keep landmarks only.
  "Agniratha": { l: ["Factory Transporter","Central Tower","1st Control Platform","4th Control Platform","Meyneth Statue","2nd Control Platform","3rd Control Platform","Shrine Transporter","Meyneth Shrine","Seven Sage Cloister"], loc: [], locNote: "Locations list unverified (source returned corrupted data) — check the in-game map %." }
};

const FC_QUESTS = ["Tei-Tei Lacking Charm","Hunting Help","Ether Exploitation","Ether Font","Drydry Entia","Evelen on the Edge","Incensed Dekadeka","Tutu's Lost Property","Lost & Found","Favour for Fofora","Brother's Keepsake","Supplant the Noble Brogs","Praying Caterpile Control","Plump Pickings","Laennar's Worries","Riddle Faifa This","Hekasa's Labour at Stake","Inclined to Climb","New Way of Life","Fixing Up the Junks","Sweetest Debt","Rubble Trouble","Finding Happiness","Wallflower","Priority Wunwun","No Armu Done","Ready, Setset, Go!","Secure the Area","Brace for Friendship","Rival Hearts","Hook, Line and Sinker","Steady on, Grandad!","Sorrow","Ponspectors Till We Cry","Shoulder Survey Snaps","Nonona's Calling","The Future Within Our Grasp","The Quest for Radzamalt³","A Surefire Hit","The Fallen","Stubborn Minds"];

// area canon-name -> target area id + creation metadata. Order = play sequence.
const AREA_PLAN = [
  { canon: "Colony 9", id: "area-colony9" },
  { canon: "Tephra Cave", id: "area-tephra-cave", create: { name: "Tephra Cave", reach: "Early game", locks: null } },
  { canon: "Bionis' Leg", id: "area-bionis-leg", create: { name: "Bionis' Leg", reach: "Mid game", locks: null, note: "Region is revisitable; only the Refugee Camp timer quests lock — see the Refugee Camp card." } },
  // area-refugee-camp (existing) slots here in ORDER but has no bulk data
  { canon: "Colony 6", id: "area-colony6", create: { name: "Colony 6", reach: "Mid game", locks: null } },
  { canon: "Ether Mine", id: "area-ether-mine", create: { name: "Ether Mine", reach: "Mid game", locks: "co-ether-mine" } },
  { canon: "Satorl Marsh", id: "area-satorl-marsh" },
  { canon: "Makna Forest", id: "area-makna-forest", create: { name: "Makna Forest", reach: "Mid game", locks: null } },
  { canon: "Frontier Village", id: "area-frontier-village" },
  { canon: "Bionis' Interior", id: "area-bionis-interior", create: { name: "Bionis' Interior", reach: "Late game", locks: null, note: "Lock status uncertain — grab on first visit to be safe." } },
  { canon: "High Entia Tomb", id: "area-high-entia-tomb", create: { name: "High Entia Tomb", reach: "Mid game", locks: null } },
  { canon: "Eryth Sea", id: "area-eryth-sea", create: { name: "Eryth Sea", reach: "Mid game", locks: null } },
  { canon: "Alcamoth", id: "area-alcamoth" },
  { canon: "Prison Island", id: "area-prison-island", create: { name: "Prison Island", reach: "Late game", locks: null, note: "Story-gated; lock status uncertain — complete content when it's available." } },
  { canon: "Valak Mountain", id: "area-valak-mountain" },
  { canon: "Sword Valley", id: "area-sword-valley-galahad" },
  { canon: "Galahad Fortress", id: "area-sword-valley-galahad", prefix: "Galahad: " },
  { canon: "Fallen Arm", id: "area-fallen-arm-machina" },
  { canon: "Mechonis Field", id: "area-mechonis-field" },
  { canon: "Agniratha", id: "area-agniratha" },
  { canon: "Central Factory", id: "area-central-factory" },
  { canon: "Bionis' Shoulder", id: "area-bionis-shoulder-fc", create: { name: "Bionis' Shoulder (Future Connected)", reach: "Future Connected · post-game", locks: null, fc: true } },
  { canon: "Alcamoth (FC)", id: "area-alcamoth-fc", create: { name: "Alcamoth (Future Connected)", reach: "Future Connected · post-game", locks: null, fc: true } }
];

const ORDER = ["area-colony9","area-tephra-cave","area-bionis-leg","area-refugee-camp","area-colony6","area-ether-mine","area-satorl-marsh","area-makna-forest","area-frontier-village","area-bionis-interior","area-high-entia-tomb","area-eryth-sea","area-alcamoth","area-prison-island","area-valak-mountain","area-sword-valley-galahad","area-fallen-arm-machina","area-mechonis-field","area-agniratha","area-central-factory","area-bionis-shoulder-fc","area-alcamoth-fc"];

// ---------------------------------------------------------------- merge
// ensure the early Ether Mine cutoff exists
if (!data.cutoffs.some((c) => c.id === "co-ether-mine")) {
  data.cutoffs.push({ id: "co-ether-mine", order: 2.5, chapterAnchor: "Mid game (~ when you leave the Colony 6 region — verify)", label: "Before Ether Mine locks", note: "Ether Mine becomes inaccessible later. Grab its collectables/landmarks on your first visit.", confidence: "verify" });
}

const areaById = {};
data.areas.forEach((a) => (areaById[a.id] = a));
const touched = new Set(); // `${id}:${section}` already reset this run

// Reclassify: these areas are REVISITABLE (not permanent lockouts), but they hold
// timed quests. Move the deadline onto the quests (expiresAt) and clear the area
// lock so their collectables/landmarks are correctly non-missable.
const TIMED_NOT_LOCKED = {
  "area-frontier-village": "co-final-point-of-no-return",
  "area-fallen-arm-machina": "co-mechonis-field"
};
Object.entries(TIMED_NOT_LOCKED).forEach(([id, cut]) => {
  const a = areaById[id];
  if (!a) return;
  a.locksAt = null;
  a.note = (a.note ? a.note + " " : "") + "Revisitable area — but its timed (⏱) quests still expire at a cutoff.";
  (a.sections.quests || []).forEach((q) => { if (q.missable) q.expiresAt = cut; });
});

function getOrCreateArea(plan) {
  let a = areaById[plan.id];
  if (a) return a;
  a = {
    id: plan.id,
    name: plan.create.name,
    reachableAnchor: plan.create.reach,
    locksAt: plan.create.locks,
    expansion: plan.create.fc ? "future-connected" : undefined,
    note: plan.create.note,
    shulkLinkSection: data.meta.links.shulkLinkGuide,
    sections: {}
  };
  data.areas.push(a);
  areaById[a.id] = a;
  return a;
}

function setSection(area, section, items) {
  const key = area.id + ":" + section;
  if (!touched.has(key)) { area.sections[section] = []; touched.add(key); } // replace on first touch this run
  area.sections[section].push(...items);
}

AREA_PLAN.forEach((plan) => {
  const area = getOrCreateArea(plan);
  const locks = !!area.locksAt;
  const isFC = area.expansion === "future-connected";
  const prefix = plan.prefix || "";

  // collectopaedia
  const cols = COLLECT[plan.canon] || [];
  if (cols.length) {
    setSection(area, "collectopaedia", cols.map((n) => ({
      id: "col-" + slug(area.id + "-" + prefix + n),
      label: prefix + n,
      missable: locks,                       // tradeable-debate: in locking areas, grab to be safe
      confidence: locks ? "verify" : "high",
      note: locks ? "May be tradeable later, but grab before the area locks to be safe." : undefined
    })));
  }

  // landmarks (+ locations)
  const lm = LAND[plan.canon];
  if (lm) {
    const items = [];
    (lm.l || []).forEach((n) => items.push({ id: "lm-" + slug(area.id + "-" + prefix + n), label: prefix + n, kind: "Landmark", missable: locks, confidence: "high" }));
    (lm.loc || []).forEach((n) => items.push({ id: "lm-" + slug(area.id + "-" + prefix + "loc-" + n), label: prefix + n, kind: "Location", missable: locks, confidence: "high" }));
    if (lm.locNote) items.push({ id: "lm-" + slug(area.id + "-locnote"), label: lm.locNote, missable: false, confidence: "verify" });
    if (items.length) setSection(area, "landmarks", items);
  }

  // Future Connected quests (non-missable) live on Bionis' Shoulder
  if (plan.id === "area-bionis-shoulder-fc") {
    setSection(area, "quests", FC_QUESTS.map((n) => ({
      id: "fcq-" + slug(n), label: n, missable: false, timed: false, confidence: "verify",
      note: "Future Connected — none of its quests are missable/timed."
    })).concat([{ id: "fc-ponspectors", label: "Find all 12 Ponspectors (combo-attack partners)", missable: false, confidence: "verify", note: "12 hidden Nopon scattered across Bionis' Shoulder." }]));
  }
});

// drop the old summary collectopaedia placeholders that real lists replaced
// (handled automatically: setSection replaced those areas' collectopaedia arrays.)

// sort areas into play order; unknown ids keep relative order at the end
data.areas.sort((a, b) => {
  const ia = ORDER.indexOf(a.id), ib = ORDER.indexOf(b.id);
  return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
});

// retire the now-redundant flat futureConnected placeholder
data.futureConnected = [];

data.meta.version = "0.2.0";
data.meta.scope = "Full 100%: missable spine + full Collectopaedia + all landmarks/locations + Future Connected. Non-missable bulk data tagged confidence high (Game8-sourced); double-check completeness against the in-game map %.";

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log("Wrote", FILE);
