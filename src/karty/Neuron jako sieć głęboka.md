---
tytuł: Neuron jako sieć głęboka
osnowa: '[[Neuron i synapsa]]'
rodziny:
- '[[Budowa i elektryka neuronu]]'
sieci: []
bez_sieci: 'Zjawisko dotyczy pojedynczej komórki: neurony piramidowe występują w wielu obszarach ośrodkowego układu nerwowego (Spruston 2008)<!--[s:spruston2008-pyramidal-shape-dendritic-trees]-->, także w korze wszystkich sieci.'
ryciny: []
materiały:
- tytuł: 'Artem Kirsanov, Dendrites: Why Biological Neurons Are Deep Neural Networks'
  url: https://youtu.be/hmtQPrH-gC4?t=571
  czas: 9:31–12:10 (2:39)
- tytuł: 'Artem Kirsanov, Dendrites: Why Biological Neurons Are Deep Neural Networks'
  url: https://youtu.be/hmtQPrH-gC4?t=1082
  czas: 18:02–22:14 (4:12)
- tytuł: 'Beniaguev, Segev i London 2021: pojedynczy neuron kory jako sieć głęboka'
  url: https://doi.org/10.1016/j.neuron.2021.07.002
- tytuł: 'Gidon i in. 2020: dendrytyczne potencjały wapniowe w ludzkiej korze'
  url: https://doi.org/10.1126/science.aax6239
- tytuł: 'Shapira i in. 2025: modele ludzkich neuronów piramidowych'
  url: https://doi.org/10.3389/fnins.2025.1579715
rekordy:
- artem-kirsanov_dendrites-deep-networks_hmtQPrH-gC4
stan: gotowa
---
Neuron jako sieć głęboka to ujęcie neuronu piramidowego, komórki nerwowej kory o ciele w kształcie piramidy, jako całej sztucznej sieci głębokiej (ang. deep neural network), czyli programu złożonego z wielu warstw sztucznych neuronów. Sztuczny neuron sumuje pobudzenia od jednostek poprzedniej warstwy, każde pomnożone przez własny współczynnik, a sumę przepuszcza przez funkcję nieliniową, na przykład krzywą w kształcie litery S. Warstwy między pierwszą a ostatnią to warstwy ukryte (ang. hidden layers). Dendryty to rozgałęzione wypustki neuronu, na których [[Synapsa chemiczna i elektryczna|synapsy]] innych komórek wywołują [[Potencjał stopniowany|potencjały stopniowane]], a neuron piramidowy ma dwa ich drzewa, szczytowe i podstawne (Spruston 2008)<!--[s:spruston2008-pyramidal-shape-dendritic-trees]-->. Kora mózgu też składa się z warstw, ale to warstwy komórek, numerowane od jej powierzchni, inne niż warstwy sztucznej sieci.

Receptor NMDA (od N-metylo-D-asparaginianu, cząsteczki, która go pobudza) to receptor błonowy przekaźnika glutaminianu, cząsteczki wydzielanej przez neuron. W neuronach myszy przepuszcza on pod wpływem tej samej dawki glutaminianu tym więcej jonów, im bardziej zdepolaryzowana jest błona, czyli im mniej ujemne jest wnętrze komórki względem otoczenia, a autorzy wiążą to z jonem magnezu, który przy napięciu spoczynkowym blokuje kanał tego receptora (Nowak i in. 1984)<!--[s:nowak1984-nmda-magnesium-voltage]-->. W neuronach piramidowych kory szczura pobudzenia dwóch bliskich synaps na tej samej cienkiej gałęzi dendrytu sumowały się nieliniowo, według krzywej w kształcie litery S, ale pobudzenia odległe albo leżące na różnych gałęziach sumowały się liniowo. Autorzy uznali to za pierwsze doświadczalne poparcie modelu, w którym neuron piramidowy scala pobudzenia jak dwuwarstwowa sieć: pierwszą warstwę tworzą cienkie gałęzie dendrytów, a drugą sumowanie w całej komórce (Polsky, Mel i Schiller 2004)<!--[s:polsky2004-same-branch-sigmoidal]--><!--[s:polsky2004-subunits-before-global-summation]-->. Shapira i współpracownicy uznają w przeglądzie stromą zależność receptorów NMDA od napięcia za jedno ze źródeł nieliniowej aktywności dendrytów ludzkich neuronów piramidowych warstw 2 i 3 (Shapira i in. 2025)<!--[s:shapira2025-nmda-voltage-nonlinearity]-->.

Beniaguev, Segev i London uczyli sztuczne sieci odtwarzać z dokładnością do milisekundy odpowiedzi szczegółowego modelu biofizycznego neuronu piramidowego z piątej warstwy kory. Potrzebna była sieć głęboka o pięciu do ośmiu warstwach przekształceń, ale po usunięciu z modelu receptorów NMDA wystarczała sieć z jedną warstwą ukrytą, czyli z dwiema warstwami przekształceń (Beniaguev, Segev i London 2021)<!--[s:beniaguev2021-five-to-eight-layers-nmda]-->.

Według przeglądu Shapiry i współpracowników w modelach ludzkich neuronów piramidowych warstw 2 i 3 dendryty tworzą wiele odrębnych odcinków, które przekształcają pobudzenia nieliniowo, każdy u siebie, zanim akson, główna wypustka neuronu prowadząca do kolejnych komórek, scali wynik. Modele takich neuronów wymagają głębszych sieci niż modele szczurze, a liczba warstw mierzy moc obliczeniową neuronu pod warunkiem przyjęcia założeń tej metody (Shapira i in. 2025)<!--[s:shapira2025-compartmentalized-nonlinear]--><!--[s:shapira2025-depth-index]-->.

Klasyczny [[Potencjał czynnościowy|potencjał czynnościowy]] przebiega według zasady wszystko albo nic: powstaje dopiero przy bodźcu progowym, czyli najsłabszym, który go wywołuje, a przy silniejszym ma tę samą wielkość. Gidon i współpracownicy znaleźli w żywej tkance ludzkiej kory, badanej poza organizmem, wapniowe potencjały czynnościowe w dendrytach neuronów piramidowych warstw 2 i 3. Nazywają je potencjałami czynnościowymi, ale ich wielkość, jak w potencjale stopniowanym, zależy od bodźca, tyle że odwrotnie: największa jest przy bodźcu progowym, a przy silniejszym maleje. Według autorów te dendrytyczne potencjały umożliwiają dendrytom pojedynczego neuronu obliczenie przypisywane dotąd sieciom wielowarstwowym (Gidon i in. 2020)<!--[s:gidon2020-graded-dcaap]-->. W szczegółowym modelu takiej komórki to obliczenie to operacja XOR (ang. exclusive or, alternatywa wykluczająca), do której sztuczna sieć potrzebuje co najmniej jednej warstwy ukrytej: dendryt szczytowy odpowiada potencjałem wapniowym na pobudzenie jednej z dwóch grup synaps, a przy pobudzeniu obu naraz milknie (Shapira i in. 2025)<!--[s:shapira2025-xor-in-model]-->.

Porównując swój mózg ze sztuczną siecią, za jednostkę bliższą sztucznemu neuronowi możesz więc uznać gałąź dendrytu, a za małą sieć cały neuron piramidowy. Kiedy czytasz to zdanie, [[Bioinformacja|bioinformacja]] z Twoich oczu dociera w końcu do dendrytów neuronów piramidowych Twojej kory, a jeśli działają one jak komórki i modele z tych badań, już pojedynczy dendryt odróżnia pobudzenie jednej grupy synaps od pobudzenia dwóch grup naraz. Z bioinformacji przekształcanej w takich dendrytach kształtują się Twoje [[Modele Mentalne|Modele Mentalne]] tego zdania, a polegasz na nich, kiedy rozumiesz je, zanim dojdziesz do kropki.
