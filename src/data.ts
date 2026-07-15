import type { ChatMessage, Exercise } from './types'

export const subjects = ['Matematica', 'Italiano', 'Grammatica', 'Storia', 'Geografia', 'Scienze', 'Fisica', 'Chimica', 'Inglese', 'Francese', 'Spagnolo', 'Informatica', 'Altro']
export const schoolLevels = ['Scuola primaria', 'Scuola secondaria di primo grado', 'Scuola secondaria di secondo grado', 'Università']

export const exercises: Exercise[] = [
  { id: 'equazione-primo-grado', title: 'Equazione di primo grado', subject: 'Matematica', topic: 'Equazioni', date: 'Oggi, 14:30', status: 'Parzialmente corretto', score: 72, favorite: true, review: true },
  { id: 'analisi-periodo', title: 'Analisi del periodo', subject: 'Italiano', topic: 'Proposizioni subordinate', date: 'Ieri, 17:15', status: 'Corretto', score: 92 },
  { id: 'moti-rettilinei', title: 'Problema sul moto rettilineo', subject: 'Fisica', topic: 'Cinematica', date: '10 lug, 16:40', status: 'Da rivedere', score: 48, review: true },
  { id: 'industrial-revolution', title: 'The Industrial Revolution', subject: 'Inglese', topic: 'Past simple', date: '8 lug, 18:05', status: 'Corretto', score: 88, favorite: true },
  { id: 'reazioni-chimiche', title: 'Bilanciamento di reazioni', subject: 'Chimica', topic: 'Stechiometria', date: '5 lug, 15:20', status: 'Parzialmente corretto', score: 67 },
]

export const initialMessages: ChatMessage[] = [
  { id: '1', role: 'assistant', text: 'Ciao Giulia! Ho ancora davanti la tua equazione. Il passaggio con il cambio di segno ti crea qualche dubbio? Possiamo ripartire proprio da lì, con calma.', time: '14:34' },
]

export const correctionSections = [
  { key: 'good', tone: 'green', title: 'Cosa hai fatto bene', summary: 'Hai impostato correttamente l’equazione e raccolto bene i termini simili.', body: 'Hai riconosciuto che le incognite devono stare da una parte e i termini noti dall’altra. Anche il calcolo 3x − x = 2x è corretto: è un ottimo punto di partenza.' },
  { key: 'errors', tone: 'red', title: 'Errori trovati', summary: 'Al passaggio 2 il termine +5 ha mantenuto lo stesso segno.', body: 'Hai scritto 2x = 9 + 5. Quando +5 passa al secondo membro deve diventare −5. Questo è il primo punto in cui nasce l’errore: si tratta di un errore di segno, non di ragionamento.' },
  { key: 'why', tone: 'orange', title: 'Perché è sbagliato', summary: 'Spostare un termine equivale a fare la stessa operazione su entrambi i membri.', body: 'Per eliminare +5 dal primo membro sottraiamo 5 da entrambi i lati. Per questo, a destra compare −5 e non +5.' },
  { key: 'tip', tone: 'blue', title: 'Suggerimento del professore', summary: 'Immagina i due membri come i piatti di una bilancia.', body: 'Ogni operazione fatta a sinistra va fatta anche a destra. Prova a scrivere “−5” sotto entrambi i membri prima di semplificare: riduce molto gli errori di segno.' },
  { key: 'method', tone: 'purple', title: 'Procedimento corretto', summary: 'Risolviamo l’equazione un passaggio alla volta.', body: '3x + 5 = x + 9\n3x − x = 9 − 5\n2x = 4\nx = 2' },
  { key: 'result', tone: 'green', title: 'Risultato finale', summary: 'La soluzione corretta è x = 2.', body: 'Verifica: 3 · 2 + 5 = 11 e 2 + 9 = 11. I due membri coincidono, quindi la soluzione è corretta.' },
]

export const demoOcr = {
  assignment: 'Risolvi la seguente equazione di primo grado e verifica il risultato: 3x + 5 = x + 9',
  answer: '3x + 5 = x + 9\n3x − x = 9 + 5\n2x = 14\nx = 7',
  notes: 'Verifica: 3 · 7 + 5 = 26; 7 + 9 = 16',
}
