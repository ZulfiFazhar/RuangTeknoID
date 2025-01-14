import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/api/api'

function Discussion() {
  const [question, setQuestion] = useState({})
  const { discussionId } = useParams()
  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/discussion/get-byid/${discussionId}`)
        setQuestion(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchQuestion()
  }, [])

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
    </div>
  )
}

export default Discussion