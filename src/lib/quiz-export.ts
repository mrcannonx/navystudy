interface QuizResult {
  questionId: string
  correct: boolean
  question: string
  selectedAnswer: string
  correctAnswer: string
  explanation: string
}

export function exportQuizResults(
  title: string,
  score: number,
  totalQuestions: number,
  timeSpent: number,
  results: QuizResult[]
) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const date = new Date().toLocaleDateString()
  
  const csvContent = [
    ['Quiz Results'],
    ['Title', title],
    ['Date', date],
    ['Score', `${score}/${totalQuestions} (${percentage}%)`],
    ['Time Spent', `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s`],
    [''],
    ['Question', 'Your Answer', 'Correct Answer', 'Result', 'Explanation']
  ]

  results.forEach(result => {
    csvContent.push([
      result.question,
      result.selectedAnswer,
      result.correctAnswer,
      result.correct ? 'Correct' : 'Incorrect',
      result.explanation
    ])
  })

  const csv = csvContent
    .map(row => 
      row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(',')
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results_${date.replace(/\//g, '-')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 