import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../components/auth/auth-context'
import api from '@/api/api'

function Discussion() {
  const [question, setQuestion] = useState({})
  const [answerInput, setAnswerInput] = useState('')
  const [answers, setAnswers] = useState([])
  const { discussionId } = useParams()
  const { authStatus } = useContext(AuthContext)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/discussion/get-byid/${discussionId}`)
        setQuestion(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchAnswers = async () => {
      try {
        const response = await api.get(`/discussion/get-answers-user/${discussionId}`)
        setAnswers(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    
    fetchQuestion();
    fetchAnswers();
  }, [])

  const handleSendAnswer = async () => {
    if(!authStatus.authStatus) {
      alert('You must login first')
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    try {
      const response = await api.post('/discussion/create-answer', {
        answerTo: question.discussionId,
        content: answerInput,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        }
      })

      console.log(response)

      // Reset answer input state
      setAnswerInput('');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
        <div className="w-full bg-gray-300 mb-2 p-2 rounded-md">
            <h1 className="text-xl font-bold">Title : {question.title}</h1>
            <p>Content : {question.content}</p>
            <p>UserId : {question.userId}</p>
            <p>DiscussionId : {question.discussionId}</p>
            <p>Votes : {question.votes}</p>
            <p>Created At : {question.createdAt}</p>
            <p>Updated At : {question.updatedAt}</p>
        </div>

        {/* input for answering the question */}
        <div className="flex items-center">
          <input
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            type="text"
            placeholder="Jawab di sini, bang"
            className="border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full"
          />
          <button
            onClick={() => handleSendAnswer(null)}
            className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
          >
            Send
          </button>
        </div>

        {/* Answers section */}
        <div>
          {
            answers.map((answer) => (
              <div key={answer.discussionId} className="w-full bg-gray-300 mb-2 p-2 rounded-md">
                <p>UserId : {answer.userId}</p>
                <p>Username : {answer.name}</p>
                <p>Content : {answer.content}</p>
                <p>DiscussionId : {answer.discussionId}</p>
                <p>Votes : {answer.votes}</p>
                <p>Created At : {answer.createdAt}</p>
                <p>Updated At : {answer.updatedAt}</p>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Discussion