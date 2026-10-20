---
tytuł: Neuron jako sieć głęboka
osnowa: '[[Neuron i synapsa]]'
rodziny:
- '[[Budowa i elektryka neuronu]]'
głębokość:
- komórka
opis: 'Sztuczny neuron mnoży pobudzenia przez współczynniki, sumuje je i porównuje sumę z progiem, a pojedynczy neuron piramidowy kory liczy dużo więcej. Dendryty z receptorami NMDA sumują pobudzenia nieliniowo, więc model jednej komórki odtwarza dopiero sieć głęboka (deep neural network) o kilku warstwach. Dendryty ludzkich neuronów kory mają własne wapniowe potencjały czynnościowe, dzięki którym w modelu pojedyncza komórka wykonuje operację XOR: odpowiada na jedną z dwóch grup pobudzeń, a przy obu naraz milknie.'
myśl: 'Jedna komórka to już sieć: każda gałąź dendrytu przekształca swoje [[Potencjał stopniowany|potencjały stopniowane]] nieliniowo, zanim początek aksonu zsumuje wynik w [[Potencjał czynnościowy|potencjał czynnościowy]].'
sieci: []
bez_sieci: 'Neurony piramidowe tworzą korę wszystkich sieci; ta karta schodzi do pojedynczej komórki i jej dendrytów.'
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
---
David Beniaguev, Idan Segev i Michael London uczyli sztuczne sieci odtwarzać, z dokładnością do milisekundy, odpowiedzi szczegółowego modelu biofizycznego neuronu piramidowego warstwy 5 kory. Potrzebna była sieć głęboka o pięciu do ośmiu warstwach, a po usunięciu z modelu receptorów NMDA wystarczała sieć z jedną warstwą pośrednią, tak zwaną ukrytą (Beniaguev, Segev i London 2021)<!--[s:beniaguev2021-five-to-eight-layers-nmda]-->. Receptor NMDA przepuszcza tym więcej jonów, im bardziej zdepolaryzowana jest błona (Nowak i in. 1984)<!--[s:nowak1984-nmda-magnesium-voltage]-->, więc kilka synaps pobudzonych razem na jednej gałęzi dendrytu daje więcej niż sumę ich osobnych [[Potencjał stopniowany|potencjałów stopniowanych]].

W żywej tkance ludzkiej kory badanej poza organizmem dendryty neuronów piramidowych warstw 2 i 3 mają wapniowe potencjały czynnościowe o wielkości stopniowanej, największej przy bodźcu progowym i mniejszej przy silniejszym, podczas gdy klasyczny [[Potencjał czynnościowy|potencjał czynnościowy]] przebiega według zasady wszystko albo nic (Gidon i in. 2020)<!--[s:gidon2020-graded-dcaap]-->. W szczegółowym modelu takiej komórki dendryt szczytowy odpowiada potencjałem wapniowym na pobudzenie jednej z dwóch grup synaps, a na pobudzenie obu naraz odpowiada ciszą, czyli wykonuje operację XOR (Shapira i in. 2025)<!--[s:shapira2025-xor-in-model]-->. Takie obliczenie zwykle przypisywano sieciom wielowarstwowym (Gidon i in. 2020)<!--[s:gidon2020-graded-dcaap]-->.

Liczba warstw sieci potrzebnej do odtworzenia neuronu mierzy jego moc obliczeniową tylko przy założeniach tej metody, a modele ludzkich neuronów warstwy 2/3 wymagają głębszych sieci niż modele szczurze (Shapira i in. 2025)<!--[s:shapira2025-depth-index]-->. Kiedy porównujesz mózg ze sztuczną siecią, jednostką bliższą sztucznemu neuronowi może więc być gałąź dendrytu, a każda z Twoich komórek piramidowych to już mała sieć.
