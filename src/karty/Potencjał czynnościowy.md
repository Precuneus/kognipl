---
tytuł: Potencjał czynnościowy
osnowa: '[[Neuron i synapsa]]'
rodziny:
- '[[Budowa i elektryka neuronu]]'
sieci: []
bez_sieci: 'Potencjał czynnościowy zachodzi na błonie pojedynczego neuronu i przesuwa się wzdłuż aksonów w każdej sieci mózgu.'
ryciny: []
materiały:
- tytuł: 'Artem Kirsanov, The Core Equation Of Neuroscience'
  url: https://youtu.be/zOmhHE2xctw?t=296
  czas: 4:56–6:24 (1:28)
- tytuł: 'Artem Kirsanov, The Core Equation Of Neuroscience'
  url: https://youtu.be/zOmhHE2xctw?t=611
  czas: 10:11–16:50 (6:39)
- tytuł: 'OpenStax, Anatomy and Physiology 2e, 12.4 The Action Potential'
  url: https://openstax.org/books/anatomy-and-physiology-2e/pages/12-4-the-action-potential
- tytuł: 'Hodgkin i Huxley 1952: A quantitative description of membrane current and its application to conduction and excitation in nerve'
  url: https://doi.org/10.1113/jphysiol.1952.sp004764
- tytuł: 'Adrian i Zotterman 1926: The impulses produced by sensory nerve-endings. Part II. The response of a single end-organ'
  url: https://doi.org/10.1113/jphysiol.1926.sp002281
- tytuł: 'Korngreen 2026: Neuronal excitability and parameter variability in the Hodgkin-Huxley model'
  url: https://doi.org/10.1371/journal.pcbi.1014458
rekordy:
- artem-kirsanov_core-equation_zOmhHE2xctw
stan: gotowa
---
Potencjał czynnościowy (ang. action potential) to fala przepływu jonów po błonie komórkowej. Tam, dokąd fala dociera, napięcie na błonie neuronu zmienia się na krótko, w danej komórce zawsze o tyle samo. Według podręcznika anatomii i fizjologii OpenStax (Betts i in. 2022)<!--[s:betts2022-resting-threshold-peak]--><!--[s:betts2022-sodium-gates-potassium-delay]--><!--[s:betts2022-stronger-stimulus-more-often]--> wnętrze komórki przy błonie jest w spoczynku ujemne, około −70 miliwoltów (mV), a w fali staje się dodatnie, do około +30 mV. Cały przebieg trwa około 2 milisekund (ms). W ujęciu kursu potencjały czynnościowe to waluta [[Bioinformacja|bioinformacji]]: w tej walucie bioinformacja przepływa wzdłuż aksonu, głównej wypustki neuronu. Na [[Synapsa chemiczna i elektryczna|synapsie chemicznej]], miejscu styku z następną komórką, zostaje przetransformowana: potencjał czynnościowy wywołuje tam wydzielenie przekaźników (ang. neurotransmitters), cząsteczek działających na tę komórkę. Na synapsie elektrycznej przechodzi dalej w tej samej walucie.

Ujemne napięcie wnętrza w spoczynku to [[Potencjał spoczynkowy|potencjał spoczynkowy]] (ang. resting potential), a jego dokładna wartość zależy od rodzaju neuronu i gatunku (Betts i in. 2022; Clark, Douglas i Choi 2018)<!--[s:clark2018-potassium-leak-dominates-resting]--><!--[s:betts2022-resting-threshold-peak]--><!--[s:betts2022-graded-summation-threshold]--><!--[s:betts2022-voltage-gated-charge-sensing]-->. Jak podaje podręcznik anatomii i fizjologii, [[Potencjał stopniowany|potencjały stopniowane]] z synaps, zmiany napięcia o wielkości zależnej od bodźca, zmieniają napięcie wnętrza w stronę dodatnią, czyli depolaryzują błonę (ang. depolarization). Na progu (ang. threshold), przy około −55 mV, otwierają się kanały sodowe bramkowane napięciem (ang. voltage-gated sodium channels): białkowe pory w błonie z aminokwasami czułymi na ładunek. Sód wpływa przez nie do komórki i depolaryzuje ją dalej.

Kanał sodowy ma dwie bramki: bramkę aktywacji, otwieraną przy progu, oraz bramkę inaktywacji, zamykaną po ułamku milisekundy, w chwili szczytu depolaryzacji (Betts i in. 2022)<!--[s:betts2022-sodium-gates-potassium-delay]--><!--[s:betts2022-inactivation-peak-potassium-repolarizes]--><!--[s:betts2022-return-to-rest-nongated-pump]-->. Kiedy bramka inaktywacji się zamyka, sód przestaje wpływać do komórki. Kanały potasowe bramkowane napięciem otwierają się wolniej, a potas wypływa przez nie z komórki i wynosi ładunek dodatni, więc napięcie wraca w stronę spoczynkowego; to repolaryzacja (ang. repolarization). Potas wypływa jeszcze chwilę po powrocie napięcia do spoczynkowego, a jego potencjał równowagi leży poniżej −70 mV, więc wnętrze staje się na moment bardziej ujemne niż w spoczynku; to hiperpolaryzacja (ang. hyperpolarization). Potem kanały potasowe zamykają się, a potencjał spoczynkowy przywracają pompa sodowo-potasowa oraz kanały przecieku (ang. leakage channels), pory w błonie bez bramek.

Potencjał czynnościowy powstaje na początku aksonu, w odcinku początkowym (ang. axon initial segment), gdzie kanały bramkowane napięciem są skupione najgęściej (Kole i Stuart 2012; Betts i in. 2022)<!--[s:kole2012-ais-initiation-channel-density]--><!--[s:betts2022-initial-segment-saltatory]--><!--[s:betts2022-propagation-renews-depolarization]--><!--[s:betts2022-refractory-forward-only]--><!--[s:betts2022-cns-glia-types]-->. Według podręcznika anatomii i fizjologii sód wpływający przez otwarte kanały rozchodzi się pod błoną i depolaryzuje jej kolejny odcinek. Tam otwierają się następne kanały sodowe, więc potencjał czynnościowy odnawia się wzdłuż aksonu aż do synaps. Kanały sodowe za potencjałem czynnościowym pozostają przez krótki czas zamknięte bramką inaktywacji; ten czas to okres refrakcji bezwzględnej (ang. absolute refractory period). Dlatego potencjał przesuwa się tylko do przodu. W aksonie owiniętym osłonką mielinową (ang. myelin sheath), izolacją z [[Neuron i glej|komórek glejowych]], kanały sodowe bramkowane napięciem leżą za odcinkiem początkowym tylko w przewężeniach Ranviera (ang. nodes of Ranvier). Potencjał czynnościowy przeskakuje tam od przewężenia do przewężenia i przesuwa się szybciej niż w aksonie bez osłonki.

Potencjał czynnościowy zachodzi według zasady „wszystko albo nic” (ang. all or none): albo błona dochodzi do progu i następuje cały opisany przebieg, albo do niego nie dochodzi i nic więcej się nie dzieje (Betts i in. 2022)<!--[s:betts2022-stronger-stimulus-more-often]--><!--[s:betts2022-action-potential-all-or-none]-->. Przy silniejszym bodźcu potencjały czynnościowe pojawiają się więc częściej, a każdy z nich ma szczyt przy tych samych +30 mV. Edgar Adrian i Yngve Zotterman (1926)<!--[s:adrian1926-frequency-load-all-or-nothing]--> rozciągali ciężarkami mięsień mostkowo-skórny żaby i zapisywali potencjały czynnościowe z pojedynczego zakończenia czuciowego (ang. end-organ) w tym mięśniu. Potencjały pojawiały się od 5 do 100 razy na sekundę, tym częściej, im większy ciężar, a ich wielkość przy słabszym i silniejszym bodźcu była ta sama. W ujęciu kursu każdy potencjał czynnościowy to więc ta sama waluta, a bioinformacja zależy od tego, kiedy i jak często potencjały się pojawiają; w potencjale stopniowanym zależy od jego wielkości.

Alan Hodgkin i Andrew Huxley (1952)<!--[s:hodgkin1952-sodium-potassium-permeability]--><!--[s:hodgkin1952-conduction-velocity]--><!--[s:hodgkin1952-empirical-description]--> badali ten przebieg w olbrzymim aksonie kałamarnicy. Opisali go jako zależne od napięcia zmiany przepuszczalności błony dla sodu i potasu i ujęli w równaniach. Z tych równań obliczyli prędkość, z jaką potencjał czynnościowy przesuwa się wzdłuż aksonu: 18,8 metra na sekundę. W tym samym włóknie w temperaturze 18,5 stopnia Celsjusza zmierzyli 21,2 metra na sekundę. Sami nazwali swoje równania opisem empirycznym, który zostawia otwarte pytanie, jak błona zmienia przepuszczalność.

Kiedy mocno przyciskasz opuszkę palca do krawędzi stołu, nacisk otwiera kanały sodowe bramkowane mechanicznie w zakończeniach nerwowych Twojej skóry, sód wpływa do środka i błona się depolaryzuje (Betts i in. 2022)<!--[s:betts2022-pressure-opens-sodium-channels]-->. Kiedy błona dochodzi do progu, wzdłuż aksonów w stronę mózgu przesuwają się potencjały czynnościowe, wszystkie tej samej wielkości. Im mocniej naciskasz, tym gęściej następują po sobie. Każde dotknięcie blatu wysyłało takie serie, a z nich kształtowały się Twoje [[Modele Mentalne|Modele Mentalne]] jego krawędzi. W ciemności przesuwasz po nim dłoń i zwalniasz, zanim palce dojdą do krawędzi, bo polegasz na tych modelach.
