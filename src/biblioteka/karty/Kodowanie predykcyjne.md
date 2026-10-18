---
tytuł: Kodowanie predykcyjne
osnowa: '[[Sieci mózgu i predykcja]]'
rodziny:
- '[[Predykcja]]'
głębokość:
- sieć mózgowa
- komórka
opis: 'Kodowanie predykcyjne (predictive coding) to model kory, w którym połączenia zwrotne niosą predykcje w stronę receptorów, a połączenia wstępujące niosą od receptorów zaskoczenie, czyli różnicę między predykcją a docierającą bioinformacją. Zaskoczenie aktualizuje predykcję. Model Rao i Ballarda odtwarza w symulowanych komórkach hamowanie na końcach: komórka słabnie, kiedy krótka kreska w jej polu recepcyjnym wydłuża się poza to pole.'
myśl: 'W modelu kodowania predykcyjnego połączenia zwrotne niosą predykcje w stronę receptorów, [[Połączenia wstępujące i zwrotne|połączenia wstępujące]] niosą od receptorów zaskoczenie, a zaskoczenie aktualizuje predykcje.'
sieci:
- kod: VIS
  powód: 'Model opisuje korę wzrokową, a komórki z hamowaniem na końcach, które wyjaśnia, są szczególnie liczne w jej warstwach 2 i 3 (Rao i Ballard 1999)<!--[s:rao1999-endstopping-defined]-->.'
bez_sieci: ''
ryciny: []
materiały:
- tytuł: 'Rao i Ballard 1999: model kodowania predykcyjnego kory wzrokowej'
  url: https://doi.org/10.1038/4580
- tytuł: 'Bastos i in. 2012: warstwy kory w kodowaniu predykcyjnym'
  url: https://doi.org/10.1016/j.neuron.2012.10.038
- tytuł: 'Friston 2010: zasada swobodnej energii'
  url: https://doi.org/10.1038/nrn2787
rekordy:
- rao_1999
- bastos_2012
- kanai_2015
---
Część komórek kory wzrokowej kota i małpy, dostrojonych do odcinków linii o określonej długości i szczególnie licznych w warstwach 2 i 3, ma własność nazwaną hamowaniem na końcach (endstopping): komórki te odpowiadają silnie na krótki odcinek o właściwym nachyleniu i słabną albo milkną, kiedy ta sama linia wydłuża się poza ich pole recepcyjne (receptive field), czyli fragment pola widzenia, na który komórka odpowiada (Rao i Ballard 1999)<!--[s:rao1999-endstopping-defined]-->. Więcej bodźca daje tu mniej aktywności.

Ten paradoks wyjaśnia model kory wzrokowej, w którym obszar dalszy od [[Odległość od receptorów|receptorów]] wysyła połączeniami zwrotnymi (feedback) predykcję (prediction) aktywności obszaru bliższego receptorom, a połączenia wstępujące (feedforward) odsyłają zaskoczenie (prediction error), czyli różnicę między predykcją a rzeczywistą aktywnością (Rao i Ballard 1999)<!--[s:rao1999-feedback-predictions-feedforward-errors]-->. Zaskoczenie aktualizuje predykcję. Na zdjęciach przyrody, na których uczył się model, krótka kreska zwykle należy do dłuższej, więc kreskę ciągnącą się poza pole recepcyjne predykcja obejmuje dzięki otoczeniu, z zaskoczeniem bliskim zera (Rao i Ballard 1999)<!--[s:rao1999-long-bar-predicted-from-context]-->. Po odcięciu połączeń zwrotnych hamowanie na końcach zostało w 5 z 28 modelowych komórek, które je wcześniej miały (Rao i Ballard 1999)<!--[s:rao1999-long-bar-predicted-from-context]-->.

W ujęciu Fristona kodowanie predykcyjne to szczególny przypadek szerszej zasady [[Swobodna energia u Fristona|swobodnej energii]], który z niej wynika przy jednym z jej założeń (Friston 2010)<!--[s:friston2010-laplace-free-energy-prediction-error]-->.

Jeśli Twoja kora wzrokowa działa tak jak ten model, krawędź stołu ciągnąca się przez całe pole widzenia budzi w pierwszorzędowej korze wzrokowej (V1) mniejsze zaskoczenie niż jej urwany kawałek, bo ciągłą krawędź obejmuje predykcja z obszarów dalszych od receptorów. To, jak mocno urwany kawałek aktualizuje predykcję, zależy od [[Wzmocnienie zaskoczenia|wzmocnienia]], czyli czułości komórek przekazujących zaskoczenie dalej od receptorów (Kanai i in. 2015)<!--[s:kanai2015-gain-of-prediction-errors]-->.
