---
tytuł: Rytmy alfa i gamma
osnowa: '[[Sieci mózgu i predykcja]]'
rodziny:
- '[[Rytmy i fale]]'
- '[[Predykcja]]'
- '[[Sygnał elektryczny]]'
sieci:
- kod: VIS
  powód: 'Patrzysz na ekran: u badanych w obszarach wzrokowych kory w paśmie gamma przeważają wpływy biegnące dalej od receptorów, w paśmie alfa i beta zaś wpływy biegnące w stronę receptorów (Michalareas i in. 2016)<!--[s:michalareas2016-human-meg-gamma-ff-alphabeta-fb]-->.'
bez_sieci: ''
ryciny: []
materiały:
- tytuł: 'Mr. Science, Nothing About Spiders Is Normal…Here''s Why'
  url: https://youtu.be/fIWr69Rc9Dg?t=496
  czas: 8:16–10:02 (1:46)
- tytuł: 'Buzsáki i Draguhn 2004: Neuronal oscillations in cortical networks'
  url: https://doi.org/10.1126/science.1099745
- tytuł: 'van Kerkoerle i in. 2014: Alpha and gamma oscillations characterize feedback and feedforward processing in monkey visual cortex'
  url: https://doi.org/10.1073/pnas.1402773111
- tytuł: 'Bastos i in. 2015: Visual areas exert feedforward and feedback influences through distinct frequency channels'
  url: https://doi.org/10.1016/j.neuron.2014.12.018
- tytuł: 'Michalareas i in. 2016: Alpha-beta and gamma rhythms subserve feedback and feedforward influences among human visual cortical areas'
  url: https://doi.org/10.1016/j.neuron.2015.12.018
rekordy:
- van_kerkoerle_2014
- bastos_2015
- michalareas_2016
- bastos_2012
- 2004_Buzsaki
- mr-science_spiders-not-normal_fIWr69Rc9Dg
stan: gotowa
---
Rytmy alfa i gamma (ang. alpha and gamma rhythms) to wahania aktywności neuronalnej kory w dwóch pasmach częstotliwości: alfa wolniejsze, gamma szybsze. Rytm, czyli oscylacja (ang. oscillation), to wahanie aktywności wielu neuronów naraz, powtarzające się regularnie. Pasmo to zakres częstotliwości, a częstotliwość liczy się w hercach (Hz), czyli cyklach na sekundę. Zapis z jednej elektrody to suma wielu fal naraz, a transformata Fouriera (ang. Fourier transform), czyli obliczenie, rozkłada go na fale o różnych częstotliwościach. Pierwszym opisanym wzorcem w [[EEG]] (elektroencefalografii) człowieka, zapisie napięcia elektrodami na skórze głowy, był rytm od 8 do 12 Hz, fale alfa, które opisał Berger, a rytmy przodomózgowia ssaków obejmują częstotliwości od około 0,05 do 500 Hz (Buzsáki i Draguhn 2004)<!--[s:buzsaki2004-berger-alpha-8-12]--><!--[s:buzsaki2004-bands-log-scale]--><!--[s:buzsaki2004-coexist-fast-local-slow-large]-->. Jak podają autorzy, średnie częstotliwości kolejnych pasm tworzą ciąg na skali logarytmicznej, ze stałym stosunkiem sąsiednich częstotliwości, a w zestawieniu autorów, dotyczącym kory szczura, gamma obejmuje od 30 do 80 Hz. Według nich kilka rytmów może trwać naraz w tym samym obszarze, a ponieważ większość połączeń neuronów jest lokalna, szybkie rytmy obejmują niewielkie grupy neuronów, a wolne angażują bardzo duże sieci.

Korę dzieli się na warstwy numerowane od powierzchni. Elektrody wprowadzone przez wszystkie warstwy pierwszorzędowej kory wzrokowej (V1) makaka pokazały szybki rytm gamma i wolny rytm alfa (w tym badaniu gamma około 40–90 Hz, alfa około 5–15 Hz): gamma zaczyna się w warstwie 4 i rozchodzi się do warstw głębokich i powierzchownych, a alfa rozchodzi się w odwrotnym kierunku (van Kerkoerle i in. 2014)<!--[s:vankerkoerle2014-alpha-gamma-bands]--><!--[s:vankerkoerle2014-gamma-ff-alpha-fb]--><!--[s:vankerkoerle2014-lgn-layer4-feedback-avoids]-->. Jak przypominają autorzy za badaniami anatomicznymi, [[Bioinformacja|bioinformacja]] z ciała kolankowatego bocznego, stacji [[Pręciki, czopki i droga wzrokowa|drogi wzrokowej]] we wzgórzu, dociera w V1 głównie do warstwy 4. Zapis autorów naraz z V1 i z obszaru V4, leżącego dalej od receptorów zmysłowych, tu pręcików i czopków siatkówki, pokazał, że gamma rozchodzi się wzdłuż [[Połączenia wstępujące i zwrotne|połączeń wstępujących]] (ang. feedforward), biegnących od obszaru bliższego receptorom do dalszego, a alfa wzdłuż połączeń zwrotnych (ang. feedback), w stronę V1. Według autorów mikrostymulacja V1 (ang. microstimulation), czyli słabe drażnienie elektryczne fragmentu kory, wzbudzała w V4 rytm gamma, a mikrostymulacja V4 wzbudzała w V1 rytm alfa.

Wpływ kierunkowy (ang. directed influence) mierzy, na ile wcześniejsza aktywność jednego obszaru zapowiada późniejszą aktywność drugiego. W 28 parach obszarów wzrokowych makaka wpływy wzdłuż połączeń wstępujących płynęły w paśmie theta, około 4 Hz, oraz w paśmie gamma, około 60–80 Hz, a wzdłuż połączeń zwrotnych w paśmie beta, około 14–18 Hz (Bastos i in. 2015)<!--[s:bastos2015-gamma-ff-beta-fb]-->. U człowieka magnetoencefalografia (MEG), czyli pomiar pól magnetycznych nad głową, w siedmiu obszarach wzrokowych odpowiadających obszarom makaka pokazała, że w paśmie gamma przeważają wpływy wzdłuż połączeń wstępujących, a w paśmie alfa i beta wzdłuż zwrotnych (Michalareas i in. 2016)<!--[s:michalareas2016-human-meg-gamma-ff-alphabeta-fb]-->. Pasmo połączeń zwrotnych różni się więc między badaniami, od alfy po betę.

W [[Kodowanie predykcyjne|kodowaniu predykcyjnym]] (ang. predictive coding) predykcje (ang. predictions) płyną połączeniami zwrotnymi w stronę receptorów, a zaskoczenie (ang. prediction error) połączeniami wstępującymi dalej od nich (Bastos i in. 2012)<!--[s:bastos2012-superficial-errors-deep-predictions]--><!--[s:bastos2012-errors-higher-frequencies]-->. Autorzy wyprowadzają z równań kodowania predykcyjnego asymetrię, która dotyczy każdego pasma: zaskoczenie ma wyższe częstotliwości niż predykcje, które kumulują zaskoczenie. Autorzy łączą tę asymetrię z danymi, według których połączenia wstępujące mogą używać wyższych częstotliwości niż zwrotne. Gamma może więc być śladem strumienia zaskoczenia, a alfa i beta strumienia predykcji, ale to odczytanie pozostaje hipotezą.

Kiedy patrzysz na twarz przyjaciółki, bioinformacja płynie od Twojej siatkówki przez V1 do obszarów wzrokowych coraz dalszych od receptorów. W Twojej korze w paśmie gamma przeważają zapewne wpływy w tę stronę, ale w paśmie alfa i beta wpływy wracające w stronę V1. Jeśli odczytanie z kodowania predykcyjnego się utrzyma, alfa i beta niosą predykcje Twoich Modeli Mentalnych jej twarzy, na których polegasz, a gamma niesie zaskoczenie, które aktualizuje te predykcje, gdy przyjaciółka nagle się uśmiechnie.
