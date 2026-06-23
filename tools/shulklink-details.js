/*
 * shulklink-details.js — per-item + per-section detail fields, merged onto the
 * walkthrough by build-shulklink.js (keyed "sectionId:code").
 *
 * Policy: FACTS are verbatim (area, giver, location, objective, rewards, monster
 * level/location/condition, affinity requirement, gain choices, record names,
 * landmark/location names). STRATEGY / mutex "why" / Nota Bene are concise
 * paraphrases in our own words — ShulkLink's prose is NOT reproduced.
 *
 * Populated section-by-section. Sections without an entry keep their base data.
 */
const G = "Defense Force Soldier", R = "Colony 9 Resident", RF = "Refugee", HT = "Homs Traveller";

module.exports = {
  sections: {
    "4.2": {},
    "4.6": {
      guide: [
        { step: "No story to advance here — this is the big side-quest sweep across Colony 9, Tephra Cave, and the Bionis' Leg / Refugee Camp.",
          notes: ["Around here you'll pick up records like Second Wind (10 revivals), Art School (an art to Lv. 2) and Ninja Skillz (one-shot with Back Slash).", "Item Vision: a gray vision flags how many of a newly-found collectable you'll need; it's tracked in your inventory.", "Your Arts palette fills up around Lv. 16 — you can only equip 8, so swap via the Arts submenu."] },
        { step: "Suggested order: clear Colony 9's daytime quests, then its night quests, then the Tephra Cave batch, then head to the Bionis' Leg and work the Refugee Camp quests." },
        { step: "Use the Quests column — each item's details give the giver, exact location, objective and reward; unique-monster spots and the 'which to pick' notes for mutually-exclusive quests are in their own details." },
        { step: "⏱ The Refugee Camp timed quests can be left for now, but they ALL lock when you start Colony 6 reconstruction (§4.11) — don't trigger that until they're done." }
      ],
      landmarks: ["Tranquil Square", "Observation Platform", "Raguel Bridge: South", "Raguel Bridge: North", "Jacob's Rock Rest Area"],
      locations: ["Agora Shore", "Anti-Air Battery 2", "Anti-Air Battery 3", "Hazzai Cape", "Cliff Lake",
        "Volff Lair", "Viliera Hill", "Sky Stage", "Daksha Shrine", "Raguel Lake", "Tranquil Grotto",
        "Windy Cave", "Crevasse Waterfall", "Kisk Cave", "Tirkin Headquarters"],
      records: [
        "Equivalent Exchange — first successful trade with an NPC",
        "Lazybones — skip-travel 50 times",
        "Breaking The Ice — party banter on registering a quest for the first time",
        "Idle Chit-Chat — party banter on registering quests 50 times",
        "Ear To The Ground — spoken to people 100 times",
        "Unlucky Sixes — deal exactly 666 damage in one hit",
        "Lucky Sevens — deal exactly 777 damage in one hit",
        "Rear Admiral — perform a back attack 50 times",
        "It Hasn't Lost Its Lustre — open 10 gold chests",
        "Hoarding Treasure — open 50 silver chests",
        "Airing Grievances — defeat 30 flying monsters",
        "Raring To Go — get your first rare ether crystal",
        "Simply Smashing! — smash 100 vision tags",
        "Killer Combo — deal 3,000 damage with a chain attack",
        "Ground To A Pulp — defeat 250 ground-type monsters",
        "Unshakeable Trust — raise two party members to blue affinity",
        "Colony 9 Celebrity — reach 3-star affinity with Colony 9"
      ],
      notaBene: [
        "Around this section you'll likely pick up: Second Wind (10 revivals), Art School (level an art to Lv. 2) and Ninja Skillz (one-shot an enemy with Back Slash).",
        "Item Vision: on collecting an early Bionis' Leg collectable (e.g. Moth Crawler / Sour Gooseberry) a gray vision flags that you'll need several of that item — they're then marked in your inventory until you hit the count.",
        "Arts palette fills up around Lv. 16 (Reyn learns a 9th art) — you can only equip 8, so swap via the Arts submenu."
      ]
    },
    "4.7": {
      guide: [
        { step: "More cleanup plus a region boss. First, mop up the remaining Tephra Cave unique monsters." },
        { step: "Head up the Leg: from Raguel Bridge: North go northeast to Maguel Road, then north to the story flag. You'll fight the area's boss here ({{Mechon M71 (Lv. 18)}}) before finishing the errata because it blocks access.",
          notes: ["You fight this region's bosses before clearing the errata — the boss blocks access, and beating it locks nothing."] },
        { step: "A short second fight follows ({{Mysterious Face (Lv. 25)}}) — just survive; Sharla keeps the party up." },
        { step: "Afterward, finish the upper-Leg map (Traveller's Rest, Spiral Valley, Bask Cave Passage, Kasharpa Falls, Zax Guidepost, Believer's Paradise) and clear the remaining quests and the long affinity-link list." },
        { step: "When everything's done, quick-travel to the Bask Cave Passage and head southeast to the next region, Colony 6." }
      ],
      landmarks: ["Spiral Valley", "Bask Cave Passage", "Zax Guidepost", "Believer's Paradise"],
      locations: ["Traveller's Rest", "Kasharpa Falls", "Maguel Road"],
      records: [
        "Explorer — discover the Observation Platform",
        "A generous friend — complete A Young Captain's Rise",
        "Fifty Fine Friends — register your 50th NPC (speak with Jan)",
        "Spider's Web — speak with Zukazu"
      ],
      affinitySteps: [
        "Speak with Dionysus at 12:00 → yellow 'tea friends' (Dionysus/Marcia).",
        "Speak with Marcia at 12:00 → yellow 'interest' (Marcia/Liliana).",
        "Speak with Jolele (Tranquil Square HtH street, right side, night) at 22:00 → blue 'fine grandson' (Jolele/Niranira); registers Jolele.",
        "Speak with Jolele again at 00:00 → green 'grandson's pal' (Jolele/Lukas).",
        "Speak with Betty → green 'big fan' (Betty/Kenny Rohan).",
        "Register Narine by trading (SW of Tranquil Square, day) — don't take her quest yet.",
        "Military District entrance, night — speak with Arnault, answer 'You should ask her yourself' → orange 'together/apart' (Arnault/Françoise).",
        "Speak with Leopold → link with Arnault depends on your Financial Planning route (yellow 'fan' for the frame route / blue 'extreme fan' for the investigate route).",
        "Register Cheryl by trading (Gem Man's Stall NE balcony, overlooking Central Plaza).",
        "Speak with Minnie (sentry at the kids' bridge, 03:00) → orange 'idler/achiever' (Minnie/Monica); registers Minnie.",
        "Speak with Jan (SE wall of the Military District, day) → yellow 'late bloomer?' (Jan/Minnie); registers Jan (trial: Fifty Fine Friends).",
        "Speak with Gorman → yellow 'divorced' (Gorman/Arda).",
        "Speak with Anna at 15:00 → yellow 'mother's friend' (Olga/Anna).",
        "Speak with Olga → yellow 'understanding' (Olga/Ewan).",
        "Speak with Nikita at 11:00 → green 'fine engineer' (Nikita/Satata).",
        "Speak with Zukazu (SW Tranquil Square, night, by a tree) → orange 'hostility' (Zukazu/Marcia); registers Zukazu (trial: Spider's Web).",
        "Register the remaining Colony 9 military: Kantz (north Military District, day), Oleksiy (Gem Man's Stall, night, NE under the building), Meifimeifi (center Military District, night), Nic (enclosed garrison north of Meifimeifi, night) — registering Nic unlocks the trial 'The Brave Protectors'.",
        "Register Perrine (Weapon Dev Lab entrance, sunset).",
        "Speak with Shura (Ether Light, night) → green 'good boss' (Shura/Erik).",
        "Register Peppino (HtH street, night, tree hangout ~4 buildings down).",
        "Register Rosemary (east of the Gem Man's Stall, night) and Werner (Mechon Wreckage Site)."
      ],
      notaBene: [
        "You fight this region's two bosses (Mechon M71, then Mysterious Face on Maguel Road) BEFORE finishing the errata — the boss blocks access to a lot of it, and his defeat doesn't lock anything."
      ]
    },
    "4.8": {
      guide: [
        { step: "From the Bionis' Leg, head south through the Bask Cave Passage into the Colony 6 region. Unlock Watchpoint Junction, go northeast to Supply Road, then speak with Daza (the Nopon) at the big gate." },
        { step: "Do Daza's quests — Proof of Status (take the elevator down to Splintered Path and grab the Nopon Coin) and Safety First — to earn his trust." },
        { step: "When you're done, quick-travel to the Drainage Outlet and head south into the Ether Mine." }
      ],
      landmarks: ["Watchpoint Junction", "Supply Road", "Drainage Outlet"],
      locations: ["Splintered Path"]
    },
    "4.9": {
      guide: [
        { step: "Enter the Ether Mine. Work down through the Test Pits and lifts (Drainage Tunnel → Test Pits → Mining Base) toward the Central Pit, banking landmarks as you go." },
        { step: "Descend the Central Pit via the lifts and the rotating clock-device platforms. At the bottom, boss: {{Xord (Lv. 25)}} — build party gauge on his adds and topple-lock him (chain Break → Wild Down → extend)." },
        { step: "Climb back up and hit the Freight Elevator's start button for a rematch with a weaker {{Xord}}." },
        { step: "After escaping the mine you're thrown into a forced fight; reinforcements arrive to help. Then grab the Pod Depot and Misty Path, and head south to the next region, Satorl Marsh." }
      ],
      landmarks: ["Drainage Tunnel", "Drainage Control Room", "Mining Base", "Central Pit: Entrance", "Personnel Lift 2", "Regulation Piston", "Personnel Lift 3", "Freight Elevator", "Glowmoss Lake", "Central Pit: Base Level", "Freight Road", "Misty Path"],
      locations: ["Test Pit 1", "Test Pit 2", "Test Pit 3", "Test Pit 4", "Storage Depot", "Central Terminal", "Observation Point", "Central Pit: Level 1", "Central Pit: Level 2", "Central Pit: Level 3", "Pod Depot"],
      records: [
        "Fire It Up — (Dark Kisling fight at the fire ether deposits)",
        "Unbreakable Bond",
        "Chain Gang / Off The Chain — get an extra chain link (vs Xord)",
        "Seasoned Traveller — discover the Freight Elevator (completes the Ether Mine map)"
      ]
    },
    "4.10": {
      guide: [
        { step: "Enter Satorl Marsh at Kelsher Wetlands and head south. Find the Nopon Merchant Camp and pick up their quests." },
        { step: "Explore the marsh — Crown Tree, Silent Obelisk, Glowing Obelisk, the Igna Territory and Exile Fortress (it's gorgeous at night)." },
        { step: "Do the Ancient Ceremony: gather the four Radiant Offerings (Q117 — Basin Cave, Altar of Fate, Dark Swamp, Igna Territory), then use the Adulthood Emblem at the Sororal Statues and defeat the {{Satorl Guardian (Lv. 28)}}.",
          notes: ["Some party members leave at the Sororal Statues — this is when Colony 6 reconstruction opens for business.", "Easy 'Cosmic Killer Combo' record here via a lucky multi-link chain attack."] },
        { step: "Climb to the Statue Summit, then quick-travel to Watchpoint Junction to begin Colony 6 development (§4.11)." }
      ],
      landmarks: ["Kelsher Wetlands", "Nopon Merchant Camp", "Crown Tree", "Silent Obelisk", "Glowing Obelisk", "Sororal Statues", "Shining Pond", "Statue Summit"],
      locations: ["Lacus Swamp", "Zaldandia Falls", "Poison Swamp", "Barren Moor", "Dark Swamp", "Igna Territory", "Exile Fortress", "Nopon Refuge", "Oath Sanctuary", "Place of Judgement", "Mauk Floodgate", "Soter Ruins", "Basin Cave", "Altar of Fate"],
      notaBene: [
        "Otharon, Juju and Dickson leave the party at the Sororal Statues — that's when Colony 6 reconstruction opens for business.",
        "Easy 'Cosmic Killer Combo' record here via a lucky multi-link chain attack."
      ]
    },
    "4.1": {
      guide: [
        { step: "It's a guided tutorial battle you can't lose — just learn the basics: target with L/R, fire Arts with A, and against Mechon use Monado Enchant (then Buster on the boss).",
          notes: ["Finish the boss ({{Mechon M82}}) with Buster around 50% HP — pure tutorial, you can't lose."] },
        { step: "Play through to the title screen; the prologue ends there." }
      ],
      notaBene: ["Pure tutorial — you can't lose. Use Monado Enchant on the Mechon and finish the boss (Mechon M82) with Buster around 50% HP."]
    },
    "4.2": {
      guide: [
        { step: "You take control as Shulk at the Mechon Wreckage Site. Win the tutorial fight, grab the chest, then head south down the road and follow it east into Colony 9.",
          notes: ["Fiora is only playable until an upcoming cutscene — make the most of her now."] },
        { step: "Take the grand tour for free landmark EXP: Main Entrance → Ether Light → Gem Man's Stall → Central Plaza → Fortress Entrance, then into the Military District and west to the Weapon Dev. Lab." },
        { step: "Follow the story prompt 'Delivering Food' (Q1): bring the lunch to Shulk at Outlook Park, and watch the 'Sunrise in the Park' heart-to-heart there." },
        { step: "Return to the Weapon Dev. Lab to trigger the next beat, then take the errand toward Tephra Cave: quick-travel to the Main Entrance and climb the south trail up Tephra Hill to the Tephra Cave Entrance." },
        { step: "Hold off on side quests for now — the guide flags a story event ahead you don't want to be mid-quest for." }
      ],
      landmarks: ["Mechon Wreckage Site", "Main Entrance", "Ether Light", "Gem Man's Stall", "Central Plaza", "Fortress Entrance", "Outlook Park", "Tephra Cave Entrance"],
      locations: ["Commercial District", "Military District", "Weapon Dev. Lab", "Dunban's House", "Tephra Hill"],
      records: ["First Steps — your first trial (Mechon Wreckage Site)", "Back-Stabber — first Back Slash from behind", "Let's Fight — first burst affinity challenge", "Turn It Up! — a party member reaches high tension"],
      notaBene: ["Fiora is only playable until the upcoming cutscene.", "Hold off on quests for now — story events are coming that make it awkward."]
    },
    "4.3": {
      guide: [
        { step: "Enter Tephra Cave. Follow the path west; at the fork go north past the Caterpile Nest (steer clear of the unique monster in the middle) and continue to the Mag Mell Ruins.",
          notes: ["Just run from the unique monster in the hallway past Mag Mell Ruins for now."] },
        { step: "Enter the ruins for a cutscene and the skip-travel tutorial. Recommended detour: skip-travel back to Colony 9 to claim the Gem Man's free gems and buy/equip gear.",
          notes: ["Visit the Gem Man for a free Strength Up II + HP Up II gem.", "Do NOT sell Reyn's Scrap Driver — it can't be replaced."] },
        { step: "From the ruins, climb the ramp, head east through the door, then north through the cavern (follow the U-turn) to the Rear Entrance, which sends you back toward Colony 9." },
        { step: "Outside you'll unlock the Cylinder Hangar — head to the story flag to continue." }
      ],
      landmarks: ["Tephra Path", "Mag Mell Ruins", "Rear Entrance", "Cylinder Hangar"],
      locations: ["Caterpile Nest", "Warehouse 2"],
      records: ["A Corner Of The World — trial (Mag Mell Ruins)", "Skip It — first skip-travel", "That Hits The Slot — set up your party's gear"],
      notaBene: ["Visit the Gem Man for a Strength Up II + HP Up II gem.", "Do NOT sell Reyn's Scrap Driver — it can't be replaced.", "Just run from the unique monster in the hallway past Mag Mell Ruins for now."]
    },
    "4.4": {
      guide: [
        { step: "After the hangar scene you're thrown into a forced fight, then the colony falls into chaos and quick-travel is disabled. Drop into the water below (you're safe), swim east to shore (Anti-Air Battery 1), and climb up to re-enter through the Main Entrance." },
        { step: "Make for the Weapon Dev. Lab: east to the Central Plaza, then north across the bridge into the Military District. With the lab blocked, the plan routes you to the Residential District." },
        { step: "Fight through the forced Mechon battles (use Monado Enchant once Shulk holds the Monado), heading southeast and across the bridge to the Residential District." },
        { step: "Boss — {{Metal Face (Lv. 10)}}: survive Stage 1, then in Stage 2 topple-lock him with a chain attack (Enchant first → Stream Edge → Wild Down → Steel Strike) and burn ~25% of his HP with red Arts or Buster.",
          notes: ["Your first real boss — topple-locking via a chain attack is the key skill to learn here."] }
      ],
      locations: ["Anti-Air Battery 1", "Residential District"],
      records: ["Making Waves — land in the water", "Critical Thinking — score a critical hit", "Come On, Cheer Up! — revive after the leader is incapacitated", "Go Team! — your first chain attack"],
      notaBene: ["First real boss: Metal Face (Lv. 10). Stage 2 needs topple-locking via a chain attack (Enchant first): Stream Edge → Wild Down → Steel Strike, then ~25% HP in red arts / Buster."]
    },
    "4.5": {
      guide: [
        { step: "Set out from Colony 9 (try a gem craft at the Gem Man for a record). Quick-travel to the Mag Mell Ruins, up the ramp, east through the door, then south past the Escape Pod Bay into the Tephra Cavern." },
        { step: "Farm the ice-like ether deposit for your first crystals, grab the Spring of Grief landmark, then follow the path south through the spider caves (a forced arachno fight happens along the way)." },
        { step: "Continue west then south, climb the vines, cross Vilia Lake, and climb up to the Arachno Queen's Nest." },
        { step: "Boss — {{Arachno Queen (Lv. 12)}}: focus her with Arts and party commands, and use Shield when a vision warns of her talent art. Take the Queen's Gut Fluid afterward." },
        { step: "Use the Gut Fluid on the sticky web, head to the overlook, then northeast to Kneecap Hill → east to Leg Pass → east into the Bionis' Leg." },
        { step: "On the Leg: from Raginar Canyon Path go southeast onto Gaur Plain, reach the abandoned buggy (forced fight), then meet Juju and follow his directions — east to the tall post, then south to the Refugee Camp." },
        { step: "At camp, speak with Sharla in the cave and agree to listen. You now have a full party — head north to the marker to restore quick-travel, then move into the §4.6 errata.",
          notes: ["Sharla joins as your first healer."] }
      ],
      landmarks: ["Spring Of Grief", "Vilia Lake", "Leg Pass", "Raginar Canyon Path", "Refugee Camp", "Kamos Guidepost"],
      locations: ["Tephra Cavern", "Arachno Queen's Nest", "Kneecap Hill", "Gaur Plain", "Rho Oasis", "Escape Pod Bay"],
      records: ["Titan's Gift — farm your first ether crystals", "Learning The Craft — first gem craft", "Blossoming Friendship — reach green party affinity", "Bug Off — defeat 30 insects"],
      notaBene: ["Boss: Arachno Queen (Lv. 12) — focus her with arts; use Shield (leveled ≥ her talent art) when a vision warns of it.", "Sharla joins (your first healer). Quick-travel returns after you reach the camp's north marker."]
    },
    "4.11": {
      guide: [
        { step: "⚠ Before you do anything here: make sure every Refugee Camp ⏱ timed quest is finished — the next step locks them for good.",
          notes: ["Reconstruction begins here — completing 'To Colony 6!' immigrates the refugees and locks the camp's timed quests."] },
        { step: "Quick-travel to Watchpoint Junction, go south through the now-open gate to Colony 6's Main Entrance, and complete 'To Colony 6!' (Q118a) with Otharon to open reconstruction." },
        { step: "Start developing Colony 6 with Juju (Housing / Commerce / Nature / Special to Lv. 1) and work the new Colony 6 quests.",
          notes: ["After Lv. 1 development you get an Ultra Small Reactor (used for the Gem Man's quest) and street lights."] },
        { step: "When done, return to the Statue Summit and head northwest into the Bionis' Interior." }
      ],
      landmarks: ["Main Entrance", "Reconstruction HQ"],
      locations: ["Hope Farm"],
      notaBene: ["Reconstruction begins here — finish ALL Refugee Camp ⏱ timed quests first.", "After Lv.1 development you get an Ultra Small Reactor (for the Gem Man's quest) and street lights."]
    },
    "4.12": {
      guide: [
        { step: "A short run-through with nothing to collect or fight. From the Statue Summit, head northwest into the Bionis' Interior.",
          notes: ["You can't pick up collectables or fight anything on this visit — just pass through."] },
        { step: "Follow the path through the Third Lung, ride the geyser up to the Upper Trachea, and continue into the next region, Makna Forest." }
      ],
      landmarks: ["Upper Trachea"], locations: ["Third Lung"],
      notaBene: ["Can't collect or fight anything on this visit — straight run-through to Makna Forest."]
    },
    "4.13": {
      guide: [
        { step: "Arrive at Makna Path and head to the Agni Tablet (there's a shop and a quest-giving merchant).",
          notes: ["Buy and learn ALL the art manuals from Colony 9's Ether Light shop for a real power boost."] },
        { step: "Explore the forest — Lakeside, the numbered bridges, Divine Sanctuary, Eks' Watering Hole, Sap Cave." },
        { step: "Story: at the Nopon Arch, do 'Mystery Girl Rescue' (Q135) — collect Water Ether Crystals at the Lakeside and return. A telethia ambush follows; use your new Purge art.",
          notes: ["Melia joins after this fight — start building her party affinity (pair her with Sharla for an upcoming quest)."] },
        { step: "Finish exploring what you can, then head to the Village Entrance to enter Frontier Village." }
      ],
      landmarks: ["Makna Path", "Agni Tablet", "Lakeside", "Divine Sanctuary", "Seahorse Islet", "Waypoint Beacon", "Nopon Arch", "Twisted Tree Gate", "Village Entrance", "Sparkling Pool", "Windmill Pavilion", "Glowmoss Trihenge"],
      locations: ["Bridge One", "Bridge Two", "Bridge Three", "Sap Cave", "Eks' Watering Hole", "Contaminated Area", "Great Makna Falls", "Clear Waterfall", "Yellow Flower Grove", "Decayed Forest", "Abyss Basin", "Precipice Bridge", "Hode Lair"],
      records: ["One Step Further — learn an intermediate art from a manual", "Time For New Glasses — telethia fight", "Trailblazer — discover Seahorse Islet"],
      notaBene: ["Buy & learn ALL the art manuals from the Ether Light shop (Colony 9) for an edge.", "Melia joins after the telethia fight — start her party affinity (pair with Sharla for an upcoming quest)."]
    },
    "4.14": {
      guide: [
        { step: "Riki joins, and this is the biggest errata hub in the game. First, do the heropon errand (Q136): grab his weapon and armour." },
        { step: "Grind out the huge quest list in the Quests column, and register every nopon (see the affinity steps) for the 'Know So Many Nopon!' trial.",
          notes: ["Frontier Village has more side content than any other area — great for character growth."] },
        { step: "When you're ready for the story, head to the Decayed Forest (SE Makna) and defeat the boss, {{Leonne Telethia (Lv. 36)}} (suggested party: Melia / Sharla / Riki)." },
        { step: "Afterward, speak with Melia (up the stairs from the Chief's Residence), then take the transporter from the Contemplation Terrace to Eryth Sea." }
      ],
      landmarks: ["Sacred Altar", "Nopon Tower", "Entry Bridge", "Pollen Works", "Riki's House", "Chief's Residence", "Prophecy Hut", "Contemplation Terrace"],
      locations: ["Central Plaza", "Kyn Shopping Street", "Orb Storage Level", "Pollen Orb Storehouse", "Middle Housing Level", "Pollen Works Level", "Archaeology Level", "Archaeology Center", "Top Housing Level", "Underground Store", "Nopon Kitchen", "Mysterious Sanctuary", "Apex Lake", "Reservoir"],
      records: ["Know So Many Nopon! — register every nopon in Frontier Village", "Honorary Nopon — 3-star affinity with the central Bionis", "Clearing The Air — (Popularity Premonition quest)"],
      affinitySteps: [
        "Register every nopon to unlock 'Know So Many Nopon!': Berryjammy (Contemplation Terrace, night), Pelupelu (downstairs from there, night), Kiriku (by the Sacred Altar, day), Yusa & Npa (Underground Store, day), Pachipa (Archaeology Center upper, 1200), Tuzu (Archaeology Center lower), Gadada (Pollen Works, day), Gowago (near Riki's House, night), Minana (Kyn Shopping Street, day), Norara (lower-level clearing, west), Hoko (platform SE of Chief's Residence, day), Pokapoka (east Sacred Plaza, night), Medi (Kyn Shopping Street, night), Puko (Kyn Shopping Street, sunny), Miko (Prophecy Hut, day), Lalapa (Chief's Residence, day), Dabidabi (balcony up from Chief's Residence, night), Adidi (Reservoir NE shore). Just trade with Bana (save his quest).",
        "Speak Deki at 12:00 → yellow 'old friend' (Deki/Migaga); Kokora at 15:00 → yellow 'grannypon' (Kokora/Migaga); Kofuko at 03:00 → yellow 'grampypon' (Kokora/Kofuko).",
        "Speak Tati at 03:00 → yellow 'both working' (Tati/Npa) and yellow 'happy family' (Tati/Kiriku).",
        "Speak Pachipa at 12:00 → orange 'worried dad' (Pachipa/Gerugu).",
        "Speak Rono at 00:00 → green 'happy for him' (Rono/Leku); Modamo → yellow 'sweet fanatics' (Modamo/Rono).",
        "Return to Traveller's Rest (Bionis' Leg) — speak Batubatu → yellow 'uncle/niece' (Batubatu/Pepa).",
        "Central Plaza — speak Rasha → yellow 'jealous' (Rasha/Tati)."
      ],
      notaBene: ["Frontier Village has the most errata in the game — huge for character growth.", "Boss: Leonne Telethia (Lv. 36) at the Decayed Forest — suggested party Melia / Sharla / Riki."]
    },
    "4.15": {
      guide: [
        { step: "A short region. From Latael Shore, hop the transporters across the Hovering Reefs (1 → 2 → 3 → 4) and grab the Syrath Lighthouse." },
        { step: "Return to Hovering Reef 2 and take the transporter to the Centre Gate, then continue into Alcamoth, the High Entia capital." }
      ],
      landmarks: ["Latael Shore", "Syrath Lighthouse", "Centre Gate"],
      locations: ["Hovering Reef 1", "Showdown Cliff", "Hovering Reef 2", "Hovering Reef 3", "Hovering Reef 4"]
    },
    "4.16": {
      guide: [
        { step: "You arrive with only Melia in your party, so skip side quests for now. Move forward through the Imperial Palace → Great Hall → Ascension Hall → Audience Chamber for a run of story cutscenes." },
        { step: "You'll be asked to rescue a worker on Eryth Sea (Q187): quick-travel to Syrath Lighthouse, take the transporters to the Ether Crystal Deposit, and defeat the Defensive Kromar." },
        { step: "Return and rest at Whitewing Palace to advance the story into the High Entia Tomb." }
      ],
      landmarks: ["Main Entrance", "Imperial Palace", "Ascension Hall", "Whitewing Palace"],
      locations: ["Melifica Road", "Sky Terrace", "Great Hall", "Audience Chamber"],
      records: ["Globetrotter — discover Ascension Hall"]
    },
    "4.17": {
      guide: [
        { step: "Quick-travel to the Center Gate and take the deck transporter to the High Entia Tomb." },
        { step: "You play the early rooms solo as Melia — approach the gaps to form light bridges, and clear the forced fights. The rest of the party joins via a trapdoor; work both groups east to the Ceremony Hall." },
        { step: "Boss: {{Solidium Telethia and Tyrea (Lv. 38)}} — fight one at a time, Purge the telethia's aura, and topple Tyrea to damage her." }
      ],
      landmarks: ["High Entia Tomb", "Tomb Approach", "Sealed Chamber", "Ceremony Hall", "Tomb Robber Pool", "Valley Of Emperors", "Tower of Trials: Bridge"],
      locations: ["Hall Of Spirits", "Hall Of Trials", "Second Treasury"],
      records: ["The Final Step — use the art book from the Second Treasury"]
    },
    "4.18": {
      guide: [
        { step: "After the tomb, head to the Imperial Villa (transporter off the Great Hall) for story, then the plot sends you back to Eryth Sea.",
          notes: ["No collectables or unique monsters on this first Prison Island visit."] },
        { step: "Open the path to Prison Island — release the Khatorl and Soltnar seals (Q188/Q189): ride the reef transporters, climb the two seal towers, and clear the kromar unique monsters guarding them." },
        { step: "Take the central transporter to Prison Island, cross to the Great Canyon, and proceed to the boss: {{Metal Face (Lv. 42)}} — build Shulk's talent gauge and Enchant.",
          notes: ["After the big Prison Island event, your Monado arts unlock up to level X and faced Mechon can be damaged like regular Mechon (topple or Enchant)."] },
        { step: "When you regain control, head for Valak Mountain via the Makna transporter (Pod Landing Site → Valak Pass)." }
      ],
      landmarks: ["High Entia Transporter", "Prison Gate", "Prison Terrace", "Central Seal Island", "Khatorl Seal Island", "Soltnar Seal Island", "Ether Plant", "Faras Cave", "Imperial Villa", "Pod Landing Site", "Valak Pass", "King Agni's Tomb"],
      locations: ["Hovering Reef 5", "Hovering Reef 6", "Hovering Reef 7", "Hovering Reef 8", "Hovering Reef 9", "Hovering Reef 10", "Ether Crystal Deposit", "Hode Refuge", "Bionis' Occipital", "Sleeping Dragon Isle", "Anu Shore", "Secluded Island", "Kromar Coast", "Central Hall", "Great Canyon"],
      records: ["Jaws Of Defeat — (Khatorl seal release)"],
      notaBene: ["No collectables or unique monsters on this first visit.", "After Zanza's release: Monado arts level up to X, and faced Mechon can now be damaged like normal Mechon (topple or Enchant)."]
    },
    "4.19": {
      guide: [
        { step: "A short cleanup stop. ⚠ First, get Melia's Imperial Staff from Kallian at Ascension Hall — her best mid-game weapon.",
          notes: ["Don't skip the Imperial Staff — it's a big upgrade for Melia."] },
        { step: "Do 'Bridge Repair' (Q190) in Makna to finish that region's map, push Colony 6 development to Lv. 3, and recruit a few new residents (Perrine, etc.)." }
      ],
      landmarks: ["Fountain of Eternity", "Fountain of Hope"],
      locations: ["Repaired Bridge Four", "Revelation Hall"],
      notaBene: ["⚠ Get Melia's Imperial Staff from Kallian at Ascension Hall — her best non-endgame weapon."]
    },
    "4.20": {
      guide: [
        { step: "Pure errata — but ⚠ almost everything here is ⏱ TIMED and is forfeit at a later point of no return, so clear it ALL now.",
          notes: ["You're roughly halfway through the game at this point."] },
        { step: "Work the Eryth Sea quests first (the Syrath Lighthouse keeper, and Jarack at the Ether Plant), then the big Alcamoth quest list (Citizens and Imperial Guards), plus the heart-to-hearts." },
        { step: "There's no new region to push here — once the Quests column is clear, continue to Valak Mountain (§4.21) if you haven't already." }
      ],
      notaBene: ["Roughly the halfway mark of the game.", "Almost everything here is ⏱ TIMED — clear it ALL now (it's forfeit at a later point of no return)."]
    },
    "4.21": {
      guide: [
        { step: "Explore the snowy mountain from Zokhed Pass via the ascending and descending trails, grabbing landmarks (Befalgar Pedestal, Hallow Bone, Nopon Camp, Three Sage Summit).",
          notes: ["Equip Quick Step gems before the ice chutes and slides."] },
        { step: "Story: get the Magma Rock (Q257) — defeat {{Conflagrant Roxael}} in the Lava Cave — and use it to melt the frozen Harict Chapel door." },
        { step: "At Nofol Tower, boss: {{Mumkhar (Lv. 48)}} — topple or daze him repeatedly. Then head west to the Bionis' Wrist to finish the region's map." },
        { step: "⚠ That completes Part 1. The next region begins the second third of the story — reveal Part 2 only when you're ready for later-game spoilers." }
      ],
      landmarks: ["Zokhed Pass", "Mechonis Wound", "Befalgar Pedestal", "Hallow Bone", "Nopon Camp", "Harict Chapel", "Lava Cave", "La Luz Church", "Three Sage Summit", "Nofol Tower", "Bionis' Wrist"],
      locations: ["Kana Peak", "Bagnar Snowfield", "Apis Lair", "Valak Peak", "Bionis' Right Elbow", "Url Crevasse", "Chilkin Lair", "Antol Den", "Sealed Tower", "Nagul Waterfall", "Jakt Geyser", "Great Glacier", "Ignia Hill", "Serik Waterfall", "Agul Mountain Range"],
      notaBene: ["Boss: Mumkhar (Lv. 48) at Nofol Tower — topple/daze repeatedly.", "Equip Quick Step gems before the ice chutes/slides."]
    }
  },

  items: {
    // ---- 4.2 ----
    "4.2:HTH1": { location: "Outlook Park", gainChoices: "You and Dunban... // Kind of." },

    // ---- 4.6: Colony 9 / Tephra Cave errata ----
    "4.6:Q1":  { giver: G, location: "Tephra Cave Entrance", objective: "Defeat 1 Willow Bunniv in Tephra Cave (near its entrance).", rewards: "1000G", strategy: "Completes your first non-story quest (trial: Problem Solved!)." },
    "4.6:Q3":  { giver: G, location: "Tephra Cave Entrance", objective: "Defeat 2 Singing Brogs (south of the Mag Mell Ruins).", rewards: "1500G" },
    "4.6:Q4":  { giver: G, location: "Tephra Cave Entrance", objective: "Defeat 5 Mell Lizards (hallway between Rear Entrance and Warehouse 2).", rewards: "1200G" },
    "4.6:HTH2": { location: "Tephra Cave Entrance", gainChoices: "When we had that big fight? // Of course." },
    "4.6:Q5":  { giver: R, location: "South of Ether Light, daytime", objective: "Collect 2 Rabbit Diodes (Colony 9).", rewards: "500G" },
    "4.6:Q6":  { giver: R, location: "North of Ether Light, daytime", objective: "Defeat Verdant Bluchal near Anti-Air Battery 1.", rewards: "1800G" },
    "4.6:UM1": { location: "From the Main Entrance go west, then north to the beach; swerve NE — the larger caterpile is your target.", strategy: "Easy — just lay into him with arts. (First UM kill: trial Hunter-in-Training, plus likely your first gold chest.)" },
    "4.6:Q7":  { giver: R, location: "Tranquil Square heart-to-heart street, daytime", objective: "Collect 1 Giant Hornet (Colony 9).", rewards: "300G" },
    "4.6:Q8":  { giver: R, location: "Tranquil Square HtH street shop, daytime", objective: "Collect 2 Rainbow Zirconia (trade Dionysis, or in the water below Outlook Park).", rewards: "800G" },
    "4.6:Q9":  { giver: R, location: "East of the Gem Man's stall, daytime", objective: "Collect 2 Vang Teeth (Little Vangs at night, west of the Main Entrance).", rewards: "800G" },
    "4.6:Q10": { giver: R, location: "East of the Gem Man's stall, daytime", objective: "Defeat 2 Hand Bunnits (Tephra Hill, the south path from the Main Entrance).", rewards: "800G" },
    "4.6:Q11": { giver: R, location: "East of the Gem Man's stall, daytime", objective: "Defeat 2 Beach Krabbles (southern shore of Anti-Air Battery 1).", rewards: "1000G" },
    "4.6:Q12": { giver: R, location: "East of the Gem Man's stall, daytime", objective: "Defeat 2 Wood Bunnits (Tephra Hill, just past the Hand Bunnits).", rewards: "800G" },
    "4.6:Q13": { giver: R, location: "East of the Gem Man's stall, daytime", objective: "Defeat 3 Light Skeeters (north part of Anti-Air Battery 1).", rewards: "600G" },
    "4.6:Q14": { giver: R, location: "North of Tranquil Square, night", objective: "Collect 1 Yolkless Flamii Egg (Lake Flamii, Anti-Air Battery 1 north shore).", rewards: "1000G" },
    "4.6:Q15": { giver: G, location: "Entrance of Military District, daytime", objective: "Defeat 2 Lake Flamii (Anti-Air Battery 1, north shore).", rewards: "800G" },
    "4.6:Q16": { giver: G, location: "Entrance of Military District, daytime", objective: "Defeat 1 Baby Armu (Anti-Air Battery 1, north shore).", rewards: "1500G" },
    "4.6:Q17": { giver: G, location: "Entrance of Military District, daytime", objective: "Defeat 2 Stone Krabbles (Hazzai Cape — high-level area, use stealth/daytime).", rewards: "800G" },
    "4.6:Q18": { giver: G, location: "Center of the east wall, Military District, daytime", objective: "Defeat Evil Rhanagrot.", rewards: "1800G" },
    "4.6:UM2": { location: "From the Main Entrance up Tephra Hill — behind the boulder on the second knoll.", strategy: "Not difficult — open with Back Slash (he's not looking), then finish with arts." },
    "4.6:Q19": { giver: G, location: "Entrance of Military District, night", objective: "Defeat Lake Magdalena.", rewards: "3000G" },
    "4.6:UM3": { location: "Lake below Outlook Park (jump the cliff west of the landmark).", condition: "Night only", strategy: "Lots of allies — focus him with party commands." },
    "4.6:Q20": { giver: G, location: "North Military District, night", objective: "Defeat 2 Ridge Antols (south coast of Anti-Air Battery 1, night).", rewards: "800G" },
    "4.6:Q21": { giver: G, location: "North Military District, night", objective: "Defeat 1 Cute Brog (south coast of Anti-Air Battery 1, night).", rewards: "500G" },
    "4.6:Q22": { giver: G, location: "North Military District, night", objective: "Defeat 3 Colony Krabbles (Cliff Lake, east shore, night).", rewards: "1200G" },
    "4.6:UM4": { location: "Cliff Lake (the 'f' on the map) — from the colony waters go NW.", strategy: "Break (Shulk) + topple (Reyn), Sharla heals; clear allies one by one." },
    "4.6:UM5": { location: "East shore of Cliff Lake.", condition: "Day only", strategy: "Easy — plow with arts; Reyn topples if it gets chaotic." },
    "4.6:UM6": { location: "Anti-Air Battery 1, far shore (quick-travel Tephra Cave Entrance, jump in, swim SE).", condition: "Dawn only (~05:00)", strategy: "Focus on toppling him; clear the Flamii first." },
    "4.6:Q23": { giver: R, location: "NE of Ether Light, night", objective: "Collect 1 Small Scale (Colony Piranhax, pool below Outlook Park).", rewards: "800G" },
    "4.6:Q24": { giver: R, location: "Weapon Development Lab, daytime", objective: "Collect 2 Small Shells (Beach Krabbles, Anti-Air Battery 1 south shore).", rewards: "500G" },
    "4.6:Q25": { giver: R, location: "Gem Man's Stall — north under the building, up the west stairs, night", objective: "Collect 1 Plate Snow (Colony 9).", rewards: "300G" },
    "4.6:Q26": { giver: R, location: "Central Plaza, by a lamppost, night", objective: "Find the Wedding Ring (behind Dunban's House).", rewards: "1200G, 50 EXP" },
    "4.6:Q27": { giver: R, location: "Tranquil Square HtH street, tree alcove, night", objective: "Find the Spanner (Gem Man's Stall — north overpass, west balcony, up the stairs, alcove to the south).", rewards: "1500G, 50 EXP" },
    "4.6:Q28": { giver: R, location: "South of the Gem Man's Stall, daytime (seated at a table)", objective: "Find the Key (Tranquil Square HtH street — fenced property opposite Dionysus, around the back).", rewards: "1000G, 50 EXP" },
    "4.6:Q29": { giver: R, location: "Wreckage of the mobile artillery, north Residential District, daytime", objective: "Find the Blue Glass Bead (Tranquil Square SW — use the barrels to jump the fence behind the house).", rewards: "1200G, 50 EXP" },
    "4.6:Q30": { giver: R, location: "Balcony north of the Gem Man's Stall, daytime", objective: "Defeat Wallslide Gwynry.", rewards: "2200G" },
    "4.6:UM7": { location: "Tephra Cave — east of the Rear Entrance in Warehouse 2 (at 'Bay' on the map).", strategy: "Keep him toppled: break (Shulk) → topple (Reyn) → Sharla heals. Build gauge via criticals / Shulk's positional bonuses." },
    "4.6:Q31": { giver: G, location: "Escape Pod Bay (east)", objective: "Collect 2 Kneecap Rocks (Tephra Cave).", rewards: "1000G" },
    "4.6:Q32": { giver: G, location: "Escape Pod Bay (east)", objective: "Collect 2 Bright Figs (Tephra Cave).", rewards: "1500G" },
    "4.6:Q33": { giver: G, location: "Escape Pod Bay (east)", objective: "Collect 3 Broken Pincers (Desert Krabble, west shore of Spring of Grief).", rewards: "1200G" },
    "4.6:Q34": { giver: G, location: "Escape Pod Bay (east)", objective: "Collect 1 lot of Brog Smelling Salts (Noble Brog, east shore of Spring of Grief).", rewards: "1500G" },
    "4.6:Q35": { giver: G, location: "Warehouse 2, at the control panels atop the ramp", objective: "Speak with the soldier at the Cylinder Hangar.", rewards: "800G, 50 EXP, Leather Top, Leather Bottom" },
    "4.6:Q36": { giver: G, location: "Cylinder Hangar", objective: "Find the Pendant in Tephra Cave (Vilia Lake, NW), then report at the Cylinder Hangar.", rewards: "950G, 100 EXP, Quark Gear", strategy: "Prerequisite: Missing In Action completed." },
    "4.6:Q37": { giver: G, location: "Warehouse 2", objective: "Collect 3 Arachno Silk (rare drop, Worker Arachno — cave south of Spring of Grief).", rewards: "500G, 100 EXP, Ranger Gloves" },
    "4.6:Q38": { giver: G, location: "Warehouse 2", objective: "Locate the hidden object (from the Leg Pass head west, on the lower ledge).", rewards: "1500G, 100 EXP, Topple Resist II" },
    "4.6:Q39": { giver: G, location: "Escape Pod Bay (east)", objective: "Defeat 2 Devoted Arachno, 4 Resolute Arachno, 3 Zealous Arachno (cave south of Spring of Grief).", rewards: "2500G, 200 EXP, Bleed Defense III" },
    "4.6:Q40": { giver: "Marcia", location: "NW of Ether Light, active 11:00–02:00", objective: "Deliver biscuits to Jiroque (HtH street, night, park on the left), then report to Marcia (daytime).", rewards: "800G, 30 EXP, Swimming Sandals", strategy: "Affinity: registers Marcia & Jiroque; yellow link 'close'." },
    "4.6:Q41": { giver: "Dionysus", location: "Tranquil Square bench (HtH road), 10:00–02:00", objective: "Collect 2 lots of Medicinal Brog Oil (Cute Brogs, Anti-Air Battery 1, night), then report.", rewards: "600G, 50 EXP, Light Shoes" },
    "4.6:Q42": { giver: "Niranira", location: "Top of the stairs by the Tranquil Square HtH, daytime", objective: "Give Niranira's letter to Lukas (nearby), then report back.", rewards: "100G, 50 EXP, Block Guarder", strategy: "Affinity: yellow link 'Kind Friend' (Lukas/Niranira)." },
    "4.6:Q43": { giver: "Desirée", location: "Balcony behind the Gem Man's Stall (NE stairs), night", objective: "Inspect the watch at the Wep. Dev. Lab, collect 3 Blue Chains, repair it, return it to Desirée.", rewards: "750G, 80 EXP, Muscle Up II", strategy: "Prerequisite: Shulk must be party leader." },
    "4.6:Q44": { giver: "Suzana", location: "SW of Tranquil Square, daytime", objective: "Collect 2 lots of Black Nectar (Tephra Cave; easier to trade from Kenny Rohan), then report.", rewards: "500G, 50 EXP, Light Cap", strategy: "Prereq: speak to her son Moritz first. Trading with Kenny may unlock trial 'Friend Number Ten'." },
    "4.6:Q45": { giver: "Emmy Leater", location: "North Military District, daytime", objective: "Find Miller in the Commercial District, then report back.", rewards: "600G, 70 EXP, Dyed Top/Bottoms/Mules" },
    "4.6:Q46": { giver: "Françoise", location: "NW of Tranquil Square, in her flower garden, daytime", objective: "Collect 5 Dawn Hydrangeas (Colony 9), then report.", rewards: "750G, 100 EXP, Soil Gauntlets" },
    "4.6:Q47": { giver: "Lukas", location: "East Tranquil Square", objective: "Rescue Niranira (at Hazzai Cape), then report to Lukas / Moritz / Lukas.", rewards: "800G, 100 EXP, Attack Plus II" },
    "4.6:Q48": { giver: "Giorgio", location: "Ether Light restaurant, daytime", objective: "Collect 5 Dance Apples (Colony 9), then report.", rewards: "1200G, 60 EXP, Caravan Gauntlets" },
    "4.6:Q49": { giver: "Rocco", location: "In front of the Gem Man's Stall, daytime", objective: "Find someone to repair the pendant (Dean, alley south of the Wep. Dev. Lab — Shulk must be in the lead), then report.", rewards: "350G, 100 EXP, Tinted Glasses, Pretty Bangle", strategy: "Prereq: Sonia registered. IMPORTANT — before finishing, speak with Erik (midnight, leaving the Wep. Dev. Lab) to lock the Erik/Dean 'both scientists' link (trial 'constellation'); it's missable if you complete the sequel first." },
    "4.6:Q50": { giver: "Dean", location: "Alley south of the Weapon Development Lab, daytime", objective: "Speak with Sonia → collect 2 Shin Geckos (Tephra Cave; or trade Meifimeifi), then report.", rewards: "1500G, 200 EXP, Lock-On Resist II", strategy: "Prereq: Liliana registered. Shin Geckos are rare — patience or high Colony 9 affinity for the trade. (Trial: the strongest tie.)" },
    "4.6:Q51": { giver: "Suzanna", location: "Tranquil Square", objective: "Collect 2 Heavy Bunniv Iron (Iron Bunniv, south of Mag Mell Ruins, up the ramp), then report.", rewards: "1500G, 300 EXP, Ranger Cap" },
    "4.6:Q52a": { giver: "Monica", location: "Alley north of the Wep. Dev. Lab, 20:00", objective: "Collect a Tephra Drop (Spring of Grief, night), then report to Monica.", rewards: "1200G, 300 EXP, Soil Gear", strategy: "Prereq: Erik registered." },
    "4.6:Q52b": { giver: "Andreas", location: "North/NE of Monica's spot, 22:00", objective: "Collect a Tephra Drop (Spring of Grief, night), then report to Andreas.", rewards: "1200G, 300 EXP, Soil Boots",
      mutexWhy: "Guide picks ANDREAS. Whoever you choose gets a blue link with Monica, so it comes down to how the rejected suitor reacts: Andreas refuses rejection (red link) while Erik accepts it (orange) — so choosing Andreas leaves the stronger affinity chart. (First mutex; trial 'shaping history'.)" },
    "4.6:Q53": { giver: "Leopold", location: "Center of Ether Light, night", objective: "Meet King Squeeze (behind the Gem Man's Stall, night) — triggers a vision and Q54.", rewards: "—", strategy: "Prereq: Sylvaine registered. (Trial: Colony 9 Celeb.)" },
    "4.6:Q54a": { giver: "King Squeeze", location: "Colony 9", objective: "Speak with Sylvaine, collect the Top-Secret Orders (Anti-Air Battery 3 ramp), show King Squeeze.", rewards: "2500G, 500 EXP, Quark Boots" },
    "4.6:Q54b": { giver: "King Squeeze", location: "Colony 9", objective: "Speak with Leopold, collect 5 Caterpile Poison (Eater/Cute Caterpile, Caterpile Nest, Tephra Cave).", rewards: "2500G, 500 EXP, Ranger Shoes",
      mutexWhy: "Guide leans SYLVAINE (investigate route) but calls it a genuine personal choice — it's only +1 stronger. The real question is ethics vs. romance: taking matters into his own hands (Leopold/frame route) damages Leopold's reputation and his relationship with Sylvaine." },
    "4.6:UM8": { location: "Tephra Cave — Caterpile Nest.", strategy: "Easy. Poison-resist armour optional (Sharla covers it). Clear the caterpiles around him first. (Record: Walking Insecticide.)" },
    "4.6:Q55": { giver: "Giorgio", location: "Colony 9", objective: "Two routes: (Giorgio) collect 3 Fresh Armu Milk; or speak to Paola → collect 3 Insanity Mint (Tephra Cave) → report Paola → tell Giorgio.", rewards: "3000G, 300 EXP, HP Up II or Ether Defense Up II", strategy: "Paola's route is better for the affinity chart." },
    "4.6:Q56a": { giver: "Giorgio", location: "Colony 9", objective: "Speak with Paola → defeat Fiendish Bunnit (Cliff Lake, NE) → report Paola, then Giorgio.", rewards: "4500G, 550 EXP, Quark Leggings" },
    "4.6:Q56b": { giver: "Giorgio", location: "Colony 9", objective: "Collect 5 lots of Piranhax Roe (Leg Piranhax) + 3 Juicy Broccoli (Bionis' Leg).", rewards: "5500G, 250 EXP, Quark Gauntlets",
      mutexWhy: "Guide picks PAOLA — speak with her during 'Overworked and Underpaid' to unlock 'Out-Of-Luck Giorgio', which gives a stronger father/daughter link than the alternative 'Pestering Paola'." },
    "4.6:Q57": { giver: "Sesame", location: "East of the Gem Man's stall, behind the boxes, night", objective: "Collect 2 Croaking Brog Bags (Singing Brogs) → deliver to Betty for the Sealed Package → Sesame.", rewards: "1000G, 150 EXP, Critical Up II" },
    "4.6:Q58": { giver: "Sesame", location: "Colony 9 (night)", objective: "Collect 2 Iron Krabble Shells (Colony Krabble, Cliff Lake shore, night) → deliver to Kenny Rohan for the Fragile Package → Sesame.", rewards: "1500G, 200 EXP, Strength Up III", strategy: "Prereq: The Plan: Preparation completed." },
    "4.6:Q59": { giver: "Sesame", location: "Colony 9", objective: "Defeat Dark Murakmor → report, check the lamp post by the Main Entrance → report (triggers a cutscene).", rewards: "5000G, 1200 EXP, Attack Stability II", strategy: "Prereq: all earlier 'The Plan' quests." },
    "4.6:UM9": { location: "Anti-Air Battery 3 summit (from Tranquil Square go NE, jump the fence, swim west, climb the battery).", condition: "Night only", strategy: "Immune to break — just plow through. (Trial: Pro Hunter.)" },
    // Bionis' Leg quests (still §4.6)
    "4.6:Q60": { giver: HT, location: "East of the Raginar Canyon Path", objective: "Defeat 2 Leg Ardun (Gaur Plain).", rewards: "1500G" },
    "4.6:Q61": { giver: HT, location: "East of the Raginar Canyon Path", objective: "Defeat 3 Maker Bunnits (Gaur Plain, north).", rewards: "1200G" },
    "4.6:Q62": { giver: HT, location: "East of the Raginar Canyon Path", objective: "Defeat 5 Field Ponios (Gaur Plain, day).", rewards: "2500G" },
    "4.6:Q63": { giver: HT, location: "East of the Raginar Canyon Path", objective: "Defeat 3 Leg Volff (Gaur Plain, night).", rewards: "1800G" },
    "4.6:Q64": { giver: RF, location: "Up the hill west of the lake, Refugee Camp, day", objective: "Find the Bird Necklace (out the north of camp, east, via Kisk Cave to the plateau beyond).", rewards: "2500G, 200 EXP" },
    "4.6:Q65": { giver: RF, location: "East shore of the Refugee Camp lake, night", objective: "Collect the Torn Paper (Gaur Plain southern peninsula — high-level area, use stealth).", rewards: "2000G, 200 EXP" },
    "4.6:Q66": { giver: RF, location: "Inside the Refugee Camp cave (south of the HtH), night", objective: "Collect 2 Clear Almonds (Tephra Cave).", rewards: "1000G" },
    "4.6:Q67": { giver: RF, location: "Refugee Camp, east shore of the lake, day", objective: "Collect 3 Moth Crawlers (Bionis' Leg).", rewards: "1500G" },
    "4.6:Q68": { giver: RF, location: "On the trail into the Refugee Camp", objective: "Defeat Violent Andante.", rewards: "3800G" },
    "4.6:UM10": { location: "SE of Kamos Guidepost.", strategy: "Nothing new — standard break/topple." },
    "4.6:Q69": { giver: RF, location: "North of the lake at the Refugee Camp, day", objective: "Defeat Vagrant Alfead (Tirkin Headquarters — NW of Kamos Guidepost, in the cavern).", rewards: "4800G" },
    "4.6:UM11": { location: "Tirkin Headquarters (atop the hill).", strategy: "Standard — just don't get surprised." },
    "4.6:Q70": { giver: RF, location: "Refugee Camp, east of the lake by the cliffs, day", objective: "Defeat 2 Basin Antols (forested area leading into the camp).", rewards: "2000G" },
    "4.6:Q71": { giver: RF, location: "West side of the Refugee Camp lake", objective: "Defeat 5 Mechon M64 (Maguel Road — no rush, you pass there later).", rewards: "2500G" },
    "4.6:Q72": { giver: RF, location: "West side of the Refugee Camp lake", objective: "Defeat 2 Brave Tirkins (Tirkin Headquarters).", rewards: "5000G" },
    "4.6:Q73": { giver: RF, location: "Refugee Camp", objective: "Collect 2 Brog Leg Meat (Leg Brog) + 2 Fertile Flamii Egg (Oasis Flamii) — Raguel Lake central island, during a thunderstorm.", rewards: "1000G" },
    "4.6:Q74": { giver: RF, location: "Refugee Camp cavern (Gorman), night", objective: "Collect 2 Tirkin Crests (Javelin Tirkins, Tirkin HQ) + 2 Tirkin Tail Feathers (Archer Tirkins, south of Jacob's Rock).", rewards: "1500G" },
    "4.6:Q75": { giver: RF, location: "Refugee Camp", objective: "Collect 1 Bunnit Sapling (Slugger Bunnit, north of Jacob's Rock Rest Area).", rewards: "1200G" },
    "4.6:Q76": { giver: RF, location: "Refugee Camp (Gorman), night", objective: "Collect 3 Vang Third Molars (Gust Vangs, Kisk Cave).", rewards: "1200G" },
    "4.6:Q77": { giver: "Gorman", location: "Refugee Camp cave interior, night", objective: "Retrieve the stolen Clothes (Tirkin Headquarters) and return them to Gorman.", rewards: "950G, 300 EXP, Grand Armour, Grand Leggings", strategy: "⏱ TIMED — locks at Colony 6 reconstruction (§4.11). Registers Gorman." },
    "4.6:Q78": { giver: "Olga", location: "Refugee Camp cave, daytime", objective: "Collect 5 lots of Glowing Wisp fluid (wisps at night, east of Jacob's Rock through the Gaur Plains — not raining).", rewards: "750G, 300 EXP, Quark Gear", strategy: "⏱ TIMED. Prereq: Gorman registered. Yellow link 'customer' (Gorman/Olga)." },
    "4.6:Q79": { giver: "Matryona", location: "Refugee Camp cavern, daytime", objective: "Speak with Ewan → collect 3 Ponio Neck Meat (Field Ponios, east Gaur Plains, day) → Ewan → Matryona.", rewards: "1200G, 280 EXP, Quark Armour", strategy: "⏱ TIMED. Orange link 'bad feeling' (Ewan/Matryona)." },
    "4.6:Q80": { giver: "Ewan", location: "Refugee Camp cave interior, daytime", objective: "Collect 4 Sour Gooseberries (Bionis' Leg) → Ewan → deliver items to Matryona → Ewan.", rewards: "750G, 200 EXP, Lime Bangle", strategy: "⏱ TIMED. Prereq: A Thoughtful Idea. Link improves to yellow 'interested'." },
    "4.6:Q81": { giver: "Satata", location: "Refugee Camp, south shore of the lake, daytime", objective: "Collect 3 Sticky Web fibers (Leg Arachno, Kisk Cave) → Satata → Kokori → Satata.", rewards: "1000G, 220 EXP, Initial Tension III", strategy: "⏱ TIMED. Prereq: Nikita registered. Blue link 'close family' (Satata/Kokori)." },
    "4.6:Q82": { giver: "Earnest", location: "Shore of the lake outside the Refugee Camp", objective: "Examine the ether mine at Kisk Cave, then report to Earnest.", rewards: "750G, 300 EXP, Lime Bangle" },
    "4.6:Q83": { giver: "Surprise Quest", location: "Gaur Plains, waterfall SE of Jacob's Rock Rest Area", objective: "Defeat 4 Ferocious Volff near the waterfall, then report to the girl.", rewards: "1200G, 300 EXP, Diver Top, Diver Bottoms", strategy: "⏱ TIMED." },
    "4.6:UM12": { location: "Raguel Lake, central island.", condition: "Thunderstorms only", strategy: "—" },
    "4.6:UM13": { location: "NE of 'plain' on the lower map (Gaur Plains).", condition: "Rain or thunderstorm", strategy: "Clear the volff allies first; not a hard fight." },
    "4.6:UM14": { location: "North of the Jacob's Rock Rest Area.", strategy: "—" },
    "4.6:Q84": { giver: RF, location: "Refugee Camp, trail into camp", objective: "Defeat White Eduardo.", rewards: "5500G" },
    "4.6:Q85": { giver: "Satata", location: "South shore of the lake outside the Refugee Camp", objective: "Defeat the Abnormal Brog (Raguel Lake central island), then report to Satata.", rewards: "1100G, 400 EXP, Sleep Resist II", strategy: "⏱ TIMED. Prereq: Being a Good Grandfather." },
    "4.6:Q86": { giver: "Earnest", location: "Bionis' Leg", objective: "Examine the ether deposit at Tranquil Grotto, then report to Earnest.", rewards: "—", strategy: "Prereq: Earnest's Fibs." },
    "4.6:Q87a": { giver: "Matryona", location: "Refugee Camp cave interior, daytime", objective: "Collect 1 Lake Drop (Raguel Lake, east shore north of Tranquil Grotto) → Matryona → give the picture book to Pama.", rewards: "1500G, 250 EXP, Damage Heal II", strategy: "⏱ TIMED. Prereq: A Dash of Colour + A Thoughtful Idea." },
    "4.6:Q87b": { giver: "Arda", location: "Refugee Camp cave interior (rear), daytime", objective: "Collect a Medicinal Herb (from Raguel Bridge: North, SE down the slope under a tree) → Arda.", rewards: "800G, 400 EXP, Arts Heal II",
      mutexWhy: "Guide picks IMAGINATIONS TEMPERED (get the Lake Drop). It gives a clearly better affinity chart; Ewan & Matryona reach green either way, but this route is cleaner. Spirits Raised's only edge is slightly earlier Colony 6 area affinity — negligible since you'll max every area's affinity anyway. ⏱ Both are TIMED." },
    "4.6:HTH3": { location: "Interior of the Refugee Camp cave", gainChoices: "You, by a whisker. // You have dignified qualities." },

    // ---- 4.7: Upper Bionis' Leg & Early Loose Ends ----
    "4.7:UM15": { location: "Tephra Cave — SE of the Mag Mell Ruins, in a small enclave.", strategy: "Easy — a single Back Slash can take him out." },
    "4.7:UM16": { location: "Tephra Cave — Spring of Grief.", condition: "Night only" },
    "4.7:UM17": { location: "Tephra Cave — Vilia Lake." },
    "4.7:Q88": { giver: RF, location: "North of the lake at the Refugee Camp, day", objective: "Defeat Trainer Harmeleon (north of Spiral Valley).", rewards: "4200G" },
    "4.7:UM18": { location: "Bionis' Leg — north of Spiral Valley.", strategy: "Plow with arts; watch the two Berserk Ardun escorting him." },
    "4.7:Q89": { giver: "Earnest", location: "Bionis' Leg", objective: "Place flowers on the grave (NE of Spiral Valley, across the river) and defeat Arrogant Tirkin, then report.", rewards: "1200G, 750 EXP, Grand Boots", strategy: "Prereq: Earnest's Mischief. Speak to Ewan afterward → green 'relief'." },
    "4.7:Q90": { giver: "Gerugu", location: "Traveller's Rest", objective: "Locate Gerugu (from Raguel Bridge: South go NW past the wind ether mine, on the ledge below), then report.", rewards: "750G, 300 EXP, Point Rifle" },
    "4.7:Q91": { giver: "Batubatu", location: "Traveller's Rest", objective: "Find a Tokilos' Egg (east of Zax Guidepost — stealth) and a Pandora Mushroom (Windy Cave below Spiral Valley — sound-stealth).", rewards: "1000G, 450 EXP, Spike II" },
    "4.7:Q92": { giver: "Gerugu", location: "Traveller's Rest", objective: "Locate Batubatu (land bridge to Believer's Paradise) → collect an Ether Rose (Believer's Paradise) → Batubatu.", rewards: "1200G, 750 EXP, Electric Plus III, Grand Gear", strategy: "Affinity → green 'valuable friend' (their best)." },
    "4.7:UM19": { location: "Bionis' Leg — from Bask Cave Passage, the island connected by a ramp; the wisp by Kasharpa Falls (NE) is the target.", condition: "Clear weather, night only", strategy: "Target it so it flies to the cliff by the passage, run up the ramp, and use Lure to engage." },
    "4.7:Q93": { location: "Colony 9 — HtH street, alley on the right then west to Jackson", objective: "Find Jackson a mentor (Kenny Rohan or Giorgio) → Vilia Lake, defeat 5 Tephra Lizards → report.", rewards: "2200G, 450 EXP, Ether Up III", strategy: "Prereq: Dorothy registered (Main Entrance)." },
    "4.7:Q94a": { giver: "Jackson", location: "Colony 9", objective: "Defeat Dim Wisp (Kneecap Hill, night), then report.", rewards: "3800G, 650 EXP, Ether Up II" },
    "4.7:Q94b": { giver: "Jackson", location: "Colony 9", objective: "Collect 5 Raw Piranhax Meat (Colony Piranhax, pool under Outlook Park).", rewards: "3800G, 650 EXP, Pile Driver",
      mutexWhy: "Guide picks JACKSON THE POET (choose Kenny Rohan as mentor): Jackson's link with his teacher is stronger (blue vs green) and Kenny Rohan's link with Giorgio is better (green vs yellow); Dorothy's link is unaffected." },
    "4.7:Q95": { giver: "Kenny Rohan", location: "Colony 9", objective: "Gather info on the mysterious light — speak Suzanna, Françoise, Dionysus → Kenny.", rewards: "2200G, 700 EXP, Auto-Attack Stealth II" },
    "4.7:Q96": { giver: "Kenny Rohan", location: "Colony 9", objective: "Mend the ether lamp, OR throw it away.", rewards: "3400G, 950 EXP, Iron Armor",
      mutexWhy: "Guide picks THROW IT AWAY (use the guardrail south of Central Plaza) — it's done here and now; mending requires farming and a later region for a negligible reward difference." },
    "4.7:Q97": { giver: "Emmy Leater", location: "Colony 9 (Military District entrance, day)", objective: "Defeat 5 Wind Vangs (Spring of Grief), then report.", rewards: "1100G, 180 EXP, Ether Defense Up III", strategy: "Prereq: Raoul registered." },
    "4.7:Q98": { giver: "Emmy Leater", location: "Colony 9", objective: "Defeat Lurker Krabble (Vilia Lake) or Lurker Brog (Spring of Grief), then report.", rewards: "1800G, 250 EXP, Flame Gear", strategy: "Either target is fine — same reward & affinity. (Trial: generous friend.)" },

    // ---- 4.8: Colony 6 first visit ----
    "4.8:Q99": { giver: "Daza", location: "Watchpoint Junction", objective: "Find the Nopon Coin (down the elevator to Splintered Path; at the second fork go SE then south), then report.", rewards: "850G, 320 EXP, Break II", strategy: "Registers Daza." },
    "4.8:Q100": { giver: "Daza", location: "Watchpoint Junction", objective: "Defeat 4 Yellow Antols (Splintered Path), 6 Soft Hoxes (Watchpoint Junction), 3 Water Upa (rainstorm at the Drainage Outlet).", rewards: "900G, 400 EXP, Pelt Top, Pelt Bottoms" },
    "4.8:UM20": { location: "NE of the Drainage Outlet.", condition: "Rain or thunderstorm only" },
    "4.8:Q101": { giver: "Daza", location: "Watchpoint Junction", objective: "Deliver Daza's letter to Gerugu → take Gerugu's response back to Daza.", rewards: "1000G, 500 EXP, Slow III, Top Secret Data", strategy: "Affinity → green 'companions' (Gerugu/Daza)." },

    // ---- 4.9: Ether Mine ----
    "4.9:UM21": { location: "Glowmoss Lake.", strategy: "Mostly ether attacks — keep him toppled (he's susceptible to break)." },
    "4.9:UM22": { location: "Stairs near Test Pit 4." },
    "4.9:UM23": { location: "Fire Ether Deposits near Test Pit 4.", strategy: "Likely unlocks the records Fire It Up and Unbreakable Bond." },
    "4.9:HTH4": { location: "Bionis' Leg (needs blue Shulk/Sharla affinity and Juju seen to safety)", gainChoices: "I wish I had it. // You can save someone's life!" },

    // ---- 4.10: Satorl Marsh ----
    "4.10:Q101b": { giver: "Cheryl", location: "Balcony north of the Gem Man's Stall, Colony 9, day", objective: "Collect 3 uniform pieces — Tatty Armor (Spring of Grief, Tephra Cave), Twisted Gun (north of the Observation Platform, Bionis' Leg), Nicked Knife (by the Shining Pond, Satorl Marsh) — then report.", rewards: "4500G, 1500 EXP, Bomber Lancer", strategy: "After completion, speak Marcia (blue 'friends always'), Cheryl (green 'old friends'), Jan (green 'old suitor')." },
    "4.10:Q102": { giver: "Nopon Merchant", location: "Nopon Merchant Camp", objective: "Defeat 2 Detox Brogs (Crown Tree).", rewards: "5800G" },
    "4.10:Q103": { giver: "Nopon Merchant", location: "Nopon Merchant Camp", objective: "Defeat 3 Coppice Quadwings (Lacus Swamp, day).", rewards: "5200G" },
    "4.10:Q104": { giver: "Nopon Merchant", location: "Nopon Merchant Camp", objective: "Defeat 2 Mist Rhouguls (Barren Moor, day).", rewards: "6800G" },
    "4.10:Q105": { giver: "Nopon Merchant", location: "Nopon Merchant Camp", objective: "Defeat 1 Officer Volff (NW of Barren Moor, day).", rewards: "6500G" },
    "4.10:Q106": { giver: "Bokoko", location: "Nopon Merchant Camp", objective: "Find and save Kacha (Exile Fortress interior).", rewards: "3500G, 410 EXP, Jungle Cap/Gloves/Shoes", strategy: "Green link 'like family' (Kacha/Bokoko)." },
    "4.10:UM25": { location: "Zaldandia Falls.", condition: "Day + clear weather only" },
    "4.10:UM26": { location: "Plateau above Poison Swamp.", strategy: "Has Igna allies — clear them one by one first; he's far easier alone." },
    "4.10:UM27": { location: "Plateau SE of the Silent Obelisk." },
    "4.10:Q107": { giver: "Zazadan", location: "Nopon Refuge", objective: "Collect 5 Lemon Stones + 2 Twin Flamii Eggs (Lacus Swamp).", rewards: "2400G, 400 EXP, Mist Gel/Cream/Sandals", strategy: "Registers Zazadan." },
    "4.10:Q108": { giver: "Zazadan", location: "Nopon Refuge", objective: "Defeat 8 Ogre Bunnia (Glowing Obelisk).", rewards: "3200G, 680 EXP, Swep Gear, Agility Up II" },
    "4.10:Q109": { giver: "Zazadan", location: "Nopon Refuge", objective: "Defeat Sunlight Sachik.", rewards: "4500G, 850 EXP, Swep Gauntlets, HP II" },
    "4.10:UM29": { location: "Silent Obelisk.", condition: "Day + clear weather only", strategy: "Immune to break (no topple) — reserve the party gauge for revives. Level Shield to 2 to block his talent art; Shulk leads, Sharla heals." },
    "4.10:Q110": { giver: "Zazadan", location: "Nopon Refuge", objective: "Collect a Nopon Potion (cavern south of the Nopon Merchant Camp).", rewards: "5100G, 1000 EXP, Swep Boots, Ether Up II" },
    "4.10:Q111": { giver: "Zazadan", location: "Nopon Refuge", objective: "Investigate the Shining Pond (dip the Red Pollen Orb to get Highmore Caviar).", rewards: "5800G, 1500 EXP, Pioneer" },
    "4.10:Q112": { giver: "Zazadan", location: "Nopon Refuge", objective: "Deliver the Highmore Caviar to Dedeba (he's in Frontier Village — reachable at §4.14).", rewards: "7800G, 2500 EXP, Panther Bottoms" },
    "4.10:Q113": { giver: "Bokoko", location: "Nopon Merchant Camp", objective: "Collect 4 Feather Leaves, 3 Wool Rocks, 3 Fancy Volff Hides, 4 Glowing Upa Seeds.", rewards: "10500G, 1000 EXP, Iron Armour, Nopon Boots" },
    "4.10:Q114": { giver: "Kacha", location: "Nopon Merchant Camp", objective: "Defeat 5 Deluded Igna, dig up the Giant's Key, then use the Wall of Sin → Exile Fortress roof altar → report.", rewards: "5900G, 2200 EXP, Recovery Up IV" },
    "4.10:Q115": { giver: "Kacha", location: "Nopon Merchant Camp", objective: "Collect the Giant's Mirror (Daksha Shrine) → offer it at the Exile Fortress roof altar → run → report.", rewards: "9100G, 3100 EXP, Double Attack IV, Daring Of The Giants" },
    "4.10:HTH7": { location: "Mining Base (Ether Mine)", gainChoices: "It's a beautiful watch. // I can fix it!" },
    "4.10:HTH8": { location: "Zaldandia Waterfall", condition: "Night only", gainChoices: "Really? Interesting. // Will it ever run out?" },
    "4.10:Q116": { location: "Sororal Statues", objective: "Prepare for the ceremony (collect the Offerings), then use the Adulthood Emblem → defeat the Lv. 28 Satorl Guardian.", strategy: "Story quest." },
    "4.10:Q117": { location: "Sororal Statues", objective: "Collect the Radiant Offerings — White (Basin Cave), Rainbow (Altar of Fate), Dull (Dark Swamp island), Blue (SW Igna Territory).", strategy: "Story quest." },
    "4.10:UM30": { location: "Altar of Fate base, SE." },
    "4.10:UM31": { location: "SW Igna Territory.", strategy: "Guards the Blue Radiant for the ceremony." },
    "4.10:UM32": { location: "Daksha Shrine (Bionis' Leg)." },

    // ---- 4.2 story ----
    "4.2:Q1": { giver: "Story", location: "Outlook Park", objective: "Find Shulk at Outlook Park and offer him the food." },

    // ---- 4.11: Opening Colony 6 ----
    "4.11:Q118a": { giver: "Otharon", location: "Main Entrance (Colony 6)", objective: "Defeat Black Smoke Hox + 6 White Smoke Hox (Raguel Bridge), then report to Juju at the Refugee Camp.", rewards: "12000G, 550 EXP, AP Up I, EXP Up I" },
    "4.11:Q118b": { giver: "Dulland", location: "Colony 6", objective: "Same as 'To Colony 6!' — but it's only offered much later. Do 'To Colony 6!' now." },
    "4.11:Q119": { giver: "Jan", location: "Colony 9", objective: "Defeat Elder Gragus in Makna Forest (by the Nopon Arch), then report to Jan.", rewards: "5800G, 5000 EXP, Dawn Staff", strategy: "Prereq: Jan/Minnie link + tell Dionysus 'he's too old for the girl'." },
    "4.11:Q120": { giver: "Anna", location: "Reconstruction HQ, day", objective: "Speak with Kikori (near Nikita, by the Drainage Control Room), then report to Anna.", rewards: "4200G, 680 EXP, Pierce Resistance II" },
    "4.11:Q121": { giver: "Satata", location: "Reconstruction HQ, day", objective: "Collect the Mushroom Cap at the Mining Base (Ether Mine).", rewards: "4200G, 700 EXP, Iron Armour, Iron Leggings" },
    "4.11:Q122": { giver: "Satata", location: "Colony 6", objective: "Cast the Mushroom Cap from the Divine Sanctuary in Makna Forest (reachable at §4.13).", rewards: "6500G, 850 EXP, Jungle Shoes" },
    "4.11:Q123": { giver: "Olga", location: "Reconstruction HQ, night", objective: "Collect 1 Chew Radish (Colony 9), 2 Red Durian (Bionis' Leg), 1 Sirius Anemone (Colony 6).", rewards: "3600G, 620 EXP, Recovery Up II" },
    "4.11:Q124": { giver: "Gorman", location: "Reconstruction HQ, night", objective: "Collect the Divine Rock from the Spiral Valley summit (do 'Making A New Path' first for the route).", rewards: "4400G, 680 EXP, Spike III" },
    "4.11:Q125": { giver: "Gorman", location: "Colony 6", objective: "Collect 3 Dynamite sticks from the Ether Mine (Test Pits 2, 3, 4), then report.", rewards: "—" },
    "4.11:Q126": { giver: "Ewan", location: "Reconstruction HQ, night", objective: "Speak with Satata, Olga, Gorman, Anna, then report.", rewards: "3500G, 620 EXP, Bleed Defense III", strategy: "Prereq: the 'Spirits Raised' path was chosen." },
    "4.11:Q127": { giver: "Ewan", location: "Colony 6", objective: "Defeat Elegant Marin (Glowmoss Lake, Ether Mine) or the Hungry Volff (south of Place of Judgement, Satorl).", rewards: "3700G, 650 EXP, Daze Tension III" },
    "4.11:Q128": { giver: "Matryona", location: "Reconstruction HQ, night", objective: "Collect a Lake Drop (Raguel Lake) or Nasty Weed (Satorl) → Matryona → give painting to Ewan → Matryona.", rewards: "4500G, 700 EXP", strategy: "Guide: lake drop → green 'likes'." },
    "4.11:Q129": { giver: "Gem Man", location: "Colony 9", objective: "Develop Colony 6 to Lv.1 and collect the Ultra Small Reactor, then report.", rewards: "1000 EXP, Mobile Furnace" },
    "4.11:Q130": { giver: "Desirée", location: "Colony 9", objective: "Hear her story, then choose a career path for her.", rewards: "8000G, 4500 EXP, Swep gear, Phulk's Pessimism skill tree", mutexWhy: "No clear winner (the two routes score equal). Guide leans SOLDIER — it preserves Betty's friendship with Desirée over Betty's one-sided crush on Kenny Rohan." },

    // ---- 4.13: Makna Forest ----
    "4.13:Q131": { giver: "Nopon Merchant", location: "Agni Tablet", objective: "Defeat 5 Jungle Quadwings (Nopon Arch / hill north of Agni Tablet).", rewards: "15000G" },
    "4.13:Q132": { giver: "Nopon Merchant", location: "Agni Tablet", objective: "Defeat 2 Makna Feris (Waypoint Beacon).", rewards: "9600G" },
    "4.13:Q133": { giver: "Nopon Merchant", location: "Agni Tablet", objective: "Defeat 2 Makna Ansels (Eks' Watering Hole, near the bridges).", rewards: "8500G" },
    "4.13:Q134": { giver: "Nopon Merchant", location: "Agni Tablet", objective: "Defeat 3 Makna Eks (Eks' Watering Hole).", rewards: "12000G" },
    "4.13:Q135": { giver: "Story", location: "Nopon Arch", objective: "Collect Water Ether Crystals at the Lakeside, then return to the Nopon Arch." },
    "4.13:UM33": { location: "Nopon Arch — climb the ramp to the right (watch the quadwings)." },

    // ---- 4.14: Frontier Village ----
    "4.14:Q136": { giver: "Story", location: "Frontier Village", objective: "Obtain the Warrior Gnasher (weapon shop, Kyn Shopping Street) and Sabre Gloves (armor shop, Sacred Altar) for Riki." },
    "4.14:Q137": { giver: "Nopon Merchant", location: "Agni Tablet (Makna)", objective: "Defeat Shimmering Forte.", rewards: "25000G" },
    "4.14:UM34": { location: "Makna Forest — NW of Twisted Tree Gate.", condition: "Hot day (a high-level Bargus Nebula nearby indicates it)." },
    "4.14:Q138": { giver: "Nopon Villager", location: "East of Nopon Tower, night (climb the tree trunk)", objective: "Defeat 3 Itmos Upa (NW alcove of Eks' Watering Hole).", rewards: "12500G" },
    "4.14:Q139": { giver: "Nopon Villager", location: "Frontier Village", objective: "Defeat 2 Wahpol Sardi (same river as Part 1).", rewards: "11000G" },
    "4.14:Q140": { giver: "Nopon Villager", location: "Frontier Village", objective: "Defeat 1 Vanaes Nebula (same location, while raining).", rewards: "7500G" },
    "4.14:Q141": { giver: "Nopon Villager", location: "Sacred Altar, day", objective: "Defeat 3 Terra Olugas (SE of Twisted Tree Gate).", rewards: "10000G" },
    "4.14:Q142": { giver: "Nopon Villager", location: "Sacred Altar, day", objective: "Defeat 2 Ammos Orlugas (Precipice Bridge).", rewards: "13000G" },
    "4.14:Q143": { giver: "Frontier Villager", location: "Sacred Altar, day", objective: "Defeat 3 Arena Orlugas (Precipice Bridge).", rewards: "9000G" },
    "4.14:Q144": { giver: "Nopon Villager", location: "North of the Reservoir stairs, bottom floor, day", objective: "Defeat Agile Albarto.", rewards: "23000G" },
    "4.14:UM35": { location: "Makna Forest — Seahorse Islet (go SW to the riverbank; lure it to the bank)." },
    "4.14:Q145": { giver: "Nopon Villager", location: "Archaeology Center, night", objective: "Defeat Lazy Bluco (Yellow Flower Grove).", rewards: "29000G" },
    "4.14:UM36": { location: "Makna Forest — Yellow Flower Grove.", condition: "Night only" },
    "4.14:Q146": { giver: "Nopon Villager", location: "Kyn Shopping Street, night", objective: "Collect 2 Cool Potatoes (Colony 9).", rewards: "5000G" },
    "4.14:Q147": { giver: "Nopon Villager", location: "SE of Nopon Tower, lower level, day", objective: "Collect 2 Pure Cherries (Makna Forest).", rewards: "10500G" },
    "4.14:Q148": { giver: "Nopon Villager", location: "Chief's Residence SE platform, night", objective: "Collect 4 Ash Foxes (Makna Forest).", rewards: "7500G" },
    "4.14:Q149": { giver: "Nopon Villager", location: "Contemplation Terrace, day", objective: "Collect 5 Venomous Lizards (Makna; trade Minana).", rewards: "9000G" },
    "4.14:Q150": { giver: "Nopon Villager", location: "West of Nopon Tower, day", objective: "Collect 2 Magic Stones (Deinos at Waypoint Junction / Twisted Tree Gate).", rewards: "8000G" },
    "4.14:Q151": { giver: "Nopon Villager", location: "North of the Armour Shop, Sacred Altar, night", objective: "Collect 5 Fancy Orluga Masks (Sabulum Orluga, Precipice Bridge).", rewards: "12000G" },
    "4.14:Q152": { giver: "Nopon Villager", location: "Prophecy Hut, night", objective: "Collect 3 Upa Ember (Itmos Upa, Eks' Watering Hole NW / Seahorse Islet riverbank).", rewards: "16500G" },
    "4.14:Q153": { giver: "Nopon Villager", location: "Balcony downstairs from Pollen Works, day", objective: "Find the Flower Bracelet (east of Nopon Tower, lower floor, NW).", rewards: "5000G, 3000 EXP" },
    "4.14:Q154": { giver: "Nopon Villager", location: "One flight down from the Archaeology Center, night", objective: "Find the Deinos Hook (SE corner of the Contemplation Terrace).", rewards: "4000G, 1600 EXP" },
    "4.14:Q155": { giver: "Nopon Villager", location: "Underground Store, night (jump the ledge)", objective: "Find the Shiny Ball (one flight up from the Archaeology Center, NW plateau).", rewards: "3800G, 1800 EXP" },
    "4.14:Q156": { giver: "Leku", location: "Landing up from Riki's House, day", objective: "Collect 10 Peachy Leg Joints (Deinos in Makna / trade Bana).", rewards: "3200G, 800 EXP, Chill Defense IV", strategy: "Prereq: Kilaki registered." },
    "4.14:Q157": { giver: "Leku", location: "Frontier Village", objective: "Speak with Lupa, Modamo and Pepa, then report to Leku.", rewards: "3800G, 950 EXP, Blaze Defense IV" },
    "4.14:Q158": { giver: "Kilaki", location: "Frontier Village", objective: "Collect 2 Tasty Ansel Wings (Makna Ansel, Eks' Watering Hole / trade Bana).", rewards: "4300G, 1100 EXP, Poison Defense IV, Kilaki's Note" },
    "4.14:Q158b": { giver: "Leku", location: "Frontier Village", objective: "Defeat Obsessive Galgaron, then report to Leku.", rewards: "5500G, 1500 EXP, Panther Gloves" },
    "4.14:UM37": { location: "Makna Forest — Hode Lair interior (deep in the cave).", condition: "Only during 'Beat Kilaki To It!'", strategy: "Clear reinforcements; fight away from sunrise (it summons more)." },
    "4.14:Q159": { giver: "Leku", location: "Frontier Village", objective: "Speak with Pepa or Lupa (Leku's fiancée) → fetch their item → report.", rewards: "11000G, 2800 EXP, Shell Boots", mutexWhy: "Guide picks PEPA — it preserves the ability to build a green Pachipa/Pepa link, which Lupa forfeits." },
    "4.14:Q160": { giver: "Modamo", location: "Frontier Village", objective: "Defeat 5 Inferno Deinos + 5 Plasma Deinos (Twisted Tree Gate).", rewards: "7500G, 2000 EXP, Jungle Top, Jungle Bottoms" },
    "4.14:Q161": { giver: "Rono", location: "Pollen Works, night (Shulk in the lead)", objective: "Get the mixer materials → Wep. Dev. Lab → deliver to Rono.", rewards: "3800G, 1200 EXP, Good Footing IV" },
    "4.14:Q162": { giver: "Rono", location: "Frontier Village", objective: "Collect 2 Generic Shafts (Mechon M64) + 2 Generic Blades (Mechon M53), both on Maguel Road.", rewards: "—" },
    "4.14:Q163": { giver: "Pepa", location: "Frontier Village", objective: "Collect 6 Enigma Lotus (Makna), 4 Happy Rabbit (trade Arnault), 3 Love Crane (Ether Mine / Glowmoss Lake).", rewards: "5200G, 1050 EXP, Jungle Cap", strategy: "Completion → trial 'Honorary Nopon'." },
    "4.14:Q164": { giver: "Kokora", location: "Nopon Tower, day", objective: "Speak Abada → collect 3 Shield Bug (Makna / trade Miko) → Abada → Kokora.", rewards: "3600G, 950 EXP, Sky Cap", strategy: "Prereq: Deki registered." },
    "4.14:Q165": { giver: "Kofuko", location: "Armour Shop, night", objective: "Collect 8 Kelp Mushrooms (Makna Forest).", rewards: "1000G, 1150 EXP, Jungle Gloves, Bleed Attack II" },
    "4.14:Q166": { giver: "Migaga", location: "Sacred Altar, day", objective: "Repair the time mushrooms (Kyn Shopping Street / upstairs from Pollen Works / up from the Chief's Residence) → Migaga.", rewards: "4000G, 1150 EXP, Agility Down III" },
    "4.14:Q167": { giver: "Migaga", location: "Frontier Village", objective: "Speak with Kofuko (triggers the brew quest).", rewards: "3500G, 1000 EXP, Sky Gloves, Aerial Cloak II", strategy: "⚠ SELL all your Walnut Grapes first (a glitch forces them if in stock)." },
    "4.14:Q168": { giver: "Kofuko", location: "Frontier Village", objective: "Collect 4 Walnut Grapes (Bionis' Leg) OR 2 Bitter Kiwi (Makna).", rewards: "3400G, 850 EXP, Sky Shoes, Terrain Defense II", mutexWhy: "Use BITTER KIWI → blue 'happily married'. Walnut Grapes → red 'rocky marriage'." },
    "4.14:Q169": { giver: "Pipiki", location: "West of Sacred Altar, day", objective: "Speak Tati (Nopon Kitchen, night) → collect 3 Hode Camouflage (Bois Hode, Precipice Bridge).", rewards: "5800G, 2000 EXP, Panther Top" },
    "4.14:Q170": { giver: "Dobadoba", location: "Pollen Orb Storehouse, day", objective: "Collect 5 Yellow Pollen (Yellow Flower Grove).", rewards: "5000G, 1500 EXP, Panther Bottoms, First Attack Plus III" },
    "4.14:Q171": { giver: "Deki", location: "Frontier Village", objective: "Collect 2 Green Eluca Juice (Makna Eluca, Yellow Flower Grove) → Abada → Deki.", rewards: "4200G, 1000 EXP, Night Vision IV" },
    "4.14:Q172": { giver: "Tati", location: "Frontier Village", objective: "Gather the musical collectables (Things That Hum + Things That Rumble) → Tati.", rewards: "10000G, 6500 EXP, Climb Armour, Climb Leggings, Quick Step III" },
    "4.14:Q173": { giver: "Tati", location: "Frontier Village", objective: "Collect 2 Humming Plum (Bionis' Leg), 2 Humming Cabbage (Satorl), 2 Humming Cat (Satorl), 2 Humming Nettle (Makna)." },
    "4.14:Q174": { giver: "Tati", location: "Frontier Village", objective: "Collect 2 Rumble Stoneflies (Tephra), 2 Rumble Coal (Ether Mine), 2 Rumble Part (Satorl), 2 Rumble Box (Frontier Village)." },
    "4.14:Q175": { giver: "Rasha", location: "Sacred Plaza SW, day", objective: "Collect Filtered Water (Sparkling Pool, day) → Cherri → Rasha.", rewards: "6000G, 2100 EXP, Buff Time Plus II", strategy: "Prereq: Cherri registered." },
    "4.14:Q176": { giver: "Rasha", location: "Frontier Village", objective: "Defeat 5 Makna Eluca (Yellow Flower Grove) → Cherri → Rasha.", rewards: "3200G, 900 EXP, Mist Gel/Cream/Sandals" },
    "4.14:Q177": { giver: "Lupa", location: "Frontier Village", objective: "Get the nopon-potion materials (Secret Elixir Ingredients) → Lupa → deliver the potion to Satata (Colony 6) → Lupa.", rewards: "3300G, 1200 EXP, Panther Shoes" },
    "4.14:Q178": { giver: "Lupa", location: "Frontier Village", objective: "Collect 5 Hades Beetle (Makna / trade Abada), 3 All-Seeing Eyes (Jungle Quadwings, Nopon Arch), 2 Potent Brog Poison (Poison Brog, Dark Swamp)." },
    "4.14:Q179": { giver: "Nopon Villager", location: "Kyn Shopping Street, day", objective: "Defeat Breezy Zolos.", rewards: "26000G" },
    "4.14:UM38": { location: "Makna Forest — north of the Windmill Pavilion.", strategy: "Your first counter-spike UM: use Purge + topple via chain. Reyn tanks, Sharla heals." },
    "4.14:Q180": { giver: "Surprise Quest", location: "Colony 6", objective: "Defeat 3 Mechon M56 Armor Units (west of the Pod Depot).", rewards: "3000G, 1500 EXP" },
    "4.14:Q181": { giver: "Werner", location: "Butterfly Gardens, east of Reconstruction HQ", objective: "Collect 6 Flier Wings (Clima Fliers, north of Misty Path) + 7 Flier Straws (Fine Fliers, near Jacob's Rock).", rewards: "4000G, 620 EXP, Nopol Boots" },
    "4.14:Q182": { giver: "Narine", location: "Tranquil Square SW (Shulk in the lead)", objective: "Raise Shulk/Reyn to blue → Narine; then purple → Paola; then raise two female members (Melia + Sharla) to purple.", rewards: "200G, 20000 EXP, Daze Plus IV", strategy: "Prereq: Paola registered." },
    "4.14:Q183": { giver: "Liliana", location: "Main Entrance, day (Colony 9)", objective: "Collect the message in a bottle (Agora Shore, NW cave) → Sonia.", rewards: "4000G, 500 EXP, Swimming Oil" },
    "4.14:UM39": { location: "Colony 9 — Agora Shore, NW cave.", strategy: "Topple-lock; clear the brog/antol first." },
    "4.14:UM40a": { location: "Colony 9 — Agora Shore.", strategy: "Clear the baby armu first; topple her if she bolts for the water (resets the fight)." },
    "4.14:UM40b": { location: "Colony 9 — Hazzai Cape.", condition: "Night only" },
    "4.14:UM41": { location: "Colony 9 — cave in the cliff east of Cliff Lake." },
    "4.14:UM42": { location: "Colony 9 — cave in the cliff east of Cliff Lake.", strategy: "Very agile — stack Agility Up gems." },
    "4.14:UM43": { location: "Satorl Marsh — Exile Fortress interior.", strategy: "Clear his allies first; keep him toppled." },
    "4.14:Q184a": { giver: "Zukazu", location: "SW Tranquil Square, night (Colony 9)", objective: "Collect a Red Pollen Orb (Nopon Refuge) → Zukazu.", rewards: "2500G, 3000 EXP, Jungle Top" },
    "4.14:Q184b": { giver: "Jiroque", location: "Tranquil Square park, night", objective: "Collect a Red Pollen Orb (Nopon Refuge) → Jiroque.", rewards: "7500G, 1500 EXP, Jungle Bottoms", mutexWhy: "Guide picks ZUKAZU (Q184a) — it enables an otherwise-impossible link and the brothers reach a blue link." },
    "4.14:Q185a": { giver: "Jiroque", location: "Colony 9", objective: "Collect 3 Quality Antol Jaws (Cliff Lake), 4 Black Iris (Makna), 2 Forget-You-Not (Satorl / Colony 6 Lv.1 special).", rewards: "(see guide)" },
    "4.14:Q185b": { giver: "Zukazu", location: "Colony 9", objective: "Collect 3 Maternal Armu Milk (trade Zukazu) → Zukazu → return the Old Ring to Marcia → Zukazu." },
    "4.14:Q186": { giver: "Emmy Leater", location: "North Military District (Colony 9)", objective: "Find a Nopon Claymore or a Carbo Shield.", rewards: "3300G, 600 EXP", strategy: "Guide leans Nopon Claymore (marginally better Colony 9 area affinity)." },
    "4.14:HTH7b": { location: "Sparkling Pool", gainChoices: "You may be correct. // Are you sure?!" },

    // ---- 4.15: Eryth Sea ----
    "4.15:UM44": { location: "Eryth Sea — Hovering Reef 1." },
    "4.15:HTH8b": { location: "Hovering Reef 2", gainChoices: "I like flowers too. // She'd be so happy!" },

    // ---- 4.16: Alcamoth ----
    "4.16:Q187": { giver: "Story", location: "Alcamoth", objective: "Speak with the citizen on Hovering Reef 4, then rescue the worker (defeat 3 Defensive Kromar at the Ether Crystal Deposit)." },

    // ---- 4.17: High Entia Tomb ----
    "4.17:UM45": { location: "High Entia Tomb — Second Treasury." },

    // ---- 4.18: Prison Island & Approach ----
    "4.18:Q188": { giver: "Story", location: "Eryth Sea", objective: "Open the sister gates Khatorl and Soltnar." },
    "4.18:Q189": { giver: "Story", location: "Eryth Sea", objective: "Release the seals on Khatorl Seal Island and Soltnar Seal Island." },
    "4.18:UM46": { location: "Eryth Sea — Soltnar Seal Island." },
    "4.18:UM47": { location: "Eryth Sea — Khatorl Seal Island." },

    // ---- 4.19: Mid-Game Loose Ends ----
    "4.19:Q190": { giver: "Nopon Researcher", location: "East of the Pod Landing Site (Makna Forest)", objective: "Collect 5 Hode Planks (Hyle Hode, Precipice Bridge) + 3 Rhogul Axe Crest (Mist Rhogul, Barren Moor, day).", rewards: "3000G, 4400 EXP, Jaw Nibbler" },

    // ---- 4.20: Alcamoth & Eryth Sea Errata (all ⏱ TIMED) ----
    "4.20:Q191a": { giver: "Lighthouse Keeper", location: "Interior of Syrath Lighthouse", objective: "Defeat 5 Palti Kromar (Soltnar Seal Island).", rewards: "13000G" },
    "4.20:Q192": { giver: "Lighthouse Keeper", location: "Interior of Syrath Lighthouse", objective: "Defeat 5 Maleza Kromar (Hovering Reef 8).", rewards: "15000G" },
    "4.20:Q193": { giver: "Lighthouse Keeper", location: "Interior of Syrath Lighthouse", objective: "Defeat Flabbergasted Gerome.", rewards: "32000G" },
    "4.20:UM48": { location: "Eryth Sea — Hovering Reef 5 lower level (jump through the central cavity; lure it to a shore).", strategy: "Ether-based party — physical damage is nearly pointless." },
    "4.20:Q194": { giver: "Alcamoth Citizen", location: "Syrath Lighthouse, 2nd floor", objective: "Collect 3 Hiln Coin Purse (Eryth Hiln, Latael Shore) + 5 Doomsday Poppy (Eryth).", rewards: "12000G" },
    "4.20:Q195": { giver: "Alcamoth Citizen", location: "Syrath Lighthouse, 2nd floor", objective: "Collect 3 Pink Asparagus, 3 Andos Antenna, 3 Old Dragon Spine (trade Jarak at the Ether Plant).", rewards: "20000G" },
    "4.20:Q196": { giver: "Jarack", location: "Ether Plant", objective: "Complete the attached sub-missions, then report to Jarack.", rewards: "7700G, 4700 EXP, Shell Leggings" },
    "4.20:Q197": { giver: "Jarack", location: "Ether Plant", objective: "Defeat Funeral Gorza.", strategy: "Sub-mission of Trouble At The Plant." },
    "4.20:UM49": { location: "Eryth Sea — inner cave of the Hode Refuge." },
    "4.20:Q198": { giver: "Jarack", location: "Ether Plant", objective: "Collect 3 Luxury Hode Wood (Unine Hode, Showdown Cliff) → repair the broken turbine → Jarack." },
    "4.20:Q199": { giver: "Jarack", location: "Ether Plant", objective: "Defeat 2 Confusion Ekidno (Ether Plant), then find Jarack on the lower level.", rewards: "5400G, 3000 EXP" },
    "4.20:Q200": { giver: "Shalen", location: "Syrath Lighthouse, 2nd floor (Melia in the lead)", objective: "Defeat 3 Decay Ekindo (night, 2nd floor).", rewards: "5700G, 3800 EXP, Nightglow Staff, unlocks Melia's Reticence skill tree" },
    "4.20:Q201": { giver: "Alcamoth Citizen", location: "South of the shop on Melifica Road, day", objective: "Collect 2 Lexos Beard (Racti Lexos, Soltnar Seal Island; trade Talonyth).", rewards: "22000G" },
    "4.20:Q202": { giver: "Alcamoth Citizen", location: "South of the shop on Melifica Road, day", objective: "Defeat 5 Cruz Paguls (Latael Shore).", rewards: "16000G" },
    "4.20:Q203": { giver: "Alcamoth Citizen", location: "Melifica Road, day", objective: "Defeat 3 Eryth Ansel (Syrath Lighthouse, day, clear weather).", rewards: "14500G" },
    "4.20:Q204": { giver: "Alcamoth Citizen", location: "Melifica Road, day", objective: "Defeat 2 Cicconia Ekidno (Hovering Reef 10).", rewards: "17000G" },
    "4.20:Q205": { giver: "Alcamoth Imperial Guard", location: "Imperial Palace landmark, night", objective: "Defeat 3 Chloro Laia (Syrath Lighthouse, night).", rewards: "14000G" },
    "4.20:Q206": { giver: "Alcamoth Imperial Guard", location: "Imperial Palace landmark, night", objective: "Defeat 5 Stella Eks (Anu Shore).", rewards: "22500G" },
    "4.20:Q207": { giver: "Alcamoth Imperial Guard", location: "Imperial Palace landmark, night", objective: "Defeat 1 Racti Lexos (Soltnar Seal Island).", rewards: "27000G" },
    "4.20:Q208": { giver: "Alcamoth Citizen", location: "North bridge, Melifica Road", objective: "Defeat 5 Unine Hodes (Showdown Cliff).", rewards: "18000G" },
    "4.20:Q209": { giver: "Alcamoth Citizen", location: "North bridge, Melifica Road", objective: "Defeat 2 Toccos Orluga (Khatorl Seal Island).", rewards: "25000G" },
    "4.20:Q210": { giver: "Alcamoth Citizen", location: "North bridge, Melifica Road", objective: "Defeat 1 Pelargos Ekidno (Khatorl Seal Island, night, building summit).", rewards: "28000G" },
    "4.20:Q211": { giver: "Alcamoth Imperial Guard", location: "Ascension Hall, night", objective: "Defeat 3 Somati Kromar (Soltnar Seal Island).", rewards: "18000G" },
    "4.20:Q212": { giver: "Alcamoth Imperial Guard", location: "Ascension Hall, night", objective: "Defeat 4 Tussock Kromar (Soltnar Seal Island).", rewards: "18000G" },
    "4.20:Q213": { giver: "Alcamoth Imperial Guard", location: "Ascension Hall, night", objective: "Defeat 5 Otol Kromar (Soltnar Seal Island).", rewards: "15000G" },
    "4.20:Q214": { giver: "Alcamoth Citizen", location: "SE of the Fountain of Hope, night", objective: "Defeat Proper Bandaz.", rewards: "45000G" },
    "4.20:UM50": { location: "Eryth Sea — Secluded Island, NW shore.", condition: "Nights with shooting stars only" },
    "4.20:Q215": { giver: "Alcamoth Citizen", location: "NE of the Fountain of Eternity, night (by a lake)", objective: "Defeat Tempestuous Edegia.", rewards: "38000G" },
    "4.20:UM51": { location: "Eryth Sea — NW Hovering Reef 10.", condition: "Night only" },
    "4.20:Q216": { giver: "Alcamoth Citizen", location: "Great Hall, NE hallway, day", objective: "Defeat Peeling Kircheis.", rewards: "35000G" },
    "4.20:UM52": { location: "Eryth Sea — Hovering Reef 7.", strategy: "Has friends but is a pushover — physical party." },
    "4.20:Q217": { giver: "Alcamoth Citizen", location: "NE of the Fountain of Eternity, day", objective: "Defeat Lightspeed Sonid.", rewards: "50000G" },
    "4.20:UM53": { location: "Eryth Sea — Anu Shore upper plateau, west.", strategy: "Highly agile + counter-spike — use Purge or topple." },
    "4.20:Q218": { giver: "Alcamoth Citizen", location: "Base of the escalator NE of the Fountain of Eternity, day", objective: "Find the Merchant's Gift (under the escalator, bear NW — a red ball).", rewards: "11000G, 2500 EXP" },
    "4.20:Q219": { giver: "Alcamoth Citizen", location: "NW of the Fountain of Hope, night", objective: "Find the Mother's Necklace (north from the Imperial Palace, down the stairs, far end of the garden street).", rewards: "12000G, 2000 EXP" },
    "4.20:Q220": { giver: "Alcamoth Citizen", location: "SE of the Fountain of Hope, night", objective: "Find a silver ring (Great Hall, SE 'four o'clock' hallway, at the end).", rewards: "9000G, 3000 EXP" },
    "4.20:Q221": { giver: "Alcamoth Citizen", location: "NW of the Fountain of Hope (smaller fountain), night", objective: "Find the Health Amulet (Fountain of Hope, east wall then north, SE corner of the bottom floor).", rewards: "10000G, 2800 EXP" },
    "4.20:Q222": { giver: "Alcamoth Citizen", location: "Across the south Melifica Road bridge, first transport hub, day", objective: "Collect 3 Gold Burdock (Eryth Sea; great rate at Faras Cave).", rewards: "15000G" },
    "4.20:Q223": { giver: "Alcamoth Citizen", location: "East of the Main Entrance under the escalator, day", objective: "Collect 2 White Tails (Eryth Sea).", rewards: "22000G" },
    "4.20:Q224": { giver: "Alcamoth Citizen", location: "Fountain of Hope, day", objective: "Collect 5 Stardrops (Alcamoth, better at night).", rewards: "22500G" },
    "4.20:Q225": { giver: "Alcamoth Citizen", location: "South of the Imperial Palace, night", objective: "Collect 2 Spiral Lamps (High Entia Tomb).", rewards: "21000G" },
    "4.20:Q226": { giver: "Alcamoth Citizen", location: "NE of the Main Entrance (second fountain), day", objective: "Collect 2 Glossy Grady Fans (Lunar Grady, Latael Shore water).", rewards: "20000G" },
    "4.20:Q227": { giver: "Alcamoth Citizen", location: "North Melifica Road, by the transport pods, day", objective: "Collect 5 Orluga Grass Skirts (Terra Orluga, Village Entrance).", rewards: "23500G" },
    "4.20:Q228": { giver: "Alcamoth Imperial Guard", location: "SE of the Main Entrance, day", objective: "Collect 3 Orluga Slacks (Tocca Orluga, Khatorl Seal Island).", rewards: "27000G" },
    "4.20:Q229": { giver: "Vol'aren", location: "East of the Fountain of Hope, day", objective: "Find Atael (NE corner of the lower city), then report.", rewards: "6750G, 2300 EXP, Tension Swing III" },
    "4.20:Q230": { giver: "Vol'aren", location: "Alcamoth", objective: "Find Cian (NE of the Fountain of Hope, day), then report.", rewards: "7200G, 2500 EXP, Strength Up IV", strategy: "Completion → trial 'Neural Network'." },
    "4.20:Q231": { giver: "Teelan", location: "Melifica Road, day, next to the central escalator", objective: "Collect 9 Gold Caterpillars (Tephra Cave; Caterpile Nest / Leg Pass).", rewards: "8100G, 1950 EXP, Fall Defense II" },
    "4.20:Q232": { giver: "Galdo", location: "Great Hall, downstairs of the Ascension Hall transporter, night", objective: "Defeat 6 Archer Hodes (Showdown Cliff), then report.", rewards: "5500G, 1800 EXP, Bind II", strategy: "Prereq: Lar'shen registered." },
    "4.20:Q233": { giver: "Merisa", location: "North side of Melifica Road, day", objective: "Find Mir'leiz (Hovering Reef 1), then report.", rewards: "3500G, 1800 EXP, Weapon Power IV", strategy: "Prereq: Mir'leiz registered." },
    "4.20:Q234": { giver: "Ruthan", location: "South of the Imperial Palace, night", objective: "Collect 6 Sturdy Armour (Flavel Andos, Hovering Reef 1; trade Jer'ell).", rewards: "5500G, 1500 EXP, Slow Resist III" },
    "4.20:Q235": { giver: "Scarlen", location: "East of the Main Entrance, night", objective: "Speak with Rozael and Ricoth (Fountain of Eternity, night), then report.", rewards: "3800G, 1300 EXP, Spike Defense II" },
    "4.20:Q236": { giver: "Scarlen", location: "Alcamoth", objective: "Speak with Ricoth or Rozael first (it picks the sequel), then the rejected friend → Scarlen.", rewards: "4200G, 1700 EXP", mutexWhy: "Speak ROZAEL first — that sequel later yields a green link with Galvin, vs a red link on the Ricoth path." },
    "4.20:Q237a": { giver: "Scarlen", location: "Alcamoth", objective: "Speak with Rozael, then report.", rewards: "4800G, 2100 EXP, Physical Protect IV", strategy: "Prereq: Rozael chosen in Q236." },
    "4.20:Q237b": { giver: "Scarlen", location: "Alcamoth", objective: "Speak with Ricoth, then report.", rewards: "4800G, 2100 EXP, Ether Protect IV", mutexWhy: "Guide picks the Rozael line (Q236 → Q237a 'Together Forever') for the stronger affinity chart." },
    "4.20:Q238": { giver: "Lecrough", location: "Base of the Ascension Hall stairs, day", objective: "Defeat 6 Eryth Hiln (Latael Shore), then report.", rewards: "7500G, 2500 EXP, Arts Stealth III", strategy: "Prereq: Galvin registered." },
    "4.20:Q239": { giver: "Zain", location: "Fountain of Eternity, day", objective: "Collect Kasharpa Water (Kasharpa Falls), Statue Water (NE of Sororal Statues), Makna Water (Great Makna Falls) → Zain.", rewards: "4200G, 1600 EXP, Str/Ether/Agility Up III", strategy: "Prereq: Kurralth registered (trial: Friend Of The World)." },
    "4.20:Q240": { giver: "Kurralth", location: "Alcamoth", objective: "Find the Chalk Container (Anu Shore, upper area), then report.", rewards: "4700G, 1800 EXP, Muscle/Ether Defense Up III", strategy: "Completion → trial 'Honorary High Entia'." },
    "4.20:Q241": { giver: "Zain", location: "Alcamoth", objective: "Collect Orthlus' Liver (Lakebed Orthlus, Agora Shore), then report.", rewards: "6600G, 2500 EXP, Mithril Gear/Gauntlets/Boots" },
    "4.20:UM54": { location: "Colony 9 — Agora Shore.", condition: "Will NOT respawn" },
    "4.20:Q242": { giver: "Nelo", location: "SE of the Fountain of Hope, night", objective: "Collect 5 Pagul Hot Pot (Cruz Pagul, Latael Shore) + 2 Feris Blood (Waypoint Beacon; trade Gadada).", rewards: "4750G, 1800 EXP, Confuse Resist III" },
    "4.20:Q243": { giver: "Popipo", location: "NE of the Main Entrance, day", objective: "Speak Baroba (Main Entrance) → 5 Ether Roses (Satorl) → Baroba → Popipo.", rewards: "6400G, 1600 EXP, Paralysis Resist III" },
    "4.20:Q244": { giver: "Naroth", location: "North of the shop on Melifica Road, day", objective: "Collect 5 Green Diode (High Entia Tomb, near the Tower of Trials Bridge) + 3 Astas Remote Units (Hover Astas, High Entia Tomb).", rewards: "6500G, 1800 EXP, Shell Gauntlets" },
    "4.20:Q245": { giver: "Talia", location: "South of the Imperial Palace, night", objective: "Defeat Dramatic Gogol (Place of Judgement), then report to Talia (temporarily at Satorl Marsh).", rewards: "6800G, 2250 EXP, Ether Defense Up IV, Arts Seal Resist III", mutexWhy: "Do TALIA'S RESEARCH now — its mutex twin 'Investigating Satorl' (post-core) gives NO affinity benefit, and these links can't be gained any other way." },
    "4.20:Q246": { giver: "Mir'leiz", location: "Alcamoth", objective: "Speak Caul (N of Imperial Palace, 18:00) → 3 Murky Eluca Water (Perna Eluca, Latael Shore; trade Jarack) → Caul → Mir'leiz.", rewards: "4300G, 2000 EXP, Shell Boots" },
    "4.20:Q247": { giver: "Mir'leiz", location: "Alcamoth", objective: "Speak Lecrough, complete the conjunctive quest, defeat 2 Buono Nebulae (Latael Shore / Hovering Reef 5) → Lecrough → Mir'leiz.", rewards: "5600G, 2400 EXP, Unbeatable III" },
    "4.20:Q248": { giver: "Lecrough", location: "Alcamoth", objective: "Defeat 2 Bono Nebulae (Hovering Reef 1 or 4).", rewards: "4400G, 2100 EXP, Panther Top, Panther Shoes" },
    "4.20:Q249": { giver: "Elior", location: "Alcamoth", objective: "Speak Miriall → 2 Silver Eks Plate (Stella Eks, Hovering Reef 7) → Miriall → take Miriall's Telescope to Elior.", rewards: "5600G, 2000 EXP, Daze Resist III" },
    "4.20:Q250": { giver: "Elior", location: "Alcamoth", objective: "Speak Kaleka → get the Attachment Part (Second Treasury) → Kaleka → take the Stronger Telescope back to Elior.", rewards: "6900G, 2700 EXP, Amethyst Leggings" },
    "4.20:HTH9": { location: "Contemplation Terrace", gainChoices: "I'll be honest...not really. // As all wise rulers do." },
    "4.20:HTH10": { location: "Prophecy Hut", gainChoices: "They're delivered from on high? // You mean...you?" },
    "4.20:HTH11": { location: "Valley of Emperors (ledge off the SE bridge)", gainChoices: "Let's go take a look. // Mind sharing it with us?" },
    "4.20:HTH12": { location: "Melifica Road (cross the NE bridge, left, two transporter pads down)", condition: "Night only", gainChoices: "Of course I do! // Yes, I do." },

    // ---- 4.21: Valak Mountain (finishes Part 1) ----
    "4.21:Q251": { giver: "Nopon Merchant", location: "Zokhed Pass", objective: "Defeat 2 Monta Moramora (Bionis' Right Elbow, day).", rewards: "23000G" },
    "4.21:Q252": { giver: "Nopon Merchant", location: "Zokhed Pass", objective: "Defeat 5 Sparas Paguls (Nagul Waterfall).", rewards: "25500G" },
    "4.21:Q253": { giver: "Nopon Merchant", location: "Zokhed Pass", objective: "Defeat 3 Bow Chilkins (near the Hallow Bone / Bagnar Snowfield).", rewards: "28000G" },
    "4.21:Q254": { giver: "Nopon Merchant", location: "Zokhed Pass", objective: "Defeat 1 Sensa Lexos (NE of the Hallow Bone, day).", rewards: "30000G" },
    "4.21:UM55": { location: "Valak Mountain — Befalgar Pedestal.", strategy: "Use an ether-based party." },
    "4.21:Q255": { giver: "Nopon Researcher", location: "Nopon Camp", objective: "Defeat 5 Poleaxe Chilkins (Url Crevasse / Bagnar Snowfield) + 5 Ent Antols (south of the Hallow Bone, via the Chilkin Lair) → researcher.", rewards: "10000G, 3300 EXP, Spike Defense IV, Chill Defense IV, Paralysis Resist IV" },
    "4.21:Q256": { giver: "Nopon Researcher", location: "Nopon Camp", objective: "Observe the vistas from Befalgar Pedestal and Kana Peak's summit → report (the 'better view' answer is inconsequential).", rewards: "11500G, 3800 EXP, Chill Defense V" },
    "4.21:Q257": { giver: "Story", location: "Harict Chapel", objective: "Obtain the Magma Rock (defeat Conflagrant Roxael in the Lava Cave)." },
    "4.21:UM56": { location: "Valak Mountain — Lava Cave.", condition: "Only during 'The Magma Rock'; will not respawn", strategy: "Spam Down+ZR to keep the AI out of the lava; ether party damages from range." },
    "4.21:Q258": { giver: "Nopon Researcher", location: "Great Glacier", objective: "Defeat 4 Cunning Chilkin (right behind you), then report.", rewards: "13800G, 5000 EXP, Heavy Gear, Heavy Armor" },
    "4.21:Q259": { giver: "Nopon Researcher", location: "Upper level via the Jakt Geyser, then east", objective: "Collect 3 Hox Flints (Porcu Hox, Lava Cave), 2 Antol Fire Pouches (Ent Antol, Mechonis Wound), 1 Feris Aged Ale (Noto Feris, Lava Cave).", rewards: "12000G, 4500 EXP, Heavy Leggings" },
    "4.21:Q260": { giver: "Dakuku", location: "Nopon Camp", objective: "Investigate the Chilkin Lair, then report to Dakuku.", rewards: "15000G, 3200 EXP, Blaze Defense V, Daze Resist II" },
    "4.21:Q261": { giver: "Dakuku", location: "Nopon Camp (Dunban in the lead)", objective: "Defeat Barbaric Sitiri and Banquet Vassago (both in the Antol Den), then report.", rewards: "21000G, 8500 EXP, Snaer Striker, Stellar Gear/Gauntlets, unlocks Dunban's Obstinance skill tree" },
    "4.21:UM57": { location: "Valak Mountain — Antol Den.", strategy: "Talent art dazes + knocks back — Daze Resist gems, stay off the cliff edge; save first." },
    "4.21:UM58": { location: "Valak Mountain — Antol Den (inside a large Bonterra Pod, SW corner; use Lure to hatch it).", condition: "Will not respawn" },
    "4.21:UM59a": { location: "Valak Mountain — south of the Sealed Tower." },
    "4.21:UM59b": { location: "Valak Mountain — Url Crevasse.", condition: "Clear weather, nights only" },
    "4.21:UM60": { location: "Valak Mountain — Ignia Hill, NE corner.", condition: "Night only", strategy: "Area spike — spike-defense gems / Purge / topple-lock (clear allies first)." },
    "4.21:UM61": { location: "Valak Mountain — land bridge south of Ignia Hill.", condition: "Night only" },
    "4.21:UM62": { location: "Valak Mountain — Lava Cave, NW lava lake (west side of the room).", strategy: "Ether-based party is most effective." }
  },

  // quest -> the unique monster(s) it defeats (by UM canonical name).
  // Completing the quest auto-checks the monster.
  defeats: {
    "4.6:Q6": "Verdant Bluchal", "4.6:Q18": "Evil Rhangarot", "4.6:Q19": "Lake Magdalena",
    "4.6:Q30": "Wallslide Gwynry", "4.6:Q59": "Dark Murakmor", "4.6:Q68": "Violent Andante",
    "4.6:Q69": "Vagrant Alfead", "4.6:Q84": "White Eduardo",
    "4.7:Q88": "Trainer Harmeleon",
    "4.10:Q109": "Sunlight Schvaik",
    "4.11:Q119": "Elder Gragus",
    "4.13:Q137": "Shimmering Forte",
    "4.14:Q144": "Agile Albarto", "4.14:Q145": "Lazy Bluco", "4.14:Q158b": "Obsessive Galgaron", "4.14:Q179": "Breezy Zolos",
    "4.20:Q193": "Flabbergasted Gerome", "4.20:Q197": "Funeral Gorza", "4.20:Q214": "Proper Bandaz",
    "4.20:Q215": "Tempestuous Edegia", "4.20:Q216": "Peeling Kircheis", "4.20:Q217": "Lightspeed Sonid",
    "4.20:Q241": "Lakebed Orthlus",
    "4.21:Q257": "Conflagrant Roxael", "4.21:Q261": ["Barbaric Sitiri", "Banquet Vassago"]
  },

  // quest -> ShulkLink "Affinity Chart Changes" (paraphrased; § references kept).
  affinity: {
    // ---- 4.6 ----
    "4.6:Q40": "Marcia & Jiroque register; yellow link “close” (Marcia/Jiroque).",
    "4.6:Q41": "Dionysus registers.",
    "4.6:Q42": "Niranira & Lukas register; yellow “Kind Friend” (Lukas/Niranira).",
    "4.6:Q43": "Desirée registers.",
    "4.6:Q44": "Suzanna & Moritz register (Kenny Rohan too if you trade with him); orange “irritation” (Suzanna/Moritz).",
    "4.6:Q45": "Emmy Leater & Miller register; red “dissatisfaction” (Miller/Emmy Leater).",
    "4.6:Q46": "Françoise registers.",
    "4.6:Q47": "Green “best friends” (Moritz/Niranira) and (Moritz/Lukas); Lukas/Niranira improve to green “best friends”.",
    "4.6:Q48": "Giorgio registers.",
    "4.6:Q49": "Registers Sonia, Rocco, Dean, Erik. Yellow “respect” (Dean/Rocco); yellow “old friends” (Sonia/Dean); Sonia/Rocco red “warring family” → green “happy family”; yellow “both scientists” (Erik/Dean) — speak Erik BEFORE finishing.",
    "4.6:Q50": "Rocco/Lilliana green “close siblings”; Sonia/Dean improve to blue “mutual respect”.",
    "4.6:Q51": "Suzanna/Moritz improve to yellow “normal”.",
    "4.6:Q52a": "(Girl) Erik/Monica blue “mutual love?”, Monica/Andreas red “parted ways”.",
    "4.6:Q52b": "(Boy — guide pick) Andreas/Monica blue “passionate”, Monica/Erik orange “parted ways” — their best.",
    "4.6:Q54a": "(Leopold/frame route) King Squeeze/Leopold orange “complicated”; Sylvaine/King Squeeze green “dastardly duo”; Leopold/Sylvaine orange “awkward”.",
    "4.6:Q54b": "(Sylvaine/investigate route — guide pick) King Squeeze/Leopold red “got revenge”; Leopold/Sylvaine blue “endless love”; Sylvaine/King Squeeze yellow “accomplices”.",
    "4.6:Q56a": "Paola registers; yellow “wants to play” (Giorgio/Paola).",
    "4.6:Q56b": "Giorgio/Paola improve to blue “trusting family” (guide-pick route).",
    "4.6:Q57": "Sesame & Betty register; orange “skepticism” (Betty/Sesame).",
    "4.6:Q58": "Orange “indifferent” (Kenny Rohan/Sesame).",
    "4.6:Q59": "Sesame/Kenny Rohan and Sesame/Betty improve to green (“Big Success”, “Wonderful”).",
    "4.6:Q77": "Gorman registers.",
    "4.6:Q78": "Yellow “customer” (Gorman/Olga); Olga registers.",
    "4.6:Q79": "Matryona & Ewan register; orange “bad feeling” (Ewan/Matryona).",
    "4.6:Q80": "Ewan/Matryona improve to yellow “interested”.",
    "4.6:Q81": "Satata, Kokori & Nikita register; blue “close family” (Satata/Kokori); green “friends again” (Kokori/Nikita).",
    "4.6:Q82": "Earnest registers.",
    "4.6:Q87a": "Pama & Arda register; green “really great person” (Pama/Matryona and Pama/Ewan); Matryona/Ewan improve to green “likes”; speak Arda after → yellow “concern” (Arda/Pama).",
    "4.6:Q87b": "Pama & Arda register; yellow “kind person” links (Pama/Matryona, Arda/Ewan).",
    // ---- 4.7 ----
    "4.7:Q89": "Speak Ewan afterwards → green “relief” (their best).",
    "4.7:Q90": "Gerugu & Batubatu register; yellow “prickly pal” (Gerugu/Batubatu).",
    "4.7:Q92": "Gerugu/Batubatu improve to green “valuable friend” (their best).",
    "4.7:Q93": "Jackson & Dorothy register; yellow “eager siblings” (Dorothy/Jackson); yellow link Jackson/chosen mentor.",
    "4.7:Q94a": "Jackson/Kenny Rohan improve to blue “talent in bloom”; Jackson/Dorothy green “rival siblings”; Giorgio/Sesame green “amazing”; Giorgio/Kenny Rohan green “VIP regular”.",
    "4.7:Q94b": "Jackson/Dorothy green “rival siblings”; Jackson/Giorgio green “shows promise”; Giorgio/Sesame green “amazing”; Giorgio/Kenny Rohan yellow “a regular”.",
    "4.7:Q97": "Orange “mistrust” (Emmy Leater/Raoul); Miller/Emmy Leater improve to orange “patience”.",
    "4.7:Q98": "Emmy Leater/Miller improve to yellow “higher opinion”; Emmy Leater/Raoul improve to green “impressed”."
  }
};
