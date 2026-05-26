# Aktualizacja Skilla Pisania

Wklej tę wiadomość do rozmowy z AI, w której piszesz ze swoim skillem. Wklej ją kiedy skończysz pisać i poprawiać. Napisz "aktualizuj" i poczekaj na wynik.

---

Przeczytaj całą dotychczasową rozmowę. Na jej początku jest skill pisania, który student wkleił. Reszta to rozmowa, w której student pisał z tym skillem i poprawiał wyniki. Twoim zadaniem jest przeanalizować tę rozmowę, znaleźć wzorce w poprawkach studenta i wygenerować zaktualizowany skill. Bez pytania. Bez sugerowania. Robisz to i pokazujesz wynik.

## Procedura

### Analiza

Przeczytaj całą rozmowę od początku. Znajdź KAŻDY moment, w którym student:

- **Poprawia** tekst AI (zmienia słowa, przeformułowuje, skraca, wydłuża)
- **Odrzuca** fragment (usuwa, ignoruje, prosi o przepisanie)
- **Dodaje** coś, czego AI nie napisało
- **Zmienia podejście** ("napisz inaczej", "bardziej formalnie", "krócej")
- **Akceptuje bez komentarza** (cisza = skill trafił)
- **Waha się** (przyjmuje z zastrzeżeniem, wraca później)

### Wzorce

Pogrupuj obserwacje we wzorce. Wzorzec = powtarzający się kierunek, nie pojedyncza poprawka.

Przykład: student w trzech różnych miejscach skraca zdania AI z 20+ słów do 10-12 słów. To nie trzy poprawki. To jeden wzorzec: "preferuje krótsze zdania niż AI domyślnie generuje."

### Klasyfikacja

Dla każdego wzorca sam zdecyduj:

- **Stały ślad:** konsekwentna preferencja, niezależna od tematu. Wchodzi do skilla.
- **Jednorazowy ślad:** poprawka specyficzna dla tego tekstu. Nie wchodzi.
- **Brakujący ślad:** student potrzebuje czegoś, czego skill nie ma. Nowa instrukcja.

Nie pytaj studenta o klasyfikację. Decydujesz sam. Jeśli wzorzec pojawia się raz, to jednorazowy. Jeśli dwa razy lub więcej, to stały. Jeśli student prosi o coś, czego skill nie pokrywa, to brakujący.

Przykłady klasyfikacji:

**Stały:** Student skraca 4 zdania w 3 różnych akapitach. Zawsze do 10-12 słów. Wzorzec niezależny od tematu → stały. Do skilla trafia: "Pisz zdania do 12 słów."

**Jednorazowy:** Student zmienia tytuł z "Wprowadzenie" na "Jak to działa". Jedna zmiana, specyficzna dla tego tekstu. Nic nie trafia do skilla.

**Brakujący:** Student pisze "dodaj źródła na końcu". Skill nie ma instrukcji o cytatach. Nowa zasada: "Na końcu tekstu podaj 2-3 źródła."

### Raport

Pokaż studentowi, co znalazłeś. Krótko, konkretnie. Dla każdego wzorca podaj:

- Nazwa wzorca
- Cytaty z rozmowy (co student napisał, co AI napisało, co student zmienił)
- Klasyfikacja (stały / jednorazowy / brakujący)
- Co zmienia się w skillu (albo: nic, bo jednorazowy)

Przykład wpisu w raporcie:

> **Skracanie zdań** (stały)
> AI napisało: "Warto zauważyć, że w kontekście współczesnych badań nad sztuczną inteligencją, kluczową rolę odgrywa..." Student skrócił do: "Kluczowa jest rola..." Powtarza się 4 razy w rozmowie.
> → Do skilla: instrukcja "Pisz zdania do 12 słów" + przykład w sekcji Przykłady.

Jeśli poprawek jest mało (1-3), powiedz to wprost: "Mało poprawek. Skill albo już dobrze pasuje, albo test był za płytki. Spróbuj napisać coś trudniejszego: temat zupełnie nowy. Tam pojawią się szczeliny."

### Aktualizacja

Bezpośrednio po raporcie wygeneruj KOMPLETNY zaktualizowany skill. Nie czekaj na potwierdzenie. Zachowaj całą strukturę i treść oryginalnego skilla. Zmieniaj TYLKO to, co wzorce uzasadniają. Nałóż stałe ślady i brakujące ślady. Jednorazowe pomiń.

Sekcje do aktualizacji:

- **Styl pisania** -- nowe instrukcje behawioralne wynikające ze wzorców. Nie przymiotniki ("Bądź zwięzły") ale zachowania ("Pisz zdania do 12 słów"). Każda instrukcja opisuje przestrzeń dobrego pisania, nie krok do wykonania. Opisuj JAK wygląda dobry tekst, nie CO model ma robić punkt po punkcie.
- **Przykłady** -- najważniejsza sekcja. Napisz 2-3 fragmenty w stylu, który student POKAZAŁ swoimi poprawkami. Nie w stylu, który AI preferuje. Każdy przykład to 2-3 zdania demonstrujące konkretny aspekt stylu. Jeśli student skraca, przykłady muszą być krótkie. Jeśli dodaje metafory, przykłady muszą je zawierać. Przykład bez kontekstu jest bezużyteczny: dodaj krótką etykietę ("ton formalny:", "otwarcie posta:").
- **Czego unikać** -- każdy punkt to konkretne zachowanie + przykład złego outputu. Nie "Nie bądź banalny" ale: "Nie zaczynaj akapitów od 'Warto zauważyć, że' ani 'W kontekście'. Przykład złego otwarcia: 'Warto zauważyć, że w dzisiejszych czasach...' Przykład dobrego: 'Trzy rzeczy się zmieniły.'" Repellent bez przykładu jest abstrakcją.
- **Granice** -- zmień, jeśli wzorce pokazują użycie poza zakresem. Mało granic, ale twarde.
- **Zasady** -- dodaj zasady trzymające nowe instrukcje w ryzach. Zasada musi być testowalna: "Pisz zdania do 12 słów" można zweryfikować, "Bądź zwięzły" nie.
- **Historia zmian** -- dopisz wpis z numerem wersji, liczbą wzorców i głównymi zmianami.

Jeśli skill nie ma sekcji "Przykłady", "Czego unikać", "Granice" lub "Historia zmian", dodaj je. Wypełnij na podstawie wzorców.

Format:

```
---SKILL PISANIA v[N+1]---

[cała zawartość zaktualizowanego skilla]

## Historia zmian
[Wszystkie poprzednie wpisy]
Wersja [N+1]: aktualizacja na podstawie [liczba] wzorców. Główne zmiany: [lista 2-3 najważniejszych zmian].

---KONIEC---
```

Numeracja rośnie: v1 → v2 → v3. Jeśli skill nie ma numeru wersji, traktuj go jako v1.

Na końcu:

"Skill zaktualizowany. Skopiuj WSZYSTKO między ---SKILL PISANIA v[N+1]--- a ---KONIEC--- i zapisz jako nowy plik. Następnym razem: wklej nową wersję, pisz, poprawiaj, wklej tę instrukcję ponownie."

Jeśli student chce coś zmienić w wygenerowanym skillu -- maksymalnie 2 rundy korekty.

## Czego nie robić

- **Nie generuj nowego skilla od zera.** Aktualizujesz istniejący. Każde zdanie oryginału, którego wzorce nie dotyczą, zostaje bez zmian.
- **Nie dodawaj zasad, których wzorce nie uzasadniają.** Jeśli student nie poprawiał długości zdań, nie dodawaj zasady o długości zdań. Każda zmiana musi mieć dowód w rozmowie.
- **Nie klasyfikuj jednorazowych poprawek jako stałych.** Jedna zmiana to za mało. Potrzebujesz powtórzenia.
- **Nie pisz nowych Przykładów w stylu AI.** Przykłady muszą odzwierciedlać styl, który student POKAZAŁ poprawkami, nie styl, który AI preferuje.

## Zasady

- Mów po polsku. Jeśli student pisze po angielsku, przełącz się na angielski.
- Każda obserwacja oparta na KONKRETNYCH cytatach z rozmowy. Nie interpretacje -- dowody.
- Skill wyjściowy KOMPLETNY. Student kopiuje i zapisuje. Nie "zmień punkt 3" -- pełny nowy plik.
- Jednorazowe ślady NIE wchodzą do skilla.
- Nie tłumacz, jak działa AI.
- Nie pytaj o pozwolenie. Pracuj i pokaż wynik.
- Sekcja "Historia zmian" rośnie. Nie usuwaj poprzednich wpisów.
