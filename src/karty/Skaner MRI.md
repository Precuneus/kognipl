---
tytuł: Skaner MRI
dyscyplina: fizyka
rodziny:
- '[[Sygnał hemodynamiczny i magnetyczny]]'
- '[[Elektryczność i fale elektromagnetyczne]]'
sieci: []
bez_sieci: 'Cewka skanera MRI odbiera sygnał radiowy z całej głowy, więc fMRI obejmuje wszystkie sieci, część obszarów słabiej.'
ryciny: []
materiały:
- tytuł: 'Blümich i in. 2026: Magnetic resonance imaging'
  url: https://doi.org/10.1126/sciadv.aeg6766
- tytuł: 'NASA, Radio Waves'
  url: https://science.nasa.gov/ems/05_radiowaves/
- tytuł: 'Yeo i in. 2011: The organization of the human cerebral cortex estimated by intrinsic functional connectivity'
  url: https://doi.org/10.1152/jn.00338.2011
rekordy: []
stan: gotowa
---
Skaner rezonansu magnetycznego (ang. magnetic resonance imaging, MRI) bada ciało w silnym polu magnetycznym impulsami fal radiowych, a z sygnału jąder atomów w tkankach, najczęściej jąder wodoru, tworzy obraz (Blümich i in. 2026)<!--[s:blumich2026-static-field-rf-pulses]-->. Ten sygnał skaner odbiera jako energię elektromagnetyczną w zakresie fal radiowych, tak jak [[Pręciki, czopki i droga wzrokowa|czopek]], receptor zmysłowy siatkówki, odbiera ją w zakresie światła widzialnego. Fale radiowe to najdłuższe fale [[Widmo elektromagnetyczne|widma elektromagnetycznego]] (NASA 2010)<!--[s:nasa2010-radio-longest-waves]-->, a światło widzialne to jego wąski wycinek. Elektroda [[EEG|elektroencefalografii (EEG)]] odbiera napięcie na skórze głowy, a cewka skanera fale radiowe, więc każdy z tych przyrządów rzutuje aktywność mózgu na inną wielkość fizyczną.

Jądro wodoru to pojedynczy proton, który zachowuje się jak maleńki magnes. W silnym polu magnetycznym nieco więcej takich jąder ustawia się zgodnie z polem, a suma ich drobnych magnesów to namagnesowanie tkanki. W większości metod MRI namagnesowanie pochodzi od jąder wodoru (Blümich i in. 2026)<!--[s:blumich2026-static-field-rf-pulses]--><!--[s:blumich2026-water-protons-most-abundant]--><!--[s:blumich2026-precession-signal-induction]-->. Według Blümicha i współpracowników w tkankach miękkich protony wody to najliczniejsze ze wszystkich jąder. Rezonans magnetyczny to metoda mało czuła, ale ta liczebność protonów wody dała mu dzisiejsze znaczenie. Jak wyjaśniają Blümich i współpracownicy, namagnesowanie jąder wychylone z kierunku pola krąży wokół niego, a częstotliwość tego krążenia rośnie proporcjonalnie do siły pola. Skaner wychyla je falą radiową o częstotliwości bliskiej tej częstotliwości, nazywanej częstotliwością Larmora, a krążące namagnesowanie indukuje w cewce sygnał radiowy. Kolejne porcje fal radiowych i przerwy na swobodne krążenie odsuwają namagnesowanie od stanu równowagi i pozwalają mu do niego wracać.

Oprócz fal radiowych skaner dokłada do stałego pola krótkie impulsy gradientu pola magnetycznego. Gradient pola magnetycznego to pole zmieniające siłę wzdłuż jednego kierunku, wytwarzane przez cewki gradientowe. Paul Lauterbur wpadł na pomysł, by miejsce w ciele, z którego pochodzi sygnał, zapisywać gradientami pola magnetycznego, a za wynalezienie MRI Lauterbur i Peter Mansfield dostali w 2003 roku Nagrodę Nobla (Blümich i in. 2026)<!--[s:blumich2026-lauterbur-mansfield]-->.

Funkcjonalny rezonans magnetyczny (ang. functional MRI, fMRI) mierzy aktywność neuronalną pośrednio, przez krew. Aktywność obszaru zwiększa przepływ krwi przez ten obszar, a zużycie tlenu rośnie przy tym mniej niż przepływ. Hemoglobina, która oddała tlen, powstaje w naczyniach włosowatych tam, gdzie tkanka zużywa tlen (Blümich i in. 2026)<!--[s:blumich2026-neurovascular-coupling]--><!--[s:blumich2026-bold-deoxyhemoglobin]-->. Według Blümicha i współpracowników taka hemoglobina to silny paramagnetyk, który zaburza pole magnetyczne skanera tym silniej, im większe jej stężenie w naczyniu. W aktywnym obszarze przepływ krwi rośnie bardziej niż zużycie tlenu, więc stężenie hemoglobiny, która oddała tlen, spada. Mniej zaburza ona wtedy pole, a sygnał z tego obszaru rośnie (Glover 2011)<!--[s:glover2011-hb-swept-out-signal-increase]-->. Zjawisko nazwano efektem zależnym od poziomu natlenienia krwi (ang. blood-oxygenation-level dependent, BOLD), a obrazy aktywności mózgu z MRI, oparte na tym efekcie i na dopływie krwi, opublikowano w 1992 roku (Blümich i in. 2026)<!--[s:blumich2026-bold-deoxyhemoglobin]-->. Sygnał BOLD osiąga szczyt około 5 do 6 sekund po krótkim pobudzeniu neuronów i zmienia się znacznie wolniej niż procesy neuronalne, więc fMRI rozmywa przebieg aktywności w czasie (Glover 2011)<!--[s:glover2011-bold-temporal-resolution]-->.

Cewka odbiera sygnał z całej głowy, z obszarów bliskich receptorom, jak pierwszorzędowa kora wzrokowa (ang. primary visual cortex, V1), oraz z obszarów od nich odległych, więc pomiar obejmuje każdą [[Odległość od receptorów|odległość od receptorów]], ale z [[Kora okołooczodołowa|kory okołooczodołowej]] i przedniej części [[Płaty mózgu|płatów skroniowych]] zwykłe fMRI daje słaby sygnał (Girn i in. 2024)<!--[s:girn2024-limbic-part-of-extended-dn]-->. Yeo i współpracownicy (2011)<!--[s:yeo2011-seven-network-parcellation]--> podzielili korę 1000 dorosłych osób, badanych w skanerze w spoczynku, na 7 [[Sieci wielkoskalowe|sieci wielkoskalowych]], wśród nich [[Sieć wzrokowa|sieć wzrokową]].

Kiedy leżysz w skanerze, słyszysz głośne stukanie drgających cewek gradientowych, a hałas sięga przy silnych polach czasem 130 decybeli i więcej, zależnie od sekwencji pomiaru (Blümich i in. 2026)<!--[s:blumich2026-acoustic-noise-130db]-->. Namagnesowanie jąder wodoru w wodzie Twoich tkanek krąży wokół kierunku pola, a jego sygnał radiowy, energię spoza Twojego [[Umwelt]], odbiera cewka; Twoje receptory zmysłowe odbierają w tej chwili hałas, chłód powietrza i ucisk podpórki pod głową. Kiedy potem oglądasz obraz swojego mózgu, Twoje czopki pochłaniają światło widzialne z ekranu, a z tej [[Bioinformacja|bioinformacji]] kształtują się Twoje [[Modele Mentalne|Modele Mentalne]] własnego mózgu. Polegasz na nich, kiedy myślisz o własnym widzeniu jako o aktywności Twojej sieci wzrokowej.
