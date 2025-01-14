import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/api'

function Discussions() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/discussion/get-questions')
        setQuestions(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchQuestions()
  }, [])

  return (
    <div>
        {
            questions.map((question) => (
                <div key={question.discussionId} className="w-full bg-gray-300 mb-2 p-2 rounded-md">
                    <h1 className="text-xl font-bold">{question.title}</h1>
                    <p>{question.content}</p>
                    <Link to={`/discussions/${question.discussionId}`} className='text-blue-600 underline'>See discussion detail</Link>
                </div>
            ))
        }
    </div>
  )
}

export default Discussions