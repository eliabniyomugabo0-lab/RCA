import { Language } from './types';
import { Task, DirectMessage, Announcement, InventoryItem, CalendarEvent } from '../types';

/**
 * High-quality authentic translations for all dynamic cricket stadium operations data:
 * tasks, comments, submission reports, announcements, direct messages, inventory, and fixtures.
 * Supported: en (English - Default), rw (Kinyarwanda), fr (French), sw (Kiswahili).
 */

export const CONTENT_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {}, // Original strings are in English

  // ================= KINYARWANDA (RW) =================
  rw: {
    // ---- Tasks: Titles ----
    'ICC T20 Regional Qualifiers: Center Pitch Preparation & Moisture Test':
      'Amajonjora ya ICC T20 mu Karere: Gutegura Ikibuga rwagati no Gupima Ubuhehere bw\'Ubutaka',
    'Quarterly High-Performance Academy Equipment Audit & Inventory Check':
      'Igenzura rya Buri Gihembwe ry\'Ibikoresho by\'Ishuri Rikuru rya Cricket n\'Ububiko',
    'Floodlight Tower Generator Fuel & Phase Load Testing':
      'Igenzura ry\'Amavuta ya Moteri n\'Imikorere y\'Amatara Manini ya Sitade',
    'VIP Pavilion Seating & Press Box Gigabit Uplink Verification':
      'Gusuzuma Ibyicaro by\'Abanyacyubahiro n\'Umuvuduko wa Murandasi mu Cyumba cy\'Itangazamakuru',
    'Rwanda U-19 National Squad Match Kit Issuance & Sizing Roster':
      'Gutanga Imyenda y\'Umukino n\'Ibirango ku Ikipe y\'Igihugu y\'Abatarengeje Imyaka 19',

    // ---- Tasks: Descriptions ----
    'Perform rolling schedule on Pitch #3 and calibrate soil moisture probes prior to official ICC Match Referee inspection.':
      'Kunyereza ikibuga cya 3 no gupima igipimo cy\'ubuhehere mbere y\'uko abagenzuzi ba ICC baza kugenzura ku mugaragaro.',
    'Physical count and condition assessment of all training bats, helmets, pads, and balls stored in Pavilion Store Bay B.':
      'Kubara no gusuzuma ubuziranenge bw\'inkoni, ingofero, ibirinda amaguru n\'imipira bibitse mu cyumba B cy\'ububiko bwa Sitade.',
    'Ensure 350kVA standby diesel generators for stadium towers 1 through 4 have full fuel reserves and pass 30-minute burn load test.':
      'Kureba ko moteri z\'amashanyarazi ya 350kVA z\'iminara 1 kugeza kuri 4 zifite mazutu ihagije no kuzicana mu gihe cy\'iminota 30.',
    'Configure high-speed fiber connectivity and official scoring console terminals for live broadcast stream operators.':
      'Gushyiraho murandasi yihuta cyane n\'ibikoresho byo kwandika amanota ku banyamakuru batambutsa imikino imbonankubone.',
    'Issue official national team match jerseys, trousers, and training caps from the new shipment to 16 national squad players.':
      'Gutanga imyenda mishya y\'umukino, amapantalo ningofero by\'ikipe y\'igihugu ku bakinnyi 16 batoranyijwe.',

    // ---- Tasks: Instructions ----
    '1. Complete 4-hour heavy roll with 1.5T vibrating roller.\n2. Take 5-point moisture core readings along length.\n3. Ensure boundary perimeter ropes are pinned at 68m radius.\n4. Log readings and upload pitch certification photo.':
      '1. Kunyereza amasaha 4 ukoresheje imashini inyereza ya toni 1.5.\n2. Gupima ubuhehere ahantu 5 hatandukanye ku kibuga.\n3. Kureba ko imigozi y\'urugabano iri kuri metero 68.\n4. Kwandika ibipimo no kohereza ifoto y\'icyemezo cy\'ikibuga.',
    'Reconcile physical stock against current ledger balances. Flag bats with willow hairline cracks for re-binding or retirement.':
      'Guhuza ibiri mu bubiko n\'ibiri mu bitabo. Kugaragaza inkoni zangiritse zikeneye gusanwa cyangwa gukurwa mu bikoresho.',
    'Check fuel level dipsticks (minimum 90% capacity). Run uninterrupted 30-min illumination test at 1,500 lux match mode.':
      'Kureba urugero rwa mazutu (nibura 90%). Gucana amatara yose ku gipimo cya lux 1,500 mu gihe cy\'iminota 30 idahagarara.',
    'Verify primary 200Mbps dedicated uplink in Media Center. Test HDMI feeds from electronic scoreboard to broadcast van interface.':
      'Kugenzura murandasi ifite umuvuduko wa 200Mbps mu kigo cy\'itangazamakuru. Kureba ko amashusho ava ku cyapa cy\'amanota agera mu modoka y\'itangazamakuru.',
    'Log player signature for each kit bag. Inspect embroidery of GCS and Rwanda Cricket Association badges.':
      'Kwandika umukono wa buri mukinnyi watwaye ibikoresho. Kugenzura ko ibirango bya GCS na RCA bidodeweho neza.',

    // ---- Tasks: Comments & Submission Notes ----
    'ICC technical delegation arrives Wednesday morning at 09:00 AM. Please verify the grass cutting height is exactly 4mm.':
      'Abagize itsinda rya tekiniki rya ICC bazahagera kuwa Gatatu saa tatu za mugitondo (09:00 AM). Nyamuneka mugenzure ko ibyatsi bikase neza kuri milimetero 4.',
    'Noted. Ground team completed morning cross-cut at 4mm. Moisture level is currently at 14.8%, within ICC specification (13-16%).':
      'Byumvikanye. Ikipe yo ku kibuga yarangije gukata ibyatsi kuri mm 4 muri iki gitondo. Ubuhehere buri kuri 14.8%, bikaba biri mu rugero rwa ICC (13-16%).',
    'Report submitted along with asset condition logs. Awaiting supervisor review.':
      'Raporo yoherejwe hamwe n\'amateka y\'ubuziranenge bw\'ibikoresho. Dutegereje isuzuma ry\'umuyobozi.',
    'Completed full physical count across 12 inventory categories. 48 Grade-1 match balls verified sealed. 4 training bats identified with toe crack damage, moved to repair hold.':
      'Ibarura ryuzuye ryakozwe mu byiciro 12 by\'ibikoresho. Imipira 48 yo mu rwego rwo hejuru yemejwe ko ifunze neza. Inkoni 4 zitoza zagaragayeho kwangirika zashyizwe ahasanirwa.',
    'Attached reconciliation variance sheet. Reorder threshold alert recommended for Senior Batting Pads.':
      'Impapuro zigaragaza ibyabonetse ziri kumwe na raporo. Birasabwa gutumiza vuba ibirinda amaguru by\'abakinnyi bakuru.',
    'Media box dual fiber WAN tested at 215Mbps down / 195Mbps up. Scoreboard optical feed latency measured at 12ms. 18 commentary positions patched.':
      'Murandasi y\'itangazamakuru yageragejwe kuri 215Mbps kumanura / 195Mbps kohereza. Icyapa cy\'amanota cyifashe neza (12ms). Ahantu 18 abanyamakuru bakorera haratunganijwe.',
    'Broadcast patch report signed off by technical technician.':
      'Raporo y\'itangazamakuru yemerewe n\'umutekinisiye ushinzwe ibyuma.',
    'Approved. Excellent preparation for the upcoming tournament.':
      'Yemejwe. Imyiteguro myiza cyane y\'amarushanwa yegereje.',
    'Issued match kits to 14 players. Sizes L and XL distributed.':
      'Imyenda yahawe abakinnyi 14. Ingano za L na XL zatanzwe.',
    'Player signature sheet partial.':
      'Urutonde rw\'imikono y\'abakinnyi ntabwo ruruzura.',
    'Missing signatures for 2 reserve bowlers (Player #15 and #16). Please collect signatures and clarify if size M replacements were ordered.':
      'Harabura imikono y\'abaterankoni 2 b\'abasimbura (Umukinnyi wa 15 n\'uwa 16). Nyamuneka mushake iyo mikono munemeze niba hatumijwe ingano ya M.',
    'Please resubmit once the remaining signatures and size replacement requests are filed with Jean-Paul.':
      'Nyamuneka mwongere mwohereze raporo nimara kuzuza imikono isigaye no kumenyesha Jean-Paul ibikenewe.',

    // ---- Direct Messages ----
    'Damascene, have you checked the soil compaction figures for pitch 3 following yesterday afternoon rains?':
      'Damascene, waba warebye imibare y\'igipimo cy\'ubutaka bw\'ikibuga cya 3 nyuma y\'imvura yaguye ejo nyuma ya saa sita?',
    'Yes Claire, the triple covers kept the strip completely dry. We completed 90 minutes of static rolling and the Clegg impact value is 95 gravities, exactly on target.':
      'Yego Claire, amashitinga atatu yarinze ikibuga neza cyane nticyatose. Twamaze iminota 90 tunyereza ikibuga, kandi igipimo cya Clegg kiri kuri 95 gravities, bikaba biri ku ntego neza.',
    'Great. Make sure Aline has the boundary foam wedges positioned and branded for the TV cameras.':
      'Ni byiza cyane. Reba ko Aline yashyizeho ibirinda urugabano birimo ibirango byagenewe kugaragara kuri televiziyo.',
    'Hi Damascene, our remaining stock of Kookaburra White turf balls is down to 12 boxes (72 balls). If the international series uses 2 balls per match plus practice, we will breach our reserve threshold.':
      'Muraho Damascene, imipira yera ya Kookaburra isigaye mu bubiko igeze ku masanduku 12 gusa (imipira 72). Niba imikino mpuzamahanga ikoresha imipira 2 kuri buri mukino n\'imyitozo, dushobora kurenga umubare ntarengwa w\'ububiko bw\'integuza.',

    // ---- Announcements ----
    'ICC Delegation Inspection Schedule & Oval Curfew':
      'Gahunda y\'Isuzuma ry\'Intumwa za ICC no Kubuza Kwinjira ku Kibuga',
    'Please note that the ICC Technical Inspector and Match Referee panel will conduct their official GCS ground accreditation on Wednesday, Oct 14 at 09:00 AM. Center pitches 2, 3, and 4 are strictly under curfew starting Tuesday 18:00. No unauthorized footwear permitted past the 30-yard circle.':
      'Mumenyeshejwe ko abagenzuzi ba ICC bazasura Sitade ya Gahanga ku mugaragaro kuwa Gatatu tariki 14 Ukwakira saa tatu za mugitondo (09:00 AM). Ibibuga byo hagati 2, 3, na 4 birabujijwe kwinjirwamo guhera kuwa Kabiri saa kumi n\'ebyiri z\'umugoroba (18:00). Ntihakagire uwambara inkweto zitari izo gukina cricket ngo arengere umurongo wa yadi 30.',
    'Store Bi-Weekly Requisition Window Notice':
      'Itangazo ku Igihe cyo Gusaba Ibikoresho mu Bubiko Buri Byumweru Bibiri',
    'All department heads and squad managers must submit equipment issue requests through the GCS Operations Hub by Thursdays at 14:00 to guarantee Friday morning kit packing and dispatch.':
      'Abayobozi b\'amashami yose n\'abayobozi b\'amakipe basabwe kohereza ubusabe bw\'ibikoresho binyuze muri GCS Hub bitarenze kuwa Kane saa munani (14:00) kugira ngo bipakirwe binate 체kuwa Gatanu mu gitondo.',
    'Stadium Floodlight Tower 3 Luminaire Recalibration':
      'Gutunganya Amatara y\'Umunara wa 3 w\'Amatara Manini ya Sitade',
    'Electrical engineering contractors will access Tower 3 crane bucket between 07:00 and 11:00 on Thursday. Net 4 and the eastern practice wickets will be closed during work hours for safety.':
      'Abatetsinisiye b\'amashanyarazi bazazamuka ku Munara wa 3 hagati ya saa moya (07:00) na saa tanu (11:00) kuwa Kane. Inshundura ya 4 n\'ibibuga byo kwitorezaho byo mu burasirazuba bizafungwa muri ayo masaha ku mpamvu z\'umutekano.',

    // ---- Inventory Items ----
    'Grade 1 English Willow Cricket Bat (SH)':
      'Inkoni ya Cricket yo mu Rwego rwa Mbere y\'Ibiti bya Willow (SH)',
    'Kashmir Willow Training Bats (Size 6 & SH)':
      'Inkoni zo Kwitoza z\'Ibiti bya Kashmir Willow (Ingano ya 6 & SH)',
    'Kookaburra Turf White Match Ball (4-Piece)':
      'Imipira Yera y\'Umukino ya Kookaburra yo ku Byatsi (Idundika 4)',
    'Kookaburra Turf Red Match Ball (4-Piece)':
      'Imipira Itukura y\'Umukino ya Kookaburra yo ku Byatsi (Idundika 4)',
    'Synthetic Dimple Practice Balls (Net Machines)':
      'Imipira y\'Imyitozo ya Pulasitike (Imashini zo mu Nshundura)',
    'Electronic Flashing LED Stumps & Bails (Set)':
      'Uduti tw\'Amanota tw\'Amatara ya LED Asanzwe (Seti)',
    'Heavy Cast-Iron Spring-Return Stumps':
      'Uduti tw\'Amanota tw\'Icyuma Gifite Ubusa Bwongera Kwihagarika',
    'Rwanda National Team Official Match Jersey (Yellow/Blue)':
      'Umwenda w\'Umukino w\'Ikipe y\'Igihugu y\'u Rwanda (Umuhondo/Ubururu)',
    'Pro Batting Leg Guards (Adult Large & RH/LH)':
      'Ibirinda Amaguru by\'Abaterankoni B\'inzobere (Abakuru & Iburyo/Ibumoso)',
    'Titanium Grille Cricket Safety Helmets (BSI Certified)':
      'Ingofero z\'Umutekano za Cricket z\'Icyuma cya Titanium (Zujuje Ubuziranenge)',
    'High-Visibility Polypropylene Boundary Rope (400m Reel)':
      'Umugozi w\'Urugabano Ubonesha Neza (Izingo rya Metero 400)',
    'Full Pitch Triple-Covers (PVC Waterproof 25m x 4m)':
      'Amashitinga Atatu yo Gutwikira Ikibuga Cyose (PVC Idacengerwa n\'Amazi 25m x 4m)',

    // ---- Calendar Events ----
    'ICC T20 World Cup Regional Qualifier: Rwanda vs Uganda':
      'Amajonjora y\'Igikombe cy\'Isi cya ICC T20: u Rwanda vs Uganda',
    'Rwanda Premier Cricket League: Kigali Knights vs Gahanga Gladiators':
      'Shampiyona y\'u Rwanda ya Cricket: Kigali Knights vs Gahanga Gladiators',
    'East Africa U-19 Invitational: Rwanda Junior XI vs Kenya U-19':
      'Ubutumire bw\'Afurika y\'Iburasirazuba U-19: u Rwanda U-19 vs Kenya U-19',
    'Corporate T10 Trophy: Bank of Kigali vs MTN Rwanda Lions':
      'Igikombe cy\'Ibigo by\'Ubucuruzi T10: Banki ya Kigali vs MTN Rwanda Lions',
    'Main Oval Pitch Curfew & Pre-Match Surface Mowing':
      'Gufunga Ikibuga Gikuru no Gukata Ibyatsi Mbere y\'Umukino',
    'National Senior Men Tactical Net Simulation & Video Telemetry':
      'Imyitozo ya Tekiniki n\'Amashusho y\'Ikipe y\'Igihugu y\'Abagabo Bakuru'
  },

  // ================= FRENCH (FR) =================
  fr: {
    // ---- Tasks: Titles ----
    'ICC T20 Regional Qualifiers: Center Pitch Preparation & Moisture Test':
      'Qualifications Régionales ICC T20 : Préparation de la Piste Centrale & Test d\'Humidité',
    'Quarterly High-Performance Academy Equipment Audit & Inventory Check':
      'Audit Trimestriel des Équipements de l\'Académie de Haute Performance & Contrôle des Stocks',
    'Floodlight Tower Generator Fuel & Phase Load Testing':
      'Test de Charge & Réserve de Carburant des Générateurs des Pylônes d\'Éclairage',
    'VIP Pavilion Seating & Press Box Gigabit Uplink Verification':
      'Vérification des Sièges de la Tribune VIP & Connexion Fibre Gigabit de la Tribune de Presse',
    'Rwanda U-19 National Squad Match Kit Issuance & Sizing Roster':
      'Distribution des Tenues Officielles & Grille des Tailles pour l\'Équipe Nationale U-19 du Rwanda',

    // ---- Tasks: Descriptions ----
    'Perform rolling schedule on Pitch #3 and calibrate soil moisture probes prior to official ICC Match Referee inspection.':
      'Effectuer le programme de roulage sur la piste #3 et étalonner les sondes d\'humidité du sol avant l\'inspection officielle de l\'arbitre de match ICC.',
    'Physical count and condition assessment of all training bats, helmets, pads, and balls stored in Pavilion Store Bay B.':
      'Inventaire physique et évaluation de l\'état de toutes les battes, casques, jambières et balles d\'entraînement stockés dans la baie B du pavillon.',
    'Ensure 350kVA standby diesel generators for stadium towers 1 through 4 have full fuel reserves and pass 30-minute burn load test.':
      'Vérifier que les groupes électrogènes diesel 350kVA des pylônes 1 à 4 sont pleins et réussissent le test de charge continue de 30 minutes.',
    'Configure high-speed fiber connectivity and official scoring console terminals for live broadcast stream operators.':
      'Configurer la fibre haut débit et les terminaux de score officiels pour les équipes de diffusion télévisée en direct.',
    'Issue official national team match jerseys, trousers, and training caps from the new shipment to 16 national squad players.':
      'Distribuer les maillots officiels, pantalons et casquettes d\'entraînement de la nouvelle dotation à 16 joueurs sélectionnés.',

    // ---- Tasks: Instructions ----
    '1. Complete 4-hour heavy roll with 1.5T vibrating roller.\n2. Take 5-point moisture core readings along length.\n3. Ensure boundary perimeter ropes are pinned at 68m radius.\n4. Log readings and upload pitch certification photo.':
      '1. Réaliser 4 heures de roulage intensif au rouleau vibrant 1.5T.\n2. Effectuer des carottages d\'humidité en 5 points sur la longueur.\n3. Veiller à ce que les cordes d\'enceinte soient fixées à 68m de rayon.\n4. Consigner les relevés et téléverser la photo de certification de la piste.',
    'Reconcile physical stock against current ledger balances. Flag bats with willow hairline cracks for re-binding or retirement.':
      'Rapprocher le stock physique avec les écritures du registre. Signaler les battes présentant des microfissures pour réparation ou réforme.',
    'Check fuel level dipsticks (minimum 90% capacity). Run uninterrupted 30-min illumination test at 1,500 lux match mode.':
      'Contrôler les jauges de carburant (minimum 90%). Réaliser un test d\'éclairage sans interruption de 30 min à 1 500 lux en mode match.',
    'Verify primary 200Mbps dedicated uplink in Media Center. Test HDMI feeds from electronic scoreboard to broadcast van interface.':
      'Vérifier le débit montant dédié de 200 Mbps au centre des médias. Tester les flux HDMI du tableau d\'affichage électronique vers la régie mobile.',
    'Log player signature for each kit bag. Inspect embroidery of GCS and Rwanda Cricket Association badges.':
      'Recueillir la signature de chaque joueur pour chaque sac de tenue. Vérifier la broderie des écussons de GCS et de l\'Association Rwandaise de Cricket.',

    // ---- Tasks: Comments & Submission Notes ----
    'ICC technical delegation arrives Wednesday morning at 09:00 AM. Please verify the grass cutting height is exactly 4mm.':
      'La délégation technique de l\'ICC arrive mercredi matin à 09h00. Veuillez vérifier que la hauteur de tonte du gazon est exactement de 4 mm.',
    'Noted. Ground team completed morning cross-cut at 4mm. Moisture level is currently at 14.8%, within ICC specification (13-16%).':
      'Bien noté. L\'équipe de terrain a terminé la tonte croisée matinale à 4 mm. Le taux d\'humidité est à 14,8%, conforme aux normes ICC (13-16%).',
    'Report submitted along with asset condition logs. Awaiting supervisor review.':
      'Rapport soumis avec les registres d\'état des équipements. En attente de l\'examen de la direction.',
    'Completed full physical count across 12 inventory categories. 48 Grade-1 match balls verified sealed. 4 training bats identified with toe crack damage, moved to repair hold.':
      'Comptage physique complet réalisé sur 12 catégories d\'inventaire. 48 balles de match de grade 1 certifiées scellées. 4 battes fissurées placées en réparation.',
    'Attached reconciliation variance sheet. Reorder threshold alert recommended for Senior Batting Pads.':
      'Feuille de conciliation jointe. Alerte de seuil de réapprovisionnement recommandée pour les jambières de batteur senior.',
    'Media box dual fiber WAN tested at 215Mbps down / 195Mbps up. Scoreboard optical feed latency measured at 12ms. 18 commentary positions patched.':
      'Connexion fibre optique double testée à 215 Mbps descendant / 195 Mbps montant. Latence du tableau optique mesurée à 12 ms. 18 postes de commentateurs configurés.',
    'Broadcast patch report signed off by technical technician.':
      'Rapport de câblage de diffusion validé par le responsable technique.',
    'Approved. Excellent preparation for the upcoming tournament.':
      'Approuvé. Excellente préparation en vue du tournoi à venir.',
    'Issued match kits to 14 players. Sizes L and XL distributed.':
      'Tenues de match remises à 14 joueurs. Tailles L et XL distribuées.',
    'Player signature sheet partial.':
      'Feuille d\'émargement des joueurs incomplète.',
    'Missing signatures for 2 reserve bowlers (Player #15 and #16). Please collect signatures and clarify if size M replacements were ordered.':
      'Signatures manquantes pour 2 lanceurs réservistes (joueurs #15 et #16). Veuillez obtenir les signatures et préciser si des tailles M ont été commandées.',
    'Please resubmit once the remaining signatures and size replacement requests are filed with Jean-Paul.':
      'Veuillez soumettre à nouveau une fois les signatures restantes et les demandes de taille transmises à Jean-Paul.',

    // ---- Direct Messages ----
    'Damascene, have you checked the soil compaction figures for pitch 3 following yesterday afternoon rains?':
      'Damascène, as-tu vérifié les données de compactage du sol pour la piste 3 après les pluies d\'hier après-midi ?',
    'Yes Claire, the triple covers kept the strip completely dry. We completed 90 minutes of static rolling and the Clegg impact value is 95 gravities, exactly on target.':
      'Oui Claire, les triples bâches ont gardé la piste parfaitement au sec. Nous avons effectué 90 minutes de roulage et la valeur Clegg est de 95 gravités, exactement sur l\'objectif.',
    'Great. Make sure Aline has the boundary foam wedges positioned and branded for the TV cameras.':
      'Parfait. Assure-toi qu\'Aline a positionné les mousses de bordure aux couleurs des partenaires pour les caméras de télévision.',
    'Hi Damascene, our remaining stock of Kookaburra White turf balls is down to 12 boxes (72 balls). If the international series uses 2 balls per match plus practice, we will breach our reserve threshold.':
      'Bonjour Damascène, notre stock de balles blanches Kookaburra est descendu à 12 boîtes (72 balles). Si la série internationale en utilise 2 par match plus l\'entraînement, nous passerons sous le seuil d\'alerte.',

    // ---- Announcements ----
    'ICC Delegation Inspection Schedule & Oval Curfew':
      'Calendrier de l\'Inspection de l\'ICC & Fermeture de l\'Ovale',
    'Please note that the ICC Technical Inspector and Match Referee panel will conduct their official GCS ground accreditation on Wednesday, Oct 14 at 09:00 AM. Center pitches 2, 3, and 4 are strictly under curfew starting Tuesday 18:00. No unauthorized footwear permitted past the 30-yard circle.':
      'Veuillez noter que l\'inspecteur technique et les arbitres officiels de l\'ICC procéderont à l\'homologation du terrain de GCS le mercredi 14 oct à 09h00. Les pistes centrales 2, 3 et 4 sont strictement interdites d\'accès à partir de mardi 18h00. Aucune chaussure non autorisée au-delà du cercle des 30 yards.',
    'Store Bi-Weekly Requisition Window Notice':
      'Avis d\'Ouverture de la Fenêtre Bimensuelle de Réquisition du Magasin',
    'All department heads and squad managers must submit equipment issue requests through the GCS Operations Hub by Thursdays at 14:00 to guarantee Friday morning kit packing and dispatch.':
      'Tous les chefs de département et gestionnaires d\'équipe doivent soumettre leurs réquisitions de matériel via le GCS Hub avant le jeudi à 14h00 pour garantir la préparation et l\'expédition le vendredi matin.',
    'Stadium Floodlight Tower 3 Luminaire Recalibration':
      'Recalibrage des Projecteurs du Pylône 3 du Stade',
    'Electrical engineering contractors will access Tower 3 crane bucket between 07:00 and 11:00 on Thursday. Net 4 and the eastern practice wickets will be closed during work hours for safety.':
      'Les techniciens électriciens interviendront sur la nacelle du pylône 3 jeudi entre 07h00 et 11h00. Le filet 4 et les pistes d\'entraînement est seront fermés durant l\'intervention pour des raisons de sécurité.',

    // ---- Inventory Items ----
    'Grade 1 English Willow Cricket Bat (SH)':
      'Batte de Cricket en Saule Anglais Grade 1 (Manche Court)',
    'Kashmir Willow Training Bats (Size 6 & SH)':
      'Battes d\'Entraînement en Saule du Cachemire (Taille 6 & SH)',
    'Kookaburra Turf White Match Ball (4-Piece)':
      'Balle de Match Blanche Kookaburra pour Gazon (4 Pièces)',
    'Kookaburra Turf Red Match Ball (4-Piece)':
      'Balle de Match Rouge Kookaburra pour Gazon (4 Pièces)',
    'Synthetic Dimple Practice Balls (Net Machines)':
      'Balles d\'Entraînement Alvéolées Synthétiques (Lances-Balles)',
    'Electronic Flashing LED Stumps & Bails (Set)':
      'Guichets & Témoins Lumineux Électroniques à LED (Ensemble)',
    'Heavy Cast-Iron Spring-Return Stumps':
      'Guichets Mobiles en Fonte à Retour sur Ressort',
    'Rwanda National Team Official Match Jersey (Yellow/Blue)':
      'Maillot Officiel de Match de l\'Équipe du Rwanda (Jaune/Bleu)',
    'Pro Batting Leg Guards (Adult Large & RH/LH)':
      'Jambières de Protection Batteur Pro (Adulte Grand & D/G)',
    'Titanium Grille Cricket Safety Helmets (BSI Certified)':
      'Casques de Sécurité de Cricket avec Grille en Titane (Certifié BSI)',
    'High-Visibility Polypropylene Boundary Rope (400m Reel)':
      'Corde de Bordure en Polypropylène Haute Visibilité (Bobine 400m)',
    'Full Pitch Triple-Covers (PVC Waterproof 25m x 4m)':
      'Bâches Triples Imperméables Intégrales de Piste (PVC 25m x 4m)',

    // ---- Calendar Events ----
    'ICC T20 World Cup Regional Qualifier: Rwanda vs Uganda':
      'Qualifications Régionales Coupe du Monde T20 ICC : Rwanda vs Ouganda',
    'Rwanda Premier Cricket League: Kigali Knights vs Gahanga Gladiators':
      'Ligue Majeure de Cricket du Rwanda : Kigali Knights vs Gahanga Gladiators',
    'East Africa U-19 Invitational: Rwanda Junior XI vs Kenya U-19':
      'Tournoi Invitation d\'Afrique de l\'Est U-19 : Rwanda Junior vs Kenya U-19',
    'Corporate T10 Trophy: Bank of Kigali vs MTN Rwanda Lions':
      'Trophée des Entreprises T10 : Bank of Kigali vs MTN Rwanda Lions',
    'Main Oval Pitch Curfew & Pre-Match Surface Mowing':
      'Fermeture de l\'Ovale Principal & Tonte de Piste d\'Avant-Match',
    'National Senior Men Tactical Net Simulation & Video Telemetry':
      'Entraînement Tactique en Filets & Vidéo Télémétrie de l\'Équipe Nationale Senior'
  },

  // ================= KISWAHILI (SW) =================
  sw: {
    // ---- Tasks: Titles ----
    'ICC T20 Regional Qualifiers: Center Pitch Preparation & Moisture Test':
      'Mchuano wa Kufuzu Kanda wa ICC T20: Maandalizi ya Uwanja wa Kati na Kipimo cha Unyevu',
    'Quarterly High-Performance Academy Equipment Audit & Inventory Check':
      'Ukaguzi wa Robo Mwaka wa Vifaa vya Chuo cha Kriketi na Hesabu ya Ghala',
    'Floodlight Tower Generator Fuel & Phase Load Testing':
      'Kipimo cha Mafuta na Mzigo wa Umeme kwa Majenereta ya Minara ya Taa za Uwanja',
    'VIP Pavilion Seating & Press Box Gigabit Uplink Verification':
      'Ukaguzi wa Viti vya Jukwaa Kuu la VIP na Mtandao wa Kasi ya Juu wa Chumba cha Habari',
    'Rwanda U-19 National Squad Match Kit Issuance & Sizing Roster':
      'Ugawaji wa Jezi Rasmi za Mechi na Orodha ya Vipimo kwa Timu ya Taifa ya U-19',

    // ---- Tasks: Descriptions ----
    'Perform rolling schedule on Pitch #3 and calibrate soil moisture probes prior to official ICC Match Referee inspection.':
      'Kupiga rula uwanja nambari 3 na kupima unyevu wa udongo kabla ya ukaguzi rasmi wa Mwamuzi wa Mechi wa ICC.',
    'Physical count and condition assessment of all training bats, helmets, pads, and balls stored in Pavilion Store Bay B.':
      'Kuhesabu na kutathmini hali ya popo zote, kofia, vilinda miguu na mipira iliyopo ghala nambari B la jukwaa kuu.',
    'Ensure 350kVA standby diesel generators for stadium towers 1 through 4 have full fuel reserves and pass 30-minute burn load test.':
      'Kuhakikisha majenereta ya 350kVA ya minara 1 hadi 4 yana mafuta ya kutosha na yanafanya kazi kwa dakika 30 bila kukatika.',
    'Configure high-speed fiber connectivity and official scoring console terminals for live broadcast stream operators.':
      'Kuweka mtandao wa kasi na vituo vya kuandikia alama kwa ajili ya watangazaji wa mechi za moja kwa moja.',
    'Issue official national team match jerseys, trousers, and training caps from the new shipment to 16 national squad players.':
      'Kutoa jezi mpya za mechi, suruali na kofia za mazoezi kwa wachezaji 16 wa timu ya taifa.',

    // ---- Tasks: Instructions ----
    '1. Complete 4-hour heavy roll with 1.5T vibrating roller.\n2. Take 5-point moisture core readings along length.\n3. Ensure boundary perimeter ropes are pinned at 68m radius.\n4. Log readings and upload pitch certification photo.':
      '1. Maliza saa 4 za kupiga rula nzito ya tani 1.5.\n2. Pima unyevu sehemu 5 kando ya uwanja.\n3. Hakikisha kamba za mipaka zimewekwa kwa umbali wa mita 68.\n4. Rekodi vipimo na upakie picha ya cheti cha uwanja.',
    'Reconcile physical stock against current ledger balances. Flag bats with willow hairline cracks for re-binding or retirement.':
      'Linganisha vifaa vilivyopo na vilivyoandikwa kwenye leja. Weka alama popo zilizopasuka ili zirekebishwe au ziondolewe.',
    'Check fuel level dipsticks (minimum 90% capacity). Run uninterrupted 30-min illumination test at 1,500 lux match mode.':
      'Angalia kiwango cha mafuta (angalau 90%). Washa taa zote za uwanja kwa dakika 30 katika kiwango cha lux 1,500.',
    'Verify primary 200Mbps dedicated uplink in Media Center. Test HDMI feeds from electronic scoreboard to broadcast van interface.':
      'Hakikisha mtandao wa 200Mbps kwenye Kituo cha Habari unafanya kazi. Jaribu uunganisho wa bodi ya matokeo kwenye gari la matangazo.',
    'Log player signature for each kit bag. Inspect embroidery of GCS and Rwanda Cricket Association badges.':
      'Weka sahihi ya kila mchezaji kwa begi lake. Kagua nembo za GCS na Chama cha Kriketi cha Rwanda.',

    // ---- Tasks: Comments & Submission Notes ----
    'ICC technical delegation arrives Wednesday morning at 09:00 AM. Please verify the grass cutting height is exactly 4mm.':
      'Ujumbe wa kiufundi wa ICC unawasili Jumatano asubuhi saa 3:00 (09:00 AM). Tafadhali hakikisha urefu wa nyasi umekatwa kwa milimita 4 kamili.',
    'Noted. Ground team completed morning cross-cut at 4mm. Moisture level is currently at 14.8%, within ICC specification (13-16%).':
      'Nimeelewa. Timu ya uwanja imekamilisha kukata nyasi kwa 4mm asubuhi hii. Kiwango cha unyevu ni 14.8%, kikiwa ndani ya viwango vya ICC (13-16%).',
    'Report submitted along with asset condition logs. Awaiting supervisor review.':
      'Ripoti imewasilishwa pamoja na kumbukumbu ya hali ya vifaa. Inasubiri ukaguzi wa msimamizi.',
    'Completed full physical count across 12 inventory categories. 48 Grade-1 match balls verified sealed. 4 training bats identified with toe crack damage, moved to repair hold.':
      'Hesabu kamili imefanywa katika makundi 12 ya vifaa. Mipira 48 ya daraja la 1 imethibitishwa kufungwa vizuri. Popo 4 zilizoharibika zimehamishiwa sehemu ya matengenezo.',
    'Attached reconciliation variance sheet. Reorder threshold alert recommended for Senior Batting Pads.':
      'Fomu ya kulinganisha vifaa imeambatishwa. Inashauriwa kuagiza haraka vilinda miguu vya wachezaji wakuu.',
    'Media box dual fiber WAN tested at 215Mbps down / 195Mbps up. Scoreboard optical feed latency measured at 12ms. 18 commentary positions patched.':
      'Mtandao wa vyombo vya habari umejaribiwa kwa 215Mbps kupakua / 195Mbps kupakia. Bodi ya alama inafanya kazi haraka (12ms). Sehemu 18 za watangazaji zimewekwa tayari.',
    'Broadcast patch report signed off by technical technician.':
      'Ripoti ya mtandao wa matangazo imesainiwa na fundi wa mitambo.',
    'Approved. Excellent preparation for the upcoming tournament.':
      'Imeidhinishwa. Maandalizi mazuri sana kwa ajili ya mashindano yanayokuja.',
    'Issued match kits to 14 players. Sizes L and XL distributed.':
      'Jezi za mechi zimetolewa kwa wachezaji 14. Saizi L na XL zimegawanywa.',
    'Player signature sheet partial.':
      'Karatasi ya sahihi za wachezaji bado haijakamilika.',
    'Missing signatures for 2 reserve bowlers (Player #15 and #16). Please collect signatures and clarify if size M replacements were ordered.':
      'Zinakosekana sahihi za warusha mpira 2 wa akiba (Mchezaji #15 na #16). Tafadhali kusanya sahihi na thibitisha ikiwa saizi M iliagizwa.',
    'Please resubmit once the remaining signatures and size replacement requests are filed with Jean-Paul.':
      'Tafadhali wasilisha tena mara tu sahihi zilizobaki na maombi ya saizi yatakapowasilishwa kwa Jean-Paul.',

    // ---- Direct Messages ----
    'Damascene, have you checked the soil compaction figures for pitch 3 following yesterday afternoon rains?':
      'Damascene, umeangalia takwimu za kukaza kwa udongo kwenye uwanja wa 3 kufuatia mvua ya jana mchana?',
    'Yes Claire, the triple covers kept the strip completely dry. We completed 90 minutes of static rolling and the Clegg impact value is 95 gravities, exactly on target.':
      'Ndio Claire, vifuniko vitatu vimeweka uwanja mkavu kabisa. Tumekamilisha dakika 90 za kupiga rula na kiwango cha Clegg ni 95 gravities, kikiwa sahihi kabisa.',
    'Great. Make sure Aline has the boundary foam wedges positioned and branded for the TV cameras.':
      'Vizuri sana. Hakikisha Aline ameweka sponji za mipaka zenye nembo za chapa ili zionekane vizuri kwenye runinga.',
    'Hi Damascene, our remaining stock of Kookaburra White turf balls is down to 12 boxes (72 balls). If the international series uses 2 balls per match plus practice, we will breach our reserve threshold.':
      'Habari Damascene, mipira meupe ya Kookaburra iliyobaki ghalani imeshuka hadi masanduku 12 (mipira 72). Ikiwa mechi za kimataifa zitatumia mipira 2 kwa mechi pamoja na mazoezi, tutavuka kiwango chetu cha tahadhari.',

    // ---- Announcements ----
    'ICC Delegation Inspection Schedule & Oval Curfew':
      'Ratiba ya Ukaguzi wa Ujumbe wa ICC na Kufungwa kwa Uwanja',
    'Please note that the ICC Technical Inspector and Match Referee panel will conduct their official GCS ground accreditation on Wednesday, Oct 14 at 09:00 AM. Center pitches 2, 3, and 4 are strictly under curfew starting Tuesday 18:00. No unauthorized footwear permitted past the 30-yard circle.':
      'Tafadhali fahamu kuwa Mkaguzi wa Kiufundi na jopo la Waamuzi wa ICC watakagua uwanja wa GCS rasmi Jumatano, Oktoba 14 saa 3:00 asubuhi (09:00 AM). Viwanja vya kati 2, 3, na 4 haviruhusiwi kuingiliwa kuanzia Jumanne saa 12:00 jioni (18:00). Hakuna viatu visivyoruhusiwa ndani ya yadi 30.',
    'Store Bi-Weekly Requisition Window Notice':
      'Tangazo la Dirisha la Kila Baada ya Wiki Mbili la Kuagiza Vifaa Ghalani',
    'All department heads and squad managers must submit equipment issue requests through the GCS Operations Hub by Thursdays at 14:00 to guarantee Friday morning kit packing and dispatch.':
      'Wakuu wote wa idara na wasimamizi wa timu lazima wawasilishe maombi ya vifaa kupitia GCS Hub kabla ya Alhamisi saa 8:00 mchana (14:00) ili vifurushi vimpakiwe Ijumaa asubuhi.',
    'Stadium Floodlight Tower 3 Luminaire Recalibration':
      'Marekebisho ya Taa za Mnara wa 3 wa Taa za Uwanja',
    'Electrical engineering contractors will access Tower 3 crane bucket between 07:00 and 11:00 on Thursday. Net 4 and the eastern practice wickets will be closed during work hours for safety.':
      'Mafundi wa umeme watapanda Mnara wa 3 Alhamisi kati ya saa 1:00 (07:00) na saa 5:00 (11:00) asubuhi. Wavu wa 4 na viwanja vya mashariki vya mazoezi vitafungwa wakati wa kazi kwa usalama.',

    // ---- Inventory Items ----
    'Grade 1 English Willow Cricket Bat (SH)':
      'Popo ya Kriketi ya Daraja la 1 ya Willow ya Uingereza (Mpini Mfupi)',
    'Kashmir Willow Training Bats (Size 6 & SH)':
      'Popo za Mazoezi za Willow ya Kashmir (Saizi 6 & SH)',
    'Kookaburra Turf White Match Ball (4-Piece)':
      'Mipira Myeupe ya Kriketi ya Kookaburra ya Nyasi (Vipande 4)',
    'Kookaburra Turf Red Match Ball (4-Piece)':
      'Mipira Myeupe ya Kriketi ya Kookaburra ya Nyasi (Vipande 4)',
    'Synthetic Dimple Practice Balls (Net Machines)':
      'Mipira ya Plastiki ya Mazoezi ya Mashine za Kriketi',
    'Electronic Flashing LED Stumps & Bails (Set)':
      'Seti ya Vibao vya Kriketi vyenye Taa za LED za Kielektroniki',
    'Heavy Cast-Iron Spring-Return Stumps':
      'Vibao vya Chuma vya Kurudi Nyuma kwa Spring',
    'Rwanda National Team Official Match Jersey (Yellow/Blue)':
      'Jezi Rasmi ya Mechi ya Timu ya Taifa ya Rwanda (Njano/Bluu)',
    'Pro Batting Leg Guards (Adult Large & RH/LH)':
      'Vilinda Miguu vya Kulinda Wapiga Mpira wa Kulipwa (Watu Wazima & Kulia/Kushoto)',
    'Titanium Grille Cricket Safety Helmets (BSI Certified)':
      'Kofia Ngumu za Usalama za Kriketi zenye Chuma cha Titanium',
    'High-Visibility Polypropylene Boundary Rope (400m Reel)':
      'Kamba ya Mpaka Inayoonekana Vizuri (Kizungusho cha Mita 400)',
    'Full Pitch Triple-Covers (PVC Waterproof 25m x 4m)':
      'Vifuniko Vitatu vya Kuzuia Maji vya Uwanja Mzima (PVC 25m x 4m)',

    // ---- Calendar Events ----
    'ICC T20 World Cup Regional Qualifier: Rwanda vs Uganda':
      'Kufuzu Kombe la Dunia la T20 la ICC: Rwanda vs Uganda',
    'Rwanda Premier Cricket League: Kigali Knights vs Gahanga Gladiators':
      'Ligi Kuu ya Kriketi ya Rwanda: Kigali Knights vs Gahanga Gladiators',
    'East Africa U-19 Invitational: Rwanda Junior XI vs Kenya U-19':
      'Michuano ya Vijana ya Afrika Mashariki U-19: Rwanda U-19 vs Kenya U-19',
    'Corporate T10 Trophy: Bank of Kigali vs MTN Rwanda Lions':
      'Kombe la Mashirika T10: Bank of Kigali vs MTN Rwanda Lions',
    'Main Oval Pitch Curfew & Pre-Match Surface Mowing':
      'Kufunga Uwanja Mkuu na Kukata Nyasi Kabla ya Mechi',
    'National Senior Men Tactical Net Simulation & Video Telemetry':
      'Mazoezi ya Mbinu Nyavuni na Video za Timu Kuu ya Taifa'
  }
};

/**
 * Universal translation function that checks the content dictionary.
 * If text is found in the dictionary for target language, returns the translated text.
 * Otherwise, returns the original text.
 */
export function translateEntityText(text: string, targetLang: Language): string {
  if (!text || targetLang === 'en') return text;
  const dict = CONTENT_DICTIONARY[targetLang];
  if (dict && dict[text]) {
    return dict[text];
  }

  // Check trimmed
  const trimmed = text.trim();
  if (dict && dict[trimmed]) {
    return dict[trimmed];
  }

  return text;
}

/**
 * Translates a complete Task entity into the target language.
 */
export function translateTaskEntity(task: Task, targetLang: Language): Task {
  if (targetLang === 'en') return task;

  return {
    ...task,
    title: translateEntityText(task.title, targetLang),
    description: translateEntityText(task.description, targetLang),
    instructions: translateEntityText(task.instructions, targetLang),
    submissions: task.submissions.map((sub) => ({
      ...sub,
      reportSummary: translateEntityText(sub.reportSummary, targetLang),
      deliverablesNotes: translateEntityText(sub.deliverablesNotes, targetLang),
      reviewComment: sub.reviewComment ? translateEntityText(sub.reviewComment, targetLang) : undefined
    })),
    comments: task.comments.map((c) => ({
      ...c,
      text: translateEntityText(c.text, targetLang)
    }))
  };
}

/**
 * Translates a DirectMessage entity into the target language.
 */
export function translateMessageEntity(msg: DirectMessage, targetLang: Language): DirectMessage {
  if (targetLang === 'en') return msg;

  return {
    ...msg,
    content: translateEntityText(msg.content, targetLang)
  };
}

/**
 * Translates an Announcement entity into the target language.
 */
export function translateAnnouncementEntity(anc: Announcement, targetLang: Language): Announcement {
  if (targetLang === 'en') return anc;

  return {
    ...anc,
    title: translateEntityText(anc.title, targetLang),
    body: translateEntityText(anc.body, targetLang)
  };
}

/**
 * Translates an InventoryItem entity into the target language.
 */
export function translateInventoryEntity(item: InventoryItem, targetLang: Language): InventoryItem {
  if (targetLang === 'en') return item;

  return {
    ...item,
    name: translateEntityText(item.name, targetLang),
    description: translateEntityText(item.description, targetLang)
  };
}

/**
 * Translates a CalendarEvent entity into the target language.
 */
export function translateEventEntity(event: CalendarEvent, targetLang: Language): CalendarEvent {
  if (targetLang === 'en') return event;

  return {
    ...event,
    title: translateEntityText(event.title, targetLang),
    description: event.description ? translateEntityText(event.description, targetLang) : undefined
  };
}
