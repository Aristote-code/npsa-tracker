/**
 * Officer desktop and feature-phone strings.
 *
 * The reason codes themselves live in the citizen dictionary: the officer
 * picks a code, the citizen reads it in their own language. That shared list
 * is the whole point — free text cannot be translated at the moment it is
 * written.
 *
 * The `ussd.*` strings are the ones that go down the USSD channel. They are
 * deliberately plain ASCII with no accents, because the network encodes them
 * in GSM 7-bit, and they are written to fit inside one 182-character screen
 * in all three languages — Kinyarwanda, which runs longest, is the budget
 * that matters.
 */

const en = {
  // ------------------------------------------------------------- queue --
  "o.title": "Applications",
  "o.sub": "Find a file and give the citizen an answer.",
  "o.search": "Reference, phone number or name",
  "o.searchHint": "Callers often do not have their reference.",
  "o.awaiting": "Awaiting action",
  "o.completed": "Completed this week",
  "o.col.citizen": "Citizen",
  "o.col.application": "Application",
  "o.col.stage": "Stage",
  "o.col.updated": "Updated",
  "o.col.status": "Status",
  "o.noResults": "No file matches “{q}”.",
  "o.noResultsHint": "Try the number the citizen is calling from, or their full name.",
  "o.resultsFor": "{n} results for “{q}”",

  // -------------------------------------------------------- permissions --
  "o.role.frontDesk": "Front desk",
  "o.role.processing": "Processing officer",
  "o.roleNote": "Front desk can find and explain any file. Changing a status needs processing rights.",
  "o.permissionDenied": "Front desk cannot change a status. Ask a processing officer.",

  // --------------------------------------------------------------- file --
  "o.answer": "What the citizen sees",
  "o.answerHint": "Read this out, or copy it into a call note.",
  "o.copyAnswer": "Copy answer",
  "o.answerCopied": "Copied",
  "o.citizenPhone": "Phone",
  "o.lastUpdate": "Last update",
  "o.documents": "Documents",
  "o.timeline": "History",
  "o.actions": "Actions",
  "o.updateStatus": "Update status",
  "o.requestDocument": "Request a document",
  "o.viewResponse": "Citizen's response",
  "o.backToList": "All applications",

  "o.assistedTitle": "Assisted visit",
  "o.assistedBody": "You are acting for the citizen at the counter. It is recorded on the file.",
  "o.startAssisted": "Act for this citizen",
  "o.endAssisted": "End assisted visit",

  // -------------------------------------------------------- status panel --
  "o.status.title": "Update status",
  "o.status.moveTo": "Move to",
  "o.status.note": "The citizen is told by SMS as soon as you save.",
  "o.status.save": "Save and notify",

  // ------------------------------------------------------- request panel --
  "o.request.title": "Request a document",
  "o.request.which": "Which document?",
  "o.request.why": "Why can it not be used?",
  "o.request.whyHint": "These reasons are already written in all three languages.",
  "o.request.note": "Add a note",
  "o.request.optional": "optional",
  "o.request.notePlaceholder": "Anything else this citizen should know",
  "o.request.noteLang": "Your note is sent as you wrote it, labelled “{language}”.",
  "o.request.due": "Reply needed before",
  "o.request.preview": "What the citizen will see, in {language}",
  "o.request.previewLang": "Their language",
  "o.request.send": "Send request",
  "o.request.sent": "Request sent to {name}",

  // ------------------------------------------------------ response panel --
  "o.response.title": "Citizen's response",
  "o.response.received": "Received {date}",
  "o.response.replaces": "Replaces the photo sent on {date}",
  "o.response.accept": "Accept document",
  "o.response.reject": "Not usable — ask again",
  "o.response.rejectHint":
    "Pick a new, more specific reason. Sending the same words back is what makes a file go round twice.",

  // ------------------------------------------------------------ history --
  "h.received": "Application received",
  "h.checked": "Documents checked",
  "h.requested": "Replacement document requested",
  "h.responded": "Citizen sent a replacement",
  "h.assisted": "Viewed at the counter on the citizen's behalf",
  "h.stageChanged": "Moved to {stage}",

  // ------------------------------------------------------- feature phone --
  "u.title": "No smartphone",
  "u.sub": "Any phone can check a file, with no data and no app.",
  "u.dial": "Dial {code} — free on every network",
  "u.pullTitle": "Pull: the citizen asks",
  "u.pushTitle": "Push: NPSA tells them first",
  "u.send": "Reply",
  "u.cancel": "Cancel",
  "u.reset": "Start again",
  "u.showTimeout": "Let the session time out",
  "u.charsLeft": "{n} characters remaining",
  "u.budget": "This screen uses {n} of 182 characters",
  "u.budgetWorst": "Longest of the three languages: {n}",

  "u.noteOs":
    "The dialog belongs to the handset, not to us. No colour, no logo, no layout — NPSA controls the text and nothing else, so the text is the whole design.",
  "u.noteKeypad":
    "Jean Bosco's phone has a numeric keypad, so every step is a digit. No step ever asks him to type a word — which is also why the file number is entered as its last five digits.",
  "u.noteLang":
    "Language is the first question, asked once. The network remembers the choice against his number, so he never answers it again. The real MTN menu is English only; this is the gap worth closing.",
  "u.noteTimeout":
    "A USSD session is a timed round trip, not a page. Two levels reach a status, because a third is another chance to time out.",
  "u.noteBudget":
    "182 characters, counted in Kinyarwanda because it runs longest. Reassurance does not fit, so it goes in the SMS instead.",

  // Text that actually travels over USSD.
  "ussd.lang": "NPSA\nHitamo ururimi\nChoose language\n1) Kinyarwanda\n2) English\n3) Francais",
  "ussd.menu": "NPSA\n1) My applications\n2) Enter file number\n3) Change language\n4) Exit",
  "ussd.list":
    "Your applications\n1) 05123 Business reg.\n2) 04817 Building permit\n9) Exit\n99) Back",
  "ussd.ask": "Enter the last 5 digits of your file number.\nExample: 05123\n9) Exit\n99) Back",
  "ussd.statusAction":
    "05123 Business reg.\nStep 2/5 Documents checked\nNEEDED: lease photo too dark. Any NPSA office sends it free.\nUpdated 05/11\n99) Back",
  "ussd.statusReview":
    "04817 Building permit\nStep 3/5 Technical review\nNothing needed from you. Expected by 21/11.\nUpdated 04/11\n99) Back",
  "ussd.notFound":
    "Not found.\nCheck your receipt, or visit any NPSA office. It is free.\n1) Try again\n9) Exit",
  "ussd.timeout": "Your session has ended.\nDial *123# to start again.",

  "u.smsStage": "NPSA: NPSA-2026-05123 moved to Business name check (Registrar's Office). Nothing needed from you. Reply is free: dial *123#",
  "u.smsAction": "NPSA: NPSA-2026-05123 needs a clearer lease agreement photo. Any NPSA office will send it for you, free. Details: dial *123#",
  "u.smsDone": "NPSA: NPSA-2026-05123 is approved. Collect your certificate at the issuing desk with your ID. This service is free.",
};

export type OfficerDict = typeof en;

const rw: OfficerDict = {
  "o.title": "Dosiye",
  "o.sub": "Shakisha dosiye uhite uha umuturage igisubizo.",
  "o.search": "Nimero ya dosiye, nimero ya telefone cyangwa amazina",
  "o.searchHint": "Abahamagara akenshi ntibaba bafite nimero ya dosiye.",
  "o.awaiting": "Zitegereje igikorwa",
  "o.completed": "Zarangiye iki cyumweru",
  "o.col.citizen": "Umuturage",
  "o.col.application": "Dosiye",
  "o.col.stage": "Icyiciro",
  "o.col.updated": "Yavuguruwe",
  "o.col.status": "Imimerere",
  "o.noResults": "Nta dosiye ihuye na “{q}”.",
  "o.noResultsHint": "Gerageza nimero ahamagaraho, cyangwa amazina ye yuzuye.",
  "o.resultsFor": "Ibisubizo {n} kuri “{q}”",

  "o.role.frontDesk": "Uwakira abantu",
  "o.role.processing": "Umukozi usuzuma",
  "o.roleNote":
    "Uwakira abantu ashobora gushaka no gusobanura dosiye yose. Guhindura imimerere bisaba uburenganzira bwo gusuzuma.",
  "o.permissionDenied": "Uwakira abantu ntashobora guhindura imimerere. Saba umukozi usuzuma.",

  "o.answer": "Ibyo umuturage abona",
  "o.answerHint": "Musomere ibi, cyangwa ubifate kopi.",
  "o.copyAnswer": "Fata kopi y'igisubizo",
  "o.answerCopied": "Byafashwe",
  "o.citizenPhone": "Telefone",
  "o.lastUpdate": "Ivugururwa riheruka",
  "o.documents": "Inyandiko",
  "o.timeline": "Amateka",
  "o.actions": "Ibikorwa",
  "o.updateStatus": "Vugurura imimerere",
  "o.requestDocument": "Saba inyandiko",
  "o.viewResponse": "Igisubizo cy'umuturage",
  "o.backToList": "Dosiye zose",

  "o.assistedTitle": "Gufasha umuturage",
  "o.assistedBody": "Uri gukorera umuturage uri ku meza. Ibi byandikwa muri dosiye.",
  "o.startAssisted": "Korera uyu muturage",
  "o.endAssisted": "Hagarika gufasha",

  "o.status.title": "Vugurura imimerere",
  "o.status.moveTo": "Jyana kuri",
  "o.status.note": "Umuturage abimenyeshwa ako kanya binyuze mu butumwa bugufi.",
  "o.status.save": "Bika unamenyeshe",

  "o.request.title": "Saba inyandiko",
  "o.request.which": "Ni iyihe nyandiko?",
  "o.request.why": "Kuki idashobora gukoreshwa?",
  "o.request.whyHint": "Izi mpamvu zisanzwe zanditse mu ndimi zose uko ari eshatu.",
  "o.request.note": "Ongeraho ubutumwa",
  "o.request.optional": "si itegeko",
  "o.request.notePlaceholder": "Ikindi cyose uyu muturage agomba kumenya",
  "o.request.noteLang": "Ubutumwa bwawe boherezwa uko bwanditse, bufite akamenyetso “{language}”.",
  "o.request.due": "Agomba gusubiza mbere ya",
  "o.request.preview": "Ibyo umuturage azabona, mu {language}",
  "o.request.previewLang": "Ururimi rwe",
  "o.request.send": "Ohereza icyifuzo",
  "o.request.sent": "Icyifuzo cyoherejwe kuri {name}",

  "o.response.title": "Igisubizo cy'umuturage",
  "o.response.received": "Byakiriwe {date}",
  "o.response.replaces": "Bisimbuye ifoto yoherejwe {date}",
  "o.response.accept": "Emera inyandiko",
  "o.response.reject": "Ntikoreshwa — ongera usabe",
  "o.response.rejectHint":
    "Hitamo impamvu nshya kandi isobanutse. Gusubiza amagambo amwe ni byo bituma dosiye izenguruka kabiri.",

  "h.received": "Dosiye yakiriwe",
  "h.checked": "Inyandiko zasuzumwe",
  "h.requested": "Hasabwe inyandiko isimbura",
  "h.responded": "Umuturage yohereje isimbura",
  "h.assisted": "Yarebewe ku meza mu izina ry'umuturage",
  "h.stageChanged": "Byimuriwe kuri {stage}",

  "u.title": "Abadafite telefone igezweho",
  "u.sub": "Telefone iyo ari yo yose irareba dosiye, nta data, nta porogaramu.",
  "u.dial": "Kanda {code} — ni ubuntu kuri buri murongo",
  "u.pullTitle": "Umuturage ni we ubaza",
  "u.pushTitle": "NPSA ni yo ibanza kumumenyesha",
  "u.send": "Ohereza",
  "u.cancel": "Hagarika",
  "u.reset": "Tangira bundi bushya",
  "u.showTimeout": "Reka igihe kirangire",
  "u.charsLeft": "Hasigaye inyuguti {n}",
  "u.budget": "Uru rupapuro rukoresha inyuguti {n} kuri 182",
  "u.budgetWorst": "Ururimi rurerure kurusha izindi: {n}",

  "u.noteOs":
    "Iki kiganiro ni icya telefone, si icyacu. Nta mabara, nta kirango, nta miterere — NPSA igenga inyandiko gusa, ni yo mpamvu inyandiko ari yo gishushanyo cyose.",
  "u.noteKeypad":
    "Telefone ya Jean Bosco ifite buto z'imibare gusa, bityo buri ntambwe ni umubare. Nta ntambwe imusaba kwandika ijambo — ni na yo mpamvu nimero ya dosiye yandikwa ku mibare 5 ya nyuma.",
  "u.noteLang":
    "Ururimi ni cyo kibazo cya mbere, kibazwa rimwe gusa. Umurongo wibuka icyo yahisemo kuri nimero ye, ntabwo azongera kukibazwa. Menu nyayo ya MTN iri mu Cyongereza gusa; ni ho hari icyuho cyo kuziba.",
  "u.noteTimeout":
    "Igihe cya USSD ni igihe gito cy'urugendo rw'umurongo, si urupapuro. Intambwe 2 zigera ku mimerere, kuko iya 3 yaba indi mahirwe yo kurangirana n'igihe.",
  "u.noteBudget":
    "Inyuguti 182, zibarwa mu Kinyarwanda kuko ari rwo rurerure. Amagambo yo guhumuriza ntiyakwirwamo, ni yo mpamvu ajya mu butumwa bugufi.",

  "ussd.lang": "NPSA\nHitamo ururimi\nChoose language\n1) Kinyarwanda\n2) English\n3) Francais",
  "ussd.menu": "NPSA\n1) Dosiye zanjye\n2) Andika nimero\n3) Hindura ururimi\n4) Sohoka",
  "ussd.list": "Dosiye zawe\n1) 05123 Ubucuruzi\n2) 04817 Uruhushya\n9) Sohoka\n99) Subira",
  "ussd.ask": "Andika imibare 5 ya nyuma ya nimero ya dosiye.\nUrugero: 05123\n9) Sohoka\n99) Subira",
  "ussd.statusAction":
    "05123 Ubucuruzi\nIcyiciro 2/5 Inyandiko\nBISABWA: ifoto y'ubukode yijimye. Ibiro bya NPSA birayohereza ku buntu.\n05/11\n99) Subira",
  "ussd.statusReview":
    "04817 Uruhushya\nIcyiciro 3/5 Tekiniki\nNta kibasabwa. Biteganyijwe 21/11.\n04/11\n99) Subira",
  "ussd.notFound":
    "Ntiyabonetse.\nReba urupapuro, cyangwa usure ibiro bya NPSA. Ni ubuntu.\n1) Ongera\n9) Sohoka",
  "ussd.timeout": "Igihe cyawe cyarangiye.\nKanda *123# wongere.",

  "u.smsStage":
    "NPSA: NPSA-2026-05123 yimukiye ku isuzuma ry'izina (Ibiro by'iyandikwa). Nta kibasabwa. Kanda *123# ku buntu.",
  "u.smsAction":
    "NPSA: NPSA-2026-05123 isaba ifoto isomeka y'amasezerano y'ubukode. Ibiro bya NPSA birayikohereza ku buntu. Kanda *123#",
  "u.smsDone":
    "NPSA: NPSA-2026-05123 yemejwe. Fata icyemezo ku cyumba cyo gutanga ufite indangamuntu. Ni ubuntu.",
};

const fr: OfficerDict = {
  "o.title": "Demandes",
  "o.sub": "Trouvez un dossier et donnez une réponse claire au citoyen.",
  "o.search": "Numéro de dossier, téléphone ou nom",
  "o.searchHint": "Les appelants n'ont souvent pas leur numéro de dossier.",
  "o.awaiting": "En attente d'action",
  "o.completed": "Terminées cette semaine",
  "o.col.citizen": "Citoyen",
  "o.col.application": "Demande",
  "o.col.stage": "Étape",
  "o.col.updated": "Mise à jour",
  "o.col.status": "Statut",
  "o.noResults": "Aucun dossier ne correspond à “{q}”.",
  "o.noResultsHint": "Essayez le numéro depuis lequel le citoyen appelle, ou son nom complet.",
  "o.resultsFor": "{n} résultats pour “{q}”",

  "o.role.frontDesk": "Accueil",
  "o.role.processing": "Agent instructeur",
  "o.roleNote":
    "L'accueil peut trouver et expliquer tout dossier. Modifier un statut demande des droits d'instruction.",
  "o.permissionDenied": "L'accueil ne peut pas modifier un statut. Demandez à un agent instructeur.",

  "o.answer": "Ce que voit le citoyen",
  "o.answerHint": "Lisez ceci à voix haute, ou copiez-le.",
  "o.copyAnswer": "Copier la réponse",
  "o.answerCopied": "Copié",
  "o.citizenPhone": "Téléphone",
  "o.lastUpdate": "Dernière mise à jour",
  "o.documents": "Documents",
  "o.timeline": "Historique",
  "o.actions": "Actions",
  "o.updateStatus": "Modifier le statut",
  "o.requestDocument": "Demander un document",
  "o.viewResponse": "Réponse du citoyen",
  "o.backToList": "Toutes les demandes",

  "o.assistedTitle": "Visite assistée",
  "o.assistedBody": "Vous agissez pour le citoyen au guichet. C'est consigné au dossier.",
  "o.startAssisted": "Agir pour ce citoyen",
  "o.endAssisted": "Terminer la visite assistée",

  "o.status.title": "Modifier le statut",
  "o.status.moveTo": "Déplacer vers",
  "o.status.note": "Le citoyen est prévenu par SMS dès l'enregistrement.",
  "o.status.save": "Enregistrer et prévenir",

  "o.request.title": "Demander un document",
  "o.request.which": "Quel document ?",
  "o.request.why": "Pourquoi ne peut-il pas être utilisé ?",
  "o.request.whyHint": "Ces motifs existent déjà dans les trois langues.",
  "o.request.note": "Ajouter une note",
  "o.request.optional": "facultatif",
  "o.request.notePlaceholder": "Tout ce que ce citoyen doit savoir en plus",
  "o.request.noteLang": "Votre note est envoyée telle quelle, avec la mention “{language}”.",
  "o.request.due": "Réponse attendue avant le",
  "o.request.preview": "Ce que verra le citoyen, en {language}",
  "o.request.previewLang": "Sa langue",
  "o.request.send": "Envoyer la demande",
  "o.request.sent": "Demande envoyée à {name}",

  "o.response.title": "Réponse du citoyen",
  "o.response.received": "Reçue le {date}",
  "o.response.replaces": "Remplace la photo envoyée le {date}",
  "o.response.accept": "Accepter le document",
  "o.response.reject": "Inutilisable — redemander",
  "o.response.rejectHint":
    "Choisissez un motif nouveau et plus précis. Renvoyer les mêmes mots fait repartir le dossier pour un tour.",

  "h.received": "Demande reçue",
  "h.checked": "Documents vérifiés",
  "h.requested": "Document de remplacement demandé",
  "h.responded": "Le citoyen a envoyé un remplacement",
  "h.assisted": "Consultée au guichet pour le compte du citoyen",
  "h.stageChanged": "Déplacée vers {stage}",

  "u.title": "Sans smartphone",
  "u.sub": "N'importe quel téléphone peut consulter un dossier, sans data et sans application.",
  "u.dial": "Composez {code} — gratuit sur tous les réseaux",
  "u.pullTitle": "Le citoyen demande",
  "u.pushTitle": "La NPSA prévient d'elle-même",
  "u.send": "Envoyer",
  "u.cancel": "Annuler",
  "u.reset": "Recommencer",
  "u.showTimeout": "Laisser la session expirer",
  "u.charsLeft": "{n} caractères restants",
  "u.budget": "Cet écran utilise {n} caractères sur 182",
  "u.budgetWorst": "La plus longue des trois langues : {n}",

  "u.noteOs":
    "La boîte de dialogue appartient au téléphone, pas à nous. Pas de couleur, pas de logo, pas de mise en page — la NPSA ne contrôle que le texte, et c'est donc le texte qui est tout le design.",
  "u.noteKeypad":
    "Le téléphone de Jean Bosco n'a qu'un clavier numérique : chaque étape est un chiffre. Aucune étape ne lui demande d'écrire un mot — d'où la saisie des cinq derniers chiffres du dossier.",
  "u.noteLang":
    "La langue est la première question, posée une seule fois. Le réseau retient le choix pour son numéro. Le vrai menu MTN est en anglais uniquement : c'est précisément l'écart à combler.",
  "u.noteTimeout":
    "Une session USSD est un aller-retour réseau minuté, pas une page. Deux niveaux suffisent pour un statut ; un troisième serait une occasion de plus d'expirer.",
  "u.noteBudget":
    "182 caractères, comptés en kinyarwanda parce que c'est la langue la plus longue. Les phrases rassurantes n'entrent pas : elles passent par SMS.",

  "ussd.lang": "NPSA\nHitamo ururimi\nChoose language\n1) Kinyarwanda\n2) English\n3) Francais",
  "ussd.menu": "NPSA\n1) Mes demandes\n2) Entrer un numero\n3) Changer de langue\n4) Quitter",
  "ussd.list": "Vos demandes\n1) 05123 Entreprise\n2) 04817 Permis\n9) Quitter\n99) Retour",
  "ussd.ask":
    "Entrez les 5 derniers chiffres de votre dossier.\nExemple: 05123\n9) Quitter\n99) Retour",
  "ussd.statusAction":
    "05123 Entreprise\nEtape 2/5 Documents\nDEMANDE: photo du bail trop sombre. Tout bureau NPSA l'envoie gratuitement.\nMaj 05/11\n99) Retour",
  "ussd.statusReview":
    "04817 Permis\nEtape 3/5 Technique\nRien n'est demande. Prevu le 21/11.\nMaj 04/11\n99) Retour",
  "ussd.notFound":
    "Introuvable.\nVerifiez votre recu, ou passez dans un bureau NPSA. C'est gratuit.\n1) Reessayer\n9) Quitter",
  "ussd.timeout": "Votre session est terminee.\nComposez *123# pour recommencer.",

  "u.smsStage":
    "NPSA : NPSA-2026-05123 passe à la vérification du nom (Bureau du registre). Rien n'est demandé. Composez *123#, gratuit.",
  "u.smsAction":
    "NPSA : NPSA-2026-05123 demande une photo lisible du bail. Tout bureau NPSA l'enverra pour vous, gratuitement. *123#",
  "u.smsDone":
    "NPSA : NPSA-2026-05123 est approuvée. Retirez votre certificat au guichet avec votre pièce d'identité. Service gratuit.",
};

export const officer = { en, rw, fr };
