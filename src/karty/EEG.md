---
tytuł: EEG
osnowa: '[[Pomiar mózgu]]'
rodziny:
- '[[Sygnał elektryczny]]'
- '[[Rozdzielczość pomiaru]]'
sieci:
- kod: SMN
  powód: 'Ruszasz palcem z własnej woli: odcinek potencjału gotowości stromiejący od około 400 ms przed ruchem to aktywność przeciwległej pierwszorzędowej kory ruchowej i bocznej kory przedruchowej (Shibasaki i Hallett 2006)<!--[s:shibasaki2006-early-late-bp-sources]-->.'
bez_sieci: ''
ryciny:
- eeg.svg
materiały:
- tytuł: 'Freethink, How one streamer learned to play video games with only her mind: Perrikaryal, Emotiv EPOC X'
  url: https://www.freethink.com/consumer-tech/how-one-streamer-plays-video-games-using-only-her-mind
- tytuł: 'WirtualTV, I Played Trackmania with Mind Control: Trackmania z Perrikaryal'
  url: https://www.youtube.com/watch?v=NFABWmvkUzY
- tytuł: 'Buzsáki, Anastassiou i Koch 2012: The origin of extracellular fields and currents: EEG, ECoG, LFP and spikes'
  url: https://doi.org/10.1038/nrn3241
- tytuł: 'Shibasaki i Hallett 2006: What is the Bereitschaftspotential?'
  url: https://doi.org/10.1016/j.clinph.2006.04.025
- tytuł: 'Goncharova i in. 2003: EMG contamination of EEG: spectral and topographical characteristics'
  url: https://doi.org/10.1016/S1388-2457(03)00093-2
rekordy:
- 2026-10-13_pomiar-sport-inni
- 2026-10-13_zajecia-gry-sprawczosc
stan: gotowa
---
EEG, czyli elektroencefalografia (ang. electroencephalography), to zapis zmian napięcia elektrodami położonymi na skórze głowy. Zapis z jednej elektrody to wygładzony w czasie i przestrzeni potencjał pola elektrycznego (ang. local field potential) zebrany z obszaru kory o powierzchni 10 cm² albo większej (Buzsáki, Anastassiou i Koch 2012)<!--[s:buzsaki2012-eeg-smoothed-10cm2]-->. To rzut aktywności sieci na jedną wielkość fizyczną, napięcie, a [[Skaner MRI|skaner rezonansu magnetycznego]] (ang. magnetic resonance imaging, MRI) rzutuje tę samą aktywność na inną.

Najwięcej do tego zapisu wnoszą przepływy jonów przez błonę w synapsach, przede wszystkim te, z których powstają pobudzające i hamujące potencjały postsynaptyczne (ang. postsynaptic potentials) (Buzsáki, Anastassiou i Koch 2012)<!--[s:buzsaki2012-synaptic-currents-main-source]-->. To [[Potencjał stopniowany|potencjały stopniowane]] w dendrytach neuronu, który odbiera przekaźnik z [[Synapsa chemiczna i elektryczna|synapsy chemicznej]]. Komórki piramidowe (ang. pyramidal cells), główne neurony kory, wnoszą do pola elektrycznego dużo, a ich dendryty szczytowe (ang. apical dendrites) leżą w korze równolegle do siebie. Taki układ sprzyja sumowaniu się zsynchronizowanej aktywności ogromnej liczby komórek, dlatego potencjał pola jest największy właśnie w korze (Buzsáki, Anastassiou i Koch 2012)<!--[s:buzsaki2012-pyramidal-parallel-dipoles]-->.

![[eeg.svg]]

Tkanki między korą a elektrodą zniekształcają i osłabiają zapis, więc w większości warunków mówi on niewiele o [[Potencjał czynnościowy|potencjałach czynnościowych]] pojedynczych neuronów (Buzsáki, Anastassiou i Koch 2012)<!--[s:buzsaki2012-eeg-smoothed-10cm2]-->. EEG śledzi za to przebieg napięcia w czasie. Potencjał gotowości (ang. readiness potential), powolne ujemne narastanie napięcia przed ruchem wykonanym z własnej woli, zaczyna się około 2 s przed ruchem, a około 400 ms przed nim stromieje (Shibasaki i Hallett 2006)<!--[s:shibasaki2006-early-late-bp-sources]-->. Benjamin Libet porównał go z chwilą, którą osoby badane wskazywały po ruchu na tarczy przypominającej zegar jako moment chęci ruchu: u pięciu osób, w seriach bez planowania zawczasu, początek głównego narastania wyprzedzał tę chwilę średnio o około 350 ms (Libet i in. 1983)<!--[s:libet1983-rp-precedes-w]-->. Wyniki tego [[Eksperyment Libeta|eksperymentu]] w zachowaniu i w EEG odtworzyli później Aaron Schurger i współpracownicy, ale narastanie, zwykle czytane jako ostatni etap planowania ruchu, czyta inaczej: gdy nic nie ponagla do ruchu, spontaniczne wahania aktywności neuronalnej uśrednione względem chwili ruchu układają się w łagodną krzywą (Schurger, Sitt i Dehaene 2012)<!--[s:schurger2012-fluctuations-average-buildup]-->.

Perrikaryal, streamerka z magisterium z psychologii, gra przez opaskę EEG firmy Emotiv. Każde polecenie ćwiczy w kilku ośmiosekundowych nagraniach jednego wyobrażenia, na przykład talerza wirującego na kiju, aż program nauczy się rozpoznawać jego wzorzec, a potem przypisuje ten wzorzec przyciskowi wirtualnego pada. W jednej grze wirujący talerz to unik jej postaci. W innej krzyżakiem pada steruje, wyobrażając sobie pchanie głazu, wirujący talerz, skaczącego konika polnego i złość, a widok w grze prowadzi oczami śledzonymi przez czujnik. Pierwszą grą, w którą grała poleceniami wyobraźni, był Minecraft, a później ścigała się nimi w Trackmanii (Dickinson 2024)<!--[s:freethink2024-perrikaryal-emotiv-training]-->. Różne wyobrażenia to różne aktywności sieci, a program rozróżnia ich rzuty w EEG, ale przy złości zapis może nieść także napięcie mięśni twarzy: nawet słaby skurcz mięśnia czołowego albo skroniowego daje na całej skórze głowy zapis, który zasłania albo naśladuje rytmy EEG (Goncharova i in. 2003)<!--[s:goncharova2003-facial-emg-mimics-eeg]-->. Zwykły pad odczytuje ruch palca, a kontroler EEG rzut aktywności sieci na skórę głowy. Elektroda EEG odbiera tę samą wielkość fizyczną co elektroreceptory rekinka psiego: napięcie, które wytwarza pole elektryczne. Głodny rekinek celnie atakuje gładzicę także wtedy, gdy ryba przykryła się piaskiem, a pobudza go jej pole bioelektryczne (Kalmijn 1971)<!--[s:kalmijn1971-flatfish-bioelectric-field]-->; to pole należy do jego [[Umwelt]].

Kiedy wyobrażasz sobie wirujący talerz, to wyobrażenie to aktywność Twoich sieci, a elektroda na skórze głowy zapisuje z niej sumę zsynchronizowanych potencjałów postsynaptycznych z co najmniej 10 cm² kory. Gdy ćwiczysz to samo wyobrażenie wiele razy, według Perrikaryal nawet setki prób, kształtują się Twoje Modele Mentalne talerza i polegasz na nich za każdym razem, więc wyobrażenie staje się prawdopodobnie na tyle powtarzalne, że program rozpoznaje jego rzut w EEG.
