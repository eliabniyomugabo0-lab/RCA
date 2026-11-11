import { 
  Task, 
  DirectMessage, 
  Announcement, 
  InAppNotification, 
  CalendarEvent, 
  InventoryItem, 
  Language, 
  TaskComment,
  TaskSubmission
} from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

// Multilingual translations for all standard operational content in the system
export interface LocalizedContent {
  en: string;
  rw: string;
  fr: string;
  sw: string;
}

// 1. Task Content Translations Map
export const TASK_TRANSLATIONS: Record<string, {
  title: LocalizedContent;
  description: LocalizedContent;
  instructions?: LocalizedContent;
  reportSummary?: LocalizedContent;
  deliverablesNotes?: LocalizedContent;
}> = {
  'tsk-001': {
    title: {
      en: 'ICC T20 Regional Qualifiers: Center Pitch Preparation & Moisture Test',
      rw: 'Ijonjora rya ICC T20: Gutegura Ikibuga Hagati no Gupima Ubuhehere',
      fr: 'Qualifications Régionales ICC T20: Préparation du Terrain Central & Test d\'Humidité',
      sw: 'Mchujo wa Kikanda wa ICC T20: Maandalizi ya Uwanja wa Kati & Kipimo cha Unyevu'
    },
    description: {
      en: 'Perform rolling schedule on Pitch #3 and calibrate soil moisture probes prior to official ICC Match Referee inspection.',
      rw: 'Gukora gahunda yo kuringaniza ikibuga cya 3 no gupima ubuhehere bw\'ubutaka mbere y\'isuzuma ry\'Umusifuzi Mukuru wa ICC.',
      fr: 'Effectuer le calendrier de compactage sur le terrain n°3 et étalonner les sondes d\'humidité du sol avant l\'inspection officielle de l\'arbitre ICC.',
      sw: 'Fanya ratiba ya kukandamiza uwanja nambari 3 na kurekebisha vipimo vya unyevu kabla ya ukaguzi rasmi wa Mwamuzi wa Mechi wa ICC.'
    },
    instructions: {
      en: '1. Complete 4-hour heavy roll with 1.5T vibrating roller.\n2. Take 5-point moisture core readings along length.\n3. Ensure boundary perimeter ropes are pinned at 68m radius.\n4. Log readings and upload pitch certification photo.',
      rw: '1. Koresha imashini ya toni 1.5 mu gihe cy\'amasaha 4.\n2. Pima ubuhehere ku bipimo 5 ku burebure bwose.\n3. Reba neza ko imigozi y\'imbibi iri kuri metero 68.\n4. Andika ibipimo kandi ushyireho ifoto y\'icyemezo cy\'ikibuga.',
      fr: '1. Réaliser un roulement lourd de 4h avec rouleau vibrant 1.5T.\n2. Relever 5 mesures d\'humidité sur la longueur.\n3. Vérifier les cordes de délimitation à un rayon de 68m.\n4. Enregistrer les données et joindre la photo de certification.',
      sw: '1. Kamilisha masaa 4 ya kukandamiza kwa kutumia roller ya tani 1.5.\n2. Pima viwango vya unyevu katika sehemu 5 kando ya urefu.\n3. Hakikisha kamba za mpaka zimefungwa kwa kipenyo cha mita 68.\n4. Rekodi takwimu na pakia picha ya cheti cha uwanja.'
    }
  },
  'tsk-002': {
    title: {
      en: 'Quarterly High-Performance Academy Equipment Audit & Inventory Check',
      rw: 'Igenzura ry\'Igihembwe ry\'Ibikoresho by\'Ishuri ry\'Iterambere rya Kriketi',
      fr: 'Audit Trimestriel des Équipements de l\'Académie & Contrôle d\'Inventaire',
      sw: 'Ukaguzi wa Kila Robo Mwaka wa Vifaa vya Chuo cha Kriketi & Hifadhi ya Ghala'
    },
    description: {
      en: 'Physical count and condition assessment of all training bats, helmets, pads, and balls stored in Pavilion Store Bay B.',
      rw: 'Ibarura nyakuri n\'isuzuma ry\'ubuziranenge bw\'inkoni, ingofero, ibirinda amaguru n\'imipira bibitse mu bubiko B bw\'inyubako.',
      fr: 'Inventaire physique et évaluation de l\'état de toutes les battes, casques, jambières et balles stockées dans la baie B du pavillon.',
      sw: 'Kuhesabu kimwili na kutathmini hali ya popo zote, kofia ngumu, walinzi wa miguu na mipira iliyohifadhiwa katika Ghala B.'
    },
    reportSummary: {
      en: 'Completed full physical count across 12 inventory categories. 48 Grade-1 match balls verified sealed. 4 training bats identified with toe crack damage, moved to repair hold.',
      rw: 'Ibarura ryuzuye ryakozwe mu byiciro 12 by\'ibikoresho. Imipira 48 yo ku rwego rwo hejuru yemejwe ko ifunze neza. Inkoni 4 zagaragayeho kwangirika zashyizwe ahasanirwa.',
      fr: 'Inventaire physique complet réalisé sur 12 catégories. 48 balles de match certifiées scellées. 4 battes endommagées isolées pour réparation.',
      sw: 'Nimekamilisha hesabu kamili ya kimwili katika kategoria 12 za vifaa. Mipira 48 ya daraja la kwanza imehakikishwa imefungwa. Popo 4 zimeharibika na kupelekwa matengenezo.'
    },
    deliverablesNotes: {
      en: 'Attached reconciliation variance sheet. Reorder threshold alert recommended for Senior Batting Pads.',
      rw: 'Hometseho inyandiko y\'igereranya. Hakenewe gutumizwa ibirinda amaguru by\'abakinnyi bakuru.',
      fr: 'Feuille de réconciliation jointe. Alerte de réapprovisionnement recommandée pour les jambières de batteur senior.',
      sw: 'Nimeambatanisha fomu ya kulinganisha akiba. Inapendekezwa kutoa oda ya walinzi wa miguu ya wachezaji wakuu.'
    }
  },
  'tsk-003': {
    title: {
      en: 'Floodlight Tower Generator Fuel & Phase Load Testing',
      rw: 'Isuzuma ry\'Amavuta na Moteri y\'Amatara Manini ya Sitade',
      fr: 'Test de Carburant & de Charge des Groupes Électrogènes des Projecteurs',
      sw: 'Ukaguzi wa Mafuta ya Jenereta & Upimaji wa Mzigo wa Taa za Uwanja'
    },
    description: {
      en: 'Ensure 350kVA standby diesel generators for stadium towers 1 through 4 have full fuel reserves and pass 30-minute burn load test.',
      rw: 'Kugenzura ko moteri ya gazi ya 350kVA y\'amatara 1 kugeza kuri 4 ifite lisansi ihagije no gukora igerageza ry\'iminota 30.',
      fr: 'S\'assurer que les groupes électrogènes de 350kVA pour les mâts 1 à 4 sont pleins et réussissent le test de charge de 30 minutes.',
      sw: 'Hakikisha jenereta za dizeli za 350kVA za minara ya taa 1 hadi 4 zina mafuta ya kutosha na zimefaulu jaribio la dakika 30.'
    }
  },
  'tsk-004': {
    title: {
      en: 'VIP Pavilion Seating & Press Box Gigabit Uplink Verification',
      rw: 'Kugenzura Ibyicaro by\'Abanyacyubahiro no Guhuza Interineti mu Cyumba cy\'Itangazamakuru',
      fr: 'Vérification des Sièges du Pavillon VIP et de la Liaison Gigabit de la Presse',
      sw: 'Ukaguzi wa Viti vya Banda la VIP na Mtandao wa Gigabit wa Chumba cha Habari'
    },
    description: {
      en: 'Configure high-speed fiber connectivity and official scoring console terminals for live broadcast stream operators.',
      rw: 'Gutunganya interineti ya fibre optic yihuta cyane n\'ibikoresho by\'amanota ku bashinzwe gutangaza umukino imbonankubone.',
      fr: 'Configurer la connectivité fibre haut débit et les consoles de score pour les opérateurs de diffusion en direct.',
      sw: 'Sanidi mtandao wa kasi wa fiber na vituo rasmi vya kurekodi alama kwa waendeshaji wa matangazo ya moja kwa moja.'
    },
    instructions: {
      en: 'Verify primary 200Mbps dedicated uplink in Media Center. Test HDMI feeds from electronic scoreboard to broadcast van interface.',
      rw: 'Kugenzura ko interineti ifite umuvuduko wa 200Mbps mu Cyumba cy\'Itangazamakuru. Gupima imiyoboro ya HDMI iva ku cyapa cy\'amanota ijya mu modoka y\'itangazamakuru.',
      fr: 'Vérifier la liaison montante dédiée de 200 Mbps dans le centre des médias. Tester les flux HDMI du tableau de score au car-régie.',
      sw: 'Hakikisha mtandao mkuu wa 200Mbps katika Kituo cha Habari. Jaribu mawimbi ya HDMI kutoka ubao wa alama hadi gari la matangazo.'
    },
    reportSummary: {
      en: 'Media box dual fiber WAN tested at 215Mbps down / 195Mbps up. Scoreboard optical feed latency measured at 12ms. 18 commentary positions patched.',
      rw: 'Umuyoboro wa fibre optic wagenzuwe ugaragaza umuvuduko wa 215Mbps kumanura / 195Mbps kuzamura. Gutinda kw\'icyapa cy\'amanota kwapimwe kuri 12ms. Imyanya 18 y\'abavuga umukino yateguwe neza.',
      fr: 'WAN fibre du boîtier média testé à 215 Mbps en réception / 195 Mbps en envoi. Latence du tableau mesurée à 12 ms. 18 postes de commentaires configurés.',
      sw: 'Mtandao wa fiber katika chumba cha habari umepimwa kwa kasi ya 215Mbps kushusha / 195Mbps kupakia. Ucheleweshaji wa ubao wa alama ni 12ms. Viti 18 vya watangazaji vimeunganishwa.'
    },
    deliverablesNotes: {
      en: 'Broadcast patch report signed off by technical technician.',
      rw: 'Raporo y\'itangazamakuru yashyizweho umukono n\'umutekinisiye mukuru.',
      fr: 'Rapport de raccordement de diffusion validé par le technicien technique.',
      sw: 'Ripoti ya maunganisho ya matangazo imesainiwa na fundi mkuu.'
    }
  },
  'tsk-005': {
    title: {
      en: 'Rwanda U-19 National Squad Match Kit Issuance & Sizing Roster',
      rw: 'Gutanga Imyenda y\'Umukino n\'Ibarura ry\'Ingano ku Ikipe y\'u Rwanda y\'Abatarengeje 19',
      fr: 'Distribution des Équipements de Match et Liste des Tailles de l\'Équipe U-19 du Rwanda',
      sw: 'Ugawaji wa Sare za Mechi na Orodha ya Saizi kwa Kikosi cha Taifa cha Rwanda U-19'
    },
    description: {
      en: 'Issue official national team match jerseys, trousers, and training caps from the new shipment to 16 national squad players.',
      rw: 'Gutanga imipira y\'umukino, amapantalo n\'ingofero byo mu bikoresho bishya ku bakinnyi 16 b\'ikipe y\'igihugu.',
      fr: 'Distribuer les maillots officiels, pantalons et casquettes d\'entraînement du nouvel arrivage aux 16 joueurs de l\'équipe nationale.',
      sw: 'Toa jezi rasmi za mechi za timu ya taifa, suruali, na kofia za mazoezi kutoka mzigo mpya kwa wachezaji 16 wa timu ya taifa.'
    },
    instructions: {
      en: 'Log player signature for each kit bag. Inspect embroidery of GCS and Rwanda Cricket Association badges.',
      rw: 'Andika umukono wa buri mukinnyi yakira igikapu. Genzura imideri n\'ibirango bya GCS n\'ishyirahamwe rya Kriketi mu Rwanda.',
      fr: 'Enregistrer la signature de chaque joueur pour son sac d\'équipement. Inspecter les broderies des écussons GCS et RCA.',
      sw: 'Weka saini ya mchezaji kwa kila mkoba wa vifaa. Kagua taraza za nembo za GCS na Shirikisho la Kriketi la Rwanda.'
    },
    reportSummary: {
      en: 'Issued match kits to 14 players. Sizes L and XL distributed.',
      rw: 'Hatanzwe imyenda y\'umukino ku bakinnyi 14. Hatanzwe ingano L na XL.',
      fr: 'Équipements de match distribués à 14 joueurs. Tailles L et XL distribuées.',
      sw: 'Vifaa vya mechi vimetolewa kwa wachezaji 14. Saizi L na XL zimesambazwa.'
    },
    deliverablesNotes: {
      en: 'Player signature sheet partial.',
      rw: 'Urutonde rw\'imikono y\'abakinnyi ruracyaburaho bake.',
      fr: 'Feuille de signatures des joueurs partielle.',
      sw: 'Karatasi ya saini za wachezaji haijakamilika.'
    }
  }
};

// 2. Task Comments Translations Map
export const COMMENT_TRANSLATIONS: Record<string, LocalizedContent> = {
  'tc-001': {
    en: 'ICC technical delegation arrives Wednesday morning at 09:00 AM. Please verify the grass cutting height is exactly 4mm.',
    rw: 'Itsinda ry\'abatekinisiye ba ICC riragera hano ku wa Gatatu saa tatu za mugitondo (09:00). Nyamuneka genzura ko uburebure bw\'ibyatsi buri kuri milimetero 4 neza.',
    fr: 'La délégation technique de l\'ICC arrive mercredi matin à 09h00. Veuillez vérifier que la hauteur de tonte est exactement de 4mm.',
    sw: 'Ujumbe wa kiufundi wa ICC unawasili Jumatano asubuhi saa 03:00 kamili. Tafadhali thibitisha urefu wa kukata nyasi ni milimita 4 kamili.'
  },
  'tc-002': {
    en: 'Noted. Ground team completed morning cross-cut at 4mm. Moisture level is currently at 14.8%, within ICC specification (13-16%).',
    rw: 'Byumvikanye. Ikipe yo ku kibuga yarangije gukata ku burebure bwa milimetero 4 muri iki gitondo. Ubuhehere buri kuri 14.8%, bikaba biri mu bipimo bisabwa na ICC (13-16%).',
    fr: 'Bien noté. L\'équipe a effectué la coupe croisée matinale à 4mm. Le taux d\'humidité est à 14,8%, conforme aux normes ICC (13-16%).',
    sw: 'Imepokelewa. Timu ya uwanja imekamilisha ukataji wa asubuhi kwa 4mm. Kiwango cha unyevu kiko 14.8%, kikiwa ndani ya vigezo vya ICC (13-16%).'
  },
  'tc-003': {
    en: 'Report submitted along with asset condition logs. Awaiting supervisor review.',
    rw: 'Raporo yashyikirijwe hamwe n\'inyandiko z\'imiterere y\'ibikoresho. Dutegereje isuzuma ry\'umugenzuzi.',
    fr: 'Rapport soumis avec l\'état des équipements. En attente de la validation du superviseur.',
    sw: 'Ripoti imewasilishwa pamoja na daftari ya hali ya vifaa. Inasubiri ukaguzi wa msimamizi.'
  },
  'tc-004': {
    en: 'Please resubmit once the remaining signatures and size replacement requests are filed with Jean-Paul.',
    rw: 'Nyamuneka uzongere wohereze raporo umaze kubona imikono isigaye no kugeza ubusabe bw\'ingano kuri Jean-Paul.',
    fr: 'Veuillez soumettre à nouveau une fois que les signatures restantes et les demandes de remplacement de taille auront été déposées auprès de Jean-Paul.',
    sw: 'Tafadhali wasilisha tena mara tu saini zilizobaki na maombi ya mabadiliko ya saizi yatakapowasilishwa kwa Jean-Paul.'
  }
};

// 3. Direct Messages Translations Map
export const MESSAGE_TRANSLATIONS: Record<string, LocalizedContent> = {
  'msg-01': {
    en: 'Damascene, have you checked the soil compaction figures for pitch 3 following yesterday afternoon rains?',
    rw: 'Damascene, waba warebye ibipimo byo gukomera k\'ubutaka bw\'ikibuga cya 3 nyuma y\'imvura yo ku mugoroba w\'ejo?',
    fr: 'Damascène, as-tu vérifié les données de compactage du terrain 3 après les pluies d\'hier après-midi?',
    sw: 'Damascene, je umechunguza viwango vya ukandamizaji wa udongo wa uwanja wa 3 kufuatia mvua ya jana jioni?'
  },
  'msg-02': {
    en: 'Yes Claire, the triple covers kept the strip completely dry. We completed 90 minutes of static rolling and the Clegg impact value is 95 gravities, exactly on target.',
    rw: 'Yego Claire, amahema atatu yaragaye yatumye ikibuga kiguma cyumye neza. Twamaze iminota 90 dukoresha imashini ikanda kandi igipimo cya Clegg kiri kuri 95, nk\'uko byari biteganyijwe.',
    fr: 'Oui Claire, les triples bâches ont gardé la piste parfaitement sèche. Nous avons terminé 90 minutes de roulement et la valeur Clegg est à 95, pile dans la cible.',
    sw: 'Ndiyo Claire, vifuniko vitatu vilihakikisha uwanja unabaki mkavu kabisa. Tulikamilisha dakika 90 za kukandamiza na kipimo cha Clegg ni 95, sawa kabisa na lengo.'
  },
  'msg-03': {
    en: 'Great. Make sure Aline has the boundary foam wedges positioned and branded for the TV cameras.',
    rw: 'Ni byiza cyane. Reba neza ko Aline ashyira ibikoresho by\'amapovu ku mbibi zifite ibirango byo kuri televiziyo.',
    fr: 'Parfait. Assure-toi qu\'Aline a bien positionné les mousses de délimitation aux couleurs des caméras TV.',
    sw: 'Safi sana. Hakikisha Aline ameweka povu za mpaka zenye nembo tayari kwa ajili ya kamera za runinga.'
  },
  'msg-04': {
    en: 'Hi Damascene, our remaining stock of Kookaburra White turf balls is down to 12 boxes (72 balls). If the international series uses 2 balls per match plus practice, we will breach our reserve threshold.',
    rw: 'Mwaramutse Damascene, imipira yera ya Kookaburra isigaye mu bubiko igeze ku masanduku 12 gusa (imipira 72). Niba imikino mpuzamahanga izakoresha imipira 2 kuri buri mukino n\'imyitozo, tuzaba munsi y\'igipimo ntarengwa cy\'ububiko.',
    fr: 'Salut Damascène, notre stock de balles blanches Kookaburra est tombé à 12 boîtes (72 balles). Si la série internationale utilise 2 balles par match plus l\'entraînement, nous passerons sous le seuil d\'alerte.',
    sw: 'Habari Damascene, akiba yetu ya mipira meupe ya Kookaburra imebaki masanduku 12 tu (mipira 72). Iwapo mfululizo wa kimataifa utatumia mipira 2 kwa mechi na mazoezi, tutavuka kiwango cha tahadhari cha akiba.'
  }
};

// 4. Announcements Translations Map
export const ANNOUNCEMENT_TRANSLATIONS: Record<string, {
  title: LocalizedContent;
  body: LocalizedContent;
}> = {
  'anc-001': {
    title: {
      en: 'ICC Delegation Inspection Schedule & Oval Curfew',
      rw: 'Gahunda y\'Isuzuma ry\'Intumwa za ICC n\'Itegeko ryo Kutinjira mu Kibuga',
      fr: 'Calendrier d\'Inspection de la Délégation ICC & Couvre-Feu du Terrain',
      sw: 'Ratiba ya Ukaguzi wa Ujumbe wa ICC & Marufuku ya Kuingia Uwanjani'
    },
    body: {
      en: 'Please note that the ICC Technical Inspector and Match Referee panel will conduct their official GCS ground accreditation on Wednesday, Oct 14 at 09:00 AM. Center pitches 2, 3, and 4 are strictly under curfew starting Tuesday 18:00. No unauthorized footwear permitted past the 30-yard circle.',
      rw: 'Mumenyeshejwe ko intumwa z\'abatekinisiye ba ICC n\'abasifuzi bazaza gukora igenzura rya sitade ku wa Gatatu, tariki 14 Ukwakira saa tatu za mugitondo (09:00). Ibibuga byo hagati 2, 3, na 4 birabujijwe kwinjirwamo kuva ku wa Kabiri saa kumi n\'ebyiri z\'umugoroba (18:00). Nta nkweto zitabugenewe zemerewe kurenga uruziga rwa metero 30.',
      fr: 'Veuillez noter que l\'inspecteur technique et les arbitres de l\'ICC effectueront l\'accréditation officielle du terrain mercredi 14 octobre à 09h00. Les terrains centraux 2, 3 et 4 sont strictement sous couvre-feu dès mardi 18h00. Chaussures non autorisées interdites au-delà du cercle de 30 yards.',
      sw: 'Tafadhali fahamu kuwa Mkaguzi wa Kiufundi wa ICC na jopo la Waamuzi watafanya ukaguzi rasmi wa uwanja wa GCS siku ya Jumatano, Oktoba 14 saa 03:00 asubuhi. Nyanja za kati 2, 3, na 4 ziko chini ya marufuku kuanzia Jumanne saa 12:00 jioni. Viatu visivyoruhusiwa haviruhusiwi kupita duara la yadi 30.'
    }
  },
  'anc-002': {
    title: {
      en: 'Store Bi-Weekly Requisition Window Notice',
      rw: 'Itangazo ku Igihe cyo Gusaba Ibikoresho mu Bubiko Buri Byumweru Bibiri',
      fr: 'Avis sur la Fenêtre Quinzomadaire de Réquisition du Magasin',
      sw: 'Notisi ya Kipindi cha Maombi ya Vifaa vya Ghala Kila Wiki Mbili'
    },
    body: {
      en: 'All department heads and squad managers must submit equipment issue requests through the GCS Operations Hub by Thursdays at 14:00 to guarantee Friday morning kit packing and dispatch.',
      rw: 'Abakuriye amashami bose n\'abashinzwe amakipe bagomba kohereza ubusabe bw\'ibikoresho binyuze muri GCS Hub bitarenze kuwa Kane saa munani (14:00) kugira ngo byitegurwe kandi bitangwe kuwa Gatanu mugitondo.',
      fr: 'Tous les chefs de département et gestionnaires d\'équipe doivent soumettre leurs demandes d\'équipement via le hub GCS avant jeudi 14h00 pour garantir l\'emballage et la distribution vendredi matin.',
      sw: 'Wakuu wote wa idara na wasimamizi wa timu lazima wawasilishe maombi ya vifaa kupitia mfumo wa GCS kabla ya Alhamisi saa 08:00 mchana ili kuhakikisha vifaa vinafungwa na kusambazwa Ijumaa asubuhi.'
    }
  },
  'anc-003': {
    title: {
      en: 'Stadium Floodlight Tower 3 Luminaire Recalibration',
      rw: 'Isubiramo ry\'Amatara yo ku Munara wa 3 wa Sitade',
      fr: 'Recalibrage des Luminaires du Mât d\'Éclairage n°3 du Stade',
      sw: 'Urekebishaji wa Mwangaza wa Mnara wa 3 wa Taa za Uwanja'
    },
    body: {
      en: 'Electrical engineering contractors will access Tower 3 crane bucket between 07:00 and 11:00 on Thursday. Net 4 and the eastern practice wickets will be closed during work hours for safety.',
      rw: 'Abatekinisiye b\'amashanyarazi bazazamuka ku munara wa 3 kuwa Kane hagati ya saa moya na saa tanu za mugitondo (07:00 - 11:00). Inshundura ya 4 n\'ikibuga cy\'imyitozo cy\'iburasirazuba bizafungwa ku bwo kwirinda impanuka.',
      fr: 'Les techniciens électriciens accéderont à la nacelle du mât 3 jeudi entre 07h00 et 11h00. Le filet 4 et les terrains d\'entraînement est seront fermés par sécurité.',
      sw: 'Wakandarasi wa umeme watapanda kwenye mnara wa 3 Alhamisi kati ya saa 01:00 na 05:00 asubuhi. Wavu wa 4 na uwanja wa mazoezi wa mashariki vitafungwa kwa ajili ya usalama.'
    }
  }
};

// 5. Calendar Events Translations Map
export const CALENDAR_TRANSLATIONS: Record<string, {
  title: LocalizedContent;
  description?: LocalizedContent;
  location?: LocalizedContent;
}> = {
  'evt-001': {
    title: {
      en: 'East Africa T20 Challenge: Rwanda vs Uganda',
      rw: 'Irushanwa rya T20 ry\'Afurika y\'Iburasirazuba: u Rwanda vs Uganda',
      fr: 'East Africa T20 Challenge: Rwanda vs Ouganda',
      sw: 'Mashindano ya T20 ya Afrika Mashariki: Rwanda dhidi ya Uganda'
    },
    description: {
      en: 'Official bilateral international T20 fixture. Broadcaster broadcast gallery live.',
      rw: 'Umukino mpuzamahanga wemewe wa T20. Uratambuka imbonankubone kuri televiziyo.',
      fr: 'Rencontre internationale officielle T20. Retransmission télévisée en direct.',
      sw: 'Mechi rasmi ya kimataifa ya T20. Matangazo ya moja kwa moja ya televisheni.'
    },
    location: {
      en: 'Center Match Pitch #3',
      rw: 'Ikibuga cy\'Umukino Hagati #3',
      fr: 'Terrain Central de Match #3',
      sw: 'Uwanja wa Kati wa Mechi #3'
    }
  },
  'evt-002': {
    title: {
      en: 'Rwanda Women U-19 Development Series (Match 1)',
      rw: 'Uruhererekane rw\'Imikino y\'Abangavu batarengeje imyaka 19 mu Rwanda (Umukino wa 1)',
      fr: 'Série de Développement Féminin U-19 du Rwanda (Match 1)',
      sw: 'Mfululizo wa Maendeleo ya Wanawake wa Rwanda U-19 (Mechi ya 1)'
    },
    description: {
      en: 'National youth pathway fixture. Talent scouts attending.',
      rw: 'Umukino w\'urubyiruko rw\'igihugu. Abashakisha impano bazaba bahari.',
      fr: 'Match de détection des jeunes espoirs nationaux. Recruteurs présents.',
      sw: 'Mechi ya kukuza vipaji vya vijana wa taifa. Maskauti wa vipaji watahudhuria.'
    },
    location: {
      en: 'Center Pitch #3',
      rw: 'Ikibuga cyo Hagati #3',
      fr: 'Terrain Central #3',
      sw: 'Uwanja wa Kati #3'
    }
  },
  'evt-003': {
    title: {
      en: 'Kigali Premier Cricket League Championship Final',
      rw: 'Umukino wa Nyuma wa Shampiyona ya Cricket i Kigali',
      fr: 'Finale du Championnat de la Premier League de Kigali',
      sw: 'Fainali ya Ligi Kuu ya Kriketi ya Kigali'
    },
    description: {
      en: 'Club championship final. VIP pavilion reserved.',
      rw: 'Umukino wa nyuma w\'amakipe. Icyumba cy\'abanyacyubahiro cyamaze kwishyurwa.',
      fr: 'Finale du championnat des clubs. Tribune VIP réservée.',
      sw: 'Fainali ya ubingwa wa vilabu. Sehemu ya VIP imetengwa.'
    },
    location: {
      en: 'Center Pitch #2',
      rw: 'Ikibuga cyo Hagati #2',
      fr: 'Terrain Central #2',
      sw: 'Uwanja wa Kati #2'
    }
  }
};

// 6. Generic Dictionary & Heuristic Sentence Translator
// For runtime user-created comments, messages, or tasks
const COMMON_PHRASE_DICTIONARY: Record<string, LocalizedContent> = {
  'task': { en: 'Task', rw: 'Umurimo', fr: 'Tâche', sw: 'Kazi' },
  'tasks': { en: 'Tasks', rw: 'Imirimo', fr: 'Tâches', sw: 'Kazi' },
  'pitch': { en: 'Pitch', rw: 'Ikibuga', fr: 'Terrain', sw: 'Uwanja' },
  'cricket': { en: 'Cricket', rw: 'Kriketi', fr: 'Cricket', sw: 'Kriketi' },
  'match': { en: 'Match', rw: 'Umukino', fr: 'Match', sw: 'Mechi' },
  'stadium': { en: 'Stadium', rw: 'Sitade', fr: 'Stade', sw: 'Uwanja' },
  'training': { en: 'Training', rw: 'Imyitozo', fr: 'Entraînement', sw: 'Mafunzo' },
  'completed': { en: 'Completed', rw: 'Byarangiye', fr: 'Terminé', sw: 'Imekamilika' },
  'approved': { en: 'Approved', rw: 'Byemejwe', fr: 'Approuvé', sw: 'Imeidhinishwa' },
  'urgent': { en: 'Urgent', rw: 'Byihutirwa', fr: 'Urgent', sw: 'Dharura' },
  'good morning': { en: 'Good morning', rw: 'Mwaramutse', fr: 'Bonjour', sw: 'Habari za asubuhi' },
  'good afternoon': { en: 'Good afternoon', rw: 'Mwiriwe', fr: 'Bon après-midi', sw: 'Habari za mchana' },
  'hello': { en: 'Hello', rw: 'Muraho', fr: 'Bonjour', sw: 'Hujambo' },
  'thank you': { en: 'Thank you', rw: 'Murakoze', fr: 'Merci', sw: 'Asante' },
  'please': { en: 'Please', rw: 'Nyamuneka', fr: 'S\'il vous plaît', sw: 'Tafadhali' },
  'report': { en: 'Report', rw: 'Raporo', fr: 'Rapport', sw: 'Ripoti' },
  'inspection': { en: 'Inspection', rw: 'Igenzura', fr: 'Inspection', sw: 'Ukaguzi' },
  'equipment': { en: 'Equipment', rw: 'Ibikoresho', fr: 'Équipement', sw: 'Vifaa' },
  'inventory': { en: 'Inventory', rw: 'Ububiko', fr: 'Inventaire', sw: 'Hifadhi ya Vifaa' },
  'ready': { en: 'Ready', rw: 'Biteguye', fr: 'Prêt', sw: 'Tayari' },
  'noted': { en: 'Noted', rw: 'Byumvikanye', fr: 'Bien noté', sw: 'Imepokelewa' },
  'great job': { en: 'Great job', rw: 'Akazi keza', fr: 'Beau travail', sw: 'Kazi nzuri' },
  'in progress': { en: 'In Progress', rw: 'Biri Gukorwa', fr: 'En cours', sw: 'Inaendelea' }
};

/**
 * Translates a dynamic string using dictionaries, phrase maps, and memory cache.
 */
export function translateText(text: string, targetLang: Language): string {
  if (!text || targetLang === 'en') return text;

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Check common phrase dictionary
  if (COMMON_PHRASE_DICTIONARY[lower]) {
    return COMMON_PHRASE_DICTIONARY[lower][targetLang] || text;
  }

  // Check stored dynamic translations cache
  const cacheKey = `trans_${targetLang}_${lower.slice(0, 40)}`;
  const cached = loadFromStorage<string | null>(cacheKey, null);
  if (cached) return cached;

  // Partial phrase replacements for cricket operations terms
  let translated = text;
  for (const [key, mapping] of Object.entries(COMMON_PHRASE_DICTIONARY)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    if (regex.test(translated)) {
      translated = translated.replace(regex, mapping[targetLang]);
    }
  }

  if (translated !== text) {
    saveToStorage(cacheKey, translated);
  }

  return translated;
}

/**
 * Localizes an entire list of Tasks into the specified target language
 */
export function translateTasks(tasks: Task[], targetLang: Language): Task[] {
  return tasks.map((task) => {
    const known = TASK_TRANSLATIONS[task.id];
    const title = known ? known.title[targetLang] || task.title : translateText(task.title, targetLang);
    const description = known ? known.description[targetLang] || task.description : translateText(task.description, targetLang);
    const instructions = known?.instructions ? known.instructions[targetLang] : task.instructions ? translateText(task.instructions, targetLang) : '';

    // Comments
    const comments = (task.comments || []).map((c: TaskComment) => {
      const knownComment = COMMENT_TRANSLATIONS[c.id];
      const commentText = knownComment ? knownComment[targetLang] || c.text : translateText(c.text, targetLang);
      return {
        ...c,
        text: commentText
      };
    });

    // Submissions
    const submissions = (task.submissions || []).map((s: TaskSubmission) => {
      const reportSummary = known?.reportSummary ? known.reportSummary[targetLang] : s.reportSummary ? translateText(s.reportSummary, targetLang) : s.reportSummary;
      const deliverablesNotes = known?.deliverablesNotes ? known.deliverablesNotes[targetLang] : s.deliverablesNotes ? translateText(s.deliverablesNotes, targetLang) : s.deliverablesNotes;
      const reviewComment = s.reviewComment ? translateText(s.reviewComment, targetLang) : s.reviewComment;
      return {
        ...s,
        reportSummary,
        deliverablesNotes,
        reviewComment
      };
    });

    return {
      ...task,
      title,
      description,
      instructions,
      comments,
      submissions
    };
  });
}

/**
 * Localizes Direct Messages into the specified target language
 */
export function translateMessages(messages: DirectMessage[], targetLang: Language): DirectMessage[] {
  return messages.map((msg) => {
    const known = MESSAGE_TRANSLATIONS[msg.id];
    const content = known ? known[targetLang] || msg.content : translateText(msg.content, targetLang);
    return {
      ...msg,
      content
    };
  });
}

/**
 * Localizes Announcements into the specified target language
 */
export function translateAnnouncements(announcements: Announcement[], targetLang: Language): Announcement[] {
  return announcements.map((anc) => {
    const known = ANNOUNCEMENT_TRANSLATIONS[anc.id];
    const title = known ? known.title[targetLang] || anc.title : translateText(anc.title, targetLang);
    const body = known ? known.body[targetLang] || anc.body : translateText(anc.body, targetLang);
    return {
      ...anc,
      title,
      body
    };
  });
}

/**
 * Localizes Calendar Events into the specified target language
 */
export function translateCalendarEvents(events: CalendarEvent[], targetLang: Language): CalendarEvent[] {
  return events.map((evt) => {
    const known = CALENDAR_TRANSLATIONS[evt.id];
    const title = known ? known.title[targetLang] || evt.title : translateText(evt.title, targetLang);
    const description = known?.description ? known.description[targetLang] : evt.description ? translateText(evt.description, targetLang) : evt.description;
    const location = known?.location ? known.location[targetLang] : evt.location;
    return {
      ...evt,
      title,
      description,
      location: location || evt.location
    };
  });
}

/**
 * Localizes In-App Notifications into the specified target language
 */
export function translateNotifications(notifications: InAppNotification[], targetLang: Language): InAppNotification[] {
  const notifMap: Record<string, LocalizedContent> = {
    'notif-01': {
      en: 'Claire Uwase assigned task: "ICC T20 Regional Qualifiers: Center Pitch Preparation & Moisture Test".',
      rw: 'Claire Uwase yaguhaye umurimo: "Ijonjora rya ICC T20: Gutegura Ikibuga Hagati no Gupima Ubuhehere".',
      fr: 'Claire Uwase a assigné la tâche: "Qualifications Régionales ICC T20: Préparation du Terrain Central & Test d\'Humidité".',
      sw: 'Claire Uwase amekabidhi kazi: "Mchujo wa Kikanda wa ICC T20: Maandalizi ya Uwanja wa Kati & Kipimo cha Unyevu".'
    }
  };

  return notifications.map((n) => {
    const known = notifMap[n.id];
    return {
      ...n,
      message: known ? known[targetLang] : translateText(n.message, targetLang)
    };
  });
}

// 7. Inventory Items Translations Map
export const INVENTORY_TRANSLATIONS: Record<string, {
  name: LocalizedContent;
  description: LocalizedContent;
  category?: LocalizedContent;
  unit?: LocalizedContent;
}> = {
  'inv-bat-01': {
    name: {
      en: 'Bats',
      rw: 'Inkoni (Bats)',
      fr: 'Battes',
      sw: 'Popo (Bats)'
    },
    category: {
      en: 'Bats',
      rw: 'Inkoni (Bats)',
      fr: 'Battes',
      sw: 'Popo (Bats)'
    },
    description: {
      en: 'Match-grade short handle bats with balanced pick-up.',
      rw: 'Inkoni z\'umukino ziringaniye neza mu ntoki.',
      fr: 'Battes de match professionnelles avec équilibre parfait.',
      sw: 'Popo za mechi zenye mpini mfupi na uwiano thabiti.'
    }
  },
  'inv-bat-02': {
    name: {
      en: 'Training Bats',
      rw: 'Inkoni zo Kwitozaho',
      fr: 'Battes d\'Entraînement',
      sw: 'Popo za Mazoezi'
    },
    category: {
      en: 'Bats',
      rw: 'Inkoni (Bats)',
      fr: 'Battes',
      sw: 'Popo (Bats)'
    },
    description: {
      en: 'Durable practice bats for training nets and bowling machine drills.',
      rw: 'Inkoni zikomeye zo kwitozaho mu nshundura no mu myitozo.',
      fr: 'Battes d\'entraînement robustes pour les filets et les machines.',
      sw: 'Popo imara za mazoezi kwa vyandarua na mashine za kurusha.'
    }
  },
  'inv-ball-01': {
    name: {
      en: 'Balls (White)',
      rw: 'Imipira Yera',
      fr: 'Balles Blanches',
      sw: 'Mipira Myeupe'
    },
    category: {
      en: 'Balls',
      rw: 'Imipira',
      fr: 'Balles',
      sw: 'Mipira'
    },
    description: {
      en: 'Standard white leather match balls for official day and night fixtures.',
      rw: 'Imipira yera y\'uruhu yagenewe imikino ya kumanywa no mu ijoro.',
      fr: 'Balles de match blanches en cuir pour matchs de jour et sous projecteurs.',
      sw: 'Mipira myeupe ya ngozi kwa mechi za mchana na usiku.'
    }
  },
  'inv-ball-02': {
    name: {
      en: 'Balls (Red)',
      rw: 'Imipira Itukura',
      fr: 'Balles Rouges',
      sw: 'Mipira Mwekundu'
    },
    category: {
      en: 'Balls',
      rw: 'Imipira',
      fr: 'Balles',
      sw: 'Mipira'
    },
    description: {
      en: 'Standard red leather match balls for multi-day and league fixtures.',
      rw: 'Imipira itukura y\'uruhu yagenewe imikino ya shampiyona.',
      fr: 'Balles rouges réglementaires en cuir pour les matchs de ligue.',
      sw: 'Mipira mwekundu ya ngozi kwa mechi za ligi.'
    }
  },
  'inv-ball-03': {
    name: {
      en: 'Balls (Practice)',
      rw: 'Imipira yo Kwitozaho',
      fr: 'Balles d\'Entraînement',
      sw: 'Mipira ya Mazoezi'
    },
    category: {
      en: 'Balls',
      rw: 'Imipira',
      fr: 'Balles',
      sw: 'Mipira'
    },
    description: {
      en: 'High durability practice balls for net machines and bowling practice.',
      rw: 'Imipira yo kwitozaho muri mashini zo gutera imipira.',
      fr: 'Balles durables pour les machines à lancer et les entraînements.',
      sw: 'Mipira imara ya mazoezi kwa ajili ya mashine za vyandarua.'
    }
  },
  'inv-stp-01': {
    name: {
      en: 'Stumps (LED)',
      rw: 'Inkingi za LED',
      fr: 'Piquets LED',
      sw: 'Nguzo za LED'
    },
    category: {
      en: 'Stumps',
      rw: 'Inkingi',
      fr: 'Piquets',
      sw: 'Nguzo'
    },
    description: {
      en: 'Electronic LED stumps and bails set with wireless impact sensors.',
      rw: 'Inkingi z\'amashanyarazi n\'amatara ya LED afite ibyuma by\'itumanaho.',
      fr: 'Piquets et témoins électroniques à LED avec capteurs sans fil.',
      sw: 'Nguzo za kielektroniki zenye mweko wa LED na vihisishi visivyo na waya.'
    }
  },
  'inv-stp-02': {
    name: {
      en: 'Stumps (Spring)',
      rw: 'Inkingi zo Kwitozaho',
      fr: 'Piquets à Ressort',
      sw: 'Nguzo zenye Spring'
    },
    category: {
      en: 'Stumps',
      rw: 'Inkingi',
      fr: 'Piquets',
      sw: 'Nguzo'
    },
    description: {
      en: 'Outdoor practice wicket sets mounted on heavy steel spring bases.',
      rw: 'Inkingi zo kwitozaho zo hanze zometse ku cyuma gikomeye.',
      fr: 'Piquets d\'entraînement extérieurs montés sur socle à ressort.',
      sw: 'Nguzo za mazoezi ya nje zenye chemchemi ya chuma.'
    }
  },
  'inv-uni-01': {
    name: {
      en: 'Jerseys',
      rw: 'Imipira y\'Umukino',
      fr: 'Maillots',
      sw: 'Jezi'
    },
    category: {
      en: 'Uniforms',
      rw: 'Imyenda',
      fr: 'Uniformes',
      sw: 'Sare'
    },
    description: {
      en: 'Official match jerseys with team crest and player numbers.',
      rw: 'Imipira y\'umukino ifite ikirango cya RCA na nimero z\'abakinnyi.',
      fr: 'Maillots officiels avec écusson et numéros de joueur.',
      sw: 'Jezi rasmi zenye nembo na nambari za wachezaji.'
    }
  },
  'inv-pad-01': {
    name: {
      en: 'Pads',
      rw: 'Pads',
      fr: 'Jambières',
      sw: 'Vilinda Miguu (Pads)'
    },
    category: {
      en: 'Pads',
      rw: 'Pads',
      fr: 'Jambières',
      sw: 'Vilinda Miguu'
    },
    description: {
      en: 'Batting leg guards and protection pads with gel knee cups.',
      rw: 'Ibikoresho by\'amaguru byo kurinda abakinnyi mu mukino.',
      fr: 'Jambières de protection de batteur avec genouillères.',
      sw: 'Vilinda miguu vya kuzuia majeraha wakati wa kupiga mpira.'
    }
  },
  'inv-hlm-01': {
    name: {
      en: 'Helmets',
      rw: 'Ingofero z\'Umutekano',
      fr: 'Casques',
      sw: 'Kofia za Chuma'
    },
    category: {
      en: 'Helmets',
      rw: 'Ingofero',
      fr: 'Casques',
      sw: 'Kofia'
    },
    description: {
      en: 'Cricket safety helmets meeting impact safety standards.',
      rw: 'Ingofero z\'umutekano zirinda umutwe ku bakinnyi ba cricket.',
      fr: 'Casques de cricket répondant aux normes de sécurité contre les impacts.',
      sw: 'Kofia ngumu za usalama zinazotimiza viwango vya usalama.'
    }
  },
  'inv-gnd-01': {
    name: {
      en: 'Boundary Ropes',
      rw: 'Imigozi y\'Imbibi',
      fr: 'Cordes de Limite',
      sw: 'Kamba za Mipaka'
    },
    category: {
      en: 'Ground Equipment',
      rw: 'Ibikoresho by\'Ikibuga',
      fr: 'Équipement de Terrain',
      sw: 'Vifaa vya Uwanja'
    },
    description: {
      en: 'Perimeter boundary rope reel with weather-resistant core.',
      rw: 'Imigozi iranga imbibi z\'ikibuga cyose.',
      fr: 'Bobine de corde de délimitation extérieure résistante aux intempéries.',
      sw: 'Kamba ya kupima na kuweka alama ya mipaka ya uwanja.'
    }
  },
  'inv-gnd-02': {
    name: {
      en: 'Pitch Covers',
      rw: 'Ibitandikwa ku Kibuga',
      fr: 'Bâches de Protection Pitch',
      sw: 'Vifuniko vya Uwanja'
    },
    category: {
      en: 'Ground Equipment',
      rw: 'Ibikoresho by\'Ikibuga',
      fr: 'Équipement de Terrain',
      sw: 'Vifaa vya Uwanja'
    },
    description: {
      en: 'Waterproof full-pitch rain covers with integrated wheeling handles.',
      rw: 'Ibitandikwa birinda ikibuga cyose imvura n\'ububyimbirwe.',
      fr: 'Bâches imperméables de protection de pitch contre la pluie avec poignées.',
      sw: 'Vifuniko vya kuzuia mvua kwenye eneo la uchezaji vyenye magurudumu.'
    }
  }
};

/**
 * Localizes Inventory Items into the specified target language
 */
export function translateInventory(items: InventoryItem[], targetLang: Language): InventoryItem[] {
  return items.map((item) => {
    const known = INVENTORY_TRANSLATIONS[item.id];
    const name = known ? known.name[targetLang] || item.name : translateText(item.name, targetLang);
    const description = known ? known.description[targetLang] || item.description : translateText(item.description, targetLang);
    const category = known?.category ? known.category[targetLang] : translateText(item.category, targetLang);
    const unit = known?.unit ? known.unit[targetLang] : translateText(item.unit, targetLang);
    return {
      ...item,
      name,
      description,
      category: category || item.category,
      unit: unit || item.unit
    };
  });
}
