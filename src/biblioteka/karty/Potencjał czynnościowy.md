---
tytuł: Potencjał czynnościowy
osnowa: '[[Neuron i synapsa]]'
rodziny:
- '[[Budowa i elektryka neuronu]]'
głębokość:
- komórka
- fizyka
opis: 'Potencjał czynnościowy (action potential) to krótka fala o stałej wielkości przepływająca wzdłuż aksonu: wnętrze komórki zmienia w niej na chwilę napięcie z ujemnego na dodatnie. Gdy napięcie wnętrza przesunie się w stronę dodatnią ponad próg, kanały sodowe otwierają się lawinowo i sód wpływa do komórki, a zaraz potem kanały sodowe zamykają się na pewien czas (inaktywacja) i wypływa potas. W kursie potencjał czynnościowy to waluta bioinformacji.'
myśl: 'Próg zamienia zmiany napięcia o różnej wielkości w potencjały czynnościowe o jednej wielkości, więc wzdłuż aksonu [[Bioinformacja|bioinformacja]] przepływa w jednej walucie, a siłę bodźca niesie ich częstość.'
sieci: []
bez_sieci: 'Potencjał czynnościowy przepływa wzdłuż aksonów neuronów we wszystkich sieciach; ta karta schodzi do błony pojedynczej komórki.'
ryciny: []
materiały:
- tytuł: 'Artem Kirsanov, The Core Equation Of Neuroscience'
  url: https://youtu.be/zOmhHE2xctw?t=296
  czas: 4:56–6:24 (1:28)
- tytuł: 'Artem Kirsanov, The Core Equation Of Neuroscience'
  url: https://youtu.be/zOmhHE2xctw?t=611
  czas: 10:11–16:50 (6:39)
- tytuł: 'Hodgkin i Huxley 1952: przepuszczalność błony aksonu kałamarnicy dla sodu i potasu'
  url: https://doi.org/10.1113/jphysiol.1952.sp004764
- tytuł: 'Korngreen 2026: zmienność parametrów w modelu Hodgkina–Huxleya'
  url: https://doi.org/10.1371/journal.pcbi.1014458
rekordy:
- artem-kirsanov_core-equation_zOmhHE2xctw
- crashcourse_hearing-balance_Ie2j7GpC4JU
---
W 1952 roku Alan Hodgkin i Andrew Huxley opisali równaniami, jak przez błonę olbrzymiego aksonu kałamarnicy przepływają jony sodu i potasu przy zmianach napięcia. Z tych równań obliczyli prędkość, z jaką potencjał czynnościowy biegnie wzdłuż aksonu: 18,8 m/s, przy 21,2 m/s zmierzonych w tym samym włóknie w temperaturze 18,5 °C (Hodgkin i Huxley 1952)<!--[s:hodgkin1952-conduction-velocity]-->.

Potencjał czynnościowy tworzą zależne od napięcia zmiany przepuszczalności błony dla sodu i potasu (Hodgkin i Huxley 1952)<!--[s:hodgkin1952-sodium-potassium-permeability]-->. Depolaryzacja, czyli zmiana napięcia wnętrza komórki w stronę dodatnią, otwiera kanały sodowe, sód wpływa do komórki i depolaryzuje ją dalej, więc otwierają się kolejne kanały; ta pętla tworzy próg, powyżej którego depolaryzacja rośnie sama do pełnej wielkości. Zaraz potem kanały sodowe się inaktywują, czyli zamykają na pewien czas, a spóźnione otwarcie kanałów potasowych pozwala potasowi wypłynąć i przywrócić [[Gradient jonów i potencjał spoczynkowy|potencjał spoczynkowy]], ujemne napięcie wnętrza komórki.

Każdy potencjał czynnościowy ma więc tę samą wielkość, a siłę bodźca niesie ich częstość. Kiedy podkręcasz głośność, rzęski komórek rzęsatych w Twoim uchu uginają się mocniej, więc komórki dają większy [[Potencjał stopniowany|potencjał stopniowany]], a włókna nerwu słuchowego odpowiadają częstszymi potencjałami czynnościowymi. W kursie potencjał czynnościowy to waluta [[Bioinformacja|bioinformacji]]: przepływa wzdłuż aksonu, na [[Synapsa chemiczna i elektryczna|synapsie chemicznej]] zostaje przetransformowany w wydzielenie przekaźnika, a na synapsie elektrycznej przekazany dalej.

Sami autorzy nazwali swoje równania opisem empirycznym (Hodgkin i Huxley 1952)<!--[s:hodgkin1952-empirical-description]-->. Korngreen wrócił do ich danych, losował parametry w zakresie niepewności dopasowania i otrzymał całą populację modeli aksonu (Korngreen 2026)<!--[s:korngreen2026-hh-ensemble]-->. Najczęściej odpowiadały one na bodziec jednym potencjałem czynnościowym na jego początku, zgodnie z rolą olbrzymiego aksonu w ucieczce kałamarnicy, a klasyczny zestaw parametrów z 1952 roku trafił do mniejszości odpowiadającej serią regularnych potencjałów czynnościowych. Wiele różnych zestawów parametrów kanałów daje więc tę samą odpowiedź, jeden potencjał czynnościowy na początku bodźca, a ten sam wynik z różnych elementów to [[Degeneracja obwodów|degeneracja]].
