---
tytuł: Reguła Hebba
osnowa: '[[Neuron i synapsa]]'
rodziny:
- '[[Plastyczność i połączenia]]'
głębokość:
- komórka
opis: 'Reguła Hebba (Hebbian rule) mówi, że połączenie komórki A z komórką B wzmacnia się, gdy A wielokrotnie bierze udział w pobudzaniu B. Pomiary w synapsach hipokampa pokazały, że liczy się kolejność: synapsa wzmacnia się, gdy potencjał czynnościowy neuronu presynaptycznego tuż wyprzedza potencjał czynnościowy neuronu postsynaptycznego, a słabnie przy odwrotnej kolejności. Zbieżność obu zdarzeń wykrywa receptor NMDA.'
myśl: 'Reguła Hebba uzupełniona o kolejność pobudzeń wzmacnia połączenie od komórki, która pobudza się wcześniej, więc można ją czytać jako uczenie [[Receptory jako predykcja komórki|predykcji]]: rośnie to, co zapowiada pobudzenie następnej komórki.'
sieci: []
bez_sieci: 'Plastyczność zależną od kolejności pobudzeń zmierzono w synapsach hipokampa szczura i myszy; ta karta schodzi do pojedynczej synapsy.'
ryciny: []
materiały:
- tytuł: 'Artem Kirsanov, Dendrites: Why Biological Neurons Are Deep Neural Networks'
  url: https://youtu.be/hmtQPrH-gC4?t=571
  czas: 9:31–10:46 (1:15)
- tytuł: 'Artem Kirsanov, A Brain-Inspired Algorithm For Memory'
  url: https://youtu.be/1WPJdAW-sFo?t=1261
  czas: 21:01–22:22 (1:21)
- tytuł: 'Bliss i Lømo 1973: długotrwałe wzmocnienie w zakręcie zębatym królika'
  url: https://doi.org/10.1113/jphysiol.1973.sp010273
- tytuł: 'Bi i Poo 1998: kolejność potencjałów czynnościowych a siła synapsy'
  url: https://doi.org/10.1523/JNEUROSCI.18-24-10464.1998
- tytuł: 'Martínez-Gallego i in. 2024: astrocyty w osłabianiu synaps'
  url: https://doi.org/10.7554/eLife.98031
rekordy:
- artem-kirsanov_dendrites-deep-networks_hmtQPrH-gC4
- artem-kirsanov_hopfield-networks_1WPJdAW-sFo
- martinez-gallego_et_al_2024
---
W 1973 roku Timothy Bliss i Terje Lømo drażnili u królików w znieczuleniu uretanem włókna drogi przeszywającej (perforant path), biegnące do zakrętu zębatego hipokampa. Po jednej lub kilku seriach szybkich bodźców odpowiedź komórek ziarnistych na pojedynczy bodziec pozostawała większa przez 30 minut do 10 godzin, u 15 z 18 królików (Bliss i Lømo 1973)<!--[s:bliss1973-ltp-perforant-path-rabbit]-->. Zjawisko nosi dziś nazwę długotrwałego wzmocnienia synaptycznego (long-term potentiation, LTP).

Donald Hebb zaproponował w 1949 roku, że gdy akson komórki A leży dość blisko komórki B, by ją pobudzać, a A wielokrotnie albo trwale bierze udział w jej pobudzaniu, w jednej z nich lub w obu zachodzi wzrost albo zmiana metaboliczna, która zwiększa skuteczność A (Hebb 1949)<!--[s:brown2021-hebb-postulate-1949]-->. Reguła ma kierunek od A do B, a Guo-qiang Bi i Mu-ming Poo zmierzyli go w hodowli neuronów hipokampa szczura: gdy neuron postsynaptyczny odpowiadał potencjałem czynnościowym w ciągu 20 ms po pobudzeniu presynaptycznym, synapsa trwale się wzmacniała, a gdy jego potencjał czynnościowy wyprzedzał pobudzenie presynaptyczne o mniej niż 20 ms, słabła (Bi i Poo 1998)<!--[s:bi1998-spike-timing-window]-->. Obie zmiany wymagały receptorów NMDA, a wzmocnienie pojawiało się tylko w synapsach o stosunkowo małej sile początkowej.

Przy potencjale spoczynkowym jon magnezu blokuje kanał receptora NMDA, a blokada słabnie stromo, gdy komórka się depolaryzuje (Nowak i in. 1984)<!--[s:nowak1984-nmda-magnesium-voltage]-->. Kanał przepuszcza więc jony, gdy w tej samej chwili receptor wiąże glutaminian z neuronu presynaptycznego, a błona neuronu postsynaptycznego jest zdepolaryzowana, choćby przez jego własny potencjał czynnościowy, który cofa się z aksonu w [[Neuron jako sieć głęboka|dendryty]]. Tak receptor NMDA wykrywa zbieżność, której wymaga reguła Hebba.

Reguła Hebba mówi o parze neuronów, a w zakręcie zębatym myszy osłabienie synapsy przy odwrotnej kolejności wymaga trzeciej komórki, astrocytu, czyli komórki [[Neuron i glej|glejowej]]. Po stu parach pobudzeń, w których neuron postsynaptyczny wyprzedzał presynaptyczny o 18 ms, synapsy drogi przeszywającej słabły do 59–63% siły wyjściowej, a spadek wymagał aktywności astrocytów i uwalnianego przez nie glutaminianu (Martínez-Gallego i in. 2024)<!--[s:martinezgallego2024-astrocyte-tltd]-->. Jeśli Twoje synapsy hipokampa działają jak szczurze i mysie, wzmacniają się w nich połączenia od komórek, które pobudzają się wcześniej, a słabną połączenia od komórek spóźnionych.
