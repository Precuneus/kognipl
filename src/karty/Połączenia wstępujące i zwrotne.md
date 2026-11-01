---
tytuł: Połączenia wstępujące i zwrotne
osnowa: '[[Sieci mózgu i predykcja]]'
rodziny:
- '[[Anatomia mózgu]]'
- '[[Predykcja]]'
sieci: []
bez_sieci: 'Połączenia wstępujące i zwrotne łączą obszary kory w każdej sieci, więc dotyczą wszystkich sieci naraz. Reguły ich warstw Markov i współpracownicy podsumowują dla obszarów wzrokowych makaka blisko pierwszorzędowej kory wzrokowej (Markov i in. 2014)<!--[s:markov2014-supragranular-ff-infragranular-fb]-->.'
ryciny: []
materiały:
- tytuł: 'Bastos i in. 2012: warstwy kory w kodowaniu predykcyjnym'
  url: https://doi.org/10.1016/j.neuron.2012.10.038
- tytuł: 'Markov i in. 2014: warstwy połączeń wstępujących i zwrotnych u makaka'
  url: https://doi.org/10.1002/cne.23458
- tytuł: 'Felleman i Van Essen 1991: połączenia między obszarami kory makaka'
  url: https://doi.org/10.1093/cercor/1.1.1
rekordy:
- bastos_2012
- van_kerkoerle_2014
stan: gotowa
---
Połączenia wstępujące (ang. feedforward) i zwrotne (ang. feedback) to [[Neuron i glej|aksony]], główne wypustki neuronów, łączące obszary kory w dwóch kierunkach. Wstępujące biegną od obszaru bliższego [[Odległość od receptorów|receptorom]] do obszaru dalszego, a zwrotne od dalszego do bliższego.

Kora składa się z warstw komórek numerowanych od jej powierzchni. Warstwy powierzchowne to 2 i 3, a głębokie to 5 i 6. [[Bioinformacja|Bioinformacja]] ze wzgórza (ang. thalamus), skupiska neuronów w głębi mózgu, dociera głównie do warstwy 4. W pierwszorzędowej korze wzrokowej (V1) to bioinformacja z ciała kolankowatego bocznego, części wzgórza (Bastos i in. 2012; van Kerkoerle i in. 2014)<!--[s:bastos2012-layer-names-l4-thalamic]--><!--[s:vankerkoerle2014-lgn-layer4-feedback-avoids]-->.

Bioinformacja z oka dociera do kory w V1, w tylnej części mózgu, więc połączenia biegnące od V1 ku przodowi mózgu biegną dalej od receptorów. Markov i współpracownicy podsumowują wcześniejsze badania obszarów wzrokowych makaka, małpy z rodzaju Macaca, położonych blisko V1. Połączenia biegnące tam ku przodowi mózgu wychodzą głównie z komórek warstw powierzchownych i kończą się w warstwie 4 obszaru docelowego, a połączenia biegnące ku tyłowi, w stronę V1, wychodzą głównie z warstw głębokich i kończą się poza warstwą 4 (Markov i in. 2014)<!--[s:markov2014-supragranular-ff-infragranular-fb]-->. Pierwsze to połączenia wstępujące, drugie zwrotne, a ich układ w warstwach to reguła warstw.

Felleman i Van Essen ułożyli z reguły warstw porządek obszarów wzrokowych makaka, który zaczyna się w siatkówce i ciele kolankowatym bocznym, a kończy w korze śródwęchowej i hipokampie. Około 10% dróg odbiega w nim od schematu (Felleman i Van Essen 1991)<!--[s:felleman1991-laminar-hierarchy]-->. Jak podają Markov i współpracownicy, ponowna analiza tych samych danych, przeprowadzona przez Hilgetaga i współpracowników, potwierdziła wyraźny porządek obszarów, ale bez miary odległości dopuszczała 150 000 równie prawdopodobnych rozmieszczeń w tym porządku. Markov i współpracownicy mierzą więc odległość w tym porządku ciągłą miarą. Wstrzykują do jednego obszaru znacznik wsteczny (ang. retrograde tracer), który wędruje aksonami do ciał komórek wysyłających tam połączenia. Potem liczą, jaki odsetek oznaczonych komórek każdego innego obszaru leży w warstwach powierzchownych. Według reguły warstw im większy ten odsetek, tym wyraźniej połączenie jest wstępujące: 100% oznacza połączenie czysto wstępujące, a 0% czysto zwrotne (Markov i in. 2014)<!--[s:markov2014-sln-hierarchical-distance]--><!--[s:markov2014-sln-100-ff-0-fb]-->.

[[Kodowanie predykcyjne]] (ang. predictive coding) to model kory, w którym obszar dalszy od receptorów wysyła do bliższego predykcję jego aktywności. Obszar bliższy odsyła mu zaskoczenie (ang. prediction error), czyli różnicę między predykcją a swoją aktywnością. Według Bastosa i współpracowników komórki piramidowe (neurony o ciele w kształcie piramidy) warstw powierzchownych wysyłają w tym modelu dalej od receptorów zaskoczenie, a komórki piramidowe warstw głębokich w stronę receptorów predykcje. Autorzy sami nazywają to przypisanie spekulacją, a regułę warstw uproszczeniem (Bastos i in. 2012)<!--[s:bastos2012-superficial-errors-deep-predictions]--><!--[s:bastos2012-laminar-origin-ff-fb]-->.

[[Rytmy alfa i gamma|Rytm]] to cykliczne wahanie aktywności wielu komórek naraz. W paśmie gamma jest szybki, około 40–90 herców (Hz), czyli cykli na sekundę, a w paśmie alfa wolny, około 5–15 Hz. Zapis naraz z V1 i z czwartego obszaru wzrokowego (V4), leżącego dalej od receptorów, pokazał u makaka, że gamma rozchodzi się wzdłuż połączeń wstępujących, a alfa wzdłuż zwrotnych. Potwierdziło to słabe drażnienie elektryczne (ang. microstimulation) każdego z obszarów: drażnienie V1 wywoływało gammę w V4, a drażnienie V4 alfę w V1 (van Kerkoerle i in. 2014)<!--[s:vankerkoerle2014-alpha-gamma-bands]--><!--[s:vankerkoerle2014-gamma-ff-alpha-fb]-->. Kierunek połączeń mogą więc zdradzać także rytmy alfa i gamma.

Kiedy patrzysz na kubek, bioinformacja z Twojej siatkówki dociera przez ciało kolankowate boczne do warstwy 4 Twojej V1, a stamtąd płynie połączeniami wstępującymi do obszarów dalszych od receptorów. Jeśli Twoja kora działa tak jak model Bastosa i współpracowników, w tym samym czasie połączeniami zwrotnymi płyną w stronę V1 predykcje z Twoich [[Modele Mentalne|Modeli Mentalnych]] kubka. W tym modelu połączeniami wstępującymi płynie dalej ta część bioinformacji, która różni się od predykcji: zaskoczenie, które te predykcje aktualizuje.
