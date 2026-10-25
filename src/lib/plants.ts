/** Field notes for the six source plants, shown in the herbarium pop-up. Order matches dict.dna.labels. */
export type PlantNote = {
  img: string;
  /** what the plant gives the skin */
  body: string;
  facts: [string, string][];
  did: string;
};

const IMG = ["rosehip", "babchi", "marula", "birch", "tea", "buckthorn"].map((n) => `/img/plants/${n}.webp`);

const sv: PlantNote[] = [
  {
    img: IMG[0],
    body: "Kallpressad olja ur nyponens kärnor. Den bär naturlig provitamin A och essentiella fettsyror som stärker hudens barriär och jämnar ut ytan. En torr olja som sjunker in direkt och inte lämnar någon hinna.",
    facts: [["Ursprung", "Vildros längs Nordens kuster och skogsbryn"], ["Del", "Fröolja, kallpressad"], ["Skörd", "Sensommar till frost"]],
    did: "Ett färskt nypon innehåller flera gånger mer C-vitamin än en apelsin.",
  },
  {
    img: IMG[1],
    body: "Utvinns ur fröna från babchi-växten. Bakuchiol ger samma typ av förnyelse som retinol men är mild nog för känslig hud, och kan användas både morgon och kväll.",
    facts: [["Ursprung", "Indien, sedan länge i ayurvedisk tradition"], ["Del", "Frön"], ["Passar", "Känslig hud, morgon och kväll"]],
    did: "I en studie från 2019 gav bakuchiol lika tydlig effekt på fina linjer som retinol under tolv veckor, men med betydligt mindre stickande och fjällning.",
  },
  {
    img: IMG[2],
    body: "Lätt olja ur kärnorna i marulafrukten. Den är rik på oljesyra och antioxidanter, mjukgör utan att kännas tung och låser in fukten efter serumet.",
    facts: [["Ursprung", "Södra Afrika"], ["Del", "Kärnor, kallpressade"], ["Känsla", "Silkig, absorberas på sekunder"]],
    did: "Marulaträdet kallas ofta livets träd, och elefanter vandrar långt för att äta de mogna frukterna.",
  },
  {
    img: IMG[3],
    body: "Klar sav som tappas ur björken under några veckor på våren. Den innehåller xylitol, mineraler och aminosyror och ger huden en lätt och mjuk återfuktning.",
    facts: [["Ursprung", "Nordiska björkskogar"], ["Del", "Sav, tappad direkt ur stammen"], ["Skörd", "Två till tre veckor i mars–april"]],
    did: "Under den korta säsongen kan en enda björk ge flera liter sav per dygn.",
  },
  {
    img: IMG[4],
    body: "Bladen är rika på polyfenoler, bland annat EGCG, som skyddar huden mot vardagens miljöpåfrestningar och lugnar rodnad.",
    facts: [["Ursprung", "Östasiatiska tefält"], ["Del", "Blad, varsamt extraherade"], ["Verkan", "Antioxidant och lugnande"]],
    did: "Bladen värms strax efter plockning så att de inte oxiderar. Därför förblir grönt te grönt.",
  },
  {
    img: IMG[5],
    body: "Bär och frön ger en djupt orange olja med det sällsynta omega-7 och karotenoider. Den ger lyster, stöttar hudens egna fetter och gör torr hud smidig igen.",
    facts: [["Ursprung", "Sveriges och Finlands kuster"], ["Del", "Bär och frön"], ["Skörd", "Sensommar och höst"]],
    did: "Grenarna fryses vid skörd så att de små, ömtåliga bären lossnar utan att spricka.",
  },
];

const en: PlantNote[] = [
  {
    img: IMG[0],
    body: "Oil cold-pressed from the seeds of the rosehip. It carries natural provitamin A and essential fatty acids that strengthen the skin barrier and even out its surface. A dry oil that sinks in at once and leaves no film.",
    facts: [["Origin", "Wild rose along Nordic coasts and forest edges"], ["Part", "Seed oil, cold-pressed"], ["Harvest", "Late summer until frost"]],
    did: "A fresh rosehip holds several times more vitamin C than an orange.",
  },
  {
    img: IMG[1],
    body: "Extracted from the seeds of the babchi plant. Bakuchiol gives the same kind of renewal as retinol but is gentle enough for sensitive skin, and can be used morning and night.",
    facts: [["Origin", "India, long used in Ayurvedic tradition"], ["Part", "Seeds"], ["Suits", "Sensitive skin, morning and night"]],
    did: "In a 2019 study, bakuchiol improved fine lines as clearly as retinol over twelve weeks, with much less stinging and scaling.",
  },
  {
    img: IMG[2],
    body: "A light oil from the kernels of the marula fruit. Rich in oleic acid and antioxidants, it softens without feeling heavy and seals in moisture after the serum.",
    facts: [["Origin", "Southern Africa"], ["Part", "Kernels, cold-pressed"], ["Feel", "Silky, absorbs in seconds"]],
    did: "The marula is often called the tree of life, and elephants travel far to eat its ripe fruit.",
  },
  {
    img: IMG[3],
    body: "Clear sap tapped from the birch for a few weeks in spring. It contains xylitol, minerals and amino acids and gives skin light, soft hydration.",
    facts: [["Origin", "Nordic birch forests"], ["Part", "Sap, tapped straight from the trunk"], ["Harvest", "Two to three weeks in March–April"]],
    did: "During its short season a single birch can give several litres of sap a day.",
  },
  {
    img: IMG[4],
    body: "The leaves are rich in polyphenols such as EGCG, which shield skin from everyday environmental stress and calm redness.",
    facts: [["Origin", "East Asian tea gardens"], ["Part", "Leaves, gently extracted"], ["Action", "Antioxidant and soothing"]],
    did: "The leaves are heated soon after picking so they don't oxidise. That's why green tea stays green.",
  },
  {
    img: IMG[5],
    body: "Berries and seeds give a deep orange oil with rare omega-7 and carotenoids. It brings glow, supports the skin's own lipids and makes dry skin supple again.",
    facts: [["Origin", "Swedish and Finnish coasts"], ["Part", "Berries and seeds"], ["Harvest", "Late summer and autumn"]],
    did: "Branches are frozen at harvest so the small, fragile berries come loose without bursting.",
  },
];

export const plantNotes = { sv, en };
export const plantUi = {
  sv: { more: "Läs mer", did: "Visste du?", close: "Stäng", prev: "Föregående växt", next: "Nästa växt" },
  en: { more: "Read more", did: "Did you know?", close: "Close", prev: "Previous plant", next: "Next plant" },
};
